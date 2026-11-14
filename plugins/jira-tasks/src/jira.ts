import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { avatarUrl } from './avatar';
import { childJql, optionAccumulator } from './child-query';
import { extractDescription } from './description';
import type {
  Connection,
  JiraTask,
  TaskFilter,
  TaskPage,
  ChildQueryInput,
  ChildPage,
} from './protocol';

const LIMIT = 100;
const FILTERS = new Set(['assigned', 'reported', 'all', 'done']);
type Run = (args: string[], signal?: AbortSignal) => Promise<unknown>;
type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid Jira response.');
  return value as RecordValue;
}
function text(value: unknown, limit = 1000): string {
  return typeof value === 'string' ? value.slice(0, limit) : '';
}
function optional(value: unknown): RecordValue {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as RecordValue)
    : {};
}
function siteId(value: unknown): asserts value is string {
  if (
    typeof value !== 'string' ||
    !/^[A-Za-z0-9_][A-Za-z0-9_-]{0,199}$/.test(value)
  )
    throw new Error('Invalid Jira site.');
}
function safeUrl(value: unknown): string {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' && !url.username && !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
}
export function normalizeTask(value: unknown, detail = false): JiraTask {
  const row = record(value);
  const body = extractDescription(detail ? row.description : '');
  const description = body.text.slice(0, 24000);
  const parent = optional(row.parent);
  const parentKey = text(parent.key, 100);
  return {
    key: text(row.key, 100),
    title: text(row.title, 240),
    url: safeUrl(row.url),
    project: text(optional(row.project).key, 100),
    status: text(optional(row.status).name, 100),
    category: text(optional(row.status).categoryKey, 100),
    issueType: {
      name: text(optional(row.issueType).name, 100),
      subtask: optional(row.issueType).subtask === true,
    },
    assignee: text(optional(row.assignee).displayName, 200),
    assigneeId: text(optional(row.assignee).accountId, 200),
    assigneeAvatarUrl: avatarUrl(optional(row.assignee).avatarUrl),
    reporter: {
      name: text(optional(row.reporter).displayName, 200),
      avatarUrl: avatarUrl(optional(row.reporter).avatarUrl),
    },
    priority: text(optional(row.priority).name, 100),
    updatedAt: text(row.updatedAt, 100),
    description,
    descriptionTruncated: body.text.length > description.length,
    images: body.images,
    parent: /^[A-Z][A-Z0-9_]*-\d+$/.test(parentKey)
      ? {
          key: parentKey,
          title: text(parent.title, 240),
          issueTypeName: text(parent.issueTypeName, 100),
        }
      : null,
  };
}
export function cliExecutable(): string {
  if (process.env.ORCA_CLI_COMMAND) return process.env.ORCA_CLI_COMMAND;
  if (
    process.platform === 'darwin' &&
    existsSync('/Applications/Orca.app/Contents/Resources/bin/orca')
  )
    return '/Applications/Orca.app/Contents/Resources/bin/orca';
  return process.platform === 'linux' ? 'orca-ide' : 'orca';
}
export const runCli: Run = (args, signal) =>
  new Promise((resolve, reject) => {
    execFile(
      cliExecutable(),
      ['jira', ...args, '--environment', 'local', '--json'],
      {
        timeout: 25000,
        maxBuffer: 8 * 1024 * 1024,
        signal,
        windowsHide: true,
      },
      (error, stdout) => {
        let answer: RecordValue;
        try {
          answer = record(JSON.parse(stdout));
        } catch {
          const code = (error as NodeJS.ErrnoException | null)?.code;
          reject(
            new Error(
              code === 'ENOENT'
                ? 'Orca CLI was not found. Update or reinstall Orca.'
                : signal?.aborted
                  ? 'Request cancelled.'
                  : 'Could not read Jira. Check the Orca connection and try again.',
            ),
          );
          return;
        }
        if (error || answer.ok !== true) {
          const code = text(optional(answer.error).code, 100);
          reject(
            new Error(
              `Jira request failed${code ? ` (${code})` : ''}. Check the Jira connection in Orca Tasks.`,
            ),
          );
        } else resolve(answer.result);
      },
    );
  });
export function createJiraClient(run: Run = runCli) {
  return {
    async connection(signal?: AbortSignal): Promise<Connection> {
      const result = record(await run(['connection'], signal));
      const sites = Array.isArray(result.sites)
        ? result.sites.map((value) => {
            const site = record(value);
            siteId(site.id);
            return {
              id: site.id,
              siteUrl: safeUrl(site.siteUrl),
              email: text(site.email, 200),
            };
          })
        : [];
      const selected = text(result.selectedSiteId || result.activeSiteId, 200);
      return {
        sites,
        selectedSiteId: sites.some((s) => s.id === selected)
          ? selected
          : (sites[0]?.id ?? null),
      };
    },
    async list(
      input: { siteId: string; filter: TaskFilter },
      signal?: AbortSignal,
    ): Promise<TaskPage> {
      siteId(input?.siteId);
      if (!FILTERS.has(input.filter)) throw new Error('Invalid Jira filter.');
      const rows = await run(
        [
          'list',
          '--site',
          input.siteId,
          '--filter',
          input.filter,
          '--limit',
          String(LIMIT),
        ],
        signal,
      );
      if (!Array.isArray(rows)) throw new Error('Invalid Jira task list.');
      return {
        tasks: rows.slice(0, LIMIT).map((row) => normalizeTask(row)),
        limitReached: rows.length >= LIMIT,
      };
    },
    async children(
      input: ChildQueryInput,
      signal?: AbortSignal,
    ): Promise<ChildPage> {
      siteId(input?.siteId);
      if (
        typeof input.key !== 'string' ||
        !/^[A-Z][A-Z0-9_]*-\d+$/.test(input.key) ||
        input.key.length > 100
      )
        throw new Error('Invalid Jira issue key.');
      if (
        input.includeOptions !== undefined &&
        typeof input.includeOptions !== 'boolean'
      )
        throw new Error('Invalid child query options.');
      const rows = await run(
        [
          'search',
          childJql(input),
          '--site',
          input.siteId,
          '--limit',
          String(LIMIT),
        ],
        signal,
      );
      if (!Array.isArray(rows))
        throw new Error('Invalid Jira child task list.');
      const result: ChildPage = {
        tasks: rows.slice(0, LIMIT).map((row) => normalizeTask(row)),
        limitReached: rows.length >= LIMIT,
      };
      if (input.includeOptions) {
        const options = optionAccumulator();
        options.add(result.tasks);
        let limited = true;
        for (let attempt = 0; attempt < 8; attempt++) {
          let found: unknown;
          try {
            found = await run(
              [
                'search',
                options.unseenJql(input.key),
                '--site',
                input.siteId,
                '--limit',
                String(LIMIT),
              ],
              signal,
            );
          } catch (error) {
            if (signal?.aborted) throw error;
            break;
          }
          if (!Array.isArray(found)) break;
          if (!found.length) {
            limited = false;
            break;
          }
          const before = JSON.stringify(options.result(false));
          options.add(found.map((row) => normalizeTask(row)));
          if (before === JSON.stringify(options.result(false))) break;
        }
        result.options = options.result(limited);
      }
      return result;
    },
    async issue(
      input: { siteId: string; key: string },
      signal?: AbortSignal,
    ): Promise<JiraTask> {
      siteId(input?.siteId);
      if (
        typeof input.key !== 'string' ||
        !/^[A-Z][A-Z0-9_]*-\d+$/.test(input.key) ||
        input.key.length > 100
      )
        throw new Error('Invalid Jira issue key.');
      return normalizeTask(
        await run(['issue', input.key, '--site', input.siteId], signal),
        true,
      );
    },
  };
}

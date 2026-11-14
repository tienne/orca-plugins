import { execFile } from 'node:child_process';
import { cliExecutable } from './jira';

type OpenResult = { ok: boolean; error?: { code?: string; message?: string } };
type Open = (key: string, signal: AbortSignal) => Promise<OpenResult>;

export function parseOpenResponse(
  stdout: string,
  executionError: {
    code?: unknown;
    signal?: unknown;
    killed?: boolean;
  } | null = null,
): OpenResult {
  if (
    executionError &&
    (executionError.killed ||
      executionError.signal ||
      typeof executionError.code !== 'number' ||
      ![1, 2, 3].includes(executionError.code))
  )
    throw new Error('The Orca CLI did not finish normally.');
  const answer = JSON.parse(stdout);
  if (typeof answer?.ok !== 'boolean' || (executionError && answer.ok))
    throw new Error('Invalid plugin open response.');
  if (
    answer.error?.code === 'plugin_not_found' &&
    executionError &&
    executionError.code !== 1
  )
    throw new Error('Inconsistent plugin not-found response.');
  return answer;
}

const runOpen: Open = (key, signal) =>
  new Promise((resolve, reject) => {
    execFile(
      cliExecutable(),
      [
        'plugin',
        'open',
        key,
        '--panel',
        'jira-tasks',
        '--environment',
        'local',
        '--json',
      ],
      { signal, timeout: 10000, maxBuffer: 512 * 1024, windowsHide: true },
      (error, stdout) => {
        try {
          resolve(parseOpenResponse(stdout, error));
        } catch {
          reject(
            new Error(
              'Could not open Jira Tasks. Check that Orca is running and a workspace is open.',
            ),
          );
        }
      },
    );
  });

export async function openPanel(
  signal: AbortSignal,
  open: Open = runOpen,
): Promise<void> {
  signal.throwIfAborted();
  let result = await open('tienne.jira-tasks', signal);
  // 공개 설치가 없을 때만 로컬 개발 패널을 사용하며 권한·실행 오류는 우회하지 않는다.
  if (!result.ok && result.error?.code === 'plugin_not_found') {
    signal.throwIfAborted();
    result = await open('local.jira-tasks', signal);
  }
  signal.throwIfAborted();
  if (!result.ok)
    throw new Error(
      result.error?.message ||
        'Could not open Jira Tasks. Open a workspace and try again.',
    );
}

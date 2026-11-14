// plugins/jira-tasks/src/open-panel.ts
import { execFile as execFile2 } from "node:child_process";

// plugins/jira-tasks/src/jira.ts
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";

// plugins/jira-tasks/src/avatar.ts
var MAX_BYTES = 64 * 1024;
function avatarUrl(value) {
  if (typeof value !== "string" || value.length > 2e3) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port || !/^avatar-management--avatars\.[a-z0-9-]+\.prod\.public\.atl-paas\.net$/.test(
      url.hostname
    ))
      return "";
    return url.href;
  } catch {
    return "";
  }
}
function createAvatarLoader(fetchImage = fetch) {
  const cache = /* @__PURE__ */ new Map();
  return async (input, signal) => {
    const url = avatarUrl(input?.url);
    if (!url) return null;
    const cached = cache.get(url);
    if (cached && cached.expires > Date.now()) return cached.result;
    if (cache.size >= 100) cache.delete(cache.keys().next().value);
    const result = (async () => {
      try {
        const response = await fetchImage(url, {
          redirect: "error",
          credentials: "omit",
          signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(5e3)]) : AbortSignal.timeout(5e3)
        });
        if (!response.ok || !response.body) return null;
        if (Number(response.headers.get("content-length")) > MAX_BYTES) {
          await response.body.cancel();
          return null;
        }
        const reader = response.body.getReader();
        const chunks = [];
        let size = 0;
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          size += part.value.byteLength;
          if (size > MAX_BYTES) {
            await reader.cancel();
            return null;
          }
          chunks.push(part.value);
        }
        const bytes = Buffer.concat(chunks);
        const mime = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? "image/png" : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? "image/jpeg" : bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP" ? "image/webp" : "";
        return mime ? `data:${mime};base64,${bytes.toString("base64")}` : null;
      } catch {
        return null;
      }
    })();
    cache.set(url, { expires: Date.now() + 5 * 60 * 1e3, result });
    return result;
  };
}

// plugins/jira-tasks/src/child-query.ts
function quoteJql(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
function values(value, max) {
  if (value === void 0) return [];
  if (!Array.isArray(value) || value.length > max || value.some(
    (item) => typeof item !== "string" || !item || item.length > 200 || /[\x00-\x1f]/.test(item)
  ))
    throw new Error("Invalid child issue query.");
  return [...new Set(value)];
}
function childJql(input) {
  const clauses = [`parent = ${quoteJql(input.key)}`];
  const search = input.search ?? "";
  if (typeof search !== "string" || search.length > 200 || /[\x00-\x1f]/.test(search))
    throw new Error("Invalid child search.");
  if (search.trim()) {
    const term = search.trim();
    if (/^[a-z][a-z0-9_]*-\d+$/i.test(term))
      clauses.push(`key = ${quoteJql(term.toUpperCase())}`);
    else {
      const words = term.replace(/[+\-&|!(){}[\]^"~*?:\\/]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
      if (!words) throw new Error("Enter an issue key or title words.");
      clauses.push(
        `summary ~ ${quoteJql(words + (/^[\p{L}\p{N}']+$/u.test(words.split(" ").at(-1)) ? "*" : ""))}`
      );
    }
  }
  const statuses = values(input.statuses, 100);
  if (statuses.length)
    clauses.push(`status IN (${statuses.map(quoteJql).join(", ")})`);
  const assignees = values(input.assignees, 100);
  const assigned = assignees.filter((value) => value !== "unassigned").map((value) => {
    if (!value.startsWith("id:"))
      throw new Error("The selected assignee has no Jira account ID.");
    return value.slice(3);
  });
  if (assigned.some((value) => !value)) throw new Error("Invalid assignee.");
  const assigneeClauses = [];
  if (assigned.length)
    assigneeClauses.push(`assignee IN (${assigned.map(quoteJql).join(", ")})`);
  if (assignees.includes("unassigned"))
    assigneeClauses.push("assignee IS EMPTY");
  if (assigneeClauses.length) clauses.push(`(${assigneeClauses.join(" OR ")})`);
  return `${clauses.join(" AND ")} ORDER BY key ASC`;
}
function optionAccumulator() {
  const statuses = /* @__PURE__ */ new Set();
  const assignees = /* @__PURE__ */ new Map();
  return {
    add(tasks) {
      for (const task of tasks) {
        if (task.status) statuses.add(task.status);
        if (task.assigneeId)
          assignees.set(`id:${task.assigneeId}`, task.assignee);
        else if (!task.assignee) assignees.set("unassigned", "");
      }
    },
    unseenJql(key) {
      const accounts = [...assignees.keys()].filter((value) => value.startsWith("id:")).map((value) => value.slice(3));
      const unknown = [
        accounts.length ? `assignee NOT IN (${accounts.map(quoteJql).join(", ")})` : "assignee IS NOT EMPTY"
      ];
      if (!assignees.has("unassigned")) unknown.push("assignee IS EMPTY");
      if (statuses.size)
        unknown.push(
          `status NOT IN (${[...statuses].map(quoteJql).join(", ")})`
        );
      return `parent = ${quoteJql(key)} AND (${unknown.join(" OR ")}) ORDER BY key ASC`;
    },
    result(limited) {
      return {
        statuses: [...statuses],
        assignees: [...assignees].map(([value, label]) => ({ value, label })),
        limited
      };
    }
  };
}

// plugins/jira-tasks/src/description.ts
function extractDescription(value) {
  if (typeof value !== "string") return { text: "", images: [] };
  const images = [];
  let bytes = 0;
  const text2 = value.replace(
    /!\[([^\]\r\n]*)\]\(([^)]*)\)/g,
    (_match, alt, src) => {
      if (/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(src) && src.length <= 6e5 && bytes + src.length <= 72e4 && images.length < 8) {
        const index = images.length;
        bytes += src.length;
        images.push({ alt: alt.slice(0, 200), src });
        return `

[[image:${index}]]

`;
      }
      return `

> \u{1F5BC} ${alt.trim().slice(0, 200)}

`;
    }
  ).replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return { text: text2, images };
}

// plugins/jira-tasks/src/jira.ts
var LIMIT = 100;
var FILTERS = /* @__PURE__ */ new Set(["assigned", "reported", "all", "done"]);
function record(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid Jira response.");
  return value;
}
function text(value, limit = 1e3) {
  return typeof value === "string" ? value.slice(0, limit) : "";
}
function optional(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function siteId(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_][A-Za-z0-9_-]{0,199}$/.test(value))
    throw new Error("Invalid Jira site.");
}
function safeUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
  } catch {
    return "";
  }
}
function normalizeTask(value, detail = false) {
  const row = record(value);
  const body = extractDescription(detail ? row.description : "");
  const description = body.text.slice(0, 24e3);
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
      subtask: optional(row.issueType).subtask === true
    },
    assignee: text(optional(row.assignee).displayName, 200),
    assigneeId: text(optional(row.assignee).accountId, 200),
    assigneeAvatarUrl: avatarUrl(optional(row.assignee).avatarUrl),
    reporter: {
      name: text(optional(row.reporter).displayName, 200),
      avatarUrl: avatarUrl(optional(row.reporter).avatarUrl)
    },
    priority: text(optional(row.priority).name, 100),
    updatedAt: text(row.updatedAt, 100),
    description,
    descriptionTruncated: body.text.length > description.length,
    images: body.images,
    parent: /^[A-Z][A-Z0-9_]*-\d+$/.test(parentKey) ? {
      key: parentKey,
      title: text(parent.title, 240),
      issueTypeName: text(parent.issueTypeName, 100)
    } : null
  };
}
function cliExecutable() {
  if (process.env.ORCA_CLI_COMMAND) return process.env.ORCA_CLI_COMMAND;
  if (process.platform === "darwin" && existsSync("/Applications/Orca.app/Contents/Resources/bin/orca"))
    return "/Applications/Orca.app/Contents/Resources/bin/orca";
  return process.platform === "linux" ? "orca-ide" : "orca";
}
var runCli = (args, signal) => new Promise((resolve, reject) => {
  execFile(
    cliExecutable(),
    ["jira", ...args, "--environment", "local", "--json"],
    {
      timeout: 25e3,
      maxBuffer: 8 * 1024 * 1024,
      signal,
      windowsHide: true
    },
    (error, stdout) => {
      let answer;
      try {
        answer = record(JSON.parse(stdout));
      } catch {
        const code = error?.code;
        reject(
          new Error(
            code === "ENOENT" ? "Orca CLI was not found. Update or reinstall Orca." : signal?.aborted ? "Request cancelled." : "Could not read Jira. Check the Orca connection and try again."
          )
        );
        return;
      }
      if (error || answer.ok !== true) {
        const code = text(optional(answer.error).code, 100);
        reject(
          new Error(
            `Jira request failed${code ? ` (${code})` : ""}. Check the Jira connection in Orca Tasks.`
          )
        );
      } else resolve(answer.result);
    }
  );
});
function createJiraClient(run = runCli, optionsBudgetMs = 15e3) {
  if (!Number.isInteger(optionsBudgetMs) || optionsBudgetMs < 1 || optionsBudgetMs > 15e3)
    throw new Error("Invalid Jira options timeout.");
  return {
    async connection(signal) {
      const result = record(await run(["connection"], signal));
      const sites = Array.isArray(result.sites) ? result.sites.map((value) => {
        const site = record(value);
        siteId(site.id);
        return {
          id: site.id,
          siteUrl: safeUrl(site.siteUrl),
          email: text(site.email, 200)
        };
      }) : [];
      const selected = text(result.selectedSiteId || result.activeSiteId, 200);
      return {
        sites,
        selectedSiteId: sites.some((s) => s.id === selected) ? selected : sites[0]?.id ?? null
      };
    },
    async list(input, signal) {
      siteId(input?.siteId);
      if (!FILTERS.has(input.filter)) throw new Error("Invalid Jira filter.");
      const rows = await run(
        [
          "list",
          "--site",
          input.siteId,
          "--filter",
          input.filter,
          "--limit",
          String(LIMIT)
        ],
        signal
      );
      if (!Array.isArray(rows)) throw new Error("Invalid Jira task list.");
      return {
        tasks: rows.slice(0, LIMIT).map((row) => normalizeTask(row)),
        limitReached: rows.length >= LIMIT
      };
    },
    async children(input, signal) {
      siteId(input?.siteId);
      if (typeof input.key !== "string" || !/^[A-Z][A-Z0-9_]*-\d+$/.test(input.key) || input.key.length > 100)
        throw new Error("Invalid Jira issue key.");
      if (input.includeOptions !== void 0 && typeof input.includeOptions !== "boolean")
        throw new Error("Invalid child query options.");
      const rows = await run(
        [
          "search",
          childJql(input),
          "--site",
          input.siteId,
          "--limit",
          String(LIMIT)
        ],
        signal
      );
      if (!Array.isArray(rows))
        throw new Error("Invalid Jira child task list.");
      const result = {
        tasks: rows.slice(0, LIMIT).map((row) => normalizeTask(row)),
        limitReached: rows.length >= LIMIT
      };
      if (input.includeOptions) {
        const options = optionAccumulator();
        options.add(result.tasks);
        let limited = true;
        const discovery = new AbortController();
        const discoverySignal = AbortSignal.any([
          discovery.signal,
          ...signal ? [signal] : []
        ]);
        const timer = setTimeout(() => discovery.abort(), optionsBudgetMs);
        try {
          for (let attempt = 0; attempt < 8 && !discoverySignal.aborted; attempt++) {
            let found;
            try {
              found = await run(
                [
                  "search",
                  options.unseenJql(input.key),
                  "--site",
                  input.siteId,
                  "--limit",
                  String(LIMIT)
                ],
                discoverySignal
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
        } finally {
          clearTimeout(timer);
        }
        result.options = options.result(limited);
      }
      return result;
    },
    async issue(input, signal) {
      siteId(input?.siteId);
      if (typeof input.key !== "string" || !/^[A-Z][A-Z0-9_]*-\d+$/.test(input.key) || input.key.length > 100)
        throw new Error("Invalid Jira issue key.");
      return normalizeTask(
        await run(["issue", input.key, "--site", input.siteId], signal),
        true
      );
    }
  };
}

// plugins/jira-tasks/src/open-panel.ts
function parseOpenResponse(stdout, executionError = null) {
  if (executionError && (executionError.killed || executionError.signal || typeof executionError.code !== "number" || ![1, 2, 3].includes(executionError.code)))
    throw new Error("The Orca CLI did not finish normally.");
  const answer = JSON.parse(stdout);
  if (typeof answer?.ok !== "boolean" || executionError && answer.ok)
    throw new Error("Invalid plugin open response.");
  if (answer.error?.code === "plugin_not_found" && executionError && executionError.code !== 1)
    throw new Error("Inconsistent plugin not-found response.");
  return answer;
}
var runOpen = (key, signal) => new Promise((resolve, reject) => {
  execFile2(
    cliExecutable(),
    [
      "plugin",
      "open",
      key,
      "--panel",
      "jira-tasks",
      "--environment",
      "local",
      "--json"
    ],
    { signal, timeout: 1e4, maxBuffer: 512 * 1024, windowsHide: true },
    (error, stdout) => {
      try {
        resolve(parseOpenResponse(stdout, error));
      } catch {
        reject(
          new Error(
            "Could not open Jira Tasks. Check that Orca is running and a workspace is open."
          )
        );
      }
    }
  );
});
async function openPanel(signal, open = runOpen) {
  signal.throwIfAborted();
  let result = await open("tienne.jira-tasks", signal);
  if (!result.ok && result.error?.code === "plugin_not_found") {
    signal.throwIfAborted();
    result = await open("local.jira-tasks", signal);
  }
  signal.throwIfAborted();
  if (!result.ok)
    throw new Error(
      result.error?.message || "Could not open Jira Tasks. Open a workspace and try again."
    );
}

// plugins/jira-tasks/src/worker.ts
function activate(orca) {
  orca.commands.register(
    "jira-tasks.open",
    (_args, { signal }) => openPanel(signal)
  );
  const jira = createJiraClient();
  const avatar = createAvatarLoader();
  orca.panels.handle(
    "jira.avatar",
    (input, { signal }) => avatar(input, signal)
  );
  orca.panels.handle(
    "jira.connection",
    (_input, { signal }) => jira.connection(signal)
  );
  orca.panels.handle(
    "jira.list",
    (input, { signal }) => jira.list(input, signal)
  );
  orca.panels.handle(
    "jira.children",
    (input, { signal }) => jira.children(input, signal)
  );
  orca.panels.handle(
    "jira.issue",
    (input, { signal }) => jira.issue(input, signal)
  );
}
export {
  activate as default
};

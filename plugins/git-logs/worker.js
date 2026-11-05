// plugins/git-logs/src/worker/main.ts
import { mkdir, lstat as lstat4, writeFile, realpath as realpath4 } from "node:fs/promises";
import { randomUUID as randomUUID2 } from "node:crypto";
import { join as join2 } from "node:path";

// plugins/git-logs/src/worker/git.ts
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { realpath, lstat, open } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
var exec = promisify(execFile);
var LIMIT = 768 * 1024;
async function git(root, args, timeout = 15e3) {
  const env = { ...process.env };
  for (const key of Object.keys(env))
    if (key.startsWith("GIT_")) delete env[key];
  const result = await exec(
    "git",
    [
      "--no-pager",
      "-c",
      "core.fsmonitor=false",
      "-c",
      "color.ui=false",
      "-c",
      "log.showSignature=false",
      "-c",
      "protocol.allow=never",
      "-c",
      "core.quotePath=false",
      ...args
    ],
    {
      cwd: root,
      encoding: "buffer",
      maxBuffer: 8 * 1024 * 1024,
      timeout,
      env: {
        ...env,
        GIT_OPTIONAL_LOCKS: "0",
        GIT_TERMINAL_PROMPT: "0",
        GIT_NO_REPLACE_OBJECTS: "1",
        GIT_NO_LAZY_FETCH: "1",
        GIT_CONFIG_COUNT: "0"
      }
    }
  );
  return result.stdout;
}
async function optional(root, args) {
  try {
    return (await git(root, args)).toString().trim();
  } catch {
    return "";
  }
}
async function repository(path) {
  if (typeof path !== "string" || !isAbsolute(path) || path.includes("\0"))
    throw new Error("\uB85C\uCEEC \uC800\uC7A5\uC18C\uC758 \uC808\uB300 \uACBD\uB85C\uB97C \uC785\uB825\uD558\uC138\uC694.");
  const root = await realpath(path);
  if ((await git(root, ["rev-parse", "--is-inside-work-tree"])).toString().trim() !== "true")
    throw new Error("\uC791\uC5C5 \uD2B8\uB9AC\uAC00 \uC788\uB294 Git \uC800\uC7A5\uC18C\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.");
  const promisor = await optional(root, [
    "config",
    "--bool",
    "--get-regexp",
    "^remote\\..*\\.promisor$"
  ]);
  if (promisor.split("\n").some((line2) => line2.endsWith(" true")) || await optional(root, ["config", "--get", "extensions.partialClone"]))
    throw new Error(
      "\uBD80\uBD84 clone \uC800\uC7A5\uC18C\uB294 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uD544\uC694\uD55C \uAC1D\uCCB4\uAC00 \uB85C\uCEEC\uC5D0 \uC788\uB294 \uC77C\uBC18 \uC800\uC7A5\uC18C\uB97C \uC120\uD0DD\uD558\uC138\uC694."
    );
  return realpath(
    (await git(root, ["rev-parse", "--show-toplevel"])).toString().trim()
  );
}
function validPath(path) {
  if (typeof path !== "string" || !path || path.includes("\0") || isAbsolute(path) || path.split(/[\\/]/).some((p) => p === ".." || p === ".git"))
    throw new Error("\uC798\uBABB\uB41C \uC800\uC7A5\uC18C \uC0C1\uB300 \uACBD\uB85C\uC785\uB2C8\uB2E4.");
}
async function commitHash(root, ref) {
  if (typeof ref !== "string" || !/^[a-f0-9]{40,64}$/.test(ref))
    throw new Error("\uC804\uCCB4 \uCEE4\uBC0B \uD574\uC2DC\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.");
  const hash = (await git(root, ["rev-parse", "--verify", `${ref}^{commit}`])).toString().trim();
  if (hash !== ref) throw new Error("\uCEE4\uBC0B\uC774 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
  return hash;
}
async function log(root, all = false, branchRef) {
  const head = await optional(root, ["rev-parse", "--verify", "HEAD"]);
  const branch = await optional(root, [
    "symbolic-ref",
    "--short",
    "-q",
    "HEAD"
  ]);
  const refs = /* @__PURE__ */ new Map();
  const localBranches = [];
  const branches = [];
  for (const line2 of (await git(root, [
    "for-each-ref",
    "--format=%(objectname)%09%(refname)%09%(symref)",
    "refs/heads",
    "refs/remotes"
  ])).toString().trim().split("\n")) {
    const [hash, name, symbolic] = line2.split("	");
    if (name?.startsWith("refs/heads/"))
      localBranches.push({ name: name.slice(11), hash });
    if (name && !symbolic)
      branches.push({
        ref: name,
        name: name.replace(/^refs\/(heads|remotes)\//, ""),
        hash,
        kind: name.startsWith("refs/heads/") ? "local" : "remote"
      });
    if (name)
      refs.set(hash, [
        ...refs.get(hash) ?? [],
        name.replace(/^refs\/(heads|remotes)\//, "")
      ]);
  }
  const selected = branchRef === void 0 ? void 0 : branches.find((b) => b.ref === branchRef);
  if (branchRef !== void 0 && !selected)
    throw new Error("\uC120\uD0DD\uD55C \uBE0C\uB79C\uCE58\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694.");
  const selectedHash = selected ? await commitHash(root, selected.hash) : void 0;
  const raw = !head && !all && !selectedHash ? "" : (await git(root, [
    "log",
    "--topo-order",
    "-200",
    "--format=%H%x00%P%x00%an%x00%aI%x00%B%x00",
    ...selectedHash ? [selectedHash] : all ? ["--all", ...head ? ["HEAD"] : []] : ["HEAD"],
    "--"
  ])).toString();
  const fields = raw.split("\0");
  const commits = [];
  for (let i = 0; i + 5 < fields.length; i += 5) {
    const hash = fields[i].trim();
    commits.push({
      hash,
      parents: fields[i + 1].split(" ").filter(Boolean),
      author: fields[i + 2],
      date: fields[i + 3],
      message: fields[i + 4].trimEnd(),
      refs: [...hash === head ? ["HEAD"] : [], ...refs.get(hash) ?? []]
    });
  }
  return {
    root,
    branch: branch || "Detached HEAD",
    head: head || null,
    commits,
    localBranches,
    branches
  };
}
function parseNames(raw) {
  const parts = raw.toString("utf8").split("\0");
  const files = [];
  for (let i = 0; i < parts.length - 1; ) {
    const status = parts[i++];
    const first = parts[i++];
    if (/^[RC]/.test(status))
      files.push({ status: status[0], oldPath: first, path: parts[i++] });
    else files.push({ status: status[0], path: first });
  }
  return files;
}
async function changes(root, input) {
  if (!input || !["working", "commit"].includes(input.kind))
    throw new Error("\uC798\uBABB\uB41C \uBE44\uAD50 \uBAA8\uB4DC\uC785\uB2C8\uB2E4.");
  if (input.kind === "commit") {
    const hash = await commitHash(root, input.commit);
    const parents = (await git(root, ["show", "-s", "--format=%P", hash, "--"])).toString().trim().split(" ").filter(Boolean);
    const parent = input.parent ?? parents[0];
    if (parent && !parents.includes(parent))
      throw new Error("\uC120\uD0DD \uCEE4\uBC0B\uC758 \uC9C1\uC811 \uBD80\uBAA8\uB9CC \uBE44\uAD50\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
    const files2 = parseNames(
      await git(
        root,
        parent ? [
          "diff",
          "--no-ext-diff",
          "--no-textconv",
          "-M",
          "--name-status",
          "-z",
          parent,
          hash,
          "--"
        ] : [
          "diff-tree",
          "--root",
          "--no-commit-id",
          "-r",
          "-M",
          "--name-status",
          "-z",
          hash,
          "--"
        ]
      )
    );
    if (files2.length > 2e3)
      throw new Error(
        "\uBCC0\uACBD \uD30C\uC77C\uC774 2,000\uAC1C\uB97C \uCD08\uACFC\uD569\uB2C8\uB2E4. \uB354 \uC791\uC740 \uBE44\uAD50\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."
      );
    return {
      comparison: {
        kind: "commit",
        commit: hash,
        ...parent ? { parent } : {}
      },
      files: files2,
      left: parent ?? "\uBE48 \uD2B8\uB9AC (\uCD5C\uCD08 \uCEE4\uBC0B)",
      right: hash
    };
  }
  const head = await optional(root, ["rev-parse", "--verify", "HEAD"]);
  if ("head" in input && input.head !== (head || null))
    throw new Error("HEAD\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBE44\uAD50\uB97C \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694.");
  let files = head ? parseNames(
    await git(root, [
      "diff",
      "--no-ext-diff",
      "--no-textconv",
      "-M",
      "--name-status",
      "-z",
      head,
      "--"
    ])
  ) : (await git(root, ["ls-files", "-z"])).toString().split("\0").filter(Boolean).map((path) => ({ path, status: "A" }));
  const status = (await git(root, ["status", "--porcelain=v1", "-z", "--untracked-files=all"])).toString().split("\0");
  for (let i = 0; i < status.length; i++) {
    const row = status[i];
    if (!row) continue;
    const xy = row.slice(0, 2);
    const path = row.slice(3);
    if (xy.includes("R") || xy.includes("C")) i++;
    let file = files.find((f) => f.path === path);
    const conflict = xy.includes("U") || xy === "AA" || xy === "DD";
    if (!file && (xy === "??" || conflict)) {
      file = { path, status: conflict ? "U" : "?" };
      files.push(file);
    }
    if (file)
      Object.assign(file, {
        staged: xy[0] !== " " && xy[0] !== "?",
        unstaged: xy[1] !== " " && xy[1] !== "?",
        untracked: xy === "??",
        conflict
      });
  }
  if (files.length > 2e3)
    throw new Error(
      "\uBCC0\uACBD \uD30C\uC77C\uC774 2,000\uAC1C\uB97C \uCD08\uACFC\uD569\uB2C8\uB2E4. \uB354 \uC791\uC740 \uC800\uC7A5\uC18C\uC5D0\uC11C \uBE44\uAD50\uD558\uC138\uC694."
    );
  const normalized = [];
  for (const file of files) {
    if (file.oldPath && (await disk(root, file.oldPath)).kind !== "missing") {
      file.status = "A";
      delete file.oldPath;
    }
    if (file.untracked || file.status === "D") {
      const before = await blob(root, head || void 0, file.path);
      const after = await disk(root, file.path);
      if (before.kind === "missing" && after.kind === "missing" || before.kind === "text" && after.kind === "text" && before.text === after.text)
        continue;
      if (after.kind !== "missing" && before.kind !== "missing")
        file.status = "M";
    }
    normalized.push(file);
  }
  files = [...new Map(normalized.map((f) => [f.path, f])).values()].sort(
    (a, b) => a.path.localeCompare(b.path)
  );
  if (files.length > 2e3)
    throw new Error(
      "\uBCC0\uACBD \uD30C\uC77C\uC774 2,000\uAC1C\uB97C \uCD08\uACFC\uD569\uB2C8\uB2E4. \uB354 \uC791\uC740 \uC800\uC7A5\uC18C\uC5D0\uC11C \uBE44\uAD50\uD558\uC138\uC694."
    );
  return {
    comparison: { kind: "working", head: head || null },
    files,
    left: head || "\uBE48 \uD2B8\uB9AC (HEAD \uC5C6\uC74C)",
    right: "\uD604\uC7AC \uC791\uC5C5 \uD2B8\uB9AC \xB7 \uB514\uC2A4\uD06C"
  };
}
var missing = () => ({ kind: "missing", text: "", bytes: 0 });
function decode(data) {
  if (data.length > LIMIT)
    return { kind: "large", text: "", bytes: data.length };
  try {
    if (data.includes(0)) throw Error();
    return {
      kind: "text",
      text: new TextDecoder("utf-8", { fatal: true }).decode(data),
      bytes: data.length
    };
  } catch {
    return { kind: "binary", text: "", bytes: data.length };
  }
}
async function blob(root, ref, path) {
  if (!ref) return missing();
  validPath(path);
  const entry = (await git(root, ["ls-tree", "-z", ref, "--", `:(literal)${path}`])).toString();
  if (!entry) return missing();
  const header = entry.slice(0, entry.indexOf("	")).split(" ");
  if (header[1] !== "blob" || header[0] === "120000")
    return { kind: "special", text: "", bytes: 0 };
  const size = Number(
    (await git(root, ["cat-file", "-s", header[2]])).toString()
  );
  if (size > LIMIT) return { kind: "large", text: "", bytes: size };
  return decode(await git(root, ["cat-file", "blob", header[2]]));
}
async function disk(root, path) {
  validPath(path);
  const full = resolve(root, path);
  try {
    let current = root;
    for (const part of relative(root, full).split(sep)) {
      current = resolve(current, part);
      const s = await lstat(current);
      if (s.isSymbolicLink() || current === full && !s.isFile())
        return { kind: "special", text: "", bytes: s.size };
    }
    const actual = await realpath(full);
    const rel = relative(root, actual);
    if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel))
      throw new Error("\uC800\uC7A5\uC18C \uACBD\uACC4\uB97C \uBC97\uC5B4\uB09C \uD30C\uC77C\uC785\uB2C8\uB2E4.");
    const handle = await open(
      actual,
      constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK
    );
    try {
      const stat = await handle.stat();
      if (!stat.isFile())
        return { kind: "special", text: "", bytes: stat.size };
      if (stat.size > LIMIT)
        return { kind: "large", text: "", bytes: stat.size };
      const buffer = Buffer.alloc(LIMIT + 1);
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
      return decode(buffer.subarray(0, bytesRead));
    } finally {
      await handle.close();
    }
  } catch (e) {
    if (e.code === "ENOENT") return missing();
    throw e;
  }
}
async function diff(root, comparison, path) {
  validPath(path);
  const set = await changes(root, comparison);
  const file = set.files.find((f) => f.path === path);
  if (!file) throw new Error("\uBCC0\uACBD \uBAA9\uB85D\uC5D0 \uC5C6\uB294 \uD30C\uC77C\uC785\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694.");
  if (file.conflict)
    return {
      file,
      original: { kind: "special", text: "", bytes: 0 },
      modified: { kind: "special", text: "", bytes: 0 }
    };
  const c = set.comparison;
  const base = c.kind === "commit" ? c.parent : c.head ?? void 0;
  const original = file.status === "A" ? missing() : await blob(root, base, file.oldPath ?? path);
  const modified = c.kind === "commit" ? await blob(root, c.commit, path) : await disk(root, path);
  return { file, original, modified };
}

// plugins/git-logs/src/worker/operations.ts
import { randomUUID } from "node:crypto";
import { lstat as lstat2, realpath as realpath2 } from "node:fs/promises";
import { resolve as resolve2 } from "node:path";
async function text(root, args) {
  return (await git(root, args)).toString().trim();
}
async function optional2(root, args) {
  try {
    return await text(root, args);
  } catch {
    return "";
  }
}
async function exists(path) {
  try {
    await lstat2(path);
    return true;
  } catch (e) {
    if (e.code === "ENOENT") return false;
    throw e;
  }
}
async function state(root) {
  if (await repository(root) !== root)
    throw new Error("\uC800\uC7A5\uC18C \uACBD\uACC4\uAC00 \uBCC0\uACBD\uB410\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC5F0\uACB0\uD558\uC138\uC694.");
  const directory = await text(root, ["rev-parse", "--absolute-git-dir"]);
  for (const entry of [
    "MERGE_HEAD",
    "CHERRY_PICK_HEAD",
    "REVERT_HEAD",
    "rebase-merge",
    "rebase-apply",
    "sequencer",
    "BISECT_LOG"
  ]) {
    if (await exists(resolve2(directory, entry)))
      throw new Error(
        `\uC9C4\uD589 \uC911\uC778 Git \uC791\uC5C5(${entry})\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uD130\uBBF8\uB110\uC5D0\uC11C \uC644\uB8CC\uD558\uAC70\uB098 \uC911\uB2E8\uD55C \uB4A4 \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694.`
      );
  }
  const flags = (await git(root, ["ls-files", "-v", "-z"])).toString().split("\0");
  if (flags.some(
    (entry) => entry && (entry[0] === entry[0].toLowerCase() || entry[0] === "S")
  ))
    throw new Error(
      "assume-unchanged/skip-worktree \uB610\uB294 sparse checkout \uD56D\uBAA9\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uC774 \uC800\uC7A5\uC18C\uC758 \uBCC0\uACBD \uBA85\uB839\uC740 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."
    );
  const dirty = await git(root, [
    "status",
    "--porcelain=v1",
    "-z",
    "--untracked-files=all",
    "--ignore-submodules=none"
  ]);
  if (dirty.length)
    throw new Error(
      "\uCEE4\uBC0B\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD \uB610\uB294 untracked \uD30C\uC77C\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uBA3C\uC800 \uBCF4\uAD00/\uCEE4\uBC0B/\uC815\uB9AC\uD558\uC138\uC694. \uC790\uB3D9 stash\uB098 \uBCC0\uACBD \uD3D0\uAE30\uB294 \uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."
    );
  const head = await text(root, ["rev-parse", "--verify", "HEAD"]);
  const branch = await optional2(root, ["symbolic-ref", "-q", "HEAD"]);
  return { head, branch };
}
async function checkIgnored(root, target, rebase = false) {
  const commits = (await text(root, ["rev-list", "--no-walk", "--parents", target])).split(/\s+/);
  const paths = /* @__PURE__ */ new Set();
  for (const commit of commits)
    for (const path of (await git(root, ["ls-tree", "-r", "--name-only", "-z", commit])).toString().split("\0"))
      if (path) paths.add(path);
  if (rebase) {
    const raw = (await git(root, [
      "log",
      "--format=",
      "--raw",
      "-z",
      "--no-renames",
      "--no-ext-diff",
      `${target}..HEAD`,
      "--"
    ])).toString().split("\0");
    for (let i = 0; i < raw.length; i++)
      if (raw[i].trimStart().startsWith(":") && raw[i + 1]) paths.add(raw[++i]);
  }
  const ignored = (await git(root, [
    "ls-files",
    "--others",
    "--ignored",
    "--exclude-standard",
    "--directory",
    "-z"
  ])).toString().split("\0").filter(Boolean);
  for (const entry of ignored) {
    const path = entry.replace(/\/$/, "");
    if ([...paths].some(
      (tracked) => tracked === path || tracked.startsWith(path + "/") || path.startsWith(tracked + "/")
    ))
      throw new Error(
        `ignored \uD30C\uC77C\uACFC \uB300\uC0C1 \uACBD\uB85C\uAC00 \uACB9\uCE69\uB2C8\uB2E4: ${entry}. \uBA3C\uC800 \uBCC4\uB3C4\uB85C \uBCF4\uAD00\uD558\uC138\uC694.`
      );
  }
}
var policies = {
  checkout: "\uC120\uD0DD \uCEE4\uBC0B\uC73C\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4. \uB85C\uCEEC \uBE0C\uB79C\uCE58\uB97C \uC120\uD0DD\uD558\uBA74 \uADF8 \uBE0C\uB79C\uCE58\uB85C, \uC544\uB2C8\uBA74 Detached HEAD\uB85C \uC804\uD658\uD569\uB2C8\uB2E4.",
  branch: "\uC120\uD0DD \uCEE4\uBC0B\uC5D0 \uC0C8 \uB85C\uCEEC \uBE0C\uB79C\uCE58\uB97C \uB9CC\uB4ED\uB2C8\uB2E4. \uD604\uC7AC \uBE0C\uB79C\uCE58\uB294 \uC804\uD658\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
  merge: "\uC120\uD0DD \uCEE4\uBC0B\uC744 \uD604\uC7AC \uBE0C\uB79C\uCE58\uB85C \uBCD1\uD569\uD569\uB2C8\uB2E4. \uAC00\uB2A5\uD558\uBA74 fast-forward\uD558\uBA70, \uC544\uB2C8\uBA74 merge \uCEE4\uBC0B\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.",
  rebase: "\uD604\uC7AC \uBE0C\uB79C\uCE58\uC758 \uCEE4\uBC0B\uB4E4\uC744 \uC120\uD0DD \uCEE4\uBC0B \uC704\uC5D0 \uB2E4\uC2DC \uC313\uC2B5\uB2C8\uB2E4. \uCEE4\uBC0B \uD574\uC2DC\uAC00 \uBC14\uB00C\uBA70 merge \uCEE4\uBC0B\uC740 \uBCF4\uC874\uD558\uC9C0 \uC54A\uB294 \uC77C\uBC18 rebase\uC785\uB2C8\uB2E4. \uACF5\uC720\uD55C \uC774\uB825\uC744 \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  "cherry-pick": "\uC120\uD0DD \uCEE4\uBC0B\uC758 \uBCC0\uACBD\uC744 \uD604\uC7AC \uBE0C\uB79C\uCE58\uC5D0 \uC0C8 \uCEE4\uBC0B\uC73C\uB85C \uC801\uC6A9\uD569\uB2C8\uB2E4.",
  revert: "\uC120\uD0DD \uCEE4\uBC0B\uC758 \uBCC0\uACBD\uC744 \uCDE8\uC18C\uD558\uB294 \uC0C8 \uCEE4\uBC0B\uC744 \uD604\uC7AC \uBE0C\uB79C\uCE58\uC5D0 \uB9CC\uB4ED\uB2C8\uB2E4. \uAE30\uC874 \uC774\uB825\uC740 \uC720\uC9C0\uD569\uB2C8\uB2E4.",
  reset: "\uD604\uC7AC \uBE0C\uB79C\uCE58\uC758 \uB05D\uC744 \uC120\uD0DD \uCEE4\uBC0B\uC73C\uB85C \uC62E\uAE41\uB2C8\uB2E4. \uACF5\uC720\uD55C \uBE0C\uB79C\uCE58\uC758 \uC774\uB825\uC744 \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
};
function createOperations() {
  const plans = /* @__PURE__ */ new Map();
  const locks = /* @__PURE__ */ new Set();
  async function locked(root, run) {
    const common = await realpath2(
      resolve2(root, await text(root, ["rev-parse", "--git-common-dir"]))
    );
    if (locks.has(common))
      throw new Error("\uC774 \uC800\uC7A5\uC18C\uC5D0\uC11C \uB2E4\uB978 Git \uBCC0\uACBD \uBA85\uB839\uC774 \uC2E4\uD589 \uC911\uC785\uB2C8\uB2E4.");
    locks.add(common);
    try {
      return await run();
    } finally {
      locks.delete(common);
    }
  }
  return {
    async prepare(root, input) {
      return locked(root, async () => {
        if (!input || !Object.hasOwn(policies, input.action))
          throw new Error("\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 Git \uBA85\uB839\uC785\uB2C8\uB2E4.");
        const before = await state(root);
        const target = await commitHash(root, input.commit);
        await checkIgnored(root, target, input.action === "rebase");
        const parents = (await text(root, ["show", "-s", "--format=%P", target, "--"])).split(" ").filter(Boolean);
        if (!before.branch && ["merge", "rebase", "cherry-pick", "revert", "reset"].includes(
          input.action
        ))
          throw new Error(
            "\uD604\uC7AC Detached HEAD\uC785\uB2C8\uB2E4. \uBA3C\uC800 \uB85C\uCEEC \uBE0C\uB79C\uCE58\uB85C \uCCB4\uD06C\uC544\uC6C3\uD558\uC138\uC694."
          );
        let branchRef;
        if (input.branch !== void 0) {
          if (typeof input.branch !== "string" || !input.branch || input.branch.startsWith("-") || input.branch === "HEAD" || input.branch.includes("\0"))
            throw new Error("\uC720\uD6A8\uD55C \uB85C\uCEEC \uBE0C\uB79C\uCE58 \uC774\uB984\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.");
          await git(root, ["check-ref-format", "--branch", input.branch]);
          branchRef = `refs/heads/${input.branch}`;
        }
        let command;
        let summary = policies[input.action];
        switch (input.action) {
          case "checkout":
            if (branchRef && await text(root, ["rev-parse", "--verify", branchRef]) !== target)
              throw new Error(
                "\uBE0C\uB79C\uCE58\uAC00 \uC120\uD0DD \uCEE4\uBC0B\uC744 \uAC00\uB9AC\uD0A4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694."
              );
            command = branchRef ? ["switch", "--no-overwrite-ignore", "--no-guess", input.branch] : ["switch", "--no-overwrite-ignore", "--detach", target];
            break;
          case "branch":
            if (!branchRef) throw new Error("\uC0C8 \uBE0C\uB79C\uCE58 \uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694.");
            if (await optional2(root, ["show-ref", "--verify", branchRef]))
              throw new Error("\uC774\uBBF8 \uC874\uC7AC\uD558\uB294 \uBE0C\uB79C\uCE58\uC785\uB2C8\uB2E4.");
            command = ["branch", "--no-track", input.branch, target];
            break;
          case "merge":
            command = [
              "merge",
              "--no-edit",
              "--no-gpg-sign",
              "--no-autostash",
              "--no-squash",
              "--commit",
              "--ff",
              target
            ];
            break;
          case "rebase":
            command = [
              "rebase",
              "--merge",
              "--no-autostash",
              "--no-gpg-sign",
              "--no-update-refs",
              "--no-rebase-merges",
              "--no-autosquash",
              "--no-fork-point",
              target
            ];
            break;
          case "cherry-pick":
          case "revert": {
            const mainline = [];
            if (parents.length > 1) {
              if (!Number.isInteger(input.mainline) || input.mainline < 1 || input.mainline > parents.length)
                throw new Error(
                  "merge \uCEE4\uBC0B\uC758 \uAE30\uC900 \uBD80\uBAA8(mainline)\uB97C \uBA85\uC2DC\uC801\uC73C\uB85C \uC120\uD0DD\uD558\uC138\uC694."
                );
              mainline.push("-m", String(input.mainline));
              summary += ` \uBD80\uBAA8 ${input.mainline}(${parents[input.mainline - 1].slice(0, 7)})\uC744 \uAE30\uC900\uC73C\uB85C \uD569\uB2C8\uB2E4.`;
            } else if (input.mainline !== void 0)
              throw new Error("\uC77C\uBC18 \uCEE4\uBC0B\uC5D0\uB294 mainline\uC744 \uC9C0\uC815\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
            command = [
              input.action,
              "--no-edit",
              "--no-gpg-sign",
              ...mainline,
              target
            ];
            break;
          }
          case "reset":
            if (!["soft", "mixed", "hard"].includes(input.resetMode ?? ""))
              throw new Error("reset \uBAA8\uB4DC\uB97C \uC120\uD0DD\uD558\uC138\uC694.");
            summary += input.resetMode === "soft" ? " Soft: index\uC640 \uD30C\uC77C\uC744 \uC720\uC9C0\uD558\uBA70 \uBCC0\uACBD\uC744 staged \uC0C1\uD0DC\uB85C \uB0A8\uAE41\uB2C8\uB2E4." : input.resetMode === "mixed" ? " Mixed: index\uB97C \uAC31\uC2E0\uD558\uACE0 \uD30C\uC77C\uC740 \uC720\uC9C0\uD574 \uBCC0\uACBD\uC744 unstaged \uC0C1\uD0DC\uB85C \uB0A8\uAE41\uB2C8\uB2E4." : " Hard: index\uC640 \uC791\uC5C5 \uD2B8\uB9AC\uB97C \uC120\uD0DD \uCEE4\uBC0B \uB0B4\uC6A9\uC73C\uB85C \uBC14\uAFC9\uB2C8\uB2E4. \uACBD\uB85C\uB97C \uB9C9\uB294 untracked \uD30C\uC77C\uC774 \uC0AD\uC81C\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.";
            command = ["reset", `--${input.resetMode}`, target];
            break;
        }
        const plan = {
          token: randomUUID(),
          root,
          action: input.action,
          head: before.head,
          currentBranch: before.branch.replace(/^refs\/heads\//, "") || "Detached HEAD",
          target,
          command,
          summary,
          confirmation: input.action === "reset" && input.resetMode === "hard" ? target.slice(0, 7) : "",
          ...["reset", "rebase"].includes(input.action) ? {
            backupRef: `refs/git-logs/backups/${Date.now()}-${randomUUID()}`
          } : {}
        };
        for (const [key, value] of plans)
          if (value.expires < Date.now()) plans.delete(key);
        if (plans.size >= 50) plans.delete(plans.keys().next().value);
        plans.set(plan.token, {
          plan,
          snapshot: JSON.stringify(before),
          branchRef,
          expires: Date.now() + 3e5
        });
        return plan;
      });
    },
    async execute(root, token, confirmation) {
      const saved = plans.get(token);
      if (!saved || saved.plan.root !== root || saved.expires < Date.now())
        throw new Error("\uD655\uC778\uC774 \uB9CC\uB8CC\uB410\uC2B5\uB2C8\uB2E4. \uBA54\uB274\uC5D0\uC11C \uB2E4\uC2DC \uC900\uBE44\uD558\uC138\uC694.");
      if (saved.plan.confirmation !== confirmation)
        throw new Error("\uD655\uC778\uC6A9 \uCEE4\uBC0B \uD574\uC2DC\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      plans.delete(token);
      return locked(root, async () => {
        const { plan } = saved;
        if (JSON.stringify(await state(root)) !== saved.snapshot)
          throw new Error(
            "HEAD \uB610\uB294 \uD604\uC7AC \uBE0C\uB79C\uCE58\uAC00 \uBCC0\uACBD\uB410\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694."
          );
        if (saved.branchRef && plan.action === "checkout" && await text(root, ["rev-parse", "--verify", saved.branchRef]) !== plan.target)
          throw new Error("\uCCB4\uD06C\uC544\uC6C3\uD560 \uBE0C\uB79C\uCE58\uAC00 \uBCC0\uACBD\uB410\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694.");
        if (saved.branchRef && plan.action === "branch" && await optional2(root, ["show-ref", "--verify", saved.branchRef]))
          throw new Error("\uC0C8 \uBE0C\uB79C\uCE58\uAC00 \uC774\uBBF8 \uB9CC\uB4E4\uC5B4\uC84C\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694.");
        await checkIgnored(root, plan.target, plan.action === "rebase");
        if (plan.backupRef)
          await git(root, [
            "update-ref",
            plan.backupRef,
            plan.head,
            "0".repeat(plan.head.length)
          ]);
        let output = "";
        let failed = false;
        try {
          output = (await git(
            root,
            [
              "-c",
              "core.hooksPath=/dev/null",
              "-c",
              "commit.gpgSign=false",
              "-c",
              "merge.autoStash=false",
              "-c",
              "rerere.enabled=false",
              "-c",
              "submodule.recurse=false",
              ...plan.action === "merge" ? ["-c", `branch.${plan.currentBranch}.mergeOptions=`] : [],
              ...plan.command
            ],
            12e4
          )).toString();
        } catch (error) {
          failed = true;
          const e = error;
          output = [e.stderr?.toString(), e.stdout?.toString(), e.message].filter(Boolean).join("\n");
        }
        const conflicts = (await git(root, ["diff", "--name-only", "--diff-filter=U", "-z"])).toString().split("\0").filter(Boolean);
        return {
          status: conflicts.length ? "conflict" : failed ? "failed" : "success",
          message: (conflicts.length ? "\uCDA9\uB3CC\uC774 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uD130\uBBF8\uB110\uC5D0\uC11C \uD574\uACB0 \uD6C4 \uACC4\uC18D\uD558\uAC70\uB098 \uD574\uB2F9 Git \uC791\uC5C5\uC744 --abort \uD558\uC138\uC694. \uC790\uB3D9 \uB864\uBC31\uC740 \uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.\n" : failed ? "\uBA85\uB839\uC774 \uC644\uB8CC\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uBD80\uBD84 \uC801\uC6A9 \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uACE0, \uD130\uBBF8\uB110\uC5D0\uC11C \uC9C4\uD589 \uC911\uC778 \uC791\uC5C5\uC744 \uC644\uB8CC/\uC911\uB2E8\uD558\uC138\uC694.\n" : "\uC644\uB8CC\uD588\uC2B5\uB2C8\uB2E4.\n") + output.slice(0, 12e3),
          conflicts,
          ...plan.backupRef ? { backupRef: plan.backupRef } : {}
        };
      });
    }
  };
}

// plugins/git-logs/src/worker/local-ignore.ts
import { constants as constants2 } from "node:fs";
import { lstat as lstat3, open as open2, realpath as realpath3 } from "node:fs/promises";
import { join, resolve as resolve3 } from "node:path";
var rule = "/.orca/git-logs/";
var pending = /* @__PURE__ */ new Map();
var maxBytes = 1024 * 1024;
var line = (value) => value.toString("utf8").replace(/\n$/, "");
async function ensureLocalIgnore(path, io = { open: open2 }) {
  const root = await repository(path);
  const commonPath = resolve3(
    root,
    line(await git(root, ["rev-parse", "--git-common-dir"]))
  );
  const reported = resolve3(
    root,
    line(await git(root, ["rev-parse", "--git-path", "info/exclude"]))
  );
  if (reported !== join(commonPath, "info", "exclude"))
    throw new Error("Git returned an unexpected local exclude path.");
  const common = await realpath3(commonPath);
  const info = join(common, "info");
  const target = join(info, "exclude");
  const previous = pending.get(target) ?? Promise.resolve();
  const operation = previous.catch(() => {
  }).then(async () => {
    const parent = await lstat3(info);
    if (!parent.isDirectory() || parent.isSymbolicLink() || await realpath3(info) !== info)
      throw new Error(
        "Git info must be a real directory inside the common Git directory."
      );
    if (!constants2.O_NOFOLLOW)
      throw new Error(
        "Safe local exclude updates are unsupported on this host."
      );
    const expected = await lstat3(target);
    if (!expected.isFile() || expected.isSymbolicLink() || expected.nlink !== 1 || expected.size > maxBytes)
      throw new Error(
        "Local exclude must be a small regular file without hard links."
      );
    const reader = await io.open(
      target,
      constants2.O_RDONLY | constants2.O_NOFOLLOW | constants2.O_NONBLOCK
    );
    let content;
    try {
      const stat = await reader.stat();
      if (!stat.isFile() || stat.nlink !== 1 || stat.dev !== expected.dev || stat.ino !== expected.ino)
        throw new Error("Local exclude changed while opening.");
      const buffer = Buffer.alloc(maxBytes + 1);
      let length = 0;
      while (length < buffer.length) {
        const { bytesRead } = await reader.read(
          buffer,
          length,
          buffer.length - length,
          length
        );
        if (!bytesRead) break;
        length += bytesRead;
      }
      if (length > maxBytes)
        throw new Error("Local exclude file is too large.");
      content = buffer.subarray(0, length);
    } finally {
      await reader.close();
    }
    if (content.toString("utf8").split(/\r?\n/).includes(rule)) return;
    const writer = await io.open(
      target,
      constants2.O_WRONLY | constants2.O_APPEND | constants2.O_NOFOLLOW | constants2.O_NONBLOCK
    );
    try {
      const stat = await writer.stat();
      const current = await lstat3(target);
      const currentParent = await lstat3(info);
      if (!stat.isFile() || stat.nlink !== 1 || stat.dev !== expected.dev || stat.ino !== expected.ino || !current.isFile() || current.isSymbolicLink() || current.nlink !== 1 || current.dev !== expected.dev || current.ino !== expected.ino || !currentParent.isDirectory() || currentParent.isSymbolicLink() || currentParent.dev !== parent.dev || currentParent.ino !== parent.ino || await realpath3(info) !== info)
        throw new Error("Local exclude path changed during setup.");
      const newline = content.includes(Buffer.from("\r\n")) ? "\r\n" : "\n";
      const prefix = !content.length || content.at(-1) === 10 ? "" : content.at(-1) === 13 ? "\n" : newline;
      await writer.writeFile(Buffer.from(prefix + rule + newline));
    } finally {
      await writer.close();
    }
  });
  pending.set(target, operation);
  try {
    await operation;
  } finally {
    if (pending.get(target) === operation) pending.delete(target);
  }
}

// plugins/git-logs/src/worker/main.ts
function activate(orca) {
  function requireHost(name) {
    if (orca.api?.major !== 1 || orca.api.minor < 3 || !orca.host.has(name))
      throw new Error(
        `\uC774 Orca\uC5D0\uC11C ${name}\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. Host API 1.3 \uC774\uC0C1\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.`
      );
  }
  const connected = /* @__PURE__ */ new Set();
  const operations = createOperations();
  const setupWarning = "Git Logs\uC758 \uB85C\uCEEC \uC81C\uC678 \uADDC\uCE59\uC744 \uC124\uC815\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC800\uC7A5\uC18C \uAD8C\uD55C\uACFC ignore \uADDC\uCE59\uC744 \uD655\uC778\uD558\uC138\uC694.";
  async function setup(root) {
    try {
      await ensureLocalIgnore(root);
    } catch (error) {
      orca.log(
        `Git Logs local exclude setup failed: ${error instanceof Error ? error.message : String(error)}`
      );
      return setupWarning;
    }
  }
  async function setupWorkspace(created) {
    if (created && created.kind !== "worktree") return;
    requireHost("workspace.list");
    const result = await orca.host.call("workspace.list", {});
    let selected;
    if (created) {
      selected = result.workspaces.find(
        (w) => w.id === created.workspaceId && w.kind === "worktree" && (w.hostId === null || w.hostId === "local")
      );
      if (!selected || await realpath4(selected.path) !== await realpath4(created.path))
        return;
    } else {
      requireHost("workspace.readContext");
      const context = await orca.host.call(
        "workspace.readContext",
        {}
      );
      const matches = result.workspaces.filter(
        (w) => w.name === context?.displayName && (w.branch ?? "") === context?.branch
      );
      if (result.truncated || matches.length !== 1) return;
      selected = matches[0];
      if (selected.kind !== "worktree" || selected.hostId !== null && selected.hostId !== "local")
        return;
    }
    await setup(await repository(selected.path));
  }
  const backgroundSetup = async (created) => {
    try {
      await setupWorkspace(created);
    } catch (error) {
      orca.log(
        `Git Logs workspace setup skipped: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };
  orca.events?.on("workspace.created", (event) => backgroundSetup(event));
  orca.events?.on("workspace.changed", () => backgroundSetup());
  async function mutationRoot(root, workspaceId) {
    check(root);
    requireHost("workspace.list");
    requireHost("workspace.readContext");
    const context = await orca.host.call(
      "workspace.readContext",
      {}
    );
    const result = await orca.host.call("workspace.list", {});
    const w = result.workspaces.find((w2) => w2.id === workspaceId);
    const matches = result.workspaces.filter(
      (candidate) => candidate.name === context?.displayName && (candidate.branch ?? "") === context?.branch
    );
    if (result.truncated || matches.length !== 1 || !w || w.kind !== "worktree" || w.hostId !== null && w.hostId !== "local" || w.name !== context?.displayName || (w.branch ?? "") !== context?.branch || await repository(w.path) !== root)
      throw new Error(
        "\uD604\uC7AC \uC5F4\uB9B0 \uB85C\uCEEC \uC6CC\uD06C\uD2B8\uB9AC\uC640 \uBA85\uB839 \uB300\uC0C1\uC774 \uB2E4\uB985\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694."
      );
    return root;
  }
  const check = (root) => {
    if (!connected.has(root))
      throw new Error(
        "Git Logs \uC0AC\uC774\uB4DC\uBC14\uC5D0\uC11C \uC774 \uC800\uC7A5\uC18C\uC758 \uC6CC\uD06C\uD2B8\uB9AC\uB97C \uC5F4\uC5B4 \uC5F0\uACB0\uD558\uC138\uC694."
      );
    return root;
  };
  function handle(name, fn) {
    orca.panels.handle(name, async (raw) => {
      if (!raw || typeof raw !== "object" || Array.isArray(raw))
        throw new Error("\uC798\uBABB\uB41C \uC694\uCCAD\uC785\uB2C8\uB2E4.");
      return fn(raw);
    });
  }
  handle("active", async ({ all, workspaceId }) => {
    requireHost("workspace.list");
    requireHost("workspace.readContext");
    const context = await orca.host.call(
      "workspace.readContext",
      {}
    );
    const result = await orca.host.call("workspace.list", {});
    const local = result.workspaces.filter(
      (w) => w.kind === "worktree" && (w.hostId === null || w.hostId === "local")
    );
    const choice = (w) => ({
      id: w.id,
      name: w.name,
      path: w.path,
      branch: w.branch
    });
    const matches = context ? result.workspaces.filter(
      (w) => w.name === context.displayName && (w.branch ?? "") === context.branch
    ) : [];
    const selected = workspaceId ? local.find((w) => w.id === workspaceId) : matches.length === 1 && !result.truncated ? local.find((w) => w.id === matches[0].id) : void 0;
    if (workspaceId && !selected)
      throw new Error("\uC120\uD0DD\uD55C \uB85C\uCEEC Git \uC6CC\uD06C\uD2B8\uB9AC\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    if (selected) {
      const root = await repository(selected.path);
      await setup(root);
      connected.add(root);
      return {
        status: "connected",
        repository: await log(root, all === true),
        workspace: choice(selected)
      };
    }
    const candidates = matches.length > 1 ? local.filter((w) => matches.some((m) => m.id === w.id)) : local;
    return {
      status: candidates.length ? "choose" : "unavailable",
      choices: candidates.map(choice),
      message: result.truncated ? "workspace \uBAA9\uB85D\uC774 \uC77C\uBD80\uB9CC \uC81C\uACF5\uB418\uC5B4 \uC790\uB3D9 \uC5F0\uACB0\uC744 \uD655\uC815\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." : matches.length > 1 ? "\uC774\uB984\uACFC \uBE0C\uB79C\uCE58\uAC00 \uAC19\uC740 workspace\uAC00 \uC5EC\uB7EC \uAC1C\uC785\uB2C8\uB2E4. \uC5F0\uACB0\uD560 \uC6CC\uD06C\uD2B8\uB9AC\uB97C \uC120\uD0DD\uD558\uC138\uC694." : matches.length === 1 ? "\uD604\uC7AC workspace\uB294 \uB85C\uCEEC Git \uC6CC\uD06C\uD2B8\uB9AC\uAC00 \uC544\uB2D9\uB2C8\uB2E4. SSH\uB294 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." : "\uD604\uC7AC workspace\uB97C \uC790\uB3D9\uC73C\uB85C \uC2DD\uBCC4\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB85C\uCEEC \uC6CC\uD06C\uD2B8\uB9AC\uB97C \uC120\uD0DD\uD558\uC138\uC694."
    };
  });
  handle(
    "log",
    async ({ repo, all, branchRef }) => log(check(repo), all === true, branchRef)
  );
  handle(
    "prepare",
    async ({ repo, workspaceId, operation }) => operations.prepare(await mutationRoot(repo, workspaceId), operation)
  );
  handle(
    "execute",
    async ({ repo, workspaceId, token, confirmation }) => operations.execute(
      await mutationRoot(repo, workspaceId),
      token,
      confirmation
    )
  );
  handle("changes", async ({ repo, comparison }) => {
    const root = check(repo);
    const warning = await setup(root);
    const result = await changes(root, comparison);
    const visibleDocuments = result.files.some(
      (file) => file.untracked && file.path.startsWith(".orca/git-logs/")
    );
    return {
      ...result,
      ...warning || visibleDocuments ? { setupWarning: warning ?? setupWarning } : {}
    };
  });
  handle(
    "diff",
    async ({ repo, comparison, path }) => diff(check(repo), comparison, path)
  );
  async function workspaces(root) {
    requireHost("workspace.list");
    const result = await orca.host.call("workspace.list", {});
    const matches = [];
    for (const w of result.workspaces)
      if (w.hostId === null || w.hostId === "local") {
        try {
          if (await realpath4(w.path) === root)
            matches.push({ id: w.id, name: w.name });
        } catch {
        }
      }
    return matches;
  }
  handle("workspaces", async ({ repo }) => workspaces(check(repo)));
  handle("open", async ({ descriptor, workspaceId }) => {
    requireHost("editor.open");
    requireHost("workspace.open");
    if (descriptor?.version !== 1)
      throw new Error("\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uBE44\uAD50 \uBB38\uC11C\uC785\uB2C8\uB2E4.");
    const root = check(descriptor.repo);
    if (!(await workspaces(root)).some((w) => w.id === workspaceId))
      throw new Error(
        "\uC5F0\uACB0\uD55C \uC800\uC7A5\uC18C\uC640 \uAC19\uC740 \uB85C\uCEEC Orca \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4\uB97C \uC120\uD0DD\uD558\uC138\uC694."
      );
    const set = await changes(root, descriptor.comparison);
    if (descriptor.path && !set.files.some((f) => f.path === descriptor.path))
      throw new Error("\uBCC0\uACBD \uD30C\uC77C\uC774 \uC0AC\uB77C\uC84C\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694.");
    const safe = {
      version: 1,
      repo: root,
      comparison: set.comparison,
      ...descriptor.path ? { path: descriptor.path } : {}
    };
    let directory = root;
    for (const part of [".orca", "git-logs"]) {
      directory = join2(directory, part);
      try {
        await mkdir(directory, { mode: 448 });
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
      const stat = await lstat4(directory);
      if (stat.isSymbolicLink() || !stat.isDirectory() || await realpath4(directory) !== directory)
        throw new Error(
          "\uBE44\uAD50 \uBB38\uC11C \uD3F4\uB354\uB294 \uC800\uC7A5\uC18C \uB0B4\uBD80\uC758 \uC2E4\uC81C \uB514\uB809\uD130\uB9AC\uC5EC\uC57C \uD569\uB2C8\uB2E4."
        );
    }
    let warning = await setup(root);
    const path = `.orca/git-logs/${randomUUID2()}.orcadiff`;
    try {
      await git(root, ["check-ignore", "--no-index", "--quiet", "--", path]);
    } catch {
      warning = setupWarning;
    }
    await writeFile(join2(root, path), JSON.stringify(safe, null, 2), {
      mode: 384,
      flag: "wx"
    });
    await orca.host.call("workspace.open", { workspaceId });
    const result = await orca.host.call("editor.open", {
      workspaceId,
      path
    });
    return { ...result, ...warning ? { setupWarning: warning } : {} };
  });
  orca.log("Git Logs worker ready (mutations require a prepared confirmation)");
}
export {
  activate as default
};

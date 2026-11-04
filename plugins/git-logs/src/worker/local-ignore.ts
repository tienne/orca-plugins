import { constants } from 'node:fs';
import { lstat, open, realpath } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { git, repository } from './git';

const rule = '/.orca/git-logs/';
const pending = new Map<string, Promise<void>>();
const maxBytes = 1024 * 1024;
const line = (value: Buffer) => value.toString('utf8').replace(/\n$/, '');

/** Ensure the exact local rule exists, preserving every existing byte. Git's
 * higher-priority ignore policies still apply; callers check actual filenames. */
export async function ensureLocalIgnore(
  path: string,
  io: { open: typeof open } = { open },
): Promise<void> {
  const root = await repository(path);
  const commonPath = resolve(
    root,
    line(await git(root, ['rev-parse', '--git-common-dir'])),
  );
  const reported = resolve(
    root,
    line(await git(root, ['rev-parse', '--git-path', 'info/exclude'])),
  );
  if (reported !== join(commonPath, 'info', 'exclude'))
    throw new Error('Git returned an unexpected local exclude path.');
  const common = await realpath(commonPath);
  const info = join(common, 'info');
  const target = join(info, 'exclude');
  const previous = pending.get(target) ?? Promise.resolve();
  const operation = previous
    .catch(() => {})
    .then(async () => {
      const parent = await lstat(info);
      if (
        !parent.isDirectory() ||
        parent.isSymbolicLink() ||
        (await realpath(info)) !== info
      )
        throw new Error(
          'Git info must be a real directory inside the common Git directory.',
        );
      if (!constants.O_NOFOLLOW)
        throw new Error(
          'Safe local exclude updates are unsupported on this host.',
        );
      const expected = await lstat(target);
      if (
        !expected.isFile() ||
        expected.isSymbolicLink() ||
        expected.nlink !== 1 ||
        expected.size > maxBytes
      )
        throw new Error(
          'Local exclude must be a small regular file without hard links.',
        );
      // No O_CREAT: a parent replacement must never create an outside file.
      const reader = await io.open(
        target,
        constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK,
      );
      let content: Buffer;
      try {
        const stat = await reader.stat();
        if (
          !stat.isFile() ||
          stat.nlink !== 1 ||
          stat.dev !== expected.dev ||
          stat.ino !== expected.ino
        )
          throw new Error('Local exclude changed while opening.');
        const buffer = Buffer.alloc(maxBytes + 1);
        let length = 0;
        while (length < buffer.length) {
          const { bytesRead } = await reader.read(
            buffer,
            length,
            buffer.length - length,
            length,
          );
          if (!bytesRead) break;
          length += bytesRead;
        }
        if (length > maxBytes)
          throw new Error('Local exclude file is too large.');
        content = buffer.subarray(0, length);
      } finally {
        await reader.close();
      }
      if (content.toString('utf8').split(/\r?\n/).includes(rule)) return;
      const writer = await io.open(
        target,
        constants.O_WRONLY |
          constants.O_APPEND |
          constants.O_NOFOLLOW |
          constants.O_NONBLOCK,
      );
      try {
        const stat = await writer.stat();
        const current = await lstat(target);
        const currentParent = await lstat(info);
        if (
          !stat.isFile() ||
          stat.nlink !== 1 ||
          stat.dev !== expected.dev ||
          stat.ino !== expected.ino ||
          !current.isFile() ||
          current.isSymbolicLink() ||
          current.nlink !== 1 ||
          current.dev !== expected.dev ||
          current.ino !== expected.ino ||
          !currentParent.isDirectory() ||
          currentParent.isSymbolicLink() ||
          currentParent.dev !== parent.dev ||
          currentParent.ino !== parent.ino ||
          (await realpath(info)) !== info
        )
          throw new Error('Local exclude path changed during setup.');
        const newline = content.includes(Buffer.from('\r\n')) ? '\r\n' : '\n';
        const prefix =
          !content.length || content.at(-1) === 10
            ? ''
            : content.at(-1) === 13
              ? '\n'
              : newline;
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

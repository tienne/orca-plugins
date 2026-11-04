import { readdir, lstat } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
// Only reviewed browser/text assets are shipped. WASM/native/archive additions
// require an explicit policy review before extending this allowlist.
const extensions = new Set([
  '.html',
  '.js',
  '.css',
  '.json',
  '.md',
  '.txt',
  '.ttf',
  '.woff',
  '.woff2',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.ico',
]);
export async function validateArtifact(root) {
  let count = 0;
  let bytes = 0;
  async function walk(dir) {
    for (const name of await readdir(dir)) {
      const path = join(dir, name);
      const info = await lstat(path);
      if (info.isSymbolicLink())
        throw new Error(`Artifact symlink refused: ${relative(root, path)}`);
      if (info.isDirectory()) {
        if (name === 'node_modules')
          throw new Error('Artifact must not contain node_modules');
        await walk(path);
        continue;
      }
      if (!info.isFile() || info.mode & 0o111)
        throw new Error(
          `Executable/special artifact refused: ${relative(root, path)}`,
        );
      if (name !== 'LICENSE' && !extensions.has(extname(name)))
        throw new Error(`Unreviewed artifact type: ${relative(root, path)}`);
      count++;
      bytes += info.size;
    }
  }
  await walk(root);
  if (count > 2000 || bytes > 50 * 1024 * 1024)
    throw new Error('Artifact exceeds Orca package limits');
  return { count, bytes };
}

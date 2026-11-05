import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  writeFile,
  symlink,
  chmod,
  rm,
} from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateArtifact } from './validate-plugin-artifact.mjs';
async function fixture(run) {
  const root = await mkdtemp(join(tmpdir(), 'artifact-test-'));
  try {
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
test('artifact accepts self-contained JS, styles, images and licenses', () =>
  fixture(async (root) => {
    for (const name of [
      'worker.js',
      'index.html',
      'icon.png',
      'LICENSE',
      'notice.txt',
    ])
      await writeFile(join(root, name), 'fixture');
    assert.deepEqual(await validateArtifact(root), { count: 5, bytes: 35 });
  }));
test('artifact rejects links, executables, archives, native modules, fonts, unreviewed WASM and node_modules', async () => {
  for (const name of [
    'link.js',
    'executable.js',
    'native.node',
    'archive.zip',
    'runtime.wasm',
    'font.ttf',
    'font.woff',
    'font.woff2',
    'node_modules',
  ])
    await fixture(async (root) => {
      const path = join(root, name);
      if (name === 'link.js') await symlink('/etc/passwd', path);
      else if (name === 'node_modules') await mkdir(path);
      else {
        await writeFile(path, 'fixture');
        if (name === 'executable.js') await chmod(path, 0o755);
      }
      await assert.rejects(validateArtifact(root));
    });
});

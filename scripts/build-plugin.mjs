import { build as viteBuild } from 'vite';
import { build as esbuild } from 'esbuild';
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { isBuiltin } from 'node:module';
import { validateArtifact } from './validate-plugin-artifact.mjs';
const plugin = process.argv[2];
if (plugin !== 'git-logs') throw new Error(`Unknown plugin: ${plugin}`);
const source = resolve('plugins', plugin);
const output = resolve('dist/plugins', plugin);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await viteBuild({ configFile: resolve(source, 'vite.config.ts') });
const worker = await esbuild({
  metafile: true,
  entryPoints: [resolve(source, 'src/worker/main.ts')],
  outfile: resolve(output, 'worker.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
});
await copyFile(
  resolve(source, 'orca-plugin.json'),
  resolve(output, 'orca-plugin.json'),
);
await copyFile(resolve(source, 'README.md'), resolve(output, 'README.md'));
await copyFile(resolve('LICENSE'), resolve(output, 'LICENSE'));
await writeFile(
  resolve(output, 'package.json'),
  JSON.stringify({ private: true, type: 'module' }) + '\n',
);
for (const file of Object.values(worker.metafile.outputs)) {
  for (const dependency of file.imports)
    if (dependency.external && !isBuiltin(dependency.path))
      throw new Error(`Unbundled runtime dependency: ${dependency.path}`);
}

await mkdir(resolve(output, 'licenses'), { recursive: true });
for (const name of ['monaco-editor', 'react', 'react-dom']) {
  await copyFile(
    resolve(source, 'node_modules', name, 'LICENSE'),
    resolve(output, 'licenses', `${name}.txt`),
  );
}
await copyFile(
  resolve(source, 'node_modules/monaco-editor/ThirdPartyNotices.txt'),
  resolve(output, 'licenses/monaco-third-party.txt'),
);

const artifact = await validateArtifact(output);
console.log(
  `Packaged ${plugin}: ${output} (${artifact.count} files, ${artifact.bytes} bytes; self-contained artifact checks passed)`,
);

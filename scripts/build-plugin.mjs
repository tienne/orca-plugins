import { build as viteBuild } from 'vite';
import { build as esbuild } from 'esbuild';
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { isBuiltin } from 'node:module';
import { validateArtifact } from './validate-plugin-artifact.mjs';
const plugin = process.argv[2];
if (!['git-logs', 'landmark-island'].includes(plugin))
  throw new Error(`Unknown plugin: ${plugin}`);
const source = resolve(
  'plugins',
  plugin === 'landmark-island' ? 'orcatopia' : plugin,
);
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
for (const file of ['README.md', 'README.ko.md']) {
  await copyFile(resolve(source, file), resolve(output, file));
}
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
for (const name of plugin === 'git-logs'
  ? ['monaco-editor', 'react', 'react-dom']
  : []) {
  await copyFile(
    resolve(source, 'node_modules', name, 'LICENSE'),
    resolve(output, 'licenses', `${name}.txt`),
  );
}
if (plugin === 'git-logs')
  await copyFile(
    resolve(source, 'node_modules/monaco-editor/ThirdPartyNotices.txt'),
    resolve(output, 'licenses/monaco-third-party.txt'),
  );

if (plugin === 'git-logs') {
  // 플러그인 페이지 이미지. 스크린샷 원본은 docs/screenshots에 한 벌만 두고 패키징할 때 복사한다.
  await mkdir(resolve(output, 'assets'), { recursive: true });
  await copyFile(
    resolve(source, 'assets/git-logs-icon.png'),
    resolve(output, 'assets/git-logs-icon.png'),
  );
  for (const [from, to] of [
    ['git-logs-hero.png', 'git-logs-cover.png'],
    ['git-logs-dark.png', 'git-logs-dark.png'],
    ['git-logs-light.png', 'git-logs-light.png'],
    ['git-logs-commit-menu.png', 'git-logs-commit-menu.png'],
  ])
    await copyFile(
      resolve('docs/screenshots', from),
      resolve(output, 'assets', to),
    );
}

if (plugin === 'landmark-island') {
  await copyFile(
    resolve(source, 'licenses/weather.txt'),
    resolve(output, 'licenses/weather.txt'),
  );
  await copyFile(
    resolve(source, 'licenses/geography.txt'),
    resolve(output, 'licenses/geography.txt'),
  );
  await copyFile(
    resolve(source, 'licenses/heritage.txt'),
    resolve(output, 'licenses/heritage.txt'),
  );
  // README images use the same relative paths in source and installed artifacts.
  await mkdir(resolve(output, 'assets'), { recursive: true });
  for (const name of [
    'orcatopia-introduction.png',
    'orcatopia-introduction.ko.png',
    'orcatopia-icon.png',
    'orcatopia-island.png',
    'orcatopia-introduction-v0.4.0.png',
    'orcatopia-island-v0.4.0.png',
    'orcatopia-wonders-v0.4.0.png',
    'orcatopia-fusion-v0.4.0.png',
    'orcatopia-introduction-v0.4.0.ko.png',
    'orcatopia-island-v0.4.0.ko.png',
    'orcatopia-wonders-v0.4.0.ko.png',
    'orcatopia-fusion-v0.4.0.ko.png',
  ])
    await copyFile(
      resolve(source, 'assets', name),
      resolve(output, 'assets', name),
    );
}

const artifact = await validateArtifact(output);
console.log(
  `Packaged ${plugin}: ${output} (${artifact.count} files, ${artifact.bytes} bytes; self-contained artifact checks passed)`,
);

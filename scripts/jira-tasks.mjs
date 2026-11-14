import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { validateArtifact } from './validate-plugin-artifact.mjs';

const source = resolve('plugins/jira-tasks');
const output = resolve('dist/plugins/jira-tasks');
const cli =
  process.env.ORCA_CLI_COMMAND ||
  (process.platform === 'darwin' &&
  existsSync('/Applications/Orca.app/Contents/Resources/bin/orca')
    ? '/Applications/Orca.app/Contents/Resources/bin/orca'
    : process.platform === 'linux'
      ? 'orca-ide'
      : 'orca');
const run = (file, args) => execFileSync(file, args, { stdio: 'inherit' });
switch (process.argv[2]) {
  case 'build':
    await rm(output, { recursive: true, force: true });
    await mkdir(output, { recursive: true });
    for (const [entry, platform] of [
      ['frame', 'browser'],
      ['worker', 'node'],
    ]) {
      await build({
        entryPoints: [resolve(source, `src/${entry}.ts`)],
        outfile: resolve(output, `${entry}.js`),
        bundle: true,
        format: 'esm',
        platform,
        target: 'es2022',
        external: ['orca', 'orca/*'],
        tsconfigRaw: { compilerOptions: { target: 'ES2022' } },
      });
    }
    for (const file of ['index.html', 'frame.css'])
      await copyFile(resolve(source, 'src', file), resolve(output, file));
    for (const file of ['orca-plugin.json', 'README.md', 'README.ko.md'])
      await copyFile(resolve(source, file), resolve(output, file));
    if (existsSync(resolve(source, 'assets')))
      await cp(resolve(source, 'assets'), resolve(output, 'assets'), {
        recursive: true,
      });
    await copyFile(resolve('LICENSE'), resolve(output, 'LICENSE'));
    await writeFile(
      resolve(output, 'package.json'),
      JSON.stringify({ private: true, type: 'module' }) + '\n',
    );
    console.log('Jira Tasks artifact:', await validateArtifact(output));
    break;
  case 'typecheck':
    run(cli, ['plugin', 'types', source, '--json']);
    run(process.execPath, [
      resolve('node_modules/typescript/bin/tsc'),
      '-p',
      source,
    ]);
    break;
  case 'test':
    run(cli, ['plugin', 'test', source, '--json']);
    break;
  case 'ui-test':
    run(process.execPath, [
      resolve('node_modules/@playwright/test/cli.js'),
      'test',
      '--config',
      resolve(source, 'playwright.config.ts'),
    ]);
    run(cli, ['plugin', 'check', output, '--json']);
    break;
  case 'validate':
    run(cli, ['plugin', 'validate', output, '--json']);
    break;
  case 'screenshots':
    run(process.execPath, [
      resolve('node_modules/@playwright/test/cli.js'),
      'test',
      '--config',
      resolve(source, 'showcase.config.ts'),
    ]);
    break;
  case 'serve': {
    const { createServer } = await import('node:http');
    const { readFile } = await import('node:fs/promises');
    createServer(async (request, response) => {
      const name = request.url === '/' ? 'index.html' : request.url?.slice(1);
      if (!['index.html', 'frame.js', 'frame.css'].includes(name)) {
        response.writeHead(404).end();
        return;
      }
      response.setHeader(
        'Content-Type',
        name.endsWith('.js')
          ? 'text/javascript'
          : name.endsWith('.css')
            ? 'text/css'
            : 'text/html',
      );
      response.end(await readFile(resolve(output, name)));
    }).listen(43281, '127.0.0.1');
    break;
  }
  default:
    throw new Error(
      'Expected build, typecheck, test, ui-test, screenshots or validate.',
    );
}

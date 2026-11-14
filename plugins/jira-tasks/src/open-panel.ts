import { execFile } from 'node:child_process';
import { cliExecutable } from './jira';

export async function openPanel(signal: AbortSignal): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    execFile(
      cliExecutable(),
      [
        'plugin',
        'open',
        'local.jira-tasks',
        '--panel',
        'jira-tasks',
        '--environment',
        'local',
        '--json',
      ],
      {
        signal,
        timeout: 10000,
        maxBuffer: 512 * 1024,
        windowsHide: true,
      },
      (error, stdout) => {
        try {
          const answer = JSON.parse(stdout);
          if (error || answer.ok !== true) {
            reject(
              new Error(
                answer.error?.message ||
                  'Could not open Jira Tasks. Open a workspace and try again.',
              ),
            );
            return;
          }
          resolve();
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
}

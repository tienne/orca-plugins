import type { OrcaWorkerApi } from 'orca/worker';
import { openPanel } from './open-panel';
import { createAvatarLoader } from './avatar';
import { createJiraClient } from './jira';

export default function activate(orca: OrcaWorkerApi): void {
  orca.commands.register('jira-tasks.open', (_args, { signal }) =>
    openPanel(signal),
  );
  const jira = createJiraClient();
  const avatar = createAvatarLoader();
  orca.panels.handle('jira.avatar', (input, { signal }) =>
    avatar(input, signal),
  );
  orca.panels.handle('jira.connection', (_input, { signal }) =>
    jira.connection(signal),
  );
  orca.panels.handle('jira.list', (input, { signal }) =>
    jira.list(input, signal),
  );
  orca.panels.handle('jira.children', (input, { signal }) =>
    jira.children(input, signal),
  );
  orca.panels.handle('jira.issue', (input, { signal }) =>
    jira.issue(input, signal),
  );
}

import type { WorkerApi } from '../protocol';
export default function activate(orca: WorkerApi): void {
  orca.panels.handle('plugin.info', () => ({ name: 'Git Tools', version: '0.1.0' }));
  orca.log('Git Tools worker ready');
}

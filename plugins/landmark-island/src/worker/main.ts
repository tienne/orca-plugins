import { randomInt } from 'node:crypto';
import { Game, type State } from '../game';
// Narrow contracts from the installed Orca authoring reference; generated types
// are unavailable in this host installation. No event path is ever accessed.
interface Worker {
  host: { call(name: string, input: unknown): Promise<any> };
  events: {
    on(
      name: string,
      fn: (event: { workspaceId: string; kind: string }) => Promise<void>,
    ): unknown;
  };
  panels: {
    handle(name: string, fn: (input: unknown) => Promise<unknown>): unknown;
    post(name: string, data: unknown): Promise<unknown>;
  };
  log(message: string): void;
}
export default function activate(orca: Worker) {
  const game = new Game(
    {
      read: async () =>
        (await orca.host.call('storage.get', { key: 'island-v1' })).value,
      write: async (value: State) => {
        await orca.host.call('storage.set', { key: 'island-v1', value });
      },
    },
    () => randomInt(0, 2 ** 32) / 2 ** 32,
  );
  const notify = async () => {
    try {
      await orca.panels.post('island.changed', {});
    } catch (e) {
      orca.log(`Island saved; panel notification failed: ${String(e)}`);
    }
  };
  orca.events.on('workspace.created', async (event) => {
    await game.acquire(event);
    await notify();
  });
  orca.panels.handle('island.read', () => game.snapshot());
  orca.panels.handle('island.draw', async (input) => {
    const state = await game.redeem(input);
    await notify();
    return state;
  });
  orca.panels.handle('island.place', async (input) => {
    const state = await game.place(input);
    await notify();
    return state;
  });
}

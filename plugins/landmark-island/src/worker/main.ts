import { randomInt } from 'node:crypto';
import { WeatherService } from './weather';
import { ExpeditionLog } from './expeditions';
import { Game, type State } from '../game';
// Narrow contracts from the installed Orca authoring reference; generated types
// are unavailable in this host installation. No event path is ever accessed.
interface Worker {
  host: { call(name: string, input: unknown): Promise<any> };
  events: {
    on(
      name: 'workspace.created',
      fn: (event: { workspaceId: string; kind: string }) => Promise<void>,
    ): unknown;
    on(
      name: 'agent.status.changed',
      fn: (event: unknown) => Promise<void>,
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
      readBackup: async () =>
        (
          await orca.host.call('storage.get', {
            key: 'island-before-restore-v1',
          })
        ).value,
      writeBackup: async (value: State) => {
        await orca.host.call('storage.set', {
          key: 'island-before-restore-v1',
          value,
        });
      },
    },
    () => randomInt(0, 2 ** 32) / 2 ** 32,
  );
  const weather = new WeatherService({
    read: async (key) => (await orca.host.call('storage.get', { key })).value,
    write: async (key, value) => {
      await orca.host.call('storage.set', { key, value });
    },
  });
  // Request-driven only: no network on activation or while all panels are closed.
  orca.panels.handle('island.weather', (input) => weather.read(input));
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
  orca.panels.handle('island.backup', (input) =>
    game.exportBackup(
      (input as { previous?: unknown } | null)?.previous === true,
    ),
  );
  orca.panels.handle('island.restore', async (input) => {
    const state = await game.restore(input);
    await notify();
    return state;
  });
  orca.panels.handle('island.draw', async (input) => {
    const state = await game.redeem(input);
    await notify();
    return state;
  });
  orca.panels.handle('island.drawMany', async (input) => {
    const state = await game.redeemMany(input);
    await notify();
    return state;
  });
  orca.panels.handle('island.craft', async (input) => {
    const state = await game.craft(input);
    await notify();
    return state;
  });
  for (const [name, handler] of [
    ['island.layout', (input: unknown) => game.replaceLayout(input)],
    ['island.paint', (input: unknown) => game.paint(input)],
    ['island.rotate', (input: unknown) => game.rotate(input)],
  ] as const) {
    orca.panels.handle(name, async (input) => {
      const state = await handler(input);
      await notify();
      return state;
    });
  }
  orca.panels.handle('island.decorate', async (input) => {
    const state = await game.decorate(input);
    await notify();
    return state;
  });
  orca.panels.handle('island.place', async (input) => {
    const state = await game.place(input);
    await notify();
    return state;
  });
  const expeditions = new ExpeditionLog({
    read: async () =>
      (await orca.host.call('storage.get', { key: 'expeditions-v1' })).value,
    write: async (value) => {
      await orca.host.call('storage.set', { key: 'expeditions-v1', value });
    },
  });
  const notifyExpeditions = async () => {
    try {
      await orca.panels.post('island.expeditions.changed', {});
    } catch {
      orca.log('Expedition saved; panel notification unavailable.');
    }
  };
  orca.events.on('agent.status.changed', async (event) => {
    if (await expeditions.observe(event)) await notifyExpeditions();
  });
  orca.panels.handle('island.expeditions', () => expeditions.read());
  orca.panels.handle('island.welcome', async (input) => {
    const records = await expeditions.welcome(input);
    await notifyExpeditions();
    return records;
  });
}

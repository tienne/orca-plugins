import { createHash } from 'node:crypto';
import {
  observeExpedition,
  readExpeditions,
  type ExpeditionState,
  type Expedition,
} from '../expeditions';

type Storage = {
  read(): Promise<unknown>;
  write(records: Expedition[]): Promise<void>;
};

/** 에이전트 상태와 맞이하기 기록을 수집품 저장소와 분리해 직렬 처리한다. */
export class ExpeditionLog {
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private storage: Storage) {}
  private serial<T>(operation: () => Promise<T>): Promise<T> {
    const next = this.queue.then(operation, operation);
    this.queue = next.catch(() => {});
    return next;
  }
  /** 패널을 열었을 때만 별도 생활 기록을 읽는다. */
  read() {
    return this.serial(async () => readExpeditions(await this.storage.read()));
  }
  /** 프롬프트나 터미널 출력 없이 상태 이벤트만 받아들인다. */
  observe(input: unknown) {
    return this.serial(async () => {
      if (!input || typeof input !== 'object') return false;
      const event = input as Record<string, unknown>;
      if (
        typeof event.workspaceId !== 'string' ||
        !event.workspaceId ||
        event.workspaceId.length > 4096 ||
        typeof event.paneKey !== 'string' ||
        !event.paneKey ||
        event.paneKey.length > 1024 ||
        !Number.isSafeInteger(event.receivedAt) ||
        Number(event.receivedAt) < 0 ||
        Number(event.receivedAt) > Date.now() + 300000
      )
        return false;
      const main =
        event.mainAgent && typeof event.mainAgent === 'object'
          ? (event.mainAgent as Record<string, unknown>)
          : undefined;
      const state = main?.state ?? event.state;
      if (!['working', 'blocked', 'waiting', 'done'].includes(String(state)))
        return false;
      const id = createHash('sha256')
        .update(JSON.stringify([event.workspaceId, event.paneKey]))
        .digest('hex')
        .slice(0, 32);
      const records = readExpeditions(await this.storage.read());
      const next = observeExpedition(
        records,
        id,
        state as ExpeditionState,
        Number(event.receivedAt),
        typeof main?.outcome === 'string' ? main.outcome : undefined,
        typeof event.title === 'string' ? event.title : '',
      );
      if (next === records) return false;
      await this.storage.write(next);
      return true;
    });
  }
  /** 현재 귀환 후보를 확인한 클릭만 한 번 기록한다. */
  welcome(input: unknown) {
    return this.serial(async () => {
      const run = (input as { run?: unknown } | null)?.run;
      const records = readExpeditions(await this.storage.read());
      const candidate = records.find(
        (e) => e.run === run && (e.pending || e.welcomed),
      );
      if (!candidate)
        throw new Error('This expedition is no longer waiting to be welcomed.');
      if (candidate.welcomed) return records;
      const next = records.map((e) =>
        e === candidate ? { ...e, pending: false, welcomed: true } : e,
      );
      await this.storage.write(next);
      return next;
    });
  }
}

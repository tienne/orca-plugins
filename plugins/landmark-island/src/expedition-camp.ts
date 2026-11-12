import { readExpeditions, type Expedition } from './expeditions';
import { residentArt } from './island-life-art';
import { islandLand, type State } from './game';
import { decorationById } from './decorations';
import { project, solidProps } from './world';

const status = (e: Expedition) =>
  e.pending
    ? 'Awaiting your welcome'
    : e.welcomed
      ? 'Back at camp'
      : {
          working: 'On an expedition',
          waiting: 'Waiting for a reply',
          blocked: 'Needs a hand',
          done: 'Expedition ended',
        }[e.state];
const boat =
  '<svg viewBox="0 0 160 100" aria-hidden="true"><ellipse cx="80" cy="85" rx="64" ry="8" fill="#b8e0d5" opacity=".35"/><path d="M19 61h121l-16 19H38z" fill="#ab8056" stroke="#695c43" stroke-width="2"/><path d="M80 15v49" stroke="#8c7754" stroke-width="3"/><path d="M76 18L38 55h38z" fill="#f5e8bc"/><path d="M85 22l29 33H85z" fill="#c4d4a5"/><path d="M80 15l18 3-18 7" fill="#7ca696"/><circle cx="59" cy="51" r="6" fill="#e6c399"/><path d="M51 61v-7h16v7" fill="#759b72"/><path class="expedition-welcome-arm" d="M65 54l9-10" stroke="#e6c399" stroke-width="4" stroke-linecap="round"/></svg>';

/** 상태 이벤트를 작은 탐험대와 명시적인 귀환 확인으로 보여준다. */
export class ExpeditionCamp {
  private records: Expedition[] = [];
  private root?: HTMLElement;
  private state?: State;
  private busy = false;
  private pending = false;
  private ground?: HTMLElement;
  private panel?: HTMLDetailsElement;
  private actors = new Map<string, HTMLElement>();
  private celebration?: HTMLElement;
  private celebrateUntil = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private revision = 0;
  constructor(
    private welcome: (run: string) => Promise<unknown>,
    private fixture = false,
  ) {}

  async refresh(read: () => Promise<unknown>) {
    const revision = ++this.revision;
    try {
      const value = await read();
      if (revision !== this.revision) return;
      this.records = readExpeditions(value);
      this.paint();
    } catch {
      if (revision !== this.revision || !this.panel) return;
      const note = this.panel.querySelector('.expedition-note');
      if (note)
        note.textContent = 'Expedition status unavailable. Try again later.';
    }
  }

  /** 섬의 땅과 메뉴를 유지한 채 대원의 표현만 다시 연결한다. */
  bind(root: HTMLElement, state: State, busy: boolean) {
    this.root = root;
    this.state = state;
    this.busy = busy;
    const ground = root.querySelector<HTMLElement>('.world-ground');
    if (ground !== this.ground) {
      this.panel?.remove();
      this.panel = undefined;
      this.actors.clear();
      this.celebration?.remove();
      this.celebration = undefined;
      clearTimeout(this.timer);
      this.celebrateUntil = 0;
      this.ground = ground ?? undefined;
    }
    this.paint();
  }

  private paint() {
    const ocean = this.root?.querySelector<HTMLElement>('.ocean');
    if (!ocean || !this.ground || !this.state) return;
    if (!this.panel?.isConnected) {
      this.panel = document.createElement('details');
      this.panel.className = 'expedition-camp';
      this.panel.innerHTML =
        '<summary></summary><div class="expedition-list"></div><p class="expedition-note"></p>';
      for (const event of ['pointerdown', 'wheel', 'keydown'])
        this.panel.addEventListener(event, (e) => e.stopPropagation());
      ocean.append(this.panel);
    }
    const visible = [...this.records]
      .sort(
        (a, b) =>
          Number(b.pending) - Number(a.pending) ||
          Number(a.state === 'done') - Number(b.state === 'done') ||
          b.updatedAt - a.updatedAt,
      )
      .slice(0, 6);
    this.panel.querySelector('summary')!.textContent =
      `Expedition crew · ${visible.length}`;
    const list = this.panel.querySelector('.expedition-list')!;
    const oldFocus =
      this.panel.querySelector<HTMLButtonElement>('button:focus')?.dataset
        .welcome;
    list.replaceChildren();
    const note = this.panel.querySelector<HTMLElement>('.expedition-note')!;
    note.textContent = this.fixture
      ? 'Preview crew · no real agent activity'
      : 'Status signals only. Confirm the result before welcoming a crew member.';
    if (!visible.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Your next agent expedition will appear here.';
      list.append(empty);
    }
    const live = new Set<string>();
    const occupied = new Set([
      14,
      ...this.state.placements.map((p) => p.cell),
      ...this.state.decorations
        .filter((p) => !decorationById(p.decoration)!.walkable)
        .map((p) => p.cell),
      ...[...solidProps].filter(
        (cell) =>
          !this.state!.placements.some((p) => p.cell === cell) &&
          !this.state!.decorations.some((p) => p.cell === cell) &&
          !this.state!.floors.some((p) => p.cell === cell),
      ),
    ]);
    const cells = islandLand(this.state)
      .filter((tile) => !occupied.has(tile.id))
      .sort((a, b) => Math.abs(a.id - 14) - Math.abs(b.id - 14))
      .slice(0, 4);
    for (const [i, record] of visible.entries()) {
      const row = document.createElement('div');
      row.className = 'expedition-row';
      row.dataset.expeditionRun = record.run;
      row.dataset.expeditionState = record.pending ? 'returning' : record.state;
      const label = document.createElement('span');
      const name = document.createElement('span');
      name.textContent = record.name || `Crew member ${i + 1}`;
      if (record.name) name.setAttribute('translate', 'no');
      const state = document.createElement('span');
      state.textContent = status(record);
      label.append(name, ' · ', state);
      row.append(label);
      if (record.pending) {
        const button = document.createElement('button');
        button.textContent = 'Welcome home';
        button.dataset.welcome = record.run;
        button.disabled = this.busy || this.pending;
        button.onclick = () => void this.receive(record);
        row.append(button);
      }
      list.append(row);
      if (i >= cells.length) continue;
      live.add(record.id);
      let actor = this.actors.get(record.id);
      if (!actor) {
        actor = document.createElement('div');
        actor.className = 'expedition-member';
        actor.setAttribute('aria-hidden', 'true');
        actor.innerHTML =
          residentArt(
            (['visitor', 'gardener', 'photographer'] as const)[i % 3],
          ) + '<span class="expedition-signal"></span>';
        this.ground.append(actor);
        this.actors.set(record.id, actor);
      }
      const point = project(cells[i].id);
      actor.dataset.expeditionActor = record.id;
      actor.dataset.state = record.pending ? 'returning' : record.state;
      actor.style.cssText = `left:${point.x}px;top:${point.y}px;z-index:${point.depth + 2};--member-delay:-${i * 0.3}s`;
      actor.querySelector('.expedition-signal')!.textContent = record.pending
        ? '⚑'
        : record.state === 'blocked'
          ? '?'
          : record.state === 'waiting'
            ? '…'
            : '⌁';
    }
    for (const [id, actor] of this.actors)
      if (!live.has(id)) {
        actor.remove();
        this.actors.delete(id);
      }
    if (oldFocus)
      list
        .querySelector<HTMLButtonElement>(`button[data-welcome="${oldFocus}"]`)
        ?.focus({ preventScroll: true });
    if (this.celebrateUntil > Date.now() && !this.celebration?.isConnected)
      this.showBoat();
  }

  private async receive(record: Expedition) {
    if (this.pending || this.busy) return;
    this.pending = true;
    const revision = this.revision;
    this.paint();
    try {
      const value = await this.welcome(record.run);
      if (revision === this.revision) {
        ++this.revision;
        this.records = readExpeditions(value);
      }
      this.celebrateUntil = Date.now() + 8000;
      this.showBoat();
      this.paint();
      this.panel?.querySelector('summary')?.focus({ preventScroll: true });
    } catch {
      const note = this.panel?.querySelector('.expedition-note');
      if (note)
        note.textContent =
          'Could not welcome this expedition. Refresh its status and try again.';
    } finally {
      this.pending = false;
      this.panel
        ?.querySelectorAll<HTMLButtonElement>('button')
        .forEach((b) => (b.disabled = this.busy));
    }
  }

  private showBoat() {
    const ocean = this.root?.querySelector('.ocean');
    if (!ocean) return;
    this.celebration?.remove();
    clearTimeout(this.timer);
    this.celebration = document.createElement('div');
    this.celebration.className = 'expedition-homecoming';
    this.celebration.setAttribute('role', 'status');
    this.celebration.innerHTML = boat;
    const caption = document.createElement('span');
    caption.textContent = 'Welcome back, explorer!';
    this.celebration.append(caption);
    ocean.append(this.celebration);
    this.timer = setTimeout(
      () => {
        this.celebration?.remove();
        this.celebration = undefined;
      },
      Math.max(0, this.celebrateUntil - Date.now()),
    );
  }
}

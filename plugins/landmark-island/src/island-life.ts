import { islandLand, type State } from './game';
import { decorationById } from './decorations';
import { IslandAtmosphere } from './island-atmosphere';
import { at, neighbours, project, tiles, WORLD_W, WORLD_H } from './world';
import { route } from './walk';
import {
  birdArt,
  butterflyArt,
  residentArt,
  type ResidentRole,
} from './island-life-art';

type Context = {
  ground: HTMLElement;
  state: State;
  blocked: ReadonlySet<number>;
  player: number;
  mode: 'walk' | 'build';
  busy: boolean;
};
type Resident = {
  element: HTMLElement;
  role: ResidentRole;
  cell: number;
  path: number[];
  wait: number;
  serial: number;
  arriving: boolean;
  subject?: number;
  purpose?: string;
  motionDepth?: number;
  motionUntil?: number;
};
type Critter = {
  element: HTMLElement;
  kind: 'bird' | 'butterfly';
  cell: number;
  home: number;
  until: number;
  cooldown: number;
  index: number;
};
const STEP_MS = 900;
const distance = (a: number, b: number) =>
  a < 0 || b < 0
    ? Infinity
    : Math.abs(tiles[a].col - tiles[b].col) +
      Math.abs(tiles[a].row - tiles[b].row);

/** 저장 데이터를 바꾸지 않고 섬의 생활 연출만 이어간다. */
export class IslandLife {
  private context?: Context;
  private ocean?: HTMLElement;
  private residents: Resident[] = [];
  private critters: Critter[] = [];
  private free = new Set<number>();
  private perches = new Set<number>();
  private flowers = new Set<number>();
  private media?: MediaQueryList;
  private listeners?: AbortController;
  private timer?: ReturnType<typeof setTimeout>;
  private nextStepAt = 0;
  private wind = new WeakSet<Animation>();
  private windOrigin = 0;
  private hiddenAt?: number;
  private climate = '';
  private atmosphere = new IslandAtmosphere();

  /** 화면을 갱신해도 주민의 경로와 동물의 상태를 이어간다. */
  bind(context: Context) {
    const changed = this.context?.ground !== context.ground;
    this.suspend();
    if (changed) {
      this.listeners?.abort();
      this.residents = [];
      this.critters = [];
      this.wind = new WeakSet();
      this.nextStepAt = 0;
      this.windOrigin = 0;
      this.hiddenAt = undefined;
      this.climate = '';
    }
    this.context = context;
    this.ocean = context.ground.closest<HTMLElement>('.ocean')!;
    this.media ??= matchMedia('(prefers-reduced-motion: reduce)');
    if (changed) {
      this.listeners = new AbortController();
      const { signal } = this.listeners;
      document.addEventListener('visibilitychange', () => this.activity(), {
        signal,
      });
      this.media.addEventListener('change', () => this.activity(), { signal });
      this.addWindField();
    }
    this.reconcile();
    this.synchronizeWind();
    this.climateChanged();
  }

  /** 날씨가 바뀌면 현재 작업을 멈추고 새 환경에 맞는 목적지를 찾는다. */
  climateChanged() {
    if (!this.context || !this.ocean) return;
    const weather = this.ocean.dataset.weather ?? 'sunny';
    if (weather !== this.climate) {
      this.climate = weather;
      for (const resident of this.residents) {
        resident.path = [];
        resident.arriving = false;
        resident.subject = undefined;
        resident.purpose = undefined;
        resident.wait = 0;
        resident.element.dataset.action = 'idle';
        this.positionResident(resident);
      }
    }
    this.activity();
  }

  /** 탐험가가 실제로 이동한 경우에만 주변 생물이 반응한다. */
  explorerMoved(cell: number) {
    const context = this.context;
    if (!context || context.player === cell) return;
    context.player = cell;
    for (const resident of this.residents) {
      if (resident.cell !== cell) continue;
      const taken = this.taken(resident);
      const next = neighbours(cell).find(
        (candidate) => this.free.has(candidate) && !taken.has(candidate),
      );
      if (next !== undefined) {
        resident.path = [];
        resident.arriving = false;
        resident.subject = undefined;
        resident.purpose = undefined;
        resident.wait = 2;
        this.moveResident(resident, next, 'yield');
      }
    }
    if (this.paused() || cell < 0) return;
    const now = Date.now();
    for (const critter of this.critters) {
      const behavior = critter.element.dataset.behavior;
      if (critter.kind === 'butterfly' && !this.butterflyWeather()) continue;
      if (behavior === 'follow') {
        this.follow(critter);
        continue;
      }
      if (
        !['idle', 'perched'].includes(behavior ?? '') ||
        now < critter.cooldown ||
        distance(cell, critter.cell) > (critter.kind === 'bird' ? 2 : 3)
      )
        continue;
      if (critter.kind === 'bird') {
        const taken = new Set(
          this.critters
            .filter((other) => other !== critter)
            .map((other) => other.cell),
        );
        const escape = [...this.perches, ...this.free]
          .filter(
            (candidate) =>
              !taken.has(candidate) &&
              distance(candidate, cell) >= 5 &&
              distance(candidate, critter.cell) <= 9,
          )
          .sort(
            (a, b) =>
              distance(a, critter.cell) -
              distance(b, critter.cell) -
              (this.perches.has(a) ? 0.5 : 0) +
              (this.perches.has(b) ? 0.5 : 0),
          )[0];
        if (escape === undefined) continue;
        critter.home = escape;
        critter.element.dataset.home = String(escape);
        critter.element.dataset.behavior = 'flee';
        critter.until = now + 3200;
        critter.cooldown = now + 11000;
        this.placeCritter(critter, escape, true);
      } else {
        critter.element.dataset.behavior = 'follow';
        critter.until = now + 4500;
        critter.cooldown = now + 12000;
        this.follow(critter);
      }
    }
    this.activity();
  }

  /** 진행 상태를 유지하면서 갱신 사이의 타이머만 해제한다. */
  suspend() {
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  /** 섬 화면을 닫으면 이벤트와 DOM 참조를 해제한다. */
  detach() {
    this.suspend();
    this.listeners?.abort();
    this.context = undefined;
    this.ocean = undefined;
    this.residents = [];
    this.critters = [];
  }

  private paused() {
    return (
      !this.context?.ground.isConnected ||
      document.hidden ||
      this.media?.matches ||
      this.context.mode !== 'walk' ||
      this.context.busy
    );
  }

  private butterflyWeather() {
    return !['rain', 'snow'].includes(this.ocean?.dataset.weather ?? '');
  }

  private activity() {
    this.suspend();
    if (!this.context?.ground.isConnected || !this.ocean) return;
    this.ocean.dataset.lifeHidden = String(document.hidden);
    const timeline = Number(document.timeline.currentTime ?? 0);
    if (document.hidden && this.hiddenAt === undefined)
      this.hiddenAt = timeline;
    else if (!document.hidden && this.hiddenAt !== undefined) {
      this.windOrigin += timeline - this.hiddenAt;
      this.hiddenAt = undefined;
      this.wind = new WeakSet();
      this.synchronizeWind();
    }
    this.ocean.dataset.lifePaused = String(Boolean(this.paused()));
    if (this.paused()) {
      for (const resident of this.residents) {
        resident.motionDepth = undefined;
        resident.motionUntil = undefined;
        this.positionResident(resident);
      }
      if (!document.hidden) {
        for (const critter of this.critters) {
          critter.element.dataset.behavior =
            critter.kind === 'bird' ? 'perched' : 'idle';
          this.placeCritter(critter, critter.home);
        }
      }
      return;
    }
    if (
      !this.residents.length &&
      !this.critters.some((critter) =>
        ['flee', 'follow', 'return'].includes(
          critter.element.dataset.behavior ?? '',
        ),
      )
    )
      return;
    if (!this.nextStepAt || this.nextStepAt < Date.now() - STEP_MS)
      this.nextStepAt = Date.now() + STEP_MS;
    this.timer = setTimeout(
      () => {
        this.tick();
        this.nextStepAt = Date.now() + STEP_MS;
        this.activity();
      },
      Math.max(0, this.nextStepAt - Date.now()),
    );
  }

  private reconcile() {
    const { state, blocked, player, ground } = this.context!;
    const land = islandLand(state);
    const objects = new Set(
      state.placements.map((placement) => placement.cell),
    );
    const floors = new Set(state.floors.map((placement) => placement.cell));
    const decorations = new Map(
      state.decorations.map((placement) => [
        placement.cell,
        decorationById(placement.decoration)!,
      ]),
    );
    this.free = new Set(
      land
        .filter((tile) => !blocked.has(tile.id) && tile.id !== 14)
        .map((tile) => tile.id),
    );
    this.perches = new Set(
      land
        .filter(
          (tile) =>
            !objects.has(tile.id) &&
            ((!floors.has(tile.id) &&
              !decorations.has(tile.id) &&
              ['pine', 'oak'].includes(tile.prop ?? '')) ||
              ['tree', 'palm'].includes(decorations.get(tile.id)?.shape ?? '')),
        )
        .map((tile) => tile.id),
    );
    this.flowers = new Set(
      land
        .filter(
          (tile) =>
            !objects.has(tile.id) &&
            ((!floors.has(tile.id) &&
              !decorations.has(tile.id) &&
              tile.prop === 'flowers') ||
              ['flowers', 'fernBed'].includes(
                decorations.get(tile.id)?.shape ?? '',
              )),
        )
        .map((tile) => tile.id),
    );
    const occupied = new Set([player]);
    for (const resident of this.residents) {
      if (!this.free.has(resident.cell) || occupied.has(resident.cell)) {
        const replacement = [...this.free].find((cell) => !occupied.has(cell));
        if (replacement === undefined) {
          resident.element.remove();
          continue;
        }
        resident.motionDepth = undefined;
        resident.motionUntil = undefined;
        resident.cell = replacement;
        resident.subject = undefined;
        resident.purpose = undefined;
        resident.element.dataset.action = 'idle';
        resident.path = [];
        resident.arriving = false;
        resident.wait = 1;
      }
      if (resident.path.some((cell) => blocked.has(cell))) {
        resident.path = [];
        resident.arriving = false;
        resident.wait = 1;
        resident.element.dataset.action = 'idle';
      }
      occupied.add(resident.cell);
      this.positionResident(resident);
    }
    this.residents = this.residents.filter(
      (resident) => resident.element.isConnected,
    );
    const roles: ResidentRole[] = ['gardener', 'photographer', 'visitor'];
    for (const role of roles) {
      if (this.residents.some((resident) => resident.role === role)) continue;
      const cell = [...this.free]
        .filter((candidate) => !occupied.has(candidate))
        .sort(
          (a, b) =>
            distance(a, player) -
            distance(b, player) +
            (tiles[a].kind === 'path' ? -0.75 : 0) -
            (tiles[b].kind === 'path' ? -0.75 : 0),
        )[0];
      if (cell === undefined) continue;
      const element = document.createElement('div');
      element.className = 'island-resident';
      element.dataset.lifeResident = role;
      element.dataset.action = 'idle';
      element.setAttribute('aria-hidden', 'true');
      element.innerHTML = residentArt(role);
      const resident = {
        element,
        role,
        cell,
        path: [],
        wait: roles.indexOf(role) + 1,
        serial: roles.indexOf(role),
        arriving: false,
      };
      this.positionResident(resident);
      ground.append(element);
      this.residents.push(resident);
      occupied.add(cell);
    }
    const habitats = new Set([...this.free, ...this.perches, ...this.flowers]);
    const used = new Set<number>();
    for (const critter of this.critters) {
      if (
        !habitats.has(critter.home) ||
        (critter.kind === 'butterfly' &&
          this.flowers.size > 0 &&
          !this.flowers.has(critter.home))
      ) {
        const home = this.chooseHome(critter.kind, used);
        if (home === undefined) {
          critter.element.remove();
          continue;
        }
        critter.home = home;
        critter.element.dataset.home = String(home);
        critter.element.dataset.behavior =
          critter.kind === 'bird' ? 'perched' : 'idle';
        this.placeCritter(critter, home);
      } else if (
        !['flee', 'follow', 'return'].includes(
          critter.element.dataset.behavior ?? '',
        )
      )
        this.placeCritter(critter, critter.home);
      used.add(critter.home);
    }
    this.critters = this.critters.filter(
      (critter) => critter.element.isConnected,
    );
    for (let index = 0; index < 5; index++) {
      if (this.critters.some((critter) => critter.index === index)) continue;
      const kind = index < 2 ? 'bird' : 'butterfly';
      const home = this.chooseHome(kind, used);
      if (home === undefined) continue;
      const element = document.createElement('div');
      element.className = 'island-critter';
      element.dataset.lifeCritter = `${kind}-${index}`;
      element.dataset.kind = kind;
      element.dataset.home = String(home);
      element.dataset.behavior = kind === 'bird' ? 'perched' : 'idle';
      element.setAttribute('aria-hidden', 'true');
      element.innerHTML =
        kind === 'bird'
          ? birdArt()
          : butterflyArt(['#d8b77d', '#c89494', '#94b9ae'][index - 2]);
      const critter = {
        element,
        kind,
        cell: home,
        home,
        until: 0,
        cooldown: 0,
        index,
      } as Critter;
      this.placeCritter(critter, home);
      ground.append(element);
      this.critters.push(critter);
      used.add(home);
    }
    this.waterRipples();
    this.atmosphere.reconcile(ground, state, [...this.flowers, ...this.free]);
    for (const resident of this.residents) {
      if (resident.subject === undefined) continue;
      const shape = decorations.get(resident.subject)?.shape;
      const valid =
        resident.purpose === 'water'
          ? this.flowers.has(resident.subject)
          : resident.purpose === 'shelter'
            ? this.perches.has(resident.subject) || shape === 'pavilion'
            : resident.purpose === 'sit'
              ? shape === 'bench'
              : objects.has(resident.subject) ||
                ['pond', 'fountain'].includes(shape ?? '');
      if (!valid) {
        resident.path = [];
        resident.arriving = false;
        resident.subject = undefined;
        resident.purpose = undefined;
        resident.wait = 0;
        resident.element.dataset.action = 'idle';
        this.positionResident(resident);
      }
    }
  }

  private chooseHome(kind: Critter['kind'], used: Set<number>) {
    const preferred = kind === 'bird' ? this.perches : this.flowers;
    const candidates = [...new Set([...preferred, ...this.free])].filter(
      (cell) => !used.has(cell) && distance(cell, this.context!.player) >= 3,
    );
    const planted = new Set(
      this.context!.state.decorations.filter((p) =>
        ['flowers', 'fernBed'].includes(
          decorationById(p.decoration)?.shape ?? '',
        ),
      ).map((p) => p.cell),
    );
    return candidates.sort(
      (a, b) =>
        (kind === 'butterfly'
          ? Number(planted.has(b)) - Number(planted.has(a))
          : 0) ||
        Number(preferred.has(b)) - Number(preferred.has(a)) ||
        distance(a, this.context!.player) - distance(b, this.context!.player),
    )[0];
  }

  private taken(resident: Resident) {
    return new Set([
      this.context!.player,
      ...this.residents
        .filter((other) => other !== resident)
        .map((other) => other.cell),
    ]);
  }

  private plan(resident: Resident) {
    const context = this.context!;
    const wet = ['rain', 'snow'].includes(this.climate);
    const decorations = context.state.decorations;
    const shelters = [
      ...this.perches,
      ...decorations
        .filter((p) => decorationById(p.decoration)?.shape === 'pavilion')
        .map((p) => p.cell),
    ];
    const furnishings = decorations.filter((p) =>
      (resident.role === 'visitor' ? ['bench'] : ['pond', 'fountain']).includes(
        decorationById(p.decoration)?.shape ?? '',
      ),
    );
    const occupiedSubjects = new Set(
      this.residents
        .filter((other) => other !== resident && other.purpose === 'sit')
        .map((other) => other.subject),
    );
    const anchors = wet
      ? shelters.map((cell) => ({ cell, purpose: 'shelter' }))
      : resident.role === 'gardener'
        ? [...this.flowers].map((cell) => ({ cell, purpose: 'water' }))
        : [
            ...furnishings
              .filter((p) => !occupiedSubjects.has(p.cell))
              .map((p) => ({
                cell: p.cell,
                purpose: resident.role === 'visitor' ? 'sit' : 'photo',
              })),
            ...context.state.placements.map((p) => ({
              cell: p.cell,
              purpose: resident.role === 'photographer' ? 'photo' : 'look',
            })),
          ];
    const destinations = anchors.flatMap((anchor) =>
      neighbours(anchor.cell)
        .filter(
          (cell) => this.free.has(cell) && distance(cell, resident.cell) <= 10,
        )
        .map((cell) => ({ ...anchor, goal: cell })),
    );
    const fallback = [...this.free].filter(
      (cell) =>
        distance(cell, resident.cell) >= 3 &&
        distance(cell, resident.cell) <= 8,
    );
    const blocked = new Set([...context.blocked, 14, ...this.taken(resident)]);
    // 발견 추첨에 영향을 주지 않도록 생활 연출은 난수를 소모하지 않는다.
    resident.serial++;
    resident.subject = undefined;
    resident.purpose = undefined;
    for (const pool of [
      destinations,
      fallback.map((goal) => ({ goal, cell: goal, purpose: 'look' })),
    ]) {
      for (let i = 0; i < Math.min(24, pool.length); i++) {
        const candidate = pool[(resident.serial * 7 + i) % pool.length];
        const goal = candidate.goal;
        if (blocked.has(goal)) continue;
        const path =
          goal === resident.cell ? [] : route(resident.cell, goal, blocked);
        if ((goal === resident.cell || path.length) && path.length <= 18) {
          resident.subject = candidate.cell;
          resident.purpose = candidate.purpose;
          if (goal === resident.cell) resident.arriving = true;
          return path;
        }
      }
    }
    return [];
  }

  private moveResident(resident: Resident, cell: number, action = 'walk') {
    // 칸을 건너는 동안 두 바닥 중 하나가 주민의 발을 덮지 않게 한다.
    resident.motionDepth = Math.max(
      resident.motionDepth ?? project(resident.cell).depth,
      project(resident.cell).depth,
      project(cell).depth,
    );
    resident.motionUntil = Date.now() + STEP_MS;
    resident.element.dataset.facing =
      project(cell).x < project(resident.cell).x ? 'left' : 'right';
    resident.cell = cell;
    resident.element.dataset.action = action;
    this.positionResident(resident);
  }

  private positionResident(resident: Resident) {
    const point = project(resident.cell);
    const seated =
      resident.element.dataset.action === 'sit' &&
      resident.subject !== undefined;
    const seat = seated ? project(resident.subject!) : point;
    resident.element.style.setProperty('--seat-x', `${seat.x - point.x}px`);
    resident.element.style.setProperty(
      '--seat-y',
      `${seat.y - point.y - (seated ? 9 : 0)}px`,
    );
    resident.element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -92%)`;
    resident.element.style.zIndex = String(
      seated
        ? seat.depth + 3
        : Math.max(point.depth, resident.motionDepth ?? point.depth) + 1,
    );
    if (resident.subject === undefined) delete resident.element.dataset.subject;
    else resident.element.dataset.subject = String(resident.subject);
    resident.element.dataset.lifeCell = String(resident.cell);
  }

  private placeCritter(critter: Critter, cell: number, flying = false) {
    const point = project(cell);
    critter.cell = cell;
    critter.element.dataset.lifeCell = String(cell);
    critter.element.style.left = `${point.x}px`;
    critter.element.style.top = `${point.y}px`;
    critter.element.style.zIndex = String(flying ? 9501 : point.depth + 4);
    critter.element.style.setProperty(
      '--perch-y',
      `${critter.kind === 'bird' && this.perches.has(cell) ? -55 : critter.kind === 'butterfly' && this.flowers.has(cell) ? -14 : 0}px`,
    );
  }

  private follow(critter: Critter) {
    const cell = this.context!.player;
    this.placeCritter(critter, cell, true);
    const point = project(cell);
    critter.element.style.left = `${point.x + (critter.index % 2 ? 19 : -18)}px`;
    critter.element.style.top = `${point.y - 18 - (critter.index % 2) * 5}px`;
    critter.element.style.setProperty('--perch-y', '0px');
  }

  private tick() {
    if (this.paused()) return;
    const now = Date.now();
    for (const resident of this.residents) {
      if (resident.motionUntil !== undefined && now >= resident.motionUntil) {
        resident.motionDepth = undefined;
        resident.motionUntil = undefined;
        this.positionResident(resident);
      }
      if (resident.arriving) {
        resident.arriving = false;
        resident.wait = 4;
        const subject = resident.subject;
        if (subject !== undefined)
          resident.element.dataset.facing =
            project(subject).x < project(resident.cell).x ? 'left' : 'right';
        resident.element.dataset.action = resident.purpose ?? 'look';
        if (resident.purpose === 'sit' || resident.purpose === 'shelter')
          resident.wait = 8;
        this.positionResident(resident);
        continue;
      }
      if (resident.wait > 0) {
        resident.wait--;
        if (resident.wait === 0) {
          resident.element.dataset.action = 'idle';
          resident.subject = undefined;
          resident.purpose = undefined;
          this.positionResident(resident);
        }
        continue;
      }
      if (!resident.path.length) resident.path = this.plan(resident);
      if (resident.arriving) continue;
      const next = resident.path.shift();
      if (
        next === undefined ||
        !this.free.has(next) ||
        this.taken(resident).has(next)
      ) {
        resident.path = [];
        resident.wait = 2;
        resident.element.dataset.action = 'idle';
        continue;
      }
      this.moveResident(resident, next);
      resident.arriving = resident.path.length === 0;
    }
    for (const critter of this.critters) {
      const behavior = critter.element.dataset.behavior;
      if (critter.kind === 'butterfly' && !this.butterflyWeather()) {
        critter.element.dataset.behavior = 'idle';
        this.placeCritter(critter, critter.home);
      } else if (now >= critter.until && behavior === 'follow') {
        critter.element.dataset.behavior = 'return';
        critter.until = now + 1800;
        this.placeCritter(critter, critter.home, true);
      } else if (
        now >= critter.until &&
        ['return', 'flee'].includes(behavior ?? '')
      ) {
        critter.element.dataset.behavior =
          critter.kind === 'bird' ? 'perched' : 'idle';
        this.placeCritter(critter, critter.home);
      }
    }
  }

  private addWindField() {
    const center = project(30);
    const template = document.createElement('template');
    template.innerHTML = `<svg class="island-wind-field" width="${WORLD_W}" height="${WORLD_H}" viewBox="0 0 ${WORLD_W} ${WORLD_H}" aria-hidden="true">${[0, 1, 2].map((i) => `<g transform="translate(${center.x - 300 + i * 50} ${center.y - 110 + i * 85})"><g class="island-wind-thread" style="animation-delay:-${i * 5}s"><path d="M-60 0q50-12 92 0t76-3m-118 15q45-9 70-2" fill="none" stroke="#e7efd1" stroke-width="1.3" stroke-linecap="round"/><path d="M38-12q9-10 13-1-7 8-13 1" fill="#c4d58e"/><path d="M-6 21q7-9 12-1-7 7-12 1" fill="#d6dba8"/></g></g>`).join('')}</svg>`;
    this.context!.ground.append(template.content);
  }

  private waterRipples() {
    const ground = this.context!.ground;
    for (const placement of this.context!.state.decorations) {
      const shape = decorationById(placement.decoration)!.shape;
      if (shape !== 'pond' && shape !== 'fountain') continue;
      const artwork = ground.querySelector<SVGSVGElement>(
        `[data-world-cell="${placement.cell}"] .garden-object .building-select > svg`,
      );
      if (!artwork || artwork.querySelector('.island-water-detail')) continue;
      const detail = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      );
      detail.setAttribute('class', 'island-water-detail');
      detail.setAttribute(
        'transform',
        `translate(40 ${shape === 'pond' ? 65 : 75})`,
      );
      detail.setAttribute('aria-hidden', 'true');
      detail.innerHTML = `<ellipse rx="${shape === 'pond' ? 18 : 25}" ry="${shape === 'pond' ? 4 : 5}" fill="none" stroke="#d4e8d2" stroke-width=".7"/><ellipse rx="${shape === 'pond' ? 12 : 17}" ry="2.5" fill="none" stroke="#d4e8d2" stroke-width=".5"/>`;
      artwork.append(detail);
    }
    const land = islandLand(this.context!.state);
    const visibleLand = new Set(land.map((tile) => tile.id));
    const coast = land
      .flatMap((tile) =>
        [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ].map(([x, y]) => at(tile.col + x, tile.row + y)),
      )
      .filter(
        (cell): cell is number => cell !== undefined && !visibleLand.has(cell),
      );
    const desired = new Set(
      [...new Set(coast)]
        .sort((a, b) => distance(a, 30) - distance(b, 30))
        .slice(0, 2),
    );
    for (const old of ground.querySelectorAll<HTMLElement>(
      '.island-water-ripple',
    ))
      if (!desired.has(Number(old.dataset.rippleCell))) old.remove();
    for (const cell of desired) {
      if (ground.querySelector(`[data-ripple-cell="${cell}"]`)) continue;
      const point = project(cell);
      const element = document.createElement('div');
      element.className = 'island-water-ripple';
      element.dataset.rippleCell = String(cell);
      element.setAttribute('aria-hidden', 'true');
      element.style.cssText = `left:${point.x}px;top:${point.y + tiles[cell].height + 14}px;z-index:${point.depth + 2};--wind-delay:${(point.x / WORLD_W) * 8}s`;
      element.innerHTML =
        '<svg viewBox="0 0 60 18" aria-hidden="true"><ellipse cx="30" cy="9" rx="25" ry="5" fill="none" stroke="#d4e8d2" stroke-width=".8"/><ellipse cx="30" cy="9" rx="18" ry="3" fill="none" stroke="#d4e8d2" stroke-width=".6"/></svg>';
      ground.append(element);
    }
  }

  private synchronizeWind() {
    for (const element of this.context!.ground.querySelectorAll(
      '.wind-grass, .world-object:is(.pine,.oak,.flowers) > svg, [data-wind="plant"] .building-select > svg, .world-banner, .island-wind-thread, .island-water-ripple ellipse, .island-water-detail ellipse',
    )) {
      for (const animation of element.getAnimations()) {
        if (
          !(animation instanceof CSSAnimation) ||
          !animation.animationName.startsWith('island-wind') ||
          this.wind.has(animation)
        )
          continue;
        animation.startTime = this.windOrigin;
        this.wind.add(animation);
      }
    }
  }
}

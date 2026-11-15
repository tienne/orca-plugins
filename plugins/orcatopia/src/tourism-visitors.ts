import type { State } from './game';
import { residentArt } from './island-life-art';
import { TOURISM, specialBuilding, tourismRate } from './tourism';
import { neighbours, project, tiles } from './world';
import { route } from './walk';

type Visitor = {
  element: HTMLElement;
  cell: number;
  path: number[];
  stage: number;
  wait: number;
  action: string;
  blockedSteps: number;
};

/** 주민 타이머와 정지 계약을 공유하지만 경제 정산에는 관여하지 않는다. */
export class TourismVisitors {
  private visitors: Visitor[] = [];
  private ground?: HTMLElement;
  private state?: State;
  private free = new Set<number>();
  private blocked = new Set<number>();
  private entrance?: number;
  private serial = 0;
  private cooldown = 0;
  private target = 0;

  /** 화면 갱신 뒤 기존 방문객을 유지하며 경로 경계를 다시 맞춘다. */
  bind(
    ground: HTMLElement,
    state: State,
    free: ReadonlySet<number>,
    blocked: ReadonlySet<number>,
  ) {
    if (this.ground !== ground) this.detach();
    this.ground = ground;
    this.state = state;
    this.free = new Set(free);
    this.blocked = new Set(blocked);
    this.entrance = [...free].sort((a, b) => {
      const distance = (cell: number) =>
        Math.abs(tiles[cell].col - tiles[14].col) +
        Math.abs(tiles[cell].row - tiles[14].row);
      return distance(a) - distance(b);
    })[0];
    this.target = Math.min(
      TOURISM.maxVisitors,
      Math.ceil(tourismRate(state) / TOURISM.visualPlacesPerVisitor),
    );
    this.visitors = this.visitors.filter((visitor, index) => {
      if (!free.has(visitor.cell) || index >= this.target) {
        visitor.element.remove();
        return false;
      }
      if (visitor.path.some((cell) => !free.has(cell))) {
        visitor.path = [];
        visitor.wait = 0;
        visitor.stage = 3;
      }
      return true;
    });
  }

  /** 섬 화면을 닫을 때 방문객 DOM과 참조를 해제한다. */
  detach() {
    for (const visitor of this.visitors) visitor.element.remove();
    this.visitors = [];
    this.ground = undefined;
    this.cooldown = 0;
  }

  /** 기존 생활 타이머에서만 호출해 정지 계약을 함께 적용한다. */
  tick(occupied: ReadonlySet<number>) {
    if (!this.ground || !this.state || this.entrance === undefined) return;
    const taken = new Set([...occupied, ...this.visitors.map((v) => v.cell)]);
    if (this.cooldown > 0) this.cooldown--;
    if (
      this.visitors.length < this.target &&
      !this.cooldown &&
      !taken.has(this.entrance)
    ) {
      const element = document.createElement('div');
      element.className = 'island-tourist';
      element.dataset.tourist = String(this.serial++);
      element.setAttribute('aria-hidden', 'true');
      element.innerHTML = `${residentArt('photographer')}<span class="tourist-token">✦</span><span class="tourist-cup">☕</span><span class="tourist-bag">▣</span>`;
      const visitor = {
        element,
        cell: this.entrance,
        path: [],
        stage: 0,
        wait: 1,
        action: 'arrive',
        blockedSteps: 0,
      };
      this.visitors.push(visitor);
      this.ground.append(element);
      this.position(visitor);
      this.cooldown = Math.max(2, 12 - this.target);
      taken.add(visitor.cell);
    }
    for (const visitor of this.visitors) {
      if (visitor.wait > 0) {
        visitor.wait--;
        continue;
      }
      if (visitor.path.length) {
        const next = visitor.path[0];
        if (taken.has(next)) {
          if (++visitor.blockedSteps >= 4) {
            visitor.path = [];
            visitor.stage = 3;
            visitor.blockedSteps = 0;
          }
          continue;
        }
        visitor.blockedSteps = 0;
        taken.delete(visitor.cell);
        taken.add(next);
        visitor.cell = visitor.path.shift()!;
        visitor.element.dataset.facing =
          project(next).x < Number(visitor.element.dataset.lastX)
            ? 'left'
            : 'right';
        visitor.element.dataset.action = 'walk';
        this.position(visitor);
        if (!visitor.path.length) {
          visitor.element.dataset.action = visitor.action;
          visitor.wait = 5;
        }
        continue;
      }
      if (visitor.stage >= 3 && visitor.cell === this.entrance) {
        visitor.element.remove();
        taken.delete(visitor.cell);
        continue;
      }
      const buildings = this.state.decorations.filter((p) =>
        specialBuilding(p.decoration),
      );
      const sources = visitor.stage === 0 ? this.state.placements : buildings;
      const selected = sources.length
        ? sources[Number(visitor.element.dataset.tourist) % sources.length]
        : undefined;
      visitor.action =
        visitor.stage === 0
          ? 'photo'
          : selected && 'decoration' in selected
            ? (specialBuilding(selected.decoration)?.activity ?? 'look')
            : 'depart';
      const targets =
        visitor.stage >= 2 || !selected
          ? [this.entrance]
          : neighbours(selected.cell).filter((cell) => this.free.has(cell));
      const obstacles = new Set([...this.blocked, ...taken]);
      obstacles.delete(visitor.cell);
      // 한 방문객당 최대 네 경로만 탐색한다. 막힌 장소는 다음 방문에서 다시 시도한다.
      const destination = targets
        .slice(0, 4)
        .map((cell) => ({ cell, path: route(visitor.cell, cell, obstacles) }))
        .find(
          (candidate) =>
            candidate.cell === visitor.cell || candidate.path.length,
        );
      visitor.stage++;
      if (destination) {
        visitor.path = destination.path;
        if (!visitor.path.length) {
          visitor.element.dataset.action = visitor.action;
          visitor.wait = 5;
        }
      } else {
        visitor.wait = 3;
        visitor.element.dataset.action = 'look';
        if (visitor.stage >= 3) visitor.element.remove();
      }
    }
    this.visitors = this.visitors.filter((v) => v.element.isConnected);
  }

  /** 주민과 방문객의 경로가 같은 칸을 점유하지 않도록 공유한다. */
  occupied() {
    return this.visitors.map((visitor) => visitor.cell);
  }

  private position(visitor: Visitor) {
    const point = project(visitor.cell);
    visitor.element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -92%)`;
    visitor.element.style.zIndex = String(point.depth + 1);
    visitor.element.dataset.lifeCell = String(visitor.cell);
    visitor.element.dataset.lastX = String(point.x);
    visitor.element.dataset.action ??= 'arrive';
  }
}

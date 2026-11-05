import { route } from './walk';
import type { State } from './game';
import {
  at,
  tiles,
  landTiles,
  project,
  solidProps,
  WORLD_W,
  WORLD_H,
} from './world';
import { minimap } from './terrain-art';
const weatherNames = ['Sunny', 'Cloudy', 'Rain', 'Snow'] as const;
const phases = ['Day', 'Sunset', 'Night', 'Dawn'] as const;
const person = `<svg viewBox="0 0 40 60" aria-hidden="true"><ellipse cx="20" cy="55" rx="14" ry="4" fill="#153b4d55"/><g class="walker-body"><path class="leg left-leg" d="M15 40v12" stroke="#344e63" stroke-width="6" stroke-linecap="round"/><path class="leg right-leg" d="M25 40v12" stroke="#344e63" stroke-width="6" stroke-linecap="round"/><rect x="9" y="23" width="24" height="20" rx="6" fill="#b16a3d"/><rect x="11" y="23" width="18" height="20" rx="6" fill="#edb55d"/><path d="M9 29l-3 10M31 29l3 10" stroke="#edc1a1" stroke-width="5" stroke-linecap="round"/><circle cx="20" cy="17" r="10" fill="#edc1a1"/><path d="M10 14q0-13 10-13t10 13" fill="#4c8e79"/><path d="M5 14h30" stroke="#276f61" stroke-width="5" stroke-linecap="round"/><circle cx="17" cy="18" r="1" fill="#274955"/><circle cx="24" cy="18" r="1" fill="#274955"/><path d="M18 23q3 2 5-1" fill="none" stroke="#a46a53"/></g></svg>`;
export class IslandScene {
  mode: 'walk' | 'build' = 'walk';
  cell = 30;
  weather = 0;
  phase = 0;
  automatic = true;
  zoom = 1;
  x = 0;
  y = 0;
  follow = true;
  private focusX = project(30).x;
  private focusY = project(30).y;
  private cleanup = () => {};
  markup() {
    return `<div class="scene-controls"><div class="mode-controls" role="group" aria-label="Island mode"><button data-mode="walk" aria-pressed="${this.mode === 'walk'}">Explore island</button><button data-mode="build" aria-pressed="${this.mode === 'build'}">Arrange landmarks</button></div><div class="climate-controls"><label for="weather">Weather</label><select id="weather"><option value="auto" ${this.automatic ? 'selected' : ''}>Auto · island forecast</option>${weatherNames.map((w, i) => `<option value="${i}" ${!this.automatic && this.weather === i ? 'selected' : ''}>${w}</option>`).join('')}</select><button id="daylight" aria-label="Change time of day">${phases[this.phase]}</button></div></div>`;
  }
  layers() {
    return `<div class="atmosphere" aria-hidden="true"><div class="sun-moon"></div><div class="stars">✦　　　·　　　　✧<br>　　✧　　　　✦　　　·</div><div class="cloud cloud-one"></div><div class="cloud cloud-two"></div><div class="cloud cloud-three"></div><div class="precipitation">${Array.from({ length: 32 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--delay:-${i * 0.31}s;--speed:${1 + (i % 5) * 0.25}s"></i>`).join('')}</div><div class="birds">⌁　⌁</div></div><div class="scene-hud"><span class="forecast"></span><span class="scene-location">YOUR LITTLE ESCAPE</span></div>${minimap()}<div class="camera-controls" role="group" aria-label="Island camera"><button id="zoom-out" aria-label="Zoom out">−</button><span id="zoom-value">100%</span><button id="zoom-in" aria-label="Zoom in">＋</button><button id="follow-player" aria-label="Follow explorer" aria-pressed="${this.follow}">◎</button><button id="camera-reset" aria-label="Reset camera">↺</button></div><div class="walk-controls" role="group" aria-label="Walk controls"><button data-step="north" aria-label="Walk north">↑</button><button data-step="west" aria-label="Walk west">←</button><button data-step="south" aria-label="Walk south">↓</button><button data-step="east" aria-label="Walk east">→</button></div><p class="walk-hint" aria-live="polite"></p>`;
  }
  avatar() {
    return `<div class="walker" role="img" aria-label="Island explorer">${person}</div>`;
  }
  mount(root: HTMLElement, state: State, onMode: () => void, busy: boolean) {
    this.cleanup();
    const ocean = root.querySelector<HTMLElement>('.ocean');
    if (!ocean) return;
    const controller = new AbortController(),
      signal = controller.signal;
    const camera = ocean.querySelector<HTMLElement>('.camera')!,
      walker = ocean.querySelector<HTMLElement>('.walker')!,
      hint = ocean.querySelector<HTMLElement>('.walk-hint')!;
    const blocked = new Set([
      ...solidProps,
      ...state.placements.map((p) => p.cell),
    ]);
    let stepTimer: ReturnType<typeof setTimeout> | undefined,
      ticks = 0;
    let walking = false;
    if (this.cell < 0 || blocked.has(this.cell))
      this.cell = landTiles.find((t) => !blocked.has(t.id))?.id ?? -1;
    const updateCamera = () => {
      this.zoom = Math.max(0.12, Math.min(1.8, this.zoom));
      if (this.follow && this.cell >= 0) {
        const p = project(this.cell);
        this.focusX = p.x;
        this.focusY = p.y;
      }
      const bound = WORLD_W * this.zoom * 0.6;
      this.x = Math.max(-bound, Math.min(bound, this.x));
      this.y = Math.max(
        -WORLD_H * this.zoom * 0.6,
        Math.min(WORLD_H * this.zoom * 0.6, this.y),
      );
      camera.style.transform = `translate(${ocean.clientWidth / 2 - this.focusX * this.zoom + this.x}px,${ocean.clientHeight * 0.5 - this.focusY * this.zoom + this.y}px) scale(${this.zoom})`;
      root.querySelector('#zoom-value')!.textContent =
        `${Math.round(this.zoom * 100)}%`;
      root
        .querySelector('#follow-player')!
        .setAttribute('aria-pressed', String(this.follow));
      ocean.dataset.follow = String(this.follow);
    };
    const position = () => {
      walker.hidden = this.cell < 0;
      walker.dataset.cell = String(this.cell);
      if (this.cell < 0) return;
      const p = project(this.cell),
        tile = tiles[this.cell];
      walker.style.left = `${p.x}px`;
      walker.style.top = `${p.y}px`;
      walker.style.zIndex = String(p.depth + 1);
      const dot = ocean.querySelector('.mini-player')!;
      dot.setAttribute('cx', String(tile.col * 4 + 2));
      dot.setAttribute('cy', String(tile.row * 4 + 2));
      ocean.querySelector('.scene-location')!.textContent = tile.region;
      updateCamera();
    };
    const climate = () => {
      ocean.dataset.weather = weatherNames[this.weather].toLowerCase();
      ocean.dataset.phase = phases[this.phase].toLowerCase();
      ocean.querySelector('.forecast')!.textContent =
        `${['☀', '☁', '☂', '❄'][this.weather]} ${weatherNames[this.weather]} · ${phases[this.phase]}${this.automatic ? ' · Auto' : ''}`;
      root.querySelector('#daylight')!.textContent = phases[this.phase];
    };
    const finish = () => {
      walking = false;
      walker.classList.remove('walking');
    };
    const walk = (goal: number) => {
      if (busy || this.mode !== 'walk' || this.cell < 0) return;
      clearTimeout(stepTimer);
      finish();
      const path = route(this.cell, goal, blocked);
      if (!path.length) {
        hint.textContent =
          goal === this.cell
            ? 'A good spot to take it all in.'
            : 'No clear path. Try an empty patch of grass.';
        return;
      }
      hint.textContent = 'Taking the scenic route…';
      walking = true;
      walker.classList.add('walking');
      const next = () => {
        const cell = path.shift();
        if (cell === undefined) {
          finish();
          hint.textContent =
            'Click the grass to stroll · Arrow keys / WASD · Drag to look around';
          return;
        }
        this.cell = cell;
        position();
        stepTimer = setTimeout(next, 180);
      };
      next();
    };
    ocean.dataset.mode = this.mode;
    hint.textContent =
      this.cell < 0
        ? 'Island full — return a landmark to make room to walk.'
        : this.mode === 'walk'
          ? 'Click the grass to stroll · Arrow keys / WASD · Drag to look around'
          : 'Select a landmark, then a cell · Drag to look around';
    position();
    updateCamera();
    climate();
    root.querySelectorAll<HTMLButtonElement>('button[data-mode]').forEach(
      (b) =>
        (b.onclick = () => {
          this.mode = b.dataset.mode as typeof this.mode;
          onMode();
        }),
    );
    root.querySelector<HTMLSelectElement>('#weather')!.onchange = (e) => {
      const value = (e.target as HTMLSelectElement).value;
      this.automatic = value === 'auto';
      if (!this.automatic) this.weather = Number(value);
      climate();
    };
    root.querySelector<HTMLButtonElement>('#daylight')!.onclick = () => {
      this.phase = (this.phase + 1) % 4;
      climate();
    };
    root.querySelector<HTMLButtonElement>('#zoom-in')!.onclick = () => {
      this.zoom += 0.15;
      updateCamera();
    };
    root.querySelector<HTMLButtonElement>('#zoom-out')!.onclick = () => {
      this.zoom -= 0.15;
      updateCamera();
    };
    root.querySelector<HTMLButtonElement>('#camera-reset')!.onclick = () => {
      this.zoom = 1;
      this.x = this.y = 0;
      this.follow = true;
      updateCamera();
    };
    root.querySelector<HTMLButtonElement>('#follow-player')!.onclick = () => {
      this.follow = true;
      this.x = this.y = 0;
      updateCamera();
    };
    root.querySelector<HTMLButtonElement>('#overview')!.onclick = () => {
      this.follow = false;
      this.focusX = WORLD_W / 2;
      this.focusY = WORLD_H / 2 - 30;
      this.x = this.y = 0;
      this.zoom = Math.min(
        (ocean.clientWidth - 45) / WORLD_W,
        (ocean.clientHeight - 110) / WORLD_H,
      );
      updateCamera();
    };
    const step = (direction: string) => {
      if (this.cell < 0) return;
      const delta: Record<string, [number, number]> = {
        north: [0, -1],
        south: [0, 1],
        west: [-1, 0],
        east: [1, 0],
      };
      const [dx, dy] = delta[direction],
        tile = tiles[this.cell],
        goal = at(tile.col + dx, tile.row + dy);
      if (goal !== undefined) walk(goal);
    };
    root
      .querySelectorAll<HTMLButtonElement>('[data-step]')
      .forEach((b) => (b.onclick = () => step(b.dataset.step!)));
    ocean.addEventListener(
      'keydown',
      (e) => {
        if (e.target !== ocean) return;
        const delta: Record<string, string> = {
          ArrowUp: 'north',
          w: 'north',
          W: 'north',
          ArrowDown: 'south',
          s: 'south',
          S: 'south',
          ArrowLeft: 'west',
          a: 'west',
          A: 'west',
          ArrowRight: 'east',
          d: 'east',
          D: 'east',
        };
        if (e.key in delta && this.mode === 'walk') {
          e.preventDefault();
          step(delta[e.key]);
        }
      },
      { signal },
    );
    const pointers = new Map<number, { x: number; y: number }>();
    let dragged = false,
      startX = 0,
      startY = 0,
      lastX = 0,
      lastY = 0,
      lastDistance = 0;
    const distance = () => {
      const p = [...pointers.values()];
      return p.length === 2 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0;
    };
    ocean.addEventListener(
      'pointerdown',
      (e) => {
        if (
          (e.target as Element).closest(
            '.camera-controls,.walk-controls,.minimap',
          ) ||
          e.button !== 0
        )
          return;
        e.preventDefault();
        ocean.focus({ preventScroll: true });
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        startX = lastX = e.clientX;
        startY = lastY = e.clientY;
        dragged = false;
        lastDistance = distance();
      },
      { signal },
    );
    ocean.addEventListener(
      'pointermove',
      (e) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 2) {
          const d = distance();
          if (lastDistance) this.zoom *= d / lastDistance;
          lastDistance = d;
          dragged = true;
        } else {
          if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5)
            dragged = true;
          if (dragged) {
            this.x += e.clientX - lastX;
            this.y += e.clientY - lastY;
          }
        }
        if (dragged) {
          this.follow = false;
          ocean.setPointerCapture(e.pointerId);
          updateCamera();
        }
        lastX = e.clientX;
        lastY = e.clientY;
      },
      { signal },
    );
    const release = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      lastDistance = 0;
      const remaining = [...pointers.values()][0];
      if (remaining) {
        lastX = remaining.x;
        lastY = remaining.y;
      }
      if (ocean.hasPointerCapture(e.pointerId))
        ocean.releasePointerCapture(e.pointerId);
    };
    ocean.addEventListener('pointerup', release, { signal });
    ocean.addEventListener('pointercancel', release, { signal });
    // Capture before the placement handler: a pan can never place or move a building.
    ocean.addEventListener(
      'click',
      (e) => {
        if (
          (e.target as Element).closest(
            '.camera-controls,.walk-controls,.minimap',
          )
        )
          return;
        if (dragged) {
          e.stopImmediatePropagation();
          dragged = false;
          return;
        }
        const cell = (e.target as Element).closest<HTMLElement>(
          'button[data-cell]',
        );
        if (this.mode === 'walk' && cell) {
          e.stopImmediatePropagation();
          walk(Number(cell.dataset.cell));
        }
      },
      { capture: true, signal },
    );
    ocean.addEventListener(
      'wheel',
      (e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        this.zoom -= e.deltaY * 0.002;
        updateCamera();
      },
      { passive: false, signal },
    );
    const auto = setInterval(() => {
      if (!this.automatic || document.hidden) return;
      ticks++;
      this.weather = (this.weather + 1) % 4;
      if (ticks % 2 === 0) this.phase = (this.phase + 1) % 4;
      climate();
    }, 30000);
    const visibility = () => {
      if (document.hidden && walking) {
        clearTimeout(stepTimer);
        finish();
      }
    };
    document.addEventListener('visibilitychange', visibility, { signal });
    const resize = new ResizeObserver(updateCamera);
    resize.observe(ocean);
    this.cleanup = () => {
      controller.abort();
      clearTimeout(stepTimer);
      clearInterval(auto);
      resize.disconnect();
    };
  }
}

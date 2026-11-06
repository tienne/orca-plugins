import { route } from './walk';
import { islandLand, unlockedCell, type State } from './game';
import { decorationById, isFloor } from './decorations';
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
// Original woodland adventurer with a green tunic, blue scarf, and travel pack.
const person = `<svg viewBox="0 0 40 60" aria-hidden="true"><ellipse cx="20" cy="55" rx="14" ry="4" fill="#244b343d"/><g class="walker-body" stroke="#344c37" stroke-linejoin="round"><path class="leg left-leg" d="M15 40v12l-3 1" stroke="#69503a" stroke-width="6" stroke-linecap="round"/><path class="leg right-leg" d="M25 40v12l3 1" stroke="#69503a" stroke-width="6" stroke-linecap="round"/><rect x="7" y="24" width="26" height="21" rx="6" fill="#9b7950" stroke-width="1.3"/><path d="M13 25Q8 30 8 43l12 4 12-4-5-18z" fill="#3c8053" stroke-width="1.4"/><path d="M14 27l-3 15 9 3V26z" fill="#78ac60" stroke="none"/><path d="M10 38l21 1" stroke="#72543c" stroke-width="4"/><rect x="19" y="37" width="4" height="4" fill="#e3c276" stroke="#8b713e" stroke-width=".7"/><path d="M10 30L6 38m24-8 4 8" stroke="#edc69a" stroke-width="5" stroke-linecap="round"/><path d="M11 14q0-9 10-9 11 1 10 12l-2 7q-9 9-17 0z" fill="#f2d2a4" stroke-width="1.2"/><path d="M9 18Q6 8 13 6l-1-4 9 3 7-3-1 4q9 4 5 14l-4-6-6 2-1-5-6 5-2-2-2 7z" fill="#886143" stroke="#5e5035" stroke-width="1"/><path d="M12 9l7-2m4 1 5 3" stroke="#bb955d" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="20" r="1" fill="#344634" stroke="none"/><circle cx="25" cy="20" r="1" fill="#344634" stroke="none"/><path d="M19 25q2 1 4-1" fill="none" stroke="#b58160"/><path d="M12 26q9 5 17 0l-5 7-9-2z" fill="#73b4b7" stroke-width=".8"/><path d="M26 30l6 7-7-2" fill="#93c9bb" stroke="none"/><path d="M12 31l16 12" stroke="#e4d8a5" stroke-width="2"/><path d="M27 38l8 1-1 9-9-1z" fill="#bc9a60" stroke-width="1"/></g></svg>`;
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
  layers(state: State) {
    return `<div class="atmosphere" aria-hidden="true"><div class="sunbeams"></div><div class="sun-moon"></div><div class="forest-motes">${Array.from({ length: 14 }, (_, i) => `<i style="--mx:${12 + ((i * 29) % 78)}%;--my:${26 + ((i * 17) % 55)}%;--md:-${i * 1.7}s"></i>`).join('')}</div><div class="stars">✦　　　·　　　　✧<br>　　✧　　　　✦　　　·</div><div class="cloud cloud-one"></div><div class="cloud cloud-two"></div><div class="cloud cloud-three"></div><div class="precipitation">${Array.from({ length: 32 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--delay:-${i * 0.31}s;--speed:${1 + (i % 5) * 0.25}s"></i>`).join('')}</div><div class="birds">⌁　⌁</div></div><div class="scene-hud"><span class="forecast"></span><span class="scene-location">YOUR LITTLE ESCAPE</span></div>${minimap(state)}<div class="camera-controls" role="group" aria-label="Island camera"><button id="zoom-out" aria-label="Zoom out">−</button><span id="zoom-value">100%</span><button id="zoom-in" aria-label="Zoom in">＋</button><button id="follow-player" aria-label="Follow explorer" aria-pressed="${this.follow}">◎</button><button id="camera-reset" aria-label="Reset camera">↺</button></div><div class="walk-controls" role="group" aria-label="Walk controls"><button data-step="north" aria-label="Walk north">↑</button><button data-step="west" aria-label="Walk west">←</button><button data-step="south" aria-label="Walk south">↓</button><button data-step="east" aria-label="Walk east">→</button></div><p class="walk-hint" aria-live="polite"></p>`;
  }
  avatar() {
    return `<div class="walker" role="img" aria-label="Island explorer">${person}</div>`;
  }
  mount(
    root: HTMLElement,
    state: State,
    onMode: () => void,
    busy: boolean,
    onInspect: (id: string) => void,
    brush?: {
      decoration: string;
      available: number;
      onStroke: (cells: number[]) => void;
    },
  ) {
    this.cleanup();
    const ocean = root.querySelector<HTMLElement>('.ocean');
    if (!ocean) return;
    const controller = new AbortController(),
      signal = controller.signal;
    const camera = ocean.querySelector<HTMLElement>('.camera')!,
      walker = ocean.querySelector<HTMLElement>('.walker')!,
      hint = ocean.querySelector<HTMLElement>('.walk-hint')!;
    const blocked = new Set([
      ...landTiles.filter((t) => !unlockedCell(state, t.id)).map((t) => t.id),
      ...[...solidProps].filter(
        (cell) =>
          !state.placements.some((p) => p.cell === cell) &&
          !state.decorations.some((p) => p.cell === cell) &&
          !state.floors.some((p) => p.cell === cell),
      ),
      ...state.decorations
        .filter((p) => !decorationById(p.decoration)!.walkable)
        .map((p) => p.cell),
      ...state.placements.map((p) => p.cell),
    ]);
    let stepTimer: ReturnType<typeof setTimeout> | undefined,
      ticks = 0;
    let walking = false;
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    if (this.cell < 0 || blocked.has(this.cell))
      this.cell = islandLand(state).find((t) => !blocked.has(t.id))?.id ?? -1;
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
            'Click the grass to stroll · Arrow keys / WASD · Drag to pan · Scroll to zoom';
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
          ? 'Click the grass to stroll · Arrow keys / WASD · Drag to pan · Scroll to zoom'
          : 'Select a landmark or decoration, then a cell · Drag to pan · Scroll to zoom';
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
      const points = islandLand(state).map((t) => project(t.id));
      const left = Math.min(...points.map((p) => p.x)) - 60;
      const right = Math.max(...points.map((p) => p.x)) + 60;
      const top = Math.min(...points.map((p) => p.y)) - 120;
      const bottom = Math.max(...points.map((p) => p.y)) + 60;
      this.focusX = (left + right) / 2;
      this.focusY = (top + bottom) / 2;
      this.x = this.y = 0;
      this.zoom = Math.min(
        1.8,
        (ocean.clientWidth - 45) / (right - left),
        (ocean.clientHeight - 110) / (bottom - top),
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
    let paintPointer: number | undefined;
    let paintLast: { x: number; y: number } | undefined;
    const painted = new Set<number>();
    const clearStroke = () => {
      if (paintPointer !== undefined && ocean.hasPointerCapture(paintPointer))
        ocean.releasePointerCapture(paintPointer);
      paintPointer = undefined;
      paintLast = undefined;
      painted.clear();
      ocean
        .querySelectorAll('.brush-preview')
        .forEach((e) => e.classList.remove('brush-preview'));
    };
    const paintAt = (clientX: number, clientY: number) => {
      if (
        !brush ||
        document
          .elementFromPoint(clientX, clientY)
          ?.closest('.island-satchel,.canvas-inventory')
      )
        return;
      const rect = ocean.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      )
        return;
      const matrix = new DOMMatrixReadOnly(getComputedStyle(camera).transform);
      const x = (clientX - rect.left - ocean.clientLeft - matrix.e) / matrix.a;
      const y = (clientY - rect.top - ocean.clientTop - matrix.f) / matrix.d;
      const tile = islandLand(state)
        .sort((a, b) => project(b.id).depth - project(a.id).depth)
        .find((t) => {
          const p = project(t.id);
          return Math.abs(x - p.x) / 40 + Math.abs(y - p.y) / 20 <= 1;
        });
      if (!tile || painted.has(tile.id)) return;
      const floor = isFloor(brush.decoration);
      if (
        floor &&
        state.floors.some(
          (p) => p.cell === tile.id && p.decoration === brush.decoration,
        )
      )
        return;
      if (
        !floor &&
        (state.placements.some((p) => p.cell === tile.id) ||
          state.decorations.some((p) => p.cell === tile.id))
      )
        return;
      if (painted.size >= brush.available) {
        hint.textContent =
          'All available copies are in this stroke. Craft more flowers to keep planting.';
        return;
      }
      painted.add(tile.id);
      ocean
        .querySelector(`[data-world-cell="${tile.id}"] .cell`)
        ?.classList.add('brush-preview');
      hint.textContent = `${painted.size} tiles ready · Release to place · Escape to cancel`;
    };
    const paintTo = (e: PointerEvent) => {
      const last = paintLast ?? { x: e.clientX, y: e.clientY };
      const steps = Math.max(
        1,
        Math.ceil(Math.hypot(e.clientX - last.x, e.clientY - last.y) / 6),
      );
      for (let i = 1; i <= steps; i++)
        paintAt(
          last.x + ((e.clientX - last.x) * i) / steps,
          last.y + ((e.clientY - last.y) * i) / steps,
        );
      paintLast = { x: e.clientX, y: e.clientY };
    };
    ocean.dataset.brush = String(Boolean(brush));
    if (brush)
      hint.textContent =
        'Drag to paint · Occupied objects are skipped · Alt-drag to pan · Escape cancels a stroke';
    ocean.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape' && paintPointer !== undefined) {
          e.preventDefault();
          clearStroke();
          hint.textContent = 'Stroke cancelled. Nothing was placed.';
        }
      },
      { signal },
    );
    window.addEventListener('blur', clearStroke, { signal });
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
            '.camera-controls,.walk-controls,.minimap,.island-satchel,.canvas-inventory',
          ) ||
          e.button !== 0
        )
          return;
        e.preventDefault();
        ocean.focus({ preventScroll: true });
        if (brush && this.mode === 'build' && !e.altKey && !busy) {
          if (paintPointer !== undefined) {
            clearStroke();
            return;
          }
          paintPointer = e.pointerId;
          dragged = true;
          ocean.setPointerCapture(e.pointerId);
          paintTo(e);
          return;
        }
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
        if (paintPointer === e.pointerId) {
          paintTo(e);
          return;
        }
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
      if (paintPointer === e.pointerId) {
        if (e.type === 'pointerup') paintTo(e);
        const cells = [...painted];
        clearStroke();
        if (e.type === 'pointerup' && cells.length) brush!.onStroke(cells);
        return;
      }
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
            '.camera-controls,.walk-controls,.minimap,.island-satchel,.canvas-inventory',
          )
        )
          return;
        if (dragged) {
          e.stopImmediatePropagation();
          dragged = false;
          return;
        }
        const cell = (e.target as Element).closest<HTMLElement>(
          'button[data-cell], button[data-site]',
        );
        if (this.mode === 'walk' && cell) {
          e.stopImmediatePropagation();
          if (busy) return;
          const cellId = Number(cell.dataset.cell ?? cell.dataset.site);
          const placed = state.placements.find((p) => p.cell === cellId);
          if (placed) {
            clearTimeout(stepTimer);
            finish();
            onInspect(placed.landmark);
          } else walk(cellId);
        }
      },
      { capture: true, signal },
    );
    ocean.addEventListener(
      'wheel',
      (e) => {
        if ((e.target as Element).closest('.island-satchel,.canvas-inventory'))
          return;
        if (e.deltaY === 0) return;
        e.preventDefault();
        if (paintPointer !== undefined) return;
        // Anchor the rendered world point under the pointer, even mid-transition.
        // Wheel input deliberately leaves keyboard focus where the user put it.
        const rect = ocean.getBoundingClientRect();
        const px = e.clientX - rect.left - ocean.clientLeft;
        const py = e.clientY - rect.top - ocean.clientTop;
        const matrix = new DOMMatrixReadOnly(
          getComputedStyle(camera).transform,
        );
        const worldX = (px - matrix.e) / matrix.a;
        const worldY = (py - matrix.f) / matrix.d;
        const unit =
          e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? ocean.clientHeight : 1;
        this.zoom = Math.max(
          0.12,
          Math.min(1.8, matrix.a * Math.exp(-e.deltaY * unit * 0.0015)),
        );
        this.follow = false;
        this.focusX = worldX + (ocean.clientWidth / 2 - px) / this.zoom;
        this.focusY = worldY + (ocean.clientHeight / 2 - py) / this.zoom;
        this.x = this.y = 0;
        camera.style.transition = 'none';
        updateCamera();
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(
          () => camera.style.removeProperty('transition'),
          150,
        );
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
      if (document.hidden) clearStroke();
      if (document.hidden && walking) {
        clearTimeout(stepTimer);
        finish();
      }
    };
    document.addEventListener('visibilitychange', visibility, { signal });
    const resize = new ResizeObserver(updateCamera);
    resize.observe(ocean);
    this.cleanup = () => {
      clearStroke();
      controller.abort();
      clearTimeout(stepTimer);
      clearInterval(auto);
      clearTimeout(wheelTimer);
      resize.disconnect();
    };
  }
}

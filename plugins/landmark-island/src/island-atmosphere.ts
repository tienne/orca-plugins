import { decorationById } from './decorations';
import type { State } from './game';
import { project, tiles } from './world';

/** 배치된 조명과 풀밭에 저장과 무관한 밤 풍경을 덧그린다. */
export class IslandAtmosphere {
  /** 같은 땅의 연출을 유지하고 새 장식에만 불빛을 붙인다. */
  reconcile(ground: HTMLElement, state: State, habitats: number[]) {
    for (const placement of state.decorations) {
      const shape = decorationById(placement.decoration)?.shape;
      if (shape !== 'lamp' && shape !== 'pavilion') continue;
      const artwork = ground.querySelector<SVGSVGElement>(
        `[data-world-cell="${placement.cell}"] .garden-object .building-select > svg`,
      );
      if (!artwork || artwork.querySelector('.island-night-light')) continue;
      const light = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      light.setAttribute('class', 'island-night-light');
      light.setAttribute('aria-hidden', 'true');
      light.innerHTML =
        shape === 'lamp'
          ? '<ellipse cx="40" cy="86" rx="33" ry="10" fill="#ffe4a2" opacity=".3"/><circle cx="40" cy="27" r="24" fill="#ffe4a2" opacity=".15"/><path d="M34 21h12l-2 14h-8z" fill="#fff1bf"/><circle cx="40" cy="27" r="6" fill="#fff5cf" opacity=".8"/>'
          : '<path d="M23 59l13 6v17l-13-6zM46 65l13-6v17l-13 6z" fill="#ffe7a3" opacity=".7"/><ellipse cx="40" cy="83" rx="29" ry="9" fill="#ffe6a3" opacity=".3"/><path d="M40 60v7" stroke="#ddc288"/><rect x="37" y="66" width="6" height="9" rx="2" fill="#fff0b3"/>';
      artwork.append(light);
    }
    const cells = [...new Set(habitats)]
      .filter((cell) => tiles[cell].kind === 'grass')
      .slice(0, 6);
    const desired = new Set(cells);
    for (const element of ground.querySelectorAll<HTMLElement>(
      '.island-firefly',
    ))
      if (!desired.has(Number(element.dataset.fireflyCell))) element.remove();
    for (const [i, cell] of cells.entries()) {
      if (ground.querySelector(`[data-firefly-cell="${cell}"]`)) continue;
      const point = project(cell);
      const element = document.createElement('div');
      element.className = 'island-firefly';
      element.dataset.fireflyCell = String(cell);
      element.setAttribute('aria-hidden', 'true');
      element.style.cssText = `left:${point.x}px;top:${point.y - 12}px;z-index:${point.depth + 5};--firefly-delay:-${i * 1.7}s;--firefly-drift:${i % 2 ? -1 : 1}`;
      element.innerHTML = '<i></i>';
      ground.append(element);
    }
  }
}

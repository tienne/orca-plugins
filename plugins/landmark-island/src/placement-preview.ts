import { art } from './art';

/** 배치 전의 그림만 표시한다. 좌표 갱신은 저장이나 섬 재렌더를 일으키지 않는다. */
export function mountPlacementPreview(
  ocean: HTMLElement,
  landmark: string,
  canPlace: (cell: number) => boolean | 'merge',
) {
  const controller = new AbortController();
  const { signal } = controller;
  const preview = document.createElement('div');
  preview.className = 'placement-preview';
  preview.dataset.landmark = landmark;
  preview.setAttribute('aria-hidden', 'true');
  preview.hidden = true;
  preview.innerHTML = `${art(landmark)}<span class="placement-preview-status"></span>`;
  ocean.append(preview);
  const status = preview.querySelector<HTMLElement>(
    '.placement-preview-status',
  )!;
  let target: HTMLElement | null = null;
  let point: { x: number; y: number } | undefined;
  let frame: number | undefined;
  const clearTarget = () => {
    target?.classList.remove('placement-target');
    target?.removeAttribute('data-preview-valid');
    target = null;
  };
  const hide = () => {
    preview.hidden = true;
    clearTarget();
  };
  const update = () => {
    frame = undefined;
    if (!point) return;
    const bounds = ocean.getBoundingClientRect();
    const hit = document.elementFromPoint(point.x, point.y);
    if (
      !hit ||
      !ocean.contains(hit) ||
      point.x < bounds.left ||
      point.x > bounds.right ||
      point.y < bounds.top ||
      point.y > bounds.bottom ||
      ocean.dataset.inventoryOpen === 'true' ||
      document.querySelector('dialog[open]') ||
      hit.closest(
        '.canvas-editor,.canvas-inventory,.island-satchel,.treasure-menu,.piece-menu,.camera-controls,.walk-controls,.minimap,.expedition-camp',
      )
    ) {
      hide();
      return;
    }
    const tile = hit.closest<HTMLElement>('[data-world-cell]');
    const cell = tile ? Number(tile.dataset.worldCell) : undefined;
    const result = cell !== undefined && canPlace(cell);
    const valid = Boolean(result);
    const merging = result === 'merge';
    preview.dataset.action = merging ? 'merge' : 'place';
    clearTarget();
    target = tile?.querySelector<HTMLElement>('.cell') ?? null;
    target?.classList.add('placement-target');
    target?.setAttribute('data-preview-valid', String(valid));
    preview.dataset.valid = String(valid);
    if (cell === undefined) delete preview.dataset.previewCell;
    else preview.dataset.previewCell = String(cell);
    status.textContent = merging ? '+' : valid ? '✓' : '×';
    preview.style.left = `${point.x - bounds.left - ocean.clientLeft}px`;
    preview.style.top = `${point.y - bounds.top - ocean.clientTop}px`;
    preview.hidden = false;
  };
  const schedule = () => {
    frame ??= requestAnimationFrame(update);
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || event.buttons) {
      point = undefined;
      hide();
      return;
    }
    point = { x: event.clientX, y: event.clientY };
    schedule();
  };
  document.addEventListener('pointermove', move, { signal, passive: true });
  document.addEventListener(
    'pointerdown',
    () => {
      point = undefined;
      hide();
    },
    { signal, passive: true },
  );
  ocean.addEventListener(
    'pointerleave',
    () => {
      point = undefined;
      hide();
    },
    { signal },
  );
  ocean.addEventListener('wheel', schedule, { signal, passive: true });
  const reset = () => {
    point = undefined;
    hide();
  };
  window.addEventListener('blur', reset, { signal });
  window.addEventListener('scroll', reset, { signal, passive: true });
  document.addEventListener('focusin', reset, { signal });
  document.addEventListener('visibilitychange', reset, { signal });
  return () => {
    controller.abort();
    if (frame !== undefined) cancelAnimationFrame(frame);
    clearTarget();
    preview.remove();
  };
}

import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { t, useLocale } from './i18n';
type Heights = { details: number; files: number };
type Pane = keyof Heights;
const memory = new Map<string, Heights>();
const changeEvent = 'git-logs:pane-layout';
function storageKey(root: HTMLElement) {
  // Retain the pre-rename key so existing pane sizes remain available.
  return `git-tools.panes.v1.${root.dataset.layoutKind ?? 'panel'}`;
}
function read(root: HTMLElement): Heights | undefined {
  const key = storageKey(root);
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (
      value &&
      ['details', 'files'].every(
        (key) =>
          typeof value[key] === 'number' &&
          Number.isFinite(value[key]) &&
          value[key] >= 0,
      )
    )
      return { details: value.details, files: value.files };
  } catch {
    /* Opaque or storage-restricted frames still support resizing. */
  }
  return memory.get(key);
}
function save(root: HTMLElement, heights?: Heights) {
  const key = storageKey(root);
  if (heights) memory.set(key, heights);
  else memory.delete(key);
  try {
    if (heights) localStorage.setItem(key, JSON.stringify(heights));
    else localStorage.removeItem(key);
  } catch {
    /* Keep the in-frame fallback. */
  }
}
function measure(root: HTMLElement) {
  const details = root.querySelector<HTMLElement>('.details');
  const files = root.querySelector<HTMLElement>('.files');
  const graph = root.querySelector<HTMLElement>('.commit-list');
  if (!details || !graph) return null;
  const headers =
    graph.getBoundingClientRect().top -
    root.getBoundingClientRect().top +
    root.scrollTop;
  const handles = [
    ...root.querySelectorAll<HTMLElement>('.pane-resizer'),
  ].reduce((sum, node) => sum + node.getBoundingClientRect().height, 0);
  const min = { details: 64, files: files ? 120 : 0 };
  return {
    heights: {
      details: details.getBoundingClientRect().height,
      files: files?.getBoundingClientRect().height ?? 0,
    },
    min,
    budget: Math.max(
      min.details + min.files,
      root.clientHeight - headers - handles - 64,
    ),
  };
}
function fit(root: HTMLElement, heights: Heights): Heights {
  const size = measure(root);
  if (!size) return heights;
  const files = Math.max(
    size.min.files,
    Math.min(heights.files, size.budget - size.min.details),
  );
  return {
    files,
    details: Math.max(
      size.min.details,
      Math.min(heights.details, size.budget - files),
    ),
  };
}
function apply(root: HTMLElement, heights: Heights, custom = true) {
  root.style.setProperty('--details-pane-height', `${heights.details}px`);
  if (root.querySelector('.files'))
    root.style.setProperty('--files-pane-height', `${heights.files}px`);
  root.dataset.layoutCustom = String(custom);
  root.dispatchEvent(new Event(changeEvent));
}
function clear(root: HTMLElement) {
  root.style.removeProperty('--details-pane-height');
  root.style.removeProperty('--files-pane-height');
}
function reset(root: HTMLElement) {
  save(root);
  clear(root);
  root.dataset.layoutCustom = 'false';
  const size = measure(root);
  if (size) apply(root, fit(root, size.heights), false);
}
/** Only this hook and the splitters own the CSS size variables. Resizing never
 * rerenders the commit/file lists or recreates Monaco models. */
export function usePaneLayout(
  ref: RefObject<HTMLElement | null>,
  repository: string | undefined,
) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !repository) return;
    const stored = read(root);
    clear(root);
    root.dataset.layoutCustom = String(!!stored);
    const initial = measure(root);
    if (initial) apply(root, fit(root, stored ?? initial.heights), !!stored);
    const resize = () => {
      if (root.dataset.layoutDragging === 'true') return;
      const custom = root.dataset.layoutCustom === 'true';
      if (!custom) clear(root);
      const size = measure(root);
      if (size) apply(root, fit(root, size.heights), custom);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [repository, ref]);
}
export function PaneResizer({ pane }: { pane: Pane }) {
  useLocale();
  const element = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    id: number;
    startY: number;
    custom: boolean;
    moved: boolean;
    heights: Heights;
    min: Heights;
    budget: number;
    root: HTMLElement;
  } | null>(null);
  const [range, setRange] = useState({ value: 0, min: 0, max: 0 });
  useLayoutEffect(() => {
    const root = element.current?.closest<HTMLElement>('.history');
    if (!root) return;
    const update = () => {
      const size = measure(root);
      if (!size) return;
      setRange({
        value: Math.round(size.heights[pane]),
        min: size.min[pane],
        max: Math.max(
          size.min[pane],
          Math.round(
            pane === 'details'
              ? size.budget - size.heights.files
              : size.heights.files + size.heights.details - size.min.details,
          ),
        ),
      });
    };
    update();
    root.addEventListener(changeEvent, update);
    return () => {
      root.removeEventListener(changeEvent, update);
      if (drag.current) {
        root.dataset.layoutDragging = 'false';
        document.documentElement.classList.remove('pane-resizing');
        drag.current = null;
      }
    };
  }, [pane]);
  const resize = (
    root: HTMLElement,
    start: Heights,
    requested: number,
    minimum: Heights,
    budget: number,
  ) => {
    const max =
      pane === 'details'
        ? budget - start.files
        : start.details + start.files - minimum.details;
    const value = Math.max(minimum[pane], Math.min(requested, max));
    apply(
      root,
      pane === 'details'
        ? { ...start, details: value }
        : { files: value, details: start.details + start.files - value },
    );
  };
  function finish(event: { pointerId: number }, cancel = false) {
    const active = drag.current;
    if (!active || active.id !== event.pointerId) return;
    drag.current = null;
    active.root.dataset.layoutDragging = 'false';
    document.documentElement.classList.remove('pane-resizing');
    if (cancel || !active.moved) {
      if (!active.custom) clear(active.root);
      const size = measure(active.root);
      apply(
        active.root,
        fit(
          active.root,
          active.custom ? active.heights : (size?.heights ?? active.heights),
        ),
        active.custom,
      );
    } else {
      const size = measure(active.root);
      if (size) {
        const heights = fit(active.root, size.heights);
        apply(active.root, heights);
        save(active.root, heights);
      }
    }
    if (element.current?.hasPointerCapture(event.pointerId))
      element.current.releasePointerCapture(event.pointerId);
  }
  return (
    <div
      ref={element}
      className="pane-resizer"
      role="separator"
      tabIndex={0}
      aria-orientation="horizontal"
      aria-label={t(
        pane === 'details' ? '커밋 정보 높이 조절' : '변경 파일 높이 조절',
      )}
      aria-controls={pane === 'details' ? 'commit-details' : 'changed-files'}
      aria-valuenow={range.value}
      aria-valuemin={range.min}
      aria-valuemax={range.max}
      title={t('드래그해서 높이 조절 · 더블클릭으로 초기화')}
      onDoubleClick={() => {
        const root = element.current?.closest<HTMLElement>('.history');
        if (root) reset(root);
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        const root = event.currentTarget.closest<HTMLElement>('.history');
        if (!root) return;
        const size = measure(root);
        if (!size) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          id: event.pointerId,
          startY: event.clientY,
          custom: root.dataset.layoutCustom === 'true',
          moved: false,
          root,
          ...size,
        };
        root.dataset.layoutDragging = 'true';
        document.documentElement.classList.add('pane-resizing');
      }}
      onPointerMove={(event) => {
        const active = drag.current;
        if (!active || active.id !== event.pointerId) return;
        if (event.clientY === active.startY && !active.moved) return;
        active.moved = true;
        resize(
          active.root,
          active.heights,
          active.heights[pane] - (event.clientY - active.startY),
          active.min,
          active.budget,
        );
      }}
      onPointerUp={(event) => finish(event)}
      onPointerCancel={(event) => finish(event, true)}
      onLostPointerCapture={(event) => finish(event)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && drag.current) {
          event.preventDefault();
          finish({ pointerId: drag.current.id }, true);
          return;
        }
        if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key))
          return;
        const root = event.currentTarget.closest<HTMLElement>('.history');
        if (!root) return;
        const size = measure(root);
        if (!size) return;
        event.preventDefault();
        const max =
          pane === 'details'
            ? size.budget - size.heights.files
            : size.heights.files + size.heights.details - size.min.details;
        const value =
          event.key === 'Home'
            ? size.min[pane]
            : event.key === 'End'
              ? max
              : size.heights[pane] +
                (event.key === 'ArrowUp' ? 1 : -1) * (event.shiftKey ? 40 : 10);
        resize(root, size.heights, value, size.min, size.budget);
        const result = measure(root);
        if (result) save(root, result.heights);
      }}
    />
  );
}

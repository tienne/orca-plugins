import { useLayoutEffect, useRef, useState } from 'react';

export type FocusArea = 'graph' | 'files';

interface Options {
  graph: {
    count: number;
    selectedIndex: number;
    listElement: HTMLElement | null;
    // 목록이 그려지지 않는 동안(조회 중)은 움직이지 않는다.
    enabled: boolean;
    select: (index: number) => void;
  };
  files: {
    paths: string[];
    selected: string;
    listElement: HTMLElement | null;
    select: (path: string) => void;
  };
  // 메뉴가 state로 열려 있는 동안은 메뉴 자체의 위/아래 키 처리가 우선이다.
  blocked: boolean;
}

// 메뉴·팝오버·다이얼로그·슬라이더형 분할선은 자기 방향키를 처리하므로 안쪽 이벤트는 건드리지 않는다.
const OWN_KEYS =
  '[role=menu],[role=listbox],[role=separator],[role=dialog],dialog,input,textarea,select';

function ownsArrowKeys(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return (
    !!target.closest(OWN_KEYS) || (target as HTMLElement).isContentEditable
  );
}

// 행이 보이는 가장 가까운 위치까지만 스크롤한다. 넘치는 쪽만 맞춰 불필요하게 목록이 튀지 않게 한다.
function reveal(container: HTMLElement, row: HTMLElement) {
  const box = container.getBoundingClientRect();
  const rect = row.getBoundingClientRect();
  if (rect.top < box.top) container.scrollTop -= box.top - rect.top;
  else if (rect.bottom > box.bottom)
    container.scrollTop += rect.bottom - box.bottom;
}

/** 마지막으로 클릭한 영역(그래프 또는 변경 파일 목록)이 위/아래 키를 받게 한다.
 * 이동한 행은 화면 안으로 가져오고 포커스를 옮겨 스크린 리더가 읽게 한다. */
export function useKeyboardNav(options: Options) {
  const [focusArea, setFocusArea] = useState<FocusArea>('graph');
  // 키 이벤트는 문서에 한 번만 붙이고, 렌더마다 최신 값을 ref로 읽는다.
  const latest = useRef({ options, focusArea });
  latest.current = { options, focusArea };
  const moved = useRef<FocusArea | null>(null);

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;
      const { options: o, focusArea: area } = latest.current;
      if (o.blocked || ownsArrowKeys(event.target)) return;
      if (
        document.querySelector(
          '.branch-trigger[aria-expanded="true"], [role=menu], dialog[open]',
        )
      )
        return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      if (area === 'graph') {
        const { count, selectedIndex, enabled, select } = o.graph;
        if (!enabled || count === 0) return;
        event.preventDefault();
        // 선택이 없으면(작업 트리·범위 비교) 방향과 상관없이 맨 위 커밋에서 시작한다.
        const next = selectedIndex < 0 ? 0 : selectedIndex + step;
        if (next < 0 || next >= count || next === selectedIndex) return;
        moved.current = 'graph';
        select(next);
      } else {
        const { paths, selected, select } = o.files;
        if (paths.length === 0) return;
        event.preventDefault();
        const current = paths.indexOf(selected);
        const next = current < 0 ? 0 : current + step;
        if (next < 0 || next >= paths.length || next === current) return;
        moved.current = 'files';
        select(paths[next]);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // 선택이 바뀐 렌더 뒤에 스크롤과 포커스를 맞춘다. 선택 행은 가상 스크롤 창 밖이어도 그려진다.
  const { selectedIndex, listElement } = options.graph;
  useLayoutEffect(() => {
    if (moved.current !== 'graph') return;
    moved.current = null;
    const row = listElement?.querySelector<HTMLElement>(
      `[data-index="${selectedIndex}"]`,
    );
    if (!listElement || !row) return;
    reveal(listElement, row);
    row.focus({ preventScroll: true });
  }, [selectedIndex]);
  const { paths, selected, listElement: fileList } = options.files;
  useLayoutEffect(() => {
    if (moved.current !== 'files') return;
    moved.current = null;
    const row =
      fileList?.querySelectorAll<HTMLElement>('.file-row')[
        paths.indexOf(selected)
      ];
    if (!fileList || !row) return;
    reveal(fileList, row);
    row.focus({ preventScroll: true });
  }, [selected]);

  // 영역을 바꾸면 이전 영역에서 대기 중이던 포커스 이동은 버린다.
  function switchArea(area: FocusArea) {
    moved.current = null;
    setFocusArea(area);
  }
  return {
    focusArea,
    graphArea: {
      onMouseDown: () => switchArea('graph'),
      onFocus: () => switchArea('graph'),
    },
    filesArea: {
      onMouseDown: () => switchArea('files'),
      onFocus: () => switchArea('files'),
    },
  };
}

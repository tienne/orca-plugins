import { useEffect, useRef, useState } from 'react';
import type { CompositionEvent } from 'react';
import type { LogFilter } from '../../protocol';

export type FilterField = 'text' | 'author' | 'since' | 'until' | 'path';
type FilterInput = Record<FilterField, string> & { follow: boolean };

const DEBOUNCE_MS = 300;
const COMPOSING_DEBOUNCE_MS = 600;
const fields: FilterField[] = ['text', 'author', 'since', 'until', 'path'];
const empty: FilterInput = {
  text: '',
  author: '',
  since: '',
  until: '',
  path: '',
  follow: false,
};
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const filterLabels: Record<FilterField, string> = {
  text: '메시지',
  author: '작성자',
  since: '시작일',
  until: '종료일',
  path: '경로',
};

// 공백만 있거나 형식이 덜 찬 값은 요청에 싣지 않는다. 날짜 입력 중간 상태가 워커 오류로 번지지 않게 한다.
function normalize(input: FilterInput): LogFilter {
  const filter: LogFilter = {};
  for (const field of fields) {
    const value =
      field === 'since' || field === 'until'
        ? DATE.test(input[field])
          ? input[field]
          : ''
        : input[field].trim();
    if (value) filter[field] = value;
  }
  // 이름 변경 추적은 경로가 있을 때만 의미가 있다.
  if (input.follow && filter.path) filter.follow = true;
  return filter;
}

export const filterKey = (filter: LogFilter) =>
  JSON.stringify([
    ...fields.map((field) => filter[field] ?? ''),
    filter.follow === true,
  ]);
export const hasFilter = (filter: LogFilter) =>
  fields.some((field) => !!filter[field]);

export function useLogFilter() {
  const [input, setInput] = useState<FilterInput>(empty);
  const [filter, setFilter] = useState<LogFilter>({});
  // 내용이 같으면 이전 객체를 유지해 같은 조건으로 다시 요청하지 않게 한다.
  const apply = (next: LogFilter) =>
    setFilter((current) =>
      filterKey(current) === filterKey(next) ? current : next,
    );
  // 조합 중인 글자는 다음 자모가 붙으면 바뀌므로 덜 찬 음절이 필터 인자로 나가는 일을 줄이려고 조합 중에는 더 오래 기다린다.
  const composing = useRef(false);
  useEffect(() => {
    const delay = composing.current ? COMPOSING_DEBOUNCE_MS : DEBOUNCE_MS;
    const timer = setTimeout(() => apply(normalize(input)), delay);
    return () => clearTimeout(timer);
  }, [input]);
  const chips = fields
    .filter((field) => filter[field])
    .map((field) => ({
      field,
      value: filter[field] as string,
      follow: field === 'path' && filter.follow === true,
    }));
  // 경로를 직접 고치면 추적 대상 파일이 달라지므로 추적도 함께 끈다.
  function change(field: FilterField, value: string) {
    setInput((current) => ({
      ...current,
      [field]: value,
      ...(field === 'path' ? { follow: false } : {}),
    }));
  }
  // 조합이 끝나도 입력 값이 그대로면 effect가 다시 돌지 않는다. 같은 값을 다시 넣어 디바운스를 새로 시작한다.
  function composition(field: FilterField) {
    return {
      onCompositionStart: () => {
        composing.current = true;
      },
      onCompositionEnd: (e: CompositionEvent<HTMLInputElement>) => {
        composing.current = false;
        change(field, e.currentTarget.value);
      },
    };
  }
  // 칩 해제는 명시적 조작이라 디바운스를 기다리지 않고 바로 반영한다.
  function clear(field: FilterField) {
    const next = {
      ...input,
      [field]: '',
      ...(field === 'path' ? { follow: false } : {}),
    };
    setInput(next);
    apply(normalize(next));
  }
  // 파일 히스토리 진입도 명시적 조작이라 바로 반영한다.
  function followFile(path: string) {
    const next = { ...input, path, follow: true };
    setInput(next);
    apply(normalize(next));
  }
  function clearAll() {
    setInput(empty);
    apply({});
  }
  return {
    input,
    filter,
    chips,
    change,
    composition,
    clear,
    clearAll,
    followFile,
  };
}

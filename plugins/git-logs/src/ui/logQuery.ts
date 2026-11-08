import type { LogFilter } from '../protocol';
import { hasFilter } from './hooks/useLogFilter';

/** 지금 보이는 목록을 받은 조건. 다음 페이지 커서는 이 조건과 함께 보내야 스냅샷이 맞는다. */
export type LogRequest = { scope: string; filter: LogFilter };

// 워커는 전체 브랜치 범위의 이름 변경 추적을 거부하므로 요청 전에 follow만 뺀다.
export function effectiveFilter(
  selection: string,
  filter: LogFilter,
): LogFilter {
  if (selection !== 'all' || !filter.follow) return filter;
  const rest = { ...filter };
  delete rest.follow;
  return rest;
}

export function logInput(repo: string, selection: string, filter: LogFilter) {
  return {
    repo,
    all: selection === 'all',
    ...(selection !== 'current' && selection !== 'all'
      ? { branchRef: selection }
      : {}),
    ...(hasFilter(filter)
      ? { filter: effectiveFilter(selection, filter) }
      : {}),
  };
}

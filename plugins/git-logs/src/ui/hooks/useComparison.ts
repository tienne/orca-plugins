import { useEffect, useRef, useState } from 'react';
import type {
  ChangeSet,
  ChangedFile,
  Comparison,
  Descriptor,
  FileDiff,
  Repository,
} from '../../protocol';
import { request } from '../client';
import { demo, message, scenario } from '../env';
import {
  fixtureDiff,
  fixtureFiles,
  fixtureRange,
  fixtureSet,
} from '../fixture';

export type ComparisonState = ReturnType<typeof useComparison>;

const COMMIT_SETTLE_MS = 80;

// 이름이 바뀐 이력에서는 커밋마다 파일 경로가 달라 정확하지 않다. 못 찾으면 고르지 않는다.
function historyFile(files: ChangedFile[], path: string) {
  if (files.length === 1) return files[0].path;
  return (
    (
      files.find((f) => f.path === path) ??
      files.find((f) => f.oldPath === path)
    )?.path ?? ''
  );
}

export function useComparison() {
  const [comparison, setComparison] = useState<Comparison>({ kind: 'working' });
  const [set, setSet] = useState<ChangeSet | null>(null);
  const [file, setFile] = useState('');
  const [data, setData] = useState<FileDiff | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingDiff, setLoadingDiff] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [fileSearch, setFileSearch] = useState('');
  const [baseCommit, setBaseCommit] = useState<string | null>(null);
  const [rangeMergeBase, setRangeMergeBase] = useState(false);
  const pendingPath = useRef('');
  // 파일 히스토리 목록에서 커밋을 고를 때 자동 선택할 파일 경로. 다음 changes 응답에서 한 번만 쓴다.
  const historyPath = useRef('');
  function compareWithBase(target: string) {
    if (!baseCommit) return;
    setComparison({
      kind: 'range',
      base: baseCommit,
      target,
      mergeBase: rangeMergeBase,
    });
  }
  // 토글 값은 다음 비교에도 이어 쓰도록 따로 기억한다.
  function changeMergeBase(value: boolean) {
    setRangeMergeBase(value);
    setComparison((current) =>
      current.kind === 'range' ? { ...current, mergeBase: value } : current,
    );
  }
  return {
    comparison,
    setComparison,
    baseCommit,
    setBaseCommit,
    compareWithBase,
    changeMergeBase,
    set,
    setSet,
    file,
    setFile,
    data,
    setData,
    loadingFiles,
    setLoadingFiles,
    loadingDiff,
    setLoadingDiff,
    generation,
    setGeneration,
    fileSearch,
    setFileSearch,
    pendingPath,
    historyPath,
  };
}

// 저장소 hook이 비교 상태를 초기화해야 하고 이 로더는 저장소를 읽어야 해서,
// 상태 선언과 로딩 effect를 나눠 순환 의존을 끊는다.
export function useComparisonLoader(
  repo: Repository | null,
  state: ComparisonState,
  setError: (value: string) => void,
) {
  const {
    comparison,
    set,
    file,
    generation,
    pendingPath,
    historyPath,
    setSet,
    setFile,
    setData,
    setLoadingFiles,
    setLoadingDiff,
  } = state;
  useEffect(() => {
    if (!repo) return;
    let active = true;
    // 워커 요청은 취소할 수 없어서, 방향키를 연속으로 누를 때는 멈춘 커밋만 요청하도록 잠깐 기다린다.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const history = comparison.kind === 'commit' ? historyPath.current : '';
    setLoadingFiles(true);
    setData(null);
    setSet(null);
    setError('');
    (demo
      ? scenario === 'loading'
        ? new Promise<ChangeSet>(() => {})
        : scenario === 'error'
          ? Promise.reject(
              new Error('DEMO 오류 상태 · 저장소 조회 실패 fixture'),
            )
          : comparison.kind === 'range'
            ? new Promise<ChangeSet>((resolve) =>
                resolve(fixtureRange(comparison)),
              )
            : Promise.resolve({
                ...fixtureSet,
                files:
                  scenario === 'empty' || scenario === 'unchanged'
                    ? []
                    : fixtureFiles(comparison),
                comparison,
                left:
                  comparison.kind === 'commit'
                    ? (comparison.parent ?? '부모 1')
                    : fixtureSet.left,
                right:
                  comparison.kind === 'commit'
                    ? comparison.commit
                    : fixtureSet.right,
              })
      : comparison.kind === 'commit'
        ? new Promise<void>((resolve) => {
            timer = setTimeout(resolve, COMMIT_SETTLE_MS);
          }).then(() => request('changes', { repo: repo.root, comparison }))
        : request('changes', { repo: repo.root, comparison })
    )
      .then((result) => {
        if (active) {
          setSet(result);
          if (result.setupWarning) setError(result.setupWarning);
          setFile(
            history
              ? historyFile(result.files, history)
              : result.files.some((f) => f.path === pendingPath.current)
                ? pendingPath.current
                : (result.files[0]?.path ?? ''),
          );
          pendingPath.current = '';
          // 반영된 뒤에는 비워 다른 비교로 새지 않게 한다.
          historyPath.current = '';
        }
      })
      .catch((e) => {
        if (active) setError(message(e));
      })
      .finally(() => {
        if (active) setLoadingFiles(false);
      });
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [repo?.root, comparison, generation]);
  useEffect(() => {
    setData(null);
    setLoadingDiff(false);
    if (!repo || !file || !set) return;
    let active = true;
    setLoadingDiff(true);
    (demo
      ? Promise.resolve(fixtureDiff(file))
      : request('diff', {
          repo: repo.root,
          comparison: set.comparison,
          path: file,
        })
    )
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        if (active) setError(message(e));
      })
      .finally(() => {
        if (active) setLoadingDiff(false);
      });
    return () => {
      active = false;
    };
  }, [repo?.root, set, file]);
}

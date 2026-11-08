import { useEffect, useState } from 'react';
import { request } from '../client';
import { demo, message, scenario } from '../env';
import { fixtureCommitMessage } from '../fixture';
import { COMMIT_SETTLE_MS } from '../timing';

interface Loaded {
  hash: string;
  message?: string;
  error?: string;
}

// 선택이 바뀐 뒤 도착한 응답은 hash가 달라 버려진다.
export function useCommitMessage(
  repoRoot: string | undefined,
  hash: string | undefined,
) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  useEffect(() => {
    setLoaded(null);
    if (!repoRoot || !hash) return;
    let active = true;
    // 선택이 멈춘 뒤에만 요청한다. 지나가는 커밋의 본문은 받지 않는다.
    const timer = setTimeout(() => {
      (demo
        ? scenario === 'messageError'
          ? Promise.reject(new Error('DEMO 커밋 본문 조회 실패 fixture'))
          : Promise.resolve(fixtureCommitMessage(hash))
        : request('commitMessage', { repo: repoRoot, commit: hash })
      )
        .then((result) => {
          if (active) setLoaded({ hash, message: result.message });
        })
        .catch((e: unknown) => {
          if (active) setLoaded({ hash, error: message(e) });
        });
    }, COMMIT_SETTLE_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [repoRoot, hash]);
  const current = loaded?.hash === hash ? loaded : null;
  return { body: current?.message, error: current?.error };
}

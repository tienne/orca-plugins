import { useEffect, useState } from 'react';
import { request } from '../client';
import { demo, scenario } from '../env';
import { fixtureCommitMessage } from '../fixture';

interface Loaded {
  hash: string;
  message?: string;
  failed?: boolean;
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
    (demo
      ? scenario === 'messageError'
        ? Promise.reject(new Error('DEMO 커밋 본문 조회 실패 fixture'))
        : Promise.resolve(fixtureCommitMessage(hash))
      : request('commitMessage', { repo: repoRoot, commit: hash })
    )
      .then((result) => {
        if (active) setLoaded({ hash, message: result.message });
      })
      .catch(() => {
        if (active) setLoaded({ hash, failed: true });
      });
    return () => {
      active = false;
    };
  }, [repoRoot, hash]);
  const current = loaded?.hash === hash ? loaded : null;
  return { body: current?.message, failed: current?.failed === true };
}

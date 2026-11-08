import { useEffect, useState } from 'react';
import type { CommitMenu } from '../CommitActions';

export function useCommitMenu(repoRoot: string | undefined, workspace: string) {
  const [commitMenu, setCommitMenu] = useState<CommitMenu | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  useEffect(() => {
    setCommitMenu(null);
  }, [repoRoot, workspace]);
  return { commitMenu, setCommitMenu, actionBusy, setActionBusy };
}

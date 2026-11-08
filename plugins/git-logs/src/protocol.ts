export interface Commit {
  hash: string;
  parents: string[];
  subject: string;
  author: string;
  date: string;
  refs: string[];
}
export type Comparison =
  | { kind: 'working'; head?: string | null }
  | { kind: 'commit'; commit: string; parent?: string }
  | { kind: 'range'; base: string; target: string; mergeBase?: boolean };
export interface ChangedFile {
  path: string;
  oldPath?: string;
  status: string;
  staged?: boolean;
  unstaged?: boolean;
  untracked?: boolean;
  conflict?: boolean;
}
export interface ChangeSet {
  setupWarning?: string;
  comparison: Comparison;
  files: ChangedFile[];
  left: string;
  right: string;
}
export interface FileSide {
  text: string;
  kind: 'text' | 'binary' | 'missing' | 'special' | 'large';
  bytes: number;
}
export interface FileDiff {
  file: ChangedFile;
  original: FileSide;
  modified: FileSide;
}
export interface BranchRef {
  ref: string;
  name: string;
  hash: string;
  kind: 'local' | 'remote';
}
export interface LogFilter {
  text?: string;
  author?: string;
  since?: string;
  until?: string;
  path?: string;
  follow?: boolean;
}
export interface Repository {
  root: string;
  branch: string;
  head: string | null;
  commits: Commit[];
  localBranches?: { name: string; hash: string }[];
  branches?: BranchRef[];
  nextCursor?: string;
  hasMore?: boolean;
}
export interface Descriptor {
  // range 비교 문서만 2를 써서 0.1.x가 모르는 문서를 열지 않게 한다.
  version: 1 | 2;
  repo: string;
  comparison: Comparison;
  path?: string;
}
export interface WorkspaceContext {
  displayName: string;
  branch: string;
  terminals: { id: string }[];
}
export interface WorkspaceChoice {
  id: string;
  name: string;
  path: string;
  branch: string | null;
}
export type GitAction =
  | 'checkout'
  | 'branch'
  | 'merge'
  | 'rebase'
  | 'cherry-pick'
  | 'revert'
  | 'reset';
export interface OperationInput {
  action: GitAction;
  commit: string;
  branch?: string;
  resetMode?: 'soft' | 'mixed' | 'hard';
  mainline?: number;
}
export interface OperationPlan {
  token: string;
  action: GitAction;
  root: string;
  head: string;
  currentBranch: string;
  target: string;
  command: string[];
  summary: string;
  confirmation: string;
  backupRef?: string;
}
export interface OperationResult {
  status: 'success' | 'conflict' | 'failed';
  message: string;
  conflicts: string[];
  backupRef?: string;
}
export type ActiveConnection =
  | { status: 'connected'; repository: Repository; workspace: WorkspaceChoice }
  | {
      status: 'choose' | 'unavailable';
      choices: WorkspaceChoice[];
      message: string;
    };
export interface Requests {
  prepare: {
    input: { repo: string; workspaceId: string; operation: OperationInput };
    output: OperationPlan;
  };
  execute: {
    input: {
      repo: string;
      workspaceId: string;
      token: string;
      confirmation: string;
    };
    output: OperationResult;
  };
  active: {
    input: { all?: boolean; workspaceId?: string };
    output: ActiveConnection;
  };
  log: {
    input: {
      repo: string;
      all?: boolean;
      branchRef?: string;
      filter?: LogFilter;
      cursor?: string;
      // 'filter'를 보내면 같은 저장소의 앞선 'filter' 요청과 진행 중인 다음 페이지 요청을 취소한다.
      cancelKey?: 'filter';
    };
    output: Repository;
  };
  commitMessage: {
    input: { repo: string; commit: string };
    output: { message: string };
  };
  changes: {
    input: { repo: string; comparison: Comparison };
    output: ChangeSet;
  };
  diff: {
    input: { repo: string; comparison: Comparison; path: string };
    output: FileDiff;
  };
  workspaces: {
    input: { repo: string };
    output: { id: string; name: string }[];
  };
  open: {
    input: { descriptor: Descriptor; workspaceId: string };
    output: { opened: true; setupWarning?: string };
  };
}
export interface HostVersion {
  major: number;
  minor: number;
}
export interface WorkerEvents {
  'workspace.created': {
    workspaceId: string;
    kind: 'worktree' | 'folder';
    path: string;
    branch: string;
  };
  'workspace.changed': { context: WorkspaceContext | null };
}
export interface WorkerApi {
  api: HostVersion;
  panels: { handle(name: string, handler: (input: unknown) => unknown): void };
  events?: {
    on<E extends keyof WorkerEvents>(
      event: E,
      handler: (payload: WorkerEvents[E]) => void | Promise<void>,
    ): { dispose(): void };
  };
  host: {
    has(name: string): boolean;
    call(name: string, params: unknown): Promise<unknown>;
  };
  log(message: string): void;
}
export interface DocumentSession {
  value: string;
  onReplace(handler: (value: string) => void): () => void;
  dispose(): void;
}
// Narrow, manually maintained subset of the version-matched Orca authoring reference.
export interface FrameApi {
  locale?: string;
  on?<E extends 'theme' | 'workspace.changed'>(
    event: E,
    handler: (
      payload: E extends 'workspace.changed'
        ? { context: WorkspaceContext | null }
        : unknown,
    ) => void,
  ): unknown;
  api: HostVersion;
  host: { has(name: string): boolean };
  plugin: {
    request<T>(
      name: string,
      input: unknown,
      options?: { timeoutMs?: number },
    ): Promise<T>;
  };
  document?: { session(): Promise<DocumentSession> };
}
declare global {
  interface Window {
    orca?: FrameApi;
  }
}

// 워커와 UI가 같은 값을 쓴다. 따로 두면 한쪽만 바뀌어 페이징 상한과 오류 판별이 어긋난다.
export const PAGE_SIZE = 200;
export const LOAD_LIMIT = 5000;
export const STALE_CURSOR_PREFIX = 'stale-cursor:';

// range 문서만 version 2로 올려 0.1.x가 해석하지 못하는 문서를 거부하게 한다.
export function descriptorVersion(
  comparison: Comparison,
): Descriptor['version'] {
  return comparison.kind === 'range' ? 2 : 1;
}
export function checkDescriptorVersion(descriptor: unknown): void {
  const d = descriptor as Partial<Descriptor> | null | undefined;
  if (d?.version !== 1 && d?.version !== 2)
    throw new Error('지원하지 않는 비교 문서입니다.');
  if (d.version === 1 && d.comparison?.kind === 'range')
    throw new Error('지원하지 않는 비교 문서입니다.');
}

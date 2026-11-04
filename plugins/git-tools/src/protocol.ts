export interface Commit {
  hash: string;
  parents: string[];
  message: string;
  author: string;
  date: string;
  refs: string[];
}
export type Comparison =
  | { kind: 'working'; head?: string | null }
  | { kind: 'commit'; commit: string; parent?: string };
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
export interface Repository {
  root: string;
  branch: string;
  head: string | null;
  commits: Commit[];
  localBranches?: { name: string; hash: string }[];
}
export interface Descriptor {
  version: 1;
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
  log: { input: { repo: string; all?: boolean }; output: Repository };
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
    output: { opened: true };
  };
}
export interface HostVersion {
  major: number;
  minor: number;
}
export interface WorkerApi {
  api: HostVersion;
  panels: { handle(name: string, handler: (input: unknown) => unknown): void };
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

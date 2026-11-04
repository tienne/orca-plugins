export interface PluginInfo { name: string; version: string; }
export interface WorkspaceContext { branch: string; displayName: string; terminals: { id: string }[]; }
// Narrow bridge types for the starter. Generate full host typings with `orca plugin types` when available.
export interface WorkerApi {
  panels: { handle(name: 'plugin.info', handler: () => PluginInfo): void };
  log(message: string): void;
}
export interface FrameApi {
  plugin: { request(name: 'plugin.info', input: Record<string, never>): Promise<PluginInfo> };
  host: { call(name: 'workspace.readContext', params: Record<string, never>): Promise<WorkspaceContext | null> };
}
declare global { interface Window { orca?: FrameApi; } }

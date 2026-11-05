declare module 'virtual:git-logs-icon-masks' {
  const masks: Record<string, string>;
  export default masks;
}

// Narrow types for the icon registry shipped by the pinned Monaco version.
declare module 'monaco-editor/platform/theme/common/iconRegistry.js' {
  type Definition = { id: string } | { fontCharacter: string; font?: unknown };
  interface Icon {
    id: string;
    defaults: Definition | undefined;
  }
  export function getIconRegistry(): {
    getIcons(): Icon[];
    getIcon(id: string): Icon | undefined;
    onDidChange(listener: () => void): { dispose(): void };
  };
}

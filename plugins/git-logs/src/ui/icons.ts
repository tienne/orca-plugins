import masks from 'virtual:git-logs-icon-masks';
import { getIconRegistry } from 'monaco-editor/platform/theme/common/iconRegistry.js';
import './icons.css';

let users = 0;
let dispose: (() => void) | undefined;

export function installSvgIcons() {
  if (users++ === 0) {
    const registry = getIconRegistry();
    const style = document.createElement('style');
    style.dataset.gitLogsIcons = 'svg';
    const update = () => {
      const rules: string[] = [];
      for (const icon of registry.getIcons()) {
        let definition = icon.defaults;
        const visited = new Set<string>();
        while (definition && 'id' in definition) {
          if (visited.has(definition.id)) {
            definition = undefined;
            break;
          }
          visited.add(definition.id);
          definition = registry.getIcon(definition.id)?.defaults;
        }
        if (!definition || definition.font) continue;
        const mask = masks[definition.fontCharacter];
        if (mask)
          rules.push(
            `.codicon.codicon-${CSS.escape(icon.id)}::before { background-color: currentColor; mask-image: ${mask}; -webkit-mask-image: ${mask}; }`,
          );
      }
      style.textContent = rules.join('\n');
    };
    update();
    document.head.appendChild(style);
    const subscription = registry.onDidChange(update);
    dispose = () => {
      subscription.dispose();
      style.remove();
    };
  }
  return () => {
    if (--users === 0) {
      dispose?.();
      dispose = undefined;
    }
  };
}

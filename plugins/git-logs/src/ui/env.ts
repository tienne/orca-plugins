export const demo = !window.orca;
export const scenario = demo
  ? (new URLSearchParams(location.search).get('fixture') ?? 'default')
  : 'default';
export const editorMode = document.body.dataset.surface === 'editor';
export const message = (e: unknown) =>
  e instanceof Error ? e.message : String(e);

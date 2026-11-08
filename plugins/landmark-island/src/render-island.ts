// Keep the live island connected while refreshing its surrounding controls.
// Disconnecting animated DOM (even if reattached) restarts the visible scene.
export function renderIsland(root: HTMLElement, markup: string) {
  const template = document.createElement('template');
  template.innerHTML = markup;
  const section = root.querySelector<HTMLElement>('.island-section');
  const nextSection =
    template.content.querySelector<HTMLElement>('.island-section');
  const ocean = section?.querySelector<HTMLElement>('.ocean');
  const nextOcean = nextSection?.querySelector<HTMLElement>('.ocean');
  if (!section || !nextSection || !ocean || !nextOcean) {
    root.replaceChildren(template.content);
    return;
  }

  // Keep the section and ocean in place, including their active animations.
  const replaceAround = (
    parent: Element,
    retained: Element,
    next: Element | DocumentFragment,
    marker: Element,
  ) => {
    for (const node of Array.from(parent.childNodes))
      if (node !== retained) node.remove();
    let after = false;
    for (const node of Array.from(next.childNodes)) {
      if (node === marker) {
        after = true;
        continue;
      }
      parent.insertBefore(node, after ? null : retained);
    }
  };
  replaceAround(section, ocean, nextSection, nextOcean);
  replaceAround(root, section, template.content, nextSection);

  const ground = ocean.querySelector<HTMLElement>('.world-ground')!;
  const nextGround = nextOcean.querySelector<HTMLElement>('.world-ground')!;
  const cells = new Map(
    Array.from(
      ground.querySelectorAll<HTMLElement>('[data-world-cell]'),
      (el) => [el.dataset.worldCell, el],
    ),
  );
  const syncAttributes = (current: Element, next: Element) => {
    for (const attr of Array.from(current.attributes))
      if (!next.hasAttribute(attr.name)) current.removeAttribute(attr.name);
    for (const attr of Array.from(next.attributes))
      if (current.getAttribute(attr.name) !== attr.value)
        current.setAttribute(attr.name, attr.value);
  };
  for (const next of Array.from(
    nextGround.querySelectorAll<HTMLElement>('[data-world-cell]'),
  )) {
    const current = cells.get(next.dataset.worldCell);
    if (!current) {
      ground.insertBefore(next, ground.querySelector('.world-sign'));
      continue;
    }
    cells.delete(next.dataset.worldCell);
    // Keep an unchanged building alive even when its floor or selection changes.
    const base = current.querySelector('.tile-base')!;
    const nextBase = next.querySelector('.tile-base')!;
    if (base.outerHTML !== nextBase.outerHTML) base.replaceWith(nextBase);
    syncAttributes(
      current.querySelector('.cell')!,
      next.querySelector('.cell')!,
    );
    if (current.dataset.objectKey !== next.dataset.objectKey) {
      current.querySelector('.world-object')?.remove();
      const object = next.querySelector('.world-object');
      if (object) current.append(object);
      current.dataset.objectKey = next.dataset.objectKey;
    }
  }
  for (const cell of cells.values()) cell.remove();

  // Menus may change, but the camera, avatar, weather and ocean never detach.
  for (const selector of [
    '.minimap',
    '.camera-controls',
    '.walk-controls',
    '.island-satchel',
    '.canvas-inventory',
    '.canvas-editor',
  ]) {
    const current = ocean.querySelector(selector);
    const next = nextOcean.querySelector(selector);
    if (current && next) current.replaceWith(next);
  }
}

export function observeCatalogMotion(
  scroll: HTMLElement,
  intersectionRoot: Element | null = scroll,
) {
  const syncVisibility = () => {
    scroll.dataset.motionPaused = String(document.hidden);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        (entry.target as HTMLElement).dataset.motionVisible = String(
          entry.isIntersecting && entry.intersectionRatio > 0,
        );
    },
    { root: intersectionRoot, threshold: 0.01 },
  );
  scroll
    .querySelectorAll<HTMLElement>(
      '.collection .card[data-catalog-id], .life-preview-card',
    )
    .forEach((card) => {
      card.dataset.motionVisible = 'false';
      observer.observe(card);
    });
  syncVisibility();
  document.addEventListener('visibilitychange', syncVisibility);
  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', syncVisibility);
  };
}

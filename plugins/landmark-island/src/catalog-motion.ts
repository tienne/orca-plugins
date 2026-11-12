export function observeCatalogMotion(scroll: HTMLElement) {
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
    { root: scroll, threshold: 0.01 },
  );
  scroll
    .querySelectorAll<HTMLElement>('.collection .card[data-catalog-id]')
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

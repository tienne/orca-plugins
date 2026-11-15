/** 보이는 카드부터 그림을 만들고 화면 밖 재생을 멈춰 큰 도감의 초기 비용을 줄인다. */
export function observeCatalogMotion(
  scroll: HTMLElement,
  intersectionRoot: Element | null = scroll,
  hydrate?: (card: HTMLElement) => void,
) {
  const syncVisibility = () => {
    scroll.dataset.motionPaused = String(document.hidden);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0;
        const card = entry.target as HTMLElement;
        if (visible) hydrate?.(card);
        card.dataset.motionVisible = String(visible);
      }
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

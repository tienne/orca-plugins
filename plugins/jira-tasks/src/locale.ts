/** 호스트의 지원 언어 태그를 지역 정보와 함께 유지하고 나머지는 영어로 대체합니다. */
export function resolveLocale(value: unknown): string {
  try {
    if (typeof value === 'string') {
      const locale = Intl.getCanonicalLocales(value)[0];
      if (/^(ko|en)(-|$)/.test(locale)) return locale;
    }
  } catch {
    // 호스트 값이 잘못되어도 패널은 기본 언어로 열립니다.
  }
  return 'en-US';
}

/** 날짜나 개수의 원본은 유지하고 화면 표시에만 선택한 locale을 적용합니다. */
export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(resolveLocale(locale)).format(value);
}

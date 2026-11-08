import cities from './timezone-cities.json';

export const WEATHER_HOUR = 60 * 60 * 1000;
export type WeatherKind = 0 | 1 | 2 | 3;
export type WeatherReport = {
  timezone: string;
  weather: WeatherKind | null;
  updatedAt: number | null;
  nextCheckAt: number;
  status: 'fresh' | 'stale' | 'unavailable' | 'unsupported';
};
// IANA tzdb 2026f zone.tab principal-location coordinates, public domain.
// Country-specific rows are retained; aliases never override their locations.
export function timezoneLocation(timezone: unknown) {
  if (typeof timezone !== 'string' || timezone.length > 100) return null;
  const locations = cities.locations as Record<string, (string | number)[]>;
  const aliases = cities.aliases as Record<string, string>;
  const zone = Object.hasOwn(locations, timezone)
    ? timezone
    : Object.hasOwn(aliases, timezone)
      ? aliases[timezone]
      : '';
  if (!Object.hasOwn(locations, zone)) return null;
  const [city, latitude, longitude] = locations[zone];
  if (
    typeof city !== 'string' ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  )
    return null;
  return { zone, city, latitude, longitude };
}
export function weatherKind(code: unknown): WeatherKind | null {
  if (code === 0 || code === 1) return 0;
  if ([2, 3, 45, 48].includes(code as number)) return 1;
  if (
    [
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 97, 99,
    ].includes(code as number)
  )
    return 2;
  if ([71, 73, 75, 77, 85, 86].includes(code as number)) return 3;
  return null;
}
export function validWeather(value: unknown): value is WeatherKind {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 3;
}
export function validReport(
  value: unknown,
  timezone: string,
): value is WeatherReport {
  if (!value || typeof value !== 'object') return false;
  const r = value as WeatherReport;
  return (
    r.timezone === timezone &&
    ['fresh', 'stale', 'unavailable', 'unsupported'].includes(r.status) &&
    Number.isFinite(r.nextCheckAt) &&
    ((r.weather === null &&
      r.updatedAt === null &&
      ['unavailable', 'unsupported'].includes(r.status)) ||
      (validWeather(r.weather) &&
        Number.isFinite(r.updatedAt) &&
        Number(r.updatedAt) >= 0 &&
        Number(r.updatedAt) <= 8640000000000000 &&
        ['fresh', 'stale'].includes(r.status)))
  );
}

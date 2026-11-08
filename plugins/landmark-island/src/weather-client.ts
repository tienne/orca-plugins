import {
  WEATHER_HOUR,
  validReport,
  timezoneLocation,
  type WeatherReport,
} from './weather';
export type WeatherReader = (timezone: string) => Promise<unknown>;
export class TimezoneWeather {
  timezone = '';
  report?: WeatherReport;
  private pending = new Map<string, Promise<unknown>>();
  private active = false;
  private timer?: ReturnType<typeof setTimeout>;
  private changed = () => {};
  constructor(private reader?: WeatherReader) {}
  start(changed: () => void) {
    this.stop();
    this.active = true;
    this.changed = changed;
    this.refresh();
  }
  stop() {
    this.active = false;
    clearTimeout(this.timer);
    this.changed = () => {};
  }
  private schedule() {
    clearTimeout(this.timer);
    if (!this.active || document.hidden || !this.report) return;
    const now = Date.now();
    const delay = Math.max(
      1,
      Math.min(WEATHER_HOUR, this.report.nextCheckAt - now),
    );
    this.timer = setTimeout(() => this.refresh(), delay);
  }
  refresh() {
    clearTimeout(this.timer);
    if (!this.active || document.hidden) return;
    let timezone = '';
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      /* Unknown timezone uses simulated weather. */
    }
    if (timezone !== this.timezone) {
      this.timezone = timezone;
      this.report = undefined;
      this.changed();
    }
    const now = Date.now();
    if (
      this.report &&
      this.report.nextCheckAt > now &&
      this.report.nextCheckAt <= now + WEATHER_HOUR
    ) {
      this.schedule();
      return;
    }
    if (this.pending.has(timezone)) return;
    if (!this.reader || !timezoneLocation(timezone)) {
      this.report = {
        timezone,
        weather: null,
        updatedAt: null,
        status: 'unsupported',
        nextCheckAt: now + WEATHER_HOUR,
      };
      this.changed();
      this.schedule();
      return;
    }
    // Preserve an in-flight request across scene remounts. An old region's
    // response never replaces the current one, including after a timezone switch.
    const promise = Promise.resolve().then(() => this.reader!(timezone));
    this.pending.set(timezone, promise);
    void promise
      .then((value) => {
        if (!validReport(value, timezone))
          throw new Error('Invalid weather result');
        return value;
      })
      .catch((): WeatherReport => ({
        timezone,
        weather:
          this.timezone === timezone ? (this.report?.weather ?? null) : null,
        updatedAt:
          this.timezone === timezone ? (this.report?.updatedAt ?? null) : null,
        status:
          this.timezone === timezone && this.report?.weather != null
            ? 'stale'
            : 'unavailable',
        nextCheckAt: Date.now() + WEATHER_HOUR,
      }))
      .then((report) => {
        this.pending.delete(timezone);
        if (this.timezone !== timezone) return;
        this.report = report;
        this.changed();
        this.schedule();
      });
  }
}

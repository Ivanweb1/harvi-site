/**
 * Аналитика (ТЗ §46). Провайдер подключается позже — здесь только контракт
 * и буфер событий, накопленных до его подключения.
 */

export type HarviEvent =
  | "hero_view"
  | "url_entered"
  | "scan_started"
  | "scan_completed"
  | "interview_started"
  | "interview_message"
  | "night_shift_clicked"
  | "personalization_selected"
  | "pricing_viewed"
  | "trial_clicked"
  | "hire_clicked";

type Payload = Record<string, string | number | boolean | undefined>;
type Provider = (event: HarviEvent, payload?: Payload) => void;

const buffer: Array<[HarviEvent, Payload | undefined]> = [];
let provider: Provider | null = null;

export function setAnalyticsProvider(next: Provider) {
  provider = next;
  while (buffer.length) {
    const queued = buffer.shift();
    if (queued) provider(queued[0], queued[1]);
  }
}

export function track(event: HarviEvent, payload?: Payload) {
  if (provider) {
    provider(event, payload);
    return;
  }
  buffer.push([event, payload]);
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload ?? {});
  }
}

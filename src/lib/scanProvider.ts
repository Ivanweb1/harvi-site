/**
 * Сканирование сайта (ТЗ §44, §45).
 *
 * UI знает только про `requestScan`. Сейчас за ним стоит demo-провайдер с
 * фиктивной задержкой; позже `setScanProvider(harviApiProvider)` подменяет его
 * на реальную цепочку URL → crawler → knowledge → HARVI без переделки секций.
 */

export type ScanRequest = { url: string };

export type ScanResult = {
  mode: "demo" | "api";
  url: string;
  /** Сюда придут страницы, услуги, цены и пробелы знаний из §16. */
  findings?: Array<{ status: "ok" | "missing"; text: string }>;
};

export type ScanProvider = {
  readonly mode: ScanResult["mode"];
  start: (request: ScanRequest) => Promise<ScanResult>;
};

export const demoScanProvider: ScanProvider = {
  mode: "demo",
  start: ({ url }) =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ mode: "demo", url }), 2400);
    }),
};

let provider: ScanProvider = demoScanProvider;

export function setScanProvider(next: ScanProvider) {
  provider = next;
}

export function requestScan(url: string): Promise<ScanResult> {
  return provider.start({ url });
}

/** `сайт.рф` → `https://сайт.рф`; вернёт null, если это не похоже на адрес. */
export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname;
    if (!host.includes(".") || host.startsWith(".") || host.endsWith(".")) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

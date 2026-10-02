/** Базовый адрес сайта. Домен подставляется через env при деплое. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

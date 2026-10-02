/**
 * Префикс статики. На GitHub Pages сайт живёт в подпапке репозитория, поэтому
 * «сырые» пути (`<img src>`, preload) нужно писать через `asset()` —
 * next/image и бандл Next префиксует сам через `basePath`.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}

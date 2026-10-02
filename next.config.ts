import path from "node:path";

import type { NextConfig } from "next";

/* GitHub Pages раздаёт сайт из подпапки репозитория — префикс берём из env,
   чтобы локальный dev остался на корне. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  /* проект лежит внутри другого репозитория — фиксируем свой корень */
  turbopack: { root: path.resolve(process.cwd()) },

  /* статический экспорт: Pages отдаёт только файлы */
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;

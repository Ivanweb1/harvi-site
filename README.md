# HARVI — лендинг AI-сотрудника для сайта

Next.js 16 (App Router, Turbopack) + Tailwind 4 + `motion`.
HARVI собран как слои растровых состояний: неподвижное тело и четыре состояния
головы в общей системе координат — взгляд и наклон идут поверх тела, силуэт не «дышит».

## Разработка

```bash
npm install
npm run dev     # http://localhost:4420
```

## Сборка под GitHub Pages

```bash
npm run build:pages
```

`next build` в режиме `output: "export"` → `out/`, затем копия в `docs/`,
откуда Pages раздаёт сайт: https://ivanweb1.github.io/harvi-site/

Pages живёт в подпапке репозитория, поэтому базовый путь подставляется через
`NEXT_PUBLIC_BASE_PATH` (его ставит `scripts/build-pages.mjs`). «Сырые» пути к
картинкам пишутся через `asset()` из `src/lib/basePath.ts` — next/image и бандл
Next префиксует сам.

## Структура

- `src/components/harvi/` — фигура, состояния внимания, статус-чип
- `src/components/sections/` — секции страницы
- `src/data/content.ts` — тексты, `harvi-layers.json` — геометрия слоёв
- `src/lib/scanProvider.ts` — сканирование сайта: сейчас demo-провайдер, позже подменяется на API
- `scripts/prepare_assets.py` — подготовка растровых слоёв (`npm run assets`)

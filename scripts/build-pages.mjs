/**
 * Сборка статики под GitHub Pages: next build (output: export) → docs/.
 * Pages раздаёт сайт из подпапки репозитория, поэтому базовый путь и
 * абсолютный адрес сайта подставляются здесь, а не в next.config.ts.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const repo = process.env.PAGES_REPO ?? "harvi-site";
const user = process.env.PAGES_USER ?? "ivanweb1";

const basePath = `/${repo}`;
const siteUrl = `https://${user}.github.io${basePath}`;

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "out");
const docs = path.join(root, "docs");

/* next вызываем напрямую: npm.cmd под Windows не спавнится без shell */
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

execFileSync(process.execPath, [nextBin, "build"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
});

if (!existsSync(out)) throw new Error("next build не создал out/");

rmSync(docs, { recursive: true, force: true });
cpSync(out, docs, { recursive: true });
/* Pages без этого файла прячет папки на подчёркивание — в том числе _next */
writeFileSync(path.join(docs, ".nojekyll"), "");

console.log(`\n✓ docs/ готов — ${siteUrl}/`);

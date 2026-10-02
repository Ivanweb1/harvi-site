import { Hero } from "@/components/sections/Hero";
import { SiteHeader } from "@/components/ui/SiteHeader";

/**
 * Драматургия лендинга (ТЗ §54) собирается здесь по одной секции.
 * Сейчас смонтирована SECTION 01 — Hero / Website Awakening.
 *
 * Следующая — SECTION 02 (Live Scan, id="scan"): Hero уже передаёт ей
 * управление после submit через `requestScan` и скролл на #scan.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>
    </>
  );
}

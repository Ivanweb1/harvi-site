import { Change } from "@/components/sections/Change";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Product } from "@/components/sections/Product";
import { Reading } from "@/components/sections/Reading";
import { Workday } from "@/components/sections/Workday";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";

/**
 * Драматургия лендинга (ТЗ §54): сайт молчит → HARVI читает его →
 * выходит на смену → что от этого меняется → найм.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Reading />
        <Product />
        <Workday />
        <Change />
        <Pricing />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

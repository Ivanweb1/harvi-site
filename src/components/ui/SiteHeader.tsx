"use client";

import { useEffect, useState } from "react";

import { useHarvi } from "@/components/harvi/attention";
import { StatusChip } from "@/components/harvi/StatusChip";
import { brand, header, nav } from "@/data/content";
import { track } from "@/lib/analytics";

/** Sticky-хедер, который на скролле становится компактнее (ТЗ §11). */
export function SiteHeader() {
  const { phase } = useHarvi();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-compact={compact}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-paper/80 backdrop-blur-md transition-[border-color,background-color] duration-300 data-[compact=true]:border-rule"
    >
      <div
        className={[
          "mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 transition-all duration-300 sm:px-10",
          compact ? "h-14" : "h-[72px]",
        ].join(" ")}
      >
        <a
          href="#hero"
          className="text-[17px] font-medium tracking-[-0.02em] text-ink"
        >
          {brand.name}
        </a>

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[13px] text-muted underline-offset-[6px] transition-colors duration-200 hover:text-ink hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <StatusChip
            variant={phase === "offline" ? "offline" : "live"}
            size="sm"
            className="hidden sm:inline-flex"
          />
          <a
            href="#pricing"
            onClick={() => track("hire_clicked", { place: "header" })}
            className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors duration-200 hover:bg-graphite sm:px-5"
          >
            {header.cta}
          </a>
        </div>
      </div>
    </header>
  );
}

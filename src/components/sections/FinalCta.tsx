import { StatusChip } from "@/components/harvi/StatusChip";
import { finalCta } from "@/data/content";

/** Финальный блок: последняя возможность отдать HARVI адрес сайта. */
export function FinalCta() {
  return (
    <section className="section border-t border-rule">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <div className="flex flex-col items-center rounded-[24px] border border-ink bg-ink px-6 py-16 text-center text-paper sm:px-12 sm:py-20">
          <StatusChip variant="onShift" size="sm" />

          <h2 className="mt-8 max-w-[18ch] text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.035em]">
            {finalCta.title}{" "}
            <span className="text-paper/45">{finalCta.titleMuted}</span>
          </h2>

          <p className="mt-6 max-w-[48ch] text-[15.5px] leading-[1.55] text-paper/65">
            {finalCta.text}
          </p>

          <a
            href="#hero"
            className="group mt-10 inline-flex h-13 items-center gap-2.5 rounded-full bg-paper px-7 text-[15px] font-medium text-ink transition-colors duration-200 hover:bg-paper/85"
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-live opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
            {finalCta.cta}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

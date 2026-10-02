import { SectionHeading } from "@/components/ui/SectionHeading";
import { workday } from "@/data/content";

/** SECTION 04 — первый рабочий день (#first-workday). */
export function Workday() {
  return (
    <section id="first-workday" className="section border-t border-rule">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <SectionHeading
          eyebrow={workday.eyebrow}
          title={workday.title}
          titleMuted={workday.titleMuted}
        />

        <ol className="grid gap-px overflow-hidden rounded-[20px] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {workday.steps.map((step) => (
            <li key={step.n} className="flex flex-col bg-paper p-7 sm:p-8">
              <span className="mono-label text-ink">{step.n}</span>
              <h3 className="mt-10 text-[1.1875rem] font-medium tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.5] text-graphite">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <p className="mono-label mt-6 text-center">{workday.note}</p>
      </div>
    </section>
  );
}

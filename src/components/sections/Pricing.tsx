import { SectionHeading, Tick } from "@/components/ui/SectionHeading";
import { pricing } from "@/data/content";

/** SECTION 06 — найм (#pricing). */
export function Pricing() {
  return (
    <section id="pricing" className="section border-t border-rule">
      <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-10">
        <SectionHeading
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          titleMuted={pricing.titleMuted}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {pricing.plans.map((plan) => (
            <article
              key={plan.name}
              className={[
                "flex flex-col rounded-[20px] border p-7 sm:p-9",
                plan.accent
                  ? "border-ink bg-ink text-paper"
                  : "border-rule bg-paper text-ink",
              ].join(" ")}
            >
              <div className="flex items-center gap-2.5">
                {plan.accent ? (
                  <span aria-hidden className="size-2 rounded-full bg-live" />
                ) : null}
                <span
                  className={["mono-label", plan.accent ? "!text-paper/60" : ""].join(" ")}
                >
                  {plan.name}
                </span>
              </div>

              <p className="mt-7 flex items-baseline gap-2.5">
                <span className="text-[clamp(2.25rem,4vw,3rem)] leading-none font-medium tracking-[-0.04em]">
                  {plan.price}
                </span>
                <span
                  className={[
                    "text-[14px]",
                    plan.accent ? "text-paper/55" : "text-muted",
                  ].join(" ")}
                >
                  {plan.period}
                </span>
              </p>

              <p
                className={[
                  "mt-5 max-w-[42ch] text-[15px] leading-[1.5]",
                  plan.accent ? "text-paper/70" : "text-graphite",
                ].join(" ")}
              >
                {plan.text}
              </p>

              <a
                href="#hero"
                className={[
                  "mt-8 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-medium transition-colors duration-200",
                  plan.accent
                    ? "bg-paper text-ink hover:bg-paper/85"
                    : "border border-ink text-ink hover:bg-ink hover:text-paper",
                ].join(" ")}
              >
                {plan.cta}
              </a>

              <ul
                className={[
                  "mt-9 flex flex-col gap-3.5 border-t pt-8",
                  plan.accent ? "border-paper/15" : "border-rule",
                ].join(" ")}
              >
                {plan.items.map((item) => (
                  <li
                    key={item}
                    className={[
                      "flex items-start gap-3 text-[14.5px] leading-[1.45]",
                      plan.accent ? "text-paper/80" : "text-graphite",
                    ].join(" ")}
                  >
                    <Tick live={plan.accent} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mono-label mt-7 text-center">{pricing.note}</p>
      </div>
    </section>
  );
}

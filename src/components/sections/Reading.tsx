import { SectionHeading, Tick } from "@/components/ui/SectionHeading";
import { reading } from "@/data/content";

/**
 * SECTION 02 — First Reading (#scan).
 *
 * Сюда Hero передаёт управление после submit: HARVI прочитал сайт и
 * показывает, что он из него взял и чего ему не хватает.
 */
export function Reading() {
  return (
    <section id="scan" className="section border-t border-rule">
      <div className="mx-auto grid w-full max-w-[1280px] gap-x-16 gap-y-12 px-6 sm:px-10 lg:grid-cols-2 lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            align="left"
            eyebrow={reading.eyebrow.left}
            title={reading.title}
            titleMuted={reading.titleMuted}
            className="!mb-7"
          />

          <p className="max-w-[46ch] text-[clamp(1rem,1.15vw,1.0625rem)] leading-[1.6] text-graphite">
            {reading.description}
          </p>

          <a
            href={reading.cta.href}
            className="mt-9 inline-flex h-12 items-center rounded-full border border-ink px-6 text-[14px] font-medium text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
          >
            {reading.cta.label}
          </a>
        </div>

        <div className="flex flex-col gap-5">
          {reading.cards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-[20px] border border-rule bg-panel/60 p-7 sm:p-9"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="text-[1.375rem] font-medium tracking-[-0.02em]">
                  {card.title}
                </h3>
                <span className="mono-label">{card.note}</span>
              </div>

              <ul className="mt-6 flex flex-col gap-3.5 border-t border-rule pt-6">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-[1.45] text-graphite"
                  >
                    <Tick live={index === 0} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

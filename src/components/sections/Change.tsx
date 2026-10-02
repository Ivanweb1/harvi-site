import { SectionHeading, Tick } from "@/components/ui/SectionHeading";
import { change } from "@/data/content";

/**
 * SECTION 05 — что меняется на сайте (#cases).
 *
 * Пока у продукта нет отгруженных кейсов, слот занимает честное «до / после»:
 * тот же вес в драматургии, но без выдуманных клиентов и цифр.
 */
export function Change() {
  const columns = [
    { ...change.before, live: false },
    { ...change.after, live: true },
  ];

  return (
    <section id="cases" className="section border-t border-rule bg-panel/70">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <SectionHeading
          eyebrow={change.eyebrow}
          title={change.title}
          titleMuted={change.titleMuted}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {columns.map((column) => (
            <article
              key={column.label}
              className={[
                "rounded-[20px] border p-7 sm:p-9",
                column.live
                  ? "border-ink bg-paper"
                  : "border-rule bg-paper/50",
              ].join(" ")}
            >
              <span className="mono-label">{column.label}</span>

              <h3
                className={[
                  "mt-5 text-[1.5rem] leading-[1.2] font-medium tracking-[-0.025em]",
                  column.live ? "text-ink" : "text-muted",
                ].join(" ")}
              >
                {column.title}
              </h3>

              <ul className="mt-7 flex flex-col gap-4 border-t border-rule pt-7">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className={[
                      "flex items-start gap-3 text-[15px] leading-[1.45]",
                      column.live ? "text-graphite" : "text-muted",
                    ].join(" ")}
                  >
                    <Tick live={column.live} />
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

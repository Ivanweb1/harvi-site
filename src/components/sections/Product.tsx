import { SectionHeading } from "@/components/ui/SectionHeading";
import { product } from "@/data/content";

/** SECTION 03 — что HARVI делает на смене (#product). */
export function Product() {
  return (
    <section id="product" className="section border-t border-rule bg-panel/70">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <SectionHeading
          eyebrow={product.eyebrow}
          title={product.title}
          titleMuted={product.titleMuted}
        />

        <div className="grid gap-5 md:grid-cols-3">
          {product.cards.map((card, index) => {
            const dark = index === 0;

            return (
              <article
                key={card.title}
                className={[
                  "flex min-h-[19rem] flex-col justify-between rounded-[20px] border p-7 sm:p-8",
                  dark
                    ? "border-ink bg-ink text-paper"
                    : "border-rule bg-paper text-ink",
                ].join(" ")}
              >
                <span
                  className={[
                    "mono-label",
                    dark ? "!text-paper/55" : "",
                  ].join(" ")}
                >
                  {card.caption}
                </span>

                <div className="mt-14">
                  <h3 className="text-[1.5rem] font-medium tracking-[-0.025em]">
                    {card.title}
                  </h3>
                  <p
                    className={[
                      "mt-3 text-[15px] leading-[1.5]",
                      dark ? "text-paper/70" : "text-graphite",
                    ].join(" ")}
                  >
                    {card.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

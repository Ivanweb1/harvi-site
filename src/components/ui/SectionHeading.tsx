/**
 * Шапка секции: технический маркер, затем двухтоновый заголовок —
 * утверждение тёмным, продолжение серым (ТЗ §9).
 */
export function SectionHeading({
  eyebrow,
  title,
  titleMuted,
  align = "center",
  className = "",
}: {
  eyebrow: string;
  title: string;
  titleMuted?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={[
        "section-head flex flex-col",
        centered ? "items-center text-center" : "items-start",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <span aria-hidden className="h-px w-8 bg-rule" />
        <span className="mono-label">{eyebrow}</span>
        <span aria-hidden className="h-px w-8 bg-rule" />
      </div>

      <h2
        className={[
          "mt-6 text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[1.06] font-medium tracking-[-0.035em]",
          centered ? "max-w-[22ch]" : "max-w-[24ch]",
        ].join(" ")}
      >
        {title}
        {titleMuted ? (
          <>
            {" "}
            <span className="text-muted">{titleMuted}</span>
          </>
        ) : null}
      </h2>
    </div>
  );
}

/** Галочка отмечает то, что уже работает — зелёный здесь значит «живое» (ТЗ §8). */
export function Tick({ live = false }: { live?: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        "mt-[0.4em] inline-block size-1.5 shrink-0 rounded-full",
        live ? "bg-live" : "bg-muted",
      ].join(" ")}
    />
  );
}

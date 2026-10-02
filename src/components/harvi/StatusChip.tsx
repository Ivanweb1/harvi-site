import { status } from "@/data/content";

type Variant = keyof typeof status;

/**
 * `● LIVE` — distinctive asset бренда (ТЗ §6.1).
 * Зелёный здесь всегда означает жизнь/смену, а не украшение (ТЗ §8).
 */
export function StatusChip({
  variant,
  size = "md",
  className = "",
}: {
  variant: Variant;
  size?: "sm" | "md";
  className?: string;
}) {
  const { label } = status[variant];
  const alive = variant !== "offline";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border border-rule bg-paper/70 font-mono uppercase tracking-[0.14em] text-ink backdrop-blur-[2px] transition-colors duration-500",
        size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-[11px]",
        className,
      ].join(" ")}
      data-variant={variant}
    >
      <span
        aria-hidden
        className={[
          "relative inline-block rounded-full transition-colors duration-700",
          size === "sm" ? "size-[6px]" : "size-2",
          alive ? "bg-live" : "border border-muted bg-transparent",
        ].join(" ")}
      >
        {alive ? (
          <span className="harvi-pulse absolute inset-0 rounded-full bg-live" />
        ) : null}
      </span>
      {label}
    </span>
  );
}

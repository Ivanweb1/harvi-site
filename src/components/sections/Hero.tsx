"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  ATTENTION_PRIORITY,
  useAttentionTarget,
  useHarvi,
} from "@/components/harvi/attention";
import { HarviFigure } from "@/components/harvi/HarviFigure";
import { StatusChip } from "@/components/harvi/StatusChip";
import { brand, hero } from "@/data/content";
import { track } from "@/lib/analytics";
import { normalizeUrl, requestScan } from "@/lib/scanProvider";

type FormState = "idle" | "reading" | "done";

/**
 * SECTION 01 — Hero / Website Awakening (ТЗ §12–§15).
 *
 * Композиция: огромный тезис слева, HARVI как объект справа, между ними —
 * только то, что реально работает: статус смены и бейдж сотрудника.
 */
export function Hero() {
  const { stageRef, phase, setPhase, say, line, setTargetActive, reducedMotion } =
    useHarvi();

  const inputRef = useRef<HTMLInputElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const [value, setValue] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [clock, setClock] = useState<string | null>(null);

  /* объекты внимания HARVI в порядке приоритета (ТЗ §14) */
  const urlHandlers = useAttentionTarget("hero-url", inputRef, {
    priority: ATTENTION_PRIORITY.urlInput,
    gaze: "url",
  });
  const ctaHandlers = useAttentionTarget("hero-cta", ctaRef, {
    priority: ATTENTION_PRIORITY.cta,
    gaze: "url",
  });

  useEffect(() => {
    track("hero_view");
  }, []);

  /* idle: изредка бросает взгляд на CTA и возвращается в neutral (ТЗ §15) */
  useEffect(() => {
    if (reducedMotion) return;
    let back: ReturnType<typeof setTimeout>;
    const timer = setInterval(
      () => {
        if (document.hidden) return;
        setTargetActive("hero-cta", true);
        back = setTimeout(() => setTargetActive("hero-cta", false), 1400);
      },
      11000 + Math.random() * 5000,
    );
    return () => {
      clearInterval(timer);
      clearTimeout(back);
    };
  }, [reducedMotion, setTargetActive]);

  /* часы появляются только после монтирования — иначе рассинхрон с сервером */
  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "reading") return;

    const url = normalizeUrl(value);
    if (!url) {
      setError(hero.input.invalid);
      say(hero.input.invalid, 5000);
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setState("reading");
    setPhase("thinking");
    say(hero.lines.submitted, 3000);
    track("url_entered", { host: new URL(url).hostname });
    track("scan_started", { host: new URL(url).hostname });

    const result = await requestScan(url);

    setState("done");
    setPhase("live");
    say(hero.lines.scanned, 6000);
    track("scan_completed", { mode: result.mode });
    document.querySelector("#scan")?.scrollIntoView({ block: "start" });
  }

  const shift = clock ? (isNightShift() ? "NIGHT" : "DAY") : null;

  return (
    <section
      id="hero"
      ref={stageRef as React.RefObject<HTMLElement>}
      className="relative flex min-h-[100svh] flex-col pt-[72px]"
    >
      <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-end gap-x-8 px-6 sm:px-10 lg:grid-cols-12">
        {/* ——— типографика и найм ——— */}
        <div className="flex flex-col justify-center self-center py-12 lg:col-span-7 lg:py-10">
          <div
            className="rise flex items-center gap-4"
            style={{ animationDelay: "80ms" }}
          >
            <span className="mono-label">{hero.eyebrow.left}</span>
            <span aria-hidden className="h-px w-10 bg-rule" />
            <span className="mono-label">{hero.eyebrow.right}</span>
          </div>

          <h1
            className="rise mt-7 text-[clamp(2.7rem,5.6vw,5.5rem)] leading-[0.92] font-medium tracking-[-0.04em]"
            style={{ animationDelay: "160ms" }}
          >
            {hero.titleLines.map((text) => (
              <span key={text} className="block">
                {text}
              </span>
            ))}
            <span className="mt-[0.34em] block text-[0.55em] leading-[1.05] font-normal tracking-[-0.03em] text-muted">
              {hero.subtitle}
            </span>
          </h1>

          <p
            className="rise mt-8 max-w-[48ch] text-[clamp(1rem,1.15vw,1.125rem)] leading-[1.55] text-graphite"
            style={{ animationDelay: "260ms" }}
          >
            {hero.description}
          </p>

          <form
            onSubmit={onSubmit}
            className="rise mt-9 max-w-[580px]"
            style={{ animationDelay: "340ms" }}
            noValidate
          >
            <label htmlFor="hero-url" className="sr-only">
              {hero.input.label}
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                {...urlHandlers}
                id="hero-url"
                ref={inputRef}
                type="url"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder={hero.input.placeholder}
                value={value}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "hero-url-error" : undefined}
                onChange={(event) => {
                  setValue(event.target.value);
                  if (error) setError(null);
                }}
                className="h-13 flex-1 rounded-full border border-rule bg-transparent px-5 text-[15px] text-ink transition-colors duration-200 placeholder:text-label hover:border-muted focus:border-ink focus:outline-none aria-[invalid=true]:border-ink"
              />

              <button
                {...ctaHandlers}
                ref={ctaRef}
                type="submit"
                disabled={state === "reading"}
                className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-medium whitespace-nowrap text-paper transition-colors duration-200 hover:bg-graphite disabled:cursor-progress disabled:opacity-70"
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-live opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
                {hero.cta}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </button>
            </div>

            <div className="mt-4 min-h-6">
              {error ? (
                <p id="hero-url-error" role="alert" className="text-[13px] text-ink">
                  {error}
                </p>
              ) : state === "reading" ? (
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="reading-bar relative h-px w-28 overflow-hidden bg-rule"
                  />
                  <span className="mono-label text-ink">{hero.lines.reading}</span>
                </div>
              ) : (
                <p className="text-[13px] text-graphite">{hero.note}</p>
              )}
            </div>

            <p role="status" aria-live="polite" className="sr-only">
              {state === "reading" ? "HARVI изучает сайт" : ""}
            </p>
          </form>

          {/* реплика HARVI на мобильных — рядом с тем, на что он реагирует */}
          <HarviLine line={line} className="mt-6 lg:hidden" />
        </div>

        {/* ——— HARVI как объект ——— */}
        <div className="relative self-end lg:col-span-5 lg:h-full lg:border-l lg:border-rule">
          <div className="relative flex h-full w-full items-end justify-center lg:justify-end">
            <div className="relative w-[min(80vw,360px)] lg:w-auto">
              <HarviFigure className="w-full lg:h-[min(76vh,820px)] lg:w-auto" />

              <StatusChip
                variant={phase === "offline" ? "offline" : "onShift"}
                className="absolute top-[8%] left-[64%]"
              />

              <HarviLine
                line={line}
                className="absolute top-[19%] right-[66%] hidden w-[15rem] text-right lg:block"
              />
            </div>
          </div>

          {/* бейдж сотрудника — рабочий UI-объект, а не декор (ТЗ §6.1) */}
          <p className="mono-label absolute bottom-8 left-8 hidden leading-[1.9] lg:block">
            {brand.role}
            <br />
            {brand.employeeId}
          </p>
        </div>
      </div>

      {/* ——— пол, на котором стоит HARVI ——— */}
      <div className="border-t border-rule">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-4 sm:px-10">
          <span className="mono-label">{brand.tagline}</span>
          <span className="mono-label flex items-center gap-4 tabular-nums">
            {shift ? <span>SHIFT / {shift}</span> : null}
            {clock ? <span className="text-ink">{clock}</span> : null}
          </span>
        </div>
      </div>
    </section>
  );
}

function HarviLine({
  line,
  className = "",
}: {
  line: string | null;
  className?: string;
}) {
  return (
    <p
      aria-hidden
      className={[
        "text-[14px] leading-[1.45] text-graphite transition-all duration-500",
        line ? "opacity-100" : "translate-y-1 opacity-0",
        className,
      ].join(" ")}
    >
      {line}
    </p>
  );
}

function isNightShift() {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 9;
}

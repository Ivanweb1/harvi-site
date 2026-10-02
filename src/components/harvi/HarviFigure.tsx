"use client";

import layers from "@/data/harvi-layers.json";
import { asset } from "@/lib/basePath";

import { useHarvi, type HarviGaze } from "./attention";

/**
 * HARVI как слои растровых состояний (ТЗ §41: raster → отдельные layers/states).
 *
 * Тело — один неподвижный рендер, голова — четыре состояния в общей системе
 * координат, склеенные с телом мягким швом на шее. Смена состояния и наклон
 * головы идут поверх неподвижного тела, поэтому силуэт не «дышит».
 */

const HEAD = {
  left: `${(layers.head.left / layers.canvas.width) * 100}%`,
  top: `${(layers.head.top / layers.canvas.height) * 100}%`,
  width: `${(layers.head.width / layers.canvas.width) * 100}%`,
};

const STATES: HarviGaze[] = ["sleeping", "live", "url", "focused"];

const ALT =
  "HARVI — сотрудник сайта: светлая голова, тёмный костюм, бейдж на ленте";

function Layer({
  name,
  alt,
  priority,
  className,
  style,
  width,
  height,
}: {
  name: string;
  alt: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height: number;
}) {
  return (
    <picture>
      <source srcSet={asset(`/harvi/${name}.avif`)} type="image/avif" />
      <source srcSet={asset(`/harvi/${name}.webp`)} type="image/webp" />
      <img
        src={asset(`/harvi/${name}.png`)}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
        style={style}
      />
    </picture>
  );
}

export function HarviFigure({ className = "" }: { className?: string }) {
  const { figureRef, headRef, gaze, blinking, phase } = useHarvi();
  const visible: HarviGaze = blinking && phase !== "offline" ? "sleeping" : gaze;

  return (
    <div
      ref={figureRef as React.RefObject<HTMLDivElement>}
      className={`harvi-figure relative ${className}`}
      style={{ aspectRatio: `${layers.canvas.width} / ${layers.canvas.height}` }}
      data-phase={phase}
    >
      {/* якорь головы: не трансформируется, по нему считается направление взгляда */}
      <div
        ref={headRef as React.RefObject<HTMLDivElement>}
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: HEAD.left,
          top: HEAD.top,
          width: HEAD.width,
          aspectRatio: `${layers.head.width} / ${layers.head.height}`,
        }}
      />

      <div className="harvi-parallax absolute inset-0">
        <div className="harvi-body absolute inset-0">
          <Layer
            name="figure-base"
            alt={ALT}
            priority
            width={layers.canvas.width}
            height={layers.canvas.height}
            className="absolute inset-0 size-full object-contain"
          />

          <div
            className="harvi-head pointer-events-none absolute"
            style={{
              left: HEAD.left,
              top: HEAD.top,
              width: HEAD.width,
              aspectRatio: `${layers.head.width} / ${layers.head.height}`,
            }}
          >
            {STATES.map((state) => (
              <div
                key={state}
                aria-hidden
                className="harvi-head-state absolute inset-x-0 top-0"
                style={{
                  opacity: visible === state ? 1 : 0,
                  transitionDuration: blinking ? "80ms" : "280ms",
                }}
              >
                <Layer
                  name={`head-${state}`}
                  alt=""
                  priority={state === "sleeping" || state === "live"}
                  width={layers.head.width}
                  height={layers.head.height}
                  className="block h-auto w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

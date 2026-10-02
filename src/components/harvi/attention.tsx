"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Движок внимания HARVI (ТЗ §14, §15, §35).
 *
 * Секции не двигают персонажа напрямую — они объявляют объекты внимания
 * (`useAttentionTarget`) с приоритетом. HARVI сам решает, на что смотреть:
 * URL input → CTA → сообщения → insight → product UI → курсор.
 *
 * Трансформации пишутся в CSS-переменные внутри rAF, без ре-рендера React.
 */

export type HarviGaze = "sleeping" | "live" | "url" | "focused";
export type HarviPhase = "offline" | "live" | "thinking";

export const ATTENTION_PRIORITY = {
  urlInput: 100,
  cta: 90,
  message: 80,
  insight: 70,
  productUi: 60,
  resting: 10,
} as const;

type Target = {
  priority: number;
  gaze: HarviGaze;
  element: HTMLElement | null;
  rect: DOMRect | null;
};

type HarviApi = {
  phase: HarviPhase;
  gaze: HarviGaze;
  blinking: boolean;
  line: string | null;
  reducedMotion: boolean;
  setPhase: (phase: HarviPhase) => void;
  say: (line: string | null, holdMs?: number) => void;
  registerTarget: (id: string, target: Omit<Target, "rect">) => () => void;
  setTargetActive: (id: string, active: boolean) => void;
  stageRef: RefObject<HTMLElement | null>;
  figureRef: RefObject<HTMLElement | null>;
  headRef: RefObject<HTMLElement | null>;
};

const HarviContext = createContext<HarviApi | null>(null);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function HarviProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  const [rawPhase, setPhase] = useState<HarviPhase>("offline");
  const [rawGaze, setGaze] = useState<HarviGaze>("sleeping");

  /* при выключенном движении HARVI сразу на смене и статичен (ТЗ §39) */
  const phase: HarviPhase =
    reducedMotion && rawPhase === "offline" ? "live" : rawPhase;
  const gaze: HarviGaze = reducedMotion
    ? phase === "thinking"
      ? "focused"
      : "live"
    : rawGaze;
  const [blinking, setBlinking] = useState(false);
  const [line, setLine] = useState<string | null>(null);

  const targets = useRef(new Map<string, Target>());
  const active = useRef(new Set<string>());
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const look = useRef({ x: 0, y: 0 });
  const settled = useRef(false);
  const phaseRef = useRef(phase);
  const lineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stageRef = useRef<HTMLElement | null>(null);
  const figureRef = useRef<HTMLElement | null>(null);
  const headRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  /* ——— публичные методы ——— */

  const registerTarget = useCallback(
    (id: string, target: Omit<Target, "rect">) => {
      targets.current.set(id, { ...target, rect: null });
      return () => {
        targets.current.delete(id);
        active.current.delete(id);
      };
    },
    [],
  );

  const setTargetActive = useCallback((id: string, isActive: boolean) => {
    if (isActive) active.current.add(id);
    else active.current.delete(id);
  }, []);

  const say = useCallback((next: string | null, holdMs = 4200) => {
    if (lineTimer.current) clearTimeout(lineTimer.current);
    setLine(next);
    if (next && holdMs > 0) {
      lineTimer.current = setTimeout(() => setLine(null), holdMs);
    }
  }, []);

  /* ——— курсор: только точный указатель (ТЗ §37) ——— */

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
    };
    const onLeave = () => {
      pointer.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ——— цикл внимания ——— */

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;
    let dirty = true;
    const markDirty = () => {
      dirty = true;
    };
    window.addEventListener("resize", markDirty);
    window.addEventListener("scroll", markDirty, { passive: true });

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const figure = figureRef.current;
      const head = headRef.current;
      if (!figure || !head) return;

      if (dirty) {
        targets.current.forEach((target) => {
          target.rect = target.element?.getBoundingClientRect() ?? null;
        });
        dirty = false;
      }

      const headRect = head.getBoundingClientRect();
      const headX = headRect.left + headRect.width / 2;
      const headY = headRect.top + headRect.height * 0.55;

      /* на что смотрим: самый приоритетный активный объект.
         `resting` и ниже на взгляд не претендуют — это фон внимания. */
      let chosen: Target | undefined;
      for (const id of active.current) {
        const target = targets.current.get(id);
        if (!target || target.priority <= ATTENTION_PRIORITY.resting) continue;
        if (!chosen || target.priority > chosen.priority) chosen = target;
      }

      let aim: { x: number; y: number } | null = null;
      let sprite: HarviGaze = "live";

      if (chosen?.rect) {
        aim = {
          x: chosen.rect.left + chosen.rect.width / 2,
          y: chosen.rect.top + chosen.rect.height / 2,
        };
        sprite = chosen.gaze;
      }

      const stage = stageRef.current?.getBoundingClientRect();
      const cursor = pointer.current;
      const cursorInStage =
        cursor !== null &&
        stage !== undefined &&
        cursor.x >= stage.left &&
        cursor.x <= stage.right &&
        cursor.y >= stage.top &&
        cursor.y <= stage.bottom;

      /* курсор — самый низкий приоритет: он лишь смещает взгляд (ТЗ §14) */
      if (cursorInStage && cursor) {
        const weight =
          chosen && chosen.priority > ATTENTION_PRIORITY.resting ? 0.18 : 0.62;
        aim = aim
          ? {
              x: aim.x + (cursor.x - aim.x) * weight,
              y: aim.y + (cursor.y - aim.y) * weight,
            }
          : cursor;
      }

      if (!aim) aim = { x: headX - 180, y: headY + 90 };

      if (!settled.current) {
        look.current = { x: aim.x, y: aim.y };
        settled.current = true;
      } else {
        look.current.x += (aim.x - look.current.x) * 0.075;
        look.current.y += (aim.y - look.current.y) * 0.075;
      }

      const dx = look.current.x - headX;
      const dy = look.current.y - headY;

      /* движение намеренно маленькое: наклон головы, а не погоня за мышкой */
      figure.style.setProperty(
        "--harvi-head-rotate",
        `${clamp(dx / 520, -1.7, 1.7).toFixed(3)}deg`,
      );
      figure.style.setProperty(
        "--harvi-head-x",
        `${clamp(dx / 200, -5, 5).toFixed(2)}px`,
      );
      figure.style.setProperty(
        "--harvi-head-y",
        `${clamp(dy / 260, -2.5, 3.5).toFixed(2)}px`,
      );
      figure.style.setProperty(
        "--harvi-figure-x",
        `${clamp(dx / 700, -5, 5).toFixed(2)}px`,
      );

      const nextSprite: HarviGaze =
        phaseRef.current === "offline"
          ? "sleeping"
          : phaseRef.current === "thinking"
            ? "focused"
            : sprite;
      setGaze((prev) => (prev === nextSprite ? prev : nextSprite));
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", markDirty);
      window.removeEventListener("scroll", markDirty);
    };
  }, [reducedMotion]);

  /* ——— пробуждение сайта (ТЗ §13) ——— */

  useEffect(() => {
    if (reducedMotion) return;
    const wake = setTimeout(() => {
      setPhase("live");
      setGaze("live");
    }, 1150);
    return () => clearTimeout(wake);
  }, [reducedMotion]);

  /* ——— моргание раз в 4–8 секунд с рандомизацией (ТЗ §15) ——— */

  useEffect(() => {
    if (reducedMotion || phase === "offline") return;
    let openTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      nextTimer = setTimeout(
        () => {
          setBlinking(true);
          openTimer = setTimeout(() => {
            setBlinking(false);
            schedule();
          }, 130);
        },
        4000 + Math.random() * 4000,
      );
    };

    schedule();
    return () => {
      clearTimeout(nextTimer);
      clearTimeout(openTimer);
    };
  }, [reducedMotion, phase]);

  const api = useMemo<HarviApi>(
    () => ({
      phase,
      gaze,
      blinking,
      line,
      reducedMotion,
      setPhase,
      say,
      registerTarget,
      setTargetActive,
      stageRef,
      figureRef,
      headRef,
    }),
    [
      phase,
      gaze,
      blinking,
      line,
      reducedMotion,
      say,
      registerTarget,
      setTargetActive,
    ],
  );

  return <HarviContext.Provider value={api}>{children}</HarviContext.Provider>;
}

export function useHarvi(): HarviApi {
  const api = useContext(HarviContext);
  if (!api) throw new Error("useHarvi вызван вне <HarviProvider>");
  return api;
}

/**
 * Объявляет элемент объектом внимания HARVI.
 * Возвращает обработчики, которые секция вешает на сам элемент.
 */
export function useAttentionTarget(
  id: string,
  ref: RefObject<HTMLElement | null>,
  options: { priority: number; gaze: HarviGaze; active?: boolean },
) {
  const { registerTarget, setTargetActive } = useHarvi();
  const { priority, gaze, active } = options;

  useEffect(() => {
    return registerTarget(id, { priority, gaze, element: ref.current });
  }, [id, priority, gaze, ref, registerTarget]);

  useEffect(() => {
    if (active === undefined) return;
    setTargetActive(id, active);
  }, [id, active, setTargetActive]);

  return useMemo(
    () => ({
      onPointerEnter: () => setTargetActive(id, true),
      onPointerLeave: () => setTargetActive(id, false),
      onFocus: () => setTargetActive(id, true),
      onBlur: () => setTargetActive(id, false),
    }),
    [id, setTargetActive],
  );
}

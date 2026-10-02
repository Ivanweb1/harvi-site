/**
 * Тексты лендинга. Ни один экран не хардкодит копирайт у себя (ТЗ §43).
 */

export const brand = {
  name: "HARVI",
  employeeId: "EMPLOYEE #0001",
  role: "AI SALES MANAGER",
  tagline: "Making websites alive.",
} as const;

export const nav = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#first-workday" },
  { label: "Cases", href: "#cases" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const hero = {
  eyebrow: { left: "SECTION / 01", right: "WEBSITE AWAKENING" },
  titleLines: ["Ваш сайт", "не должен молчать."],
  subtitle: "Наймите ему сотрудника.",
  description:
    "HARVI изучит ваш бизнес, начнёт разговаривать с посетителями, понимать их потребности и передавать готовые обращения вашей команде.",
  input: {
    label: "Адрес вашего сайта",
    placeholder: "https://ваш-сайт.ru",
    invalid: "Похоже, это не адрес сайта. Проверьте ещё раз.",
  },
  cta: "Познакомить HARVI с сайтом",
  note: "Первый рабочий день — за несколько минут.",
  lines: {
    submitted: "Понял. Сейчас посмотрю.",
    reading: "READING YOUR WEBSITE…",
    scanned: "Готов показать, что я нашёл.",
  },
} as const;

export const status = {
  offline: { dot: "○", label: "OFFLINE" },
  live: { dot: "●", label: "LIVE" },
  onShift: { dot: "●", label: "ON SHIFT" },
} as const;

export const header = {
  cta: "Нанять HARVI",
} as const;

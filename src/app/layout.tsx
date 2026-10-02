import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { HarviProvider } from "@/components/harvi/attention";
import { asset } from "@/lib/basePath";
import { siteUrl } from "@/lib/site";

import "./globals.css";

/* Inter — neutral neo-grotesk с кириллицей (ТЗ §9) */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/* mono — только для технических подписей */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HARVI — AI-сотрудник для вашего сайта",
    template: "%s — HARVI",
  },
  description:
    "HARVI изучает ваш бизнес, разговаривает с посетителями сайта, квалифицирует обращения и передаёт готовых лидов вашей команде.",
  applicationName: "HARVI",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "HARVI",
    title: "HARVI — AI-сотрудник для вашего сайта",
    description:
      "У каждого сайта должен быть свой сотрудник. HARVI изучает бизнес, разговаривает с посетителями и передаёт готовые обращения команде.",
    images: [{ url: "/harvi/og.jpg", width: 1200, height: 630, alt: "HARVI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HARVI — AI-сотрудник для вашего сайта",
    description:
      "Наймите HARVI на свой сайт за несколько минут. Первый рабочий день — сегодня.",
    images: ["/harvi/og.jpg"],
  },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HARVI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-сотрудник для сайта: изучает бизнес, разговаривает с посетителями, квалифицирует обращения и передаёт лиды команде.",
  url: siteUrl,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* ТЗ §40: предзагружаем только то, что реально видно в первом экране */}
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href={asset("/harvi/figure-base.avif")}
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href={asset("/harvi/head-sleeping.avif")}
        />
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href={asset("/harvi/head-live.avif")}
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <HarviProvider>{children}</HarviProvider>
      </body>
    </html>
  );
}

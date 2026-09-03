import type { Metadata, Viewport } from "next";
import {
  Geist,
  Playfair_Display,
  Dancing_Script,
  EB_Garamond,
} from "next/font/google";
import "../globals.css";
import { getDictionary, hasLocale, type Locale } from "./dictionaries";
import { notFound } from "next/navigation";
import { FloatingLeaves } from "@/components/FloatingLeaves";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToHash } from "@/components/ScrollToHash";
import { FloatingNav } from "@/components/FloatingNav";
import { I18nProvider } from "@/components/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ummi & Danish — Wedding Invitation",
  description:
    "You are cordially invited to the wedding of Ummi & Danish on 31 August 2026.",
};

// `viewportFit: "cover"` is required for iOS Safari to honour
// `env(safe-area-inset-*)` in CSS, which lets the background extend
// under the notch and home indicator. Without this, the inset values
// resolve to 0 on notched iPhones.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ms" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${playfair.variable} ${dancingScript.variable} ${ebGaramond.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <I18nProvider locale={lang as Locale} dict={dict}>
          <FloatingLeaves count={14} />
          <MusicPlayer />
          <LanguageSwitcher />
          <main className="flex-1 w-full">{children}</main>
          <FloatingNav />
          <ScrollToHash />
          <ScrollToTop />
        </I18nProvider>
      </body>
    </html>
  );
}

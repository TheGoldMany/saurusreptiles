import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getDict } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

/** Editorial display face used for cinematic headlines. */
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Saurus Reptiles",
  description:
    "Egzotikus állatok, webshop és tartási infók | Exotic animals, shop and care guides",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, dict } = await getDict();

  return (
    <html lang={locale}>
      <body
        className={`${geist.className} ${geist.variable} ${display.variable} film-grain min-h-screen bg-void text-ink antialiased`}
      >
        <I18nProvider locale={locale} dict={dict}>
          <Header />
          <main className="w-full">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}

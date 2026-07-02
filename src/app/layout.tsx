import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getDict } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const geist = Geist({ subsets: ["latin"] });

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
      <body className={`${geist.className} min-h-screen bg-stone-50 text-stone-900 antialiased`}>
        <I18nProvider locale={locale} dict={dict}>
          <Header />
          <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-4 py-8">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}

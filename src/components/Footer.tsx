import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { LogoMark } from "./Logo";

export default async function Footer() {
  const { dict } = await getDict();
  return (
    <footer className="mt-24 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="text-base font-semibold tracking-tight text-stone-900">
              Saurus Reptiles
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-stone-500">
            {dict.footer.tagline}
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
            {dict.footer.links}
          </h3>
          <nav className="flex flex-col gap-2 text-sm text-stone-600">
            <Link href="/animals" className="transition-colors hover:text-brand-700">
              {dict.nav.animals}
            </Link>
            <Link href="/shop" className="transition-colors hover:text-brand-700">
              {dict.nav.shop}
            </Link>
            <Link href="/care" className="transition-colors hover:text-brand-700">
              {dict.nav.care}
            </Link>
            <Link href="/packs" className="transition-colors hover:text-brand-700">
              {dict.nav.packs}
            </Link>
          </nav>
        </div>
        <div className="text-sm text-stone-400 sm:text-right">
          <p>
            © {new Date().getFullYear()} Saurus Reptiles.
            <br />
            {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

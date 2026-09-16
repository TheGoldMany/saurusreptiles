import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { LogoMark } from "./Logo";

export default async function Footer() {
  const { dict } = await getDict();
  return (
    <footer className="mt-24 border-t border-white/10 bg-void">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="text-base font-semibold tracking-tight text-ink">
              Saurus Reptiles
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-3">
            {dict.footer.tagline}
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-4">
            {dict.footer.links}
          </h3>
          <nav className="flex flex-col gap-2 text-sm text-ink-2">
            <Link href="/animals" className="transition-colors hover:text-amber-glow">
              {dict.nav.animals}
            </Link>
            <Link href="/shop" className="transition-colors hover:text-amber-glow">
              {dict.nav.shop}
            </Link>
            <Link href="/care" className="transition-colors hover:text-amber-glow">
              {dict.nav.care}
            </Link>
            <Link href="/packs" className="transition-colors hover:text-amber-glow">
              {dict.nav.packs}
            </Link>
          </nav>
        </div>
        <div className="text-sm text-ink-4 sm:text-right">
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

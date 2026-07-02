import Link from "next/link";
import { getDict } from "@/lib/i18n";

export default async function Footer() {
  const { dict } = await getDict();
  return (
    <footer className="mt-16 border-t border-emerald-100 bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-black">
            <span>🦎</span> SaurusReptiles
          </div>
          <p className="mt-2 text-sm text-emerald-300">{dict.footer.tagline}</p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-400">
            {dict.footer.links}
          </h3>
          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/animals" className="hover:text-white">
              {dict.nav.animals}
            </Link>
            <Link href="/shop" className="hover:text-white">
              {dict.nav.shop}
            </Link>
            <Link href="/care" className="hover:text-white">
              {dict.nav.care}
            </Link>
            <Link href="/packs" className="hover:text-white">
              {dict.nav.packs}
            </Link>
          </nav>
        </div>
        <div className="text-sm text-emerald-300">
          <p>
            © {new Date().getFullYear()} Saurus Reptiles.{" "}
            {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

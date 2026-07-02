import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { formatCoins } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { logout } from "@/actions/auth";
import MobileNav from "./MobileNav";

export default async function Header() {
  const { dict, locale } = await getDict();
  const [user, cart] = await Promise.all([getCurrentUser(), readCart()]);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { href: "/animals", label: dict.nav.animals },
    { href: "/shop", label: dict.nav.shop },
    { href: "/care", label: dict.nav.care },
    { href: "/packs", label: dict.nav.packs },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-lg">
            🦎
          </span>
          <span className="text-lg font-black tracking-tight text-emerald-900">
            Saurus<span className="text-emerald-600">Reptiles</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />

          {user && (
            <Link
              href="/profile"
              className="hidden items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 sm:flex"
              title={dict.common.coins}
            >
              🪙 {formatCoins(user.coins, locale)}
            </Link>
          )}

          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-stone-700 hover:bg-emerald-50"
            aria-label={dict.nav.cart}
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  {dict.nav.admin}
                </Link>
              )}
              <Link
                href="/profile"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50"
              >
                {dict.nav.profile}
              </Link>
              <form action={logout}>
                <button className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100">
                  {dict.nav.logout}
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50"
              >
                {dict.nav.login}
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                {dict.nav.register}
              </Link>
            </div>
          )}

          <MobileNav
            isLoggedIn={!!user}
            isAdmin={user?.role === "admin"}
            links={navLinks}
          />
        </div>
      </div>
    </header>
  );
}

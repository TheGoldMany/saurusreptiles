import Link from "next/link";
import { LayoutDashboard, ShoppingCart } from "lucide-react";
import { getDict } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { formatCoins } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { logout } from "@/actions/auth";
import MobileNav from "./MobileNav";
import { Logo } from "./Logo";
import { CoinIcon } from "./icons";

export default async function Header() {
  const { dict, locale } = await getDict();
  const [user, cart] = await Promise.all([getCurrentUser(), readCart()]);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { href: "/bespoke", label: dict.nav.bespoke },
    { href: "/animals", label: dict.nav.animals },
    { href: "/shop", label: dict.nav.shop },
    { href: "/care", label: dict.nav.care },
    { href: "/packs", label: dict.nav.packs },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-white/[0.06] hover:text-ink"
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
              className="hidden items-center gap-1.5 rounded-full border border-amber-glow/30 bg-amber-glow/10 px-3 py-1.5 text-xs font-semibold text-amber-glow transition-colors hover:bg-amber-glow/15 sm:flex"
              title={dict.common.coins}
            >
              <CoinIcon className="h-3.5 w-3.5" />
              {formatCoins(user.coins, locale)}
            </Link>
          )}

          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-ink-2 transition-colors hover:bg-white/[0.06] hover:text-ink"
            aria-label={dict.nav.cart}
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-glow px-1 text-[10px] font-bold text-void">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-glow px-3 py-2 text-sm font-semibold text-void transition-colors hover:bg-amber-soft"
                >
                  <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
                  {dict.nav.admin}
                </Link>
              )}
              <Link
                href="/profile"
                className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-white/[0.06] hover:text-ink"
              >
                {dict.nav.profile}
              </Link>
              <form action={logout}>
                <button className="rounded-lg px-3 py-2 text-sm font-medium text-ink-4 transition-colors hover:bg-white/[0.06] hover:text-ink-2">
                  {dict.nav.logout}
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-white/[0.06] hover:text-ink"
              >
                {dict.nav.login}
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-amber-glow px-3.5 py-2 text-sm font-semibold text-void transition-colors hover:bg-amber-soft"
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

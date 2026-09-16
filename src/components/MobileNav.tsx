"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { logout } from "@/actions/auth";

export default function MobileNav({
  isLoggedIn,
  isAdmin,
  links,
}: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const { dict } = useI18n();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-ink-2 hover:bg-white/[0.06] hover:text-ink"
        aria-label="Menu"
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        )}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-white/10 bg-surface p-4 shadow-lg">
          <nav className="flex flex-col gap-1" onClick={() => setOpen(false)}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 font-medium text-ink-2 hover:bg-white/[0.06]"
              >
                {l.label}
              </Link>
            ))}
            <hr className="my-2 border-white/10" />
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-ink hover:bg-white/[0.06]"
                  >
                    <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
                    {dict.nav.admin}
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="rounded-lg px-3 py-2 font-medium text-ink-2 hover:bg-white/[0.06]"
                >
                  {dict.nav.profile}
                </Link>
                <form action={logout}>
                  <button className="w-full rounded-lg px-3 py-2 text-left font-medium text-ink-3 hover:bg-white/[0.06]">
                    {dict.nav.logout}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 font-medium text-ink-2 hover:bg-white/[0.06]"
                >
                  {dict.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg px-3 py-2 font-semibold text-amber-glow hover:bg-white/[0.06]"
                >
                  {dict.nav.register}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

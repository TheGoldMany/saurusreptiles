"use client";

import Link from "next/link";
import { useState } from "react";
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
        className="rounded-lg p-2 text-stone-700 hover:bg-emerald-50"
        aria-label="Menu"
      >
        ☰
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-emerald-100 bg-white p-4 shadow-lg">
          <nav className="flex flex-col gap-1" onClick={() => setOpen(false)}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 font-medium text-stone-700 hover:bg-emerald-50"
              >
                {l.label}
              </Link>
            ))}
            <hr className="my-2 border-emerald-100" />
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-lg px-3 py-2 font-semibold text-emerald-800 hover:bg-emerald-50"
                  >
                    {dict.nav.admin}
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="rounded-lg px-3 py-2 font-medium text-stone-700 hover:bg-emerald-50"
                >
                  {dict.nav.profile}
                </Link>
                <form action={logout}>
                  <button className="w-full rounded-lg px-3 py-2 text-left font-medium text-stone-500 hover:bg-stone-100">
                    {dict.nav.logout}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 font-medium text-stone-700 hover:bg-emerald-50"
                >
                  {dict.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg px-3 py-2 font-semibold text-emerald-800 hover:bg-emerald-50"
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

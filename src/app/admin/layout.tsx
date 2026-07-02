import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/admin");
  if (user.role !== "admin") redirect("/");

  const { dict } = await getDict();

  const links = [
    { href: "/admin", label: dict.admin.dashboard, icon: "📊" },
    { href: "/admin/products", label: dict.admin.products, icon: "📦" },
    { href: "/admin/orders", label: dict.admin.orders, icon: "🧾" },
    { href: "/admin/stock", label: dict.admin.stock, icon: "🚚" },
    { href: "/admin/animals", label: dict.admin.animals, icon: "🦎" },
    { href: "/admin/articles", label: dict.admin.articles, icon: "📝" },
    { href: "/admin/users", label: dict.admin.users, icon: "👥" },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside>
        <h2 className="mb-3 px-3 text-xs font-black uppercase tracking-wide text-stone-400">
          {dict.admin.title}
        </h2>
        <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

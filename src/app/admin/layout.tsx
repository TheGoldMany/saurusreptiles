import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Boxes,
  FileText,
  LayoutDashboard,
  PawPrint,
  Receipt,
  Truck,
  Users,
} from "lucide-react";
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
    { href: "/admin", label: dict.admin.dashboard, Icon: LayoutDashboard },
    { href: "/admin/products", label: dict.admin.products, Icon: Boxes },
    { href: "/admin/orders", label: dict.admin.orders, Icon: Receipt },
    { href: "/admin/stock", label: dict.admin.stock, Icon: Truck },
    { href: "/admin/animals", label: dict.admin.animals, Icon: PawPrint },
    { href: "/admin/articles", label: dict.admin.articles, Icon: FileText },
    { href: "/admin/users", label: dict.admin.users, Icon: Users },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside>
        <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
          {dict.admin.title}
        </h2>
        <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
          {links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { LoginForm } from "@/components/AuthForms";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;
  const { dict } = await getDict();
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-center text-3xl font-black text-emerald-950">
        {dict.auth.loginTitle}
      </h1>
      <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
        <LoginForm redirectTo={redirectTo ?? "/"} />
      </div>
    </div>
  );
}

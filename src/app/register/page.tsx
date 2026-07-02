import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { RegisterForm } from "@/components/AuthForms";

export default async function RegisterPage({
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
      <h1 className="text-center text-3xl font-bold tracking-tight text-stone-900">
        {dict.auth.registerTitle}
      </h1>
      <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <RegisterForm redirectTo={redirectTo ?? "/"} />
      </div>
    </div>
  );
}

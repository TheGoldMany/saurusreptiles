"use client";

import { useTransition } from "react";
import { setUserRole } from "@/actions/admin";
import { useI18n } from "@/lib/i18n/client";

export default function RoleToggle({
  userId,
  role,
  isSelf,
}: {
  userId: number;
  role: string;
  isSelf: boolean;
}) {
  const { dict } = useI18n();
  const [pending, startTransition] = useTransition();
  if (isSelf) return null;

  const next = role === "admin" ? "user" : "admin";
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => setUserRole(userId, next))}
      className="rounded-lg border border-stone-200 px-2 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50"
    >
      {next === "admin" ? dict.admin.user.makeAdmin : dict.admin.user.makeUser}
    </button>
  );
}

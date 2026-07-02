"use client";

import { useTransition } from "react";
import { useI18n } from "@/lib/i18n/client";

export default function DeleteButton({
  onDelete,
}: {
  onDelete: () => Promise<void>;
}) {
  const { dict } = useI18n();
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm(dict.common.delete + "?")) {
          startTransition(() => onDelete());
        }
      }}
      className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {dict.common.delete}
    </button>
  );
}

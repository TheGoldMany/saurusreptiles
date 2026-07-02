"use client";

import { useTransition } from "react";
import { setOrderStatus } from "@/actions/admin";
import { useI18n } from "@/lib/i18n/client";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: number;
  current: string;
}) {
  const { dict } = useI18n();
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => setOrderStatus(orderId, e.target.value))
      }
      className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm font-medium outline-none focus:border-emerald-500 disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {dict.orders.statuses[s]}
        </option>
      ))}
    </select>
  );
}

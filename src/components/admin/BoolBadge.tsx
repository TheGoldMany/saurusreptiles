import { Check, X } from "lucide-react";

export default function BoolBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700">
      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-stone-400">
      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  );
}

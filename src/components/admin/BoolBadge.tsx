import { Check, X } from "lucide-react";

export default function BoolBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-glow/15 text-amber-glow">
      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-ink-4">
      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  );
}

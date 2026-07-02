import { Coins } from "lucide-react";

/** SaurusCoin icon — a single import point so the coin visual stays consistent. */
export function CoinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <Coins className={className} strokeWidth={2} />;
}

import { Leaf } from "lucide-react";

/** Neutral, consistent stand-in for items without an uploaded image. */
export function ImagePlaceholder({
  className = "",
  iconClassName = "h-10 w-10",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-stone-100 text-stone-300 ${className}`}
    >
      <Leaf className={iconClassName} strokeWidth={1.5} />
    </div>
  );
}

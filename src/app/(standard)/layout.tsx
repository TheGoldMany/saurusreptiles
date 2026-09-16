/**
 * Layout for the standard storefront and admin routes — everything that
 * lives inside the centred content column. The cinematic /bespoke route
 * sits outside this group so it can run edge-to-edge.
 */
export default function StandardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-6xl px-4 py-8">
      {children}
    </div>
  );
}

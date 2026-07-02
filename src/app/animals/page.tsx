import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { animals } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { ImagePlaceholder } from "@/components/Placeholder";

export default async function AnimalsPage() {
  const { dict, locale } = await getDict();
  const db = getDb();
  const rows = await db
    .select()
    .from(animals)
    .where(eq(animals.visible, true))
    .orderBy(desc(animals.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        {dict.animals.title}
      </h1>
      <p className="mt-2 text-stone-500">{dict.animals.subtitle}</p>

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">
          {dict.animals.empty}
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <Link
              key={a.id}
              href={`/animals/${a.id}`}
              className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:border-stone-300 hover:shadow-sm"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {a.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.imageUrl}
                    alt={loc(locale, a.nameHu, a.nameEn)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <ImagePlaceholder className="h-full w-full" iconClassName="h-12 w-12" />
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-medium text-stone-800 transition-colors group-hover:text-brand-700">
                  {loc(locale, a.nameHu, a.nameEn)}
                </h2>
                <p className="text-sm italic text-stone-400">{a.latinName}</p>
                <div className="mt-3 flex gap-2 text-xs font-medium text-stone-600">
                  <span className="rounded-full bg-stone-100 px-2.5 py-1">
                    {dict.animals.sexes[a.sex] ?? a.sex}
                  </span>
                  {a.birthYear && (
                    <span className="rounded-full bg-stone-100 px-2.5 py-1">
                      {a.birthYear}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

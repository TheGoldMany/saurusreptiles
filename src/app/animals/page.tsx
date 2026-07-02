import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { animals } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";

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
      <h1 className="text-3xl font-black text-emerald-950">
        {dict.animals.title}
      </h1>
      <p className="mt-2 text-stone-500">{dict.animals.subtitle}</p>

      {rows.length === 0 ? (
        <p className="mt-12 text-center text-stone-500">
          {dict.animals.empty}
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <Link
              key={a.id}
              href={`/animals/${a.id}`}
              className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 text-6xl">
                {a.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.imageUrl}
                    alt={loc(locale, a.nameHu, a.nameEn)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "🦎"
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-stone-800 group-hover:text-emerald-800">
                  {loc(locale, a.nameHu, a.nameEn)}
                </h2>
                <p className="text-sm italic text-stone-500">{a.latinName}</p>
                <div className="mt-2 flex gap-2 text-xs font-semibold text-stone-500">
                  <span className="rounded-full bg-emerald-50 px-2 py-1">
                    {dict.animals.sexes[a.sex] ?? a.sex}
                  </span>
                  {a.birthYear && (
                    <span className="rounded-full bg-emerald-50 px-2 py-1">
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

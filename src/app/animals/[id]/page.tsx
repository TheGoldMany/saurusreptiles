import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { animals } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";

export default async function AnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { dict, locale } = await getDict();
  const animalId = Number(id);
  if (!Number.isInteger(animalId)) notFound();

  const db = getDb();
  const [animal] = await db
    .select()
    .from(animals)
    .where(eq(animals.id, animalId))
    .limit(1);

  if (!animal || !animal.visible) notFound();

  return (
    <div>
      <Link
        href="/animals"
        className="text-sm font-semibold text-emerald-700 hover:underline"
      >
        ← {dict.common.back}
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-8xl">
          {animal.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={animal.imageUrl}
              alt={loc(locale, animal.nameHu, animal.nameEn)}
              className="h-full w-full object-cover"
            />
          ) : (
            "🦎"
          )}
        </div>
        <div>
          <h1 className="text-3xl font-black text-emerald-950">
            {loc(locale, animal.nameHu, animal.nameEn)}
          </h1>
          <p className="mt-1 text-lg italic text-stone-500">
            {animal.latinName}
          </p>
          <div className="mt-4 flex gap-2 text-sm font-semibold">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
              {dict.animals.sex}: {dict.animals.sexes[animal.sex] ?? animal.sex}
            </span>
            {animal.birthYear && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                {dict.animals.birthYear}: {animal.birthYear}
              </span>
            )}
          </div>
          <p className="mt-6 whitespace-pre-line text-stone-600">
            {loc(locale, animal.descHu, animal.descEn)}
          </p>
        </div>
      </div>
    </div>
  );
}

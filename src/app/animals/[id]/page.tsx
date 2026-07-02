import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDb } from "@/lib/db";
import { animals } from "@/lib/db/schema";
import { getDict, loc } from "@/lib/i18n";
import { ImagePlaceholder } from "@/components/Placeholder";

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
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        {dict.common.back}
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-stone-200">
          {animal.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={animal.imageUrl}
              alt={loc(locale, animal.nameHu, animal.nameEn)}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder className="h-full w-full" iconClassName="h-16 w-16" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {loc(locale, animal.nameHu, animal.nameEn)}
          </h1>
          <p className="mt-1 text-lg italic text-stone-400">
            {animal.latinName}
          </p>
          <div className="mt-4 flex gap-2 text-sm font-medium">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">
              {dict.animals.sex}: {dict.animals.sexes[animal.sex] ?? animal.sex}
            </span>
            {animal.birthYear && (
              <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">
                {dict.animals.birthYear}: {animal.birthYear}
              </span>
            )}
          </div>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-stone-600">
            {loc(locale, animal.descHu, animal.descEn)}
          </p>
        </div>
      </div>
    </div>
  );
}

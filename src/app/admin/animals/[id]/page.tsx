import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { animals } from "@/lib/db/schema";
import { getDict } from "@/lib/i18n";
import AnimalForm from "@/components/admin/AnimalForm";

export default async function EditAnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { dict } = await getDict();
  const animalId = Number(id);
  if (!Number.isInteger(animalId)) notFound();

  const db = getDb();
  const [animal] = await db
    .select()
    .from(animals)
    .where(eq(animals.id, animalId))
    .limit(1);
  if (!animal) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-emerald-950">
        {dict.admin.animal.edit}
      </h1>
      <AnimalForm animal={animal} />
    </div>
  );
}

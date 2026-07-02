import { getDict } from "@/lib/i18n";
import AnimalForm from "@/components/admin/AnimalForm";

export default async function NewAnimalPage() {
  const { dict } = await getDict();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">
        {dict.admin.animal.new}
      </h1>
      <AnimalForm />
    </div>
  );
}

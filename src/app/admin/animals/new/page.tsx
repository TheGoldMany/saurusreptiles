import { getDict } from "@/lib/i18n";
import AnimalForm from "@/components/admin/AnimalForm";

export default async function NewAnimalPage() {
  const { dict } = await getDict();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-emerald-950">
        {dict.admin.animal.new}
      </h1>
      <AnimalForm />
    </div>
  );
}

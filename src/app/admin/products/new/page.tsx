import { getDict } from "@/lib/i18n";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const { dict } = await getDict();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-emerald-950">
        {dict.admin.product.new}
      </h1>
      <ProductForm />
    </div>
  );
}

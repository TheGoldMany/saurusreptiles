import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { getDict } from "@/lib/i18n";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { dict } = await getDict();
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const db = getDb();
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">
        {dict.admin.product.edit}
      </h1>
      <ProductForm product={product} />
    </div>
  );
}

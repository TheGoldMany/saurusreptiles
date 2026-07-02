"use server";

import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  orderItems,
  orders,
  products,
  stockMovements,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { readCart, writeCart } from "@/lib/cart";

export type CheckoutState = { error?: string } | null;

const PAYMENT_METHODS = ["transfer", "cod"];

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const user = await getCurrentUser();
  if (!user) return { error: "loginRequired" };

  const customerName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const zip = String(formData.get("zip") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const paymentMethod = String(formData.get("paymentMethod") ?? "");

  if (
    !customerName ||
    !email.includes("@") ||
    !zip ||
    !city ||
    !address ||
    !PAYMENT_METHODS.includes(paymentMethod)
  ) {
    return { error: "invalidInput" };
  }

  const cart = await readCart();
  if (cart.length === 0) return { error: "emptyCart" };

  const db = getDb();
  const ids = cart.map((i) => i.productId);
  const rows = await db
    .select()
    .from(products)
    .where(and(inArray(products.id, ids), eq(products.active, true)));

  const items = cart
    .map((ci) => {
      const product = rows.find((p) => p.id === ci.productId);
      return product ? { product, quantity: ci.quantity } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (items.length === 0) return { error: "emptyCart" };

  // Reserve stock with conditional updates; roll back on partial failure.
  const reserved: { productId: number; quantity: number }[] = [];
  for (const { product, quantity } of items) {
    const updated = await db
      .update(products)
      .set({ stock: sql`${products.stock} - ${quantity}` })
      .where(and(eq(products.id, product.id), gte(products.stock, quantity)))
      .returning({ id: products.id });
    if (updated.length === 0) {
      for (const r of reserved) {
        await db
          .update(products)
          .set({ stock: sql`${products.stock} + ${r.quantity}` })
          .where(eq(products.id, r.productId));
      }
      return { error: "stockError" };
    }
    reserved.push({ productId: product.id, quantity });
  }

  const totalHuf = items.reduce(
    (sum, { product, quantity }) => sum + product.priceHuf * quantity,
    0
  );

  const [order] = await db
    .insert(orders)
    .values({
      userId: user.id,
      status: "pending",
      totalHuf,
      customerName,
      email,
      phone,
      zip,
      city,
      address,
      paymentMethod,
    })
    .returning();

  await db.insert(orderItems).values(
    items.map(({ product, quantity }) => ({
      orderId: order.id,
      productId: product.id,
      nameHu: product.nameHu,
      nameEn: product.nameEn,
      priceHuf: product.priceHuf,
      quantity,
    }))
  );

  await db.insert(stockMovements).values(
    items.map(({ product, quantity }) => ({
      productId: product.id,
      change: -quantity,
      type: "sale",
      note: `Order #${order.id}`,
    }))
  );

  await writeCart([]);
  redirect(`/orders?success=${order.id}`);
}

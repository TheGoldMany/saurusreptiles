"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  animals,
  articles,
  coinTransactions,
  orders,
  products,
  stockMovements,
  users,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export type AdminFormState = { error?: string } | null;

// ---------- Products ----------

export async function saveProduct(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const db = getDb();

  const id = Number(formData.get("id") || 0);
  const nameHu = String(formData.get("nameHu") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const priceHuf = Math.max(0, Math.floor(Number(formData.get("priceHuf"))));
  const stock = Math.max(0, Math.floor(Number(formData.get("stock") || 0)));

  if (!nameHu || !nameEn || !Number.isFinite(priceHuf)) {
    return { error: "invalidInput" };
  }

  const values = {
    nameHu,
    nameEn,
    descHu: String(formData.get("descHu") ?? ""),
    descEn: String(formData.get("descEn") ?? ""),
    category: String(formData.get("category") ?? "other"),
    priceHuf,
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    active: formData.get("active") === "on",
  };

  if (id > 0) {
    const [before] = await db
      .select({ stock: products.stock })
      .from(products)
      .where(eq(products.id, id));
    await db.update(products).set(values).where(eq(products.id, id));
    if (before && before.stock !== stock) {
      await db.update(products).set({ stock }).where(eq(products.id, id));
      await db.insert(stockMovements).values({
        productId: id,
        change: stock - before.stock,
        type: "adjustment",
        note: "Admin edit",
      });
    }
  } else {
    const slug = `${slugify(nameEn || nameHu)}-${Date.now().toString(36)}`;
    const [created] = await db
      .insert(products)
      .values({ ...values, slug, stock })
      .returning();
    if (stock > 0) {
      await db.insert(stockMovements).values({
        productId: created.id,
        change: stock,
        type: "receipt",
        note: "Initial stock",
      });
    }
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  const db = getDb();
  // Keep referential integrity with past orders: deactivate instead of delete.
  await db.update(products).set({ active: false }).where(eq(products.id, id));
  revalidatePath("/", "layout");
}

// ---------- Stock ----------

export async function recordStockMovement(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const db = getDb();

  const productId = Number(formData.get("productId"));
  const change = Math.floor(Number(formData.get("change")));
  const note = String(formData.get("note") ?? "").trim();

  if (!Number.isInteger(productId) || !Number.isInteger(change) || change === 0) {
    return { error: "invalidInput" };
  }

  await db
    .update(products)
    .set({ stock: sql`GREATEST(${products.stock} + ${change}, 0)` })
    .where(eq(products.id, productId));

  await db.insert(stockMovements).values({
    productId,
    change,
    type: change > 0 ? "receipt" : "adjustment",
    note,
  });

  revalidatePath("/", "layout");
  redirect("/admin/stock");
}

// ---------- Orders ----------

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export async function setOrderStatus(orderId: number, status: string) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) return;
  const db = getDb();

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!order) return;

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));

  // Award SaurusCoins (1 coin / HUF) the first time an order becomes paid.
  const paidLike = ["paid", "shipped", "delivered"];
  if (!order.coinsAwarded && paidLike.includes(status)) {
    await db
      .update(orders)
      .set({ coinsAwarded: true })
      .where(eq(orders.id, orderId));
    await db
      .update(users)
      .set({ coins: sql`${users.coins} + ${order.totalHuf}` })
      .where(eq(users.id, order.userId));
    await db.insert(coinTransactions).values({
      userId: order.userId,
      amount: order.totalHuf,
      reason: `order:${order.id}`,
    });
  }

  revalidatePath("/", "layout");
}

// ---------- Animals ----------

export async function saveAnimal(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const db = getDb();

  const id = Number(formData.get("id") || 0);
  const nameHu = String(formData.get("nameHu") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  if (!nameHu || !nameEn) return { error: "invalidInput" };

  const birthYearRaw = Number(formData.get("birthYear"));
  const values = {
    nameHu,
    nameEn,
    latinName: String(formData.get("latinName") ?? "").trim(),
    descHu: String(formData.get("descHu") ?? ""),
    descEn: String(formData.get("descEn") ?? ""),
    sex: String(formData.get("sex") ?? "unknown"),
    birthYear: Number.isInteger(birthYearRaw) && birthYearRaw > 1900 ? birthYearRaw : null,
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    visible: formData.get("visible") === "on",
  };

  if (id > 0) {
    await db.update(animals).set(values).where(eq(animals.id, id));
  } else {
    await db.insert(animals).values(values);
  }

  revalidatePath("/", "layout");
  redirect("/admin/animals");
}

export async function deleteAnimal(id: number) {
  await requireAdmin();
  const db = getDb();
  await db.delete(animals).where(eq(animals.id, id));
  revalidatePath("/", "layout");
}

// ---------- Articles ----------

export async function saveArticle(
  _prev: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const db = getDb();

  const id = Number(formData.get("id") || 0);
  const titleHu = String(formData.get("titleHu") ?? "").trim();
  const titleEn = String(formData.get("titleEn") ?? "").trim();
  if (!titleHu || !titleEn) return { error: "invalidInput" };

  const values = {
    titleHu,
    titleEn,
    excerptHu: String(formData.get("excerptHu") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? ""),
    contentHu: String(formData.get("contentHu") ?? ""),
    contentEn: String(formData.get("contentEn") ?? ""),
    category: String(formData.get("category") ?? "care"),
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    published: formData.get("published") === "on",
  };

  if (id > 0) {
    await db.update(articles).set(values).where(eq(articles.id, id));
  } else {
    const slug = `${slugify(titleEn || titleHu)}-${Date.now().toString(36)}`;
    await db.insert(articles).values({ ...values, slug });
  }

  revalidatePath("/", "layout");
  redirect("/admin/articles");
}

export async function deleteArticle(id: number) {
  await requireAdmin();
  const db = getDb();
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath("/", "layout");
}

// ---------- Users ----------

export async function setUserRole(userId: number, role: "user" | "admin") {
  const admin = await requireAdmin();
  if (admin.id === userId) return; // don't demote yourself
  const db = getDb();
  await db.update(users).set({ role }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}

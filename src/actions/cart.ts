"use server";

import { revalidatePath } from "next/cache";
import { readCart, writeCart } from "@/lib/cart";

export async function addToCart(productId: number, quantity: number = 1) {
  if (!Number.isInteger(productId) || productId <= 0) return;
  const qty = Math.max(1, Math.min(99, Math.floor(quantity)));
  const cart = await readCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + qty);
  } else {
    cart.push({ productId, quantity: qty });
  }
  await writeCart(cart);
  revalidatePath("/", "layout");
}

export async function setCartQuantity(productId: number, quantity: number) {
  const cart = await readCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  if (quantity <= 0) {
    await writeCart(cart.filter((i) => i.productId !== productId));
  } else {
    item.quantity = Math.min(99, Math.floor(quantity));
    await writeCart(cart);
  }
  revalidatePath("/", "layout");
}

export async function removeFromCart(productId: number) {
  const cart = await readCart();
  await writeCart(cart.filter((i) => i.productId !== productId));
  revalidatePath("/", "layout");
}

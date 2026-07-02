import "server-only";
import { cookies } from "next/headers";

export type CartItem = { productId: number; quantity: number };

const CART_COOKIE = "cart";

export async function readCart(): Promise<CartItem[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is CartItem =>
          typeof item === "object" &&
          item !== null &&
          typeof item.productId === "number" &&
          typeof item.quantity === "number" &&
          item.quantity > 0
      )
      .slice(0, 50);
  } catch {
    return [];
  }
}

export async function writeCart(items: CartItem[]) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
}

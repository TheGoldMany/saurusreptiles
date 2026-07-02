"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { adminEmails, createSession, destroySession } from "@/lib/auth";

export type AuthState = { error?: string } | null;

export async function register(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");
  const redirectTo = safeRedirect(formData.get("redirectTo"));

  if (!name || !email.includes("@")) return { error: "invalidInput" };
  if (password.length < 8) return { error: "passwordTooShort" };
  if (password !== password2) return { error: "passwordMismatch" };

  const db = getDb();
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) return { error: "emailTaken" };

  const passwordHash = await bcrypt.hash(password, 10);
  const role = adminEmails().includes(email) ? "admin" : "user";
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash, role })
    .returning();

  await createSession(user.id, user.role);
  redirect(redirectTo);
}

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirect(formData.get("redirectTo"));

  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const user = rows[0];
  if (!user) return { error: "invalidCredentials" };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "invalidCredentials" };

  // Promote configured head-admin emails on login as well, in case the
  // account was created before the email was added to ADMIN_EMAILS.
  let role = user.role;
  if (role !== "admin" && adminEmails().includes(email)) {
    role = "admin";
    await db.update(users).set({ role }).where(eq(users.id, user.id));
  }

  await createSession(user.id, role);
  redirect(redirectTo);
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function setLocale(locale: string, path: string) {
  const store = await cookies();
  store.set("locale", locale === "en" ? "en" : "hu", {
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
  });
  redirect(safeRedirect(path));
}

function safeRedirect(value: FormDataEntryValue | string | null): string {
  const str = String(value ?? "/");
  return str.startsWith("/") && !str.startsWith("//") ? str : "/";
}

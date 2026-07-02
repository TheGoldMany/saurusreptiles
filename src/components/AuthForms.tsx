"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register, type AuthState } from "@/actions/auth";
import { useI18n } from "@/lib/i18n/client";

const inputCls =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

function errorText(
  dict: ReturnType<typeof useI18n>["dict"],
  code?: string
): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    invalidCredentials: dict.auth.invalidCredentials,
    emailTaken: dict.auth.emailTaken,
    passwordMismatch: dict.auth.passwordMismatch,
    passwordTooShort: dict.auth.passwordTooShort,
    invalidInput: dict.auth.invalidInput,
  };
  return map[code] ?? dict.common.error;
}

export function LoginForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const { dict } = useI18n();
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    null
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        {dict.auth.email}
        <input name="email" type="email" required className={inputCls} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        {dict.auth.password}
        <input name="password" type="password" required className={inputCls} />
      </label>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorText(dict, state.error)}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {dict.auth.loginBtn}
      </button>
      <p className="text-center text-sm text-stone-500">
        {dict.auth.noAccount}{" "}
        <Link href="/register" className="font-semibold text-emerald-700">
          {dict.nav.register}
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const { dict } = useI18n();
  const [state, action, pending] = useActionState<AuthState, FormData>(
    register,
    null
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        {dict.auth.name}
        <input name="name" required className={inputCls} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        {dict.auth.email}
        <input name="email" type="email" required className={inputCls} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        {dict.auth.password}
        <input
          name="password"
          type="password"
          minLength={8}
          required
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-stone-700">
        {dict.auth.passwordAgain}
        <input
          name="password2"
          type="password"
          minLength={8}
          required
          className={inputCls}
        />
      </label>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorText(dict, state.error)}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {dict.auth.registerBtn}
      </button>
      <p className="text-center text-sm text-stone-500">
        {dict.auth.hasAccount}{" "}
        <Link href="/login" className="font-semibold text-emerald-700">
          {dict.nav.login}
        </Link>
      </p>
    </form>
  );
}

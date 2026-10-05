"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-2 text-[13px] text-ink">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          className="input"
        />
      </label>

      <label className="flex flex-col gap-2 text-[13px] text-ink">
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="input"
        />
      </label>

      {state?.error && (
        <p role="alert" className="text-[13px] text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-dark self-start"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

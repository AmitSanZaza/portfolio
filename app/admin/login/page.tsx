"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="container-page flex flex-1 flex-col justify-center gap-8 py-16">
      <h1 className="text-[40px] leading-[1.15]">Owner login</h1>

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
    </div>
  );
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

// A fresh client per request, per the Supabase SSR guide — Server Components
// and Server Actions each call this rather than sharing one client.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render (not a Server Action) —
          // cookies can't be written there. Safe to ignore: the session for
          // this request is still valid, only the refresh write is skipped.
        }
      },
    },
  });
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setAuthenticated(Boolean(data.session));
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthenticated(Boolean(session));
        router.refresh();
      }
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-navy-500">
        Checking session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-navy-100 bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-navy-900">
          Admin Login
        </h2>
        <p className="mb-6 text-sm text-navy-500">
          Sign in with your Supabase account to manage content.
        </p>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const email = String(formData.get("email"));
            const password = String(formData.get("password"));
            await supabase.auth.signInWithPassword({
              email,
              password,
            });
            router.refresh();
          }}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

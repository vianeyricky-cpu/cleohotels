"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { supabase } from "@/lib/supabase";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-slate-100 text-navy-900">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px,1fr]">
          <AdminSidebar />
          <div className="flex flex-col">
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                <p className="text-xs text-slate-500">
                  Manage your hotels, rooms, and facilities.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600 hover:border-navy-900 hover:text-navy-900"
              >
                Logout
              </button>
            </header>
            <main className="flex-1 px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  );
}

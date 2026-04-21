"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Loader2, Mail, KeyRound } from "lucide-react"; // Import ikon tambahan

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false); // State untuk loading tombol submit
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

  // Tampilan Loading saat mengecek sesi
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a56db] mb-4" />
        <p className="text-sm font-bold tracking-widest text-slate-400 uppercase animate-pulse">
          Authenticating Secure Session...
        </p>
      </div>
    );
  }

  // Tampilan Form Login
  if (!authenticated) {
    return (
      // Wrapper layar penuh agar selalu di tengah
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 sm:p-8 relative overflow-hidden">
        
        {/* Latar Belakang Dekoratif Opsional */}
        <div className="absolute top-0 left-0 w-full h-64 bg-[#1a56db]" />

        <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-100 relative z-10 animate-fade-in-up">
          
          {/* Header Login */}
          <div className="bg-[#1a56db] p-8 pb-10 text-center text-white relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 mb-6 backdrop-blur-md shadow-inner border border-white/20">
              <ShieldCheck size={40} className="text-white drop-shadow-md" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-widest uppercase">
              Cleo Management
            </h2>
            <p className="mt-2 text-xs font-medium text-blue-200 tracking-wider">
              SECURE ADMIN DASHBOARD V2.0
            </p>
          </div>

          {/* Form Login */}
          <div className="p-8 -mt-6 bg-white rounded-t-[2rem] relative">
            <form
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                setIsSigningIn(true);
                const formData = new FormData(event.currentTarget);
                const email = String(formData.get("email"));
                const password = String(formData.get("password"));
                
                const { error } = await supabase.auth.signInWithPassword({
                  email,
                  password,
                });

                if (error) {
                  alert("Login failed: " + error.message);
                  setIsSigningIn(false);
                } else {
                  router.refresh();
                }
              }}
            >
              {/* Input Email */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-[#1a56db] focus:bg-white focus:ring-4 focus:ring-[#1a56db]/10"
                    placeholder="admin@cleohotels.com"
                    required
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <KeyRound size={18} className="text-slate-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-[#1a56db] focus:bg-white focus:ring-4 focus:ring-[#1a56db]/10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a56db] px-4 py-4 text-sm font-bold text-white transition-all hover:bg-blue-800 hover:shadow-lg hover:shadow-[#1a56db]/30 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-4"
              >
                {isSigningIn ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Lock size={18} className="transition-transform group-hover:-translate-y-0.5" />
                )}
                {isSigningIn ? "Authenticating..." : "Sign In to Dashboard"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-medium text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> Protected by Askara Security
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return <>{children}</>;
}
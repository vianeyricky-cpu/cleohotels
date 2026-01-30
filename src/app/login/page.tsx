"use client";

import { useState } from "react";
// GANTI INI: Gunakan library baru
import { createBrowserClient } from '@supabase/ssr' 
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Setup Supabase Client (Versi SSR/Browser terbaru)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Force Refresh agar Middleware mendeteksi cookie baru
      router.refresh(); 
      router.push("/admin"); 
      
    } catch (err: any) {
      alert("Login Failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8 animate-fade-in-up">
        <div className="text-center mb-8">
           <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4 text-navy-950">
             <Lock size={32} />
           </div>
           <h1 className="text-2xl font-bold text-navy-950">CMS Admin Login</h1>
           <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
             <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-gray-900"
              placeholder="admin@cleohotels.com"
            />
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
             <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-gray-900"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-gold-500 text-white font-bold rounded-lg hover:bg-gold-600 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
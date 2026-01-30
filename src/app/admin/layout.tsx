import Link from "next/link";
import "../[locale]/globals.css";
import { LayoutDashboard, Building2, BedDouble, ConciergeBell, LogOut, ShieldCheck } from "lucide-react";

export const metadata = {
  title: 'Admin Dashboard - Cleo Hotels',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans text-slate-900 antialiased">
        <div className="flex min-h-screen">
          
          {/* --- SIDEBAR --- */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy-950 text-white shadow-xl">
            
            {/* Header Sidebar */}
            <div className="flex h-24 flex-col justify-center border-b border-white/10 px-6">
              <h1 className="text-lg font-bold leading-tight text-gold-500">
                MANAGEMENT CONTENT
              </h1>
              <div className="mt-1 flex items-center gap-2 text-[10px] font-medium tracking-wider text-white/60">
                <span className="uppercase">by Askara Indonesia</span>
                <ShieldCheck size={12} className="text-green-400" />
              </div>
            </div>

            {/* Menu Navigasi */}
            <nav className="flex-1 space-y-2 px-4 py-6">
              <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              
              <div className="px-4 pb-2 pt-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Master Data
              </div>
              <NavItem href="/admin/hotels" icon={<Building2 size={20} />} label="Hotels & Content" />
              <NavItem href="/admin/rooms" icon={<BedDouble size={20} />} label="Rooms Management" />
              <NavItem href="/admin/facilities" icon={<ConciergeBell size={20} />} label="Facilities" />
            </nav>

            {/* Footer Sidebar */}
            <div className="border-t border-white/10 p-4">
              <Link href="/en" target="_blank" className="mb-2 flex w-full items-center justify-center rounded-lg bg-white/5 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/10 hover:text-white">
                 View Live Website
              </Link>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* --- MAIN CONTENT AREA --- */}
          <main className="ml-72 min-h-screen flex-1 bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl animate-fade-in-up">
              {children}
            </div>
          </main>
          
        </div>
      </body>
    </html>
  );
}

// Komponen Helper Menu
function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-gold-500 hover:text-navy-950 hover:shadow-lg hover:shadow-gold-500/20"
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
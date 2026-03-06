import Link from "next/link";
import { LayoutDashboard, Building2, BedDouble, ConciergeBell, LogOut, ShieldCheck, Tag, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-slate-900 antialiased">
      {/* --- SIDEBAR --- */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1a56db] text-white shadow-xl">
        <div className="flex h-24 flex-col justify-center border-b border-white/10 px-6">
          <h1 className="text-lg font-extrabold leading-tight text-white tracking-widest uppercase">
            Cleo Content Pro
          </h1>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-blue-200">
            <span>BY ASKARA INDONESIA</span>
            <ShieldCheck size={12} className="text-white" />
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <div className="px-4 pb-2 pt-6 text-[10px] font-extrabold uppercase tracking-widest text-blue-300">Master Data</div>
          <NavItem href="/admin/hotels" icon={<Building2 size={20} />} label="Hotels & Content" />
          <NavItem href="/admin/rooms" icon={<BedDouble size={20} />} label="Rooms Management" />
          <NavItem href="/admin/facilities" icon={<ConciergeBell size={20} />} label="Facilities" />
          <div className="px-4 pb-2 pt-6 text-[10px] font-extrabold uppercase tracking-widest text-blue-300">Marketing & System</div>
          <NavItem href="/admin/promos" icon={<Tag size={20} />} label="Promos & Offers" />
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Hero Homepage" />
        </nav>

        <div className="border-t border-white/10 p-4 space-y-2">
          <Link href="/en" target="_blank" className="flex w-full items-center justify-center rounded-xl bg-blue-800 py-3 text-sm font-medium text-white transition hover:bg-blue-900 border border-blue-700 shadow-sm">
             View Live Website
          </Link>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-blue-100 transition hover:bg-red-500 hover:text-white">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="ml-72 min-h-screen flex-1 p-8">
        <div className="mx-auto max-w-5xl animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-blue-100 transition-all hover:bg-white hover:text-[#1a56db] hover:shadow-md hover:font-bold">
      {icon} <span>{label}</span>
    </Link>
  );
}
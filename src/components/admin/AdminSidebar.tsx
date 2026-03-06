"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, Hotel, BedDouble, Sparkles, Settings, Tag, 
  ExternalLink, LogOut, ShieldCheck 
} from "lucide-react"; 
import clsx from "clsx";

// Pisahkan menu berdasarkan kategori agar rapi
const menuGroups = [
  {
    title: "", 
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutGrid },
    ]
  },
  {
    title: "MASTER DATA",
    items: [
      { href: "/admin/hotels", label: "Hotels & Content", icon: Hotel },
      { href: "/admin/rooms", label: "Rooms Management", icon: BedDouble },
      { href: "/admin/facilities", label: "Facilities", icon: Sparkles },
    ]
  },
  {
    title: "MARKETING & SYSTEM",
    items: [
      { href: "/admin/promos", label: "Promos & Offers", icon: Tag },
      { href: "/admin/settings", label: "General Settings", icon: Settings },
    ]
  }
];

function withLocale(pathname: string | null, href: string) {
  if (!pathname) return href;
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  return `/${locale}${href}`;
}

export function AdminSidebar() {
  const pathname = usePathname();

  const checkIsActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") {
      return pathname.endsWith("/admin");
    }
    return pathname.includes(href);
  };

  return (
    // Background diubah menjadi Biru Utama (#1a56db)
    <aside className="flex h-screen w-full flex-col bg-[#1a56db] text-white overflow-y-auto shadow-2xl relative z-50">
      
      {/* --- HEADER LOGO --- */}
      <div className="px-8 pt-10 pb-6 border-b border-white/10 mb-4">
        <h1 className="text-lg md:text-xl font-extrabold text-white tracking-widest leading-snug mb-2">
          CLEO MANAGEMENT
        </h1>
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-blue-200 uppercase">
          BY ASKARA INDONESIA <ShieldCheck size={14} className="text-white" />
        </div>
      </div>
      
      {/* --- NAVIGATION MENU --- */}
      <nav className="flex flex-col gap-6 px-4 flex-1">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {group.title && (
              <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest px-4 mb-2 mt-2">
                {group.title}
              </span>
            )}
            
            {group.items.map((link) => {
              const href = withLocale(pathname, link.href);
              const isActive = checkIsActive(link.href);
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 text-sm font-medium",
                    isActive
                      // Menu Aktif: Background Putih, Teks Biru
                      ? "bg-white text-[#1a56db] font-bold shadow-md transform scale-[1.02]"
                      // Menu Tidak Aktif: Teks Biru Muda, saat di-hover jadi Putih
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={clsx("h-5 w-5", isActive ? "text-[#1a56db]" : "text-blue-200")} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* --- FOOTER / BOTTOM ACTION --- */}
      <div className="p-6 mt-auto space-y-3">
        {/* Tombol View Live Website */}
        <Link 
          href={withLocale(pathname, "/")} 
          target="_blank"
          className="flex items-center justify-center gap-2 w-full bg-blue-800 hover:bg-blue-900 text-white px-4 py-3 rounded-xl transition text-sm font-medium border border-blue-700 shadow-sm"
        >
          View Live Website
          <ExternalLink size={16} />
        </Link>
        
        {/* Tombol Sign Out */}
        <button className="flex items-center justify-center gap-2 w-full hover:bg-red-500 hover:text-white text-blue-100 px-4 py-3 rounded-xl transition-all text-sm font-bold">
          <LogOut size={16} />
          Sign Out
        </button>

        {/* Copyright */}
        <div className="text-center text-[10px] text-blue-300 pt-4 font-medium">
          © 2026 Cleo Hotels v2.0
        </div>
      </div>

    </aside>
  );
}
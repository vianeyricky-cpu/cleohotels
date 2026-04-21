"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Building2, BedDouble, ConciergeBell, Settings, Tag, 
  ExternalLink, LogOut, ShieldCheck 
} from "lucide-react"; 
import clsx from "clsx";
import { supabase } from "@/lib/supabase";

const menuGroups = [
  {
    title: "", 
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "MASTER DATA",
    items: [
      { href: "/admin/hotels", label: "Hotels & Content", icon: Building2 },
      { href: "/admin/rooms", label: "Rooms Management", icon: BedDouble },
      { href: "/admin/facilities", label: "Facilities", icon: ConciergeBell },
    ]
  },
  {
    title: "MARKETING & SYSTEM",
    items: [
      { href: "/admin/promos", label: "Promos & Offers", icon: Tag },
      { href: "/admin/settings", label: "Hero Homepage", icon: Settings },
    ]
  }
];

function withLocale(pathname: string | null, href: string) {
  if (!pathname) return href;
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] || 'en'; // Default to en if no locale
  if (href === "/admin") return `/${locale}/admin`;
  return `/${locale}${href}`;
}

export function AdminSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  const checkIsActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") {
      return pathname.endsWith("/admin");
    }
    return pathname.includes(href);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  return (
    <aside 
      className={clsx(
        "transition-all duration-300 ease-in-out flex flex-col bg-[#1a56db] text-white shadow-2xl relative z-50 h-screen overflow-y-auto overflow-x-hidden",
        isOpen ? "w-[280px]" : "w-[80px]"
      )}
    >
      {/* --- HEADER LOGO --- */}
      <div className="flex h-24 flex-col justify-center border-b border-white/10 px-6 whitespace-nowrap">
        {isOpen ? (
          <div className="animate-fade-in">
            <h1 className="text-lg font-extrabold leading-tight text-white tracking-widest uppercase">
              Cleo Content Pro
            </h1>
            <div className="mt-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-blue-200 uppercase">
              <span>by Askara Indonesia</span>
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <ShieldCheck size={28} className="text-white" />
          </div>
        )}
      </div>
      
      {/* --- NAVIGATION MENU --- */}
      <nav className="flex flex-col gap-4 px-4 py-6 flex-1">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {/* Tampilkan judul grup hanya jika sidebar terbuka */}
            {group.title && isOpen && (
              <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest px-2 mb-2 mt-2 whitespace-nowrap">
                {group.title}
              </span>
            )}
            
            {/* Beri jarak sedikit jika sidebar tertutup dan ada pergantian grup */}
            {group.title && !isOpen && <div className="h-4"></div>}
            
            {group.items.map((link) => {
              const href = withLocale(pathname, link.href);
              const isActive = checkIsActive(link.href);
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={href}
                  title={!isOpen ? link.label : ""}
                  className={clsx(
                    "flex items-center rounded-xl transition-all duration-300 text-sm font-medium overflow-hidden",
                    isOpen ? "px-4 py-3 gap-4" : "justify-center p-3",
                    isActive
                      ? "bg-white text-[#1a56db] font-bold shadow-md transform scale-[1.02]"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={clsx("shrink-0", isOpen ? "h-5 w-5" : "h-6 w-6", isActive ? "text-[#1a56db]" : "text-blue-200")} />
                  {isOpen && <span className="whitespace-nowrap">{link.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* --- FOOTER / BOTTOM ACTION --- */}
      <div className="p-4 mt-auto space-y-3 border-t border-white/10">
        <Link 
          href={withLocale(pathname, "/")} 
          target="_blank"
          title={!isOpen ? "View Live Website" : ""}
          className={clsx(
            "flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white rounded-xl transition shadow-sm border border-blue-700",
            isOpen ? "px-4 py-3 gap-2 w-full text-sm font-medium" : "p-3"
          )}
        >
          <ExternalLink size={isOpen ? 16 : 20} className="shrink-0" />
          {isOpen && <span className="whitespace-nowrap">View Live Page</span>}
        </Link>
        
        <button 
          onClick={handleLogout}
          title={!isOpen ? "Sign Out" : ""}
          className={clsx(
            "flex items-center justify-center hover:bg-red-500 hover:text-white text-blue-100 rounded-xl transition-all",
            isOpen ? "px-4 py-3 gap-2 w-full text-sm font-bold" : "p-3"
          )}
        >
          <LogOut size={isOpen ? 16 : 20} className="shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Sign Out</span>}
        </button>

        {isOpen && (
          <div className="text-center text-[10px] text-blue-300 pt-2 font-medium whitespace-nowrap">
            © 2026 Cleo Hotels v2.0
          </div>
        )}
      </div>
    </aside>
  );
}
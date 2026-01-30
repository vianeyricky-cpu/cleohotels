"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Hotel, BedDouble, Sparkles } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/hotels", label: "Hotels", icon: Hotel },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/facilities", label: "Facilities", icon: Sparkles },
];

function withLocale(pathname: string | null, href: string) {
  if (!pathname) return href;
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  return `/${locale}${href}`;
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col gap-6 bg-navy-900 px-6 py-8 text-white">
      <div className="text-lg font-semibold text-gold-400">Cleo Admin</div>
      <nav className="flex flex-col gap-2 text-sm">
        {links.map((link) => {
          const href = withLocale(pathname, link.href);
          const isActive = pathname?.endsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition",
                isActive
                  ? "bg-white/10 text-gold-400"
                  : "text-white/70 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto text-xs text-white/50">
        © 2026 Cleo Hotels
      </div>
    </aside>
  );
}

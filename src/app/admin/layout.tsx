import "../[locale]/globals.css";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: 'Admin Dashboard - Cleo Hotels',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-theme min-h-screen bg-slate-50 text-slate-900"><AdminShell>{children}</AdminShell></div>
  );
}
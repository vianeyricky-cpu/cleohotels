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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased min-h-screen" suppressHydrationWarning>
        <AdminShell>
           {children}
        </AdminShell>
      </body>
    </html>
  );
}
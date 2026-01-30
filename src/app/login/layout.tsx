import { Inter } from "next/font/google";
// CSS sudah di-load di RootLayout utama, jadi di sini opsional, 
// tapi jika error css hilang, biarkan import ini:
import "../[locale]/globals.css"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Admin Login - Cleo Hotels',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className={`${inter.className} min-h-screen bg-navy-950 text-gray-900`}>
      {children}
    </div>
  );
}
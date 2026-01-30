import { ReactNode } from 'react';
import "./[locale]/globals.css"; // Pastikan path css ini benar

export const metadata = {
  title: 'Cleo Hotels',
  description: 'Welcome to Cleo Hotels',
};

// Layout Utama ini WAJIB ada untuk membungkus src/app/page.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/components/ClientProvider";

export const metadata: Metadata = {
  generator: "v0.app",
  title: "CashCraft",
  description: "Manage your money smartly with CashCraft",
};

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      {children}
    </ClientProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('cashcraft_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                const lang = localStorage.getItem('cashcraft_language');
                if (lang === 'ar') {
                  document.documentElement.dir = 'rtl';
                  document.documentElement.lang = 'ar';
                } else {
                  document.documentElement.dir = 'ltr';
                  document.documentElement.lang = 'en';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-cairo antialiased" suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

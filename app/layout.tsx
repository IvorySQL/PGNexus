import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PGNexus - News & Email Summary",
  description: "Manage and view RSS feeds, email feeds, and news summaries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 min-h-screen`}>
        <SessionProvider>
          <LanguageProvider>
            <DashboardNav />
            {children}
            <Footer />
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

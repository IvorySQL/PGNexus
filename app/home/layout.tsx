import { HomeBanner } from "@/components/home/HomeBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Full Width Banner */}
      <HomeBanner />

      <div className="container mx-auto max-w-7xl px-4">
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

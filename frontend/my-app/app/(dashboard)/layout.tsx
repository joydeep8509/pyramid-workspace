// app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-[#09090b]">
        {children}
      </main>
    </div>
  );
}
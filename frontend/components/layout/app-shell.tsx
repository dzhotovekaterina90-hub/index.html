import Sidebar from '@/components/layout/sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-10">{children}</main>
    </div>
  );
}

import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || 'TRADER';

  return (
    <div className="relative min-h-screen bg-ink">
      <Sidebar user={session?.user} />
      <TopNavbar />
      <main className="ml-60 pt-16 min-h-screen p-6 flex flex-col gap-4">
        {children}
      </main>
    </div>
  );
}

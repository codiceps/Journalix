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
      <main className="lg:ml-60 px-4 pt-24 pb-20 lg:px-6 lg:pt-24 lg:pb-6 min-h-screen flex flex-col gap-4">
        {children}
      </main>
    </div>
  );
}

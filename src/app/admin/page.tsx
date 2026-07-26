import prisma from '@/lib/prisma';
import MetricCard from '@/app/components/MetricCard';
import AdminMemberTable from '@/app/components/AdminMemberTable';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
  const pendingCount = users.filter((u) => u.status === 'PENDING').length;
  const rejectedCount = users.filter((u) => u.status === 'REJECTED').length;

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Total Active"
          value={activeCount.toString()}
          subtitle="Users with access"
          icon="check_circle"
        />
        <MetricCard
          title="Total Pending"
          value={pendingCount.toString()}
          subtitle="Awaiting approval"
          icon="pending_actions"
        />
        <MetricCard
          title="Total Rejected"
          value={rejectedCount.toString()}
          subtitle="Banned / Rejected"
          icon="cancel"
        />
      </div>

      <div className="bg-ink-light rounded-xl border border-ink-border overflow-hidden">
        <div className="p-6 border-b border-ink-border">
          <h2 className="text-xl font-bold text-slate-50">Community Members</h2>
          <p className="text-sm text-slate-400 mt-1">Manage user access and roles.</p>
        </div>
        <AdminMemberTable users={users} />
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

export default function AdminMemberTable({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [resetPasswordData, setResetPasswordData] = useState<{ email: string, newPassword: string } | null>(null);
  const [confirmResetUser, setConfirmResetUser] = useState<{ id: string, email: string } | null>(null);
  const router = useRouter();

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    if (loadingId) return;
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update user status');
        return;
      }
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      router.refresh(); // refresh server component stats
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoadingId(null);
    }
  };

  const executeResetPassword = async () => {
    if (!confirmResetUser || loadingId) return;
    
    const { id: userId, email } = confirmResetUser;
    setLoadingId(userId + '_reset');
    setConfirmResetUser(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to reset password');
        return;
      }
      
      setResetPasswordData({
        email,
        newPassword: data.newPassword
      });
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().replace('T', ' ').substring(0, 10);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-ink-light/50 border-b border-ink-border">
            <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Name</th>
            <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Email</th>
            <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Role</th>
            <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Status</th>
            <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Joined</th>
            <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="font-mono text-sm">
          {users.map((user) => {
            const isPending = user.status === 'PENDING';
            const isActive = user.status === 'ACTIVE';
            const isRejected = user.status === 'REJECTED';
            const isAdmin = user.role === 'ADMIN';

            return (
              <tr key={user.id} className="border-b border-ink-border/50 hover:bg-ink-light/50 transition-colors">
                <td className="py-3 px-4 text-slate-50 font-semibold">{user.name || '-'}</td>
                <td className="py-3 px-4 text-slate-400">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${isAdmin ? 'bg-info/10 text-info border-info/20' : 'bg-slate-700/50 text-slate-300 border-slate-600/50'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${isActive ? 'bg-profit/10 text-profit-text border-profit/20' : isRejected ? 'bg-loss/10 text-loss-text border-loss/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500">{formatDate(user.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    {(isPending || isRejected) && !isAdmin && (
                      <button 
                        onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}
                        disabled={loadingId === user.id}
                        className="px-3 py-1 bg-profit/10 hover:bg-profit/20 text-profit-text border border-profit/20 rounded transition-colors text-xs disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {(isPending || isActive) && !isAdmin && (
                      <button 
                        onClick={() => handleUpdateStatus(user.id, 'REJECTED')}
                        disabled={loadingId === user.id || loadingId === user.id + '_reset'}
                        className="px-3 py-1 bg-loss/10 hover:bg-loss/20 text-loss-text border border-loss/20 rounded transition-colors text-xs disabled:opacity-50"
                      >
                        {isActive ? 'Nonaktifkan' : 'Reject'}
                      </button>
                    )}
                    {!isAdmin && (
                      <button 
                        onClick={() => setConfirmResetUser({ id: user.id, email: user.email })}
                        disabled={loadingId === user.id || loadingId === user.id + '_reset'}
                        className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded transition-colors text-xs disabled:opacity-50"
                      >
                        Reset Sandi
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-slate-400">Belum ada anggota.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Konfirmasi Reset Password */}
      {confirmResetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface border border-outline-variant p-6 rounded-2xl shadow-xl max-w-sm w-full relative">
            <h3 className="text-xl font-bold text-on-surface mb-2">Konfirmasi Reset</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Anda yakin ingin me-reset password untuk pengguna <strong className="text-on-surface">{confirmResetUser.email}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-medium rounded-lg transition-colors btn-interactive"
                onClick={() => setConfirmResetUser(null)}
                disabled={loadingId !== null}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors btn-interactive"
                onClick={executeResetPassword}
                disabled={loadingId !== null}
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hasil Reset Password */}
      {resetPasswordData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface border border-outline-variant p-6 rounded-2xl shadow-xl max-w-md w-full relative">
            <h3 className="text-xl font-bold text-profit-text mb-2">Password Berhasil Direset!</h3>
            <p className="text-body-sm text-on-surface-variant mb-4">
              Password baru untuk user <strong>{resetPasswordData.email}</strong> adalah:
            </p>
            
            <div className="flex items-center justify-between bg-surface-container border border-outline-variant p-3 rounded-lg mb-4">
              <code className="text-lg font-mono text-primary font-bold">
                {resetPasswordData.newPassword}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resetPasswordData.newPassword);
                  alert('Password disalin ke clipboard!');
                }}
                className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded text-sm font-medium transition-colors btn-interactive"
              >
                Copy
              </button>
            </div>

            <div className="p-3 mb-6 bg-loss/10 border border-loss/20 rounded-lg">
              <p className="text-xs text-loss-text font-medium leading-relaxed">
                ⚠️ PERINGATAN EKSPLISIT: Password ini HANYA ditampilkan SEKALI ini saja dan TIDAK BISA dilihat lagi setelah modal ini ditutup. Pastikan Anda telah menyalin dan menyampaikannya ke user sebelum menutup jendela ini!
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-outline-variant hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors btn-interactive"
                onClick={() => setResetPasswordData(null)}
              >
                Saya Sudah Menyalinnya (Tutup)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

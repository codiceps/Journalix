'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '../../components/PasswordInput';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat pendaftaran.');
      }

      setSuccess('Pendaftaran berhasil, menunggu persetujuan Admin. Mengarahkan ke halaman masuk...');

      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan yang tidak terduga.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-dim/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
      <h2 className="text-headline-md text-on-surface font-bold mb-2">Daftar Akun</h2>
      <p className="text-body-sm text-on-surface-variant mb-8">
        Bergabung dengan Journalix hari ini.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg">
            <p className="text-body-sm text-error font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-3 bg-primary-container/30 border border-primary/50 rounded-lg">
            <p className="text-body-sm text-primary font-medium">{success}</p>
          </div>
        )}

        <div>
          <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
            Nama Lengkap
          </label>
          <input
            className="w-full px-4 py-3 bg-surface-container-low/30 border border-white/10 rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all backdrop-blur-md"
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
            Alamat Email
          </label>
          <input
            className="w-full px-4 py-3 bg-surface-container-low/30 border border-white/10 rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all backdrop-blur-md"
            placeholder="nama@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
            Kata Sandi
          </label>
          <PasswordInput
            className="w-full pl-4 pr-12 py-3 bg-surface-container-low/30 border border-white/10 rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all backdrop-blur-md"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <button
          className="w-full py-3.5 mt-4 bg-emerald-500 text-on-primary font-semibold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 btn-interactive"
          type="submit"
          disabled={loading || !!success}
        >
          {loading ? 'Memproses...' : 'Daftar sekarang'}
        </button>
      </form>

      <p className="text-center text-body-sm text-on-surface-variant mt-8">
        Sudah punya akun?{' '}
        <Link
          className="text-primary font-medium inline-block btn-interactive hover:text-primary-fixed"
          href="/login"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}

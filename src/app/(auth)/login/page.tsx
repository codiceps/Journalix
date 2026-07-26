'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '../../components/PasswordInput';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Set cookie for route handler to read maxAge (expires in 10 mins so it doesn't pollute)
    document.cookie = `rememberMe=${rememberMe}; path=/; max-age=600`;

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh(); // Refresh to apply session across server components
      }
    } catch (err) {
      setError('Terjadi kesalahan yang tidak terduga.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-dim/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
      <h2 className="text-headline-md text-on-surface font-bold mb-2">Masuk</h2>
      <p className="text-body-sm text-on-surface-variant mb-8">
        Silakan masuk ke akun Anda untuk melanjutkan.
      </p>



      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg">
            <p className="text-body-sm text-error font-medium">{error}</p>
          </div>
        )}
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              className="rounded bg-surface-container-low/50 border-white/20 text-primary focus:ring-primary/50 focus:ring-offset-0"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Ingat saya
            </span>
          </label>
          <button
            type="button"
            className="text-body-sm text-primary hover:text-primary-fixed transition-colors font-medium inline-block btn-interactive"
            onClick={() => setShowForgotModal(true)}
          >
            Lupa sandi?
          </button>
        </div>
        <button
          className="w-full py-3.5 mt-4 bg-emerald-500 text-on-primary font-semibold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 btn-interactive"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="text-center text-body-sm text-on-surface-variant mt-8">
        Belum punya akun?{' '}
        <Link
          className="text-primary font-medium inline-block btn-interactive hover:text-primary-fixed"
          href="/register"
        >
          Daftar sekarang
        </Link>
      </p>

      {/* Modal Lupa Sandi */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/100 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface border border-outline-variant p-6 rounded-2xl shadow-xl max-w-sm w-full relative">
            <h3 className="text-xl font-bold text-on-surface mb-2">Lupa Sandi?</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Hubungi Admin komunitas untuk mendapatkan password baru Anda. (Reset mandiri tidak tersedia)
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-primary text-on-primary font-medium rounded-lg btn-interactive"
                onClick={() => setShowForgotModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

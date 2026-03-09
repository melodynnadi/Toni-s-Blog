'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { BLOG_NAME } from '@/lib/constants';
import { FiLock } from 'react-icons/fi';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-pink-light/50 flex items-center justify-center mx-auto mb-4">
            <FiLock className="text-pink-primary" size={24} />
          </div>
          <h1
            className="text-2xl font-bold text-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Admin Login
          </h1>
          <p className="text-sm text-text-light mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Sign in to manage {BLOG_NAME}
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-sm border border-pink-light/30 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-light mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-pink-light bg-pink-bg/30 text-sm focus:outline-none focus:border-pink-primary focus:ring-2 focus:ring-pink-light transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-pink-light bg-pink-bg/30 text-sm focus:outline-none focus:border-pink-primary focus:ring-2 focus:ring-pink-light transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-primary text-white rounded-full text-sm font-medium hover:bg-pink-accent transition-all duration-300 disabled:opacity-50 shadow-md"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from '@/components/Logo';
import { login } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        toast.error('This account is not allowed to access the admin panel.');
        setLoading(false);
        return;
      }
      toast.success(`Welcome, ${user.fullName ?? user.email}`);
      router.push(next);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : 'Sign in failed. Please try again.';
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', padding: '2rem' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="card"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '2.25rem 2rem',
          background: '#ffffff',
          boxShadow: '0 10px 40px rgba(10, 22, 51, 0.08), 0 2px 8px rgba(10, 22, 51, 0.04)',
          border: '1px solid #eef0f3',
          borderRadius: 16,
        }}
      >
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            <Logo size="lg" />
          </motion.div>
          <div className="mt-3" style={{ color: 'var(--brand-text-muted)', fontSize: '0.85rem' }}>
            Sign in to your admin account
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="position-relative">
              <i
                className="bi bi-envelope position-absolute"
                style={{
                  top: '50%',
                  left: 14,
                  transform: 'translateY(-50%)',
                  color: 'var(--brand-text-muted)',
                }}
              />
              <input
                type="email"
                className="form-control"
                placeholder="admin@moviai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: 42 }}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <i
                className="bi bi-lock position-absolute"
                style={{
                  top: '50%',
                  left: 14,
                  transform: 'translateY(-50%)',
                  color: 'var(--brand-text-muted)',
                }}
              />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: 42 }}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label
                className="form-check-label"
                htmlFor="rememberMe"
                style={{ fontSize: '0.875rem', color: 'var(--brand-text-muted)' }}
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              style={{
                fontSize: '0.875rem',
                color: 'var(--brand-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Forgot password?
            </a>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            style={{ padding: '0.65rem', fontSize: '0.9rem' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <i className="bi bi-arrow-right ms-2" />
              </>
            )}
          </motion.button>
        </form>

        <div
          className="text-center mt-4"
          style={{ fontSize: '0.72rem', color: 'var(--brand-text-muted)' }}
        >
          MoviAI Admin · v0.1.0 · {new Date().getFullYear()}
        </div>
      </motion.div>
    </div>
  );
}

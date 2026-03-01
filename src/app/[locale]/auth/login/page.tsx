'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/components/common/card';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { Spinner } from '@/ui/components/common/spinner';
import { FloatingOrbs } from '@/ui/components/common/floating-orbs';
import { Link } from '@/i18n/navigation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field === 'email') fieldErrors.email = t('validation.emailInvalid');
        if (field === 'password') fieldErrors.password = t('validation.passwordMin');
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { getAuthAdapter } = await import('@/infra/providers/repositories');
      await getAuthAdapter().signInWithEmail(email, password);
      router.push('/dashboard/overview');
    } catch {
      setErrors({ email: t('common.error') });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const { getAuthAdapter } = await import('@/infra/providers/repositories');
      await getAuthAdapter().signInWithGoogle();
      router.push('/dashboard/overview');
    } catch {
      setErrors({ email: t('common.error') });
    } finally {
      setLoading(false);
    }
  }

  function handleDemoLogin() {
    router.push('/dashboard/overview');
  }

  return (
    <PageTransition>
      <main className="flex min-h-screen items-center justify-center p-6 hero-gradient noise-overlay">
        <FloatingOrbs />
        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Demo access card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={handleDemoLogin}
              className="w-full group relative rounded-2xl p-5 overflow-hidden cursor-pointer
                bg-emerald-500/8 border border-emerald-500/20
                hover:border-emerald-500/40 hover:bg-emerald-500/12 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/15">
                  <Zap className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-emerald-400 font-display">Demo Account</p>
                  <p className="text-xs text-emerald-400/60 mt-0.5">
                    Explore the full dashboard instantly — no sign-up needed
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[hsl(var(--background))] px-4 text-zinc-600 font-medium">or sign in</span>
            </div>
          </div>

          {/* Login card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="w-full" glass glow>
              <CardHeader>
                <CardTitle className="text-center text-2xl font-display">{t('auth.login')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label={t('auth.email')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    placeholder="tu@email.com"
                  />
                  <Input
                    label={t('auth.password')}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                  />
                  <Button type="submit" variant="cta" size="lg" className="w-full rounded-xl" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : t('auth.login')}
                  </Button>
                </form>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.06]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900/80 px-3 text-zinc-600">o</span>
                  </div>
                </div>
                <Button variant="outline" size="lg" className="w-full rounded-xl" onClick={handleGoogleLogin} disabled={loading}>
                  {t('auth.loginWithGoogle')}
                </Button>
                <p className="mt-5 text-center text-sm text-muted-foreground">
                  {t('auth.noAccount')}{' '}
                  <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    {t('auth.register')}
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}

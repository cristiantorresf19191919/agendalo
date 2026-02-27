'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
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
      // Auth will be wired via providers
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

  return (
    <PageTransition>
      <main className="flex min-h-screen items-center justify-center p-6 mesh-gradient">
        <FloatingOrbs />
        <Card className="relative z-10 w-full max-w-md" glass glow>
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t('auth.login')}</CardTitle>
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner size="sm" /> : t('auth.login')}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">o</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
              {t('auth.loginWithGoogle')}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t('auth.noAccount')}{' '}
              <Link href="/auth/register" className="text-emerald-500 hover:underline">
                {t('auth.register')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  );
}

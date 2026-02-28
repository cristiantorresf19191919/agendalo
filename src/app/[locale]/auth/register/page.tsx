'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Store, UserRound } from 'lucide-react';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/components/common/card';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { Spinner } from '@/ui/components/common/spinner';
import { FloatingOrbs } from '@/ui/components/common/floating-orbs';
import { Link } from '@/i18n/navigation';
import { staggerContainer, staggerItem, tapScale } from '@/ui/animations/variants';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type Role = 'business' | 'customer' | null;

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function selectRole(selectedRole: 'business' | 'customer') {
    setRole(selectedRole);
    setStep('form');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field === 'name') fieldErrors.name = t('validation.nameRequired');
        if (field === 'email') fieldErrors.email = t('validation.emailInvalid');
        if (field === 'password') fieldErrors.password = t('validation.passwordMin');
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { getAuthAdapter } = await import('@/infra/providers/repositories');
      const authAdapter = getAuthAdapter();
      const user = await authAdapter.signUpWithEmail(email, password, name);
      await authAdapter.setUserRole(user.uid, role!);
      router.push(role === 'business' ? '/dashboard/overview' : '/booking/services');
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
        {step === 'role' ? (
          <div className="relative z-10 w-full max-w-lg space-y-6 text-center">
            <h2 className="text-2xl font-bold">{t('auth.selectRole')}</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              <motion.div variants={staggerItem}>
                <Card
                  interactive
                  glass
                  glow
                  className="text-center py-8"
                  onClick={() => selectRole('business')}
                  whileTap={tapScale}
                >
                  <Store className="h-10 w-10 mx-auto text-emerald-500 mb-3" />
                  <h3 className="font-semibold">{t('auth.businessRole')}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t('auth.businessRoleDesc')}</p>
                </Card>
              </motion.div>
              <motion.div variants={staggerItem}>
                <Card
                  interactive
                  glass
                  glow
                  className="text-center py-8"
                  onClick={() => selectRole('customer')}
                  whileTap={tapScale}
                >
                  <UserRound className="h-10 w-10 mx-auto text-emerald-500 mb-3" />
                  <h3 className="font-semibold">{t('auth.customerRole')}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t('auth.customerRoleDesc')}</p>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <Card className="relative z-10 w-full max-w-md" glass glow>
            <CardHeader>
              <CardTitle className="text-center text-2xl">{t('auth.register')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('auth.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
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
                <Button type="submit" variant="cta" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : t('auth.register')}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {t('auth.hasAccount')}{' '}
                <Link href="/auth/login" className="text-emerald-500 hover:underline">
                  {t('auth.login')}
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </PageTransition>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FileText, CheckCircle, XCircle, Clock, DollarSign, Send, Building2, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockInvoices = [
  { id: '1', number: 'FE-001-0045', customer: 'María García', nit: '1234567890-1', amount: 35_000, iva: 6_650, total: 41_650, status: 'accepted', date: '2026-02-28', cufe: 'a1b2c3d4e5...' },
  { id: '2', number: 'FE-001-0044', customer: 'Carlos Rodríguez', nit: '9876543210-5', amount: 55_000, iva: 10_450, total: 65_450, status: 'accepted', date: '2026-02-27', cufe: 'f6g7h8i9j0...' },
  { id: '3', number: 'FE-001-0043', customer: 'Laura Díaz', nit: '5555555555-3', amount: 120_000, iva: 22_800, total: 142_800, status: 'issued', date: '2026-02-26', cufe: 'k1l2m3n4o5...' },
  { id: '4', number: 'FE-001-0042', customer: 'Pedro Sánchez', nit: '1111111111-7', amount: 45_000, iva: 8_550, total: 53_550, status: 'rejected', date: '2026-02-25', cufe: 'p6q7r8s9t0...' },
];

const statusConfig = {
  issued: { label: 'Emitida', color: 'text-blue-400 bg-blue-500/10', icon: Clock },
  accepted: { label: 'Aceptada DIAN', color: 'text-emerald-400 bg-emerald-500/10', icon: CheckCircle },
  rejected: { label: 'Rechazada DIAN', color: 'text-rose-400 bg-rose-500/10', icon: XCircle },
};

function formatCOP(n: number) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }

export default function InvoicingPage() {
  const t = useTranslations('invoicing');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div><h1 className="text-2xl font-bold">{t('title')}</h1><p className="text-sm text-muted-foreground mt-1">Cumplimiento DIAN — Facturación electrónica</p></div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Facturas emitidas" value={45} icon={FileText} />
        <StatCard title="Aceptadas DIAN" value={42} icon={CheckCircle} />
        <StatCard title="IVA recaudado" value={formatCOP(1_245_000)} icon={DollarSign} />
        <StatCard title="Total facturado" value={formatCOP(7_800_000)} icon={DollarSign} />
      </motion.div>

      {/* DIAN config */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold mb-4">Configuración DIAN</h3>
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-muted/20 border border-white/[0.03]">
            <Building2 className="h-5 w-5 text-emerald-400 mb-2" />
            <p className="text-xs text-muted-foreground">{t('nit')}</p>
            <p className="text-sm font-semibold">900.123.456-7</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/[0.03]">
            <Hash className="h-5 w-5 text-emerald-400 mb-2" />
            <p className="text-xs text-muted-foreground">{t('dianResolution')}</p>
            <p className="text-sm font-semibold">18764002345678</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/[0.03]">
            <FileText className="h-5 w-5 text-emerald-400 mb-2" />
            <p className="text-xs text-muted-foreground">{t('prefix')}</p>
            <p className="text-sm font-semibold">FE-001</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/[0.03]">
            <DollarSign className="h-5 w-5 text-emerald-400 mb-2" />
            <p className="text-xs text-muted-foreground">{t('taxRegime')}</p>
            <p className="text-sm font-semibold">{t('common')}</p>
          </div>
        </div>
      </motion.div>

      {/* Invoices */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold mb-4">Facturas recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-zinc-800">
                <th className="pb-2 pr-4">N°</th>
                <th className="pb-2 pr-4">Cliente</th>
                <th className="pb-2 pr-4">{t('subtotal')}</th>
                <th className="pb-2 pr-4">{t('iva')}</th>
                <th className="pb-2 pr-4">{t('total')}</th>
                <th className="pb-2 pr-4">Estado</th>
                <th className="pb-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((inv) => {
                const sc = statusConfig[inv.status as keyof typeof statusConfig];
                return (
                  <tr key={inv.id} className="border-b border-zinc-800/50 last:border-0">
                    <td className="py-3 pr-4 font-mono text-xs">{inv.number}</td>
                    <td className="py-3 pr-4"><div><p className="font-medium">{inv.customer}</p><p className="text-xs text-muted-foreground">NIT: {inv.nit}</p></div></td>
                    <td className="py-3 pr-4">{formatCOP(inv.amount)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatCOP(inv.iva)}</td>
                    <td className="py-3 pr-4 font-semibold">{formatCOP(inv.total)}</td>
                    <td className="py-3 pr-4"><span className={cn('px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1', sc.color)}><sc.icon className="h-3 w-3" />{sc.label}</span></td>
                    <td className="py-3 text-muted-foreground text-xs">{inv.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PageTransition>
  );
}

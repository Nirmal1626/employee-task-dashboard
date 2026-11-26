import Link from 'next/link';
import type { ReactNode } from 'react';

export function AppChrome({
  kind,
  children,
}: {
  kind: 'crm' | 'helpdesk';
  children: ReactNode;
}) {
  const crm = kind === 'crm';
  return (
    <div className="min-h-screen bg-white">
      <header className={crm ? 'bg-[#0b1f3a] text-white' : 'bg-[#0f3d38] text-white'}>
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              {crm ? 'Sales system' : 'Support system'}
            </p>
            <p className="text-lg font-semibold">{crm ? 'Northwind CRM' : 'Lumen Helpdesk'}</p>
          </div>
          <Link className="text-sm font-semibold text-white/80" href="/">Back to dashboard</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}

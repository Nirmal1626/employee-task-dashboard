import Link from 'next/link';
import type { ReactNode } from 'react';

export function AppChrome({
  kind,
  children,
}: {
  kind: 'crm' | 'helpdesk';
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" href="/" aria-label="Workboard home">
            <span className="brand-mark" aria-hidden="true">w</span>
            <span>workboard</span>
          </Link>
          <nav className="primary-nav" aria-label="Main navigation">
            <Link className="nav-link" href="/">Overview</Link>
            <Link className={`nav-link${kind === 'crm' ? ' nav-link-active' : ''}`} href="/crm">CRM</Link>
            <Link className={`nav-link${kind === 'helpdesk' ? ' nav-link-active' : ''}`} href="/helpdesk">Helpdesk</Link>
          </nav>
          <span className="header-note">Your team, in sync</span>
        </div>
      </header>
      <main className="chrome-main">{children}</main>
      <footer className="site-footer">
        <span>workboard</span>
        <span>A little more clarity, every day.</span>
      </footer>
    </div>
  );
}

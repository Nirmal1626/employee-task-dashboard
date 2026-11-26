import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Employee Task Dashboard',
  description: 'Prioritised tasks from the CRM and Helpdesk mock APIs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} font-sans`}>{children}</body>
    </html>
  );
}

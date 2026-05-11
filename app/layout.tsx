// Root layout — Server Component.
//
// Wires the three project fonts (Bebas Neue display, DM Sans body, Space
// Mono code) as CSS variables consumed by app/globals.css. Reads the theme
// + stack cookies so providers hydrate with the correct initial state and
// avoid a flash of wrong-theme content.

import './globals.css';

import { Bebas_Neue, DM_Sans, Space_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { Providers } from './providers';
import { Header } from '@/components/layout/header/Header';
import { Footer } from '@/components/layout/footer/Footer';
import { MobileNav } from '@/components/layout/mobile-nav/MobileNav';
import { StackBanner } from '@/components/layout/stack-banner/StackBanner';
import { SkipLink } from '@/components/layout/skip-link/SkipLink';
import type { ActiveStack } from '@/components/stack-context/StackProvider';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Vibe Coder Hub', template: '%s · Vibe Coder Hub' },
  description: 'Directory of AI coding tools, models, MCPs, components, skills, and more.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

function parseStackCookie(raw: string | undefined): ActiveStack | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as ActiveStack;
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed;
  } catch {
    return null;
  }
}

function parseTheme(raw: string | undefined): 'light' | 'dark' | 'system' {
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  return 'dark'; // Phase 1 default per R3
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const cookieStore = await cookies();
  const initialTheme = parseTheme(cookieStore.get('vch_theme')?.value);
  const initialStack = parseStackCookie(cookieStore.get('vch_stack')?.value);

  return (
    <html
      lang="en"
      className={`${bebas.variable} ${dmSans.variable} ${spaceMono.variable} dark`}
      suppressHydrationWarning
    >
      <body>
        <Providers initialTheme={initialTheme} initialStack={initialStack}>
          <SkipLink />
          <StackBanner />
          <Header />
          <main id="main" className="min-h-[calc(100vh-60px)] pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}

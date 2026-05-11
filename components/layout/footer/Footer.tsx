import * as React from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icons/Icon';
import { NewsletterSignup } from './NewsletterSignup';

interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Browse',
    links: [
      { label: 'Components', href: '/components' },
      { label: 'Models',     href: '/models' },
      { label: 'MCPs',       href: '/mcps' },
      { label: 'Tools',      href: '/tools' },
      { label: 'Skills',     href: '/skills' },
      { label: 'Subagents',  href: '/subagents' },
      { label: 'Workflows',  href: '/workflows' },
      { label: 'Stacks',     href: '/stacks' },
    ],
  },
  {
    heading: 'Discover',
    links: [
      { label: 'Best for',         href: '/best-for' },
      { label: 'Alternatives',     href: '/alternatives' },
      { label: 'Compare',          href: '/compare' },
      { label: 'Pricing tracker',  href: '/models?tab=pricing' },
      { label: 'Cost calculator',  href: '/tools/cost-calculator' },
    ],
  },
  {
    heading: 'Money',
    links: [
      { label: 'Deals',          href: '/deals' },
      { label: 'News',           href: '/news' },
      { label: 'Guides',         href: '/guides' },
      { label: 'Newsletter',     href: '/newsletter' },
      { label: 'Pricing',        href: '/pricing' },
      { label: 'Pro membership', href: '/pro' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Submit',    href: '/submit' },
      { label: 'API keys',  href: '/settings/api' },
      { label: 'Settings',  href: '/settings' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',     href: '/about' },
      { label: 'Manifesto', href: '/manifesto' },
      { label: 'Contact',   href: '/contact' },
      { label: 'Terms',     href: '/terms' },
      { label: 'Privacy',   href: '/privacy' },
      { label: 'Status',    href: '/status' },
    ],
  },
];

export function Footer(): React.ReactElement {
  return (
    <footer className="bg-[#0a0a0a] border-t border-surface px-4 md:px-8 py-16 mt-16">
      <div className="max-w-xl mx-auto">
        <div className="flex flex-wrap gap-12 mb-12">
          <div className="flex-none basis-[280px]">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-sm bg-mint text-black font-display text-[22px]"
                aria-hidden
              >
                V
              </span>
              <span className="font-display text-[28px] text-white">
                VIBE CODER HUB
              </span>
            </Link>
            <p className="text-text-secondary text-[13px] leading-[1.6] mb-4">
              The directory and SaaS layer for the vibe-coding ecosystem.
            </p>
            <div className="mb-4">
              <div className="font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-mint mb-2">
                VCH Weekly
              </div>
              <NewsletterSignup />
            </div>
            <div className="flex items-center gap-3 text-white">
              <Link href="https://github.com" aria-label="GitHub" className="hover:text-mint">
                <Icon.Github size={16} />
              </Link>
              <Link href="/rss" aria-label="RSS feeds" className="hover:text-mint">
                <Icon.Rss size={16} />
              </Link>
              <Link href="/newsletter" aria-label="Newsletter" className="hover:text-mint">
                <Icon.External size={16} />
              </Link>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading} className="min-w-[130px]">
              <div className="font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-mint mb-4">
                {col.heading}
              </div>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[13px] text-[#cfcfcf] hover:text-link-hover">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hairline-t pt-6 flex items-center justify-between flex-wrap gap-3">
          <span className="text-text-secondary text-[12px]">
            © {new Date().getFullYear()} Vibe Coder Hub, Inc. Made by vibe coders.
          </span>
          <span className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary">
            v0.1 · private alpha
          </span>
        </div>
      </div>
    </footer>
  );
}

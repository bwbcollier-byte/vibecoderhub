'use client';

// Client wrapper for /dashboard.
//
// The Server Component handles auth + username extraction; this layer
// owns the interactive pieces (stack card reads useStack(), buttons
// call useOverlays().openStackPicker()).

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/icons/Icon';
import { useOverlays } from '@/components/overlays/OverlaysProvider';
import { useStack } from '@/components/stack-context/StackProvider';

interface DashboardClientProps {
  username: string;
}

interface ChangeRow {
  kicker: string;
  title: string;
  href: string;
}

const CHANGES: ChangeRow[] = [
  {
    kicker: 'PRICE DROP · Claude Opus 4.7 · 30% off',
    title: 'Anthropic cut Opus 4.7 input pricing',
    href: '/models/claude-opus-4-7',
  },
  {
    kicker: 'NEW RELEASE · Gemini 3.1 Pro',
    title: 'Google ships Gemini 3.1 Pro with longer context',
    href: '/models/gemini-3-1-pro',
  },
  {
    kicker: 'MCP UPDATED · GitHub MCP v2.0.1',
    title: 'GitHub MCP v2.0.1 — bug fixes + new tools',
    href: '/mcps/github',
  },
];

export function DashboardClient({ username }: DashboardClientProps): React.ReactElement {
  const { stack } = useStack();
  const { openStackPicker } = useOverlays();

  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="mb-10">
        <div className="font-mono font-bold uppercase tracking-[1.5px] text-mint text-[11px] mb-3">
          DASHBOARD · @{username}
        </div>
        <h1 className="font-display text-[clamp(48px,8vw,72px)] leading-[0.95] text-white">
          Welcome back.
        </h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* Your stack */}
        <article className="border border-mint bg-mint/[0.04] rounded-tile p-6 flex flex-col">
          <div className="font-mono font-bold uppercase tracking-[1.5px] text-mint text-[10px] mb-3">
            YOUR STACK
          </div>
          {stack && stack.label ? (
            <>
              <p className="text-white text-[15px] leading-[1.4] mb-5 flex-1">
                {stack.label}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={openStackPicker}
                aria-label="Edit stack"
              >
                Edit stack <Icon.ArrowRight size={12} />
              </Button>
            </>
          ) : (
            <>
              <p className="text-text-secondary text-[14px] leading-[1.5] mb-5 flex-1">
                Pick your AI clients + tech stack so we can tune
                recommendations.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={openStackPicker}
              >
                Set your stack
              </Button>
            </>
          )}
        </article>

        {/* Recent bookmarks */}
        <article className="border border-surface rounded-tile p-6 flex flex-col">
          <div className="font-mono font-bold uppercase tracking-[1.5px] text-mint text-[10px] mb-3">
            RECENT BOOKMARKS
          </div>
          <EmptyState
            glyph="☆"
            title="No bookmarks yet"
            body="Your bookmarks will appear here. Persistence ships in Slice 5."
            className="py-6 px-0 flex-1"
          />
        </article>

        {/* What's changed */}
        <article className="border border-surface rounded-tile p-6 flex flex-col">
          <div className="font-mono font-bold uppercase tracking-[1.5px] text-mint text-[10px] mb-4">
            WHAT&apos;S CHANGED
          </div>
          <ul className="flex flex-col gap-4">
            {CHANGES.map((row) => (
              <li key={row.kicker}>
                <Link
                  href={row.href}
                  className="block group"
                >
                  <div className="font-mono font-bold uppercase tracking-[1.5px] text-mint text-[10px] mb-1 group-hover:text-white transition-colors">
                    {row.kicker}
                  </div>
                  <div className="text-white text-[13px] leading-[1.4] group-hover:text-mint transition-colors">
                    {row.title}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mb-12">
        <div className="font-mono font-bold uppercase tracking-[1.5px] text-text-secondary text-[10px] mb-4">
          QUICK ACTIONS
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/submit">
            <Button variant="primary" size="md">
              Submit a resource
            </Button>
          </Link>
          <Link href="/deals">
            <Button variant="secondary" size="md">
              Browse deals
            </Button>
          </Link>
          <Button variant="ghost" size="md" onClick={openStackPicker}>
            Update stack
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="md">
              Open settings
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="font-mono font-bold uppercase tracking-[1.5px] text-text-secondary text-[10px] mb-4">
          SAVED STACKS
        </div>
        <div className="border border-surface rounded-tile p-6">
          <EmptyState
            glyph="☰"
            title="No saved stacks yet"
            body="Save multiple stacks (work, side project, learning) and switch between them. Ships in Slice 5."
            className="py-6 px-0"
          />
        </div>
      </section>
    </main>
  );
}

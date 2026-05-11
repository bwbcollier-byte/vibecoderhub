import * as React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unsubscribed — Vibe Coder Hub',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function UnsubscribePage({ params }: Props): Promise<React.ReactElement> {
  const { token } = await params;
  // TODO Slice S24: lookup newsletter_subscribers by unsubscribe_token, set
  // unsubscribed_at = now(). Cookie-stub: just confirm in the UI.
  const valid = token.length >= 16 && /^[a-f0-9-]+$/i.test(token);

  return (
    <main className="min-h-[70vh] mx-auto max-w-prose px-4 py-24 text-center">
      <div className="mono-caps text-mint text-[11px] tracking-[2px] mb-4">
        Newsletter
      </div>
      <h1 className="font-display text-[56px] leading-[0.95] text-white mb-4">
        {valid ? 'Unsubscribed.' : 'Already gone.'}
      </h1>
      <p className="text-text-secondary text-[15px] leading-[1.6] mb-8">
        {valid
          ? "You're off the list. We won't email you again unless you re-subscribe."
          : "That unsubscribe link looks malformed — but rest assured, you're not on the list."}
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-mint text-black font-medium text-[14px] rounded-sm hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/news"
          className="inline-flex items-center px-5 py-2.5 border border-surface text-white text-[14px] rounded-sm hover:bg-surface"
        >
          Read the latest
        </Link>
      </div>
    </main>
  );
}

'use client';

import * as React from 'react';
import { toast } from 'sonner';

export function NewsletterSignup(): React.ReactElement {
  const [email, setEmail] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (pending || !email) return;
    setPending(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Couldn't subscribe — try again.");
        return;
      }
      setDone(true);
      toast.success("You're on the list.");
    } catch {
      toast.error('Network error — try again.');
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <p className="text-[12px] text-mint">
        ✓ Subscribed. Check your inbox to confirm.
      </p>
    );
  }

  return (
    <form onSubmit={(e) => { void onSubmit(e); }} className="flex gap-2 max-w-[320px]">
      <input
        type="email"
        required
        placeholder="you@vibecoding.dev"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={pending}
        className="flex-1 min-w-0 h-9 px-3 bg-black border border-surface rounded-sm text-[13px] text-white placeholder:text-text-secondary focus:outline-none focus:border-mint disabled:opacity-50"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-9 px-3 bg-mint text-black text-[12px] font-medium rounded-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {pending ? '…' : 'Subscribe'}
      </button>
    </form>
  );
}

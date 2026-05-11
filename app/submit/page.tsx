// /submit — resource submission wizard.
//
// Server Component: gates on auth() and renders the multi-step client wizard.

import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/server';

import { SubmitWizard } from './_components/SubmitWizard';

export const metadata = {
  title: 'Submit · Vibe Coder Hub',
};

export default async function SubmitPage(): Promise<React.ReactElement> {
  const session = await auth();
  if (!session) redirect('/?signin=1');

  return (
    <main className="max-w-prose mx-auto px-4 md:px-8 py-10 pb-20">
      <div className="mb-4 font-mono uppercase tracking-[1.5px] text-[11px] text-mint">
        SUBMIT
      </div>
      <h1 className="font-display text-[clamp(48px,7vw,88px)] leading-[0.95] mb-8">
        ADD A RESOURCE.
      </h1>
      <SubmitWizard />
    </main>
  );
}

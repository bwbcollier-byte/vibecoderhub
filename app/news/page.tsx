import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { listNews } from '@/lib/db/queries/news';

import { NewsList } from './_components/NewsList';

export const metadata = {
  title: 'News · Vibe Coder Hub',
  description:
    'Vibe-coding news, auto-generated and editorially curated. Breaking model price changes, IDE releases, ecosystem moves.',
};

export default async function NewsIndexPage(): Promise<ReactElement> {
  const items = await listNews();
  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint mb-3">
            NEWS · UPDATED EVERY 6H
          </p>
          <h1 className="font-display uppercase leading-[0.92] tracking-[0.5px] text-[clamp(56px,9vw,112px)]">
            What&rsquo;s new.
          </h1>
        </div>
        <div className="flex gap-2">
          <a href="/news/feed.rss">
            <Button variant="secondary" size="sm">
              <Icon.Rss size={14} className="mr-1" />
              RSS
            </Button>
          </a>
          <Button variant="primary" size="sm">
            Subscribe →
          </Button>
        </div>
      </header>

      <NewsList items={items} />
    </div>
  );
}

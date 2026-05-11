import * as React from 'react';
import { Hr, Link, Section, Text } from '@react-email/components';

import { EmailShell, styles } from './_shared';

export interface NewsletterItem {
  title: string;
  href: string;
  blurb: string;
  kind: 'model' | 'mcp' | 'deal' | 'guide' | 'news';
}

export interface NewsletterEmailProps {
  issue: number;
  date: string;
  intro: string;
  items: NewsletterItem[];
  unsubscribeUrl: string;
}

export function NewsletterEmail({
  issue,
  date,
  intro,
  items,
  unsubscribeUrl,
}: NewsletterEmailProps): React.ReactElement {
  return (
    <EmailShell preview={`VCH Weekly #${issue} — ${date}`}>
      <Text style={styles.h1}>VCH Weekly #{issue}</Text>
      <Text style={styles.muted}>{date}</Text>
      <Text style={styles.p}>{intro}</Text>
      <Hr style={{ borderColor: '#222', margin: '16px 0' }} />
      {items.map((item, i) => (
        <Section key={i} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: '#7fe7c4', margin: 0 }}>
            {item.kind}
          </Text>
          <Link href={item.href} style={{ fontSize: 16, color: '#ededed', fontWeight: 600 }}>
            {item.title}
          </Link>
          <Text style={styles.p}>{item.blurb}</Text>
        </Section>
      ))}
      <Hr style={{ borderColor: '#222', margin: '24px 0 8px' }} />
      <Text style={styles.muted}>
        Not for you any more?{' '}
        <Link href={unsubscribeUrl} style={{ color: '#9a9a9a', textDecoration: 'underline' }}>
          Unsubscribe in one click.
        </Link>
      </Text>
    </EmailShell>
  );
}

export default NewsletterEmail;

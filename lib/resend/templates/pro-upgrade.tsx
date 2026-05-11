import * as React from 'react';
import { Button, Section, Text } from '@react-email/components';

import { EmailShell, styles } from './_shared';

export interface ProUpgradeEmailProps {
  name?: string;
  manageUrl: string;
  trialEndsAt?: string;
}

export function ProUpgradeEmail({
  name,
  manageUrl,
  trialEndsAt,
}: ProUpgradeEmailProps): React.ReactElement {
  return (
    <EmailShell preview="You're on Vibe Coder Hub Pro. Here's what's unlocked.">
      <Text style={styles.h1}>Pro is live{name ? `, ${name}` : ''}.</Text>
      <Text style={styles.p}>
        Thanks for backing the project. $99/year, cancel any time from the Customer Portal.
      </Text>
      {trialEndsAt ? (
        <Text style={styles.muted}>
          Your trial ends {trialEndsAt}. Cancel before then to avoid the charge.
        </Text>
      ) : null}
      <Text style={styles.p}>What's unlocked now:</Text>
      <Text style={styles.p}>
        • Unlimited bookmarks across all 24 resource types<br />
        • Member-tier deal pricing (avg payback in 2-3 months)<br />
        • Pro-only stack picks + comparison
      </Text>
      <Section>
        <Button href={manageUrl} style={styles.cta}>
          Manage subscription
        </Button>
      </Section>
    </EmailShell>
  );
}

export default ProUpgradeEmail;

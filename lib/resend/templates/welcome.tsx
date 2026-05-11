import * as React from 'react';
import { Button, Section, Text } from '@react-email/components';

import { EmailShell, styles } from './_shared';

export interface WelcomeEmailProps {
  name?: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps): React.ReactElement {
  return (
    <EmailShell preview="Welcome to Vibe Coder Hub — set your stack to get personalised picks.">
      <Text style={styles.h1}>Welcome{name ? `, ${name}` : ''}.</Text>
      <Text style={styles.p}>
        You're in. Vibe Coder Hub is the directory and SaaS layer for the vibe-coding ecosystem —
        24 resource types, real benchmarks, opinionated stacks.
      </Text>
      <Text style={styles.p}>
        Next step: set your stack so we can tailor picks to the tools you actually use.
      </Text>
      <Section>
        <Button href={dashboardUrl} style={styles.cta}>
          Open your dashboard
        </Button>
      </Section>
      <Text style={styles.muted}>
        Questions? Just reply to this email — it goes to a real human.
      </Text>
    </EmailShell>
  );
}

export default WelcomeEmail;

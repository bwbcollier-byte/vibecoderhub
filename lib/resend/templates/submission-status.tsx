import * as React from 'react';
import { Button, Section, Text } from '@react-email/components';

import { EmailShell, styles } from './_shared';

export interface SubmissionStatusEmailProps {
  resourceName: string;
  status: 'received' | 'approved' | 'changes_requested' | 'rejected';
  resourceUrl?: string;
  note?: string;
}

const HEADLINES: Record<SubmissionStatusEmailProps['status'], string> = {
  received: 'Submission received',
  approved: 'Approved + live',
  changes_requested: 'Changes requested',
  rejected: 'Not a fit this time',
};

export function SubmissionStatusEmail({
  resourceName,
  status,
  resourceUrl,
  note,
}: SubmissionStatusEmailProps): React.ReactElement {
  return (
    <EmailShell preview={`${HEADLINES[status]} — ${resourceName}`}>
      <Text style={styles.h1}>{HEADLINES[status]}</Text>
      <Text style={styles.p}>
        Your submission <strong>{resourceName}</strong> has been{' '}
        {status === 'received'
          ? 'received and is in the queue. Reviews land within 5 business days.'
          : status === 'approved'
            ? 'approved and is now live.'
            : status === 'changes_requested'
              ? 'reviewed — we need a few tweaks before it can go live.'
              : 'reviewed and unfortunately not a fit for the directory right now.'}
      </Text>
      {note ? <Text style={styles.muted}>Reviewer note: {note}</Text> : null}
      {status === 'approved' && resourceUrl ? (
        <Section>
          <Button href={resourceUrl} style={styles.cta}>
            View live page
          </Button>
        </Section>
      ) : null}
      {status === 'changes_requested' && resourceUrl ? (
        <Section>
          <Button href={resourceUrl} style={styles.cta}>
            Edit submission
          </Button>
        </Section>
      ) : null}
    </EmailShell>
  );
}

export default SubmissionStatusEmail;

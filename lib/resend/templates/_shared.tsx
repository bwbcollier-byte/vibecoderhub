import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const BG = '#0a0a0a';
const TEXT = '#ededed';
const MUTED = '#9a9a9a';
const MINT = '#7fe7c4';

export interface ShellProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailShell({ preview, children }: ShellProps): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: BG, color: TEXT, fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '32px 0' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px', backgroundColor: '#111' }}>
          <Section>
            <Text style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: MINT, margin: 0 }}>
              Vibe Coder Hub
            </Text>
          </Section>
          {children}
          <Hr style={{ borderColor: '#222', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: MUTED, margin: 0 }}>
            Vibe Coder Hub · The directory for the vibe-coding ecosystem.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const styles = {
  h1: { fontSize: 28, color: TEXT, margin: '24px 0 8px', fontWeight: 700 } as const,
  p: { fontSize: 14, lineHeight: 1.6, color: TEXT, margin: '12px 0' } as const,
  cta: {
    display: 'inline-block',
    padding: '12px 20px',
    backgroundColor: MINT,
    color: '#000',
    textDecoration: 'none',
    fontWeight: 600,
    borderRadius: 6,
    fontSize: 14,
    marginTop: 16,
  } as const,
  muted: { fontSize: 12, color: MUTED, margin: '12px 0' } as const,
};

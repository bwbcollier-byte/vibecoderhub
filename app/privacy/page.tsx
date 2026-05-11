import type { Metadata } from 'next';
import type { JSX, ReactElement } from 'react';

export const metadata: Metadata = {
  title: 'Privacy — Vibe Coder Hub',
  description:
    'How Vibe Coder Hub collects, uses, retains, and protects your data.',
};

const LAST_UPDATED = '2026-05-12';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section className="flex flex-col gap-3 border-b border-white/10 pb-8">
      <h2 className="font-display uppercase tracking-[0.5px] text-[clamp(24px,3vw,32px)] leading-[1.05]">
        {title}
      </h2>
      <div className="text-text-secondary text-[15px] leading-[1.65] flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage(): ReactElement {
  return (
    <div className="max-w-prose mx-auto py-16 px-4">
      <header className="flex flex-col gap-4 mb-12">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
          Legal · Privacy
        </p>
        <h1 className="font-display uppercase leading-[0.95] text-[clamp(48px,8vw,88px)]">
          Privacy Policy
        </h1>
        <small className="text-text-secondary font-mono uppercase tracking-[1.5px] text-[11px]">
          Last updated: {LAST_UPDATED}
        </small>
      </header>

      <div className="flex flex-col gap-8">
        <Section title="1. Introduction">
          <p>
            Vibe Coder Hub (&quot;we&quot;, &quot;us&quot;) operates
            vibecoderhub.com (the &quot;Service&quot;). This policy explains
            what we collect, why, how long we keep it, and your rights over
            your data. By using the Service you agree to this policy.
          </p>
        </Section>

        <Section title="2. Data we collect">
          <p>
            <strong className="text-white">Account data:</strong> email,
            display name, hashed password (or OAuth provider ID), workspace
            preferences.
          </p>
          <p>
            <strong className="text-white">Subscription data:</strong> Stripe
            customer ID, subscription status, billing country, last-4 of card
            (held by Stripe, not us).
          </p>
          <p>
            <strong className="text-white">Usage data:</strong> pages viewed,
            searches, clicks on outbound deal/affiliate links, feature
            interactions. Captured via PostHog with IP anonymization.
          </p>
          <p>
            <strong className="text-white">Technical data:</strong> browser
            user-agent, approximate region (from IP), referrer, error stack
            traces (via Sentry, with PII scrubbing).
          </p>
          <p>
            <strong className="text-white">Submissions:</strong> content you
            publish (reviews, stack picks, tool submissions) is associated
            with your account and visible to other users.
          </p>
        </Section>

        <Section title="3. Cookies & local storage">
          <p>
            We use first-party cookies for authentication sessions and
            preferences. PostHog sets analytics cookies for product analytics.
            Stripe sets cookies during checkout for fraud prevention. You can
            block non-essential cookies from your browser settings; the
            Service remains usable.
          </p>
        </Section>

        <Section title="4. Third-party processors">
          <p>We share data only with vendors required to run the Service:</p>
          <ul className="list-disc pl-6 flex flex-col gap-1">
            <li>
              <strong className="text-white">Supabase</strong> — Postgres
              database, auth, file storage (EU/US region).
            </li>
            <li>
              <strong className="text-white">Stripe</strong> — payments and
              subscription billing.
            </li>
            <li>
              <strong className="text-white">PostHog</strong> — product
              analytics and feature flags.
            </li>
            <li>
              <strong className="text-white">Resend</strong> — transactional
              email (receipts, password resets, digests).
            </li>
            <li>
              <strong className="text-white">Sentry</strong> — error
              monitoring and performance traces.
            </li>
            <li>
              <strong className="text-white">OpenRouter</strong> — LLM
              inference for AI-assisted features. Prompts may be processed
              by the upstream model provider you select.
            </li>
          </ul>
        </Section>

        <Section title="5. Retention">
          <p>
            When you delete your account, we perform a <em>soft delete</em>{' '}
            (anonymizing your record and disabling access) for 30 days, then
            a <em>hard delete</em> that removes your row and associated PII
            from our primary database. Backups roll off within a further 30
            days. Aggregate, non-identifying analytics may be retained.
          </p>
          <p>
            Submissions you published (reviews, comments) may be retained in
            anonymized form to preserve community context.
          </p>
        </Section>

        <Section title="6. Your rights (GDPR / CCPA)">
          <p>
            You can: access your data, request a portable export, correct
            inaccuracies, delete your account, withdraw consent for analytics,
            or object to processing. Email{' '}
            <a
              href="mailto:privacy@vibecoderhub.com"
              className="text-mint hover:underline"
            >
              privacy@vibecoderhub.com
            </a>{' '}
            with your request; we respond within 30 days.
          </p>
        </Section>

        <Section title="7. Security">
          <p>
            Data is encrypted in transit (TLS 1.2+) and at rest. Access to
            production data is limited and audited. We never sell your
            personal data.
          </p>
        </Section>

        <Section title="8. Children">
          <p>
            The Service is not directed to anyone under 16. If you believe a
            minor has provided personal data, contact us and we will delete
            it.
          </p>
        </Section>

        <Section title="9. Changes">
          <p>
            We will post material changes to this page and update the
            &quot;last updated&quot; date. For significant changes affecting
            your rights, we will email account holders.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Questions or requests:{' '}
            <a
              href="mailto:privacy@vibecoderhub.com"
              className="text-mint hover:underline"
            >
              privacy@vibecoderhub.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

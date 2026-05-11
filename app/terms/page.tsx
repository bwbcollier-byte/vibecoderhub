import type { Metadata } from 'next';
import type { JSX, ReactElement } from 'react';

export const metadata: Metadata = {
  title: 'Terms — Vibe Coder Hub',
  description:
    'Terms of service governing your use of Vibe Coder Hub.',
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

export default function TermsPage(): ReactElement {
  return (
    <div className="max-w-prose mx-auto py-16 px-4">
      <header className="flex flex-col gap-4 mb-12">
        <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
          Legal · Terms
        </p>
        <h1 className="font-display uppercase leading-[0.95] text-[clamp(48px,8vw,88px)]">
          Terms of Service
        </h1>
        <small className="text-text-secondary font-mono uppercase tracking-[1.5px] text-[11px]">
          Last updated: {LAST_UPDATED}
        </small>
      </header>

      <div className="flex flex-col gap-8">
        <Section title="1. Acceptance">
          <p>
            By accessing or using Vibe Coder Hub (the &quot;Service&quot;,
            operated by Vibe Coder Hub) you agree to these Terms. If you do
            not agree, do not use the Service.
          </p>
        </Section>

        <Section title="2. Account & eligibility">
          <p>
            You must be at least 16 years old to create an account. You are
            responsible for keeping your credentials secure and for activity
            under your account. One account per person; sharing logins is
            prohibited.
          </p>
        </Section>

        <Section title="3. Pro subscription">
          <p>
            Pro is billed at <strong className="text-white">$99/year</strong>{' '}
            via Stripe. A 14-day free trial is available;{' '}
            <strong className="text-white">a valid payment method is required</strong>{' '}
            to start the trial. You will be charged the annual fee at the end
            of the trial unless you cancel.
          </p>
          <p>
            You may cancel anytime via the Stripe Customer Portal linked from
            your account settings. Cancellation takes effect at the end of
            the current billing period. We do not provide prorated refunds
            for partial periods except where required by law.
          </p>
        </Section>

        <Section title="4. Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 flex flex-col gap-1">
            <li>scrape, mirror, or resell the Service or its data;</li>
            <li>
              upload malware, illegal content, or content that infringes
              others&apos; rights;
            </li>
            <li>
              spam, harass, or impersonate other users or organizations;
            </li>
            <li>
              abuse rate limits, attempt to circumvent paywalls, or probe
              for vulnerabilities without written permission;
            </li>
            <li>use automated agents that materially burden the Service.</li>
          </ul>
          <p>We may suspend or terminate accounts that violate these rules.</p>
        </Section>

        <Section title="5. Content ownership & submissions">
          <p>
            You retain ownership of content you submit (reviews, stacks,
            comments, tool submissions). By submitting, you grant Vibe Coder
            Hub a worldwide, royalty-free, non-exclusive license to display,
            distribute, and create derivative works of that content for the
            purpose of operating and promoting the Service. You represent
            that you have the rights to grant this license.
          </p>
          <p>
            Editorial content, code, design, and aggregated data on the
            Service are owned by Vibe Coder Hub and protected by
            intellectual-property laws.
          </p>
        </Section>

        <Section title="6. DMCA & infringement">
          <p>
            If you believe content on the Service infringes your copyright,
            email{' '}
            <a
              href="mailto:legal@vibecoderhub.com"
              className="text-mint hover:underline"
            >
              legal@vibecoderhub.com
            </a>{' '}
            with: (a) your contact info, (b) identification of the work, (c)
            the URL of the infringing material, (d) a good-faith statement,
            and (e) your signature. We honor valid DMCA takedown notices and
            terminate repeat infringers.
          </p>
        </Section>

        <Section title="7. Third-party links & data">
          <p>
            The Service surfaces information about third-party tools,
            models, and deals. We are not responsible for the accuracy,
            availability, or terms of any third-party product. Outbound
            links may be affiliate links; this does not affect our editorial
            ranking.
          </p>
        </Section>

        <Section title="8. Disclaimer">
          <p>
            The Service is provided{' '}
            <strong className="text-white">&quot;as is&quot;</strong> and{' '}
            <strong className="text-white">
              &quot;as available&quot;
            </strong>{' '}
            without warranties of any kind, express or implied, including
            merchantability, fitness for a particular purpose, and
            non-infringement. We do not warrant that the Service will be
            uninterrupted or error-free.
          </p>
        </Section>

        <Section title="9. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Vibe Coder Hub and its
            operators will not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of
            profits or revenues. Our total liability for any claim arising
            from these Terms will not exceed the greater of (a) USD 100 or
            (b) the amount you paid us in the 12 months before the claim.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>
            These Terms are governed by the laws of the State of Delaware,
            USA, without regard to conflict-of-law rules. Disputes will be
            resolved in the state or federal courts located in Delaware,
            and you consent to personal jurisdiction there.
          </p>
        </Section>

        <Section title="11. Changes to terms">
          <p>
            We may update these Terms from time to time. Material changes
            will be announced via email or in-product notice. Continued use
            after the effective date means you accept the updated Terms.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            Questions:{' '}
            <a
              href="mailto:legal@vibecoderhub.com"
              className="text-mint hover:underline"
            >
              legal@vibecoderhub.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

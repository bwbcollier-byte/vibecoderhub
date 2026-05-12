'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, type TabItem } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';
import { useOverlays } from '@/components/overlays/OverlaysProvider';
import { useStack } from '@/components/stack-context/StackProvider';

import { DeleteAccountModal } from './DeleteAccountModal';

interface SettingsClientProps {
  email: string;
  initialDisplayName: string;
  initialAvatarUrl?: string | null;
  initialTab?: 'profile' | 'stack' | 'subscription' | 'danger';
  welcome?: boolean;
}

const TABS: TabItem[] = [
  { value: 'profile', label: 'Profile' },
  { value: 'stack', label: 'Stack' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'danger', label: 'Danger zone' },
];

const KICKER_CLS =
  'font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint';
const HEADLINE_CLS = 'font-sans font-bold text-[24px] tracking-[-0.01em]';

export function SettingsClient({
  email,
  initialDisplayName,
  initialAvatarUrl = null,
  initialTab,
  welcome = false,
}: SettingsClientProps): React.ReactElement {
  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-10 pb-20">
      <div className="mb-8 flex flex-col gap-3">
        <div className={KICKER_CLS}>ACCOUNT</div>
        <h1 className="font-display uppercase leading-[0.92] text-[clamp(48px,7vw,84px)]">
          Settings.
        </h1>
      </div>

      {welcome && (
        <div className="mb-8 flex items-start gap-4 border border-mint-border bg-mint/5 rounded-tile p-5">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-pill bg-mint text-black font-display text-[22px] shrink-0"
            aria-hidden
          >
            ✓
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-mono uppercase tracking-[1.4px] text-[10px] font-bold text-mint">
              WELCOME TO VIBE CODER HUB
            </p>
            <p className="font-sans text-white text-[16px]">
              Account ready. Take a minute to fill out your profile so the
              community knows who&rsquo;s shipping what.
            </p>
          </div>
        </div>
      )}

      <Tabs items={TABS} defaultValue={initialTab ?? 'profile'}>
        {(active) => (
          <>
            {active === 'profile' && (
              <ProfileSection
                initialDisplayName={initialDisplayName}
                initialAvatarUrl={initialAvatarUrl}
              />
            )}
            {active === 'stack' && <StackSection />}
            {active === 'subscription' && <SubscriptionSection />}
            {active === 'danger' && <DangerSection email={email} />}
          </>
        )}
      </Tabs>
    </main>
  );
}

// ───────────────────────────────────────────────────── Profile

function ProfileSection({
  initialDisplayName,
  initialAvatarUrl,
}: {
  initialDisplayName: string;
  initialAvatarUrl: string | null;
}): React.ReactElement {
  const [displayName, setDisplayName] = React.useState(initialDisplayName);
  const [bio, setBio] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState(initialAvatarUrl ?? '');
  const [websiteUrl, setWebsiteUrl] = React.useState('');
  const [twitter, setTwitter] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast.success('Profile saved');
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className={KICKER_CLS}>PROFILE</div>
        <h2 className={HEADLINE_CLS}>Public profile</h2>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short one-liner about you"
          className="w-full bg-transparent font-sans text-[14px] leading-[18px] text-white placeholder:text-text-secondary border border-surface rounded-xs p-3 min-h-[100px] transition-colors duration-base ease-out focus:outline-none focus:border-mint"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="avatar-url">Avatar URL</Label>
        <Input
          id="avatar-url"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="website-url">Website</Label>
        <Input
          id="website-url"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://yoursite.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="twitter">Twitter</Label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-text-secondary text-[14px]">@</span>
          <Input
            id="twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value.replace(/^@/, ''))}
            placeholder="handle"
          />
        </div>
      </div>

      <div>
        <Button
          variant="primary"
          onClick={() => {
            void handleSave();
          }}
          loading={saving}
        >
          Save profile
        </Button>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────── Stack

function StackSection(): React.ReactElement {
  const { stack } = useStack();
  const { openStackPicker } = useOverlays();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className={KICKER_CLS}>YOUR STACK</div>
        <h2 className={HEADLINE_CLS}>Tools you build with</h2>
      </div>

      <div className="border border-surface rounded-tile p-5 flex flex-col gap-4">
        <div className="font-sans text-[14px] text-text-secondary">
          {stack?.label ? (
            <span className="text-white">{stack.label}</span>
          ) : (
            'No stack set yet.'
          )}
        </div>
        <div>
          <Button variant="secondary" onClick={() => openStackPicker()}>
            Edit my stack →
          </Button>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────── Subscription

function SubscriptionSection(): React.ReactElement {
  const { openUpgrade } = useOverlays();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className={KICKER_CLS}>SUBSCRIPTION</div>
        <h2 className={HEADLINE_CLS}>Plan & billing</h2>
      </div>

      <div className="border border-surface rounded-tile p-5 flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-text-secondary">
            Current tier
          </span>
          <span className="font-display text-[28px] leading-none">Free</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            variant="uv"
            onClick={() =>
              openUpgrade({
                triggerLabel: 'Pro subscription',
                triggerValueUsd: 99,
              })
            }
          >
            Upgrade to Pro
          </Button>
          <div className="flex flex-col gap-1">
            <Button variant="secondary" disabled>
              Manage subscription
            </Button>
            <span className="font-mono uppercase tracking-[1.5px] text-[10px] text-text-secondary">
              Available once Stripe Customer Portal is wired — Slice 20
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────── Danger zone

function DangerSection({ email }: { email: string }): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className={KICKER_CLS}>DANGER ZONE</div>
        <h2 className={HEADLINE_CLS}>Delete your account</h2>
      </div>

      <div className="bg-error-red/5 border border-error-red rounded-tile p-5 flex flex-col gap-4">
        <p className="font-sans text-[14px] leading-[1.5] text-text-secondary">
          Soft-delete first (30-day undo window per Q3.1). All PII is scrubbed;
          public attribution stays.
        </p>
        <div>
          <Button variant="danger" onClick={() => setOpen(true)}>
            Delete my account
          </Button>
        </div>
      </div>

      <DeleteAccountModal
        open={open}
        onOpenChange={setOpen}
        email={email}
      />
    </section>
  );
}

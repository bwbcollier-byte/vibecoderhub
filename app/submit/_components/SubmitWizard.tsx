'use client';

// SubmitWizard — 4-step resource submission flow.
//
// Step 1: pick resource type · Step 2: metadata · Step 3: compatibility ·
// Step 4: preview + submit. Submit is currently a stub.

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RESOURCE_TYPES } from '@/lib/resource-types';
import { AI_CLIENTS } from '@/lib/stack/presets';
import { cn } from '@/lib/shadcn/cn';

import { submissionSchema, type SubmissionInput } from '../_schema';

type FieldErrors = Partial<Record<keyof SubmissionInput, string>>;

const STEP_LABELS = ['Type', 'Details', 'Compatibility', 'Review'] as const;

export function SubmitWizard(): React.ReactElement {
  const [step, setStep] = React.useState<0 | 1 | 2 | 3>(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [type, setType] = React.useState<string>('');
  const [name, setName] = React.useState('');
  const [tagline, setTagline] = React.useState('');
  const [sourceUrl, setSourceUrl] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [compatibleClients, setCompatibleClients] = React.useState<string[]>([]);

  const [errors, setErrors] = React.useState<FieldErrors>({});

  const formData: SubmissionInput = {
    type,
    name,
    tagline,
    sourceUrl,
    description,
    compatibleClients,
  };

  function validateStep2(): boolean {
    const result = submissionSchema
      .pick({ name: true, tagline: true, sourceUrl: true, description: true })
      .safeParse({ name, tagline, sourceUrl, description });
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof SubmissionInput;
      if (key && !next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return false;
  }

  function validateStep3(): boolean {
    if (compatibleClients.length === 0) {
      setErrors({ compatibleClients: 'Select at least one client.' });
      return false;
    }
    setErrors({});
    return true;
  }

  function toggleClient(id: string): void {
    setCompatibleClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function handleSubmit(): Promise<void> {
    const result = submissionSchema.safeParse(formData);
    if (!result.success) return;
    setSubmitting(true);
    // TODO: real POST to /api/submissions once Slice S24 lands.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-surface rounded-tile p-8 bg-canvas">
        <div className="font-mono uppercase tracking-[1.5px] text-[11px] text-mint mb-3">
          ✓ SUBMITTED
        </div>
        <h2 className="font-display text-[40px] leading-[0.95] mb-4">Thanks.</h2>
        <p className="text-text-secondary text-[15px] leading-[1.6]">
          We&apos;ll notify you when a moderator reviews it. Typical turnaround: 2–3 business
          days.
        </p>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator step={step} />

      {step === 0 && (
        <section className="border border-surface rounded-tile p-6 md:p-8 bg-canvas">
          <div className="font-mono uppercase tracking-[1.5px] text-[11px] text-mint mb-3">
            STEP 1 · TYPE
          </div>
          <h2 className="font-display text-[32px] leading-[0.95] mb-6">What are you adding?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {RESOURCE_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setType(t.id);
                  setStep(1);
                }}
                className={cn(
                  'flex items-center gap-2 px-3 h-btn-md rounded-feature',
                  'border border-surface bg-transparent text-white',
                  'font-mono uppercase tracking-[1.5px] text-[11px]',
                  'hover:border-mint hover:text-mint transition-colors',
                  type === t.id && 'border-mint text-mint',
                )}
              >
                <span aria-hidden="true" className="text-[14px]">
                  {t.glyph}
                </span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="border border-surface rounded-tile p-6 md:p-8 bg-canvas">
          <div className="font-mono uppercase tracking-[1.5px] text-[11px] text-mint mb-3">
            STEP 2 · DETAILS
          </div>
          <h2 className="font-display text-[32px] leading-[0.95] mb-6">Tell us about it.</h2>
          <div className="flex flex-col gap-4">
            <Field id="name" label="Name *" error={errors.name}>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Auth0 MCP"
                error={!!errors.name}
              />
            </Field>
            <Field id="tagline" label="Tagline *" error={errors.tagline}>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="One line — what does it do?"
                error={!!errors.tagline}
              />
            </Field>
            <Field id="sourceUrl" label="Source URL *" error={errors.sourceUrl}>
              <Input
                id="sourceUrl"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://github.com/…"
                error={!!errors.sourceUrl}
              />
            </Field>
            <Field id="description" label="Description *" error={errors.description}>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What it does, who it's for, how it works."
                rows={6}
                aria-invalid={!!errors.description || undefined}
                className={cn(
                  'w-full bg-transparent font-sans text-[14px] leading-[18px] text-white',
                  'placeholder:text-text-secondary',
                  'border border-input rounded-xs px-3 py-[11px]',
                  'transition-colors duration-base ease-out',
                  'focus:outline-none focus:border-mint',
                  'aria-[invalid=true]:border-error-red',
                )}
              />
            </Field>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="ghost" onClick={() => setStep(0)}>
              ← Back
            </Button>
            <div className="flex-1" />
            <Button
              onClick={() => {
                if (validateStep2()) setStep(2);
              }}
            >
              Next →
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="border border-surface rounded-tile p-6 md:p-8 bg-canvas">
          <div className="font-mono uppercase tracking-[1.5px] text-[11px] text-mint mb-3">
            STEP 3 · COMPATIBILITY
          </div>
          <h2 className="font-display text-[32px] leading-[0.95] mb-6">
            Which clients does it work with?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AI_CLIENTS.map((id) => {
              const checked = compatibleClients.includes(id);
              return (
                <label
                  key={id}
                  className={cn(
                    'flex items-center gap-2 px-3 h-btn-md rounded-feature cursor-pointer',
                    'border border-surface bg-transparent text-white',
                    'font-mono uppercase tracking-[1.5px] text-[11px]',
                    'hover:border-mint transition-colors',
                    checked && 'border-mint text-mint',
                  )}
                >
                  <input
                    type="checkbox"
                    className="accent-mint"
                    checked={checked}
                    onChange={() => toggleClient(id)}
                  />
                  <span>{id}</span>
                </label>
              );
            })}
          </div>
          {errors.compatibleClients && (
            <p className="mt-3 font-mono uppercase tracking-[1.4px] text-[11px] text-error-red">
              {errors.compatibleClients}
            </p>
          )}
          <div className="flex gap-2 mt-6">
            <Button variant="ghost" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <div className="flex-1" />
            <Button
              onClick={() => {
                if (validateStep3()) setStep(3);
              }}
            >
              Next →
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <div className="font-mono uppercase tracking-[1.5px] text-[11px] text-mint mb-3">
            STEP 4 · REVIEW
          </div>
          <h2 className="font-display text-[32px] leading-[0.95] mb-6">Looks good?</h2>
          <div className="border border-surface rounded-tile p-6 bg-canvas mb-6 flex flex-col gap-3">
            <SummaryRow label="Type" value={type} />
            <SummaryRow label="Name" value={name} />
            <SummaryRow label="Tagline" value={tagline} />
            <SummaryRow label="Source" value={sourceUrl} />
            <SummaryRow label="Clients" value={compatibleClients.join(', ')} />
            <SummaryRow label="Description" value={description} />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(2)} disabled={submitting}>
              ← Back
            </Button>
            <div className="flex-1" />
            <Button
              onClick={() => {
                void handleSubmit();
              }}
              loading={submitting}
            >
              Submit for review →
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: number }): React.ReactElement {
  return (
    <div className="flex gap-4 mb-8">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <div
            className={cn(
              'w-[22px] h-[22px] rounded-full flex items-center justify-center',
              'font-mono font-bold text-[11px]',
              i <= step ? 'bg-mint text-black' : 'bg-surface text-text-secondary',
            )}
          >
            {i + 1}
          </div>
          <span
            className={cn(
              'font-mono uppercase tracking-[1.4px] text-[10px]',
              i <= step ? 'text-white' : 'text-text-secondary',
            )}
          >
            {label}
          </span>
          {i < STEP_LABELS.length - 1 && (
            <div
              className={cn('flex-1 h-px', i < step ? 'bg-mint' : 'bg-surface')}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="font-mono uppercase tracking-[1.4px] text-[11px] text-error-red">{error}</p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="flex gap-3 border-b border-surface pb-2 last:border-b-0 last:pb-0">
      <span className="font-mono uppercase tracking-[1.4px] text-[10px] text-text-secondary min-w-[100px]">
        {label}
      </span>
      <span className="flex-1 text-[13px] leading-[1.5] text-white break-words">
        {value || '—'}
      </span>
    </div>
  );
}

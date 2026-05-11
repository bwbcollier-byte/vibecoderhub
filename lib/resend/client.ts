import { Resend } from 'resend';

import { env } from '@/lib/env';

let _client: Resend | null = null;

function isDummyKey(key: string | undefined): boolean {
  return !key || key === 're_dummy' || key.endsWith('_dummy');
}

export function getResend(): Resend | null {
  if (_client) return _client;
  if (isDummyKey(env.RESEND_API_KEY)) return null;
  _client = new Resend(env.RESEND_API_KEY);
  return _client;
}

export const FROM = {
  transactional: env.RESEND_FROM_TRANSACTIONAL,
  newsletter: env.RESEND_FROM_NEWSLETTER,
};

export interface SendArgs {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export async function sendEmail(args: SendArgs): Promise<
  { ok: true; id: string } | { ok: false; reason: 'dummy' | 'error'; error?: string }
> {
  const client = getResend();
  if (!client) return { ok: false, reason: 'dummy' };
  const { data, error } = await client.emails.send({
    from: args.from ?? FROM.transactional,
    to: args.to,
    subject: args.subject,
    react: args.react,
    replyTo: args.replyTo,
    tags: args.tags,
  });
  if (error) return { ok: false, reason: 'error', error: error.message };
  return { ok: true, id: data!.id };
}

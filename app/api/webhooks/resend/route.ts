import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'node:crypto';

import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    to?: string[] | string;
    from?: string;
    subject?: string;
    bounce?: { type?: string; subType?: string; message?: string };
    complaint?: { feedbackType?: string };
  };
}

function timingSafeEqual(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}

function verifySignature(rawBody: string, header: string | null): boolean {
  if (!header) return false;
  const secret = env.RESEND_WEBHOOK_SECRET;
  if (!secret || secret.endsWith('_dummy')) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return timingSafeEqual(expected, header.replace(/^sha256=/, ''));
}

export async function POST(req: NextRequest): Promise<Response> {
  const raw = await req.text();
  const sig = req.headers.get('resend-signature') ?? req.headers.get('x-resend-signature');

  if (!verifySignature(raw, sig)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  let event: ResendWebhookEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  // TODO Slice S24: persist to newsletter_subscribers (increment bounceCount on
  // bounce, mark unsubscribedAt on complaint). Cookie-stub for now.
  switch (event.type) {
    case 'email.bounced':
    case 'email.delivery_delayed':
    case 'email.complained':
      console.warn('[resend webhook]', event.type, event.data);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

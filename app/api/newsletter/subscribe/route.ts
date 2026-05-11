import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const runtime = 'nodejs';

const SubscribeSchema = z.object({
  email: z.string().email().max(255),
  topics: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json().catch(() => null);
  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
  }

  // TODO Slice S24: insert into newsletter_subscribers via service-role client +
  // send Resend confirmation email. Cookie-stub until Supabase wired.
  const jar = await cookies();
  jar.set('vch_newsletter', '1', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  });

  return NextResponse.json({ ok: true, email: parsed.data.email });
}

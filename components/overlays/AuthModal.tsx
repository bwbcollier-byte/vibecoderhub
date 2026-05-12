'use client';

// AuthModal — sign-in / sign-up flow. Wraps Supabase's GitHub OAuth (Boot
// Step 6) and a magic-link option. Email/password is intentionally NOT
// offered Phase 1 (per ANSWERS Q1.x — GitHub OAuth primary, magic link
// fallback, password is opt-in for Phase 2).
//
// Reference: docs/planning/promptkit-recon/src/overlays.jsx AuthModal.

import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/icons/Icon';
import { getSupabaseBrowserClient } from '@/lib/auth/client';

export type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (next: AuthMode) => void;
}

export function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps): React.ReactElement {
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState<null | 'google' | 'github' | 'magic'>(null);
  const [magicSent, setMagicSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const signInGoogle = async (): Promise<void> => {
    setError(null);
    setSubmitting('google');
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        },
      });
      if (error) {
        setError(error.message);
        setSubmitting(null);
      }
      // On success Supabase navigates the tab — no further action.
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(null);
    }
  };

  const signInGithub = async (): Promise<void> => {
    setError(null);
    setSubmitting('github');
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        },
      });
      if (error) {
        setError(error.message);
        setSubmitting(null);
      }
      // On success Supabase navigates the tab — no further action.
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(null);
    }
  };

  const sendMagic = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setSubmitting('magic');
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMagicSent(true);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent width={460}>
        <DialogHeader>
          <p className="font-mono uppercase tracking-[1.5px] text-[11px] font-bold text-mint">
            {mode === 'signup' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </p>
          <DialogTitle className="text-[clamp(36px,5vw,52px)]">
            {mode === 'signup' ? 'Join Vibe Coder Hub.' : 'Sign in.'}
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-3">
          {magicSent ? (
            <div className="flex flex-col gap-3 py-6 text-center">
              <p className="font-mono uppercase tracking-[1.5px] text-[10px] font-bold text-mint">
                CHECK YOUR INBOX
              </p>
              <p className="font-sans text-[18px] text-white">
                Magic link sent to <span className="text-mint">{email}</span>.
              </p>
              <p className="text-text-secondary text-[13px]">
                Click the link to finish signing {mode === 'signup' ? 'up' : 'in'}.
              </p>
            </div>
          ) : (
            <>
              <Button
                variant="secondary"
                block
                onClick={() => {
                  void signInGoogle();
                }}
                loading={submitting === 'google'}
                disabled={!!submitting}
              >
                <Icon.Google size={14} />
                Continue with Google
              </Button>

              <div className="text-center font-mono uppercase tracking-[1.4px] text-[9px] text-text-secondary">
                or
              </div>

              <Button
                variant="secondary"
                block
                onClick={() => {
                  void signInGithub();
                }}
                loading={submitting === 'github'}
                disabled={!!submitting}
              >
                <Icon.Github size={14} />
                Continue with GitHub
              </Button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-surface" />
                <span className="font-mono uppercase tracking-[1.4px] text-[9px] text-text-secondary">
                  OR WITH EMAIL
                </span>
                <div className="flex-1 h-px bg-surface" />
              </div>

              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  void sendMagic(e);
                }}
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  block
                  loading={submitting === 'magic'}
                  disabled={!!submitting || !email.trim()}
                >
                  <Icon.Zap size={14} />
                  Send magic link
                </Button>
              </form>

              {error && (
                <p
                  role="alert"
                  className="text-[12px] text-error-red font-mono uppercase tracking-[1.2px] mt-2"
                >
                  {error}
                </p>
              )}

              <p className="text-text-secondary text-[13px] text-center mt-4">
                {mode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onSwitchMode('signin')}
                      className="text-mint hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    New here?{' '}
                    <button
                      type="button"
                      onClick={() => onSwitchMode('signup')}
                      className="text-mint hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

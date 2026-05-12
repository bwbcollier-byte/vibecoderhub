'use client';

// Hero "Sign up free →" CTA. Lives in a client island so the surrounding
// home page can stay a Server Component while still being able to open the
// AuthModal via the OverlaysProvider context.

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useOverlays } from '@/components/overlays/OverlaysProvider';

export function HeroSignUpCta(): React.ReactElement {
  const { openAuth } = useOverlays();
  return (
    <Button size="lg" variant="primary" onClick={() => openAuth('signup')}>
      Sign up free →
    </Button>
  );
}

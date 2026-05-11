'use client';

// Single mount point for the global overlays — Cmd-K palette, AuthModal,
// StackPicker. Exposes a small imperative API (`openCmdK`, `openAuth`,
// `openStackPicker`) consumed by the header and the rest of the app, so
// triggers don't need to plumb open-state through React props.
//
// Also registers the global ⌘K / Ctrl+K keybinding here so the palette is
// reachable from anywhere — including pages that don't render the header.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { CmdK } from './CmdK';
import { AuthModal, type AuthMode } from './AuthModal';
import { StackPicker } from './StackPicker';
import { UpgradeModal, type UpgradeContext } from './UpgradeModal';

interface OverlaysContextValue {
  openCmdK: () => void;
  openAuth: (mode?: AuthMode) => void;
  openStackPicker: () => void;
  openUpgrade: (context: UpgradeContext) => void;
}

const OverlaysContext = createContext<OverlaysContextValue | null>(null);

export function OverlaysProvider({ children }: { children: ReactNode }): ReactNode {
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [upgradeContext, setUpgradeContext] = useState<UpgradeContext | null>(null);

  const openCmdK = useCallback(() => setCmdkOpen(true), []);
  const openAuth = useCallback((mode: AuthMode = 'signin') => setAuthMode(mode), []);
  const openStackPicker = useCallback(() => setPickerOpen(true), []);
  const openUpgrade = useCallback((ctx: UpgradeContext) => setUpgradeContext(ctx), []);

  // Global ⌘K / Ctrl+K — opens (or closes) the palette from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (!isCmdK) return;
      e.preventDefault();
      setCmdkOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo<OverlaysContextValue>(
    () => ({ openCmdK, openAuth, openStackPicker, openUpgrade }),
    [openCmdK, openAuth, openStackPicker, openUpgrade],
  );

  return (
    <OverlaysContext.Provider value={value}>
      {children}
      {cmdkOpen && (
        <CmdK
          onClose={() => setCmdkOpen(false)}
          onOpenStackPicker={() => {
            setCmdkOpen(false);
            setPickerOpen(true);
          }}
        />
      )}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      )}
      {pickerOpen && <StackPicker onClose={() => setPickerOpen(false)} />}
      {upgradeContext && (
        <UpgradeModal
          context={upgradeContext}
          onClose={() => setUpgradeContext(null)}
        />
      )}
    </OverlaysContext.Provider>
  );
}

export function useOverlays(): OverlaysContextValue {
  const ctx = useContext(OverlaysContext);
  if (!ctx) throw new Error('useOverlays must be used inside <OverlaysProvider>');
  return ctx;
}

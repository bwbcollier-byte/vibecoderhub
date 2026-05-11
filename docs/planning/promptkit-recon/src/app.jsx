// PROMPTKIT — App shell + router
const { useState: uS_app, useEffect: uE_app, useCallback: uC_app } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#3cffd0",
  "showBanner": true,
  "density": "comfortable",
  "voice": "verge"
}/*EDITMODE-END*/;

const App = () => {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  uE_app(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
  }, [tweaks.accent]);

  // Routing via state
  const [route, setRoute] = uS_app(() => {
    const h = location.hash.slice(1);
    if (!h) return { name: 'landing' };
    try { return JSON.parse(decodeURIComponent(h)); } catch { return { name: 'landing' }; }
  });
  const navigate = uC_app((r) => {
    setRoute(r);
    location.hash = encodeURIComponent(JSON.stringify(r));
    window.scrollTo(0, 0);
  }, []);
  uE_app(() => {
    const onHash = () => {
      const h = location.hash.slice(1);
      if (!h) return;
      try { setRoute(JSON.parse(decodeURIComponent(h))); } catch {}
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // App state
  const [user, setUser] = uS_app(null);
  const [stack, setStack] = uS_app({ clients: ['cursor','claude-code'], tags: ['Next.js','React','TypeScript','Supabase'], hardware: ['Apple Silicon','M3 Max','36 GB'] });
  const [bookmarks, setBookmarks] = uS_app(new Set(['claude-opus-4-7','auth0-mcp']));
  const [stackPickerOpen, setStackPickerOpen] = uS_app(false);
  const [cmdkOpen, setCmdkOpen] = uS_app(false);
  const [authOpen, setAuthOpen] = uS_app(null); // 'signin' | 'signup' | null
  const [compareOpen, setCompareOpen] = uS_app(null);
  const [upgradeOpen, setUpgradeOpen] = uS_app(false);
  const [claimDeal, setClaimDeal] = uS_app(null);
  const [cookieDismissed, setCookieDismissed] = uS_app(true);
  const [toast, setToast] = uS_app(null);

  // Cmd-K binding
  uE_app(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen(o => !o);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const toggleBookmark = (slug) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(slug)) { next.delete(slug); setToast('Bookmark removed'); }
      else { next.add(slug); setToast('Bookmark saved'); }
      return next;
    });
    setTimeout(() => setToast(null), 2000);
  };

  const onCompareAdd = (r) => { setCompareOpen({ items: [r] }); };

  // Page render
  const r = route;
  let page;
  if (r.name === 'landing') page = <window.LandingPage navigate={navigate} onAuth={setAuthOpen} onCmdK={() => setCmdkOpen(true)} />;
  else if (r.name === 'home') page = <window.HomePage navigate={navigate} stack={stack} onStack={() => setStackPickerOpen(true)} onCompare={onCompareAdd} onSave={toggleBookmark} bookmarks={bookmarks} />;
  else if (r.name === 'directory') page = <window.DirectoryPage type={r.type} navigate={navigate} stack={stack} onCompare={onCompareAdd} onSave={toggleBookmark} bookmarks={bookmarks} />;
  else if (r.name === 'search') page = <window.SearchPage q={r.q} navigate={navigate} onCompare={onCompareAdd} onSave={toggleBookmark} bookmarks={bookmarks} />;
  else if (r.name === 'resource') page = <window.ResourceDetailPage slug={r.slug} navigate={navigate} stack={stack} onCompare={onCompareAdd} onSave={toggleBookmark} />;
  else if (r.name === 'model') page = <window.ModelDetailPage slug={r.slug} navigate={navigate} onCompare={onCompareAdd} />;
  else if (r.name === 'compare') page = <window.ComparePage ids={r.ids || ['claude-opus-4-7','gemini-3-1-pro']} navigate={navigate} />;
  else if (r.name === 'deals') page = <window.DealsPage navigate={navigate} user={user} onUpgrade={() => setUpgradeOpen(true)} onClaim={setClaimDeal} />;
  else if (r.name === 'news') page = <window.NewsPage navigate={navigate} onSubscribe={() => setToast('Subscribed to weekly digest')} />;
  else if (r.name === 'newsItem') page = <window.NewsArticlePage slug={r.slug} navigate={navigate} />;
  else if (r.name === 'guides') page = <window.GuidesPage navigate={navigate} />;
  else if (r.name === 'guide') page = <window.GuideReader navigate={navigate} />;
  else if (r.name === 'dashboard') page = <window.DashboardPage user={user || { handle: '@benhope' }} navigate={navigate} stack={stack} />;
  else if (r.name === 'settings') page = <window.SettingsPage navigate={navigate} />;
  else if (r.name === 'submit') page = <window.SubmitPage navigate={navigate} />;
  else page = <window.NotFoundPage navigate={navigate} />;

  return (
    <>
      <window.Header user={user} stack={stack} onNav={navigate} onCmdK={() => setCmdkOpen(true)} onStack={() => setStackPickerOpen(true)} onAuth={setAuthOpen} current={route} />
      {tweaks.showBanner && r.name === 'home' && <window.StackBanner stack={stack} onEdit={() => setStackPickerOpen(true)} />}
      {page}
      <window.Footer navigate={navigate} />
      <window.MobileNav navigate={navigate} current={route} />

      {stackPickerOpen && <window.StackPicker stack={stack} setStack={setStack} onClose={() => { setStackPickerOpen(false); setToast('Stack saved'); setTimeout(() => setToast(null), 2000); }} />}
      {cmdkOpen && <window.CmdK onClose={() => setCmdkOpen(false)} navigate={navigate} />}
      {authOpen && <window.AuthModal mode={authOpen} onClose={() => setAuthOpen(null)} onSignIn={() => { setUser({ handle: '@benhope' }); setAuthOpen(null); navigate({ name: 'home' }); }} />}
      {compareOpen && <window.CompareDrawer items={compareOpen.items} onClose={() => setCompareOpen(null)} navigate={navigate} />}
      {upgradeOpen && <window.UpgradeModal onClose={() => setUpgradeOpen(false)} onUpgrade={() => { setUser(u => ({ ...(u || { handle: '@benhope' }), pro: true })); setUpgradeOpen(false); setToast('Welcome to Pro'); setTimeout(() => setToast(null), 2400); }} />}
      {claimDeal && <window.ClaimDealModal deal={claimDeal} onClose={() => setClaimDeal(null)} />}
      {!cookieDismissed && <window.CookieBanner onAccept={() => setCookieDismissed(true)} onCustomize={() => setCookieDismissed(true)} />}
      {toast && <window.Toast msg={toast} onDismiss={() => setToast(null)} />}

      {/* Tweaks */}
      <window.TweaksPanel title="Vibe Coder Hub Tweaks">
        <window.TweakSection title="Brand">
          <window.TweakColor label="Accent" value={tweaks.accent} onChange={v => setTweak('accent', v)} options={['#3cffd0','#5200ff','#f5e642','#ff3cac']} />
        </window.TweakSection>
        <window.TweakSection title="Layout">
          <window.TweakToggle label="Stack banner" value={tweaks.showBanner} onChange={v => setTweak('showBanner', v)} />
          <window.TweakRadio label="Density" value={tweaks.density} onChange={v => setTweak('density', v)} options={[{value:'compact',label:'Compact'},{value:'comfortable',label:'Roomy'}]} />
          <window.TweakRadio label="Voice" value={tweaks.voice} onChange={v => setTweak('voice', v)} options={[{value:'verge',label:'Verge'},{value:'linear',label:'Linear'}]} />
        </window.TweakSection>
        <window.TweakSection title="Open">
          <window.TweakButton onClick={() => setStackPickerOpen(true)}>Open stack picker</window.TweakButton>
          <window.TweakButton onClick={() => setCmdkOpen(true)}>Open Cmd-K (⌘K)</window.TweakButton>
          <window.TweakButton onClick={() => setUpgradeOpen(true)}>Open upgrade modal</window.TweakButton>
          <window.TweakButton onClick={() => { setCookieDismissed(false); }}>Show cookie banner</window.TweakButton>
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

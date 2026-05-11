// PROMPTKIT — Overlays: StackPicker, CmdK, Auth, Onboarding, Submit, Cookie, Paywall, Claim
const { useState: uS_o, useEffect: uE_o, useMemo: uM_o, useRef: uR_o } = React;

// =========================================================
// STACK PICKER MODAL — with live-preview annotation
// =========================================================
const StackPicker = ({ stack, onSave, onClose }) => {
  const [s, setS] = uS_o({ ...stack });
  const toggle = (key, val) => setS(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));
  const popularClients = window.CLIENTS.slice(0, 6);
  const popularTags = window.STACK_TAGS.slice(0, 16);
  // Live preview: which 3 resources rank highest for this stack right now
  const ranked = uM_o(() => {
    const score = r => (r.clients || []).filter(c => s.clients.includes(c)).length * 3 + (r.stackTags || []).filter(t => s.tags.includes(t)).length;
    return [...window.RESOURCES].map(r => ({ r, n: score(r) })).sort((a, b) => b.n - a.n).slice(0, 3).map(x => x.r);
  }, [s.clients, s.tags]);
  return (
    <Modal onClose={onClose} width={760} padding={0}>
      <div style={{ padding: 28, borderBottom: '1px solid #2d2d2d' }}>
        <div className="row gap-8" style={{ alignItems: 'baseline' }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0' }}>YOUR SETUP</div>
          <div className="mono-caps" style={{ fontSize: 9, color: '#5200ff', padding: '2px 7px', border: '1px solid #5200ff', borderRadius: 2 }}>LIVE-PREVIEW: HOME RE-RANKS AS YOU TYPE</div>
        </div>
        <div className="t-display" style={{ fontSize: 52, lineHeight: 0.95, marginTop: 6 }}>What's your stack?</div>
        <div className="text-meta" style={{ fontSize: 14, marginTop: 10, maxWidth: 460 }}>We'll tailor every list, install command, and recommendation to match.</div>
      </div>
      <div style={{ padding: '24px 32px' }}>
        <div className="mono-caps text-meta" style={{ fontSize: 10, marginBottom: 12 }}>AI CLIENT(S)</div>
        <div className="row gap-8" style={{ flexWrap: 'wrap', marginBottom: 24 }}>
          {popularClients.map(c => {
            const on = s.clients.includes(c.id);
            return <button key={c.id} onClick={() => toggle('clients', c.id)} className="row gap-8" style={{ padding: '8px 14px', borderRadius: 40, background: on ? '#3cffd0' : 'transparent', color: on ? '#000' : '#fafafa', border: `1px solid ${on ? 'transparent' : '#2d2d2d'}`, cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}><span className="compat-icon" style={{ width: 18, height: 18, fontSize: 8, background: on ? '#000' : '#2d2d2d', color: on ? '#3cffd0' : '#fafafa' }}>{c.mark}</span>{c.name}</button>;
          })}
          <button className="row gap-6" style={{ padding: '8px 14px', borderRadius: 40, background: 'transparent', color: '#949494', border: '1px dashed #2d2d2d', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' }}>+ Add</button>
        </div>

        <div className="mono-caps text-meta" style={{ fontSize: 10, marginBottom: 12 }}>TECH STACK</div>
        <div className="row gap-6" style={{ flexWrap: 'wrap', marginBottom: 24 }}>
          {popularTags.map(t => {
            const on = s.tags.includes(t);
            return <button key={t} onClick={() => toggle('tags', t)} style={{ padding: '6px 12px', borderRadius: 40, background: on ? 'rgba(60,255,208,0.12)' : 'transparent', color: on ? '#3cffd0' : '#fafafa', border: `1px solid ${on ? '#309875' : '#2d2d2d'}`, cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{t}</button>;
          })}
        </div>

        <div className="mono-caps text-meta" style={{ fontSize: 10, marginBottom: 12 }}>HARDWARE (FOR LOCAL MODELS)</div>
        <div className="row gap-8" style={{ flexWrap: 'wrap', marginBottom: 24 }}>
          {['Apple Silicon','M3 Max','36 GB'].map(x => <span key={x} className="stack-chip">{x} <Icon.chev size={12} /></span>)}
        </div>

        {/* Live preview: re-ranking visualisation */}
        <div className="card" style={{ background: 'rgba(60,255,208,0.04)', borderColor: '#309875', padding: 14 }}>
          <div className="row gap-8" style={{ alignItems: 'center', marginBottom: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3cffd0', boxShadow: '0 0 0 4px rgba(60,255,208,0.18)' }} />
            <span className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', letterSpacing: 1.6 }}>LIVE — TOP 3 FOR YOUR STACK</span>
            <span className="mono-caps text-meta" style={{ fontSize: 9, marginLeft: 'auto' }}>↻ RE-RANKS</span>
          </div>
          <div className="col gap-6">
            {ranked.map((r, i) => (
              <div key={r.slug} className="row gap-10" style={{ padding: '6px 8px', alignItems: 'center', background: 'rgba(60,255,208,0.04)', borderRadius: 4 }}>
                <span className="mono-caps tnum" style={{ fontSize: 10, color: '#3cffd0', minWidth: 20 }}>#{i + 1}</span>
                <span style={{ fontSize: 13, color: '#fafafa', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                <span className="mono-caps text-meta" style={{ fontSize: 9 }}>{(window.RESOURCE_TYPES.find(t => t.id === r.type) || {}).label}</span>
              </div>
            ))}
          </div>
          <div className="text-meta" style={{ fontSize: 11, marginTop: 8, fontStyle: 'italic' }}>↑ Behind this modal, the home feed silently re-orders to match this list.</div>
        </div>
      </div>
      <div className="row gap-12" style={{ padding: '16px 32px 28px', justifyContent: 'flex-end', borderTop: '1px solid #2d2d2d' }}>
        <button className="btn btn-ghost" onClick={onClose}>Skip for now</button>
        <button className="btn btn-primary" onClick={() => onSave(s)}>Save my stack →</button>
      </div>
    </Modal>
  );
};

// =========================================================
// CMD-K PALETTE — empty / typing / command-mode
// =========================================================
const CmdK = ({ onClose, navigate }) => {
  const [q, setQ] = uS_o('');
  const [idx, setIdx] = uS_o(0);
  const inputRef = uR_o();
  uE_o(() => inputRef.current?.focus(), []);
  const isCommand = q.startsWith('>');
  const all = uM_o(() => {
    if (!q || isCommand) return [];
    const nq = q.toLowerCase();
    return [
      ...window.RESOURCES.filter(r => r.name.toLowerCase().includes(nq)).slice(0, 5).map(r => ({ kind: 'resource', r })),
      ...window.MODELS.filter(m => m.name.toLowerCase().includes(nq)).slice(0, 4).map(m => ({ kind: 'model', m })),
    ];
  }, [q, isCommand]);
  const recent = window.RESOURCES.slice(0, 3).map(r => ({ kind: 'resource', r }));
  const trending = window.RESOURCES.slice(3, 6).map(r => ({ kind: 'resource', r }));
  const actions = [
    { kind: 'action', label: 'Update my stack', target: { name: 'stackpicker' }, glyph: 'STACK' },
    { kind: 'action', label: 'Open my dashboard', target: { name: 'dashboard' }, glyph: 'GO' },
    { kind: 'action', label: 'Submit a resource', target: { name: 'submit' }, glyph: 'NEW' },
    { kind: 'action', label: 'Browse all deals', target: { name: 'deals' }, glyph: 'GO' },
    { kind: 'action', label: 'Toggle dark / light', target: { name: 'theme' }, glyph: 'UI' },
    { kind: 'action', label: 'Sign out', target: { name: 'signout' }, glyph: 'AUTH' },
  ];
  const cmdMatches = isCommand ? actions.filter(a => a.label.toLowerCase().includes(q.slice(1).toLowerCase().trim())) : [];
  const list = isCommand ? cmdMatches : (q ? all : [...recent, ...actions.slice(0, 4)]);

  uE_o(() => {
    const h = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, list.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
      else if (e.key === 'Enter' && list[idx]) {
        const it = list[idx];
        if (it.kind === 'resource') navigate({ name: 'resource', slug: it.r.slug, type: it.r.type });
        else if (it.kind === 'model') navigate({ name: 'model', slug: it.m.slug });
        else if (it.kind === 'action' && it.target?.name === 'stackpicker') { onClose(); return; }
        else if (it.kind === 'action') navigate(it.target);
        onClose();
      } else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [idx, list]);

  const Kbd = ({ children }) => <kbd className="t-mono" style={{ display: 'inline-block', padding: '2px 6px', minWidth: 20, textAlign: 'center', border: '1px solid #2d2d2d', borderRadius: 4, background: '#0a0a0a', color: '#cfcfcf', fontSize: 10, lineHeight: 1.4, fontFamily: "'Space Mono', monospace" }}>{children}</kbd>;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.7)', zIndex: 250, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', animation: 'fadeIn 50ms ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '92%', maxWidth: 640, maxHeight: '64vh', background: '#131313', border: '1px solid #309875', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="row gap-12" style={{ padding: '14px 18px', borderBottom: '1px solid #2d2d2d', alignItems: 'center' }}>
          <Icon.search size={16} stroke={isCommand ? '#5200ff' : '#3cffd0'} />
          <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setIdx(0); }} placeholder={isCommand ? "Run a command…" : "Search resources, news, guides, deals…  (try '>' for actions)"} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fafafa', fontSize: 16, flex: 1, fontFamily: "'DM Sans', sans-serif" }} />
          {isCommand && <span className="mono-caps" style={{ fontSize: 9, color: '#b69dff', padding: '2px 6px', border: '1px solid #5200ff', borderRadius: 2 }}>COMMAND MODE</span>}
          <Kbd>ESC</Kbd>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {!q && <>
            <CmdKGroup title="Recent" items={recent} idx={idx} startAt={0} navigate={navigate} onClose={onClose} setIdx={setIdx} />
            <CmdKGroup title="Trending now" items={trending} idx={idx - recent.length} startAt={recent.length} navigate={navigate} onClose={onClose} setIdx={setIdx} />
            <CmdKGroup title="Actions" items={actions.slice(0, 4)} idx={idx - recent.length} startAt={recent.length} navigate={navigate} onClose={onClose} setIdx={setIdx} />
            <div className="text-meta" style={{ padding: '12px 18px', fontSize: 11, borderTop: '1px solid #1f1f1f' }}>Tip: type <kbd className="t-mono" style={{ padding: '1px 5px', border: '1px solid #2d2d2d', borderRadius: 3, fontSize: 10 }}>&gt;</kbd> to filter actions, <kbd className="t-mono" style={{ padding: '1px 5px', border: '1px solid #2d2d2d', borderRadius: 3, fontSize: 10 }}>m</kbd> for models, <kbd className="t-mono" style={{ padding: '1px 5px', border: '1px solid #2d2d2d', borderRadius: 3, fontSize: 10 }}>c</kbd> for components.</div>
          </>}
          {q && !isCommand && all.length > 0 && (() => {
            const resources = all.filter(x => x.kind === 'resource');
            const models = all.filter(x => x.kind === 'model');
            return (<>
              {resources.length > 0 && <CmdKGroup title="Resources" items={resources} idx={idx} startAt={0} navigate={navigate} onClose={onClose} setIdx={setIdx} />}
              {models.length > 0 && <CmdKGroup title="Models" items={models} idx={idx - resources.length} startAt={resources.length} navigate={navigate} onClose={onClose} setIdx={setIdx} />}
            </>);
          })()}
          {q && !isCommand && all.length === 0 && <div style={{ padding: 32, textAlign: 'center' }}><div className="text-meta" style={{ fontSize: 13, marginBottom: 10 }}>No matches for "{q}".</div><button className="btn btn-secondary btn-sm" onClick={() => { navigate({ name: 'submit' }); onClose(); }}>Submit it →</button></div>}
          {isCommand && cmdMatches.length > 0 && <CmdKGroup title="Commands" items={cmdMatches} idx={idx} startAt={0} navigate={navigate} onClose={onClose} setIdx={setIdx} />}
          {isCommand && cmdMatches.length === 0 && <div className="text-meta" style={{ padding: 32, textAlign: 'center', fontSize: 13 }}>No matching command.</div>}
        </div>
        <div className="row gap-16" style={{ padding: '10px 18px', borderTop: '1px solid #2d2d2d', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="row gap-6" style={{ alignItems: 'center', fontSize: 11, color: '#949494' }}><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span className="row gap-6" style={{ alignItems: 'center', fontSize: 11, color: '#949494' }}><Kbd>↵</Kbd> open</span>
          <span className="row gap-6" style={{ alignItems: 'center', fontSize: 11, color: '#949494' }}><Kbd>⌘</Kbd><Kbd>↵</Kbd> install</span>
          <span className="row gap-6" style={{ alignItems: 'center', fontSize: 11, color: '#949494' }}><Kbd>esc</Kbd> close</span>
        </div>
      </div>
    </div>
  );
};
const CmdKGroup = ({ title, items, idx, startAt = 0, navigate, onClose, setIdx }) => (
  <div>
    <div className="mono-caps text-meta" style={{ fontSize: 9, padding: '14px 18px 6px' }}>{title}</div>
    {items.map((it, i) => {
      const active = i === idx;
      let label = '', kicker = '', meta = '';
      if (it.kind === 'resource') { label = it.r.name; kicker = it.r.type.toUpperCase(); meta = `★ ${it.r.score}`; }
      else if (it.kind === 'model') { label = it.m.name; kicker = 'MODEL'; meta = `$${it.m.priceIn}/$${it.m.priceOut}`; }
      else if (it.kind === 'action') { label = it.label; kicker = it.glyph; meta = ''; }
      return (
        <div key={i} onMouseEnter={() => setIdx(startAt + i)} onClick={() => { if (it.kind === 'resource') { navigate({ name: 'resource', slug: it.r.slug, type: it.r.type }); onClose(); } else if (it.kind === 'model') { navigate({ name: 'model', slug: it.m.slug }); onClose(); } else if (it.kind === 'action') { navigate(it.target); onClose(); } }} style={{ padding: '10px 18px', cursor: 'pointer', background: active ? 'rgba(60,255,208,0.06)' : 'transparent', borderLeft: active ? '2px solid #3cffd0' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', minWidth: 38 }}>{kicker}</span>
          <span style={{ flex: 1, fontSize: 14, color: '#fafafa' }}>{label}</span>
          {meta && <span className="t-mono text-meta" style={{ fontSize: 11 }}>{meta}</span>}
        </div>
      );
    })}
  </div>
);

// =========================================================
// COOKIE BANNER
// =========================================================
const CookieBanner = ({ onAccept }) => (
  <div style={{ position: 'fixed', bottom: 16, left: 16, right: 16, maxWidth: 720, margin: '0 auto', background: '#131313', border: '1px solid #5200ff', borderRadius: 20, padding: 20, zIndex: 150, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
    <div style={{ flex: 1, fontSize: 13, color: '#fafafa', minWidth: 220 }}>We use cookies for essentials and (with permission) analytics that help us improve.</div>
    <div className="row gap-8">
      <button className="btn btn-ghost btn-sm">Customise →</button>
      <button className="btn btn-secondary btn-sm" onClick={onAccept}>Essential only</button>
      <button className="btn btn-primary btn-sm" onClick={onAccept}>Accept all</button>
    </div>
  </div>
);

// =========================================================
// PAYWALL / UPGRADE MODAL
// =========================================================
const UpgradeModal = ({ deal, onClose, onUpgrade }) => (
  <Modal onClose={onClose} width={560}>
    <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 8 }}>
      <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close"><Icon.close size={14} /></button>
    </div>
    <div className="mono-caps" style={{ fontSize: 11, color: '#b69dff', marginBottom: 8 }}>UNLOCK PRO</div>
    <div className="t-display" style={{ fontSize: 60, lineHeight: 0.95, marginBottom: 16 }}>{deal?.value} in {deal?.provider} credits.</div>
    <div className="text-meta" style={{ fontSize: 15, marginBottom: 24 }}>This single deal pays for Pro {Math.floor((deal?.valueRaw || 5000) / 99)}x over. Plus $4M+ in additional partner deals, gateway access, and unlimited price alerts.</div>
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="row gap-16" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="col gap-4">
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0' }}>PRO</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>$99 / year</div>
          <div className="text-meta" style={{ fontSize: 12 }}>14-day money-back guarantee</div>
        </div>
        <button className="btn btn-uv btn-lg" onClick={onUpgrade}>Upgrade now →</button>
      </div>
      <div className="hairline" style={{ paddingTop: 16 }}>
        {['$5K AWS Activate','$10K Vercel Pro','$200K Google Cloud','$150K Microsoft for Startups','+ 47 more deals'].map(x => (
          <div key={x} className="row gap-8" style={{ padding: '4px 0', fontSize: 13 }}><Icon.check size={14} stroke="#3cffd0" /> {x}</div>
        ))}
      </div>
    </div>
  </Modal>
);

// =========================================================
// CLAIM DEAL FLOW (3 steps)
// =========================================================
const ClaimDealModal = ({ deal, onClose }) => {
  const [step, setStep] = uS_o(0);
  const steps = ['Eligibility', 'Apply', 'Track'];
  return (
    <Modal onClose={onClose} width={640}>
      <div className="row gap-8" style={{ marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={i} className="row gap-6" style={{ flex: 1 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: i <= step ? '#3cffd0' : '#2d2d2d', color: i <= step ? '#000' : '#949494', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{i + 1}</div>
            <span className="mono-caps" style={{ fontSize: 10, color: i <= step ? '#fafafa' : '#949494' }}>{s}</span>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? '#3cffd0' : '#2d2d2d' }} />}
          </div>
        ))}
      </div>
      {step === 0 && <div>
        <div className="t-display" style={{ fontSize: 40, lineHeight: 1, marginBottom: 16 }}>{deal.name}</div>
        <div className="text-meta" style={{ fontSize: 14, marginBottom: 20 }}>This deal requires:</div>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
          {['Pre-seed to Series A','Less than 5 years old','Less than 50 employees'].map(x => <li key={x} className="row gap-8" style={{ padding: '8px 0', borderBottom: '1px solid #1f1f1f' }}><Icon.check size={14} stroke="#3cffd0" />{x}</li>)}
        </ul>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={() => setStep(1)}>Confirm I'm eligible →</button>
        </div>
      </div>}
      {step === 1 && <div>
        <div className="t-display" style={{ fontSize: 32, marginBottom: 8 }}>Apply with {deal.provider}</div>
        <div className="text-meta" style={{ fontSize: 14, marginBottom: 24 }}>You'll continue on {deal.provider}'s site. Average approval: 3 business days.</div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 8 }}>REDEMPTION GUIDE</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>1. Use a domain email (not Gmail)<br />2. Link your GitHub account when asked<br />3. Reference invite code <code className="t-mono" style={{ color: '#3cffd0' }}>VIBECODER</code></div>
        </div>
        <div className="row gap-8" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
          <button className="btn btn-primary" onClick={() => setStep(2)}>Open application ↗</button>
        </div>
      </div>}
      {step === 2 && <div>
        <div className="t-display" style={{ fontSize: 36, marginBottom: 12 }}>You're tracked.</div>
        <div className="text-meta" style={{ fontSize: 14, marginBottom: 24 }}>We saved this deal in your dashboard. We'll email you when {deal.provider} responds.</div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="row gap-12" style={{ alignItems: 'center' }}>
            <div className="pill pill-yellow">PENDING</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{deal.name}</div>
              <div className="text-meta" style={{ fontSize: 12 }}>Submitted just now</div>
            </div>
            <div className="t-display" style={{ fontSize: 28, color: '#3cffd0' }}>{deal.value}</div>
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>}
    </Modal>
  );
};

// =========================================================
// AUTH MODAL (signup / signin / forgot)
// =========================================================
const AuthModal = ({ mode = 'signup', onClose, onAuthed, onSwitch }) => {
  const [m, setM] = uS_o(mode);
  return (
    <Modal onClose={onClose} width={460}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 6 }}>{m === 'signup' ? 'CREATE ACCOUNT' : m === 'signin' ? 'WELCOME BACK' : 'RESET PASSWORD'}</div>
          <div className="t-display" style={{ fontSize: m === 'signup' ? 36 : 44, lineHeight: 0.95 }}>{m === 'signup' ? 'Join Vibe Coder Hub.' : m === 'signin' ? 'Sign in.' : 'Forgot it?'}</div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close"><Icon.close size={14} /></button>
      </div>
      {m !== 'forgot' && <>
        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}><Icon.github size={14} /> Continue with GitHub</button>
        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}>Continue with Google</button>
        <div className="row gap-12" style={{ alignItems: 'center', marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#2d2d2d' }} />
          <span className="mono-caps text-meta" style={{ fontSize: 9 }}>OR WITH EMAIL</span>
          <div style={{ flex: 1, height: 1, background: '#2d2d2d' }} />
        </div>
        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 16, borderColor: '#309875', color: '#3cffd0' }}><Icon.zap size={14} stroke="#3cffd0" /> Magic link — no password</button>
      </>}
      <div className="col gap-12">
        <input className="input" placeholder="Email" defaultValue="ben@example.com" />
        {m !== 'forgot' && <input className="input" type="password" placeholder="Password" defaultValue="••••••••" />}
        {m === 'signup' && (
          <div style={{ position: 'relative' }}>
            <input className="input" placeholder="Username" defaultValue="@benhope" style={{ paddingRight: 36 }} />
            <div className="row gap-4" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', alignItems: 'center', color: '#3cffd0' }}><Icon.check size={14} stroke="#3cffd0" /></div>
            <div className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', marginTop: 4 }}>AVAILABLE</div>
          </div>
        )}
      </div>
      {m === 'signup' && <label className="row gap-8" style={{ marginTop: 14, fontSize: 13, alignItems: 'flex-start' }}><input type="checkbox" /> <span>I agree to <a style={{ color: '#3cffd0' }}>Terms</a> and <a style={{ color: '#3cffd0' }}>Privacy</a></span></label>}
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={onAuthed}>{m === 'signup' ? 'Create account →' : m === 'signin' ? 'Sign in →' : 'Send reset link'}</button>
      <div className="text-meta" style={{ fontSize: 13, marginTop: 16, textAlign: 'center' }}>
        {m === 'signup' && <>Already have an account? <a style={{ color: '#3cffd0', cursor: 'pointer' }} onClick={() => setM('signin')}>Sign in</a></>}
        {m === 'signin' && <>New here? <a style={{ color: '#3cffd0', cursor: 'pointer' }} onClick={() => setM('signup')}>Create an account</a> · <a style={{ color: '#3cffd0', cursor: 'pointer' }} onClick={() => setM('forgot')}>Forgot password</a></>}
        {m === 'forgot' && <a style={{ color: '#3cffd0', cursor: 'pointer' }} onClick={() => setM('signin')}>← Back to sign in</a>}
      </div>
    </Modal>
  );
};

// =========================================================
// COMPARE DRAWER
// =========================================================
const CompareDrawer = ({ items, onClose, onOpenFull, onRemove }) => (
  <Drawer onClose={onClose} width={560}>
    <div style={{ padding: 24 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 4 }}>COMPARE</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{items.length} models</div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon.close size={14} /></button>
      </div>
      <div className="row gap-8" style={{ marginBottom: 24, overflowX: 'auto' }}>
        {items.map(m => (
          <div key={m.slug} className="card" style={{ minWidth: 160, padding: 14 }}>
            <div className="row gap-8" style={{ marginBottom: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <ProviderMark provider={m.provider} color={m.providerColor} size={24} />
              <button onClick={() => onRemove(m.slug)} aria-label="Remove" className="btn btn-ghost btn-sm" style={{ padding: 4 }}><Icon.close size={12} /></button>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{m.name}</div>
            <div className="t-mono tnum" style={{ fontSize: 12, color: '#3cffd0' }}>${m.priceIn}/${m.priceOut}</div>
          </div>
        ))}
        {items.length < 4 && <button className="card" style={{ minWidth: 160, padding: 14, border: '1px dashed #2d2d2d', background: 'transparent', color: '#949494', cursor: 'pointer' }}>+ Add model</button>}
      </div>
      <table className="tbl" style={{ marginBottom: 24 }}>
        <tbody>
          {[
            ['Input price', items.map(m => `$${m.priceIn}`)],
            ['Output price', items.map(m => `$${m.priceOut}`)],
            ['Intelligence', items.map(m => m.intelligence)],
            ['Speed (tok/s)', items.map(m => m.speed)],
            ['Latency (s)', items.map(m => m.latency)],
            ['Context (k)', items.map(m => `${(m.ctxAdv / 1000).toFixed(0)}k`)],
            ['Tools', items.map(() => '✓')],
            ['Vision', items.map(m => m.tags.includes('vision') ? '✓' : '–')],
            ['Open weights', items.map(m => m.openWeights ? '✓' : '–')],
          ].map(([label, vals]) => (
            <tr key={label}>
              <td className="mono-caps text-meta" style={{ fontSize: 10 }}>{label}</td>
              {vals.map((v, i) => <td key={i} className="t-mono tnum" style={{ fontSize: 13 }}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onOpenFull}>Open full compare →</button>
    </div>
  </Drawer>
);

Object.assign(window, { StackPicker, CmdK, CookieBanner, UpgradeModal, ClaimDealModal, AuthModal, CompareDrawer });

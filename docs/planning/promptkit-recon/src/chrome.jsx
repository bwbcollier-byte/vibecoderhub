// PROMPTKIT — Chrome (Header, MobileNav, Footer, RightRail)
const { useState: uS_c, useEffect: uE_c, useRef: uR_c } = React;

const Header = ({ user, stack, onNav, onCmdK, onStack, onAuth, current }) => {
  const [open, setOpen] = uS_c(false);
  const items = [
    { id: 'components', label: 'Components', type: 'component' },
    { id: 'models', label: 'Models', type: 'model' },
    { id: 'mcps', label: 'MCPs', type: 'mcp' },
    { id: 'tools', label: 'Tools', type: 'tool' },
    { id: 'deals', label: 'Deals', target: { name: 'deals' } },
    { id: 'news', label: 'News', target: { name: 'news' } },
    { id: 'guides', label: 'Guides', target: { name: 'guides' } },
  ];
  const megaCols = [
    { h: 'EXTENSIONS', ids: ['skill','subagent','plugin','hook','command','marketplace'] },
    { h: 'PROMPTS', ids: ['prompt','spec','rule','workflow'] },
    { h: 'INFRA', ids: ['sandbox','observability','backend','docs-llm','eval'] },
    { h: 'CONTENT', ids: ['component','asset','starter','showcase','stack','script'] },
  ];
  const stackLabel = `${(window.CLIENTS.find(c => c.id === stack.clients[0]) || {}).name || ''} · ${stack.tags[0] || ''} · ${stack.tags[1] || ''}`;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 90, background: '#131313', borderBottom: '1px solid #2d2d2d' }}>
      <div className="row gap-16" style={{ padding: '0 32px', height: 60, alignItems: 'center', maxWidth: 1440, margin: '0 auto' }}>
        <div className="row gap-10 hide-mobile" style={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => onNav({ name: user ? 'home' : 'landing' })}>
          <div style={{ width: 24, height: 24, background: '#3cffd0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}>V</div>
          <span className="t-display" style={{ fontSize: 22, letterSpacing: 0.5 }}>VIBE CODER HUB</span>
        </div>
        <button className="hide-desktop btn btn-ghost btn-sm" onClick={() => setOpen(!open)} aria-label="Menu" style={{ padding: 8 }}><Icon.menu size={18} /></button>
        <nav className="row gap-2 hide-mobile" style={{ marginLeft: 16, gap: 2 }}>
          {items.map(it => {
            const active = (it.target && current?.name === it.target.name) || (it.type && current?.name === 'directory' && current?.type === it.type);
            return (
              <button key={it.id} onClick={() => it.target ? onNav(it.target) : onNav({ name: 'directory', type: it.type })} className="mono-caps" style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: active ? '#fafafa' : '#cfcfcf', borderBottom: active ? '2px solid #3cffd0' : '2px solid transparent', fontSize: 11, cursor: 'pointer', transition: 'color 150ms' }} onMouseEnter={(e) => !active && (e.currentTarget.style.color = '#3860be')} onMouseLeave={(e) => !active && (e.currentTarget.style.color = '#cfcfcf')}>{it.label}</button>
            );
          })}
          <div style={{ position: 'relative' }} onMouseEnter={(e) => e.currentTarget.querySelector('.more-pop').style.display = 'grid'} onMouseLeave={(e) => e.currentTarget.querySelector('.more-pop').style.display = 'none'}>
            <button className="mono-caps" style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#cfcfcf', fontSize: 11, cursor: 'pointer' }}>All 27 types ▾</button>
            <div className="more-pop" style={{ display: 'none', position: 'absolute', top: '100%', left: -120, background: '#131313', border: '1px solid #309875', borderRadius: 8, padding: 24, gridTemplateColumns: 'repeat(4, minmax(170px, 1fr))', gap: 24, zIndex: 100, boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}>
              {megaCols.map(col => (
                <div key={col.h} className="col gap-8">
                  <div className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', letterSpacing: 1.4, paddingBottom: 8, borderBottom: '1px solid #2d2d2d', marginBottom: 4 }}>{col.h}</div>
                  {col.ids.map(id => {
                    const t = window.RESOURCE_TYPES.find(x => x.id === id);
                    if (!t) return null;
                    return (
                      <button key={id} onClick={() => onNav({ name: 'directory', type: id })} className="row gap-8" style={{ textAlign: 'left', padding: '6px 8px', background: 'transparent', border: 'none', color: '#fafafa', fontSize: 13, cursor: 'pointer', borderRadius: 4, alignItems: 'center' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(60,255,208,0.06)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: t.tint + '22', color: t.tint, borderRadius: 3, fontFamily: "'Space Mono', monospace", fontSize: 9 }}>{t.glyph}</span>
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </nav>
        <div style={{ flex: 1 }} />
        <button onClick={onCmdK} className="row gap-8 hide-mobile" style={{ background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 24, padding: '7px 12px', color: '#949494', cursor: 'pointer', minWidth: 200 }}>
          <Icon.search size={14} /><span style={{ fontSize: 13, flex: 1, textAlign: 'left' }}>Search…</span>
          <span className="mono-caps" style={{ fontSize: 9, padding: '2px 6px', border: '1px solid #2d2d2d', borderRadius: 2 }}>⌘K</span>
        </button>
        <button onClick={onStack} className="stack-chip stack-chip-mint hide-mobile" style={{ cursor: 'pointer' }}>
          <Icon.layers size={11} stroke="#3cffd0" />{stackLabel}<Icon.chev size={11} stroke="#3cffd0" />
        </button>
        {user ? (
          <button onClick={() => onNav({ name: 'dashboard' })} aria-label="Account" style={{ width: 32, height: 32, borderRadius: '50%', background: '#5200ff', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700 }}>BH</button>
        ) : (
          <div className="row gap-8 hide-mobile">
            <button className="btn btn-ghost btn-sm" onClick={() => onAuth('signin')}>Sign in</button>
            <button className="btn btn-primary btn-sm" onClick={() => onAuth('signup')}>Get started</button>
          </div>
        )}
      </div>
      {open && (
        <div className="hide-desktop" style={{ borderTop: '1px solid #2d2d2d', padding: 16, background: '#131313' }}>
          <div className="col gap-4">
            {items.map(it => <button key={it.id} className="mono-caps" style={{ padding: '12px 4px', textAlign: 'left', background: 'transparent', border: 'none', color: '#fafafa', fontSize: 13, cursor: 'pointer' }} onClick={() => { it.target ? onNav(it.target) : onNav({ name: 'directory', type: it.type }); setOpen(false); }}>{it.label}</button>)}
          </div>
        </div>
      )}
    </header>
  );
};

const StackBanner = ({ stack, onEdit, onDismiss }) => (
  <div className="hide-desktop" style={{ background: 'rgba(60,255,208,0.06)', borderBottom: '1px solid #309875', padding: '10px 16px' }}>
    <div className="row gap-8" style={{ alignItems: 'center' }}>
      <Icon.layers size={12} stroke="#3cffd0" />
      <div className="mono-caps tnum" style={{ fontSize: 10, color: '#3cffd0', flex: 1 }}>STACK · {stack.clients.slice(0,2).join(' · ')} · {stack.tags.slice(0,2).join(' · ')}</div>
      <button onClick={onEdit} className="mono-caps" style={{ background: 'transparent', border: 'none', color: '#3cffd0', fontSize: 10, cursor: 'pointer' }}>EDIT →</button>
      <button onClick={onDismiss} aria-label="Dismiss" style={{ background: 'transparent', border: 'none', color: '#949494', cursor: 'pointer' }}><Icon.close size={12} /></button>
    </div>
  </div>
);

const MobileNav = ({ onNav, current }) => (
  <nav className="mobile-nav">
    {[
      { id: 'home', glyph: <Icon.home size={20} />, target: { name: 'home' } },
      { id: 'search', glyph: <Icon.search size={20} />, target: { name: 'search' } },
      { id: 'bookmarks', glyph: <Icon.bookmark size={20} />, target: { name: 'dashboard' } },
      { id: 'news', glyph: <Icon.flame size={20} />, target: { name: 'news' } },
      { id: 'profile', glyph: <Icon.user size={20} />, target: { name: 'dashboard' } },
    ].map(i => (
      <button key={i.id} onClick={() => onNav(i.target)} aria-label={i.id} style={{ background: 'transparent', border: 'none', color: current?.name === i.target.name ? '#3cffd0' : '#949494', padding: 10, cursor: 'pointer' }}>{i.glyph}</button>
    ))}
  </nav>
);

const Footer = ({ onNav }) => (
  <footer style={{ background: '#0a0a0a', borderTop: '1px solid #2d2d2d', padding: '64px 32px 32px', marginTop: 64 }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div className="row" style={{ gap: 48, flexWrap: 'wrap', marginBottom: 48 }}>
        <div style={{ flex: '0 0 280px' }}>
          <div className="row gap-10" style={{ alignItems: 'center', marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, background: '#3cffd0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22 }}>V</div>
            <span className="t-display" style={{ fontSize: 28 }}>VIBE CODER HUB</span>
          </div>
          <div className="text-meta" style={{ fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>The directory and SaaS layer for the vibe-coding ecosystem.</div>
          <div className="row gap-12">
            <a><Icon.github size={16} /></a><a><Icon.rss size={16} /></a><a><Icon.ext size={16} /></a>
          </div>
        </div>
        {[
          { h: 'Browse', l: ['Components','Models','MCPs','Tools','Skills','Subagents','Workflows','Stacks'] },
          { h: 'Discover', l: ['Best for','Alternatives','By hardware','Compare','Pricing tracker','Cost calculator'] },
          { h: 'Money', l: ['Deals','News','Guides','Newsletter','Pricing','Pro membership'] },
          { h: 'Account', l: ['Dashboard','Submit','API keys','Gateway','Settings'] },
          { h: 'Company', l: ['About','Manifesto','Contact','Terms','Privacy','Status'] },
        ].map(c => (
          <div key={c.h} style={{ minWidth: 130 }}>
            <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 14 }}>{c.h}</div>
            <div className="col gap-8">{c.l.map(x => <a key={x} style={{ fontSize: 13, color: '#cfcfcf', cursor: 'pointer' }}>{x}</a>)}</div>
          </div>
        ))}
      </div>
      <div className="row hairline" style={{ paddingTop: 24, justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span className="text-meta" style={{ fontSize: 12 }}>© 2026 Vibe Coder Hub, Inc. Made by vibe coders.</span>
        <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{window.STATS.resources.toLocaleString()} resources · {window.STATS.ides} IDEs · {window.STATS.models} models</span>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Header, MobileNav, Footer, StackBanner });

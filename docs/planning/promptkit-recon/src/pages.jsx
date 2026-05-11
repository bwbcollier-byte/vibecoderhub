// VIBE CODER HUB — Pages 1: Landing, Home, Directory, Search
const { useState: uS_p1, useEffect: uE_p1, useMemo: uM_p1 } = React;

// ============== LANDING (logged out) ==============
const LandingPage = ({ navigate, onAuth, onStack }) => {
  const stats = window.STATS;
  return (
    <main>
      {/* HERO — A/B annotation pair, both visible per design review */}
      <section style={{ padding: '64px 32px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 16 }}>THE DIRECTORY · 12,407 RESOURCES · 47 IDES</div>
        <div className="mono-caps" style={{ fontSize: 9, color: '#5200ff', letterSpacing: 1.6, marginBottom: 8, padding: '3px 8px', display: 'inline-block', border: '1px solid #5200ff', borderRadius: 2 }}>OPTION A · TWO LINES — READS AS ONE SENTENCE</div>
        <h1 className="t-display" style={{ fontSize: 'clamp(64px, 11vw, 152px)', lineHeight: 0.88, letterSpacing: 0.5, marginBottom: 16, textTransform: 'uppercase' }}>
          Every primitive<br /><span style={{ color: '#3cffd0' }}>a vibe coder needs.</span>
        </h1>
        <div style={{ height: 24, borderBottom: '1px dashed #2d2d2d', marginBottom: 24 }} />
        <div className="mono-caps" style={{ fontSize: 9, color: '#5200ff', letterSpacing: 1.6, marginBottom: 8, padding: '3px 8px', display: 'inline-block', border: '1px solid #5200ff', borderRadius: 2 }}>OPTION B · THREE LINES — READS AS A MANIFESTO</div>
        <h1 className="t-display" style={{ fontSize: 'clamp(64px, 11vw, 152px)', lineHeight: 0.88, letterSpacing: 0.5, marginBottom: 24, textTransform: 'uppercase' }}>
          Every tool.<br />Every model.<br /><span style={{ color: '#3cffd0' }}>Every MCP.</span>
        </h1>
        <div className="card" style={{ marginBottom: 32, padding: '14px 18px', background: 'rgba(82,0,255,0.06)', borderColor: '#5200ff' }}>
          <div className="row gap-12" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="mono-caps" style={{ fontSize: 9, color: '#b69dff', letterSpacing: 1.6 }}>ANNOTATION</div>
            <div style={{ flex: 1, minWidth: 280, fontSize: 13, color: '#cfcfcf', lineHeight: 1.6 }}>Pick one. <strong style={{ color: '#fafafa' }}>A</strong> is a single declarative sentence — confident, fast to read, sells the breadth as a benefit. <strong style={{ color: '#fafafa' }}>B</strong> reads as a manifesto chant — slower, louder, more Verge-brutalist. Default ships A; B is for the hero animation moment when the line crashes in word-by-word.</div>
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#cfcfcf', maxWidth: 720, marginBottom: 32, lineHeight: 1.4 }}>One directory. One install. Components, MCPs, agents, models, deals — all queryable by IDE and stack.</div>
        <div className="row gap-12" style={{ flexWrap: 'wrap', marginBottom: 48 }}>
          <button className="btn btn-primary btn-lg" onClick={() => onAuth('signup')}>Sign up free →</button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate({ name: 'home' })}>Browse anonymously</button>
        </div>
        {/* Animated demo strip */}
        <div className="card" style={{ borderColor: '#309875', padding: 0, overflow: 'hidden' }}>
          <div className="row gap-12" style={{ padding: '14px 20px', borderBottom: '1px solid #309875', background: 'rgba(60,255,208,0.04)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} /><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} /><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <div className="mono-caps text-meta" style={{ fontSize: 10, marginLeft: 12 }}>VIBE CODER HUB — LIVE DEMO</div>
            <div style={{ flex: 1 }} />
            <span className="mono-caps" style={{ fontSize: 9, color: '#3cffd0' }}>● RECORDING</span>
          </div>
          <div style={{ padding: 32, background: '#0a0a0a' }}>
            <div className="card" style={{ maxWidth: 520, margin: '0 auto', borderColor: '#309875' }}>
              <div className="row gap-12" style={{ marginBottom: 14 }}>
                <Icon.search size={16} stroke="#3cffd0" />
                <span className="t-mono" style={{ fontSize: 14, color: '#fafafa' }}>auth supabase<span style={{ background: '#3cffd0', color: '#3cffd0', width: 2 }}>|</span></span>
              </div>
              <div className="hairline" style={{ paddingTop: 14 }}>
                {window.RESOURCES.filter(r => /auth|supabase/i.test(r.name + r.tagline)).slice(0, 3).map(r => (
                  <div key={r.slug} className="row gap-12" style={{ padding: '10px 0' }}>
                    <span className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', minWidth: 36 }}>{(window.RESOURCE_TYPES.find(t => t.id === r.type) || {}).glyph}</span>
                    <span style={{ flex: 1, fontSize: 14 }}>{r.name}</span>
                    <span className="mono-caps text-meta" style={{ fontSize: 9 }}>★ {r.score}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(60,255,208,0.08)', border: '1px solid #309875', borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#3cffd0' }}>⌘↵ INSTALL TO CURSOR</div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section style={{ borderTop: '1px solid #2d2d2d', borderBottom: '1px solid #2d2d2d', padding: '24px 32px', background: '#0a0a0a' }}>
        <div className="row gap-32" style={{ maxWidth: 1280, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {[
            { n: stats.resources.toLocaleString(), l: 'RESOURCES INDEXED' },
            { n: stats.ides, l: 'IDES & CLIENTS SUPPORTED' },
            { n: stats.models, l: 'MODELS TRACKED' },
            { n: '$' + stats.dealsValue, l: 'IN ACTIVE DEALS' },
            { n: '218K', l: 'INSTALLS / WEEK' },
          ].map(s => (
            <div key={s.l} className="col gap-4">
              <div className="t-display" style={{ fontSize: 38, color: '#3cffd0' }}>{s.n}</div>
              <div className="mono-caps text-meta" style={{ fontSize: 9 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THREE-PILLAR */}
      <section style={{ padding: '80px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 14 }}>HOW IT WORKS</div>
        <div className="t-display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.95, marginBottom: 56 }}>FIND. TRY. SHIP.</div>
        <div className="row gap-32" style={{ flexWrap: 'wrap' }}>
          {[
            { v: 'mint', n: '01', h: 'Find', d: 'Cross-type search. Real install metrics. Compatibility-aware filtering for your IDE and stack.' },
            { v: 'uv', n: '02', h: 'Try', d: 'Inline playgrounds for models. MCP tool inspector. Live component previews — without installing.' },
            { v: 'yellow', n: '03', h: 'Ship', d: 'One-click install to Cursor, Claude Code, Windsurf, Cline. Or copy the JSON.' },
          ].map(p => (
            <div key={p.n} className="card" style={{ flex: '1 1 280px', padding: 32, background: { mint: '#3cffd0', uv: '#5200ff', yellow: '#f5e642' }[p.v], color: { mint: '#000', uv: '#fff', yellow: '#000' }[p.v], border: 'none', minHeight: 280 }}>
              <div className="t-display" style={{ fontSize: 80, lineHeight: 0.9, marginBottom: 24 }}>{p.n}</div>
              <div className="t-display" style={{ fontSize: 56, marginBottom: 16 }}>{p.h.toUpperCase()}.</div>
              <div style={{ fontSize: 16, lineHeight: 1.5 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RESOURCE WALL */}
      <section style={{ padding: '80px 32px', background: '#0a0a0a', borderTop: '1px solid #2d2d2d' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionH kicker="LIVE FEED" title="What's hot right now" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {window.RESOURCES.slice(0, 12).map(r => <ResourceCard key={r.slug} r={r} onOpen={() => navigate({ name: 'resource', slug: r.slug, type: r.type })} />)}
          </div>
        </div>
      </section>

      {/* CALCULATOR TEASER */}
      <section style={{ padding: '80px 32px' }}>
        <div className="card" style={{ maxWidth: 1080, margin: '0 auto', padding: 48, border: '1px solid #5200ff', background: 'rgba(82,0,255,0.04)' }}>
          <div className="row gap-32" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 360px' }}>
              <div className="mono-caps" style={{ fontSize: 11, color: '#b69dff', marginBottom: 14 }}>CALCULATOR</div>
              <div className="t-display" style={{ fontSize: 64, lineHeight: 0.95, marginBottom: 16 }}>How much<br />will your AI<br />bill be?</div>
              <div className="text-meta" style={{ fontSize: 16, marginBottom: 24 }}>Plug in your workload, see live monthly cost across every frontier model. Set a budget alert.</div>
              <button className="btn btn-uv btn-lg" onClick={() => navigate({ name: 'model', slug: 'claude-opus-4-7' })}>Try the calculator →</button>
            </div>
            <div style={{ flex: '1 1 360px' }}>
              <div className="card">
                <Stat label="MONTHLY COST" value="$432" delta={5} hint="Claude Opus 4.7, agentic coding preset" />
                <div style={{ height: 16 }} />
                <Sparkline data={[420, 445, 460, 432, 410, 432, 432]} width={300} height={48} />
                <div className="row gap-12" style={{ marginTop: 16 }}>
                  {['IN 8.5K','OUT 1.2K','REASONING 3.4K','×1,200'].map(x => <span key={x} className="mono-caps text-meta" style={{ fontSize: 9 }}>{x}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEAL TEASER */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionH kicker="MEMBERS UNLOCK" title="$4.2M+ in startup deals" action="See all" onAction={() => navigate({ name: 'deals' })} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {window.DEALS.slice(0, 4).map(d => <DealCard key={d.slug} d={d} locked={d.tier === 'pro'} onUpgrade={() => onAuth('signup')} onClaim={() => onAuth('signup')} />)}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '80px 32px', background: '#0a0a0a', borderTop: '1px solid #2d2d2d' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>PRICING</div>
            <div className="t-display" style={{ fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 0.95 }}>FREE TO BROWSE. PRO TO UNLOCK.</div>
          </div>
          <div className="row gap-16" style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
            {[
              { t: 'FREE', p: '$0', f: ['Browse all 12K+ resources','Cmd-K search','5 bookmarks','Stack picker (1)','View public deals','Read all news','Try-it (10 calls/day)'], cta: 'Get started' },
              { t: 'MEMBER', p: '$0', s: 'Free, with sign-up', f: ['Everything in Free','Unlimited bookmarks','5 saved stacks','Member deals unlocked','Submit resources','BYO key playgrounds','10 price alerts'], cta: 'Sign up free', emph: true },
              { t: 'PRO', p: '$99', s: '/year', f: ['Everything in Member','$4M+ Pro deals unlocked','Gateway access','Hosted secrets vault','Unlimited price alerts','Author dashboard','API access (read)'], cta: 'Upgrade' },
            ].map(p => (
              <div key={p.t} className="card" style={{ flex: '1 1 280px', padding: 32, borderColor: p.emph ? '#3cffd0' : '#2d2d2d', background: p.emph ? 'rgba(60,255,208,0.04)' : '#131313' }}>
                <div className="mono-caps" style={{ fontSize: 11, color: p.emph ? '#3cffd0' : p.t === 'PRO' ? '#b69dff' : '#949494', marginBottom: 14 }}>{p.t}</div>
                <div className="t-display" style={{ fontSize: 64, marginBottom: 4 }}>{p.p}</div>
                <div className="text-meta" style={{ fontSize: 13, marginBottom: 20 }}>{p.s || ' '}</div>
                <button className={`btn ${p.t === 'PRO' ? 'btn-uv' : p.emph ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }} onClick={() => onAuth('signup')}>{p.cta}</button>
                {p.f.map(x => <div key={x} className="row gap-8" style={{ fontSize: 13, padding: '6px 0', color: '#cfcfcf' }}><Icon.check size={14} stroke={p.emph ? '#3cffd0' : '#949494'} />{x}</div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 32px', maxWidth: 880, margin: '0 auto' }}>
        <SectionH kicker="FAQ" title="Frequently asked" />
        <div>
          {[
            ['Is browsing free?', 'Yes. The directory is free forever. We charge for Pro deals, the gateway, and advanced alerts — never for search.'],
            ['What\'s the gateway?', 'A hosted runtime that runs MCPs and skills on your behalf so you don\'t need to wire local servers. Pro tier.'],
            ['Do I have to sign up?', 'No. Browse anonymously. Sign up for bookmarks, alerts, and saved stacks.'],
            ['How are resources verified?', 'Every entry is auto-tested against its declared compatibility every 24h. Failures show ⚠️.'],
            ['Can I submit my project?', 'Yes — paste a GitHub URL at /submit. We auto-detect type, license, and compatibility.'],
          ].map(([q, a]) => (
            <details key={q} style={{ borderBottom: '1px solid #2d2d2d', padding: '20px 0', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 700, fontSize: 17, listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>{q}<span className="mono-caps text-meta" style={{ fontSize: 13 }}>+</span></summary>
              <div className="text-meta" style={{ fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>{a}</div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
};

// ============== HOME (logged in) ==============
const HomePage = ({ navigate, stack, user, onStack, onSave }) => {
  const stackedResources = uM_p1(() => {
    const tagSet = new Set(stack.tags);
    return [...window.RESOURCES].sort((a, b) => {
      const aMatch = (a.stack || []).filter(s => tagSet.has(s)).length;
      const bMatch = (b.stack || []).filter(s => tagSet.has(s)).length;
      return bMatch - aMatch;
    });
  }, [stack.tags]);
  return (
    <main>
      {/* HERO STRIP */}
      <section style={{ padding: '40px 32px 32px', maxWidth: 1440, margin: '0 auto' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>WELCOME BACK · {user?.handle || '@benhope'}</div>
            <div className="t-display" style={{ fontSize: 'clamp(56px, 9vw, 112px)', lineHeight: 0.92, letterSpacing: 0.5 }}>15 NEW MATCHES<br />SINCE TUESDAY.</div>
          </div>
          <div className="row gap-12">
            <button className="btn btn-primary" onClick={() => navigate({ name: 'directory', type: 'component' })}>Browse new →</button>
            <button className="btn btn-secondary" onClick={onStack}>Update my stack</button>
          </div>
        </div>
      </section>

      {/* PRIMARY ROW: For your stack */}
      <section style={{ padding: '24px 32px', maxWidth: 1440, margin: '0 auto' }}>
        <SectionH kicker={`FOR YOUR STACK · ${stack.tags.slice(0, 2).join(' + ')}`} title="Hand-picked for you" action="Why these?" />
        <div className="h-scroll">
          {stackedResources.slice(0, 8).map(r => (
            <div key={r.slug} style={{ width: 320 }}><ResourceCard r={r} onOpen={() => navigate({ name: 'resource', slug: r.slug, type: r.type })} onSave={onSave} /></div>
          ))}
        </div>
      </section>

      {/* TWO-COLUMN: Trending + Today */}
      <section style={{ padding: '40px 32px', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 32 }}>
          <div>
            <SectionH kicker="TRENDING · 7 DAYS" title="What's climbing" action="See all" onAction={() => navigate({ name: 'directory', type: 'component' })} />
            <div className="col">
              {window.RESOURCES.slice(0, 8).map((r, i) => (
                <div key={r.slug} className="list-link" onClick={() => navigate({ name: 'resource', slug: r.slug, type: r.type })}>
                  <span className="t-mono" style={{ fontSize: 12, color: '#3cffd0', minWidth: 26, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="mono-caps" style={{ fontSize: 9, color: '#949494', minWidth: 36 }}>{(window.RESOURCE_TYPES.find(t => t.id === r.type) || {}).glyph}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{r.name}</span>
                  <span className="mono-caps tnum text-meta" style={{ fontSize: 10 }}>★ {r.score} · {(r.installs7d / 1000).toFixed(1)}K</span>
                  <ClientRow ids={r.clients} max={3} size={18} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionH kicker="TODAY" title="In the news" action="See all news" onAction={() => navigate({ name: 'news' })} />
            <div className="col gap-12">
              {window.NEWS.slice(0, 5).map(n => (
                <div key={n.slug} className="list-link" onClick={() => navigate({ name: 'newsItem', slug: n.slug })} style={{ alignItems: 'flex-start' }}>
                  <span className="mono-caps" style={{ fontSize: 9, color: n.kind === 'breaking' ? '#ff3cac' : '#3cffd0', minWidth: 60 }}>{n.kind === 'breaking' ? '🔥 BREAK' : n.kind?.toUpperCase().slice(0, 7)}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{n.headline}</span>
                  <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* "WHAT ARE YOU BUILDING?" PROMPT BOX */}
      <section style={{ padding: '32px', maxWidth: 1440, margin: '0 auto' }}>
        <div className="card" style={{ borderColor: '#5200ff', background: 'rgba(82,0,255,0.05)', padding: 32 }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#b69dff', marginBottom: 12 }}>AI STACK BUILDER</div>
          <div className="t-display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.95, marginBottom: 20 }}>What are you building?</div>
          <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
            <input className="input" placeholder="A real-time multiplayer whiteboard with Y.js…" style={{ flex: '1 1 360px', borderColor: '#5200ff', padding: '14px 16px', fontSize: 16 }} />
            <button className="btn btn-uv btn-lg">Generate stack →</button>
          </div>
          <div className="row gap-8" style={{ marginTop: 16, flexWrap: 'wrap' }}>
            <span className="mono-caps text-meta" style={{ fontSize: 10 }}>POPULAR:</span>
            {['Slack clone','AI agent','SaaS dashboard','Newsletter','Marketplace'].map(p => (
              <button key={p} className="stack-chip" style={{ cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </div>
      </section>

      {/* TYPE ROWS */}
      {[
        { type: 'component', label: 'Components' },
        { type: 'model', label: 'Models', special: 'model' },
        { type: 'mcp', label: 'MCP Servers' },
      ].map(({ type, label, special }) => {
        const items = special === 'model' ? window.MODELS : window.RESOURCES.filter(r => r.type === type);
        return (
          <section key={type} style={{ padding: '24px 32px', maxWidth: 1440, margin: '0 auto' }}>
            <SectionH kicker={`TOP ${label.toUpperCase()}`} action="See all" onAction={() => navigate({ name: 'directory', type })} />
            <div className="h-scroll">
              {items.slice(0, 8).map(r => (
                <div key={r.slug} style={{ width: 320 }}>
                  {special === 'model'
                    ? <ModelCard m={r} onOpen={() => navigate({ name: 'model', slug: r.slug })} />
                    : <ResourceCard r={r} onOpen={() => navigate({ name: 'resource', slug: r.slug, type: r.type })} onSave={onSave} />}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* COLLAPSED ROWS */}
      <section style={{ padding: '24px 32px', maxWidth: 1440, margin: '0 auto' }}>
        <div className="card" style={{ borderColor: '#2d2d2d' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0' }}>21 MORE TYPES · COLLAPSED</div>
            <button className="btn btn-ghost btn-sm">Expand all ▾</button>
          </div>
          <div className="row gap-8" style={{ marginTop: 16, flexWrap: 'wrap' }}>
            {window.RESOURCE_TYPES.filter(t => !['component','model','mcp'].includes(t.id)).map(t => (
              <button key={t.id} className="stack-chip" onClick={() => navigate({ name: 'directory', type: t.id })}>{t.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE MOVES */}
      <section style={{ padding: '40px 32px', maxWidth: 1440, margin: '0 auto' }}>
        <SectionH kicker="PRICE MOVES · 7 DAYS" title="Biggest LLM price drops" action="Track a model" onAction={() => navigate({ name: 'model', slug: 'claude-opus-4-7' })} />
        <div className="row gap-16" style={{ flexWrap: 'wrap' }}>
          {window.MODELS.filter(m => m.delta < 0).slice(0, 4).map(m => (
            <div key={m.slug} className="card" style={{ flex: '1 1 240px', padding: 18, cursor: 'pointer' }} onClick={() => navigate({ name: 'model', slug: m.slug })}>
              <div className="row gap-10" style={{ marginBottom: 10 }}>
                <ProviderMark provider={m.provider} color={m.providerColor} size={22} />
                <span style={{ fontWeight: 700, fontSize: 14, flex: 1 }}>{m.name}</span>
                <span className="mono-caps tnum" style={{ fontSize: 11, color: '#3cffd0' }}>▼ {Math.abs(m.delta)}%</span>
              </div>
              <Sparkline data={[100, 100, 102, 100, 95, 90, 100 + m.delta]} width={240} height={28} color="#3cffd0" />
              <div className="t-mono tnum text-meta" style={{ fontSize: 11, marginTop: 8 }}>${m.priceIn}/${m.priceOut} · {m.provider}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEALS STRIP */}
      <section style={{ padding: '40px 32px', maxWidth: 1440, margin: '0 auto' }}>
        <SectionH kicker="DEALS" title="Featured this week" action="Browse all" onAction={() => navigate({ name: 'deals' })} />
        <div className="row gap-16" style={{ flexWrap: 'wrap' }}>
          {window.DEALS.slice(0, 3).map(d => <div key={d.slug} style={{ flex: '1 1 280px' }}><DealCard d={d} locked={d.tier === 'pro' && !user?.pro} onUpgrade={() => {}} onClaim={() => {}} /></div>)}
        </div>
      </section>

      {/* SHOWCASE STRIP */}
      <section style={{ padding: '40px 32px 80px', maxWidth: 1440, margin: '0 auto' }}>
        <SectionH kicker="SHOWCASE" title="Built with Vibe Coder Hub" action="See all" onAction={() => navigate({ name: 'directory', type: 'showcase' })} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { v: 'pink', n: 'linkrr.app', a: '@benhope', d: '4 days · Cursor + Claude Opus' },
            { v: 'mint', n: 'standup.fyi', a: '@dev', d: '2 days · Claude Code + Supabase' },
            { v: 'yellow', n: 'screenshot.farm', a: '@designer', d: '1 day · Cursor + Vercel' },
            { v: 'uv', n: 'leadlist.io', a: '@founder', d: '6 days · Windsurf + Convex' },
          ].map(s => {
            const fills = { mint: { bg:'#3cffd0', fg:'#000'}, uv: { bg:'#5200ff', fg:'#fff'}, yellow:{bg:'#f5e642',fg:'#000'}, pink:{bg:'#ff3cac',fg:'#fff'} }[s.v];
            return (
              <div key={s.n} className="card lift" style={{ background: fills.bg, color: fills.fg, border: 'none', padding: 24, minHeight: 200, cursor: 'pointer' }}>
                <div className="mono-caps" style={{ fontSize: 9, color: fills.fg, opacity: 0.7, marginBottom: 12 }}>{s.a}</div>
                <div className="t-display" style={{ fontSize: 36, marginBottom: 12, color: fills.fg, lineHeight: 1 }}>{s.n}</div>
                <div className="mono-caps" style={{ fontSize: 10, color: fills.fg, opacity: 0.7 }}>{s.d}</div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

// ============== DIRECTORY (type index) ==============
const DirectoryPage = ({ type, navigate, stack, onSave }) => {
  const t = window.RESOURCE_TYPES.find(x => x.id === type) || window.RESOURCE_TYPES[0];
  const items = type === 'model' ? window.MODELS : window.RESOURCES.filter(r => r.type === type);
  const [filters, setFilters] = uS_p1({ clients: [], tags: [], sort: 'trending' });
  const [view, setView] = uS_p1('grid');
  return (
    <main style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>{t.glyph} · {items.length.toLocaleString()} INDEXED</div>
          <div className="t-display" style={{ fontSize: 'clamp(64px, 10vw, 128px)', lineHeight: 0.92, letterSpacing: 0.5 }}>{t.plural.toUpperCase()}.</div>
        </div>
        <div className="row gap-8">
          <button className="btn btn-secondary btn-sm">+ Submit a {t.label.replace(/s$/,'').toLowerCase()}</button>
        </div>
      </div>

      <div className="row gap-32" style={{ alignItems: 'flex-start' }}>
        {/* LEFT FILTERS */}
        <aside className="hide-mobile" style={{ width: 240, flexShrink: 0, position: 'sticky', top: 76 }}>
          {[
            { h: 'COMPATIBLE CLIENT', items: window.CLIENTS.slice(0, 8).map(c => c.name) },
            { h: 'STACK', items: window.STACK_TAGS.slice(0, 10) },
            { h: 'PRICING', items: ['Free','Open source','Paid','Has free tier'] },
            { h: 'LICENSE', items: ['MIT','Apache-2.0','BSD','Commercial'] },
          ].map(g => (
            <div key={g.h} style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #2d2d2d' }}>
              <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 12 }}>{g.h}</div>
              <div className="col gap-6">
                {g.items.map(x => (
                  <label key={x} className="row gap-8" style={{ fontSize: 13, color: '#cfcfcf', cursor: 'pointer' }}>
                    <input type="checkbox" />{x}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* MAIN GRID */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ marginBottom: 20, justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div className="row gap-8">
              {['trending','newest','installed','rating'].map(s => (
                <button key={s} className="mono-caps" onClick={() => setFilters({ ...filters, sort: s })} style={{ background: filters.sort === s ? 'rgba(60,255,208,0.06)' : 'transparent', color: filters.sort === s ? '#3cffd0' : '#949494', border: `1px solid ${filters.sort === s ? '#309875' : '#2d2d2d'}`, borderRadius: 40, padding: '6px 14px', fontSize: 10, cursor: 'pointer' }}>{s}</button>
              ))}
            </div>
            <div className="row gap-8">
              <span className="mono-caps text-meta" style={{ fontSize: 10 }}>VIEW</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setView('grid')} style={{ color: view === 'grid' ? '#3cffd0' : '#949494' }}>Grid</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setView('list')} style={{ color: view === 'list' ? '#3cffd0' : '#949494' }}>List</button>
            </div>
          </div>

          {view === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {/* Editor's pick — exactly one coloured card per index */}
              {items[0] && type !== 'model' && (
                <div style={{ position: 'relative' }}>
                  <div className="mono-caps" style={{ position: 'absolute', top: -10, left: 16, zIndex: 2, background: '#131313', padding: '2px 10px', fontSize: 9, color: '#3cffd0', border: '1px solid #309875', borderRadius: 2 }}>★ EDITOR'S PICK</div>
                  <ResourceCard r={items[0]} variant="mint" onOpen={() => navigate({ name: 'resource', slug: items[0].slug, type: items[0].type })} onSave={onSave} />
                </div>
              )}
              {items[0] && type === 'model' && (
                <div style={{ gridColumn: 'span 2', position: 'relative' }}>
                  <div className="mono-caps" style={{ position: 'absolute', top: -10, left: 16, zIndex: 2, background: '#131313', padding: '2px 10px', fontSize: 9, color: '#3cffd0', border: '1px solid #309875', borderRadius: 2 }}>★ EDITOR'S PICK</div>
                  <ModelCard m={items[0]} onOpen={() => navigate({ name: 'model', slug: items[0].slug })} />
                </div>
              )}
              {items.slice(1).map(r => type === 'model'
                ? <ModelCard key={r.slug} m={r} onOpen={() => navigate({ name: 'model', slug: r.slug })} />
                : <ResourceCard key={r.slug} r={r} variant="dark" onOpen={() => navigate({ name: 'resource', slug: r.slug, type: r.type })} onSave={onSave} />)}
              {items.length === 0 && <div style={{ gridColumn: '1 / -1' }}><EmptyState glyph="∅" title={`No ${t.plural} yet`} body={`Be the first to submit a ${t.label.replace(/s$/,'').toLowerCase()}.`} action="Submit one →" /></div>}
            </div>
          )}

          {view === 'list' && (
            <table className="tbl">
              <thead>
                <tr><th>Name</th><th>Author</th><th>Score</th><th>Installs</th><th>Updated</th><th>Compatible</th></tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.slug} onClick={() => navigate({ name: type === 'model' ? 'model' : 'resource', slug: r.slug, type: r.type })} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 700 }}>{r.name}</td>
                    <td className="text-meta">{r.author || r.provider}</td>
                    <td className="t-mono tnum">{r.score || r.intelligence || '—'}</td>
                    <td className="t-mono tnum text-meta">{r.installs7d ? (r.installs7d / 1000).toFixed(1) + 'K' : '—'}</td>
                    <td className="text-meta">{r.updated || r.released}</td>
                    <td>{r.clients ? <ClientRow ids={r.clients} max={4} size={18} /> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

// ============== SEARCH RESULTS ==============
const SearchPage = ({ q: initialQ = 'auth', navigate }) => {
  const [q, setQ] = uS_p1(initialQ);
  const results = uM_p1(() => window.RESOURCES.filter(r => (r.name + ' ' + r.tagline).toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <main style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="row gap-12" style={{ marginBottom: 24 }}>
        <Icon.search size={20} stroke="#3cffd0" />
        <input className="input" value={q} onChange={e => setQ(e.target.value)} style={{ fontSize: 22, padding: '14px 16px', borderColor: '#309875' }} />
      </div>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 24 }}>{results.length} RESULTS · ACROSS 8 TYPES</div>
      <div className="row gap-32" style={{ alignItems: 'flex-start' }}>
        <aside className="hide-mobile" style={{ width: 220, flexShrink: 0 }}>
          <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 12 }}>FILTER BY TYPE</div>
          {window.RESOURCE_TYPES.slice(0, 10).map(t => (
            <label key={t.id} className="row gap-8" style={{ fontSize: 13, padding: '6px 0', color: '#cfcfcf', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> {t.label} <span className="text-meta">({Math.floor(Math.random() * 12)})</span>
            </label>
          ))}
          <div className="hairline" style={{ marginTop: 20, paddingTop: 20 }}>
            <button className="btn btn-uv btn-sm" style={{ width: '100%', justifyContent: 'center' }}>⚡ Save as alert</button>
          </div>
        </aside>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {results.map(r => <ResourceCard key={r.slug} r={r} onOpen={() => navigate({ name: 'resource', slug: r.slug, type: r.type })} />)}
        </div>
      </div>
    </main>
  );
};

Object.assign(window, { LandingPage, HomePage, DirectoryPage, SearchPage });

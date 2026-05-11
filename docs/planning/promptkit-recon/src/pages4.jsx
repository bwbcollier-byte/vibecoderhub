// PROMPTKIT — Pages 4: Deals, News, Guides, Dashboard, Settings, Submit, Utility
const { useState: uS_p4 } = React;

// ============== DEALS ==============
const DealsPage = ({ navigate, user, onUpgrade, onClaim }) => {
  const [tab, setTab] = uS_p4('all');
  const [tier, setTier] = uS_p4('all');
  const filtered = window.DEALS.filter(d => tab === 'all' || d.cat === tab).filter(d => tier === 'all' || d.tier === tier);
  return (
    <main style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>STARTUP DEALS · {window.DEALS.length} ACTIVE</div>
        <h1 className="t-display" style={{ fontSize: 'clamp(72px, 12vw, 168px)', lineHeight: 0.88, marginBottom: 16 }}>$4.2M+ IN<br />CREDITS.</h1>
        <div style={{ fontSize: 18, color: '#cfcfcf', maxWidth: 720, marginBottom: 24 }}>Curated deals from across the vibe-coding stack. Public, member, and Pro tiers.</div>
        <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
          {[['all','All'],['ai','AI APIs'],['cloud','Cloud'],['dev','Dev tools'],['prod','Productivity'],['featured','Featured']].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} className="mono-caps" style={{ padding: '10px 16px', borderRadius: 40, border: `1px solid ${tab === id ? '#309875' : '#2d2d2d'}`, background: tab === id ? 'rgba(60,255,208,0.06)' : 'transparent', color: tab === id ? '#3cffd0' : '#cfcfcf', fontSize: 11, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
        <div className="row gap-8" style={{ flexWrap: 'wrap', marginTop: 12 }}>
          <span className="mono-caps text-meta" style={{ fontSize: 10, alignSelf: 'center' }}>TIER:</span>
          {[['all','All'],['public','Public'],['member','Member'],['pro','Pro']].map(([id, l]) => (
            <button key={id} onClick={() => setTier(id)} className="mono-caps" style={{ padding: '6px 12px', borderRadius: 40, border: `1px solid ${tier === id ? '#5200ff' : '#2d2d2d'}`, background: tier === id ? 'rgba(82,0,255,0.06)' : 'transparent', color: tier === id ? '#b69dff' : '#949494', fontSize: 10, cursor: 'pointer' }}>{l}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm">SORT: Most valuable ▾</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map(d => <DealCard key={d.slug} d={d} locked={d.tier === 'pro' && !user?.pro} onUpgrade={onUpgrade} onClaim={() => onClaim(d)} />)}
      </div>
    </main>
  );
};

// ============== NEWS ==============
const NewsPage = ({ navigate, onSubscribe }) => {
  const [filter, setFilter] = uS_p4(['ecosystem','release','price','tutorial']);
  const breaking = window.NEWS.find(n => n.kind === 'breaking');
  const others = window.NEWS.filter(n => n.kind !== 'breaking');
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>NEWS · UPDATED EVERY 6H</div>
          <h1 className="t-display" style={{ fontSize: 'clamp(56px, 9vw, 112px)', lineHeight: 0.92 }}>WHAT'S NEW.</h1>
        </div>
        <div className="row gap-8">
          <button className="btn btn-secondary btn-sm">RSS feed</button>
          <button className="btn btn-primary" onClick={onSubscribe}>Subscribe →</button>
        </div>
      </div>
      <div className="row gap-32" style={{ alignItems: 'flex-start' }}>
        <aside className="hide-mobile" style={{ width: 220, flexShrink: 0 }}>
          <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 12 }}>KIND</div>
          {[['ecosystem','Ecosystem',245],['release','Releases',1204],['price','Price changes',89],['tutorial','Tutorials',47],['oped','Op-eds',12]].map(([id, l, n]) => (
            <label key={id} className="row gap-8" style={{ fontSize: 13, padding: '6px 0', color: '#cfcfcf', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> {l} <span className="text-meta">({n})</span>
            </label>
          ))}
          <div className="hairline" style={{ marginTop: 16, paddingTop: 16 }}>
            <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 12 }}>TOPICS</div>
            {['Cursor','Claude Code','Models','MCPs','Open source'].map(t => (
              <label key={t} className="row gap-8" style={{ fontSize: 13, padding: '6px 0', color: '#cfcfcf', cursor: 'pointer' }}><input type="checkbox" /> {t}</label>
            ))}
          </div>
        </aside>
        <div style={{ flex: 1 }}>
          {breaking && (
            <div className="card lift" style={{ marginBottom: 20, padding: 28, background: '#ff3cac', color: '#000', border: 'none', cursor: 'pointer' }} onClick={() => navigate({ name: 'newsItem', slug: breaking.slug })}>
              <div className="mono-caps" style={{ fontSize: 12, color: '#000', marginBottom: 12 }}>🔥 BREAKING</div>
              <div className="t-display" style={{ fontSize: 56, lineHeight: 0.95, marginBottom: 12, color: '#000' }}>{breaking.headline.toUpperCase()}</div>
              <div className="mono-caps" style={{ fontSize: 11, color: '#000', opacity: 0.7 }}>AUTO-GENERATED · {breaking.time} AGO</div>
            </div>
          )}
          <div className="col gap-16">
            {others.map(n => (
              <div key={n.slug} className="list-link" onClick={() => navigate({ name: 'newsItem', slug: n.slug })} style={{ alignItems: 'flex-start', padding: '20px 0' }}>
                <div style={{ width: 100, height: 100, background: n.color || '#5200ff', borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="t-display" style={{ fontSize: 36, color: '#fff' }}>{n.headline[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="row gap-12" style={{ marginBottom: 6 }}>
                    <span className="mono-caps" style={{ fontSize: 10, color: '#3cffd0' }}>{n.kind?.toUpperCase()}</span>
                    {n.auto && <span className="mono-caps text-meta" style={{ fontSize: 9 }}>🤖 AUTO</span>}
                    <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{n.source} · {n.time} AGO</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25, marginBottom: 6 }}>{n.headline}</div>
                  <div className="text-meta" style={{ fontSize: 14, lineHeight: 1.5 }}>{n.summary || 'Editorial summary auto-generated from the source article. Click for full context, related resources, and downstream implications for your stack.'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const NewsArticlePage = ({ slug, navigate }) => {
  const n = window.NEWS.find(x => x.slug === slug) || window.NEWS[0];
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 32px 80px' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate({ name: 'news' })} style={{ marginBottom: 20 }}>← All news</button>
      <div className="mono-caps" style={{ fontSize: 11, color: n.kind === 'breaking' ? '#ff3cac' : '#3cffd0', marginBottom: 14 }}>{n.kind === 'breaking' ? '🔥 BREAKING' : n.kind?.toUpperCase()} · {n.source} · {n.time} AGO</div>
      <h1 className="t-display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.95, marginBottom: 24 }}>{n.headline.toUpperCase()}</h1>
      <div style={{ height: 320, background: n.color || '#5200ff', borderRadius: 8, marginBottom: 32 }} />
      <div style={{ fontFamily: "'Newsreader', serif", fontSize: 19, lineHeight: 1.7, color: '#cfcfcf' }}>
        <p style={{ fontSize: 22, fontWeight: 500, marginBottom: 20 }}>{n.summary || `${n.headline} — and what it means for the vibe-coding stack you've been building.`}</p>
        <p style={{ marginBottom: 18 }}>The change rolled out at 09:42 UTC. Existing API consumers see lower bills starting on the next billing cycle. No code changes required — the same model slug returns at the new price tier.</p>
        <p style={{ marginBottom: 18 }}>For users on Cursor or Claude Code, this represents a meaningful shift in the per-session economics of agentic workflows. A typical refactor session that previously cost $0.62 now lands closer to $0.43.</p>
        <p>Affected resources, alternatives, and our cost calculator have already updated.</p>
      </div>
      <div className="card" style={{ marginTop: 40, padding: 24, borderColor: '#3cffd0', background: 'rgba(60,255,208,0.04)' }}>
        <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 10 }}>RELATED RESOURCES</div>
        <div className="col">
          {window.RESOURCES.slice(0, 3).map(r => (
            <div key={r.slug} className="list-link" onClick={() => navigate({ name: 'resource', slug: r.slug, type: r.type })}>
              <span style={{ flex: 1, fontWeight: 500 }}>{r.name}</span>
              <span className="mono-caps text-meta" style={{ fontSize: 10 }}>★ {r.score}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

// ============== GUIDES ==============
const GuidesPage = ({ navigate }) => (
  <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
    <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>GUIDES · 1,247 INDEXED</div>
    <h1 className="t-display" style={{ fontSize: 'clamp(72px, 12vw, 144px)', lineHeight: 0.92, marginBottom: 32 }}>HOW TO<br />SHIP IT.</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {[
        { kind: 'GET STARTED', t: 'Install Claude Opus 4.7 for Cursor', d: '5 min', diff: 'beginner', os: ['macOS','Linux','Windows'], v: 'mint' },
        { kind: 'USAGE', t: 'Wire up Auth0 MCP with Supabase RLS', d: '20 min', diff: 'intermediate', os: ['macOS','Linux'], v: 'uv' },
        { kind: 'USAGE', t: 'Multi-agent pattern with Claude subagents', d: '35 min', diff: 'advanced', os: ['macOS'], v: 'yellow' },
        { kind: 'TROUBLESHOOT', t: 'Why is my MCP not connecting?', d: '4 min', diff: 'beginner', os: ['all'], v: 'pink' },
        { kind: 'MIGRATE', t: 'From Cursor 0.4 to 0.5', d: '15 min', diff: 'intermediate', os: ['all'], v: 'mint' },
        { kind: 'ADVANCED', t: 'Self-host Qwen 2.5 Coder 32B', d: '45 min', diff: 'advanced', os: ['Linux','macOS'], v: 'uv' },
        { kind: 'GET STARTED', t: 'Your first vibe-coded SaaS in a weekend', d: '180 min', diff: 'beginner', os: ['all'], v: 'pink' },
        { kind: 'TROUBLESHOOT', t: 'Recovering from a runaway agent', d: '6 min', diff: 'intermediate', os: ['all'], v: 'yellow' },
      ].map((g, i) => {
        const fills = { mint: { bg:'#3cffd0', fg:'#000'}, uv: { bg:'#5200ff', fg:'#fff'}, yellow:{bg:'#f5e642',fg:'#000'}, pink:{bg:'#ff3cac',fg:'#fff'} }[g.v];
        return (
          <div key={i} className="card lift" style={{ background: fills.bg, color: fills.fg, border: 'none', padding: 24, minHeight: 220, cursor: 'pointer' }} onClick={() => navigate({ name: 'guide' })}>
            <div className="mono-caps" style={{ fontSize: 10, color: fills.fg, opacity: 0.7, marginBottom: 12 }}>{g.kind}</div>
            <div className="t-display" style={{ fontSize: 28, lineHeight: 1.05, marginBottom: 16, color: fills.fg }}>{g.t}</div>
            <div className="row gap-8" style={{ marginTop: 'auto' }}>
              <span className="mono-caps" style={{ fontSize: 10, padding: '4px 8px', background: 'rgba(0,0,0,0.15)', borderRadius: 2 }}>⏱ {g.d}</span>
              <span className="mono-caps" style={{ fontSize: 10, padding: '4px 8px', background: 'rgba(0,0,0,0.15)', borderRadius: 2 }}>{g.diff.toUpperCase()}</span>
            </div>
          </div>
        );
      })}
    </div>
  </main>
);

const GuideReader = ({ navigate }) => {
  const [step, setStep] = uS_p4(2);
  const steps = [
    { n: 1, t: 'Install Ollama', complete: true },
    { n: 2, t: 'Pull the model', complete: true },
    { n: 3, t: 'Run a test query', complete: false, current: true },
    { n: 4, t: 'Connect to Cursor', complete: false },
  ];
  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="row gap-32" style={{ alignItems: 'flex-start' }}>
        <aside className="hide-mobile" style={{ width: 280, flexShrink: 0, position: 'sticky', top: 76 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate({ name: 'guides' })} style={{ marginBottom: 16 }}>← All guides</button>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 14 }}>PROGRESS · 50%</div>
          <div style={{ height: 4, background: '#2d2d2d', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}><div style={{ width: '50%', height: '100%', background: '#3cffd0' }} /></div>
          <div className="col">
            {steps.map(s => (
              <div key={s.n} className="row gap-10" onClick={() => setStep(s.n)} style={{ padding: '10px 8px', cursor: 'pointer', background: s.n === step ? 'rgba(60,255,208,0.06)' : 'transparent', borderRadius: 4 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid', borderColor: s.complete ? '#3cffd0' : '#2d2d2d', background: s.complete ? '#3cffd0' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{s.complete ? '✓' : s.n}</span>
                <span style={{ fontSize: 13, color: s.complete ? '#cfcfcf' : s.n === step ? '#fafafa' : '#949494', fontWeight: s.n === step ? 700 : 400, flex: 1 }}>{s.t}</span>
              </div>
            ))}
          </div>
        </aside>
        <article style={{ flex: 1, maxWidth: 720 }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 14 }}>5 MIN · BEGINNER · macOS</div>
          <h1 className="t-display" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.95, marginBottom: 32 }}>INSTALL QWEN 2.5 CODER 32B ON macOS VIA OLLAMA</h1>
          <h2 className="t-display" style={{ fontSize: 36, marginBottom: 16, color: '#3cffd0' }}>STEP {step}: PULL THE MODEL</h2>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 17, lineHeight: 1.7, color: '#cfcfcf', marginBottom: 24 }}>
            <p>With Ollama installed, pull the Qwen 2.5 Coder model. The 32B variant is recommended for an M3 Max with 36 GB of RAM — the Q4 quantization fits comfortably in memory with headroom for your IDE and browser.</p>
          </div>
          <CodeBlock code="ollama pull qwen2.5-coder:32b" lang="bash" />
          <div className="card" style={{ marginTop: 16, padding: 16, borderColor: '#5200ff', background: 'rgba(82,0,255,0.04)' }}>
            <div className="row gap-12" style={{ alignItems: 'center' }}>
              <span className="mono-caps" style={{ fontSize: 10, color: '#b69dff' }}>VERIFY</span>
              <span className="t-mono" style={{ fontSize: 13, flex: 1 }}>ollama list | grep qwen</span>
              <button className="btn btn-uv btn-sm">▶ Run check</button>
            </div>
            <div className="text-meta" style={{ fontSize: 12, marginTop: 10 }}>Expected output: <code className="t-mono" style={{ color: '#3cffd0' }}>qwen2.5-coder:32b · 18.5 GB</code></div>
          </div>
          <div className="row gap-12" style={{ marginTop: 32 }}>
            <button className="btn btn-primary" onClick={() => setStep(Math.min(4, step + 1))}>✓ Mark complete · Next step →</button>
            <button className="btn btn-ghost btn-sm">Step didn't work?</button>
          </div>
        </article>
      </div>
    </main>
  );
};

// ============== DASHBOARD ==============
const DashboardPage = ({ user, navigate, stack }) => {
  const [tab, setTab] = uS_p4('overview');
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <div className="row gap-12" style={{ alignItems: 'center', marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#5200ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>BH</div>
          <div>
            <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0' }}>{user?.handle || '@benhope'} · MEMBER</div>
            <h1 className="t-display" style={{ fontSize: 56, lineHeight: 1, marginTop: 4 }}>WELCOME BACK.</h1>
          </div>
        </div>
      </div>
      <div className="row" style={{ borderBottom: '1px solid #2d2d2d', overflow: 'auto', marginBottom: 32 }}>
        {['overview','bookmarks','collections','stacks','submissions','alerts','deals','gateway','api-keys'].map(x => (
          <button key={x} onClick={() => setTab(x)} className="mono-caps" style={{ padding: '12px 16px', background: 'transparent', border: 'none', color: tab === x ? '#3cffd0' : '#949494', borderBottom: tab === x ? '2px solid #3cffd0' : '2px solid transparent', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>{x.replace('-', ' ')}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <div className="card" style={{ marginBottom: 20, padding: 24, borderColor: '#3cffd0', background: 'rgba(60,255,208,0.04)' }}>
            <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>ACTIVITY · THIS WEEK</div>
            <div className="col">
              <div className="row gap-12" style={{ padding: '8px 0', borderBottom: '1px solid #2d2d2d' }}><span style={{ color: '#3cffd0' }}>↑</span><span style={{ flex: 1 }}>4 resources you bookmarked got updated this week</span></div>
              <div className="row gap-12" style={{ padding: '8px 0', borderBottom: '1px solid #2d2d2d' }}><span style={{ color: '#f5e642' }}>$</span><span style={{ flex: 1 }}>Claude Opus 4.7 hit your $300/mo alert (saved $48)</span></div>
              <div className="row gap-12" style={{ padding: '8px 0' }}><span style={{ color: '#5200ff' }}>★</span><span style={{ flex: 1 }}>New Pro deal: Anthropic Startup Program</span></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="card">
              <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 12 }}>MY STACK</div>
              <div className="col gap-6" style={{ marginBottom: 12 }}>
                {stack.clients.slice(0, 3).map(c => <div key={c} style={{ fontSize: 13 }}>+ {(window.CLIENTS.find(x => x.id === c) || {}).name}</div>)}
                {stack.tags.slice(0, 4).map(t => <div key={t} style={{ fontSize: 13 }}>+ {t}</div>)}
              </div>
              <button className="btn btn-secondary btn-sm">Edit →</button>
            </div>
            <div className="card">
              <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 12 }}>MY ALERTS · 3 ACTIVE</div>
              <div style={{ fontSize: 13, marginBottom: 6 }}>2 price drops triggered</div>
              <div style={{ fontSize: 13, marginBottom: 12 }}>1 deal expires in 14d</div>
              <button className="btn btn-secondary btn-sm">Manage →</button>
            </div>
            <div className="card">
              <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 12 }}>RECENT INSTALLS</div>
              <div className="t-display" style={{ fontSize: 48, color: '#3cffd0' }}>12</div>
              <div className="text-meta" style={{ fontSize: 12 }}>resources installed via Vibe Coder Hub</div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>View all →</button>
            </div>
          </div>
        </div>
      )}
      {tab === 'bookmarks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {window.RESOURCES.slice(0, 8).map(r => <ResourceCard key={r.slug} r={r} onOpen={() => navigate({ name: 'resource', slug: r.slug, type: r.type })} />)}
        </div>
      )}
      {tab === 'alerts' && (
        <table className="tbl">
          <thead><tr><th>Resource</th><th>Trigger</th><th>Status</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {[
              ['Claude Opus 4.7','price < $3/M','● TRIGGERED · 2D AGO','MAR 12'],
              ['Anthropic Startup','expires in 14d','◷ ACTIVE','APR 02'],
              ['Cursor Pro','any new release','◷ ACTIVE','JAN 18'],
            ].map((r, i) => (
              <tr key={i}>{[...r, <button key="x" className="btn btn-ghost btn-sm">Edit</button>].map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
      {!['overview','bookmarks','alerts'].includes(tab) && <EmptyState glyph="◷" title={`${tab.toUpperCase()} · COMING SOON`} body="This tab is being built. Other tabs are functional." />}
    </main>
  );
};

// SETTINGS
const SettingsPage = ({ navigate }) => {
  const [sec, setSec] = uS_p4('account');
  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>SETTINGS</div>
      <h1 className="t-display" style={{ fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 0.95, marginBottom: 32 }}>YOUR ACCOUNT.</h1>
      <div className="row gap-32" style={{ alignItems: 'flex-start' }}>
        <aside style={{ width: 240, flexShrink: 0 }}>
          {[['account','Account'],['profile','Profile'],['stack','Stack'],['notifications','Notifications'],['billing','Billing'],['connections','Connected accounts'],['privacy','Privacy & data'],['appearance','Theme & appearance']].map(([id, l]) => (
            <button key={id} onClick={() => setSec(id)} className="mono-caps" style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: sec === id ? 'rgba(60,255,208,0.06)' : 'transparent', border: 'none', color: sec === id ? '#3cffd0' : '#cfcfcf', fontSize: 11, cursor: 'pointer', borderRadius: 4, marginBottom: 2 }}>{l}</button>
          ))}
          <div className="hairline" style={{ marginTop: 16, paddingTop: 16 }}>
            <button className="mono-caps" style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#ff3cac', fontSize: 11, cursor: 'pointer' }}>Sign out</button>
          </div>
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>
          {sec === 'account' && (
            <div>
              <h2 className="t-display" style={{ fontSize: 40, marginBottom: 24 }}>ACCOUNT</h2>
              {[['Email','ben@example.com'],['Username','@benhope'],['Password','●●●●●●●●●●']].map(([l, v]) => (
                <div key={l} className="card" style={{ marginBottom: 12 }}>
                  <div className="row" style={{ alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div className="mono-caps text-meta" style={{ fontSize: 10, marginBottom: 4 }}>{l.toUpperCase()}</div>
                      <div style={{ fontSize: 15 }}>{v}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm">Change</button>
                  </div>
                </div>
              ))}
              <div className="card" style={{ marginTop: 32, borderColor: '#ff3cac' }}>
                <div className="mono-caps" style={{ fontSize: 11, color: '#ff3cac', marginBottom: 10 }}>DANGER ZONE</div>
                <button className="btn btn-secondary btn-sm" style={{ borderColor: '#ff3cac', color: '#ff3cac' }}>Delete account</button>
              </div>
            </div>
          )}
          {sec === 'appearance' && (
            <div>
              <h2 className="t-display" style={{ fontSize: 40, marginBottom: 24 }}>APPEARANCE</h2>
              <div className="card">
                <div className="mono-caps text-meta" style={{ fontSize: 10, marginBottom: 12 }}>THEME</div>
                <div className="row gap-8">
                  {['System','Dark','Light'].map((t, i) => (
                    <button key={t} className="mono-caps" style={{ padding: '10px 18px', borderRadius: 40, border: `1px solid ${i === 1 ? '#309875' : '#2d2d2d'}`, background: i === 1 ? 'rgba(60,255,208,0.06)' : 'transparent', color: i === 1 ? '#3cffd0' : '#cfcfcf', fontSize: 11, cursor: 'pointer' }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!['account','appearance'].includes(sec) && <EmptyState glyph="◷" title={`${sec.toUpperCase()} settings`} body="This section is built out — toggle between others to see the layout." />}
        </div>
      </div>
    </main>
  );
};

// SUBMIT
const SubmitPage = ({ navigate }) => {
  const [step, setStep] = uS_p4(1);
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>SUBMIT · STEP {step}/3</div>
      <h1 className="t-display" style={{ fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 0.95, marginBottom: 32 }}>ADD A RESOURCE.</h1>
      <div className="row gap-2" style={{ marginBottom: 32 }}>
        {[1,2,3].map(s => <div key={s} style={{ flex: 1, height: 4, background: s <= step ? '#3cffd0' : '#2d2d2d', borderRadius: 2 }} />)}
      </div>
      {step === 1 && (
        <div className="card" style={{ padding: 32 }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>STEP 1 · SOURCE URL</div>
          <h2 className="t-display" style={{ fontSize: 40, marginBottom: 20 }}>What are you submitting?</h2>
          <div className="row gap-12" style={{ marginBottom: 24 }}>
            <input className="input" placeholder="https://github.com/auth0/mcp-auth0" style={{ flex: 1, fontSize: 16, padding: '14px 16px' }} />
            <button className="btn btn-primary" onClick={() => setStep(2)}>Detect →</button>
          </div>
          <div className="mono-caps text-meta" style={{ fontSize: 10, marginBottom: 12 }}>OR PICK MANUALLY</div>
          <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
            {window.RESOURCE_TYPES.map(t => <button key={t.id} className="stack-chip" style={{ cursor: 'pointer' }}>{t.glyph} {t.label}</button>)}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="card" style={{ padding: 32 }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>STEP 2 · AUTO-PREFILL</div>
          <h2 className="t-display" style={{ fontSize: 40, marginBottom: 20 }}>We detected:</h2>
          <div className="card" style={{ background: 'rgba(60,255,208,0.04)', borderColor: '#309875', marginBottom: 24 }}>
            {[['Type','MCP server'],['Name','Auth0 MCP'],['Source','github.com/auth0/mcp-auth0'],['License','MIT (from package.json)'],['Author','auth0']].map(([k, v]) => (
              <div key={k} className="row" style={{ padding: '10px 0', borderBottom: '1px solid #309875', fontSize: 13 }}>
                <span className="mono-caps text-meta" style={{ fontSize: 10, minWidth: 100 }}>{k.toUpperCase()}</span>
                <span style={{ flex: 1, fontWeight: 500 }}>{v}</span>
                <button className="btn btn-ghost btn-sm">Edit</button>
              </div>
            ))}
          </div>
          <div className="mono-caps" style={{ fontSize: 11, color: '#ff3cac', marginBottom: 14 }}>FILL IN THE GAPS</div>
          <div className="col gap-12" style={{ marginBottom: 24 }}>
            <div><label className="mono-caps text-meta" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>TAGLINE *</label><input className="input" placeholder="One line — what does this do?" /></div>
            <div><label className="mono-caps text-meta" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>COMPATIBLE CLIENTS</label><div className="row gap-6" style={{ flexWrap: 'wrap' }}>{window.CLIENTS.slice(0,6).map(c => <span key={c.id} className="stack-chip" style={{ cursor: 'pointer' }}>+ {c.name}</span>)}</div></div>
            <div><label className="mono-caps text-meta" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>STACK TAGS</label><div className="row gap-6" style={{ flexWrap: 'wrap' }}>{window.STACK_TAGS.slice(0,6).map(t => <span key={t} className="stack-chip" style={{ cursor: 'pointer' }}>+ {t}</span>)}</div></div>
          </div>
          <div className="row gap-8">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={() => setStep(3)}>Preview →</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>STEP 3 · PREVIEW</div>
          <h2 className="t-display" style={{ fontSize: 40, marginBottom: 20 }}>Looks good?</h2>
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div className="row gap-8" style={{ marginBottom: 12 }}>
              <span className="type-badge">⚡ MCP</span>
              <span className="status-pill">v1.0.0 · MIT</span>
            </div>
            <div className="t-display" style={{ fontSize: 48, marginBottom: 8 }}>AUTH0 MCP.</div>
            <div className="text-meta" style={{ fontSize: 16 }}>OAuth2 flows for any agent in 4 lines.</div>
          </div>
          <div className="row gap-8">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-secondary">Save as draft</button>
            <button className="btn btn-primary">Publish</button>
          </div>
        </div>
      )}
    </main>
  );
};

// 404
const NotFoundPage = ({ navigate }) => (
  <main style={{ maxWidth: 720, margin: '120px auto', padding: '0 32px', textAlign: 'center' }}>
    <div className="t-display" style={{ fontSize: 'clamp(120px, 22vw, 280px)', lineHeight: 0.85, color: '#3cffd0', marginBottom: 24 }}>404.</div>
    <h1 className="t-display" style={{ fontSize: 56, marginBottom: 16 }}>WE COULDN'T FIND THAT.</h1>
    <div className="text-meta" style={{ fontSize: 18, marginBottom: 32, lineHeight: 1.5 }}>Maybe it was deprecated. Maybe a typo. Either way, the directory is still here.</div>
    <div className="row gap-12" style={{ justifyContent: 'center' }}>
      <button className="btn btn-primary" onClick={() => navigate({ name: 'home' })}>Browse trending →</button>
      <button className="btn btn-secondary" onClick={() => navigate({ name: 'search' })}>Search</button>
    </div>
  </main>
);

// COOKIE BANNER
const CookieBanner = ({ onAccept, onCustomize }) => (
  <div style={{ position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 70, maxWidth: 720, margin: '0 auto' }}>
    <div className="card" style={{ borderColor: '#3cffd0', background: '#131313', padding: 18, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <div className="row gap-12" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', fontSize: 13, lineHeight: 1.5, color: '#cfcfcf' }}>
          We use cookies for essential features and (with your permission) analytics that help us improve.
        </div>
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm" onClick={onCustomize}>Customise</button>
          <button className="btn btn-secondary btn-sm" onClick={onAccept}>Essential only</button>
          <button className="btn btn-primary btn-sm" onClick={onAccept}>Accept all</button>
        </div>
      </div>
    </div>
  </div>
);

// TOAST
const Toast = ({ msg, onDismiss }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 80, animation: 'fadeIn 180ms ease-out' }}>
    <div className="card" style={{ borderColor: '#3cffd0', background: '#131313', padding: '12px 18px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <div className="row gap-12">
        <Icon.check size={16} stroke="#3cffd0" />
        <span style={{ fontSize: 13 }}>{msg}</span>
        <button onClick={onDismiss} aria-label="dismiss" style={{ background: 'transparent', border: 'none', color: '#949494', cursor: 'pointer' }}><Icon.close size={12} /></button>
      </div>
    </div>
  </div>
);

Object.assign(window, { DealsPage, NewsPage, NewsArticlePage, GuidesPage, GuideReader, DashboardPage, SettingsPage, SubmitPage, NotFoundPage, CookieBanner, Toast });

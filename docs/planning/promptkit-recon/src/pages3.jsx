// PROMPTKIT — Pages 3: Model Detail (22 blocks), Compare
const { useState: uS_p3, useMemo: uM_p3 } = React;

const ModelDetailPage = ({ slug, navigate, onCompare }) => {
  const m = window.MODELS.find(x => x.slug === slug) || window.MODELS[0];
  const [tab, setTab] = uS_p3('overview');
  const sections = [
    ['hero','HERO'], ['stats','STATS'], ['try','TRY IT NOW'], ['pricing','PRICING'],
    ['caps','CAPABILITIES'], ['providers','PROVIDERS'], ['benchmarks','BENCHMARKS'],
    ['vibe','VIBE PERF'], ['ctx','CONTEXT'], ['limits','RATE LIMITS'],
    ['about','ABOUT'], ['news','NEWS'], ['deals','DEALS'], ['works','WORKS WITH'],
    ['compare','COMPARE'], ['alts','ALTERNATIVES'], ['verdict','VERDICT'],
    ['tips','PROMPTING TIPS'], ['safety','SAFETY'], ['ref','DEV REFERENCE'],
    ['timeline','TIMELINE'], ['sources','SOURCES']
  ];
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>
      {/* SECTION INDEX */}
      <aside className="hide-mobile" style={{ position: 'fixed', right: 24, top: 100, width: 200, zIndex: 5, maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', marginBottom: 10 }}>22 BLOCKS</div>
          <div className="col gap-2">
            {sections.map((s, i) => (
              <a key={s[0]} href={`#sec-${s[0]}`} className="mono-caps" style={{ fontSize: 9, color: '#949494', textDecoration: 'none', padding: '4px 0' }}>{String(i+1).padStart(2,'0')} · {s[1]}</a>
            ))}
          </div>
        </div>
      </aside>

      {/* 01 HERO */}
      <section id="sec-hero" style={{ marginBottom: 48 }}>
        <div className="row gap-8" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
          <span className="type-badge">🧠 MODEL</span>
          <span className="status-pill"><span style={{ color: '#3cffd0' }}>●</span> AVAILABLE</span>
          {m.reasoning && <span className="status-pill">🧠 REASONING</span>}
          {m.vision && <span className="status-pill">👁 VISION</span>}
          {m.tools && <span className="status-pill">🔧 TOOLS</span>}
          {m.openWeights && <span className="status-pill" style={{ color: '#ff3cac', borderColor: 'rgba(255,60,172,0.3)' }}>📦 OPEN WEIGHTS</span>}
        </div>
        <div className="row gap-20" style={{ alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 24 }}>
          <ProviderMark provider={m.provider} color={m.providerColor} size={88} />
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="mono-caps text-meta" style={{ fontSize: 11, marginBottom: 6 }}>{m.provider.toUpperCase()} · v{m.version || '4.7'} · RELEASED {m.released?.toUpperCase() || 'APR 19'}</div>
            <h1 className="t-display" style={{ fontSize: 'clamp(72px, 11vw, 152px)', lineHeight: 0.88, letterSpacing: 0.5 }}>{m.name.toUpperCase()}.</h1>
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#cfcfcf', marginBottom: 24, maxWidth: 800, lineHeight: 1.4 }}>{m.tagline || 'The frontier reasoning model. Best-in-class on agentic coding benchmarks.'}</div>
        <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg"><Icon.play size={14} /> Try it now</button>
          <button className="btn btn-secondary btn-lg" onClick={() => onCompare(m)}><Icon.compare size={14} /> Compare</button>
          <button className="btn btn-secondary btn-lg"><Icon.bell size={14} /> Set price alert</button>
          <button className="btn btn-ghost btn-lg"><Icon.layers size={14} /> Add to stack</button>
        </div>
      </section>

      {/* 02 STATS STRIP */}
      <section id="sec-stats" style={{ marginBottom: 48 }}>
        <div className="card" style={{ padding: 0 }}>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            {[
              { l: 'INTELLIGENCE', v: m.intelligence || '74', h: 'rank #2' },
              { l: 'BLENDED $', v: `$${((m.priceIn + m.priceOut * 5) / 6).toFixed(2)}/M`, d: m.delta },
              { l: 'OUTPUT SPEED', v: '143 tok/s', h: '+18% MoM' },
              { l: 'LATENCY · TTFT', v: '0.42s' },
              { l: 'CONTEXT', v: `${m.context || 200}K`, h: `eff. ${(m.context || 200) - 30}K` },
              { l: 'CUTOFF', v: m.cutoff || 'NOV 2025' },
              { l: 'RELEASED', v: m.released || 'APR 19, 2026' },
            ].map((s, i) => (
              <div key={s.l} style={{ flex: '1 1 140px', padding: 20, borderRight: i < 6 ? '1px solid #2d2d2d' : 'none', borderBottom: '1px solid #2d2d2d' }}>
                <div className="mono-caps text-meta" style={{ fontSize: 10, marginBottom: 6 }}>{s.l}</div>
                <div className="t-display tnum" style={{ fontSize: 28, color: '#fafafa', lineHeight: 1 }}>{s.v}</div>
                {s.h && <div className="mono-caps text-meta" style={{ fontSize: 9, marginTop: 4 }}>{s.h}</div>}
                {s.d != null && <div className="mono-caps tnum" style={{ fontSize: 10, color: s.d < 0 ? '#3cffd0' : '#ff3cac', marginTop: 4 }}>{s.d < 0 ? '▼' : '▲'} {Math.abs(s.d)}%</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 TRY IT NOW */}
      <section id="sec-try" style={{ marginBottom: 48 }}>
        <SectionH kicker="03 · TRY IT NOW" title="Embedded playground" />
        <div className="card" style={{ padding: 0 }}>
          <div className="row" style={{ borderBottom: '1px solid #2d2d2d', padding: '12px 16px', justifyContent: 'space-between' }}>
            <div className="row gap-2">
              {['Free trial · 7 left','BYO key','My account'].map((x, i) => (
                <button key={x} className="mono-caps" style={{ background: i === 0 ? 'rgba(60,255,208,0.08)' : 'transparent', color: i === 0 ? '#3cffd0' : '#949494', border: 'none', padding: '6px 12px', fontSize: 10, cursor: 'pointer', borderRadius: 2 }}>{x}</button>
              ))}
            </div>
            <button className="btn btn-secondary btn-sm">+ Add model to compare</button>
          </div>
          <div className="row" style={{ minHeight: 320 }}>
            <div style={{ flex: 1, padding: 20, borderRight: '1px solid #2d2d2d' }}>
              <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 10 }}>SYSTEM PROMPT</div>
              <div className="card" style={{ padding: 12, marginBottom: 14, background: '#0a0a0a' }}><div className="t-mono text-meta" style={{ fontSize: 12 }}>You are a senior dev. Be concise.</div></div>
              <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 10 }}>USER</div>
              <div className="card" style={{ padding: 12, background: '#0a0a0a' }}><div className="t-mono" style={{ fontSize: 13 }}>Refactor this React component to use hooks instead of class state.</div></div>
              <div className="row gap-8" style={{ marginTop: 16 }}>
                <button className="btn btn-primary btn-sm">▶ Run</button>
                <button className="btn btn-ghost btn-sm">Reset</button>
                <span className="mono-caps text-meta tnum" style={{ fontSize: 10, marginLeft: 'auto', alignSelf: 'center' }}>~$0.018 / RUN</span>
              </div>
            </div>
            <div style={{ flex: 1, padding: 20, background: '#0a0a0a' }}>
              <div className="row" style={{ marginBottom: 10, justifyContent: 'space-between' }}>
                <span className="mono-caps text-meta" style={{ fontSize: 9 }}>RESPONSE · 1.2S</span>
                <span className="mono-caps text-meta tnum" style={{ fontSize: 9 }}>342 OUT TOKENS</span>
              </div>
              <CodeBlock code={`function Counter() {\n  const [count, setCount] = useState(0);\n  const increment = () => setCount(c => c + 1);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>+</button>\n    </div>\n  );\n}`} lang="tsx" />
            </div>
          </div>
        </div>
      </section>

      {/* 04 PRICING + CALCULATOR */}
      <section id="sec-pricing" style={{ marginBottom: 48 }}>
        <SectionH kicker="04 · PRICING" title="Cost calculator" />
        <CostCalculator m={m} />
      </section>

      {/* 05 CAPABILITIES */}
      <section id="sec-caps" style={{ marginBottom: 48 }}>
        <SectionH kicker="05 · CAPABILITIES" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {[
            ['Tool use', '✅'], ['Parallel tools', '✅'], ['Vision (image)', m.vision ? '✅' : '❌'],
            ['Audio in', '⚠️'], ['Audio out', '❌'], ['PDF', '✅'],
            ['JSON mode', '✅'], ['Prompt caching', '💰'], ['Batch API', '✅ -50%'],
            ['Fine-tuning', m.openWeights ? '✅' : '❌'], ['Reasoning mode', m.reasoning ? '✅' : '❌'], ['Computer use', '⚠️ beta']
          ].map(([k, v]) => (
            <div key={k} className="card" style={{ padding: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#cfcfcf' }}>{k}</span>
                <span style={{ fontSize: 16 }}>{v}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 06 PROVIDERS */}
      <section id="sec-providers" style={{ marginBottom: 48 }}>
        <SectionH kicker="06 · PROVIDER AVAILABILITY" />
        <table className="tbl">
          <thead><tr><th>Provider</th><th>Price IN</th><th>Price OUT</th><th>Context</th><th>Rate limit</th><th>Latency</th><th>Status</th></tr></thead>
          <tbody>
            {[
              [m.provider, `$${m.priceIn}`, `$${m.priceOut}`, '200K', '4M tok/min', '0.42s', '🟢'],
              ['AWS Bedrock', `$${(m.priceIn * 1.05).toFixed(2)}`, `$${(m.priceOut * 1.05).toFixed(2)}`, '200K', '2M tok/min', '0.51s', '🟢'],
              ['GCP Vertex', `$${(m.priceIn * 1.02).toFixed(2)}`, `$${(m.priceOut * 1.02).toFixed(2)}`, '200K', '3M tok/min', '0.48s', '🟢'],
              ['OpenRouter', `$${(m.priceIn * 0.99).toFixed(2)}`, `$${(m.priceOut * 0.99).toFixed(2)}`, '200K', '1M tok/min', '0.62s', '🟡'],
            ].map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j} className={j > 0 && j < 6 ? 't-mono tnum' : ''}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 07 BENCHMARKS */}
      <section id="sec-benchmarks" style={{ marginBottom: 48 }}>
        <SectionH kicker="07 · BENCHMARKS" />
        <table className="tbl">
          <thead><tr><th>Benchmark</th><th>Score</th><th>Rank</th><th>Confidence</th><th>Source</th></tr></thead>
          <tbody>
            {[
              ['SWE-Bench Verified', '67.3%', '#1', '●●●●', 'Anthropic'],
              ['MMLU', '88.7%', '#3', '●●●●', 'Independent'],
              ['HumanEval', '91.2%', '#2', '●●●○', 'OpenLM'],
              ['LiveCodeBench', '64.8%', '#1', '●●●●', 'LiveCodeBench'],
              ['Aider polyglot', '74.1%', '#2', '●●●○', 'Aider'],
              ['GPQA Diamond', '58.4%', '#4', '●●○○', 'community'],
            ].map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td><td className="t-mono tnum" style={{ fontWeight: 700 }}>{r[1]}</td>
                <td className="t-mono"><span className="status-pill" style={{ color: i < 2 ? '#3cffd0' : '#fafafa' }}>{r[2]}</span></td>
                <td className="t-mono" style={{ color: '#3cffd0' }}>{r[3]}</td>
                <td className="text-meta" style={{ fontSize: 12 }}>{r[4]} →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 08 VIBE PERF */}
      <section id="sec-vibe" style={{ marginBottom: 48 }}>
        <SectionH kicker="08 · REAL-WORLD VIBE CODING" title="Per-client performance" />
        <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
          {window.CLIENTS.slice(0, 4).map((c, i) => (
            <div key={c.id} className="card" style={{ flex: '1 1 240px', padding: 18 }}>
              <div className="row gap-10" style={{ marginBottom: 14 }}>
                <span style={{ width: 22, height: 22, background: c.color, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 11 }}>{c.name[0]}</span>
                <span style={{ fontWeight: 700, fontSize: 14, flex: 1 }}>{c.name}</span>
              </div>
              <div className="col gap-10">
                {[
                  { l: 'AVG SESSION COST', v: `$${(0.4 + i * 0.15).toFixed(2)}`, p: 30 + i * 12 },
                  { l: 'AVG TOKENS · K', v: `${(40 + i * 8)}K`, p: 50 + i * 8 },
                  { l: 'SUCCESS RATE', v: `${88 - i * 4}%`, p: 88 - i * 4 },
                ].map(b => (
                  <div key={b.l}>
                    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="mono-caps text-meta" style={{ fontSize: 9 }}>{b.l}</span>
                      <span className="t-mono tnum" style={{ fontSize: 11, fontWeight: 700 }}>{b.v}</span>
                    </div>
                    <div style={{ height: 4, background: '#2d2d2d', borderRadius: 2, overflow: 'hidden' }}><div style={{ width: `${b.p}%`, height: '100%', background: '#3cffd0' }} /></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 09 CONTEXT */}
      <section id="sec-ctx" style={{ marginBottom: 48 }}>
        <SectionH kicker="09 · CONTEXT WINDOW QUALITY" />
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: '#cfcfcf' }}>Advertised: <strong style={{ color: '#fafafa' }}>200K tokens</strong></span>
            <span style={{ fontSize: 14, color: '#cfcfcf' }}>Effective (NIAH 95%): <strong style={{ color: '#3cffd0' }}>170K tokens</strong></span>
          </div>
          <div style={{ height: 80, position: 'relative', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 4, padding: 12 }}>
            <div className="row gap-8" style={{ alignItems: 'flex-end', height: '100%' }}>
              {[97, 95, 92, 78].map((p, i) => (
                <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  <div className="t-mono tnum" style={{ fontSize: 11, color: '#3cffd0', fontWeight: 700 }}>{p}%</div>
                  <div style={{ width: '100%', height: `${p}%`, background: p > 90 ? '#3cffd0' : '#f5e642', borderRadius: 2 }} />
                </div>
              ))}
            </div>
          </div>
          <div className="row" style={{ marginTop: 8 }}>{['25%','50%','75%','100%'].map(p => <span key={p} className="mono-caps text-meta tnum" style={{ flex: 1, textAlign: 'center', fontSize: 9 }}>{p} DEPTH</span>)}</div>
        </div>
      </section>

      {/* 10 RATE LIMITS */}
      <section id="sec-limits" style={{ marginBottom: 48 }}>
        <SectionH kicker="10 · RATE LIMITS" />
        <table className="tbl">
          <thead><tr><th>Tier</th><th>RPM</th><th>TPM</th><th>TPD</th><th>Concurrent</th></tr></thead>
          <tbody>
            {[['Free','5','10K','100K','1'],['Tier 1 ($5)','50','40K','1M','5'],['Tier 2 ($50)','1K','80K','5M','25'],['Tier 4 ($1K)','4K','400K','50M','100']].map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j} className={j > 0 ? 't-mono tnum' : 'mono-caps'} style={{ fontSize: j === 0 ? 11 : 13 }}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 11 ABOUT */}
      <section id="sec-about" style={{ marginBottom: 48 }}>
        <SectionH kicker="11 · ABOUT" />
        <div className="row gap-32" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '2 1 360px', fontFamily: "'Newsreader', serif", fontSize: 17, lineHeight: 1.7, color: '#cfcfcf' }}>
            <p>{m.name} is the latest frontier model from {m.provider}. The release shipped with a 30% input price cut alongside reasoning improvements that vault it to #1 on SWE-Bench. Trained on a refreshed dataset cut at {m.cutoff || 'November 2025'}, it specializes in agentic coding workflows where context-window fidelity at depth matters more than raw parameter count.</p>
            <p style={{ marginTop: 14 }}>The model is a hybrid Mixture-of-Experts architecture, with the provider's first commercial deployment of sparse attention at this scale. Tokenization remains compatible with prior versions.</p>
          </div>
          <div style={{ flex: '1 1 240px' }}>
            <div className="card">
              {[['ARCHITECTURE','MoE Transformer'],['ACTIVE PARAMS','~140B'],['TOTAL PARAMS','~600B'],['CUTOFF',m.cutoff || 'Nov 2025'],['TOKENIZER','tiktoken o200k'],['LICENSE','Commercial'],['HOSTED IN','US, EU, APAC']].map(([k, v]) => (
                <div key={k} className="row" style={{ justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2d2d2d', fontSize: 12 }}>
                  <span className="mono-caps text-meta" style={{ fontSize: 9 }}>{k}</span><span className="t-mono" style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12 NEWS */}
      <section id="sec-news" style={{ marginBottom: 48 }}>
        <SectionH kicker="12 · NEWS & RELEASES" action="Subscribe RSS" />
        <div className="col">
          {window.NEWS.slice(0, 5).map(n => (
            <div key={n.slug} className="list-link" onClick={() => navigate({ name: 'newsItem', slug: n.slug })}>
              <span className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', minWidth: 80 }}>{n.kind?.toUpperCase()}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{n.headline}</span>
              <span className="mono-caps text-meta tnum" style={{ fontSize: 10 }}>{n.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 13 DEALS */}
      <section id="sec-deals" style={{ marginBottom: 48 }}>
        <SectionH kicker="13 · ACTIVE DEALS" />
        <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
          {window.DEALS.slice(0, 3).map(d => <div key={d.slug} style={{ flex: '1 1 240px' }}><DealCard d={d} locked={d.tier === 'pro'} onUpgrade={() => {}} onClaim={() => {}} /></div>)}
        </div>
      </section>

      {/* 14 WORKS WITH */}
      <section id="sec-works" style={{ marginBottom: 48 }}>
        <SectionH kicker="14 · WORKS WELL WITH" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {window.RESOURCES.slice(0, 6).map(r => (
            <div key={r.slug} className="list-link" onClick={() => navigate({ name: 'resource', slug: r.slug, type: r.type })}>
              <span className="mono-caps text-meta" style={{ fontSize: 9, minWidth: 32 }}>{(window.RESOURCE_TYPES.find(t => t.id === r.type) || {}).glyph}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{r.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 15 COMPARE */}
      <section id="sec-compare" style={{ marginBottom: 48 }}>
        <SectionH kicker="15 · COMPARE WITH" />
        <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
          {window.MODELS.filter(x => x.slug !== m.slug).slice(0, 4).map(x => (
            <button key={x.slug} className="card lift" style={{ flex: '1 1 200px', padding: 18, cursor: 'pointer', textAlign: 'left', background: '#131313', border: '1px solid #2d2d2d', color: 'inherit' }} onClick={() => navigate({ name: 'compare', ids: [m.slug, x.slug] })}>
              <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>VS</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{x.name}</div>
              <div className="text-meta" style={{ fontSize: 12, marginTop: 4 }}>${x.priceIn}/${x.priceOut} · ★{x.score || 4.5}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 16 ALTERNATIVES */}
      <section id="sec-alts" style={{ marginBottom: 48 }}>
        <SectionH kicker="16 · ALTERNATIVES" />
        <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
          {[{ k: 'Cheaper', c: '#3cffd0' }, { k: 'Faster', c: '#f5e642' }, { k: 'Smarter', c: '#5200ff' }, { k: 'Open', c: '#ff3cac' }].map((a, i) => {
            const alt = window.MODELS.filter(x => x.slug !== m.slug)[i];
            if (!alt) return null;
            return (
              <div key={a.k} className="card lift" style={{ flex: '1 1 200px', padding: 18, cursor: 'pointer' }} onClick={() => navigate({ name: 'model', slug: alt.slug })}>
                <div className="mono-caps" style={{ fontSize: 9, color: a.c, marginBottom: 8 }}>{a.k.toUpperCase()}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{alt.name}</div>
                <div className="text-meta" style={{ fontSize: 12 }}>-{40 + i * 10}% per token</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 17 VERDICT */}
      <section id="sec-verdict" style={{ marginBottom: 48 }}>
        <SectionH kicker="17 · COMMUNITY VERDICT" />
        <ReviewsBlock r={{ score: m.score || 4.7, reviews: 247 }} compact />
      </section>

      {/* 18 PROMPTING TIPS */}
      <section id="sec-tips" style={{ marginBottom: 48 }}>
        <SectionH kicker="18 · PROMPTING TIPS & QUIRKS" />
        <div className="col gap-12">
          {[
            { author: '@kerrigan', up: 47, body: 'Lead with the file structure. Opus loses focus on >50K tokens of mixed code.' },
            { author: '@morgan', up: 32, body: 'Use the cache. With prompt caching enabled, ongoing costs drop 70% for agentic loops.' },
            { author: '@benhope', up: 28, body: 'Reasoning mode is 4x slower but worth it for refactor-heavy tasks. Skip for boilerplate.' },
          ].map(t => (
            <div key={t.author} className="card">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{t.author}</span>
                <span className="mono-caps text-meta tnum" style={{ fontSize: 10 }}>▲ {t.up}</span>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: '#cfcfcf' }}>{t.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 19 SAFETY */}
      <section id="sec-safety" style={{ marginBottom: 48 }}>
        <SectionH kicker="19 · SAFETY · POLICY · REGIONS" />
        <div className="row gap-16" style={{ flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1 1 240px' }}>
            <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 10 }}>COMPLIANCE</div>
            {['SOC 2 Type II', 'HIPAA BAA', 'ISO 27001', 'GDPR', 'EU AI Act · Tier 2'].map(c => <div key={c} className="row gap-8" style={{ fontSize: 13, padding: '4px 0' }}><Icon.check size={14} stroke="#3cffd0" />{c}</div>)}
          </div>
          <div className="card" style={{ flex: '1 1 240px' }}>
            <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 10 }}>DATA RETENTION</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#cfcfcf' }}>30 days standard. Zero retention available on Enterprise. Inputs not used for training.</div>
          </div>
          <div className="card" style={{ flex: '1 1 240px' }}>
            <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 10 }}>REGIONS</div>
            <div className="row gap-8" style={{ flexWrap: 'wrap' }}>{['US-East','US-West','EU-Central','APAC-Tokyo','APAC-Sydney'].map(r => <span key={r} className="stack-chip">{r}</span>)}</div>
          </div>
        </div>
      </section>

      {/* 20 DEV REFERENCE */}
      <section id="sec-ref" style={{ marginBottom: 48 }}>
        <SectionH kicker="20 · DEVELOPER REFERENCE" />
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="row" style={{ borderBottom: '1px solid #2d2d2d', padding: '10px 14px', gap: 4 }}>
            {['Python','TypeScript','Go','Rust','cURL','OpenAI compat'].map((l, i) => (
              <button key={l} className="mono-caps" style={{ background: i === 0 ? 'rgba(60,255,208,0.08)' : 'transparent', color: i === 0 ? '#3cffd0' : '#949494', border: 'none', padding: '6px 12px', fontSize: 10, cursor: 'pointer', borderRadius: 2 }}>{l}</button>
            ))}
          </div>
          <CodeBlock noCard code={`from anthropic import Anthropic\n\nclient = Anthropic()\nresponse = client.messages.create(\n    model="${m.slug}",\n    max_tokens=1024,\n    messages=[\n        {"role": "user", "content": "Refactor this React component"}\n    ]\n)\nprint(response.content[0].text)`} lang="python" />
        </div>
      </section>

      {/* 21 TIMELINE */}
      <section id="sec-timeline" style={{ marginBottom: 48 }}>
        <SectionH kicker="21 · TIMELINE" />
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          <div style={{ position: 'absolute', left: 7, top: 4, bottom: 4, width: 1, background: '#2d2d2d' }} />
          {[
            { v: 'PRICE DROP', d: 'TODAY', body: `Input price cut 30% to $${m.priceIn}/M. Output unchanged.`, color: '#3cffd0' },
            { v: 'v4.7 RELEASED', d: 'APR 19', body: 'Reasoning mode improvements. SWE-Bench score +12pt.', color: '#fafafa' },
            { v: 'CACHING GA', d: 'APR 03', body: 'Prompt caching exits beta. 90% read discount.', color: '#fafafa' },
            { v: 'v4.6', d: 'MAR 12', body: 'Vision input quality improvements.', color: '#fafafa' },
            { v: 'v4.5', d: 'JAN 22', body: 'Initial 4.x release.', color: '#fafafa' },
          ].map((v, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position: 'absolute', left: -20, top: 4, width: 11, height: 11, background: i === 0 ? v.color : '#131313', border: `1px solid ${v.color}`, borderRadius: '50%' }} />
              <div className="row gap-12"><span className="mono-caps tnum" style={{ fontSize: 11, fontWeight: 700, color: v.color }}>{v.v}</span><span className="mono-caps text-meta" style={{ fontSize: 10 }}>{v.d}</span></div>
              <div className="text-meta" style={{ fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{v.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 22 SOURCES */}
      <section id="sec-sources" style={{ marginBottom: 48 }}>
        <details className="card" style={{ padding: 18 }}>
          <summary className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', cursor: 'pointer' }}>22 · SOURCES & METHODOLOGY ▾</summary>
          <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.7, color: '#cfcfcf' }}>
            <p>Pricing scraped from {m.provider}'s public pricing page every 6 hours. Capabilities verified weekly via the gateway against canonical test prompts. Benchmark scores cited from primary sources where possible; community-run benchmarks marked with confidence dots.</p>
            <p style={{ marginTop: 10 }}>Real-world vibe-coding performance is aggregated from gateway telemetry across {(2143).toLocaleString()} sessions. Self-reported numbers are clearly labeled.</p>
          </div>
        </details>
      </section>
    </main>
  );
};

const CostCalculator = ({ m }) => {
  const [preset, setPreset] = uS_p3('agentic-cursor');
  const [inTok, setInTok] = uS_p3(8500);
  const [outTok, setOutTok] = uS_p3(1200);
  const [calls, setCalls] = uS_p3(1200);
  const [cache, setCache] = uS_p3(60);
  const monthly = uM_p3(() => {
    const day = (inTok * (1 - cache / 100) * m.priceIn / 1e6) + (outTok * m.priceOut / 1e6);
    return day * calls * 30;
  }, [inTok, outTok, calls, cache, m.priceIn, m.priceOut]);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="row" style={{ padding: 16, borderBottom: '1px solid #2d2d2d', flexWrap: 'wrap', gap: 8 }}>
        {[['agentic-cursor','Agentic · Cursor'],['chatbot-light','Chatbot · light'],['rag','RAG pipeline'],['batch','Batch'],['custom','Custom']].map(([id, l]) => (
          <button key={id} className="mono-caps" onClick={() => setPreset(id)} style={{ background: preset === id ? 'rgba(60,255,208,0.08)' : 'transparent', color: preset === id ? '#3cffd0' : '#949494', border: `1px solid ${preset === id ? '#309875' : '#2d2d2d'}`, borderRadius: 40, padding: '6px 12px', fontSize: 10, cursor: 'pointer' }}>{l}</button>
        ))}
      </div>
      <div className="row" style={{ alignItems: 'stretch', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 360px', padding: 24, borderRight: '1px solid #2d2d2d' }}>
          {[
            { l: 'Input tokens / call', v: inTok, set: setInTok, max: 50000, fmt: v => v.toLocaleString() },
            { l: 'Output tokens / call', v: outTok, set: setOutTok, max: 8000, fmt: v => v.toLocaleString() },
            { l: 'Calls / day', v: calls, set: setCalls, max: 10000, fmt: v => v.toLocaleString() },
            { l: 'Cache hit rate', v: cache, set: setCache, max: 100, fmt: v => v + '%' },
          ].map(s => (
            <div key={s.l} style={{ marginBottom: 16 }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{s.l.toUpperCase()}</span>
                <span className="t-mono tnum" style={{ fontWeight: 700, fontSize: 13, color: '#3cffd0' }}>{s.fmt(s.v)}</span>
              </div>
              <input type="range" min="0" max={s.max} value={s.v} onChange={e => s.set(+e.target.value)} style={{ width: '100%', accentColor: '#3cffd0' }} />
            </div>
          ))}
        </div>
        <div style={{ flex: '1 1 280px', padding: 24, background: '#0a0a0a' }}>
          <div className="mono-caps text-meta" style={{ fontSize: 10, marginBottom: 8 }}>MONTHLY COST</div>
          <div className="t-display" style={{ fontSize: 88, color: '#3cffd0', lineHeight: 0.95, marginBottom: 8 }}>${monthly.toFixed(0)}</div>
          <div className="mono-caps tnum" style={{ fontSize: 11, color: monthly > 432 ? '#ff3cac' : '#3cffd0', marginBottom: 16 }}>
            {monthly > 432 ? '▲' : '▼'} {Math.abs(((monthly - 432) / 432 * 100)).toFixed(0)}% vs last month
          </div>
          <div className="hairline" style={{ paddingTop: 16 }}>
            <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 10 }}>VS ALTERNATIVES</div>
            {window.MODELS.filter(x => x.slug !== m.slug).slice(0, 3).map(alt => {
              const altMo = monthly * (alt.priceIn / m.priceIn) * 0.9;
              const diff = ((altMo - monthly) / monthly * 100).toFixed(0);
              return (
                <div key={alt.slug} className="row" style={{ padding: '6px 0', borderBottom: '1px solid #2d2d2d', fontSize: 12 }}>
                  <span style={{ flex: 1 }}>{alt.name}</span>
                  <span className="t-mono tnum" style={{ minWidth: 70, textAlign: 'right' }}>${altMo.toFixed(0)}/mo</span>
                  <span className="mono-caps tnum" style={{ minWidth: 50, textAlign: 'right', color: diff < 0 ? '#3cffd0' : '#ff3cac', fontSize: 10 }}>{diff > 0 ? '+' : ''}{diff}%</span>
                </div>
              );
            })}
          </div>
          <div className="row gap-8" style={{ marginTop: 16 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Save workload</button>
            <button className="btn btn-secondary btn-sm">Set alert</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPARE FULL PAGE
const ComparePage = ({ ids, navigate }) => {
  const models = ids.map(id => window.MODELS.find(m => m.slug === id)).filter(Boolean).slice(0, 4);
  return (
    <main style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px 80px' }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>COMPARE · {models.length} MODELS</div>
      <h1 className="t-display" style={{ fontSize: 'clamp(48px, 8vw, 112px)', lineHeight: 0.92, marginBottom: 32 }}>{models.map(m => m.name).join(' VS ').toUpperCase()}.</h1>

      {/* Sticky headers */}
      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="tbl" style={{ minWidth: 720 }}>
          <thead style={{ position: 'sticky', top: 0, background: '#131313' }}>
            <tr>
              <th style={{ width: 200 }} />
              {models.map(m => (
                <th key={m.slug}>
                  <div className="col gap-8">
                    <ProviderMark provider={m.provider} color={m.providerColor} size={32} />
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#fafafa', textTransform: 'none' }}>{m.name}</div>
                    <div className="t-mono tnum text-meta" style={{ fontSize: 11 }}>${m.priceIn}/${m.priceOut}/M</div>
                  </div>
                </th>
              ))}
              {models.length < 4 && (
                <th><button className="btn btn-secondary btn-sm">+ Add model</button></th>
              )}
            </tr>
          </thead>
          <tbody>
            {[
              ['PRICING','Input price', m => `$${m.priceIn}/M`],
              [null, 'Output price', m => `$${m.priceOut}/M`],
              [null, 'Blended (3:1)', m => `$${((m.priceIn + m.priceOut * 3) / 4).toFixed(2)}/M`],
              ['CAPABILITIES','Reasoning', m => m.reasoning ? '✅' : '❌'],
              [null, 'Vision', m => m.vision ? '✅' : '❌'],
              [null, 'Tools', m => m.tools ? '✅' : '❌'],
              [null, 'Open weights', m => m.openWeights ? '✅' : '❌'],
              [null, 'Context', m => `${m.context || 200}K`],
              ['BENCHMARKS','SWE-Bench', (m, i) => `${(50 + i * 6).toFixed(1)}%`],
              [null, 'MMLU', (m, i) => `${(80 + i * 2).toFixed(1)}%`],
              [null, 'HumanEval', (m, i) => `${(85 + i * 2).toFixed(1)}%`],
              ['REAL WORLD','Avg session $', (m, i) => `$${(0.4 + i * 0.15).toFixed(2)}`],
              [null, 'Success rate', (m, i) => `${88 - i * 4}%`],
              [null, 'Speed (tok/s)', (m, i) => `${100 + i * 20}`],
            ].map((row, i) => (
              <React.Fragment key={i}>
                {row[0] && <tr><td colSpan={models.length + 2} style={{ background: '#0a0a0a' }}><div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0' }}>{row[0]}</div></td></tr>}
                <tr>
                  <td className="text-meta" style={{ fontSize: 13 }}>{row[1]}</td>
                  {models.map((m, mi) => {
                    const v = row[2](m, mi);
                    const winner = mi === 0;
                    return <td key={m.slug} className="t-mono tnum" style={{ fontWeight: 700, color: winner ? '#3cffd0' : '#fafafa' }}>{v}</td>;
                  })}
                  {models.length < 4 && <td />}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row gap-12" style={{ marginTop: 24, flexWrap: 'wrap' }}>
        <button className="btn btn-primary">▶ Try side-by-side</button>
        <button className="btn btn-secondary">Save comparison</button>
        <button className="btn btn-ghost">Share permalink</button>
      </div>
    </main>
  );
};

Object.assign(window, { ModelDetailPage, ComparePage });

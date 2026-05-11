// PROMPTKIT — Pages 2: Resource Detail, Model Detail, Compare
const { useState: uS_p2, useEffect: uE_p2, useMemo: uM_p2 } = React;

// ============== RESOURCE DETAIL (generic) ==============
const ResourceDetailPage = ({ slug, navigate, stack, onCompare, onSave, onClient }) => {
  const r = window.RESOURCES.find(x => x.slug === slug) || window.RESOURCES[0];
  const t = window.RESOURCE_TYPES.find(x => x.id === r.type);
  const [tab, setTab] = uS_p2('overview');
  const [installCli, setInstallCli] = uS_p2(stack.clients[0] || 'cursor');
  const [installState, setInstallState] = uS_p2('idle'); // idle | loading | success | error
  const [installOpen, setInstallOpen] = uS_p2(false);
  const [copied, setCopied] = uS_p2(false);

  const triggerInstall = () => {
    setInstallState('loading'); setInstallOpen(false);
    setTimeout(() => setInstallState('success'), 220);
    setTimeout(() => setInstallState('idle'), 3200);
  };
  const copyCmd = () => { navigator.clipboard?.writeText(r.install || ''); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>
      {/* HERO */}
      <div className="row gap-32" style={{ marginBottom: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: 240, height: 240, background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          {/* Geometric placeholder */}
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 30%, ${t.color || '#3cffd0'}22, transparent 60%)` }} />
          <div className="t-display" style={{ fontSize: 96, color: t.color || '#3cffd0', position: 'relative' }}>{(t.glyph || r.name)[0]}</div>
        </div>
        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          <div className="row gap-8" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="type-badge" style={{ borderColor: t.color, color: t.color }}>{t.glyph} {t.label}</span>
            <span className="status-pill"><span style={{ color: '#3cffd0' }}>●</span> AVAILABLE</span>
            {r.new && <span className="status-pill" style={{ color: '#ff3cac', borderColor: 'rgba(255,60,172,0.3)' }}>⚡ NEW</span>}
            <span className="status-pill">v{r.version || '2.3.1'} · {r.license || 'MIT'}</span>
          </div>
          <h1 className="t-display" style={{ fontSize: 'clamp(56px, 8vw, 96px)', lineHeight: 0.92, letterSpacing: 0.5, marginBottom: 12 }}>{r.name.toUpperCase()}.</h1>
          <div style={{ fontSize: 20, color: '#cfcfcf', marginBottom: 24, lineHeight: 1.4, maxWidth: 720 }}>{r.tagline}</div>
          <div className="row gap-16" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
            <div className="row gap-8"><span className="mono-caps text-meta" style={{ fontSize: 10 }}>BY</span><span style={{ fontSize: 13, fontWeight: 700 }}>{r.author || 'community'}</span></div>
            <div className="row gap-8"><span className="mono-caps text-meta" style={{ fontSize: 10 }}>COMPATIBLE</span><ClientRow ids={r.clients} max={6} size={20} /></div>
            <div className="row gap-8" style={{ flexWrap: 'wrap' }}>{(r.stack || []).slice(0, 4).map(s => <span key={s} className="stack-chip">{s}</span>)}</div>
          </div>

          {/* Install button — signature */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 12, marginBottom: 20 }}>
            <div style={{ position: 'relative' }}>
              <button onClick={triggerInstall} className="install-btn" style={{
                width: '100%', textAlign: 'left', padding: '16px 18px', background: installState === 'success' ? '#3cffd0' : '#131313',
                color: installState === 'success' ? '#000' : '#fafafa',
                border: `1px solid ${installState === 'success' ? '#3cffd0' : '#3cffd0'}`,
                borderRadius: 8, cursor: 'pointer', transition: 'all 180ms', display: 'flex', alignItems: 'center', gap: 14
              }}>
                <span style={{ width: 24, height: 24, background: installState === 'success' ? '#000' : '#3cffd0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon.download size={14} stroke={installState === 'success' ? '#3cffd0' : '#000'} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono-caps" style={{ fontSize: 10, color: installState === 'success' ? '#000' : '#3cffd0', marginBottom: 2 }}>
                    {installState === 'loading' ? 'OPENING...' : installState === 'success' ? '✓ INSTALLED' : `INSTALL FOR ${(window.CLIENTS.find(c => c.id === installCli) || {}).name?.toUpperCase()}`}
                  </div>
                  <div className="t-mono" style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.install || `cursor://install?name=${r.slug}`}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setInstallOpen(!installOpen); }} aria-label="More install options" style={{ background: 'transparent', border: 'none', color: installState === 'success' ? '#000' : '#fafafa', cursor: 'pointer', padding: 6 }}>
                  <Icon.chev size={16} />
                </button>
              </button>
              {installOpen && (
                <div className="card" style={{ position: 'absolute', top: '100%', marginTop: 4, left: 0, right: 0, padding: 6, zIndex: 30, background: '#0a0a0a' }}>
                  {window.CLIENTS.slice(0, 6).map((c, i) => (
                    <button key={c.id} onClick={() => { setInstallCli(c.id); setInstallOpen(false); }} className="row gap-12" style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: '#fafafa', fontSize: 13, cursor: 'pointer', borderRadius: 4, textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(60,255,208,0.06)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ width: 18, height: 18, background: c.color, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 10 }}>{c.name[0]}</span>
                      <span style={{ flex: 1 }}>{c.name}</span>
                      <span className="mono-caps text-meta" style={{ fontSize: 9 }}>{i === 0 ? 'DEEPLINK ★' : i === 1 ? 'CLI' : 'CONFIG'}</span>
                    </button>
                  ))}
                  <div className="hairline" style={{ marginTop: 4, paddingTop: 4 }}>
                    <button onClick={copyCmd} className="row gap-12" style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: '#3cffd0', fontSize: 12, cursor: 'pointer' }}>
                      <Icon.copy size={13} /><span>{copied ? 'COPIED' : 'COPY JSON SNIPPET'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-secondary" onClick={() => setTab('try')}><Icon.play size={14} /> Try</button>
            <button className="btn btn-secondary" onClick={() => onCompare(r)}><Icon.compare size={14} /> Compare</button>
            <button className="btn btn-ghost" onClick={() => onSave(r.slug)} aria-label="Save"><Icon.bookmark size={16} /></button>
          </div>

          {/* Stats strip */}
          <div className="row gap-20" style={{ flexWrap: 'wrap' }}>
            <Stat label="UPVOTES" value={(r.upvotes || 1247).toLocaleString()} />
            <Stat label="INSTALLS · 7D" value={`${(r.installs7d / 1000).toFixed(1)}K`} delta={12} />
            <Stat label="RATING" value={`★ ${r.score}`} hint={`${r.reviews || 89} reviews`} />
            <Stat label="VERIFIED" value="99.2%" hint="auto-tested 24h ago" />
            <Stat label="UPDATED" value={r.updated || '3D'} />
            <Stat label="FORKS" value={r.forks || 142} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="row" style={{ borderBottom: '1px solid #2d2d2d', gap: 0, overflow: 'auto', marginBottom: 32 }}>
        {['overview','try','guides','install','source','compatibility','reviews','versions','forks','analytics'].map(x => (
          <button key={x} className="mono-caps" onClick={() => setTab(x)} style={{ padding: '12px 18px', background: 'transparent', border: 'none', color: tab === x ? '#3cffd0' : '#949494', borderBottom: tab === x ? '2px solid #3cffd0' : '2px solid transparent', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>{x}</button>
        ))}
      </div>

      {/* LAYOUT */}
      <div className="row gap-32" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {tab === 'overview' && <ResourceOverview r={r} t={t} navigate={navigate} />}
          {tab === 'try' && <ResourceTryBlock r={r} t={t} />}
          {tab === 'guides' && <ResourceGuides r={r} navigate={navigate} />}
          {tab === 'install' && <ResourceInstallTab r={r} />}
          {tab === 'compatibility' && <CompatibilityMatrix r={r} />}
          {tab === 'source' && <CodeBlock code={`# ${r.name}\n${r.tagline}\n\nclone https://github.com/${r.author || 'community'}/${r.slug}.git`} lang="bash" />}
          {tab === 'reviews' && <ReviewsBlock r={r} />}
          {tab === 'versions' && <VersionsBlock r={r} />}
          {(tab === 'forks' || tab === 'analytics') && <EmptyState glyph="◷" title="Soon" body="Live data wires up post-launch." />}
        </div>

        {/* RIGHT RAIL */}
        <aside className="hide-mobile" style={{ width: 280, flexShrink: 0, position: 'sticky', top: 76 }}>
          <RightRail r={r} onCompare={() => onCompare(r)} navigate={navigate} />
        </aside>
      </div>
    </main>
  );
};

const ResourceOverview = ({ r, t, navigate }) => (
  <div>
    {/* Type-specific block */}
    <section style={{ marginBottom: 40 }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 14 }}>{(t.label || '').toUpperCase()} · DETAILS</div>
      {t.id === 'mcp' ? <MCPInspector r={r} /> :
       t.id === 'component' ? <ComponentSandpack r={r} /> :
       t.id === 'skill' ? <SkillViewer r={r} /> :
       t.id === 'rule' ? <RuleViewer r={r} /> :
       t.id === 'subagent' ? <SubagentViewer r={r} /> :
       t.id === 'prompt' ? <PromptPlayground r={r} /> :
       t.id === 'plugin' ? <PluginBundle r={r} /> :
       t.id === 'hook' ? <HookViewer r={r} /> :
       t.id === 'command' ? <CommandRunner r={r} /> :
       t.id === 'starter' ? <StarterPreview r={r} /> :
       t.id === 'workflow' ? <WorkflowStepper r={r} /> :
       t.id === 'showcase' ? <ShowcaseHero r={r} /> :
       t.id === 'eval' ? <EvalLeaderboard r={r} /> :
       t.id === 'sandbox' ? <SandboxBlock r={r} /> :
       t.id === 'tool' ? <ToolBlock r={r} /> :
       t.id === 'asset' ? <AssetGrid r={r} /> :
       t.id === 'docs' ? <DocsPreview r={r} /> :
       t.id === 'spec' ? <SpecBlock r={r} /> :
       t.id === 'stack' ? <StackBlock r={r} navigate={navigate} /> :
       t.id === 'backend' ? <BackendKitBlock r={r} /> :
       t.id === 'observability' ? <ObservabilityBlock r={r} /> :
       t.id === 'marketplace' ? <MarketplaceBlock r={r} navigate={navigate} /> :
       t.id === 'script' ? <ScriptBlock r={r} /> :
       <GenericReadme r={r} />}
    </section>

    {/* BEST FOR */}
    <section style={{ marginBottom: 40 }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 14 }}>BEST FOR</div>
      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
        {['Browser automation #1','Web scraping #3','E2E testing #4','RAG ingestion #6'].map(x => (
          <button key={x} className="card" style={{ padding: '12px 18px', cursor: 'pointer', background: 'rgba(60,255,208,0.04)', borderColor: '#309875' }}>
            <span style={{ fontSize: 14, color: '#fafafa' }}>{x}</span>
          </button>
        ))}
      </div>
    </section>

    {/* ALTERNATIVES */}
    <section style={{ marginBottom: 40 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0' }}>ALTERNATIVES</div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate({ name: 'directory', type: r.type })}>See all →</button>
      </div>
      <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
        {[
          { kind: 'Cheaper', color: '#3cffd0' },
          { kind: 'Faster', color: '#f5e642' },
          { kind: 'Smarter', color: '#5200ff' },
          { kind: 'Open source', color: '#ff3cac' },
        ].map((a, i) => {
          const alt = window.RESOURCES.filter(x => x.type === r.type && x.slug !== r.slug)[i];
          if (!alt) return null;
          return (
            <div key={a.kind} className="card lift" style={{ flex: '1 1 220px', padding: 20, cursor: 'pointer' }} onClick={() => navigate({ name: 'resource', slug: alt.slug, type: alt.type })}>
              <div className="mono-caps" style={{ fontSize: 9, color: a.color, marginBottom: 8 }}>{a.kind.toUpperCase()}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{alt.name}</div>
              <div className="text-meta" style={{ fontSize: 12 }}>{alt.tagline}</div>
            </div>
          );
        })}
      </div>
    </section>

    {/* WORKS WELL WITH */}
    <section style={{ marginBottom: 40 }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 14 }}>WORKS WELL WITH</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {window.RESOURCES.filter(x => x.slug !== r.slug).slice(0, 4).map(x => (
          <div key={x.slug} className="list-link" onClick={() => navigate({ name: 'resource', slug: x.slug, type: x.type })}>
            <span className="mono-caps" style={{ fontSize: 9, color: '#949494', minWidth: 32 }}>{(window.RESOURCE_TYPES.find(tp => tp.id === x.type) || {}).glyph}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{x.name}</span>
            <span className="mono-caps text-meta tnum" style={{ fontSize: 10 }}>★ {x.score}</span>
          </div>
        ))}
      </div>
    </section>

    {/* COMMUNITY VERDICT */}
    <section style={{ marginBottom: 40 }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 14 }}>COMMUNITY VERDICT</div>
      <ReviewsBlock r={r} compact />
    </section>

    {/* TIMELINE */}
    <VersionsBlock r={r} compact />
  </div>
);

const GenericReadme = ({ r }) => (
  <div className="card" style={{ padding: 28 }}>
    <div className="t-display" style={{ fontSize: 32, marginBottom: 16 }}>OVERVIEW</div>
    <div style={{ fontFamily: "'Newsreader', serif", fontSize: 16, lineHeight: 1.7, color: '#cfcfcf' }}>
      {r.tagline}. This {r.type} works with {(r.clients || []).map(c => (window.CLIENTS.find(x => x.id === c) || {}).name).filter(Boolean).join(', ')} and the {(r.stack || []).slice(0, 3).join(' / ')} stack. Verified {r.updated || '3 days ago'}, currently at v{r.version || '2.3.1'} under {r.license || 'MIT'}.
    </div>
    <div className="row gap-12" style={{ marginTop: 20 }}>
      <a className="btn btn-secondary btn-sm">README →</a>
      <a className="btn btn-secondary btn-sm">CHANGELOG →</a>
      <a className="btn btn-secondary btn-sm">GitHub →</a>
    </div>
  </div>
);

// MCP TOOL INSPECTOR
const MCPInspector = ({ r }) => {
  const tools = [
    { n: 'search_files', d: 'Search files by pattern', destructive: false },
    { n: 'read_file', d: 'Read a file', destructive: false },
    { n: 'write_file', d: 'Write or overwrite', destructive: true },
    { n: 'list_directory', d: 'List directory contents', destructive: false },
    { n: 'execute_command', d: 'Run shell command', destructive: true },
  ];
  const [sel, setSel] = uS_p2('search_files');
  const [pattern, setPattern] = uS_p2('*.ts');
  const [running, setRunning] = uS_p2(false);
  const [result, setResult] = uS_p2(null);
  const tool = tools.find(t => t.n === sel);
  const run = () => {
    setRunning(true);
    setTimeout(() => {
      setResult({ matches: ['src/auth/oauth.ts','src/auth/session.ts','src/auth/middleware.ts'] });
      setRunning(false);
    }, 600);
  };
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid #2d2d2d', justifyContent: 'space-between' }}>
        <div className="row gap-8"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3cffd0' }} /><span className="mono-caps" style={{ fontSize: 11, color: '#fafafa' }}>TRY THIS MCP — NO INSTALLATION</span></div>
        <span className="mono-caps text-meta" style={{ fontSize: 10 }}>● LIVE · 7 / 10 INVOCATIONS REMAINING TODAY</span>
      </div>
      <div className="row" style={{ alignItems: 'stretch' }}>
        <div style={{ width: 220, borderRight: '1px solid #2d2d2d', padding: 12 }}>
          <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 10, padding: '0 8px' }}>TOOLS · {tools.length}</div>
          {tools.map(t => (
            <button key={t.n} onClick={() => { setSel(t.n); setResult(null); }} className="row gap-8" style={{ width: '100%', textAlign: 'left', padding: '8px 10px', background: sel === t.n ? 'rgba(60,255,208,0.08)' : 'transparent', border: 'none', borderRadius: 4, color: sel === t.n ? '#3cffd0' : '#fafafa', fontFamily: "'Space Mono', monospace", fontSize: 12, cursor: 'pointer', marginBottom: 2 }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.n}</span>
              {t.destructive && <span title="Destructive" style={{ color: '#ff3cac', fontSize: 10 }}>⚠</span>}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: 20 }}>
          <div className="t-mono" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{tool.n}</div>
          {tool.destructive && <div className="status-pill" style={{ color: '#ff3cac', borderColor: 'rgba(255,60,172,0.3)', marginBottom: 10 }}>⚠ DESTRUCTIVE</div>}
          <div className="text-meta" style={{ fontSize: 13, marginBottom: 16 }}>{tool.d}</div>
          <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>INPUT</div>
          <div className="col gap-8" style={{ marginBottom: 16 }}>
            <div className="row gap-8" style={{ alignItems: 'center' }}><span className="t-mono text-meta" style={{ fontSize: 12, minWidth: 90 }}>pattern *</span><input className="input" value={pattern} onChange={e => setPattern(e.target.value)} style={{ flex: 1 }} /></div>
            <div className="row gap-8" style={{ alignItems: 'center' }}><span className="t-mono text-meta" style={{ fontSize: 12, minWidth: 90 }}>path</span><input className="input" placeholder="/" style={{ flex: 1 }} /></div>
            <div className="row gap-8" style={{ alignItems: 'center' }}><span className="t-mono text-meta" style={{ fontSize: 12, minWidth: 90 }}>max_results</span><input className="input" defaultValue="10" style={{ width: 100 }} /></div>
          </div>
          <div className="row gap-8" style={{ marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>{running ? '...' : '▶ Run'}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setResult(null)}>Reset</button>
          </div>
          {result && (
            <div>
              <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>RESULT · 23MS</div>
              <CodeBlock code={JSON.stringify(result, null, 2)} lang="json" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ComponentSandpack = ({ r }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div className="row" style={{ padding: '12px 16px', borderBottom: '1px solid #2d2d2d' }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#fafafa', flex: 1 }}>LIVE PREVIEW</div>
      <div className="row gap-2"><span className="status-pill" style={{ borderColor: '#309875', color: '#3cffd0' }}>tsx</span><span className="status-pill">tailwind</span></div>
    </div>
    <div className="row" style={{ minHeight: 320 }}>
      <div style={{ width: 320, borderRight: '1px solid #2d2d2d', background: '#0a0a0a', padding: 14 }}>
        <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>FILES</div>
        {['component.tsx','demo.tsx','tailwind.config.js'].map((f, i) => (
          <div key={f} style={{ padding: '6px 8px', background: i === 0 ? 'rgba(60,255,208,0.08)' : 'transparent', borderRadius: 3, fontFamily: "'Space Mono', monospace", fontSize: 12, color: i === 0 ? '#3cffd0' : '#cfcfcf', marginBottom: 2 }}>{f}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div className="card" style={{ padding: 28, minWidth: 280, borderColor: '#3cffd0' }}>
          <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 10 }}>★ COMPONENT PREVIEW</div>
          <div className="t-display" style={{ fontSize: 32, marginBottom: 8 }}>{r.name}</div>
          <div className="text-meta" style={{ fontSize: 13 }}>Live, hot-reloaded.</div>
        </div>
      </div>
    </div>
  </div>
);

const SkillViewer = ({ r }) => {
  const triggers = [
    'User asks to scaffold a new feature',
    'Codebase contains a *.skill.md hint file',
    'Detected pattern: missing tests on new code',
  ];
  const tools = [
    { n: 'Read', allowed: true }, { n: 'Write', allowed: true }, { n: 'Edit', allowed: true },
    { n: 'Bash', allowed: true }, { n: 'Grep', allowed: true }, { n: 'Glob', allowed: true },
    { n: 'WebFetch', allowed: false }, { n: 'WebSearch', allowed: false },
  ];
  const [forked, setForked] = uS_p2(false);
  return (
    <div className="col gap-16">
      {/* Identity card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid #2d2d2d', justifyContent: 'space-between' }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0' }}>SKILL.MD · v{r.version || '2.3.1'}</div>
          <div className="row gap-6">
            <button className="btn btn-secondary btn-sm" onClick={() => setForked(!forked)}>{forked ? '✓ Forked to @benhope' : 'Fork to my skills'}</button>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div className="row gap-32" style={{ flexWrap: 'wrap', marginBottom: 18 }}>
            <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>MODEL ASSIGNMENT</div><div style={{ fontSize: 14, fontWeight: 700 }}>claude-sonnet-4.6 <span className="text-meta" style={{ fontSize: 11 }}>(parent default)</span></div></div>
            <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>INVOCATIONS · 7D</div><div className="t-display" style={{ fontSize: 22, color: '#3cffd0' }}>1,847</div></div>
            <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>SUCCESS RATE</div><div className="t-display" style={{ fontSize: 22, color: '#3cffd0' }}>92.4%</div></div>
            <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>AVG TOK / RUN</div><div className="t-display" style={{ fontSize: 22 }}>4,260</div></div>
          </div>
          <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>WHEN TO INVOKE</div>
          <div className="col gap-4" style={{ marginBottom: 16 }}>
            {triggers.map((t, i) => (
              <div key={i} className="row gap-10" style={{ padding: '8px 12px', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 4 }}>
                <span className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', minWidth: 14 }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: '#cfcfcf' }}>{t}</span>
              </div>
            ))}
          </div>
          <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>TOOL ACCESS</div>
          <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
            {tools.map(t => (
              <span key={t.n} className="status-pill" style={{ borderColor: t.allowed ? '#309875' : '#2d2d2d', color: t.allowed ? '#3cffd0' : '#5a5a5a', opacity: t.allowed ? 1 : 0.6 }}>
                {t.allowed ? '✓' : '✕'} {t.n.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SKILL.md preview */}
      <CodeBlock code={`---\nname: ${r.slug}\ndescription: ${r.tagline}\nallowed-tools: [Read, Write, Edit, Bash, Grep, Glob]\n---\n\n# ${r.name}\n\n## What this skill does\n${r.tagline}.\n\n## When to invoke\nWhen the user asks to scaffold, refactor, or audit ${r.stack?.[0] || 'TypeScript'} code\nfollowing the patterns documented in this skill.\n\n## Steps\n1. Read the relevant files (use Glob + Grep first)\n2. Plan the change against project conventions\n3. Apply with Edit; never Write a fresh copy unless creating a new file\n4. Run the test suite and verify\n5. Summarize the diff and flag any TODO comments`} lang="markdown" />
    </div>
  );
};

const RuleViewer = ({ r }) => {
  const conflicts = [
    { name: 'react-strict-mode.mdc', sev: 'soft' },
    { name: 'no-default-exports.mdc', sev: 'merged' },
  ];
  return (
    <div className="col gap-16">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0' }}>SCOPE & MATCHERS</div>
          <button className="btn btn-secondary btn-sm">Fork to my rules</button>
        </div>
        <div className="row gap-8" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
          <span className="status-pill" style={{ borderColor: '#309875', color: '#3cffd0' }}>● PROJECT SCOPE</span>
          <span className="status-pill">ALWAYS APPLIED</span>
          <span className="status-pill">PRIORITY · 7</span>
        </div>
        <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 6 }}>FILE GLOBS</div>
        <div className="row gap-6" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
          {['**/*.tsx', '**/*.ts', '!**/*.test.ts', '!node_modules/**'].map(g => (
            <span key={g} className="t-mono" style={{ fontSize: 12, padding: '4px 8px', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 3, color: g.startsWith('!') ? '#ff3cac' : '#3cffd0' }}>{g}</span>
          ))}
        </div>
        <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 6 }}>CONFLICTS WITH</div>
        <div className="col gap-4">
          {conflicts.map(c => (
            <div key={c.name} className="row gap-10" style={{ padding: '6px 10px', fontSize: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.sev === 'soft' ? '#f5e642' : '#3cffd0' }} />
              <span className="t-mono">{c.name}</span>
              <span className="mono-caps text-meta" style={{ fontSize: 9, marginLeft: 'auto' }}>{c.sev === 'soft' ? '⚠ SOFT CONFLICT' : '✓ AUTO-MERGED'}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Diff viewer */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="row" style={{ padding: '12px 16px', borderBottom: '1px solid #2d2d2d' }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', flex: 1 }}>WHAT THIS RULE CHANGES · EXAMPLE</div>
          <span className="mono-caps text-meta" style={{ fontSize: 10 }}>BEFORE → AFTER</span>
        </div>
        <div className="row" style={{ alignItems: 'stretch' }}>
          <pre style={{ flex: 1, margin: 0, padding: 16, fontFamily: "'Space Mono', monospace", fontSize: 12, lineHeight: 1.6, color: '#cfcfcf', borderRight: '1px solid #2d2d2d', overflow: 'auto' }}>
{`export default function Card() {
  return <div>...</div>
}

// Lost type info on props
// Default export breaks tree-shaking`}
          </pre>
          <pre style={{ flex: 1, margin: 0, padding: 16, fontFamily: "'Space Mono', monospace", fontSize: 12, lineHeight: 1.6, color: '#cfcfcf', background: 'rgba(60,255,208,0.04)', overflow: 'auto' }}>
{`type CardProps = { title: string };

export function Card({ title }: CardProps) {
  return <div>{title}</div>
}

// Strict types + named export ✓`}
          </pre>
        </div>
      </div>
      <CodeBlock code={`---\nscope: project\napplyTo: ["**/*.tsx", "**/*.ts"]\nalwaysApply: true\npriority: 7\n---\n\n# ${r.name}\n\n${r.tagline}\n\n- Use TypeScript strict mode (\`"strict": true\` in tsconfig).\n- Prefer named exports for components and hooks.\n- No default exports outside Next.js page boundaries.\n- Always type props explicitly; never use \`any\`.`} lang="markdown" />
    </div>
  );
};

const ResourceTryBlock = ({ r, t }) => {
  if (t.id === 'mcp') return <MCPInspector r={r} />;
  if (t.id === 'component') return <ComponentSandpack r={r} />;
  return (
    <div className="card" style={{ padding: 32, textAlign: 'center' }}>
      <div className="t-display" style={{ fontSize: 32, marginBottom: 12 }}>TRY {r.name.toUpperCase()}</div>
      <div className="text-meta" style={{ marginBottom: 20 }}>Free trial: 10 invocations / day. Sign up for unlimited.</div>
      <button className="btn btn-primary">▶ Run trial invocation</button>
    </div>
  );
};

const ResourceGuides = ({ r, navigate }) => (
  <div>
    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 20 }}>
      <div className="t-display" style={{ fontSize: 36 }}>GUIDES (4)</div>
      <button className="btn btn-secondary btn-sm">+ Write a guide</button>
    </div>
    {[
      { kind: 'GET STARTED', items: [{ title: `Install ${r.name} on macOS`, dur: '5 min', diff: 'beginner' }] },
      { kind: 'USAGE', items: [{ title: 'Wire up the standard pattern', dur: '12 min', diff: 'intermediate' }, { title: 'Add custom hooks', dur: '8 min', diff: 'intermediate' }] },
      { kind: 'TROUBLESHOOT', items: [{ title: 'Common errors and fixes', dur: '4 min', diff: 'beginner' }] },
    ].map(g => (
      <div key={g.kind} style={{ marginBottom: 28 }}>
        <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>{g.kind}</div>
        <div className="col gap-4">{g.items.map(i => (
          <div key={i.title} className="list-link" onClick={() => navigate({ name: 'guide' })}>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{i.title}</span>
            <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{i.dur} · {i.diff.toUpperCase()}</span>
          </div>
        ))}</div>
      </div>
    ))}
  </div>
);

const ResourceInstallTab = ({ r }) => (
  <div className="col gap-16">
    {window.CLIENTS.slice(0, 5).map(c => (
      <div key={c.id} className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="row gap-10"><span style={{ width: 22, height: 22, background: c.color, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 11 }}>{c.name[0]}</span><span style={{ fontWeight: 700 }}>{c.name}</span></div>
          <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{c.id === 'cursor' ? 'DEEPLINK' : c.id === 'claude-code' ? 'CLI' : 'CONFIG'}</span>
        </div>
        <CodeBlock code={c.id === 'cursor' ? `cursor://install?name=${r.slug}` : c.id === 'claude-code' ? `claude code install ${r.slug}` : `// claude_desktop_config.json\n{\n  "mcpServers": {\n    "${r.slug}": { "command": "npx", "args": ["-y", "@${r.author || 'community'}/${r.slug}"] }\n  }\n}`} lang={c.id === 'claude-desktop' ? 'json' : 'bash'} />
      </div>
    ))}
  </div>
);

const CompatibilityMatrix = ({ r }) => (
  <table className="tbl">
    <thead><tr><th>Client</th><th>Latest</th><th>Status</th><th>Notes</th><th>Last verified</th></tr></thead>
    <tbody>
      {window.CLIENTS.map((c, i) => {
        const states = ['✅','✅','⚠️','✅','❌','❓'];
        const s = states[i % states.length];
        return (
          <tr key={c.id}>
            <td><div className="row gap-8"><span style={{ width: 18, height: 18, background: c.color, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 10 }}>{c.name[0]}</span>{c.name}</div></td>
            <td className="t-mono tnum text-meta">v0.{40 + i}.{i + 1}</td>
            <td><span style={{ fontSize: 18 }}>{s}</span></td>
            <td className="text-meta">{s === '⚠️' ? 'Tools API only — no resources' : s === '❌' ? 'Stdio transport not supported' : s === '❓' ? 'Untested' : 'Full support'}</td>
            <td className="mono-caps text-meta tnum" style={{ fontSize: 10 }}>{i + 1}H AGO</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const ReviewsBlock = ({ r, compact }) => {
  const reviews = [
    { author: '@benhope', stars: 5, body: 'Slot it in, ship in an afternoon. Zero footguns.', helpful: 47, time: '2D' },
    { author: '@morgan', stars: 4, body: 'Solid. The docs are thin but the code is readable. Lost a star on edge cases with auth tokens >2KB.', helpful: 22, time: '5D' },
    { author: '@kerrigan', stars: 5, body: 'Replaced 3 of our internal libraries with this. Aggressive caching kept our bill under budget.', helpful: 18, time: '1W' },
  ];
  return (
    <div>
      <div className="row gap-32" style={{ marginBottom: 20 }}>
        <div className="t-display" style={{ fontSize: 56, color: '#3cffd0' }}>★ {r.score}</div>
        <div className="col" style={{ flex: 1, justifyContent: 'center' }}>
          {[5,4,3,2,1].map(s => (
            <div key={s} className="row gap-8" style={{ fontSize: 12, color: '#cfcfcf' }}>
              <span className="t-mono" style={{ width: 16 }}>{s}★</span>
              <div style={{ flex: 1, height: 4, background: '#2d2d2d', borderRadius: 2, overflow: 'hidden' }}><div style={{ width: `${s === 5 ? 78 : s === 4 ? 18 : s === 3 ? 3 : 1}%`, height: '100%', background: '#3cffd0' }} /></div>
              <span className="t-mono text-meta" style={{ width: 30, textAlign: 'right' }}>{s === 5 ? 70 : s === 4 ? 16 : s === 3 ? 2 : 1}</span>
            </div>
          ))}
        </div>
        <div className="col gap-8">
          <button className="btn btn-secondary btn-sm">Write a review</button>
          <span className="mono-caps text-meta" style={{ fontSize: 9 }}>{r.reviews || 89} REVIEWS</span>
        </div>
      </div>
      <div className="row gap-8" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
        {['fast','reliable','great-docs','aggressive-caching','easy-install','steep-learning'].map(t => (
          <span key={t} className="stack-chip">{t}</span>
        ))}
      </div>
      <div className="col gap-12">
        {reviews.slice(0, compact ? 2 : 5).map(r => (
          <div key={r.author} className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="row gap-10"><div style={{ width: 24, height: 24, borderRadius: '50%', background: '#5200ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{r.author[1].toUpperCase()}</div><span style={{ fontWeight: 700, fontSize: 13 }}>{r.author}</span><span style={{ color: '#3cffd0' }}>{'★'.repeat(r.stars)}</span></div>
              <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{r.time} AGO</span>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: '#cfcfcf' }}>{r.body}</div>
            <div className="row gap-12" style={{ marginTop: 10 }}>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 8px' }}>👍 Helpful · {r.helpful}</button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 8px' }}>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VersionsBlock = ({ r, compact }) => {
  const versions = [
    { v: '2.3.1', d: '3D AGO', notes: 'Fix: edge case with tokens >2KB. New: experimental Cline support.' },
    { v: '2.3.0', d: '2W AGO', notes: 'Added Windsurf deeplink. Breaking: renamed `auth.url` to `auth.endpoint`.' },
    { v: '2.2.7', d: '1MO AGO', notes: 'Performance: 40% faster cold start.' },
    { v: '2.2.6', d: '1MO AGO', notes: 'Patch: race condition in session refresh.' },
  ];
  return (
    <section style={{ marginBottom: 40 }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 14 }}>TIMELINE</div>
      <div style={{ position: 'relative', paddingLeft: 24 }}>
        <div style={{ position: 'absolute', left: 7, top: 4, bottom: 4, width: 1, background: '#2d2d2d' }} />
        {versions.slice(0, compact ? 3 : 6).map((v, i) => (
          <div key={v.v} style={{ position: 'relative', paddingBottom: 20 }}>
            <div style={{ position: 'absolute', left: -20, top: 4, width: 11, height: 11, background: i === 0 ? '#3cffd0' : '#131313', border: '1px solid #3cffd0', borderRadius: '50%' }} />
            <div className="row gap-12" style={{ marginBottom: 4 }}><span className="t-mono" style={{ fontWeight: 700, fontSize: 13 }}>v{v.v}</span><span className="mono-caps text-meta" style={{ fontSize: 10 }}>{v.d}</span></div>
            <div className="text-meta" style={{ fontSize: 13, lineHeight: 1.5 }}>{v.notes}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const RightRail = ({ r, onCompare, navigate }) => (
  <div className="col gap-20">
    <div className="card">
      <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 10 }}>TL;DR</div>
      <ul style={{ margin: 0, paddingLeft: 14, fontSize: 13, lineHeight: 1.6, color: '#cfcfcf' }}>
        <li>Verified working with Cursor + Claude Code</li>
        <li>Best for {r.stack?.[0] || 'Next.js'} projects</li>
        <li>Active maintenance, weekly releases</li>
        <li>{r.installs7d ? `${(r.installs7d / 1000).toFixed(1)}K` : '4.3K'} installs / week</li>
      </ul>
    </div>
    <div className="card">
      <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 10 }}>QUICK ACTIONS</div>
      <div className="col gap-2">
        <button className="row gap-10" style={{ padding: '8px 4px', background: 'transparent', border: 'none', color: '#fafafa', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}><Icon.play size={14} stroke="#3cffd0" /> Try it now</button>
        <button onClick={onCompare} className="row gap-10" style={{ padding: '8px 4px', background: 'transparent', border: 'none', color: '#fafafa', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}><Icon.compare size={14} stroke="#3cffd0" /> Compare</button>
        <button className="row gap-10" style={{ padding: '8px 4px', background: 'transparent', border: 'none', color: '#fafafa', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}><Icon.bell size={14} stroke="#3cffd0" /> Set alert</button>
        <button className="row gap-10" style={{ padding: '8px 4px', background: 'transparent', border: 'none', color: '#fafafa', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}><Icon.layers size={14} stroke="#3cffd0" /> Add to stack</button>
        <button className="row gap-10" style={{ padding: '8px 4px', background: 'transparent', border: 'none', color: '#fafafa', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}><Icon.share size={14} stroke="#3cffd0" /> Share</button>
      </div>
    </div>
    <div className="card">
      <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 10 }}>BEST ALTERNATIVES</div>
      {window.RESOURCES.filter(x => x.type === r.type && x.slug !== r.slug).slice(0, 3).map(x => (
        <div key={x.slug} className="list-link" style={{ padding: '8px 0', borderBottom: '1px solid #2d2d2d' }} onClick={() => navigate({ name: 'resource', slug: x.slug, type: x.type })}>
          <span style={{ flex: 1, fontSize: 13 }}>{x.name}</span>
          <span className="mono-caps tnum text-meta" style={{ fontSize: 10 }}>★{x.score}</span>
        </div>
      ))}
    </div>
    <div className="card" style={{ borderColor: '#5200ff', background: 'rgba(82,0,255,0.04)' }}>
      <div className="mono-caps" style={{ fontSize: 10, color: '#b69dff', marginBottom: 10 }}>SUBSCRIBE</div>
      <div style={{ fontSize: 13, color: '#cfcfcf', marginBottom: 12 }}>Get notified on new releases.</div>
      <div className="row gap-8">
        <button className="btn btn-uv btn-sm" style={{ flex: 1, justifyContent: 'center' }}><Icon.bell size={12} /> Email</button>
        <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>RSS</button>
      </div>
    </div>
  </div>
);

// ============== ADDITIONAL TYPE-SPECIFIC BLOCKS ==============
const SubagentViewer = ({ r }) => {
  const tools = ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'WebFetch'];
  const [showTrace, setShowTrace] = uS_p2(false);
  return (
    <div className="col gap-16">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#ff6b35' }}>AGENT IDENTITY</div>
          <button className="btn btn-secondary btn-sm">Fork to my agents</button>
        </div>
        <div className="row gap-32" style={{ flexWrap: 'wrap', marginBottom: 18 }}>
          <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>MODEL</div><div style={{ fontSize: 14, fontWeight: 700 }}>claude-opus-4-7</div></div>
          <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>TEMPERATURE</div><div className="t-mono tnum" style={{ fontSize: 14, fontWeight: 700 }}>0.2</div></div>
          <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>MAX TOKENS</div><div className="t-mono tnum" style={{ fontSize: 14, fontWeight: 700 }}>16,000</div></div>
          <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>TIMEOUT</div><div className="t-mono tnum" style={{ fontSize: 14, fontWeight: 700 }}>5m</div></div>
          <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>BUDGET / RUN</div><div className="t-display" style={{ fontSize: 18, color: '#3cffd0' }}>$0.42</div></div>
        </div>
        <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>TOOL PERMISSIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6 }}>
          {tools.map((t, i) => (
            <div key={t} className="row gap-8" style={{ padding: '8px 10px', background: '#0a0a0a', border: `1px solid ${i < 5 ? '#309875' : '#2d2d2d'}`, borderRadius: 4 }}>
              <span style={{ color: i < 5 ? '#3cffd0' : '#5a5a5a', fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{i < 5 ? '✓' : '✕'}</span>
              <span className="t-mono" style={{ fontSize: 12, color: i < 5 ? '#fafafa' : '#5a5a5a' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample invocation */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <button onClick={() => setShowTrace(!showTrace)} className="row" style={{ width: '100%', padding: '14px 20px', background: 'transparent', border: 'none', borderBottom: showTrace ? '1px solid #2d2d2d' : 'none', cursor: 'pointer', alignItems: 'center' }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#ff6b35', flex: 1, textAlign: 'left' }}>SAMPLE INVOCATION TRACE</div>
          <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{showTrace ? '▼ HIDE' : '▶ EXPAND'}</span>
        </button>
        {showTrace && (
          <div style={{ padding: 20 }}>
            <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 6 }}>USER PROMPT</div>
            <div style={{ padding: 10, background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 4, fontSize: 13, color: '#cfcfcf', marginBottom: 12 }}>"Refactor src/auth/oauth.ts to use server actions."</div>
            <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 6 }}>REASONING TRACE · 4 STEPS</div>
            <div className="col gap-4" style={{ marginBottom: 12 }}>
              {[
                { t: 'tool', n: 'Glob', a: '**/auth/**/*.ts → 8 files' },
                { t: 'tool', n: 'Read', a: 'src/auth/oauth.ts (282 lines)' },
                { t: 'think', n: 'Reasoning', a: 'Identified 3 callsites that need server-action wrapping' },
                { t: 'tool', n: 'Edit', a: 'src/auth/oauth.ts (+18 −12)' },
              ].map((s, i) => (
                <div key={i} className="row gap-10" style={{ padding: '6px 10px', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 3, fontSize: 12 }}>
                  <span className="mono-caps" style={{ fontSize: 9, color: s.t === 'tool' ? '#3cffd0' : '#f5e642', minWidth: 56 }}>{s.t === 'tool' ? '⌘ ' + s.n.toUpperCase() : '◊ THINK'}</span>
                  <span className="t-mono" style={{ color: '#cfcfcf', flex: 1 }}>{s.a}</span>
                </div>
              ))}
            </div>
            <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 6 }}>OUTPUT · 1.4S · 3,420 TOK</div>
            <div style={{ padding: 10, background: 'rgba(60,255,208,0.04)', border: '1px solid #309875', borderRadius: 4, fontSize: 13, color: '#cfcfcf' }}>Refactored. 14 existing tests still pass; opened a draft PR.</div>
          </div>
        )}
      </div>

      <CodeBlock code={`---\nname: ${r.slug}\ndescription: ${r.tagline}\nmodel: claude-opus-4-7\ntemperature: 0.2\ntools: [Read, Write, Edit, Bash, Grep, Glob]\n---\n\n# ${r.name}\n\n## When to invoke\nDelegate when the parent agent needs ${r.tagline.toLowerCase()}\nand the codebase exceeds ~50k tokens.\n\n## Boundaries\n- Never modifies CI configs without explicit approval\n- Never runs destructive shell commands (rm -rf, drop table, etc.)`} lang="markdown" />
    </div>
  );
};

const PromptPlayground = ({ r }) => {
  const [diff, setDiff] = uS_p2('git add . && git commit -m "fix"');
  const [output, setOutput] = uS_p2(null);
  const [running, setRunning] = uS_p2(false);
  const run = () => { setRunning(true); setTimeout(() => { setOutput('### Summary\nRefactored the auth flow to use server actions.\n\n### Changes\n- src/auth/oauth.ts (+42 −18)\n- src/auth/session.ts (+12 −4)\n\n### Risk\nLow — covered by 14 existing tests.'); setRunning(false); }, 700); };
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid #2d2d2d' }}><div className="mono-caps" style={{ fontSize: 11, color: '#ff3cac' }}>PLAYGROUND · {r.name.toUpperCase()}</div></div>
      <div style={{ padding: 20 }}>
        <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>VARIABLES</div>
        <div className="row gap-8" style={{ marginBottom: 12, alignItems: 'center' }}>
          <span className="t-mono text-meta" style={{ fontSize: 12, minWidth: 80 }}>{`{{diff}}`}</span>
          <input className="input" value={diff} onChange={e => setDiff(e.target.value)} style={{ flex: 1 }} />
        </div>
        <div className="row gap-8" style={{ marginBottom: 16 }}>
          <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>{running ? '...' : '▶ Run'}</button>
          <span className="mono-caps text-meta" style={{ fontSize: 10 }}>~340 INPUT TOK · ~160 OUTPUT</span>
        </div>
        {output && <CodeBlock code={output} lang="markdown" />}
      </div>
    </div>
  );
};

const PluginBundle = ({ r }) => {
  const groups = [
    { kind: 'COMPONENTS', count: 28, color: '#3cffd0', items: ['Button','Card','Dialog','Dropdown','Form','Input','Select','Sheet','Table','Tabs','Toast','Tooltip','Avatar','Badge','Calendar','Checkbox','Combobox','Command','Hover Card','Menubar','Navigation','Popover','Progress','Radio','Resizable','Scroll Area','Separator','Skeleton'] },
    { kind: 'HOOKS', count: 8, color: '#f5e642', items: ['useToast','useMediaQuery','useDebounce','useLocalStorage','useClickOutside','useCopyToClipboard','useKey','useTheme'] },
    { kind: 'UTILS', count: 6, color: '#1e6efa', items: ['cn()','clsx()','tw-merge','formatDate','currency','slugify'] },
  ];
  const matrix = window.CLIENTS.slice(0, 5).map((c, i) => ({ ...c, status: i < 4 ? '✓' : '⚠' }));
  return (
    <div className="col gap-16">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#1e6efa' }}>BUNDLE · {groups.reduce((a, g) => a + g.count, 0)} RESOURCES</div>
          <div className="row gap-12">
            <span className="mono-caps text-meta" style={{ fontSize: 10 }}>BUNDLE WEIGHT · 184 KB</span>
            <span className="mono-caps text-meta" style={{ fontSize: 10 }}>· INSTALL TIME ~12S</span>
          </div>
        </div>
        <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>INSTALL MATRIX</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6, marginBottom: 16 }}>
          {matrix.map(c => (
            <div key={c.id} className="row gap-8" style={{ padding: '8px 10px', background: '#0a0a0a', border: `1px solid ${c.status === '✓' ? '#309875' : '#2d2d2d'}`, borderRadius: 4 }}>
              <span style={{ width: 16, height: 16, background: c.color, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 9 }}>{c.name[0]}</span>
              <span style={{ fontSize: 12, flex: 1 }}>{c.name}</span>
              <span style={{ color: c.status === '✓' ? '#3cffd0' : '#f5e642', fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>

      {groups.map(g => (
        <div key={g.kind} className="card">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="mono-caps" style={{ fontSize: 11, color: g.color }}>{g.kind} · {g.count}</div>
            <button className="btn btn-ghost btn-sm">Pick & choose →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6 }}>
            {g.items.map(x => (
              <div key={x} className="row gap-6" style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid #2d2d2d', borderRadius: 3, fontSize: 12 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: g.color }} />
                <span style={{ flex: 1, fontFamily: g.kind === 'UTILS' || g.kind === 'HOOKS' ? "'Space Mono', monospace" : 'inherit' }}>{x}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const HookViewer = ({ r }) => {
  const lifecycle = [
    { ev: 'pre-commit', active: true, desc: 'Before commit is finalised' },
    { ev: 'commit-msg', active: false, desc: 'Validates the commit message' },
    { ev: 'post-commit', active: true, desc: 'After commit is recorded' },
    { ev: 'pre-push', active: false, desc: 'Before push to remote' },
  ];
  return (
    <div className="col gap-16">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0' }}>LIFECYCLE</div>
          <span className="mono-caps text-meta" style={{ fontSize: 10 }}>FIRES ON: 2 OF 4 EVENTS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
          {lifecycle.map((l, i) => (
            <div key={l.ev} style={{ padding: '12px 10px', background: l.active ? 'rgba(60,255,208,0.06)' : '#0a0a0a', border: `1px solid ${l.active ? '#309875' : '#2d2d2d'}`, borderRight: i < 3 ? 'none' : `1px solid ${l.active ? '#309875' : '#2d2d2d'}`, position: 'relative' }}>
              <div className="row gap-6" style={{ marginBottom: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: l.active ? '#3cffd0' : '#2d2d2d' }} />
                <span className="mono-caps" style={{ fontSize: 10, color: l.active ? '#3cffd0' : '#5a5a5a' }}>{l.ev.toUpperCase()}</span>
              </div>
              <div className="text-meta" style={{ fontSize: 11, lineHeight: 1.4 }}>{l.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="mono-caps" style={{ fontSize: 11, color: '#3cffd0', marginBottom: 12 }}>TRIGGER CONDITIONS</div>
        <div className="row gap-32" style={{ flexWrap: 'wrap', marginBottom: 14 }}>
          <div>
            <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 6 }}>FILE GLOB</div>
            <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
              {['*.ts', '*.tsx', '!*.test.*'].map(g => <span key={g} className="t-mono" style={{ fontSize: 12, padding: '3px 8px', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 3, color: g.startsWith('!') ? '#ff3cac' : '#3cffd0' }}>{g}</span>)}
            </div>
          </div>
          <div>
            <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 6 }}>BRANCH</div>
            <span className="t-mono" style={{ fontSize: 12, padding: '3px 8px', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 3 }}>* (any)</span>
          </div>
          <div>
            <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 6 }}>EXIT BEHAVIOUR</div>
            <span className="status-pill" style={{ borderColor: '#ff3cac33', color: '#ff3cac' }}>BLOCK ON FAIL</span>
          </div>
        </div>
        <div className="hairline" style={{ paddingTop: 14 }}>
          <div className="row gap-32" style={{ flexWrap: 'wrap' }}>
            <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>LAST TRIGGERED</div><div style={{ fontSize: 13, fontWeight: 700 }}>14 min ago</div></div>
            <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>RUNS · 7D</div><div className="t-display" style={{ fontSize: 22, color: '#3cffd0' }}>184</div></div>
            <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>FAILURES · 7D</div><div className="t-display" style={{ fontSize: 22, color: '#f5e642' }}>3</div></div>
            <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>AVG RUNTIME</div><div className="t-display" style={{ fontSize: 22 }}>1.2s</div></div>
          </div>
        </div>
      </div>

      <CodeBlock code={`#!/usr/bin/env bash\n# .git/hooks/pre-commit · ${r.slug}\nset -e\n\nCHANGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\\.tsx?$" || true)\nif [ -z "$CHANGED" ]; then exit 0; fi\n\necho "→ Running typecheck on changed files..."\nbun tsc --noEmit\n\necho "→ Running tests on changed files..."\nbun vitest --run --reporter=dot --related $CHANGED\n\necho "✓ Hook passed in $SECONDS seconds"`} lang="bash" />
    </div>
  );
};

const CommandRunner = ({ r }) => (
  <div className="card" style={{ padding: 24 }}>
    <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>COMMAND PREVIEW</div>
    <div className="t-mono" style={{ fontSize: 18, color: '#f5e642', marginBottom: 16 }}>{r.name} <span style={{ color: '#5a5a5a' }}>[--target] [--branch]</span></div>
    <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>ARGS SCHEMA</div>
    <table className="tbl" style={{ marginBottom: 16 }}>
      <tbody>
        <tr><td className="t-mono">--target</td><td className="text-meta">production | preview | dev</td><td className="t-mono text-meta">required</td></tr>
        <tr><td className="t-mono">--branch</td><td className="text-meta">git branch to deploy</td><td className="t-mono text-meta">default: main</td></tr>
      </tbody>
    </table>
    <button className="btn btn-primary btn-sm">▶ Test in sandbox</button>
  </div>
);

const StarterPreview = ({ r }) => {
  const [tab, setTab] = uS_p2('demo');
  const tree = [
    { p: 'app/', dir: true },
    { p: '  layout.tsx', dir: false },
    { p: '  page.tsx', dir: false },
    { p: '  api/', dir: true },
    { p: '    auth/[...nextauth]/route.ts', dir: false },
    { p: '  (dashboard)/', dir: true },
    { p: '    layout.tsx', dir: false },
    { p: '    page.tsx', dir: false },
    { p: 'components/ui/', dir: true },
    { p: 'lib/db/schema.ts', dir: false },
    { p: 'package.json', dir: false },
    { p: 'tailwind.config.ts', dir: false },
  ];
  return (
    <div className="col gap-16">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="row" style={{ padding: '12px 16px', borderBottom: '1px solid #2d2d2d' }}>
          {['demo', 'tree', 'env'].map(x => (
            <button key={x} onClick={() => setTab(x)} className="mono-caps" style={{ padding: '6px 14px', background: tab === x ? 'rgba(255,107,53,0.08)' : 'transparent', border: 'none', borderRadius: 4, color: tab === x ? '#ff6b35' : '#949494', fontSize: 11, cursor: 'pointer' }}>
              {x === 'demo' ? '● LIVE DEMO' : x === 'tree' ? 'FILE TREE' : 'ENV VARS'}
            </button>
          ))}
          <span className="mono-caps text-meta" style={{ fontSize: 10, marginLeft: 'auto' }}>BUILD ~38S · BUNDLE 184 KB</span>
        </div>
        {tab === 'demo' && (
          <div style={{ height: 320, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderTop: '1px solid #2d2d2d' }}>
            <div style={{ position: 'absolute', inset: 14, border: '1px dashed #2d2d2d', borderRadius: 6 }} />
            <div className="col" style={{ alignItems: 'center', gap: 8 }}>
              <div className="mono-caps" style={{ fontSize: 10, color: '#ff6b35' }}>● starter-saas-kit.vercel.app</div>
              <div className="t-display" style={{ fontSize: 64, color: '#ff6b35', opacity: 0.5, lineHeight: 1 }}>{r.name.split(' ')[0].toUpperCase()}</div>
              <div className="text-meta" style={{ fontSize: 12 }}>Live, hot-reloaded — drag a file to fork.</div>
            </div>
          </div>
        )}
        {tab === 'tree' && (
          <div style={{ padding: 16, fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#cfcfcf', maxHeight: 340, overflow: 'auto' }}>
            {tree.map(f => (
              <div key={f.p} style={{ padding: '3px 0', color: f.dir ? '#3cffd0' : '#cfcfcf' }}>
                {f.dir ? '▸' : ' '} {f.p}
              </div>
            ))}
          </div>
        )}
        {tab === 'env' && (
          <div style={{ padding: 16, fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#cfcfcf' }}>
            <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>REQUIRED · 4 KEYS</div>
            {['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'STRIPE_SECRET_KEY'].map(k => (
              <div key={k} className="row gap-10" style={{ padding: '6px 8px', borderBottom: '1px solid #2d2d2d' }}>
                <span style={{ color: '#3cffd0' }}>{k}</span>
                <span style={{ marginLeft: 'auto', color: '#5a5a5a' }}>= ••••••••</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="mono-caps" style={{ fontSize: 11, color: '#ff6b35', marginBottom: 12 }}>FRAMEWORKS &amp; SERVICES</div>
        <div className="row gap-6" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
          {(r.stack || ['Next.js', 'TypeScript', 'Tailwind', 'Drizzle', 'Stripe', 'NextAuth']).map(s => <span key={s} className="stack-chip">{s}</span>)}
        </div>
        <div className="mono-caps" style={{ fontSize: 11, color: '#ff6b35', marginBottom: 10 }}>ONE-CLICK DEPLOY</div>
        <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
          {[
            { n: 'Vercel', glyph: '▲', color: '#fafafa' },
            { n: 'Netlify', glyph: '◇', color: '#3cffd0' },
            { n: 'Cloudflare', glyph: '☁', color: '#f5a623' },
            { n: 'Railway', glyph: '▱', color: '#ff3cac' },
          ].map(d => (
            <button key={d.n} className="row gap-8" style={{ padding: '8px 14px', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 4, color: '#fafafa', fontSize: 13, cursor: 'pointer' }}>
              <span style={{ color: d.color }}>{d.glyph}</span> Deploy to {d.n}
            </button>
          ))}
          <button className="btn btn-secondary btn-sm">Open in StackBlitz</button>
          <button className="btn btn-ghost btn-sm">View source →</button>
        </div>
      </div>

      <CodeBlock code={`# Clone the starter\nnpx degit ${r.author || 'community'}/${r.slug} my-app\ncd my-app\n\n# Install + first run\nbun install\ncp .env.example .env.local\nbun dev`} lang="bash" />
    </div>
  );
};

const WorkflowStepper = ({ r }) => {
  const steps = [
    { n: 'Validate idea', dur: '1d', resource: 'spec-saas-onboarding' },
    { n: 'Scaffold the app', dur: '2h', resource: 'starter-saas-kit' },
    { n: 'Wire auth', dur: '4h', resource: 'better-auth' },
    { n: 'Add billing', dur: '6h', resource: 'stripe-mcp' },
    { n: 'Build core feature', dur: '2d', resource: null },
    { n: 'Polish & ship', dur: '1d', resource: 'plugin-shadcn' },
  ];
  return (
    <div>
      <div className="row gap-16" style={{ marginBottom: 20 }}>
        <span className="status-pill"><span style={{ color: '#3cffd0' }}>●</span> 6 STEPS</span>
        <span className="status-pill">~7 DAYS TOTAL</span>
        <span className="status-pill">DIFFICULTY · INTERMEDIATE</span>
      </div>
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 1, background: '#2d2d2d' }} />
        {steps.map((s, i) => (
          <div key={i} style={{ position: 'relative', paddingBottom: 16 }}>
            <div style={{ position: 'absolute', left: -22, top: 6, width: 18, height: 18, background: '#131313', border: '1px solid #3cffd0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3cffd0', fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{i + 1}</div>
            <div className="card" style={{ padding: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: s.resource ? 6 : 0 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{s.n}</span>
                <span className="mono-caps text-meta" style={{ fontSize: 10 }}>{s.dur}</span>
              </div>
              {s.resource && <div className="text-meta" style={{ fontSize: 12 }}>USES → <span style={{ color: '#3cffd0' }}>{s.resource}</span></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShowcaseHero = ({ r }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ height: 380, background: '#ff3cac', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 32 }}>
      <div className="t-display" style={{ fontSize: 96, color: '#131313', lineHeight: 0.9 }}>{r.name.split(' ')[0].toLowerCase()}</div>
      <div style={{ position: 'absolute', top: 14, right: 14 }}><span className="status-pill" style={{ background: '#131313', borderColor: '#131313', color: '#fafafa' }}>● LIVE</span></div>
    </div>
    <div style={{ padding: 20 }}>
      <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>BUILT WITH</div>
      <div className="row gap-8" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        {(r.stack || []).map(s => <span key={s} className="stack-chip">{s}</span>)}
      </div>
      <button className="btn btn-secondary btn-sm">Visit live URL ↗</button>
    </div>
  </div>
);

const EvalLeaderboard = ({ r }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid #2d2d2d', justifyContent: 'space-between' }}>
      <div className="mono-caps" style={{ fontSize: 11, color: '#f5e642' }}>LEADERBOARD · UPDATED 2H AGO</div>
      <span className="mono-caps text-meta" style={{ fontSize: 10 }}>500 PROBLEMS · PASS@1</span>
    </div>
    <table className="tbl">
      <thead><tr><th>Rank</th><th>Model</th><th>Score</th><th>Cost / problem</th><th>Avg time</th></tr></thead>
      <tbody>
        {[
          { r: 1, m: 'Claude Opus 4.7', s: '72.4%', c: '$0.42', t: '38s' },
          { r: 2, m: 'GPT-5', s: '69.8%', c: '$0.51', t: '42s' },
          { r: 3, m: 'Gemini 3.1 Pro', s: '64.2%', c: '$0.18', t: '24s' },
          { r: 4, m: 'Claude Sonnet 4.6', s: '61.0%', c: '$0.12', t: '21s' },
          { r: 5, m: 'DeepSeek v4', s: '58.6%', c: '$0.04', t: '32s' },
          { r: 6, m: 'Qwen 3 Coder 32B', s: '54.2%', c: '$0.02', t: '18s' },
        ].map(x => (
          <tr key={x.r}>
            <td className="t-mono" style={{ color: x.r === 1 ? '#3cffd0' : '#cfcfcf' }}>#{x.r}</td>
            <td>{x.m}</td>
            <td className="t-mono tnum" style={{ fontWeight: 700 }}>{x.s}</td>
            <td className="t-mono tnum text-meta">{x.c}</td>
            <td className="t-mono tnum text-meta">{x.t}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SandboxBlock = ({ r }) => (
  <div className="card" style={{ padding: 24 }}>
    <div className="row gap-32" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
      <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>COLD START</div><div className="t-display" style={{ fontSize: 28, color: '#3cffd0' }}>180MS</div></div>
      <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>OS IMAGE</div><div style={{ fontSize: 14, fontWeight: 700 }}>Ubuntu 24.04 LTS</div></div>
      <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>CPU / RAM</div><div style={{ fontSize: 14, fontWeight: 700 }}>2 vCPU · 4 GB</div></div>
      <div><div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 4 }}>STARTING</div><div className="t-display" style={{ fontSize: 28, color: '#f5e642' }}>$0.0001/s</div></div>
    </div>
    <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>COLD START · LAST 7 DAYS</div>
    <div className="row gap-2" style={{ alignItems: 'flex-end', height: 60 }}>
      {[180, 165, 195, 172, 188, 175, 180].map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${v / 3}px`, background: '#3cffd0', opacity: 0.3 + (i / 14), borderRadius: '2px 2px 0 0' }} />
      ))}
    </div>
  </div>
);

const ToolBlock = ({ r }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ height: 320, background: '#0a0a0a', borderBottom: '1px solid #2d2d2d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="t-display" style={{ fontSize: 96, color: '#3cffd0', opacity: 0.3 }}>{r.name.toUpperCase()}</div>
    </div>
    <div style={{ padding: 20 }}>
      <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 12 }}>PRICING</div>
      <table className="tbl">
        <thead><tr><th>Tier</th><th>Price</th><th>Includes</th></tr></thead>
        <tbody>
          <tr><td>Hobby</td><td className="t-mono">Free</td><td className="text-meta">Slow models, ads</td></tr>
          <tr><td>Pro</td><td className="t-mono">$20 /mo</td><td className="text-meta">Fast requests, priority</td></tr>
          <tr><td>Business</td><td className="t-mono">$40 /seat</td><td className="text-meta">Privacy mode, SAML</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const AssetGrid = ({ r }) => (
  <div className="card" style={{ padding: 24 }}>
    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
      <div className="mono-caps text-meta" style={{ fontSize: 9 }}>PREVIEW · 480 ITEMS</div>
      <span className="status-pill">CC-BY 4.0</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
      {Array.from({ length: 32 }).map((_, i) => (
        <div key={i} style={{ aspectRatio: '1', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a5a5a', fontFamily: "'Space Mono', monospace", fontSize: 14 }}>★</div>
      ))}
    </div>
    <div className="row gap-8" style={{ marginTop: 16 }}>
      <button className="btn btn-secondary btn-sm">Download SVG</button>
      <button className="btn btn-secondary btn-sm">Download PNG</button>
      <button className="btn btn-ghost btn-sm">Figma file →</button>
    </div>
  </div>
);

const DocsPreview = ({ r }) => (
  <CodeBlock code={`# ${r.name}\n\n> Compact, agent-ready reference for ${r.tagline.toLowerCase()}.\n\n## Quick start\n\n\`\`\`bash\nnpx ${r.author || 'community'}/${r.slug}\n\`\`\`\n\n## API\n\n- \`useState(initial)\` → returns [state, setState]\n- \`useEffect(fn, deps)\` → runs after render\n- \`useMemo(fn, deps)\` → memoized value\n\n## Patterns\n\nUse the canonical hook order. Never call hooks inside conditionals.`} lang="markdown" />
);

const SpecBlock = ({ r }) => (
  <div className="card" style={{ padding: 24 }}>
    <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 12 }}>SPEC OUTLINE · 8 SECTIONS</div>
    <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.8, color: '#cfcfcf' }}>
      <li>Goals & non-goals</li>
      <li>Data model</li>
      <li>Server actions</li>
      <li>UI surfaces</li>
      <li>Webhook handling</li>
      <li>Error states</li>
      <li>Test plan</li>
      <li>Open questions</li>
    </ol>
    <div className="row gap-8" style={{ marginTop: 16 }}>
      <button className="btn btn-secondary btn-sm">Fork to my account</button>
      <button className="btn btn-ghost btn-sm">Open example project →</button>
    </div>
  </div>
);

const StackBlock = ({ r, navigate }) => {
  const items = [
    { glyph: 'TL', name: 'Cursor' },
    { glyph: 'MDL', name: 'Claude Opus 4.7' },
    { glyph: 'BE', name: 'Supabase' },
    { glyph: 'CMP', name: 'shadcn/ui' },
    { glyph: 'STR', name: 'T3 App' },
  ];
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 12 }}>5 RESOURCES IN THIS STACK</div>
      <div className="col gap-8">
        {items.map((x, i) => (
          <div key={i} className="row gap-12" style={{ padding: '10px 12px', background: 'rgba(60,255,208,0.03)', border: '1px solid #2d2d2d', borderRadius: 4, cursor: 'pointer' }}>
            <span className="mono-caps" style={{ fontSize: 9, color: '#3cffd0', minWidth: 32 }}>{x.glyph}</span>
            <span style={{ flex: 1, fontWeight: 500 }}>{x.name}</span>
            <span className="mono-caps text-meta" style={{ fontSize: 10 }}>VIEW →</span>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>↓ Install entire stack</button>
    </div>
  );
};

const BackendKitBlock = ({ r }) => (
  <div className="card" style={{ padding: 24 }}>
    <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 12 }}>SERVICES · 5</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
      {[
        { n: 'Database', d: 'Postgres' },
        { n: 'Auth', d: 'JWT + OAuth' },
        { n: 'Storage', d: 'S3-compatible' },
        { n: 'Payments', d: 'Stripe' },
        { n: 'Email', d: 'Resend' },
      ].map(x => (
        <div key={x.n} style={{ padding: 14, background: 'rgba(60,255,208,0.04)', border: '1px solid #309875', borderRadius: 6 }}>
          <div className="mono-caps" style={{ fontSize: 10, color: '#3cffd0', marginBottom: 4 }}>{x.n.toUpperCase()}</div>
          <div style={{ fontSize: 13 }}>{x.d}</div>
        </div>
      ))}
    </div>
  </div>
);

const ObservabilityBlock = ({ r }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: 20, borderBottom: '1px solid #2d2d2d' }}>
      <div className="mono-caps text-meta" style={{ fontSize: 9, marginBottom: 8 }}>INTEGRATIONS · 12</div>
      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
        {['OpenAI','Anthropic','Vercel AI','LangChain','LlamaIndex','Mistral','Cohere','Together'].map(x => <span key={x} className="stack-chip">{x}</span>)}
      </div>
    </div>
    <div style={{ height: 220, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a5a5a' }}>
      <div className="mono-caps" style={{ fontSize: 11 }}>● LIVE TRACES DASHBOARD PREVIEW</div>
    </div>
  </div>
);

const MarketplaceBlock = ({ r, navigate }) => (
  <div className="card" style={{ padding: 24 }}>
    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
      <div className="mono-caps text-meta" style={{ fontSize: 9 }}>FEATURED FROM THIS MARKETPLACE</div>
      <button className="btn btn-ghost btn-sm">View all 600+ →</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
      {window.RESOURCES.slice(0, 6).map(x => (
        <div key={x.slug} className="card lift" style={{ padding: 12, cursor: 'pointer' }} onClick={() => navigate({ name: 'resource', slug: x.slug, type: x.type })}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{x.name}</div>
          <div className="text-meta" style={{ fontSize: 11 }}>★ {x.score} · {(x.installs7d / 1000).toFixed(1)}K /wk</div>
        </div>
      ))}
    </div>
  </div>
);

const ScriptBlock = ({ r }) => (
  <CodeBlock code={`#!/usr/bin/env node\n// ${r.name} — ${r.tagline}\n\nimport { agent } from "@agentkit/core";\n\nawait agent.run({\n  task: "${r.tagline}",\n  model: "claude-opus-4-7",\n  tools: ["read", "write", "bash"],\n});`} lang="javascript" />
);

Object.assign(window, { ResourceDetailPage });

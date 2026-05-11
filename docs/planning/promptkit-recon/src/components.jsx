// PROMPTKIT — Shared atoms & molecules
// Loaded after React. Exposes globals.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// =========================================================
// Icons (Lucide-style, all stroke 1.5px)
// =========================================================
const I = ({ d, size = 16, fill = 'none', stroke = 'currentColor', sw = 1.6, vb = '0 0 24 24', extra }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {extra || <path d={d} />}
  </svg>
);
const Icon = {
  search: (p) => <I {...p} d="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z" />,
  close:  (p) => <I {...p} d="M18 6L6 18M6 6l12 12" />,
  chev:   (p) => <I {...p} d="M6 9l6 6 6-6" />,
  chevR:  (p) => <I {...p} d="M9 18l6-6-6-6" />,
  chevL:  (p) => <I {...p} d="M15 18l-6-6 6-6" />,
  arrowR: (p) => <I {...p} d="M5 12h14M13 5l7 7-7 7" />,
  arrowU: (p) => <I {...p} d="M12 19V5M5 12l7-7 7 7" />,
  arrowD: (p) => <I {...p} d="M12 5v14M19 12l-7 7-7-7" />,
  bookmark:(p)=> <I {...p} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />,
  star:   (p) => <I {...p} d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 18l-6.2 3.1L7 14.2 2 9.3l6.9-1z" />,
  share:  (p) => <I {...p} d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" />,
  check:  (p) => <I {...p} d="M20 6L9 17l-5-5" />,
  copy:   (p) => <I {...p} d="M9 9h11v11H9zM5 5h11v3H9a2 2 0 00-2 2v9H5z" />,
  plus:   (p) => <I {...p} d="M12 5v14M5 12h14" />,
  minus:  (p) => <I {...p} d="M5 12h14" />,
  filter: (p) => <I {...p} d="M3 4h18l-7 9v6l-4-2v-4z" />,
  bell:   (p) => <I {...p} d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M14 21a2 2 0 01-4 0" />,
  user:   (p) => <I {...p} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />,
  home:   (p) => <I {...p} d="M3 12l9-9 9 9M5 10v10h14V10" />,
  menu:   (p) => <I {...p} d="M3 6h18M3 12h18M3 18h18" />,
  ext:    (p) => <I {...p} d="M14 4h6v6M10 14L20 4M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6" />,
  download:(p)=> <I {...p} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  play:   (p) => <I {...p} d="M5 3l14 9-14 9z" />,
  cmd:    (p) => <I {...p} d="M18 3a3 3 0 010 6h-3V6a3 3 0 013-3zM6 21a3 3 0 010-6h3v3a3 3 0 01-3 3zM6 3a3 3 0 010 6h3V6a3 3 0 00-3-3zM18 21a3 3 0 010-6h-3v3a3 3 0 003 3z M9 9h6v6H9z" />,
  zap:    (p) => <I {...p} d="M13 2L3 14h7l-1 8 10-12h-7z" />,
  brain:  (p) => <I {...p} d="M9.5 2A2.5 2.5 0 007 4.5V20a2 2 0 002 2h6a2 2 0 002-2V4.5A2.5 2.5 0 0014.5 2h-5z M7 8H5a2 2 0 00-2 2v4a2 2 0 002 2h2 M17 8h2a2 2 0 012 2v4a2 2 0 01-2 2h-2" />,
  eye:    (p) => <I {...p} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M12 15a3 3 0 100-6 3 3 0 000 6z" />,
  wrench: (p) => <I {...p} d="M14.7 6.3a4 4 0 015.6 5.6l-9 9-4.6.6.6-4.6 9-9z" />,
  package:(p) => <I {...p} d="M21 16V8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v9" />,
  lock:   (p) => <I {...p} d="M5 11h14v10H5zM8 11V7a4 4 0 018 0v4" />,
  alert:  (p) => <I {...p} d="M12 9v4M12 17h.01M10.3 3.86l-8.55 14.83A2 2 0 003.43 22h17.14a2 2 0 001.7-3.31L13.7 3.86a2 2 0 00-3.4 0z" />,
  flame:  (p) => <I {...p} d="M8.5 14.5A2.5 2.5 0 0011 17c1.4 0 2.5-1 2.5-2.5 0-2-2-2.5-2.5-5 0 0 .5 1-1 2.5-1.5 1.5-1.5 2.5-1.5 2.5z M14 5a5.5 5.5 0 015.5 5.5C19.5 16 14 19 12 22c-2-3-7.5-6-7.5-11.5A5.5 5.5 0 0110 5c1 0 2 .5 2 .5S13 5 14 5z" />,
  sliders:(p) => <I {...p} d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4" />,
  rss:    (p) => <I {...p} d="M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M5 19a1 1 0 100-2 1 1 0 000 2z" />,
  github: (p) => <I {...p} d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5a3 3 0 00-.9-2.1c3-.3 6.1-1.5 6.1-6.5A5 5 0 0019.9 6 4.6 4.6 0 0019.7 2S18.5 1.6 16 3.4a13.4 13.4 0 00-7 0C6.5 1.6 5.3 2 5.3 2A4.6 4.6 0 005.1 6 5 5 0 003.7 9.4c0 4.9 3 6.1 6 6.5a3 3 0 00-.9 2.1V22" />,
  rocket: (p) => <I {...p} d="M5 19c-3 1-3 1-3 1l1-3c4-9 9-9 9-9s0 5-9 9zM12 15l-3-3M21 3s-2 .5-3.5 2-2 4-2 4-1 .5-1 2 2 1 3 0 4-2 4-2 2.5-.5 4-2 2-3.5 2-3.5z" />,
  history:(p) => <I {...p} d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2" />,
  link:   (p) => <I {...p} d="M10 13a5 5 0 007 0l4-4a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-4 4a5 5 0 007 7l1-1" />,
  trending:(p) => <I {...p} d="M22 6L13 15l-4-4-7 7M16 6h6v6" />,
  coins:  (p) => <I {...p} d="M12 22c5 0 9-2 9-5V7c0-3-4-5-9-5S3 4 3 7v10c0 3 4 5 9 5z M21 7c0 3-4 5-9 5S3 10 3 7 M21 12c0 3-4 5-9 5s-9-2-9-5" />,
  layers: (p) => <I {...p} d="M12 2l10 6-10 6L2 8z M2 17l10 6 10-6 M2 12l10 6 10-6" />,
  compare:(p) => <I {...p} d="M9 3H4a1 1 0 00-1 1v16a1 1 0 001 1h5M15 3h5a1 1 0 011 1v16a1 1 0 01-1 1h-5M9 3v18M15 3v18" />,
  trash:  (p) => <I {...p} d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />,
  edit:   (p) => <I {...p} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z" />,
  refresh:(p) => <I {...p} d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5" />,
};

// =========================================================
// TYPE BADGE
// =========================================================
const TypeBadge = ({ type, size = 'sm' }) => {
  const t = window.RESOURCE_TYPES.find(x => x.id === type) || { glyph: '?', label: type, tint: '#3cffd0' };
  const fontSize = size === 'lg' ? 11 : 10;
  return (
    <span className="type-badge" style={{
      borderColor: t.tint + '55',
      background: t.tint + '12',
      color: t.tint,
      fontSize,
    }}>{t.glyph} · {t.label}</span>
  );
};

// =========================================================
// CLIENT COMPATIBILITY ICONS
// =========================================================
const ClientRow = ({ ids = [], max = 5, size = 22 }) => {
  const all = window.CLIENTS;
  const items = ids.map(id => all.find(c => c.id === id)).filter(Boolean);
  const shown = items.slice(0, max);
  const more = items.length - shown.length;
  return (
    <div className="row gap-4" style={{ alignItems: 'center' }}>
      {shown.map(c => (
        <span key={c.id} className="compat-icon" title={c.name} style={{ width: size, height: size, fontSize: 9, fontFamily: "'Space Mono', monospace" }}>
          {c.mark}
        </span>
      ))}
      {more > 0 && <span className="text-meta" style={{ fontSize: 11, fontFamily: "'Space Mono', monospace" }}>+{more}</span>}
    </div>
  );
};

// =========================================================
// STAT
// =========================================================
const Stat = ({ label, value, delta, mono = true, hint }) => (
  <div className="col gap-4">
    <div className="mono-caps text-meta" style={{ fontSize: 10, letterSpacing: 1.4 }}>{label}</div>
    <div className="row gap-8" style={{ alignItems: 'baseline' }}>
      <div style={{ fontFamily: mono ? "'Space Mono', monospace" : "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#fafafa' }} className="tnum">{value}</div>
      {delta != null && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: delta < 0 ? '#3cffd0' : delta > 0 ? '#ff6b35' : '#949494' }}>{delta < 0 ? '▼' : delta > 0 ? '▲' : '–'} {Math.abs(delta)}%</span>}
    </div>
    {hint && <div className="text-meta" style={{ fontSize: 11 }}>{hint}</div>}
  </div>
);

// =========================================================
// SPARKLINE
// =========================================================
const Sparkline = ({ data = [], width = 80, height = 24, color = '#3cffd0', stroke = 1.5 }) => {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => `${i * step},${height - ((d - min) / range) * height}`).join(' ');
  return (
    <svg className="spark" width={width} height={height}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

// =========================================================
// PROVIDER LOGO (placeholder square)
// =========================================================
const ProviderMark = ({ provider, color = '#fafafa', size = 28 }) => {
  const initials = (provider || 'X').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span style={{
      width: size, height: size, borderRadius: 4,
      background: color, color: '#000',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Space Mono', monospace", fontSize: size > 24 ? 11 : 9, fontWeight: 700, letterSpacing: 0.5,
    }}>{initials}</span>
  );
};

// =========================================================
// RESOURCE CARD (generic, with variants)
// =========================================================
const ResourceCard = ({ r, onOpen, onSave, saved, size = 'md', show = ['compat','stack'], variant }) => {
  const v = variant || r.variant || 'dark';
  const fills = {
    dark:   { bg: '#131313', border: '#2d2d2d', kick: '#3cffd0', head: '#fafafa', meta: '#949494', headHover: '#3860be' },
    mint:   { bg: '#3cffd0', border: 'transparent', kick: '#309875', head: '#000', meta: 'rgba(0,0,0,0.55)', headHover: '#3860be' },
    uv:     { bg: '#5200ff', border: 'transparent', kick: 'rgba(255,255,255,0.6)', head: '#fff', meta: 'rgba(255,255,255,0.65)', headHover: '#3cffd0' },
    yellow: { bg: '#f5e642', border: 'transparent', kick: '#309875', head: '#000', meta: 'rgba(0,0,0,0.55)', headHover: '#3860be' },
    pink:   { bg: '#ff3cac', border: 'transparent', kick: 'rgba(255,255,255,0.7)', head: '#fff', meta: 'rgba(255,255,255,0.7)', headHover: '#131313' },
    orange: { bg: '#ff6b35', border: 'transparent', kick: 'rgba(255,255,255,0.7)', head: '#fff', meta: 'rgba(255,255,255,0.7)', headHover: '#131313' },
    blue:   { bg: '#1e6efa', border: 'transparent', kick: 'rgba(255,255,255,0.7)', head: '#fff', meta: 'rgba(255,255,255,0.7)', headHover: '#3cffd0' },
  }[v];
  const [hover, setHover] = useState(false);
  const headSize = size === 'lg' ? 26 : size === 'sm' ? 16 : 19;

  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onOpen && onOpen(r)}
      style={{ background: fills.bg, border: `1px solid ${fills.border}`, borderRadius: 20, padding: size === 'lg' ? 28 : 20, cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'border-color 150ms ease' }}
    >
      <div className="row gap-8" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="row gap-8" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mono-caps" style={{ fontSize: 10, color: fills.kick }}>{(window.RESOURCE_TYPES.find(t => t.id === r.type) || {}).glyph}</span>
          <span className="mono-caps" style={{ fontSize: 10, color: fills.kick }}>· {r.author}</span>
          {r.rank === 1 && <span className="pill pill-mint" style={{ background: 'rgba(0,0,0,0.15)', borderColor: 'rgba(0,0,0,0.3)', color: fills.kick }}>★ #1</span>}
        </div>
        {onSave && (
          <button onClick={(e) => { e.stopPropagation(); onSave(r); }} aria-label="Save" style={{ background: 'transparent', border: 'none', color: saved ? fills.kick : fills.meta, padding: 0 }}>
            <Icon.bookmark fill={saved ? 'currentColor' : 'none'} size={16} />
          </button>
        )}
      </div>

      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: headSize, fontWeight: 700, lineHeight: 1.1,
        color: hover ? fills.headHover : fills.head, transition: 'color 150ms ease',
        marginBottom: 8, letterSpacing: '-0.01em',
      }}>{r.name}</div>

      {r.tagline && (
        <div style={{ color: fills.meta, fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>{r.tagline}</div>
      )}

      {/* Stats — three cleanly separated lines */}
      <div className="col gap-6" style={{ marginBottom: 12 }}>
        {r.score > 0 && (
          <div className="row gap-6" style={{ alignItems: 'center' }}>
            <Icon.star size={11} fill={fills.head} stroke={fills.head} />
            <span className="t-mono tnum" style={{ fontSize: 11, color: fills.head, fontWeight: 700 }}>{r.score}</span>
            <span className="t-mono tnum" style={{ fontSize: 11, color: fills.meta }}>({r.reviews || Math.floor((r.installs7d || 100) / 12)})</span>
          </div>
        )}
        <div className="row gap-12" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          {r.installs7d > 0 && (
            <span className="row gap-4 t-mono tnum" style={{ fontSize: 11, color: fills.meta, alignItems: 'center' }}>
              <Icon.download size={10} stroke={fills.meta} sw={1.8} />{(r.installs7d / 1000).toFixed(1)}k/wk
            </span>
          )}
          {r.updated && (
            <span className="row gap-4 t-mono tnum" style={{ fontSize: 11, color: fills.meta, alignItems: 'center' }}>
              <Icon.zap size={10} stroke={fills.meta} sw={1.8} />upd {r.updated}
            </span>
          )}
        </div>
      </div>

      {/* Compat + stack */}
      {show.includes('compat') && r.clients?.length > 0 && (
        <div className="row" style={{ gap: 4, marginBottom: 8 }}>
          {r.clients.slice(0, 5).map(cid => {
            const c = window.CLIENTS.find(x => x.id === cid);
            return c ? <span key={cid} className="compat-icon" title={c.name} style={{ background: v === 'dark' ? '#2d2d2d' : 'rgba(0,0,0,0.15)', color: fills.head, width: 20, height: 20, fontSize: 9 }}>{c.mark}</span> : null;
          })}
          {r.clients.length > 5 && <span className="mono-caps" style={{ fontSize: 10, color: fills.meta, marginLeft: 4 }}>+{r.clients.length - 5}</span>}
        </div>
      )}

      {show.includes('stack') && r.stack?.length > 0 && (
        <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
          {r.stack.slice(0, 3).map(s => (
            <span key={s} style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', padding: '2px 7px', borderRadius: 40, background: v === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.12)', color: fills.head }}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
};

// =========================================================
// MODEL CARD (cost-first variant)
// =========================================================
const ModelCard = ({ m, onOpen }) => {
  const [hover, setHover] = useState(false);
  const blended = (m.priceIn * 3 + m.priceOut) / 4;
  return (
    <div onClick={() => onOpen && onOpen(m)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: '#131313', border: '1px solid #2d2d2d', borderRadius: 20, padding: 20, cursor: 'pointer', transition: 'border-color 150ms' }}>
      <div className="row gap-12" style={{ marginBottom: 14, alignItems: 'center' }}>
        <ProviderMark provider={m.provider} color={m.providerColor} size={32} />
        <div className="col" style={{ flex: 1, minWidth: 0 }}>
          <div className="mono-caps text-meta" style={{ fontSize: 10 }}>{m.provider}</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: hover ? '#3860be' : '#fafafa', transition: 'color 150ms', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
        </div>
      </div>
      <div className="col gap-4" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #2d2d2d' }}>
        <div className="row gap-12" style={{ alignItems: 'baseline' }}>
          <span className="t-mono tnum" style={{ fontSize: 18, fontWeight: 700, color: '#3cffd0' }}>${blended.toFixed(2)}</span>
          <span className="mono-caps text-meta" style={{ fontSize: 9 }}>/MTOK BLENDED</span>
        </div>
        <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
          <span className="t-mono tnum text-meta" style={{ fontSize: 11 }}>#{m.intelligence} intelligence</span>
          <span className="t-mono tnum text-meta" style={{ fontSize: 11 }}>· {m.ctxAdv ? (m.ctxAdv / 1000).toFixed(0) + 'k' : '—'} ctx</span>
          <span className="t-mono tnum text-meta" style={{ fontSize: 11 }}>· {m.speed} tok/s</span>
        </div>
      </div>
      <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
        {m.tags.slice(0, 3).map(t => <span key={t} className="pill" style={{ fontSize: 9, padding: '2px 7px' }}>{t}</span>)}
        {m.delta < 0 && <span className="pill pill-mint" style={{ fontSize: 9, padding: '2px 7px' }}>▼ {Math.abs(m.delta)}%</span>}
      </div>
    </div>
  );
};

// =========================================================
// DEAL CARD
// =========================================================
const DealCard = ({ d, locked, onClaim, onUpgrade }) => {
  const isLocked = locked || (d.tier === 'pro' && !window.__PK.user.pro);
  return (
    <div style={{ position: 'relative', background: '#131313', border: '1px solid #2d2d2d', borderRadius: 20, padding: 24, overflow: 'hidden', minHeight: 180 }}>
      <div className="row gap-12" style={{ marginBottom: 16, alignItems: 'flex-start' }}>
        <ProviderMark provider={d.provider} color={d.providerColor} size={40} />
        <div className="col gap-4 flex-1">
          <div className="mono-caps text-meta" style={{ fontSize: 10 }}>{d.category}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>{d.name}</div>
        </div>
      </div>
      <div className="t-display" style={{ fontSize: 36, color: '#3cffd0', marginBottom: 8 }}>{d.value}</div>
      <div className="text-meta" style={{ fontSize: 13, marginBottom: 16 }}>{d.summary}</div>
      <div className="row gap-12" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="pill" style={{ borderColor: d.tier === 'pro' ? '#5200ff' : d.tier === 'member' ? '#3cffd0' : '#2d2d2d', color: d.tier === 'pro' ? '#b69dff' : d.tier === 'member' ? '#3cffd0' : '#949494' }}>{d.tier}</span>
        {!isLocked && <button className="btn btn-primary btn-sm" onClick={() => onClaim && onClaim(d)}>Claim ▸</button>}
      </div>
      {isLocked && (
        <div className="lock-blur" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', backdropFilter: 'blur(7px)', background: 'rgba(19,19,19,0.7)' }}>
          <Icon.lock size={20} stroke="#5200ff" />
          <div className="mono-caps" style={{ fontSize: 11, color: '#b69dff', marginTop: 8 }}>Pro Deal</div>
          <div style={{ fontSize: 13, color: '#fafafa', marginTop: 8, marginBottom: 14 }}>This single deal pays for Pro 1500x over.</div>
          <button className="btn btn-uv btn-sm" onClick={() => onUpgrade && onUpgrade(d)}>Upgrade — $99/yr</button>
        </div>
      )}
    </div>
  );
};

// =========================================================
// NEWS CARD
// =========================================================
const NewsCard = ({ n, onOpen, large }) => {
  const v = n.variant || 'dark';
  const fills = {
    dark: { bg: '#131313', border: '#2d2d2d', head: '#fafafa', meta: '#949494', kick: '#3cffd0' },
    mint: { bg: '#3cffd0', border: 'transparent', head: '#000', meta: 'rgba(0,0,0,0.55)', kick: '#309875' },
    uv:   { bg: '#5200ff', border: 'transparent', head: '#fff', meta: 'rgba(255,255,255,0.65)', kick: 'rgba(255,255,255,0.6)' },
    yellow:{ bg: '#f5e642', border: 'transparent', head: '#000', meta: 'rgba(0,0,0,0.55)', kick: '#309875' },
    pink: { bg: '#ff3cac', border: 'transparent', head: '#fff', meta: 'rgba(255,255,255,0.7)', kick: 'rgba(255,255,255,0.7)' },
  }[v];
  const [hover, setHover] = useState(false);
  return (
    <div onClick={() => onOpen && onOpen(n)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: fills.bg, border: `1px solid ${fills.border}`, borderRadius: 20, padding: large ? 28 : 20, cursor: 'pointer' }}>
      <div className="row gap-8" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
        <span className="mono-caps" style={{ fontSize: 10, color: fills.kick }}>{n.kind === 'breaking' ? '🔥 BREAKING' : n.kind?.toUpperCase()}</span>
        <span className="mono-caps" style={{ fontSize: 10, color: fills.meta }}>· {n.source}</span>
        {n.auto && <span className="mono-caps" style={{ fontSize: 9, color: fills.meta, padding: '1px 6px', border: `1px solid ${fills.meta}33`, borderRadius: 2 }}>🤖 AUTO</span>}
        <span className="mono-caps" style={{ fontSize: 10, color: fills.meta }}>· {n.time}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: large ? 26 : 18, lineHeight: 1.15, color: hover ? '#3860be' : fills.head, transition: 'color 150ms', marginBottom: 8 }}>{n.headline}</div>
      {n.summary && <div style={{ fontSize: 14, color: fills.meta, lineHeight: 1.5 }}>{n.summary}</div>}
    </div>
  );
};

// =========================================================
// SECTION HEADER
// =========================================================
const SectionH = ({ kicker, title, action, onAction, color }) => (
  <div className="section-h">
    <div className="col gap-4">
      {kicker && <div className="mono-caps" style={{ fontSize: 10, color: color || '#3cffd0' }}>{kicker}</div>}
      {title && <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em' }}>{title}</div>}
    </div>
    {action && <span className="rhs" onClick={onAction}>{action} →</span>}
  </div>
);

// =========================================================
// SKELETON CARD
// =========================================================
const SkeletonCard = ({ h = 200 }) => (
  <div className="card" style={{ height: h }}>
    <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 12 }} />
    <div className="skeleton" style={{ height: 24, width: '85%', marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 24 }} />
    <div className="row gap-6">
      <div className="skeleton" style={{ height: 18, width: 18, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 18, width: 18, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 18, width: 18, borderRadius: 4 }} />
    </div>
  </div>
);

// =========================================================
// EMPTY STATE
// =========================================================
const EmptyState = ({ glyph = '∅', title, body, action, onAction }) => (
  <div className="col gap-16" style={{ alignItems: 'center', padding: 64, textAlign: 'center' }}>
    <div className="t-display" style={{ fontSize: 80, color: '#5200ff' }}>{glyph}</div>
    <div style={{ fontWeight: 700, fontSize: 20 }}>{title}</div>
    {body && <div className="text-meta" style={{ fontSize: 14, maxWidth: 380 }}>{body}</div>}
    {action && <button className="btn btn-primary" onClick={onAction}>{action}</button>}
  </div>
);

// =========================================================
// CODE BLOCK with copy
// =========================================================
const CodeBlock = ({ code, lang, big }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={{ position: 'relative', background: '#0a0a0a', border: '1px solid #2d2d2d', borderRadius: 4, padding: big ? '20px 24px' : '12px 16px' }}>
      <pre style={{ fontFamily: "'Space Mono', monospace", fontSize: big ? 15 : 13, color: '#e9e9e9', overflowX: 'auto', whiteSpace: 'pre', margin: 0 }}>{code}</pre>
      <button onClick={copy} aria-label="Copy" style={{ position: 'absolute', top: 8, right: 8, background: copied ? '#3cffd0' : '#2d2d2d', color: copied ? '#000' : '#fafafa', border: 'none', borderRadius: 2, padding: '5px 10px', fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', cursor: 'pointer' }}>{copied ? '✓ Copied' : 'Copy'}</button>
    </div>
  );
};

// =========================================================
// INSTALL BUTTON (signature)
// =========================================================
const InstallButton = ({ resource, primary = 'cursor', big }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState('idle'); // idle, loading, success, error
  const c = window.CLIENTS.find(x => x.id === primary) || window.CLIENTS[0];

  const cmd = `npx vibehub add ${resource?.slug || 'resource'}`;
  const run = () => {
    setState('loading');
    setTimeout(() => setState('success'), 600);
    setTimeout(() => setState('idle'), 3000);
  };
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ background: '#131313', border: state === 'success' ? '1px solid #3cffd0' : '1px solid #309875', borderRadius: 24, overflow: 'hidden' }}>
        <div className="row" style={{ alignItems: 'stretch' }}>
          <button onClick={run} style={{ flex: 1, background: '#3cffd0', color: '#000', border: 'none', padding: big ? '20px 28px' : '14px 22px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'background 150ms' }}>
            <span className="compat-icon" style={{ background: '#000', color: '#3cffd0', width: 28, height: 28, fontSize: 11 }}>{c.mark}</span>
            <div className="col gap-4" style={{ flex: 1 }}>
              <div className="mono-caps" style={{ fontSize: 10, color: 'rgba(0,0,0,0.6)' }}>One-click install</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: big ? 16 : 13, fontWeight: 700, color: '#000' }}>
                {state === 'idle' && `Install for ${c.name}`}
                {state === 'loading' && `Installing in ${c.name}…`}
                {state === 'success' && `✓ Installed in ${c.name}`}
              </div>
            </div>
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Install options" style={{ background: '#3cffd0', color: '#000', border: 'none', borderLeft: '1px solid rgba(0,0,0,0.15)', padding: big ? '0 22px' : '0 16px', cursor: 'pointer' }}>
            <Icon.chev size={16} />
          </button>
        </div>
        {!big && <div style={{ background: '#0a0a0a', padding: '10px 18px', borderTop: '1px solid #309875' }}>
          <code style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#3cffd0' }}>{cmd}</code>
        </div>}
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 320, background: '#131313', border: '1px solid #2d2d2d', borderRadius: 8, padding: 6, zIndex: 50, boxShadow: '0 6px 20px rgba(0,0,0,0.5)' }}>
          {window.CLIENTS.slice(0, 4).map((c2, i) => (
            <button key={c2.id} className="row gap-10" style={{ width: '100%', textAlign: 'left', padding: 10, borderRadius: 4, background: 'transparent', border: 'none', color: '#fafafa', cursor: 'pointer' }} onClick={() => setOpen(false)} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <span className="compat-icon" style={{ width: 22, height: 22, fontSize: 9 }}>{c2.mark}</span>
              <div className="col" style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}>{i === 0 && '★ '}Install for {c2.name}</div>
                <div className="text-meta" style={{ fontSize: 11 }}>{i === 0 ? 'cursor:// deeplink' : i === 1 ? 'CLI command' : 'config file'}</div>
              </div>
            </button>
          ))}
          <div className="hairline" style={{ marginTop: 6, paddingTop: 6 }}>
            <button className="row gap-10" style={{ width: '100%', textAlign: 'left', padding: 10, background: 'transparent', border: 'none', color: '#fafafa', cursor: 'pointer', fontSize: 13 }}><Icon.copy size={14} /> Copy JSON snippet</button>
            <button className="row gap-10" style={{ width: '100%', textAlign: 'left', padding: 10, background: 'transparent', border: 'none', color: '#3cffd0', cursor: 'pointer', fontSize: 13 }}><Icon.arrowR size={14} /> View all install options</button>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================
// MODAL & DRAWER PRIMITIVES
// =========================================================
const Modal = ({ children, onClose, width = 640, padding = 32 }) => (
  <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, animation: 'fadeIn 120ms ease' }}>
    <div onClick={(e) => e.stopPropagation()} style={{ background: '#131313', border: '1px solid #2d2d2d', borderRadius: 20, width: '92%', maxWidth: width, maxHeight: '90vh', overflow: 'auto', animation: 'scaleIn 150ms ease' }}>
      <div style={{ padding }}>{children}</div>
    </div>
  </div>
);

const Drawer = ({ children, onClose, width = 480, side = 'right' }) => (
  <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.6)', zIndex: 200 }}>
    <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, [side]: 0, bottom: 0, width: '92%', maxWidth: width, background: '#131313', borderLeft: '1px solid #2d2d2d', overflow: 'auto', animation: 'slideIn 200ms ease' }}>
      {children}
    </div>
  </div>
);

const Toast = ({ msg, kind = 'info' }) => {
  const tones = { info: { bg: '#5200ff', fg: '#fff' }, success: { bg: '#3cffd0', fg: '#000' }, error: { bg: '#ff3cac', fg: '#fff' }, warning: { bg: '#f5e642', fg: '#000' } }[kind];
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, background: tones.bg, color: tones.fg, padding: '12px 18px', borderRadius: 24, zIndex: 300, fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', animation: 'slideIn 180ms ease', boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>
      {msg}
    </div>
  );
};

// =========================================================
// Expose
// =========================================================
Object.assign(window, {
  Icon, I, TypeBadge, ClientRow, Stat, Sparkline, ProviderMark,
  ResourceCard, ModelCard, DealCard, NewsCard,
  SectionH, SkeletonCard, EmptyState, CodeBlock, InstallButton,
  Modal, Drawer, Toast,
});

// Main screens for the Armfield Product Explorer
const { useState, useMemo, useEffect, useRef } = React;

// ---------- Shared bits ----------
const Chip = ({ children, tone = 'neutral', onClick, active }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px',
    borderRadius: 999, fontSize: 11, lineHeight: 1.4, letterSpacing: '0.01em',
    fontFamily: 'var(--sans)', cursor: onClick ? 'pointer' : 'default',
    transition: 'all 160ms ease', userSelect: 'none',
  };
  const tones = {
    neutral: { color: 'var(--ink-dim)', background: 'var(--surface-2)', border: '1px solid var(--hairline)' },
    accent:  { color: 'var(--accent)', background: 'var(--accent-wash)', border: '1px solid var(--accent-border)' },
    teach:   { color: 'oklch(42% 0.09 155)', background: 'oklch(96% 0.03 155)', border: '1px solid oklch(90% 0.04 155)' },
    research:{ color: 'oklch(42% 0.11 280)', background: 'oklch(96% 0.03 280)', border: '1px solid oklch(90% 0.04 280)' },
    code:    { color: 'var(--ink)', background: 'var(--surface-2)', border: '1px solid var(--hairline)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 0 },
  };
  const activeBoost = active ? { background: 'var(--ink)', color: 'var(--bg)', borderColor: 'var(--ink)' } : null;
  return (
    <span style={{ ...base, ...tones[tone], ...activeBoost }} onClick={onClick}>
      {children}
    </span>
  );
};

const Crumb = ({ items, onNav }) => (
  <nav style={{
    display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
    color: 'var(--ink-dim)', fontFamily: 'var(--sans)', flexWrap: 'wrap',
  }}>
    {items.map((it, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span style={{ color: 'var(--hairline-strong)' }}>/</span>}
        {it.onClick ? (
          <button onClick={it.onClick} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            color: 'var(--ink-dim)', fontSize: 13, fontFamily: 'inherit',
          }} onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
             onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-dim)'}>
            {it.label}
          </button>
        ) : (
          <span style={{ color: 'var(--ink)' }}>{it.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

// ---------- Landing ----------
const Landing = ({ onPickMajor, data, query, setQuery, filter, setFilter, onJumpProduct }) => {
  // Global search results (when user types on landing)
  const hits = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return data.products.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, data.products]);

  return (
    <div className="fade-in" style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 48px 96px' }}>
      <div style={{ textAlign: 'left', marginBottom: 56 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em',
          color: 'var(--ink-dim)', marginBottom: 18,
        }}>
          ARMFIELD · TEACHING &amp; RESEARCH EQUIPMENT CATALOGUE
        </div>
        <h1 style={{
          fontFamily: 'var(--display)', fontWeight: 500, fontSize: 56,
          lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 16px',
          color: 'var(--ink)', maxWidth: 820,
        }}>
          Find the right lab equipment for your discipline.
        </h1>
        <p style={{
          fontSize: 18, lineHeight: 1.5, color: 'var(--ink-mid)',
          fontFamily: 'var(--sans)', margin: 0, maxWidth: 640,
        }}>
          Select your field to drill into relevant product categories and specific teaching or research models.
        </p>
      </div>

      {/* Search + filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          flex: '1 1 360px', minWidth: 260, position: 'relative',
          display: 'flex', alignItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
            position: 'absolute', left: 14, color: 'var(--ink-dim)',
          }}>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by model number or keyword — e.g. HT10XC, distillation, pasteuriser"
            style={{
              width: '100%', height: 44, padding: '0 14px 0 40px',
              background: 'var(--surface-1)', border: '1px solid var(--hairline)',
              borderRadius: 8, fontSize: 14, fontFamily: 'var(--sans)',
              color: 'var(--ink)', outline: 'none', transition: 'border-color 160ms',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--hairline)'}
          />
        </div>
        <div style={{
          display: 'flex', gap: 2, padding: 2, background: 'var(--surface-2)',
          border: '1px solid var(--hairline)', borderRadius: 8,
        }}>
          {['All', 'Teaching', 'Research'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none',
              background: filter === f ? 'var(--bg)' : 'transparent',
              color: filter === f ? 'var(--ink)' : 'var(--ink-dim)',
              fontFamily: 'var(--sans)', fontSize: 13, cursor: 'pointer',
              boxShadow: filter === f ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
              transition: 'all 140ms',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Either: search results OR major grid */}
      {hits ? (
        <SearchResults hits={hits} onJumpProduct={onJumpProduct} query={query} />
      ) : (
        <>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            color: 'var(--ink-dim)', marginBottom: 14,
          }}>
            DISCIPLINE ({data.majors.length})
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 1, background: 'var(--hairline)',
            border: '1px solid var(--hairline)', borderRadius: 10, overflow: 'hidden',
          }}>
            {data.majors.map(m => (
              <MajorCard key={m.id} major={m} data={data} onClick={() => onPickMajor(m.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MajorCard = ({ major, data, onClick }) => {
  const [hover, setHover] = useState(false);
  const catCount = major.categories.length;
  const productCount = data.products.filter(p =>
    major.categories.includes(p.cat)
  ).length;

  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--surface-1)' : 'var(--bg)',
        border: 'none', padding: '28px 26px 24px', textAlign: 'left',
        cursor: 'pointer', transition: 'background 160ms',
        display: 'flex', flexDirection: 'column', gap: 14, minHeight: 180,
        fontFamily: 'inherit',
      }}>
      <div style={{
        width: 44, height: 44, borderRadius: 8,
        background: hover ? 'var(--accent-wash)' : 'var(--surface-2)',
        color: hover ? 'var(--accent)' : 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 160ms',
      }}>
        <MajorGlyph kind={major.glyph} size={26} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--display)', fontSize: 19, fontWeight: 500,
          color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 4,
        }}>{major.name}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.4 }}>
          {major.blurb}
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em',
        color: 'var(--ink-dim)',
      }}>
        <span>{catCount} CATEGORIES · {productCount} PRODUCTS</span>
        <span style={{
          transform: hover ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 180ms',
        }}>→</span>
      </div>
    </button>
  );
};

const SearchResults = ({ hits, onJumpProduct, query }) => (
  <div>
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
      color: 'var(--ink-dim)', marginBottom: 14,
    }}>
      {hits.length} RESULT{hits.length === 1 ? '' : 'S'} FOR "{query.toUpperCase()}"
    </div>
    {hits.length === 0 ? (
      <div style={{
        padding: '48px 24px', textAlign: 'center', color: 'var(--ink-dim)',
        border: '1px dashed var(--hairline)', borderRadius: 10,
        fontFamily: 'var(--sans)', fontSize: 14,
      }}>
        No products match. Try a series prefix (F, HT, UOP, PCT, W, FT…).
      </div>
    ) : (
      <div style={{
        border: '1px solid var(--hairline)', borderRadius: 10, overflow: 'hidden',
      }}>
        {hits.map((p, i) => (
          <button key={p.id} onClick={() => onJumpProduct(p.id)}
            style={{
              width: '100%', display: 'grid',
              gridTemplateColumns: '140px 1fr auto', gap: 20, padding: '16px 20px',
              background: 'var(--bg)', border: 'none',
              borderTop: i > 0 ? '1px solid var(--hairline)' : 'none',
              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              alignItems: 'center', transition: 'background 140ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink)' }}>{p.id}</span>
            <span style={{ fontSize: 14, color: 'var(--ink)' }}>{p.name}</span>
            <Chip tone={p.use === 'Teaching' ? 'teach' : 'research'}>{p.use}</Chip>
          </button>
        ))}
      </div>
    )}
  </div>
);

Object.assign(window, { Chip, Crumb, Landing, MajorCard, SearchResults });

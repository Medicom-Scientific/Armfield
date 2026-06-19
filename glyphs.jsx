// Small inline SVG glyph set for majors. Abstract geometric only — no branded iconography.
const MajorGlyph = ({ kind, size = 28 }) => {
  const s = { width: size, height: size, display: 'block' };
  const stroke = 'currentColor';
  const common = { fill: 'none', stroke, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'mech': // gear/ring
      return (
        <svg viewBox="0 0 32 32" style={s}>
          <circle cx="16" cy="16" r="5.5" {...common} />
          <circle cx="16" cy="16" r="11" {...common} />
          <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.5 6.5l2.1 2.1M23.4 23.4l2.1 2.1M6.5 25.5l2.1-2.1M23.4 8.6l2.1-2.1" {...common} />
        </svg>
      );
    case 'chem': // flask
      return (
        <svg viewBox="0 0 32 32" style={s}>
          <path d="M13 4h6M14 4v7L7 25a2 2 0 0 0 1.8 3h14.4A2 2 0 0 0 25 25l-7-14V4" {...common} />
          <path d="M10.5 19h11" {...common} />
        </svg>
      );
    case 'civil': // bridge/arches
      return (
        <svg viewBox="0 0 32 32" style={s}>
          <path d="M3 22h26M3 26h26M6 22V10M16 22V10M26 22V10" {...common} />
          <path d="M3 10q6.5-6 13 0 6.5-6 13 0" {...common} />
        </svg>
      );
    case 'food': // wheat stalk
      return (
        <svg viewBox="0 0 32 32" style={s}>
          <path d="M16 28V8" {...common} />
          <path d="M16 12c-3-2-5-2-7-1 1 2 3 3 7 3M16 12c3-2 5-2 7-1-1 2-3 3-7 3" {...common} />
          <path d="M16 18c-3-2-5-2-7-1 1 2 3 3 7 3M16 18c3-2 5-2 7-1-1 2-3 3-7 3" {...common} />
          <path d="M16 8c-2-1-3-2-4-4 2 0 3 1 4 2 1-1 2-2 4-2-1 2-2 3-4 4z" {...common} />
        </svg>
      );
    case 'env': // droplet + waves
      return (
        <svg viewBox="0 0 32 32" style={s}>
          <path d="M16 4c4 5 7 8 7 12a7 7 0 0 1-14 0c0-4 3-7 7-12z" {...common} />
          <path d="M4 26c2-1 3-1 5 0s3 1 5 0 3-1 5 0 3 1 5 0 3-1 4 0" {...common} />
        </svg>
      );
    case 'mtx': // nested squares / control
      return (
        <svg viewBox="0 0 32 32" style={s}>
          <rect x="4" y="4" width="24" height="24" rx="2" {...common} />
          <rect x="10" y="10" width="12" height="12" rx="1" {...common} />
          <path d="M16 4v6M16 22v6M4 16h6M22 16h6" {...common} />
        </svg>
      );
    default:
      return null;
  }
};

// Product image — tries images/{productId}.png, falls back to striped placeholder.
const PlaceholderImage = ({ label = 'PRODUCT SHOT', tall = false, productId = null }) => {
  const h = tall ? 380 : 170;
  const [errored, setErrored] = React.useState(false);
  const src = productId ? `images/${productId}.png` : null;
  const showImg = src && !errored;

  return (
    <div style={{
      width: '100%', height: h, background: showImg ? '#ffffff' : 'var(--surface-2)',
      border: '1px solid var(--hairline)', borderRadius: 6, overflow: 'hidden',
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {showImg ? (
        <img src={src} alt={label} onError={() => setErrored(true)}
          style={{
            maxWidth: '88%', maxHeight: '88%', width: 'auto', height: 'auto',
            objectFit: 'contain', display: 'block',
          }} />
      ) : (
        <>
          <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, opacity: 0.55 }}>
            <defs>
              <pattern id={`s-${label}-${h}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="14" stroke="var(--hairline-strong)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="400" height="300" fill={`url(#s-${label}-${h})`} />
          </svg>
          <span style={{
            position: 'relative', fontFamily: 'var(--mono)', fontSize: 10,
            letterSpacing: '0.12em', color: 'var(--ink-dim)',
            background: 'var(--surface-1)', padding: '4px 8px', borderRadius: 3,
            border: '1px solid var(--hairline)',
          }}>{label}</span>
        </>
      )}
    </div>
  );
};

Object.assign(window, { MajorGlyph, PlaceholderImage });

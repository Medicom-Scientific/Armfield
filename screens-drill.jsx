// Category grid + product list + product detail screens
const { useState: useStateP, useMemo: useMemoP } = React;

// ---------- Categories screen ----------
const Categories = ({ major, data, onBack, onPickCategory, filter }) => {
  const cats = major.categories.map(cid => ({
    id: cid, ...data.categories[cid],
    count: data.products.filter(p => p.cat === cid && (filter === 'All' || p.use === filter)).length,
  }));

  return (
    <div className="fade-in" style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 48px 96px' }}>
      <Crumb items={[
        { label: 'All disciplines', onClick: onBack },
        { label: major.name },
      ]} />

      <div style={{ margin: '28px 0 40px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 10,
          background: 'var(--accent-wash)', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <MajorGlyph kind={major.glyph} size={32} />
        </div>
        <div>
          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 500, fontSize: 36,
            letterSpacing: '-0.02em', margin: '0 0 6px', color: 'var(--ink)',
          }}>{major.name}</h1>
          <p style={{ fontSize: 15, color: 'var(--ink-mid)', margin: 0 }}>
            {cats.length} categories · choose a product family to continue
          </p>
        </div>
      </div>

      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
        color: 'var(--ink-dim)', marginBottom: 14,
      }}>CATEGORIES</div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 12,
      }}>
        {cats.map(c => (
          <CategoryCard key={c.id} cat={c} onClick={() => onPickCategory(c.id)} />
        ))}
      </div>
    </div>
  );
};

const CategoryCard = ({ cat, onClick }) => {
  const [hover, setHover] = useStateP(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      disabled={cat.count === 0}
      style={{
        textAlign: 'left', padding: '20px 22px', borderRadius: 10,
        border: '1px solid var(--hairline)',
        background: hover && cat.count > 0 ? 'var(--surface-1)' : 'var(--bg)',
        cursor: cat.count === 0 ? 'default' : 'pointer',
        opacity: cat.count === 0 ? 0.45 : 1,
        transition: 'all 160ms', fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', gap: 16, minHeight: 128,
        transform: hover && cat.count > 0 ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hover && cat.count > 0 ? '0 2px 10px rgba(0,0,0,0.04)' : 'none',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: 'var(--display)', fontSize: 17, fontWeight: 500,
            color: 'var(--ink)', letterSpacing: '-0.005em', marginBottom: 4,
          }}>{cat.name}</div>
          <Chip tone="code">{cat.series}</Chip>
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em',
        color: 'var(--ink-dim)', marginTop: 'auto',
      }}>
        <span>{cat.count} PRODUCT{cat.count === 1 ? '' : 'S'}</span>
        {cat.count > 0 && (
          <span style={{
            transform: hover ? 'translateX(4px)' : 'translateX(0)',
            transition: 'transform 180ms',
          }}>→</span>
        )}
      </div>
    </button>
  );
};

// ---------- Products screen ----------
const Products = ({ major, category, data, filter, onBack, onBackToMajor, onPickProduct }) => {
  const products = data.products.filter(p => p.cat === category.id && (filter === 'All' || p.use === filter));
  const allInCat = data.products.filter(p => p.cat === category.id);

  return (
    <div className="fade-in" style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 48px 96px' }}>
      <Crumb items={[
        { label: 'All disciplines', onClick: onBack },
        { label: major.name, onClick: onBackToMajor },
        { label: category.name },
      ]} />

      <div style={{
        margin: '28px 0 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 500, fontSize: 36,
            letterSpacing: '-0.02em', margin: '0 0 8px', color: 'var(--ink)',
          }}>{category.name}</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Chip tone="code">{category.series}</Chip>
            <Chip>{category.tag}</Chip>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.08em' }}>
          {products.length} / {allInCat.length} SHOWN
          {filter !== 'All' && <span> · FILTERED: {filter.toUpperCase()}</span>}
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{
          padding: '64px 24px', textAlign: 'center', color: 'var(--ink-dim)',
          border: '1px dashed var(--hairline)', borderRadius: 10,
        }}>
          No {filter.toLowerCase()} products in this category.
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => onPickProduct(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product, onClick }) => {
  const [hover, setHover] = useStateP(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 10, border: '1px solid var(--hairline)',
        background: 'var(--bg)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'all 180ms',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.06)' : '0 1px 0 rgba(0,0,0,0.02)',
      }}>
      <PlaceholderImage label={product.id} productId={product.id} />
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.04em' }}>
            {product.id}
          </span>
          <Chip tone={product.use === 'Teaching' ? 'teach' : 'research'}>{product.use}</Chip>
        </div>
        <div style={{
          fontFamily: 'var(--display)', fontSize: 17, fontWeight: 500,
          color: 'var(--ink)', letterSpacing: '-0.005em', lineHeight: 1.25,
        }}>{product.name}</div>
        <div style={{
          fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.5,
          flex: 1, textWrap: 'pretty',
        }}>{product.desc}</div>
        <button onClick={onClick} style={{
          marginTop: 8, padding: '9px 14px', borderRadius: 6,
          background: hover ? 'var(--ink)' : 'var(--surface-2)',
          color: hover ? 'var(--bg)' : 'var(--ink)',
          border: '1px solid ' + (hover ? 'var(--ink)' : 'var(--hairline)'),
          fontFamily: 'var(--sans)', fontSize: 13, cursor: 'pointer',
          transition: 'all 160ms', textAlign: 'left',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>View details</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

// ---------- Product detail ----------
const ProductDetail = ({ product, data, onBack, onBackToMajor, onBackToCategory, onPickProduct, onBackHome }) => {
  const cat = data.categories[product.cat];
  const major = data.majors.find(m => m.categories.includes(product.cat));
  const related = (product.related || [])
    .map(id => data.products.find(p => p.id === id))
    .filter(Boolean);

  return (
    <div className="fade-in" style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 48px 96px' }}>
      <Crumb items={[
        { label: 'All disciplines', onClick: onBackHome },
        ...(major ? [{ label: major.name, onClick: onBackToMajor }] : []),
        { label: cat.name, onClick: onBackToCategory },
        { label: product.id },
      ]} />

      <div style={{
        marginTop: 36, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56,
        alignItems: 'flex-start',
      }}>
        <div>
          <PlaceholderImage label={product.id + ' · DETAIL'} tall productId={product.id} />
          <div style={{
            marginTop: 18, padding: '14px 16px', borderRadius: 8,
            background: 'var(--surface-1)', border: '1px solid var(--hairline)',
            display: 'flex', gap: 20, fontSize: 12, color: 'var(--ink-mid)',
            fontFamily: 'var(--sans)',
          }}>
            <DetailMeta k="Model" v={<span style={{ fontFamily: 'var(--mono)' }}>{product.id}</span>} />
            <DetailMeta k="Series" v={cat.series} />
            <DetailMeta k="Intended for" v={product.use} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <Chip tone="code">{product.id}</Chip>
            <Chip>{cat.name}</Chip>
            <Chip tone={product.use === 'Teaching' ? 'teach' : 'research'}>{product.use}</Chip>
          </div>
          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 500, fontSize: 40,
            letterSpacing: '-0.02em', margin: '0 0 20px', color: 'var(--ink)',
            lineHeight: 1.1, textWrap: 'balance',
          }}>{product.name}</h1>
          <p style={{
            fontSize: 16, color: 'var(--ink-mid)', lineHeight: 1.55,
            margin: '0 0 32px', textWrap: 'pretty',
          }}>{product.desc}</p>

          <Section title="Key experiments & applications">
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {product.experiments.map((e, i) => (
                <li key={i} style={{
                  padding: '11px 0', borderTop: i === 0 ? '1px solid var(--hairline)' : 'none',
                  borderBottom: '1px solid var(--hairline)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  fontSize: 14, color: 'var(--ink)', lineHeight: 1.45,
                }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-dim)',
                    paddingTop: 2, minWidth: 22, letterSpacing: '0.05em',
                  }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ textWrap: 'pretty' }}>{e}</span>
                </li>
              ))}
            </ul>
          </Section>

          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            <button style={{
              padding: '11px 18px', borderRadius: 7, background: 'var(--ink)',
              color: 'var(--bg)', border: 'none', fontSize: 14,
              fontFamily: 'var(--sans)', cursor: 'pointer',
            }}>Request quote</button>
            <button style={{
              padding: '11px 18px', borderRadius: 7, background: 'var(--bg)',
              color: 'var(--ink)', border: '1px solid var(--hairline)',
              fontSize: 14, fontFamily: 'var(--sans)', cursor: 'pointer',
            }}>Download datasheet</button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 80 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            color: 'var(--ink-dim)', marginBottom: 14,
          }}>RELATED PRODUCTS</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12,
          }}>
            {related.map(r => (
              <button key={r.id} onClick={() => onPickProduct(r.id)}
                style={{
                  textAlign: 'left', padding: '16px 18px', borderRadius: 8,
                  border: '1px solid var(--hairline)', background: 'var(--bg)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 160ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-dim)', marginBottom: 4 }}>{r.id}</div>
                <div style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 6 }}>{r.name}</div>
                <Chip tone={r.use === 'Teaching' ? 'teach' : 'research'}>{r.use}</Chip>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailMeta = ({ k, v }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
      color: 'var(--ink-dim)', textTransform: 'uppercase',
    }}>{k}</span>
    <span style={{ fontSize: 13, color: 'var(--ink)' }}>{v}</span>
  </div>
);

const Section = ({ title, children }) => (
  <section>
    <h3 style={{
      fontFamily: 'var(--display)', fontWeight: 500, fontSize: 14,
      letterSpacing: '-0.005em', margin: '0 0 12px', color: 'var(--ink)',
    }}>{title}</h3>
    {children}
  </section>
);

Object.assign(window, { Categories, CategoryCard, Products, ProductCard, ProductDetail });

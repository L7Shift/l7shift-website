'use client'

import Link from 'next/link'

const articles = [
  {
    slug: 'my-weekend-at-claudes',
    title: "My Weekend at Claude's",
    subtitle: 'How a Strategic Leader Built a Production SaaS in 24 Hours',
    date: 'January 27, 2026',
    readTime: '8 min read',
    tags: ['AI Strategy', 'SymbAIotic Shift™', 'Case Study'],
    featured: true,
  },
]

export default function InsightsPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        padding: '60px 24px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          fontWeight: 700,
          color: 'var(--clean-white)',
          marginBottom: '24px',
          letterSpacing: '-0.03em',
        }}>
          Insights
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--soft-gray)',
          maxWidth: '600px',
          lineHeight: 1.6,
        }}>
          Perspectives on AI strategy, the{' '}
          <span style={{
            background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            SymbAIotic Shift™
          </span>
          , and building what others won't.
        </p>
      </section>

      {/* Articles Grid */}
      <section style={{
        padding: '40px 24px 120px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))',
          gap: '32px',
        }}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <article
                className="service-card"
                style={{
                  background: 'var(--carbon-gray)',
                  border: '1px solid #333',
                  padding: '40px',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                {article.featured && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))',
                  }} />
                )}

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {article.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--electric-cyan)',
                      background: 'rgba(0, 240, 255, 0.1)',
                      padding: '6px 12px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--clean-white)',
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}>
                  {article.title}
                </h2>

                <p style={{
                  fontSize: '1.1rem',
                  color: 'var(--soft-gray)',
                  marginBottom: '32px',
                  lineHeight: 1.5,
                }}>
                  {article.subtitle}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: '#666',
                  borderTop: '1px solid #444',
                  paddingTop: '20px',
                  marginTop: 'auto',
                }}>
                  <span>{article.date}</span>
                  <span style={{ color: 'var(--electric-cyan)' }}>{article.readTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

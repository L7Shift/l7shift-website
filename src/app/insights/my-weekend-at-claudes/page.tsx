'use client'

import Link from 'next/link'

export default function MyWeekendAtClaudes() {
  return (
    <>
      {/* Animation Styles */}
      <style>{`
        @keyframes berniesWalk {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          25% { transform: translateY(-8px) rotate(5deg); }
          50% { transform: translateY(0) rotate(-5deg); }
          75% { transform: translateY(-8px) rotate(5deg); }
        }
        .bernies-claude {
          animation: berniesWalk 0.6s ease-in-out infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text {
          background: linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta), var(--acid-lime), var(--electric-cyan));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
        }
        .gradient-text-subtle {
          background: linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta));
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 6s ease infinite;
        }
      `}</style>

      {/* Article Header */}
      <header style={{
        padding: '40px 24px 60px',
        textAlign: 'center',
        borderBottom: '1px solid var(--carbon-gray)',
        maxWidth: '900px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {/* Back link */}
        <Link
          href="/insights"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--soft-gray)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            marginBottom: '40px',
          }}
        >
          <span>←</span> All Insights
        </Link>

        {/* Animated Bernie's Walk Claude Icon */}
        <div style={{ marginBottom: '24px' }}>
          <img
            src="/images/claude-bernie.png"
            alt="Claude Bernie - Weekend at Bernie's style"
            className="bernies-claude"
            style={{
              width: '120px',
              height: 'auto',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['AI Strategy', 'SymbAIotic Shift™', 'Case Study'].map((tag) => (
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

        <h1
          className="gradient-text"
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            fontWeight: 700,
            marginBottom: '24px',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}>
          My Weekend at Claude's
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: 'var(--soft-gray)',
        }}>
          How a Strategic Leader Built a Production SaaS in <span className="gradient-text-subtle" style={{ fontWeight: 600 }}>24 Hours</span> — And What It Means for Your Business
        </p>
        <p style={{
          marginTop: '16px',
          fontSize: '13px',
          color: '#555',
          fontStyle: 'italic',
        }}>
          Yes, it's a "Weekend at Bernie's" reference. Except nobody's dead — just my old development timeline.
        </p>
        <p style={{
          marginTop: '24px',
          fontSize: '14px',
          color: '#666',
        }}>
          January 27, 2026 · 8 min read
        </p>
      </header>

      {/* Article Content */}
      <article style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '60px 24px 120px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}>
        {/* Pullquote */}
        <blockquote style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 500,
          color: 'var(--clean-white)',
          textAlign: 'center',
          padding: '48px 0',
          margin: '0 0 48px',
          borderBottom: '1px solid var(--carbon-gray)',
          position: 'relative',
        }}>
          <span style={{ color: 'var(--electric-cyan)' }}>"</span>
          What would you build if you weren't waiting on anyone else?
          <span style={{ color: 'var(--hot-magenta)' }}>"</span>
        </blockquote>

        <p style={{ fontSize: '1.25rem', color: '#CCC', marginBottom: '24px' }}>
          That question used to haunt me. As a founder, I've spent years stuck in the gap between vision and execution — knowing exactly what needed to exist, but dependent on timelines, budgets, and other people's calendars.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Then I spent a weekend with Claude. Everything changed.
        </p>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          The Founder's Curse
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          You know the feeling.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          2am. You can <em style={{ color: '#CCC' }}>see</em> the product. Every feature. Every flow. The pricing page. The onboarding emails. You could sketch the entire thing on a napkin.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '16px' }}>
          Morning comes. Reality hits:
        </p>

        <ul style={{ marginLeft: '24px', marginBottom: '24px' }}>
          <li style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>"The dev team is booked for 6 weeks."</li>
          <li style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>"That's out of scope for this sprint."</li>
          <li style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>"We'll need to bring in a contractor."</li>
          <li style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>"Let's revisit this in Q2."</li>
        </ul>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          So you wait. You compromise. You build something smaller because you're bottlenecked by execution capacity — not by ideas, not by strategy, not by vision.
        </p>

        {/* Highlight box */}
        <div style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid',
          borderImage: 'linear-gradient(180deg, var(--electric-cyan), var(--hot-magenta)) 1',
          padding: '24px 28px',
          margin: '32px 0',
        }}>
          <p style={{ color: 'var(--clean-white)', fontSize: '1.1rem', margin: 0 }}>
            <strong>The curse of the modern founder isn't a lack of ideas. It's the distance between imagination and implementation.</strong>
          </p>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Most of us have accepted this as physics. An immutable law of business.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          It's not.
        </p>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          The{' '}
          <span style={{
            background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            SymbAIotic Shift™
          </span>
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          November 2025. Within one week, everything changed. <strong style={{ color: 'var(--clean-white)' }}>Gemini 3.0</strong> dropped on November 18th. <strong style={{ color: 'var(--clean-white)' }}>Claude Opus 4.5</strong> followed on November 24th — scoring 80.9% on SWE-bench, the gold standard for AI coding evaluation.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          These weren't incremental improvements. They could <em style={{ color: '#CCC' }}>build</em>. Debug. Architect systems. Write production code. Design databases. Craft emails. Iterate based on feedback.
        </p>

        {/* Stats callout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          margin: '32px 0',
        }}>
          <div style={{ background: 'var(--carbon-gray)', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--electric-cyan)' }}>41%</div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>of all code now AI-assisted</div>
          </div>
          <div style={{ background: 'var(--carbon-gray)', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--hot-magenta)' }}>55%</div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>faster task completion (GitHub)</div>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '24px', fontStyle: 'italic' }}>
          Sources: <a href="https://www.secondtalent.com/resources/ai-coding-assistant-statistics/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--electric-cyan)' }}>Stack Overflow 2025 Developer Survey</a>, <a href="https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--electric-cyan)' }}>IT Revolution</a>
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          But here's what most people missed:
        </p>

        {/* Dark box */}
        <div style={{
          background: 'linear-gradient(135deg, var(--carbon-gray) 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          padding: '40px',
          margin: '40px 0',
        }}>
          <h3 style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '1.5rem',
            color: 'var(--electric-cyan)',
            marginTop: 0,
            marginBottom: '16px',
          }}>
            These models don't replace human intelligence. They amplify it.
          </h3>
          <p style={{ color: '#AAA', marginBottom: '16px' }}>
            Think Venom. Eddie Brock alone? Struggling journalist. The symbiote alone? Chaotic, directionless. Together? Something entirely new. Capabilities neither could access independently.
          </p>
          <p style={{ color: 'var(--clean-white)', margin: 0 }}>
            <strong>That's what's happening right now with AI. Not replacement. <span style={{ background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SymbAIosis™</span>.</strong>
          </p>
        </div>

        {/* Two columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          margin: '40px 0',
        }}>
          <div style={{ background: 'var(--carbon-gray)', padding: '24px' }}>
            <h4 style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '0.85rem',
              color: 'var(--electric-cyan)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: 0,
            }}>
              The Strategic Mind Provides
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Domain expertise</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Business judgment</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Creative vision</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Quality standards</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '0' }}>The "why" behind every decision</li>
            </ul>
          </div>
          <div style={{ background: 'var(--carbon-gray)', padding: '24px' }}>
            <h4 style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '0.85rem',
              color: 'var(--hot-magenta)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: 0,
            }}>
              The AI Provides
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Instant execution</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Unlimited working memory</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Pattern recognition at scale</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>24/7 availability</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '0' }}>Zero ego</li>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', marginBottom: '24px' }}>
          <strong>Alone, you're limited by your technical skills. Alone, the AI builds generic solutions to generic problems. Together, you build exactly what you envisioned — at the speed of thought.</strong>
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          This is the <span style={{ background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SymbAIotic Shift™</span>. It's not coming. It's here.
        </p>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          24 Hours in the Lab
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Let me tell you about my weekend.
        </p>

        <h3 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '48px 0 16px',
          color: 'var(--clean-white)',
        }}>
          The Challenge
        </h3>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          <a
            href="https://scatpackclt.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--electric-cyan)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--electric-cyan)',
            }}
          >
            <strong>Scat Pack CLT</strong>
          </a>{' '}
          — a pet waste removal service launching in Charlotte, NC. Needed a complete ops platform: customer acquisition, subscription billing, territory management, field crew coordination, commission calculations, automated emails, mobile-first crew interface.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>
          <strong style={{ color: 'var(--clean-white)' }}>Traditional estimate:</strong> 4-8 weeks. Small dev team. $15-40K budget.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          <strong style={{ color: 'var(--clean-white)' }}>My timeline:</strong> One weekend. Me and Claude.
        </p>

        <h3 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '48px 0 16px',
          color: 'var(--clean-white)',
        }}>
          The Results
        </h3>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          margin: '40px 0',
        }}>
          {[
            { number: '24', label: 'Hours' },
            { number: '18', label: 'DB Tables' },
            { number: '8K+', label: 'Lines' },
            { number: '50+', label: 'Components' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'var(--carbon-gray)',
              padding: '24px 16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--electric-cyan)',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#888',
                marginTop: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{ overflowX: 'auto', margin: '32px 0' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
          minWidth: '500px',
        }}>
          <thead>
            <tr>
              <th style={{
                background: 'var(--carbon-gray)',
                color: 'var(--clean-white)',
                padding: '14px 16px',
                textAlign: 'left',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '1px',
              }}>Component</th>
              <th style={{
                background: 'var(--carbon-gray)',
                color: 'var(--clean-white)',
                padding: '14px 16px',
                textAlign: 'left',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '1px',
              }}>Traditional</th>
              <th style={{
                background: 'var(--carbon-gray)',
                color: 'var(--clean-white)',
                padding: '14px 16px',
                textAlign: 'left',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '1px',
              }}><span style={{ background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SymbAIotic™</span></th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Database schema (18 tables)', '1-2 weeks', '2 hours'],
              ['Customer website + signup', '2-3 weeks', '3 hours'],
              ['Admin dashboard', '2-3 weeks', '6 hours'],
              ['Crew mobile portal', '1-2 weeks', '4 hours'],
              ['Stripe integration', '1 week', '3 hours'],
              ['Email automation (8 templates)', '3-5 days', '2 hours'],
              ['Security infrastructure', '2-3 days', '1 hour'],
            ].map(([component, traditional, symbiotic], i) => (
              <tr key={i}>
                <td style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--carbon-gray)',
                  color: '#B0B0B0',
                }}>{component}</td>
                <td style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--carbon-gray)',
                  color: '#B0B0B0',
                }}>{traditional}</td>
                <td style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--carbon-gray)',
                  color: 'var(--acid-lime)',
                  fontWeight: 600,
                }}>{symbiotic}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Sunday night. Platform live. Real URL. Real payments. Production-ready.
        </p>

        <h3 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '48px 0 16px',
          color: 'var(--clean-white)',
        }}>
          Hour by Hour: The Build Timeline
        </h3>

        <div style={{
          background: 'var(--carbon-gray)',
          padding: '32px',
          margin: '24px 0 40px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { time: 'Saturday 8am', task: 'Vision dump', detail: 'Explained the entire business model to Claude. Territories, pricing tiers, crew compensation philosophy, customer lifecycle. No code yet — just strategy.' },
              { time: '9am', task: 'Database architecture', detail: '18 tables designed. customers, crew_members, territories, territory_slots, scheduled_visits, commissions, referrals. Row-level security configured.' },
              { time: '11am', task: 'Supabase live', detail: 'Database deployed. First migrations running. Real PostgreSQL, not some toy SQLite.' },
              { time: '1pm', task: 'Marketing site', detail: 'Landing page, pricing, service areas. Zip code lookup with territory capacity display. Scout AI chatbot integrated.' },
              { time: '4pm', task: 'Signup flow', detail: 'Multi-step form. Address validation. Territory assignment. Stripe checkout. Welcome email trigger.' },
              { time: '7pm', task: 'Admin dashboard v1', detail: 'Customer list. Territory heat map. Revenue metrics. Basic CRUD operations.' },
              { time: '10pm', task: 'Crew portal started', detail: 'Auth system. Job queue. Route display. Mobile-first design.' },
              { time: 'Sunday 8am', task: 'Commission engine', detail: 'The hard part. Vesting rules. Clawback logic. Edge cases for cancellations. Took 3 iterations to get right.' },
              { time: '11am', task: 'Stripe webhooks', detail: 'payment_intent.succeeded, subscription.canceled, invoice.paid. Each one wired to business logic.' },
              { time: '2pm', task: 'Email templates', detail: '8 transactional emails. Welcome, reminder, confirmation, receipt, referral invite, crew assignment, schedule change, service complete.' },
              { time: '5pm', task: 'Polish & edge cases', detail: 'Error handling. Loading states. Empty states. Mobile responsiveness. The 20% that makes it feel like a real product.' },
              { time: '8pm', task: 'DNS + Deploy', detail: 'Cloudflare configured. Vercel production. scatpackclt.com live. First real customer signup test passed.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: '100px',
                  fontSize: '0.85rem',
                  color: 'var(--electric-cyan)',
                  fontWeight: 600,
                  fontFamily: 'Monaco, Consolas, monospace',
                }}>
                  {item.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--clean-white)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                    {item.task}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '48px 0 16px',
          color: 'var(--clean-white)',
        }}>
          The Hard Parts (What Almost Broke Me)
        </h3>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          It wasn't all magic. Here's what actually went wrong:
        </p>

        <div style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.2)',
          padding: '24px',
          margin: '24px 0',
        }}>
          <h4 style={{ color: 'var(--hot-magenta)', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>
            Stripe Webhook Signature Verification
          </h4>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem', marginBottom: '12px' }}>
            Kept getting 400 errors. Spent an hour debugging. Turned out the raw body parsing in Next.js was stripping the signature. Had to use a custom body parser config.
          </p>
          <p style={{ color: 'var(--acid-lime)', fontSize: '0.9rem', margin: 0 }}>
            <strong>Fix:</strong> <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>export const config = {'{ api: { bodyParser: false } }'}</code>
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.2)',
          padding: '24px',
          margin: '24px 0',
        }}>
          <h4 style={{ color: 'var(--hot-magenta)', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>
            Commission Calculation Edge Cases
          </h4>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem', marginBottom: '12px' }}>
            First version was clean. Then: "What if they cancel on day 29?" "What if they downgrade mid-month?" "What if they upgrade, then cancel?" Each edge case required rethinking the state machine.
          </p>
          <p style={{ color: 'var(--acid-lime)', fontSize: '0.9rem', margin: 0 }}>
            <strong>Fix:</strong> Moved to event-sourced commission tracking. Every state change logged. Calculations derived from event history.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.2)',
          padding: '24px',
          margin: '24px 0',
        }}>
          <h4 style={{ color: 'var(--hot-magenta)', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>
            Territory Capacity Race Conditions
          </h4>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem', marginBottom: '12px' }}>
            Two customers signing up for the last slot simultaneously. First implementation let both through. Discovered via manual testing (nearly missed it).
          </p>
          <p style={{ color: 'var(--acid-lime)', fontSize: '0.9rem', margin: 0 }}>
            <strong>Fix:</strong> PostgreSQL row-level locking with <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>FOR UPDATE</code> on territory slot check.
          </p>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px', marginTop: '32px' }}>
          The AI doesn't eliminate debugging. It accelerates the entire cycle — including finding and fixing problems.
        </p>

        <h3 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '48px 0 16px',
          color: 'var(--clean-white)',
        }}>
          What Actually Happened
        </h3>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          I didn't write code. I <em style={{ color: '#CCC' }}>directed</em> it.
        </p>

        {/* Highlight boxes */}
        <div style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid',
          borderImage: 'linear-gradient(180deg, var(--electric-cyan), var(--hot-magenta)) 1',
          padding: '24px 28px',
          margin: '32px 0',
        }}>
          <p style={{ color: 'var(--clean-white)', fontSize: '1rem', margin: 0, fontStyle: 'italic' }}>
            "We need a territory system that prevents overbooking. Each slot has capacity limits. Show me visually when we're approaching capacity."
          </p>
          <p style={{ color: 'var(--acid-lime)', marginTop: '12px', marginBottom: 0 }}>
            <strong>Three minutes. Implemented. Tested. Deployed.</strong>
          </p>
        </div>

        <div style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid',
          borderImage: 'linear-gradient(180deg, var(--electric-cyan), var(--hot-magenta)) 1',
          padding: '24px 28px',
          margin: '32px 0',
        }}>
          <p style={{ color: 'var(--clean-white)', fontSize: '1rem', margin: 0, fontStyle: 'italic' }}>
            "Commission logic is wrong. Crew gets paid after second customer payment. Cancel before 30 days, clawback the commission."
          </p>
          <p style={{ color: 'var(--acid-lime)', marginTop: '12px', marginBottom: 0 }}>
            <strong>Four minutes. Business rules encoded. Edge cases handled.</strong>
          </p>
        </div>

        <div style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid',
          borderImage: 'linear-gradient(180deg, var(--electric-cyan), var(--hot-magenta)) 1',
          padding: '24px 28px',
          margin: '32px 0',
        }}>
          <p style={{ color: 'var(--clean-white)', fontSize: '1rem', margin: 0, fontStyle: 'italic' }}>
            "Production means security. Bot protection on every public form. Graceful degradation. No friction for real users."
          </p>
          <p style={{ color: 'var(--acid-lime)', marginTop: '12px', marginBottom: 0 }}>
            <strong>One hour. Enterprise-grade protection. Four attack vectors closed.</strong>
          </p>
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', marginBottom: '24px' }}>
          <strong>I wasn't learning to code. I was applying twenty years of business strategy directly to software — zero translation loss.</strong>
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Every decision reflected my judgment. Every feature solved a real problem I understood deeply. The AI didn't decide what to build. I did. It just made it real at the speed I could think.
        </p>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          Why Most AI Implementations Fail
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Here's what the consultants won't tell you:
        </p>

        <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', marginBottom: '24px' }}>
          <strong>Most companies are using AI wrong.</strong>
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          They're treating it like a slightly smarter Google. Fancy autocomplete. A way to generate mediocre first drafts humans have to fix.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          That's not symbiosis. That's friction with extra steps.
        </p>

        {/* Dark box */}
        <div style={{
          background: 'linear-gradient(135deg, var(--carbon-gray) 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          padding: '40px',
          margin: '40px 0',
        }}>
          <h3 style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '1.5rem',
            color: 'var(--electric-cyan)',
            marginTop: 0,
            marginBottom: '16px',
          }}>
            The unlock isn't giving AI tasks. It's giving AI direction.
          </h3>
          <p style={{ color: '#AAA', marginBottom: '8px' }}>
            <strong style={{ color: 'var(--clean-white)' }}>Task:</strong> "Write me a function that calculates commissions"
          </p>
          <p style={{ color: '#AAA', marginBottom: '16px' }}>
            <strong style={{ color: 'var(--clean-white)' }}>Direction:</strong> "Our compensation philosophy incentivizes long-term retention. Clawbacks create accountability. Timing aligns with billing cycles. Build a system that embodies these principles."
          </p>
          <p style={{ color: 'var(--acid-lime)', margin: 0 }}>
            <strong>First prompt gets code. Second gets a business asset.</strong>
          </p>
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', marginBottom: '24px' }}>
          <strong>The AI's power is proportional to the clarity of the mind directing it.</strong>
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          This is why generic "AI adoption" fails. You can't outsource strategy to a language model. But you can <em style={{ color: '#CCC' }}>execute</em> strategy through one — if you know what you're doing.
        </p>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          The New Development Cycle
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Here's what traditional software development looks like:
        </p>

        <p style={{ fontSize: '1.1rem', color: '#888', marginBottom: '24px', fontStyle: 'italic' }}>
          Executive has vision → writes spec → hands to dev team → dev team interprets → builds something → stakeholders review → request changes → repeat for months → finally launches → users don't adopt it because it wasn't built for how they actually work.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Here's the <span style={{ background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SymbAIotic™</span> development cycle:
        </p>

        <div style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid',
          borderImage: 'linear-gradient(180deg, var(--electric-cyan), var(--hot-magenta)) 1',
          padding: '24px 28px',
          margin: '32px 0',
        }}>
          <p style={{ color: 'var(--clean-white)', fontSize: '1.1rem', margin: 0 }}>
            <strong>We build systems in <span style={{ background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SymbAIosis™</span> with the people who will use them.</strong>
          </p>
          <p style={{ color: 'var(--acid-lime)', marginTop: '16px', marginBottom: 0, fontSize: '1rem' }}>
            The result? Dramatically higher <strong>adoption</strong>, <strong>utilization</strong>, and <strong>speed to value</strong>.
          </p>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          When the person with domain expertise is the same person directing the build, you eliminate translation loss. You eliminate the telephone game between business and technical teams. You build exactly what's needed — not an approximation filtered through three layers of interpretation.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          The crew portal I built? I designed it while thinking about the guy in the truck at 7am checking his route. The admin dashboard? Built while imagining the owner reviewing yesterday's completions at her kitchen table. <strong style={{ color: 'var(--clean-white)' }}>That's not user research. That's user intuition, executed directly.</strong>
        </p>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          What This Means For You
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Let me be direct.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '16px' }}>
          If you're a founder, executive, or business leader with:
        </p>

        <ul style={{ marginLeft: '24px', marginBottom: '24px' }}>
          <li style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>A clear vision for what your company needs</li>
          <li style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>Domain expertise waiting for execution</li>
          <li style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>Strategic judgment to direct complex builds</li>
          <li style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '8px' }}>Impatience with traditional timelines</li>
        </ul>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          You're sitting on unlocked potential. Not theoretical future potential. <strong style={{ color: 'var(--clean-white)' }}>Right now</strong> potential.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          The question isn't "Can AI help my business?"
        </p>

        <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', marginBottom: '24px' }}>
          The question is: <strong>"What would I build this weekend if I could?"</strong>
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Because you can.
        </p>

        {/* The Real Why */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(255, 0, 170, 0.05) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          padding: '40px',
          margin: '72px 0',
        }}>
          <h3 style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '1.25rem',
            color: 'var(--electric-cyan)',
            marginTop: 0,
            marginBottom: '16px',
          }}>
            Why I Actually Built This
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '16px' }}>
            Full disclosure: I'm the founder of both L7 Shift and Scat Pack CLT.
          </p>
          <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '16px' }}>
            I started Scat Pack to create a real business opportunity for my 13-year-old son. Not a lemonade stand. Not a theoretical exercise. A real company with real customers, real revenue, and real lessons about building something from nothing.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', margin: 0 }}>
            <strong>The best way to teach entrepreneurship is to do it together.</strong> And now we have the tools to build at the speed of ambition — not the speed of budget constraints.
          </p>
        </div>

        {/* Divider */}
        <div style={{ textAlign: 'center', margin: '72px 0' }}>
          <span style={{
            display: 'inline-block',
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))',
          }} />
        </div>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '0 0 24px',
          color: 'var(--clean-white)',
        }}>
          The Offer
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          L7 Shift works with leaders ready to stop waiting.
        </p>

        {/* Services grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          margin: '40px 0',
        }}>
          {[
            {
              title: 'SymbAIotic™ Strategy Sessions',
              description: 'Half-day intensive. Map your "someday" projects to what\'s now possible.',
              hasGradient: true,
            },
            {
              title: 'Embedded SymbAIosis™',
              description: 'We build alongside you. Your strategy, our execution layer.',
              hasGradient: true,
            },
            {
              title: 'SymbAIote™ Enablement',
              description: 'Develop your own AI-amplified capabilities. Hands-on apprenticeship.',
              hasGradient: true,
            },
          ].map((service) => (
            <div key={service.title} style={{
              border: '1px solid var(--carbon-gray)',
              padding: '28px',
              transition: 'border-color 0.2s',
            }}>
              <h4 style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontSize: '1rem',
                marginBottom: '12px',
                marginTop: 0,
                background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {service.title}
              </h4>
              <p style={{ fontSize: '0.95rem', color: '#888', margin: 0 }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>


        {/* Architecture Diagram - For the Nerds */}
        <div style={{
          margin: '72px -24px',
          padding: '40px 24px',
          background: '#111',
          border: '1px solid var(--carbon-gray)',
          borderLeft: 'none',
          borderRight: 'none',
          overflowX: 'auto',
        }}>
          <h3 style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '1.25rem',
            color: 'var(--electric-cyan)',
            marginTop: 0,
            marginBottom: '8px',
          }}>
            For the Nerds: The Full Architecture
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '24px' }}>
            Enterprise-grade stack delivered in 24 hours
          </p>

          <pre style={{
            fontFamily: 'Monaco, Consolas, monospace',
            fontSize: '0.65rem',
            color: 'var(--soft-gray)',
            overflow: 'auto',
            lineHeight: 1.5,
            margin: 0,
          }}>{`
┌──────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │  Marketing │ │   Admin    │ │    Crew    │ │  Training  │            │
│  │  Website   │ │ Dashboard  │ │   Portal   │ │  Doc Hub   │            │
│  │ + Scout AI │ │ + Schedule │ │ + Jobs     │ │ + Guides   │            │
│  │  Chatbot   │ │ + Routes   │ │ + Earnings │ │ + SOPs     │            │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘            │
│        └──────────────┴──────────────┴──────────────┘                    │
│                    ┌─────────┴─────────┐                                 │
│                    │   GTM + GA4       │  ◄── Analytics & Conversions    │
│                    └───────────────────┘                                 │
└──────────────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Next.js)                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ /signup  │ │ /webhook │ │  /chat   │ │  /admin  │ │  /crew   │       │
│  │   flow   │ │ (Stripe) │ │ (Claude) │ │   APIs   │ │   APIs   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  /cron   │ │/hero-gen │ │ /routes  │ │/schedule │ │/commissn │       │
│  │  jobs    │ │(Replcte) │ │ optimize │ │ manage   │ │  calc    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└──────────────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ Stripe  │ │ Resend  │ │ Twilio  │ │ Claude  │ │Replicate│            │
│  │Payments │ │ Email   │ │  SMS    │ │  API    │ │AI Hero  │            │
│  │Subscrip.│ │8 Templ. │ │ Notifs  │ │ Chatbot │ │ Images  │            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                                    │
│  │ Vercel  │ │Cloudflre│ │Playwrght│                                    │
│  │ Hosting │ │CDN/DNS  │ │E2E Test │                                    │
│  │ + Cron  │ │ + WAF   │ │53 Cases │                                    │
│  └─────────┘ └─────────┘ └─────────┘                                    │
└──────────────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────────────────────────────────────────────────┐
│                       DATABASE (Supabase)                                │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  18 Tables: customers, crew_members, territories, shifts,          │ │
│  │  scheduled_visits, commissions, referrals, email_logs, waitlist,   │ │
│  │  territory_slots, customer_schedules, organizations, job_events... │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  PostgreSQL + Row Level Security + Real-time Subscriptions + Edge Funcs │
└──────────────────────────────────────────────────────────────────────────┘
`}</pre>

          <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ color: 'var(--electric-cyan)', fontSize: '0.8rem', marginBottom: '12px', letterSpacing: '0.1em' }}>COMPLETE TECH STACK</h4>
              <ul style={{ fontSize: '0.8rem', color: '#888', paddingLeft: '16px', margin: 0, lineHeight: 1.8 }}>
                <li><strong style={{ color: '#CCC' }}>Frontend:</strong> Next.js 14 + TypeScript + Tailwind</li>
                <li><strong style={{ color: '#CCC' }}>Backend:</strong> Next.js API + Vercel Edge</li>
                <li><strong style={{ color: '#CCC' }}>Database:</strong> Supabase (PostgreSQL + RLS)</li>
                <li><strong style={{ color: '#CCC' }}>Payments:</strong> Stripe (Subscriptions + Webhooks)</li>
                <li><strong style={{ color: '#CCC' }}>Email:</strong> Resend (8 templates)</li>
                <li><strong style={{ color: '#CCC' }}>SMS:</strong> Twilio (reminders + alerts)</li>
                <li><strong style={{ color: '#CCC' }}>AI Chat:</strong> Claude API (Scout bot)</li>
                <li><strong style={{ color: '#CCC' }}>AI Images:</strong> Replicate (hero generation)</li>
                <li><strong style={{ color: '#CCC' }}>Analytics:</strong> GTM + GA4</li>
                <li><strong style={{ color: '#CCC' }}>CDN:</strong> Cloudflare (DNS + WAF)</li>
                <li><strong style={{ color: '#CCC' }}>Testing:</strong> Playwright (53 E2E tests)</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--hot-magenta)', fontSize: '0.8rem', marginBottom: '12px', letterSpacing: '0.1em' }}>FEATURES DELIVERED</h4>
              <ul style={{ fontSize: '0.8rem', color: '#888', paddingLeft: '16px', margin: 0, lineHeight: 1.8 }}>
                <li>AI chatbot for sales & support</li>
                <li>Subscription billing with trials</li>
                <li>Territory & capacity management</li>
                <li>Drag-and-drop scheduling</li>
                <li>Route optimization</li>
                <li>Crew mobile portal + earnings</li>
                <li>Commission vesting + clawback</li>
                <li>8 automated email workflows</li>
                <li>SMS appointment reminders</li>
                <li>Referral program (dual rewards)</li>
                <li>AI-generated hero images</li>
                <li>Training docs & SOPs</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--carbon-gray)',
          border: '1px solid #333',
          padding: '60px 40px',
          textAlign: 'center',
          margin: '72px 0 48px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))',
          }} />
          <h2 style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '1.75rem',
            color: 'var(--clean-white)',
            marginTop: 0,
            marginBottom: '16px',
          }}>
            The Future Isn't Coming. It's Here.
          </h2>
          <p style={{ color: '#888', maxWidth: '500px', margin: '0 auto 16px' }}>
            January 2026. Complete SaaS platform. One weekend. Three months ago, impossible. Three months from now, table stakes.
          </p>
          <p style={{ color: 'var(--clean-white)', marginBottom: '32px' }}>
            <strong>What would you build if you weren't waiting on anyone else?</strong>
          </p>
          <Link href="/start" className="btn-primary" style={{
            display: 'inline-block',
            padding: '16px 48px',
          }}>
            Let's Find Out →
          </Link>
        </div>

        {/* Author box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '32px',
          background: 'var(--carbon-gray)',
          marginTop: '72px',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, var(--electric-cyan), var(--hot-magenta))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--void-black)',
            flexShrink: 0,
          }}>
            KL
          </div>
          <div>
            <h4 style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '1.1rem',
              color: 'var(--clean-white)',
              marginBottom: '4px',
              marginTop: 0,
            }}>
              Ken Leftwich
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#888', margin: 0 }}>
              Founder, L7 Shift<br />
              Enabling the{' '}
              <span style={{
                background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                SymbAIotic Shift™
              </span>
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{
          marginTop: '48px',
          paddingTop: '32px',
          borderTop: '1px solid var(--carbon-gray)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
            Share this article
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https://l7shift.com/insights/my-weekend-at-claudes"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#0A66C2',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Share on LinkedIn
            </a>
            <a
              href="https://twitter.com/intent/tweet?text=My%20Weekend%20at%20Claude%27s%20-%20How%20I%20built%20a%20production%20SaaS%20in%2024%20hours&url=https://l7shift.com/insights/my-weekend-at-claudes"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#1DA1F2',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Share on X
            </a>
          </div>
        </div>
      </article>
    </>
  )
}

'use client'

import Link from 'next/link'

export default function FrankensteinsTheme() {
  return (
    <>
      {/* Animation Styles */}
      <style>{`
        @keyframes stitch {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .stitch-pulse {
          animation: stitch 2s ease-in-out infinite;
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

        {/* Stitching visual */}
        <div style={{ marginBottom: '24px', fontSize: '48px' }}>
          <span className="stitch-pulse">🧵</span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['Case Study', 'Shopify', 'SymbAIotic Shift™'].map((tag) => (
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
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 700,
            marginBottom: '24px',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}>
          Frankenstein's Theme
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: 'var(--soft-gray)',
        }}>
          Stitching React into Shopify's Liquid — and why <span className="gradient-text-subtle" style={{ fontWeight: 600 }}>brownfield is harder</span> than greenfield
        </p>
        <p style={{
          marginTop: '16px',
          fontSize: '13px',
          color: '#555',
          fontStyle: 'italic',
        }}>
          Yes, it's a Frankenstein reference. The monster that actually works. "Theme" = Shopify theme. "Stitching" = Nicole's literal business. You'll get it.
        </p>
        <p style={{
          marginTop: '24px',
          fontSize: '14px',
          color: '#666',
        }}>
          February 23, 2026 · 12 min read
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
          Building new is fun. Renovating is harder, messier, and way more relatable.
          <span style={{ color: 'var(--hot-magenta)' }}>"</span>
        </blockquote>

        <p style={{ fontSize: '1.25rem', color: '#CCC', marginBottom: '24px' }}>
          Last month I wrote about building a production SaaS in a weekend. Clean room. Blank canvas. Choose your tools. That was Scat Pack CLT — the greenfield origin story.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          This is the sequel. And like most sequels, it's darker, messier, and way more complicated.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Because this time I walked into someone <em style={{ color: '#CCC' }}>else's</em> house.
        </p>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          The House That Shopify Built
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          <a
            href="https://www.stitchwichs.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--hot-magenta)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--hot-magenta)',
            }}
          >
            <strong>Stitchwichs Custom Apparel & More</strong>
          </a>
          . Charlotte, NC. My sister Nicole's business. Black woman-owned, sole proprietor, made-to-order custom apparel. Sigma Gamma Rho licensed vendor. Greek letter organizations, family milestones, community celebrations.
        </p>

        <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', marginBottom: '24px' }}>
          <strong>Her custom order page was turned off. Intentionally.</strong>
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Not broken. Not forgotten. Nicole deliberately disabled it because Shopify's native forms couldn't handle what her business actually needed. Image reference uploads for custom designs. Greek letter selection with 3-layer applique color styling. Size grids for 50-person line jacket orders. Per-area customization — front, back, left sleeve, right sleeve, pocket.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          She chose a dead link over a bad experience. That's a business owner who knows her craft.
        </p>

        {/* Highlight box */}
        <div style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid',
          borderImage: 'linear-gradient(180deg, var(--hot-magenta), var(--electric-cyan)) 1',
          padding: '24px 28px',
          margin: '32px 0',
        }}>
          <p style={{ color: 'var(--clean-white)', fontSize: '1.1rem', margin: 0 }}>
            <strong>An existing Shopify store with 224 products, 18 collections, 15 installed apps, real customers, and a live business that can't go down. You can't choose the stack. You can't redesign the schema. You have to work within Shopify's constraints — and Shopify has a LOT of constraints.</strong>
          </p>
        </div>

        <h3 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '48px 0 16px',
          color: 'var(--clean-white)',
        }}>
          The App Tax
        </h3>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Meanwhile, the app bloat. 15 apps installed. ~$75-100/month in fees. Each one solves a narrow problem. Each adds JavaScript to the page. Each is another monthly line item eating margins on $25 custom t-shirts.
        </p>

        {/* App table */}
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
                }}>App</th>
                <th style={{
                  background: 'var(--carbon-gray)',
                  color: 'var(--clean-white)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>Monthly</th>
                <th style={{
                  background: 'var(--carbon-gray)',
                  color: 'var(--clean-white)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>The Problem</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Ymq Product Options', '$12.90', 'Shopify can do size upcharges natively'],
                ['Happy Birthday Marketing', '~$20', 'Shopify Flow + a metafield does this for free'],
                ['Draftable', '$7', 'Shopify GraphQL API does this natively'],
                ['BOGOS.io Free Gift', '~$15-30', 'Requires Plus plan to replace — BLOCKED'],
                ['Yotpo Reviews', '~$30', 'Can migrate to metafields + Google reviews'],
                ['Filemonk', '$10', 'Actually needed — no native replacement'],
              ].map(([app, cost, problem], i) => (
                <tr key={i}>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: 'var(--clean-white)',
                    fontWeight: 600,
                  }}>{app}</td>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: 'var(--hot-magenta)',
                    fontWeight: 600,
                  }}>{cost}</td>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: '#B0B0B0',
                  }}>{problem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Oh, and one more constraint: Shopify <strong style={{ color: 'var(--clean-white)' }}>Basic</strong> plan. Not Plus. That means no checkout extensions, no custom Shopify Functions, no Checkout UI Extensions. Half the "recommended" solutions don't work.
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
            Heist
          </span>
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Shopify doesn't have a staging environment. You can't run a dev server. You can't hot-reload Liquid templates. The iteration cycle for building directly in Shopify is brutal.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          So the approach: build the entire custom order system in React (fast iteration, modern tooling, component reuse), then create a build pipeline that converts it into standalone JavaScript bundles that embed inside Shopify Liquid templates.
        </p>

        <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', marginBottom: '24px' }}>
          <strong>Build custom cabinets in the workshop. Install them in the existing kitchen. The kitchen doesn't know they were built with power tools.</strong>
        </p>

        {/* Three layers */}
        <div style={{
          background: 'linear-gradient(135deg, var(--carbon-gray) 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          padding: '40px',
          margin: '40px 0',
        }}>
          <h3 style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '1.25rem',
            color: 'var(--electric-cyan)',
            marginTop: 0,
            marginBottom: '24px',
          }}>
            Three Layers. One Monster.
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderLeft: '3px solid var(--electric-cyan)', paddingLeft: '20px' }}>
              <h4 style={{ color: 'var(--electric-cyan)', margin: '0 0 8px', fontSize: '0.95rem' }}>
                Layer 1: Next.js Preview Site
              </h4>
              <p style={{ color: '#AAA', margin: 0, fontSize: '0.95rem' }}>
                The design workshop. Full React app with Tailwind CSS. 24 pages, 41 components, 21,744 lines of TypeScript. Deployed to Vercel for rapid iteration and client review.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--hot-magenta)', paddingLeft: '20px' }}>
              <h4 style={{ color: 'var(--hot-magenta)', margin: '0 0 8px', fontSize: '0.95rem' }}>
                Layer 2: Vite Build Pipeline
              </h4>
              <p style={{ color: '#AAA', margin: 0, fontSize: '0.95rem' }}>
                The conversion layer. Takes the React code and builds self-contained IIFE bundles. Four "shims" translate Next.js dependencies into vanilla browser JavaScript.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--acid-lime)', paddingLeft: '20px' }}>
              <h4 style={{ color: 'var(--acid-lime)', margin: '0 0 8px', fontSize: '0.95rem' }}>
                Layer 3: Shopify Theme
              </h4>
              <p style={{ color: '#AAA', margin: 0, fontSize: '0.95rem' }}>
                The installation. 12 custom Liquid sections, 7 JSON templates, 3 CSS overrides. The React bundles mount to DOM elements created by Liquid. Shopify serves them. Customers see a seamless experience.
              </p>
            </div>
          </div>
        </div>

        <h3 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '48px 0 16px',
          color: 'var(--clean-white)',
        }}>
          The Stitches (Making React Think It's Still in Next.js)
        </h3>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Next.js has opinions. It wants its own router, its own image optimizer, its own server. Shopify has opinions too. It wants Liquid. It wants its CDN. It wants to be the only thing on the page.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Four shims make React think it's still in Next.js while actually running inside Shopify:
        </p>

        {/* Shims table */}
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
                  color: 'var(--electric-cyan)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>Next.js Module</th>
                <th style={{
                  background: 'var(--carbon-gray)',
                  color: 'var(--hot-magenta)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>Shim</th>
                <th style={{
                  background: 'var(--carbon-gray)',
                  color: 'var(--clean-white)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>What It Does</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['next/link', 'Hash-based <a> tags', 'Converts client-side nav to #/order/tops hash routing'],
                ['next/image', 'Standard <img> + CDN', 'Checks Shopify CDN URLs injected by Liquid, falls back to Vercel'],
                ['next/navigation', 'useRouter hooks', 'Hash-change listeners replace Next.js router'],
                ["'use client'", 'Stripped entirely', 'Vite plugin removes all directives — everything is client-side anyway'],
              ].map(([module, shim, desc], i) => (
                <tr key={i}>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: 'var(--electric-cyan)',
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: '0.8rem',
                  }}>{module}</td>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: '#B0B0B0',
                  }}>{shim}</td>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: '#B0B0B0',
                  }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid',
          borderImage: 'linear-gradient(180deg, var(--electric-cyan), var(--hot-magenta)) 1',
          padding: '24px 28px',
          margin: '32px 0',
        }}>
          <p style={{ color: 'var(--clean-white)', fontSize: '1.1rem', margin: 0 }}>
            <strong>The result: 21,744 lines of React that Shopify doesn't even know is React.</strong>
          </p>
        </div>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          What the Monster Can Do
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Nicole's custom order page went from "turned off" to the most sophisticated ordering experience on any Shopify Basic store:
        </p>

        <div style={{
          background: 'var(--carbon-gray)',
          padding: '32px',
          margin: '24px 0 40px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Category hub', detail: '3 sections — Custom Apparel, Sigma Gamma Rho Licensed, Other Greek Organizations' },
              { label: '4-step order flow', detail: 'Product Details → Sizing → Design Details → Review & Submit' },
              { label: '25+ product styles', detail: '6 top styles, 5 hat styles, 5 jacket styles, 5 Greek items, and more' },
              { label: 'Per-area customization', detail: 'Front, Back, Left Sleeve, Right Sleeve, Pocket — each with technique selection' },
              { label: 'Greek letter picker', detail: 'Org-specific presets with 1/2/3-layer applique color styling' },
              { label: 'Line jacket system', detail: '3-50+ jackets for Greek crossing ceremonies, CSV member import, per-member sizing, $185-$315+ packages' },
              { label: 'Pricing engine', detail: '5 bulk discount tiers (5% at 3+ through 25% at 50+) plus 75% rush surcharge' },
              { label: 'Auto-save', detail: 'Orders persist to localStorage for 7 days — critical for mobile (58% of traffic)' },
              { label: 'Shopify Draft Order API', detail: 'Submits real draft orders via GraphQL with customer matching and workflow tagging' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  color: 'var(--acid-lime)',
                  fontSize: '0.85rem',
                  fontFamily: 'Monaco, Consolas, monospace',
                  minWidth: '20px',
                }}>→</span>
                <div>
                  <span style={{ color: 'var(--clean-white)', fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</span>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}> — {item.detail}</span>
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
          Apps Replaced
        </h3>

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
                }}>App</th>
                <th style={{
                  background: 'var(--carbon-gray)',
                  color: 'var(--clean-white)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>Was Paying</th>
                <th style={{
                  background: 'var(--carbon-gray)',
                  color: 'var(--clean-white)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>What We Built</th>
                <th style={{
                  background: 'var(--carbon-gray)',
                  color: 'var(--clean-white)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>Saved</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Ymq Product Options', '$12.90/mo', 'Custom Liquid snippet for variant pricing', '$155/yr'],
                ['Birthday Marketing', '~$20/mo', 'Shopify Flow + customer metafield', '~$240/yr'],
                ['Draftable', '$7/mo', 'Draft Order API via GraphQL', '$84/yr'],
                ['Custom Order Page', '$0 (OFF)', 'Full React order system — 21,744 LOC', '$15K-40K/yr recovery'],
              ].map(([app, cost, built, saved], i) => (
                <tr key={i}>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: '#B0B0B0',
                  }}>{app}</td>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: 'var(--hot-magenta)',
                    fontWeight: 600,
                  }}>{cost}</td>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: '#B0B0B0',
                  }}>{built}</td>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: 'var(--acid-lime)',
                    fontWeight: 600,
                  }}>{saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          The Hard Parts
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          If you read my last post, you know the rule: you have to show what went wrong. Here's what almost broke this build.
        </p>

        <div style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.2)',
          padding: '24px',
          margin: '24px 0',
        }}>
          <h4 style={{ color: 'var(--hot-magenta)', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>
            shopify theme push --only deletes assets
          </h4>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem', marginBottom: '12px' }}>
            Sounds harmless. The <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>--only</code> flag should push just the matching files. Instead, the "Cleaning" step deleted every matching asset before uploading. New uploads failed silently. Every jacket image on the preview theme — all 404s.
          </p>
          <p style={{ color: 'var(--acid-lime)', fontSize: '0.9rem', margin: 0 }}>
            <strong>Fix:</strong> <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>--nodelete</code> flag on every push. Learned the expensive way.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.2)',
          padding: '24px',
          margin: '24px 0',
        }}>
          <h4 style={{ color: 'var(--hot-magenta)', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>
            The 62.5% Font-Size Trap
          </h4>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem', marginBottom: '12px' }}>
            Shopify's Spotlight theme sets <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>html {'{ font-size: 62.5% }'}</code> so their rem values resolve to nice round pixel numbers. Tailwind expects 1rem = 16px. The entire order system rendered at 62.5% correct size — buttons too small, text unreadable, spacing compressed.
          </p>
          <p style={{ color: 'var(--acid-lime)', fontSize: '0.9rem', margin: 0 }}>
            <strong>Fix:</strong> One CSS line. Three hours to find. <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>html:has(#sw-order-root) {'{ font-size: 100% !important; }'}</code>
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.2)',
          padding: '24px',
          margin: '24px 0',
        }}>
          <h4 style={{ color: 'var(--hot-magenta)', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>
            Collection Images Aren't Theme Assets
          </h4>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem', marginBottom: '12px' }}>
            Uploaded 25+ product images to <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>theme/assets/</code> — those work fine. But collection banner images live in Shopify admin on the collection object. Can't push them via CLI. 10 of 18 collections had no image set.
          </p>
          <p style={{ color: 'var(--acid-lime)', fontSize: '0.9rem', margin: 0 }}>
            <strong>Lesson:</strong> The theme worked perfectly. The data was just missing. Different problem, different solution.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.2)',
          padding: '24px',
          margin: '24px 0',
        }}>
          <h4 style={{ color: 'var(--hot-magenta)', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>
            The Image Resolution Chain
          </h4>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem', marginBottom: '12px' }}>
            React components use paths like <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>/images/category-tops.png</code>. On Vercel, that resolves to the public directory. On Shopify, that path means nothing. Built a 4-step resolution chain: Liquid generates <code style={{ background: '#1a1a1a', padding: '2px 8px', fontSize: '0.85rem' }}>window.__SW_JACKET_IMAGES__</code> → React shim checks it → falls back to Vercel → every new image requires the full pipeline.
          </p>
          <p style={{ color: 'var(--acid-lime)', fontSize: '0.9rem', margin: 0 }}>
            <strong>Pain:</strong> Had to add images to the map three separate times as we discovered missing ones.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.2)',
          padding: '24px',
          margin: '24px 0',
        }}>
          <h4 style={{ color: 'var(--hot-magenta)', marginTop: 0, marginBottom: '12px', fontSize: '1rem' }}>
            Two Different Image Arrays, One Page
          </h4>
          <p style={{ color: '#B0B0B0', fontSize: '0.95rem', marginBottom: '12px' }}>
            The order page has PRODUCT_CATEGORIES in one file and OTHER_GREEK in another. Updated the wrong array with Greek org images. Nicole caught it. Different sections, different data sources — the code structure doesn't make that obvious when you're moving fast.
          </p>
          <p style={{ color: 'var(--acid-lime)', fontSize: '0.9rem', margin: 0 }}>
            <strong>Lesson:</strong> Speed creates blind spots. Client QA catches what you miss.
          </p>
        </div>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          The Numbers
        </h2>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          margin: '40px 0',
        }}>
          {[
            { number: '21,744', label: 'Lines of Code', color: 'var(--electric-cyan)' },
            { number: '208', label: 'Custom Files', color: 'var(--hot-magenta)' },
            { number: '3.4x', label: 'Shift Multiplier', color: 'var(--acid-lime)' },
            { number: '62%', label: 'Cost Savings', color: 'var(--clean-white)' },
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
                color: stat.color,
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

        {/* Comparison */}
        <div style={{ overflowX: 'auto', margin: '32px 0' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
            minWidth: '400px',
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
                }}>Metric</th>
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
                ['Hours', '284-312', '83-89'],
                ['Duration', '14 weeks', '3 weeks'],
                ['Cost', '$42,600-$46,800', '$16,600-$17,800'],
              ].map(([metric, traditional, symbiotic], i) => (
                <tr key={i}>
                  <td style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--carbon-gray)',
                    color: 'var(--clean-white)',
                    fontWeight: 600,
                  }}>{metric}</td>
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

        <h3 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '48px 0 16px',
          color: 'var(--clean-white)',
        }}>
          Annual Impact
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          margin: '24px 0',
        }}>
          <div style={{ background: 'var(--carbon-gray)', padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--electric-cyan)' }}>$479</div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>App savings (achieved)</div>
          </div>
          <div style={{ background: 'var(--carbon-gray)', padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hot-magenta)' }}>$15K-$40K</div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>Revenue recovery (custom orders back online)</div>
          </div>
          <div style={{ background: 'var(--carbon-gray)', padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--acid-lime)' }}>$42K-$67K</div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>First-year total value</div>
          </div>
        </div>

        <h2 style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '72px 0 24px',
          color: 'var(--clean-white)',
        }}>
          Greenfield vs. Brownfield
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Scat Pack proved the <span style={{ background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SymbAIotic Shift™</span> works from zero. Clean room. Choose your tools. Build fast.
        </p>

        <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '24px' }}>
          Stitchwichs proved it works in the mess. Existing store. Existing customers. Platform constraints. App dependencies. A business owner who knew what she wanted but couldn't get it from the tools she had.
        </p>

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
              Scat Pack (Greenfield)
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Choose any stack</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Design from scratch</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>No legacy constraints</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '0' }}>24 hours to production</li>
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
              Stitchwichs (Brownfield)
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Work within Shopify</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>Renovate, don't replace</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '8px' }}>224 products, live customers</li>
              <li style={{ fontSize: '0.95rem', color: '#B0B0B0', marginBottom: '0' }}>3 weeks, 3 layers, zero downtime</li>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', marginBottom: '24px' }}>
          <strong>Every business has a version of Nicole's problem.</strong> Not a blank canvas that needs painting — a house that needs renovating. Apps stacked on apps. Workarounds on workarounds. A feature that's been turned off because the platform couldn't deliver.
        </p>

        <div style={{
          background: 'var(--carbon-gray)',
          borderLeft: '3px solid',
          borderImage: 'linear-gradient(180deg, var(--electric-cyan), var(--hot-magenta)) 1',
          padding: '24px 28px',
          margin: '32px 0',
        }}>
          <p style={{ color: 'var(--clean-white)', fontSize: '1.1rem', margin: 0 }}>
            <strong>The <span style={{ background: 'linear-gradient(90deg, var(--electric-cyan), var(--hot-magenta))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SymbAIotic Shift™</span> isn't just for greenfield dreams. It's for the businesses that already exist, already have customers, and need to get better without burning everything down.</strong>
          </p>
        </div>

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
            color: 'var(--hot-magenta)',
            marginTop: 0,
            marginBottom: '16px',
          }}>
            Why This One's Personal
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '16px' }}>
            Scat Pack was built with my son. This one was built for my sister.
          </p>
          <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '16px' }}>
            Nicole's been stitching custom apparel for years. She knows every thread weight, every applique technique, every Greek organization's color scheme. What she didn't have was a platform that matched her craft.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--clean-white)', margin: 0 }}>
            <strong>The SymbAIotic Shift™ isn't about replacing people with technology. It's about building technology that matches the people who already know what they're doing.</strong>
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

        {/* CTA */}
        <div style={{
          background: 'var(--carbon-gray)',
          border: '1px solid #333',
          padding: '60px 40px',
          textAlign: 'center',
          margin: '0 0 48px',
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
            What Would You Fix This Weekend?
          </h2>
          <p style={{ color: '#888', maxWidth: '500px', margin: '0 auto 16px' }}>
            Your Shopify store. Your SaaS idea. Your business running on spreadsheets and duct tape. Whatever it is — the tools exist now to build it right.
          </p>
          <p style={{ color: 'var(--clean-white)', marginBottom: '32px' }}>
            <strong>Greenfield or brownfield. We build both.</strong>
          </p>
          <Link href="/start" className="btn-primary" style={{
            display: 'inline-block',
            padding: '16px 48px',
          }}>
            Let's Build →
          </Link>
        </div>

        {/* Architecture Diagram */}
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
            For the Nerds: The Three-Layer Architecture
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '24px' }}>
            React → Vite → Liquid. The monster's anatomy.
          </p>

          <pre style={{
            fontFamily: 'Monaco, Consolas, monospace',
            fontSize: '0.65rem',
            color: 'var(--soft-gray)',
            overflow: 'auto',
            lineHeight: 1.5,
            margin: 0,
          }}>{`
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 1: NEXT.JS PREVIEW SITE (Vercel)                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 24 Pages │ │ 41 Comps │ │ 2 API    │ │ 2 React  │               │
│  │ + Routes │ │ + Shared │ │ Routes   │ │ Contexts │               │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘               │
│       └─────────────┴────────────┴─────────────┘                    │
│                    21,744 lines TypeScript                           │
└──────────────────────────┬───────────────────────────────────────────┘
                           │  vite build (IIFE)
┌──────────────────────────▼───────────────────────────────────────────┐
│  LAYER 2: VITE BUILD PIPELINE                                        │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐           │
│  │ sw-order-bundle│ │ sw-lj-bundle   │ │ sw-style.css   │           │
│  │ 446KB IIFE     │ │ 419KB IIFE     │ │ 43KB scoped    │           │
│  └───────┬────────┘ └───────┬────────┘ └───────┬────────┘           │
│          │                  │                   │                    │
│  4 SHIMS: next/link → hash | next/image → CDN | 'use client' → ∅   │
└──────────┬──────────────────┴───────────────────┴────────────────────┘
           │  theme push --nodelete
┌──────────▼───────────────────────────────────────────────────────────┐
│  LAYER 3: SHOPIFY THEME (Spotlight + Custom)                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │
│  │ 12 Custom   │ │ 2 React     │ │ 7 JSON      │ │ 3 CSS        │  │
│  │ sw-* Liquid │ │ Embed       │ │ Page         │ │ Override     │  │
│  │ Sections    │ │ Sections    │ │ Templates    │ │ Files        │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘  │
│  Mounts to: #sw-order-root + #sw-lj-root                            │
│  Image bridge: window.__SW_JACKET_IMAGES__ (Liquid → React)         │
└──────────────────────────────────────────────────────────────────────┘
`}</pre>

          <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ color: 'var(--electric-cyan)', fontSize: '0.8rem', marginBottom: '12px', letterSpacing: '0.1em' }}>WHAT WAS BUILT</h4>
              <ul style={{ fontSize: '0.8rem', color: '#888', paddingLeft: '16px', margin: 0, lineHeight: 1.8 }}>
                <li><strong style={{ color: '#CCC' }}>Order system:</strong> 6 categories, 25+ styles, 4-step flow</li>
                <li><strong style={{ color: '#CCC' }}>Line jacket system:</strong> Group orders 3-50+, CSV import</li>
                <li><strong style={{ color: '#CCC' }}>Greek letter picker:</strong> Org presets + color layers</li>
                <li><strong style={{ color: '#CCC' }}>Pricing engine:</strong> 5 bulk tiers + rush surcharge</li>
                <li><strong style={{ color: '#CCC' }}>Draft Order API:</strong> GraphQL → Shopify admin</li>
                <li><strong style={{ color: '#CCC' }}>Theme reskin:</strong> 12 sections + brand CSS</li>
                <li><strong style={{ color: '#CCC' }}>App replacements:</strong> 3 paid apps → custom code</li>
                <li><strong style={{ color: '#CCC' }}>Auto-save:</strong> localStorage persistence (7 days)</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--hot-magenta)', fontSize: '0.8rem', marginBottom: '12px', letterSpacing: '0.1em' }}>PRODUCT CATALOG</h4>
              <ul style={{ fontSize: '0.8rem', color: '#888', paddingLeft: '16px', margin: 0, lineHeight: 1.8 }}>
                <li>224 products across 18 collections</li>
                <li>Custom Tops (6 styles)</li>
                <li>Custom Hats (5 styles)</li>
                <li>Custom Jackets (5 styles)</li>
                <li>Greek Items (5 types)</li>
                <li>Events & Special Occasions</li>
                <li>SGRho Licensed Line</li>
                <li>Line Jacket Ceremony Packages</li>
              </ul>
            </div>
          </div>
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
              Founder & Chief Symb<span style={{ color: 'var(--electric-cyan)', fontWeight: 800, textShadow: '0 0 12px rgba(0,240,255,0.6)' }}>AI</span>ote, L7 Shift<br />
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
              href="https://www.linkedin.com/sharing/share-offsite/?url=https://l7shift.com/insights/frankensteins-theme"
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
              href="https://twitter.com/intent/tweet?text=Frankenstein%27s%20Theme%20-%20Stitching%20React%20into%20Shopify%27s%20Liquid&url=https://l7shift.com/insights/frankensteins-theme"
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

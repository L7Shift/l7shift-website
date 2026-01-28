'use client';

import React, { useState } from 'react';
import './brand-guide.css';

const brandColors = {
  voidBlack: '#0A0A0A',
  electricCyan: '#00F0FF',
  hotMagenta: '#FF00AA',
  acidLime: '#BFFF00',
  white: '#FFFFFF',
  gray: '#888888',
  darkGray: '#1A1A1A',
  mediumGray: '#2A2A2A',
};

const pages = [
  'cover',
  'contents',
  'brand-story',
  'symbiotic-shift',
  'logo-wordmark',
  'color-palette',
  'typography',
  'voice-tone',
  'service-pillars',
  'visual-language',
  'dos-donts',
  'back-cover',
];

const GradientBar = ({ className = '' }: { className?: string }) => (
  <div
    className={className}
    style={{
      height: '4px',
      background: `linear-gradient(90deg, ${brandColors.electricCyan} 0%, ${brandColors.hotMagenta} 100%)`,
      width: '100%',
    }}
  />
);

const PageNumber = ({ number, total }: { number: number; total: number }) => (
  <div
    style={{
      position: 'absolute',
      bottom: '32px',
      right: '48px',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: '12px',
      color: brandColors.gray,
      letterSpacing: '2px',
    }}
  >
    {String(number).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);

const SectionLabel = ({ children, color = brandColors.gray }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: '10px',
      fontWeight: '500',
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color,
      marginBottom: '16px',
    }}
  >
    {children}
  </div>
);

const CoverPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '48px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Decorative broken square */}
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        opacity: 0.03,
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" stroke={brandColors.white} strokeWidth="0.5">
        <path d="M10 10 L90 10 L90 40" />
        <path d="M90 60 L90 90 L10 90 L10 10" />
      </svg>
    </div>

    <div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '48px',
          fontWeight: '700',
          letterSpacing: '-1px',
          color: brandColors.white,
        }}
      >
        L7 <span style={{ fontWeight: '300' }}>SHIFT</span>
      </div>
    </div>

    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '64px',
          fontWeight: '700',
          letterSpacing: '-2px',
          lineHeight: '1.1',
          color: brandColors.white,
          marginBottom: '32px',
        }}
      >
        BREAK
        <br />
        THE
        <br />
        <span
          style={{
            background: `linear-gradient(90deg, ${brandColors.electricCyan}, ${brandColors.hotMagenta})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SQUARE
        </span>
      </div>
    </div>

    <div>
      <GradientBar />
      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: brandColors.white,
            }}
          >
            Brand Guidelines
          </div>
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '12px',
              letterSpacing: '2px',
              color: brandColors.gray,
              marginTop: '4px',
            }}
          >
            2026 Edition
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '10px',
            letterSpacing: '2px',
            color: brandColors.gray,
          }}
        >
          CONFIDENTIAL
        </div>
      </div>
    </div>
  </div>
);

const ContentsPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel>Contents</SectionLabel>

    <div style={{ marginTop: '48px' }}>
      {[
        { num: '01', title: 'Brand Story', page: '03' },
        { num: '02', title: 'The SymbAIotic Shift™', page: '04' },
        { num: '03', title: 'Logo & Wordmark', page: '05' },
        { num: '04', title: 'Color Palette', page: '06' },
        { num: '05', title: 'Typography', page: '07' },
        { num: '06', title: 'Voice & Tone', page: '08' },
        { num: '07', title: 'Service Pillars', page: '09' },
        { num: '08', title: 'Visual Language', page: '10' },
        { num: '09', title: "Do's & Don'ts", page: '11' },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            marginBottom: '20px',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          <span
            style={{
              fontSize: '12px',
              color: brandColors.electricCyan,
              width: '40px',
              letterSpacing: '1px',
            }}
          >
            {item.num}
          </span>
          <span
            style={{
              fontSize: '18px',
              color: brandColors.white,
              flex: 1,
              fontWeight: '400',
            }}
          >
            {item.title}
          </span>
          <span
            style={{
              fontSize: '12px',
              color: brandColors.gray,
              letterSpacing: '1px',
            }}
          >
            {item.page}
          </span>
        </div>
      ))}
    </div>

    <PageNumber number={2} total={12} />
  </div>
);

const BrandStoryPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.hotMagenta}>01 — Brand Story</SectionLabel>

    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '32px',
        fontWeight: '700',
        color: brandColors.white,
        marginBottom: '32px',
        lineHeight: '1.2',
      }}
    >
      L + 7 = □
    </div>

    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '15px',
        color: brandColors.white,
        lineHeight: '1.8',
        maxWidth: '500px',
        marginBottom: '32px',
      }}
    >
      <span style={{ color: brandColors.electricCyan, fontWeight: '600' }}>L7</span> is mid-century
      slang for "square" — someone who's conventional, predictable, stuck in the box.
    </div>

    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '15px',
        color: brandColors.gray,
        lineHeight: '1.8',
        maxWidth: '500px',
        marginBottom: '40px',
      }}
    >
      We exist to help businesses break from convention. To challenge the safe choice. To build
      something worth remembering.
    </div>

    <div
      style={{
        borderLeft: `2px solid ${brandColors.hotMagenta}`,
        paddingLeft: '24px',
        marginBottom: '40px',
      }}
    >
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '20px',
          fontWeight: '500',
          color: brandColors.white,
          fontStyle: 'italic',
          lineHeight: '1.6',
        }}
      >
        "Stop being square."
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '11px',
          letterSpacing: '2px',
          color: brandColors.gray,
          marginTop: '12px',
          textTransform: 'uppercase',
        }}
      >
        Brand Signature
      </div>
    </div>

    <div
      style={{
        background: brandColors.darkGray,
        padding: '24px',
        borderRadius: '2px',
      }}
    >
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '11px',
          letterSpacing: '3px',
          color: brandColors.acidLime,
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}
      >
        Our Methodology
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '18px',
          fontWeight: '600',
          color: brandColors.white,
        }}
      >
        Enabling The SymbAIotic Shift™
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '13px',
          color: brandColors.gray,
          marginTop: '8px',
          lineHeight: '1.6',
        }}
      >
        Human intelligence amplified by artificial intelligence. Not replaced. Elevated.
      </div>
    </div>

    <PageNumber number={3} total={12} />
  </div>
);

const SymbioticShiftPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.acidLime}>02 — The SymbAIotic Shift™</SectionLabel>

    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '28px',
        fontWeight: '700',
        color: brandColors.white,
        marginBottom: '24px',
        lineHeight: '1.2',
      }}
    >
      Trademark Methodology
    </div>

    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '13px',
        color: brandColors.gray,
        lineHeight: '1.7',
        maxWidth: '480px',
        marginBottom: '32px',
      }}
    >
      Our flagship methodology describes the transformation that occurs when humans and AI work in
      true partnership — not as tool and user, but as collaborators.
    </div>

    <div className="brand-grid-2">
      {[
        {
          term: 'The SymbAIotic Shift™',
          phonetic: 'sim-bye-AH-tik shift',
          def: 'Our flagship methodology describing human-AI partnership and the transformational journey.',
          color: brandColors.electricCyan,
        },
        {
          term: 'SymbAIosis™',
          phonetic: 'sim-bye-OH-sis',
          def: 'The state of effective human-AI collaboration. The destination of the Shift.',
          color: brandColors.hotMagenta,
        },
        {
          term: 'SymbAIotic™',
          phonetic: 'sim-bye-AH-tik',
          def: 'Adjective form. Describes approaches, solutions, or cultures that embody human-AI partnership.',
          color: brandColors.acidLime,
        },
        {
          term: 'SymbAIote™',
          phonetic: 'sim-bye-OAT',
          def: 'A practitioner who works symbiotically with AI. One who has completed The SymbAIotic Shift.',
          color: brandColors.white,
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            background: brandColors.darkGray,
            padding: '20px',
            borderLeft: `3px solid ${item.color}`,
          }}
        >
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '15px',
              fontWeight: '600',
              color: item.color,
              marginBottom: '4px',
            }}
          >
            {item.term}
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              color: brandColors.gray,
              marginBottom: '8px',
              opacity: 0.7,
              letterSpacing: '0.5px',
            }}
          >
            /{item.phonetic}/
          </div>
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '12px',
              color: brandColors.gray,
              lineHeight: '1.6',
            }}
          >
            {item.def}
          </div>
        </div>
      ))}
    </div>

    <div
      style={{
        marginTop: '24px',
        padding: '16px',
        background: `linear-gradient(90deg, ${brandColors.darkGray} 0%, transparent 100%)`,
        borderLeft: `1px solid ${brandColors.gray}`,
      }}
    >
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: brandColors.hotMagenta,
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}
      >
        Usage Note
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '12px',
          color: brandColors.gray,
          lineHeight: '1.6',
        }}
      >
        Always use ™ on first reference in any document. Note the intentional "AI" capitalization
        within each term — this is a core brand element.
      </div>
    </div>

    <PageNumber number={4} total={12} />
  </div>
);

const LogoPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.electricCyan}>03 — Logo & Wordmark</SectionLabel>

    <div className="brand-flex-row" style={{ marginTop: '24px' }}>
      <div
        style={{
          flex: 1,
          background: brandColors.darkGray,
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '40px',
            fontWeight: '700',
            color: brandColors.white,
          }}
        >
          L7 <span style={{ fontWeight: '300' }}>SHIFT</span>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          background: brandColors.white,
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '40px',
            fontWeight: '700',
            color: brandColors.voidBlack,
          }}
        >
          L7 <span style={{ fontWeight: '300' }}>SHIFT</span>
        </div>
      </div>
    </div>

    <div
      style={{
        marginTop: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '10px',
            letterSpacing: '2px',
            color: brandColors.gray,
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          Primary
        </div>
        <div
          style={{
            background: brandColors.voidBlack,
            border: `1px solid ${brandColors.mediumGray}`,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '20px',
              fontWeight: '700',
              color: brandColors.white,
            }}
          >
            L7 <span style={{ fontWeight: '300' }}>SHIFT</span>
          </span>
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '10px',
            letterSpacing: '2px',
            color: brandColors.gray,
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          Gradient
        </div>
        <div
          style={{
            background: brandColors.voidBlack,
            border: `1px solid ${brandColors.mediumGray}`,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '20px',
              fontWeight: '700',
              background: `linear-gradient(90deg, ${brandColors.electricCyan}, ${brandColors.hotMagenta})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            L7 <span style={{ fontWeight: '300' }}>SHIFT</span>
          </span>
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '10px',
            letterSpacing: '2px',
            color: brandColors.gray,
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          Monochrome
        </div>
        <div
          style={{
            background: brandColors.white,
            border: `1px solid ${brandColors.mediumGray}`,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '20px',
              fontWeight: '700',
              color: brandColors.voidBlack,
            }}
          >
            L7 <span style={{ fontWeight: '300' }}>SHIFT</span>
          </span>
        </div>
      </div>
    </div>

    <div
      style={{
        marginTop: '24px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '12px',
        color: brandColors.gray,
        lineHeight: '1.7',
      }}
    >
      <strong style={{ color: brandColors.white }}>Clear Space:</strong> Minimum clear space around
      logo equals the height of the "L" character.
      <br />
      <strong style={{ color: brandColors.white }}>Minimum Size:</strong> 80px width for digital,
      20mm for print.
    </div>

    <PageNumber number={5} total={12} />
  </div>
);

const ColorPalettePage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.hotMagenta}>04 — Color Palette</SectionLabel>

    <div className="brand-grid-2">
      {[
        {
          name: 'Void Black',
          hex: '#0A0A0A',
          rgb: 'RGB 10, 10, 10',
          usage: 'Primary background',
          bg: brandColors.voidBlack,
          border: true,
        },
        {
          name: 'Electric Cyan',
          hex: '#00F0FF',
          rgb: 'RGB 0, 240, 255',
          usage: 'BUILD pillar, technology',
          bg: brandColors.electricCyan,
        },
        {
          name: 'Hot Magenta',
          hex: '#FF00AA',
          rgb: 'RGB 255, 0, 170',
          usage: 'BRAND pillar, strategy',
          bg: brandColors.hotMagenta,
        },
        {
          name: 'Acid Lime',
          hex: '#BFFF00',
          rgb: 'RGB 191, 255, 0',
          usage: 'SHIFT pillar, transformation',
          bg: brandColors.acidLime,
        },
      ].map((color, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: color.bg,
              border: color.border ? `1px solid ${brandColors.mediumGray}` : 'none',
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '14px',
                fontWeight: '600',
                color: brandColors.white,
                marginBottom: '4px',
              }}
            >
              {color.name}
            </div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '11px',
                color: brandColors.gray,
                marginBottom: '2px',
              }}
            >
              {color.hex}
            </div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: brandColors.gray,
                marginBottom: '6px',
              }}
            >
              {color.rgb}
            </div>
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '10px',
                color: brandColors.gray,
              }}
            >
              {color.usage}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: brandColors.gray,
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}
      >
        Gradient Applications
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div
          style={{
            flex: 1,
            height: '48px',
            background: `linear-gradient(90deg, ${brandColors.electricCyan}, ${brandColors.hotMagenta})`,
          }}
        />
        <div
          style={{
            flex: 1,
            height: '48px',
            background: `linear-gradient(90deg, ${brandColors.hotMagenta}, ${brandColors.acidLime})`,
          }}
        />
        <div
          style={{
            flex: 1,
            height: '48px',
            background: `linear-gradient(90deg, ${brandColors.electricCyan}, ${brandColors.hotMagenta}, ${brandColors.acidLime})`,
          }}
        />
      </div>
    </div>

    <PageNumber number={6} total={12} />
  </div>
);

const TypographyPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.electricCyan}>05 — Typography</SectionLabel>

    <div style={{ marginBottom: '32px' }}>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: brandColors.electricCyan,
          marginBottom: '16px',
          textTransform: 'uppercase',
        }}
      >
        Primary — Helvetica Neue
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '48px',
          fontWeight: '700',
          color: brandColors.white,
          lineHeight: '1',
          marginBottom: '8px',
        }}
      >
        Break The Square
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '48px',
          fontWeight: '300',
          color: brandColors.white,
          lineHeight: '1',
        }}
      >
        Break The Square
      </div>
      <div
        style={{
          marginTop: '16px',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '11px',
          color: brandColors.gray,
        }}
      >
        Used for headlines, wordmarks, and high-impact display text. Bold (700) and Light (300)
        weights.
      </div>
    </div>

    <div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: brandColors.hotMagenta,
          marginBottom: '16px',
          textTransform: 'uppercase',
        }}
      >
        Secondary — Inter
      </div>
      <div
        style={{
          fontFamily: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '16px',
          fontWeight: '400',
          color: brandColors.white,
          lineHeight: '1.6',
          maxWidth: '450px',
          marginBottom: '12px',
        }}
      >
        We believe in the power of human-AI collaboration to transform businesses, accelerate
        innovation, and create meaningful competitive advantage.
      </div>
      <div
        style={{
          fontFamily: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '11px',
          color: brandColors.gray,
        }}
      >
        Used for body copy, UI elements, and extended reading. Regular (400) and Medium (500)
        weights.
      </div>
    </div>

    <div
      style={{
        marginTop: '24px',
        padding: '16px',
        background: brandColors.darkGray,
      }}
    >
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: brandColors.gray,
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}
      >
        Type Scale
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {[
          { size: '48px', label: 'H1' },
          { size: '32px', label: 'H2' },
          { size: '24px', label: 'H3' },
          { size: '16px', label: 'Body' },
          { size: '12px', label: 'Small' },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: item.size,
                fontWeight: '700',
                color: brandColors.white,
                lineHeight: '1',
              }}
            >
              Aa
            </div>
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '9px',
                color: brandColors.gray,
                marginTop: '8px',
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>

    <PageNumber number={7} total={12} />
  </div>
);

const VoiceTonePage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.acidLime}>06 — Voice & Tone</SectionLabel>

    <div className="brand-grid-2" style={{ marginTop: '16px' }}>
      {[
        {
          trait: 'Bold',
          desc: 'We make statements, not suggestions. Confidence without arrogance.',
          color: brandColors.electricCyan,
        },
        {
          trait: 'Sharp',
          desc: 'Every word earns its place. Precise, clear, no fluff.',
          color: brandColors.hotMagenta,
        },
        {
          trait: 'Rebellious',
          desc: 'We challenge convention. Question the status quo. Push boundaries.',
          color: brandColors.acidLime,
        },
        {
          trait: 'Human',
          desc: 'Technology serves people. We never forget the human element.',
          color: brandColors.white,
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            padding: '20px',
            borderLeft: `3px solid ${item.color}`,
            background: brandColors.darkGray,
          }}
        >
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '20px',
              fontWeight: '700',
              color: item.color,
              marginBottom: '8px',
            }}
          >
            {item.trait}
          </div>
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '13px',
              color: brandColors.gray,
              lineHeight: '1.6',
            }}
          >
            {item.desc}
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: brandColors.gray,
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}
      >
        We Never Say
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '13px',
          color: brandColors.gray,
          lineHeight: '2',
        }}
      >
        <span style={{ textDecoration: 'line-through', color: '#555' }}>Synergy</span> ·{' '}
        <span style={{ textDecoration: 'line-through', color: '#555' }}>Leverage</span> ·{' '}
        <span style={{ textDecoration: 'line-through', color: '#555' }}>Best-in-class</span> ·{' '}
        <span style={{ textDecoration: 'line-through', color: '#555' }}>Move the needle</span> ·{' '}
        <span style={{ textDecoration: 'line-through', color: '#555' }}>Circle back</span> ·{' '}
        <span style={{ textDecoration: 'line-through', color: '#555' }}>Low-hanging fruit</span>
      </div>
    </div>

    <PageNumber number={8} total={12} />
  </div>
);

const ServicePillarsPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.electricCyan}>07 — Service Pillars</SectionLabel>

    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '14px',
        color: brandColors.gray,
        marginBottom: '24px',
        lineHeight: '1.6',
      }}
    >
      Our tagline <strong style={{ color: brandColors.white }}>Strategy. Systems. Solutions.</strong>{' '}
      maps directly to our three service pillars, each with its own signature color.
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[
        {
          name: 'BUILD',
          color: brandColors.electricCyan,
          tagline: 'Technology, development, code',
          desc: 'We build the systems that power transformation. Clean code, scalable architecture, AI integration.',
          services: ['Embedded Symbiosis', 'Custom Development', 'AI Implementation'],
        },
        {
          name: 'BRAND',
          color: brandColors.hotMagenta,
          tagline: 'Strategy, identity, marketing',
          desc: 'We craft the strategy and identity that makes you memorable. Positioning that cuts through noise.',
          services: ['SymbAIotic Strategy Sessions', 'Brand Identity', 'Digital Presence'],
        },
        {
          name: 'SHIFT',
          color: brandColors.acidLime,
          tagline: 'Transformation, results, growth',
          desc: 'We enable the transformation. Training teams, changing culture, delivering measurable outcomes.',
          services: ['SymbAIote Enablement', 'Change Management', 'Performance Optimization'],
        },
      ].map((pillar, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            background: brandColors.darkGray,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '80px',
              background: pillar.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '14px',
                fontWeight: '700',
                color: brandColors.voidBlack,
                transform: 'rotate(-90deg)',
                letterSpacing: '2px',
              }}
            >
              {pillar.name}
            </div>
          </div>
          <div style={{ padding: '16px', flex: 1 }}>
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '11px',
                color: pillar.color,
                marginBottom: '6px',
              }}
            >
              {pillar.tagline}
            </div>
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '12px',
                color: brandColors.gray,
                lineHeight: '1.5',
                marginBottom: '10px',
              }}
            >
              {pillar.desc}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {pillar.services.map((service, j) => (
                <span
                  key={j}
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: '9px',
                    letterSpacing: '1px',
                    padding: '4px 8px',
                    border: `1px solid ${pillar.color}`,
                    color: pillar.color,
                  }}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

    <PageNumber number={9} total={12} />
  </div>
);

const VisualLanguagePage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.hotMagenta}>08 — Visual Language</SectionLabel>

    <div className="brand-grid-2">
      <div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '10px',
            letterSpacing: '2px',
            color: brandColors.gray,
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          The Broken Square
        </div>
        <div
          style={{
            background: brandColors.darkGray,
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '120px',
          }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <path
              d="M10 10 L90 10 L90 40"
              stroke={brandColors.electricCyan}
              strokeWidth="3"
              strokeLinecap="square"
            />
            <path
              d="M90 60 L90 90 L10 90 L10 10"
              stroke={brandColors.hotMagenta}
              strokeWidth="3"
              strokeLinecap="square"
            />
          </svg>
        </div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '11px',
            color: brandColors.gray,
            marginTop: '8px',
            lineHeight: '1.5',
          }}
        >
          Our signature visual motif. A square that refuses to close — symbolizing breaking from
          convention.
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '10px',
            letterSpacing: '2px',
            color: brandColors.gray,
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          Gradient Bar
        </div>
        <div
          style={{
            background: brandColors.darkGray,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '120px',
            gap: '12px',
          }}
        >
          <div
            style={{
              height: '4px',
              background: `linear-gradient(90deg, ${brandColors.electricCyan}, ${brandColors.hotMagenta})`,
            }}
          />
          <div
            style={{
              height: '8px',
              background: `linear-gradient(90deg, ${brandColors.electricCyan}, ${brandColors.hotMagenta}, ${brandColors.acidLime})`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '11px',
            color: brandColors.gray,
            marginTop: '8px',
            lineHeight: '1.5',
          }}
        >
          Used as a section divider and brand accent. Connects our pillar colors into a unified
          element.
        </div>
      </div>
    </div>

    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '10px',
          letterSpacing: '2px',
          color: brandColors.gray,
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}
      >
        Imagery Style
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {[
          { label: 'Dark & Atmospheric', desc: 'Moody, dramatic lighting' },
          { label: 'High Contrast', desc: 'Bold color pops on dark' },
          { label: 'Abstract Tech', desc: 'Data, networks, flows' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: brandColors.darkGray,
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '12px',
                fontWeight: '600',
                color: brandColors.white,
                marginBottom: '4px',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '10px',
                color: brandColors.gray,
              }}
            >
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>

    <PageNumber number={10} total={12} />
  </div>
);

const DosDontsPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      padding: '48px',
      position: 'relative',
    }}
  >
    <SectionLabel color={brandColors.acidLime}>09 — Do&apos;s & Don&apos;ts</SectionLabel>

    <div className="brand-grid-2" style={{ gap: '24px' }}>
      <div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '16px',
            fontWeight: '700',
            color: brandColors.acidLime,
            marginBottom: '16px',
          }}
        >
          ✓ Do
        </div>
        {[
          'Use ™ on first reference to trademarked terms',
          'Maintain the AI capitalization in SymbAIosis',
          'Use dark backgrounds as default',
          'Apply gradient bar as section dividers',
          'Keep language direct and bold',
          'Use pillar colors intentionally',
        ].map((item, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '12px',
              color: brandColors.gray,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `2px solid ${brandColors.acidLime}`,
              lineHeight: '1.5',
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div>
        <div
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '16px',
            fontWeight: '700',
            color: brandColors.hotMagenta,
            marginBottom: '16px',
          }}
        >
          ✗ Don&apos;t
        </div>
        {[
          'Use light backgrounds as primary',
          'Write "Symbiosis" without the AI styling',
          'Use corporate jargon or buzzwords',
          'Apply logo on busy backgrounds',
          'Mix pillar colors randomly',
          'Forget the trademark symbols',
        ].map((item, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '12px',
              color: brandColors.gray,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `2px solid ${brandColors.hotMagenta}`,
              lineHeight: '1.5',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>

    <div
      style={{
        marginTop: '24px',
        padding: '16px',
        background: brandColors.darkGray,
        borderLeft: `3px solid ${brandColors.electricCyan}`,
      }}
    >
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '12px',
          fontWeight: '600',
          color: brandColors.white,
          marginBottom: '6px',
        }}
      >
        Remember
      </div>
      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '12px',
          color: brandColors.gray,
          lineHeight: '1.6',
        }}
      >
        Every touchpoint should feel intentional, premium, and slightly rebellious. If it feels safe
        or generic, it&apos;s not L7.
      </div>
    </div>

    <PageNumber number={11} total={12} />
  </div>
);

const BackCoverPage = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: brandColors.voidBlack,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}
  >
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '48px',
        fontWeight: '700',
        color: brandColors.white,
        marginBottom: '24px',
      }}
    >
      L7 <span style={{ fontWeight: '300' }}>SHIFT</span>
    </div>

    <GradientBar />

    <div
      style={{
        marginTop: '32px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '14px',
        letterSpacing: '4px',
        color: brandColors.gray,
        textTransform: 'uppercase',
      }}
    >
      Strategy. Systems. Solutions.
    </div>

    <div
      style={{
        marginTop: '48px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '12px',
        color: brandColors.gray,
      }}
    >
      l7shift.com
    </div>

    <div
      style={{
        position: 'absolute',
        bottom: '32px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '10px',
        letterSpacing: '2px',
        color: brandColors.gray,
        textAlign: 'center',
      }}
    >
      © 2026 L7 Shift. All rights reserved.
      <br />
      <span style={{ fontSize: '9px', marginTop: '4px', display: 'block' }}>
        The SymbAIotic Shift™, SymbAIosis™, SymbAIotic™, and SymbAIote™ are trademarks of L7 Shift.
      </span>
    </div>
  </div>
);

const pageComponents: Record<string, React.FC> = {
  cover: CoverPage,
  contents: ContentsPage,
  'brand-story': BrandStoryPage,
  'symbiotic-shift': SymbioticShiftPage,
  'logo-wordmark': LogoPage,
  'color-palette': ColorPalettePage,
  typography: TypographyPage,
  'voice-tone': VoiceTonePage,
  'service-pillars': ServicePillarsPage,
  'visual-language': VisualLanguagePage,
  'dos-donts': DosDontsPage,
  'back-cover': BackCoverPage,
};

const pageLabels: Record<string, string> = {
  cover: 'Cover',
  contents: 'Contents',
  'brand-story': 'Brand Story',
  'symbiotic-shift': 'SymbAIotic Shift™',
  'logo-wordmark': 'Logo',
  'color-palette': 'Colors',
  typography: 'Typography',
  'voice-tone': 'Voice & Tone',
  'service-pillars': 'Pillars',
  'visual-language': 'Visual',
  'dos-donts': "Do's & Don'ts",
  'back-cover': 'Back',
};

export default function BrandGuidePage() {
  const [currentPage, setCurrentPage] = useState(0);

  const PageComponent = pageComponents[pages[currentPage]];

  return (
    <div
      className="brand-guide-page"
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Navigation */}
      <div className="brand-guide-nav">
        {pages.map((page, i) => (
          <button
            key={page}
            onClick={() => setCurrentPage(i)}
            style={{
              padding: '8px 12px',
              background: currentPage === i ? brandColors.darkGray : 'transparent',
              border: `1px solid ${currentPage === i ? brandColors.electricCyan : brandColors.mediumGray}`,
              color: currentPage === i ? brandColors.electricCyan : brandColors.gray,
              cursor: 'pointer',
              fontSize: '10px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
            }}
          >
            {pageLabels[page]}
          </button>
        ))}
      </div>

      {/* Page Container */}
      <div
        className="brand-guide-doc"
        style={{
          background: brandColors.voidBlack,
          boxShadow: '0 20px 60px rgba(0, 240, 255, 0.1), 0 10px 30px rgba(255, 0, 170, 0.05)',
        }}
      >
        <PageComponent />
      </div>

      {/* Page Navigation Arrows */}
      <div className="brand-guide-arrows">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          style={{
            padding: '12px 24px',
            background: currentPage === 0 ? brandColors.darkGray : 'transparent',
            border: `1px solid ${currentPage === 0 ? brandColors.mediumGray : brandColors.electricCyan}`,
            color: currentPage === 0 ? brandColors.mediumGray : brandColors.electricCyan,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            letterSpacing: '2px',
          }}
        >
          ← PREV
        </button>
        <span
          style={{
            color: brandColors.gray,
            fontSize: '12px',
            letterSpacing: '1px',
          }}
        >
          {currentPage + 1} / {pages.length}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
          disabled={currentPage === pages.length - 1}
          style={{
            padding: '12px 24px',
            background: currentPage === pages.length - 1 ? brandColors.darkGray : 'transparent',
            border: `1px solid ${currentPage === pages.length - 1 ? brandColors.mediumGray : brandColors.hotMagenta}`,
            color: currentPage === pages.length - 1 ? brandColors.mediumGray : brandColors.hotMagenta,
            cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            letterSpacing: '2px',
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}

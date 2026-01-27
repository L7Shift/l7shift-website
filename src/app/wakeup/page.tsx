'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WakeupPage() {
  const router = useRouter()
  const [phase, setPhase] = useState(0)
  // 0: black screen
  // 1: "Wake up..." typing
  // 2: "Fast or good?" typing
  // 3: glitch transition
  // 4: "YES." reveal
  // 5: redirect to home

  const [typedText1, setTypedText1] = useState('')
  const [typedText2, setTypedText2] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [glitchIntensity, setGlitchIntensity] = useState(0)

  const text1 = 'Wake up...'
  const text2 = 'Fast or good?'

  // Prefetch home page for instant redirect
  useEffect(() => {
    router.prefetch('/')
  }, [router])

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530)
    return () => clearInterval(interval)
  }, [])

  // Typing sequence
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Start after brief pause
    timers.push(setTimeout(() => setPhase(1), 800))

    // Type first line
    text1.split('').forEach((_, i) => {
      timers.push(setTimeout(() => {
        setTypedText1(text1.slice(0, i + 1))
      }, 800 + i * 80))
    })

    // Pause, then type second line
    timers.push(setTimeout(() => setPhase(2), 800 + text1.length * 80 + 1200))

    text2.split('').forEach((_, i) => {
      timers.push(setTimeout(() => {
        setTypedText2(text2.slice(0, i + 1))
      }, 800 + text1.length * 80 + 1200 + i * 60))
    })

    // Glitch transition
    const glitchStart = 800 + text1.length * 80 + 1200 + text2.length * 60 + 1500
    timers.push(setTimeout(() => {
      setPhase(3)
      // Ramp up glitch
      let intensity = 0
      const glitchInterval = setInterval(() => {
        intensity += 0.1
        setGlitchIntensity(intensity)
        if (intensity >= 1) {
          clearInterval(glitchInterval)
          setTimeout(() => setPhase(4), 200)
        }
      }, 50)
    }, glitchStart))

    // Redirect to home after reveal
    timers.push(setTimeout(() => router.push('/'), glitchStart + 4500))

    return () => timers.forEach(t => clearTimeout(t))
  }, [router])

  const voidBlack = '#0A0A0A'
  const cyan = '#00F0FF'
  const magenta = '#FF00AA'
  const lime = '#BFFF00'

  // Skip intro handler
  const skipIntro = () => router.push('/')

  return (
    <div
      className="intro-page"
      style={{
        minHeight: '100vh',
        background: voidBlack,
        color: '#FAFAFA',
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* No header during animation - homepage has it */}

      {/* Intro Animation */}
      {phase < 5 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: voidBlack,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            cursor: 'pointer',
          }}
          onClick={skipIntro}
        >
          {/* Skip hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              fontSize: '12px',
              color: '#333',
              letterSpacing: '0.1em',
            }}
          >
            CLICK TO SKIP
          </div>

          {/* Glitch overlay */}
          {phase === 3 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 240, 255, ${glitchIntensity * 0.1}) 2px,
                    rgba(0, 240, 255, ${glitchIntensity * 0.1}) 4px
                  )
                `,
                pointerEvents: 'none',
                animation: 'scanline 0.1s linear infinite',
              }}
            />
          )}

          {/* Typing text */}
          {(phase === 1 || phase === 2) && (
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 'clamp(18px, 4vw, 28px)',
                  color: lime,
                  marginBottom: '24px',
                  minHeight: '36px',
                }}
              >
                {typedText1}
                {phase === 1 && showCursor && <span style={{ opacity: 0.8 }}>_</span>}
              </p>
              {phase >= 2 && (
                <p
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 'clamp(20px, 5vw, 36px)',
                    color: cyan,
                    minHeight: '44px',
                  }}
                >
                  {typedText2}
                  {phase === 2 && showCursor && <span style={{ opacity: 0.8 }}>_</span>}
                </p>
              )}
            </div>
          )}

          {/* Big reveal - SymbAIotic Shift with merge effect */}
          {phase === 4 && (
            <div
              style={{
                textAlign: 'center',
                padding: '0 20px',
                animation: 'glitchReveal 0.5s ease-out forwards',
                position: 'relative',
              }}
            >
              {/* Symbiotic energy orbs */}
              <div className="symbiotic-orbs">
                <div className="orb orb-cyan" />
                <div className="orb orb-magenta" />
                <div className="orb orb-lime" />
              </div>

              {/* Intertwining strands behind text */}
              <div className="symbiotic-strands">
                <div className="strand strand-1" />
                <div className="strand strand-2" />
                <div className="strand strand-3" />
              </div>

              {/* YES */}
              <h1
                className="yes-text"
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: 'clamp(64px, 20vw, 180px)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#fff',
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                YES
              </h1>

              {/* That's the SymbAIotic Shift */}
              <div
                className="symbiotic-tagline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: 'clamp(18px, 3vw, 32px)',
                    fontWeight: 400,
                    color: 'var(--soft-gray)',
                    letterSpacing: '0.05em',
                  }}
                >
                  That's the
                </span>
                <span
                  className="symbiotic-text"
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: 'clamp(24px, 5vw, 48px)',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    position: 'relative',
                    color: '#fff',
                  }}
                >
                  Symb
                  <span
                    className="ai-highlight"
                    style={{
                      fontWeight: 900,
                      position: 'relative',
                    }}
                  >
                    AI
                  </span>
                  otic Shift
                  <sup
                    style={{
                      fontSize: '0.4em',
                      color: 'var(--soft-gray)',
                      marginLeft: '4px',
                      verticalAlign: 'super',
                    }}
                  >
                    ™
                  </sup>
                </span>
              </div>

              {/* Animated gradient line with pulse */}
              <div className="gradient-line-container">
                <div className="gradient-line" />
                <div className="gradient-line-glow" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes glitchReveal {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
            filter: blur(20px);
          }
          40% {
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* YES text mega glow */
        .yes-text {
          animation: yesGlow 1.5s ease-in-out infinite, yesFloat 3s ease-in-out infinite;
          text-shadow:
            0 0 20px ${cyan},
            0 0 40px ${cyan},
            0 0 60px ${magenta},
            0 0 80px ${magenta},
            0 0 100px ${lime};
        }

        @keyframes yesGlow {
          0%, 100% {
            text-shadow:
              0 0 20px ${cyan},
              0 0 40px ${cyan},
              0 0 60px ${magenta},
              0 0 80px ${magenta},
              0 0 100px ${lime};
          }
          50% {
            text-shadow:
              0 0 40px ${cyan},
              0 0 80px ${cyan},
              0 0 120px ${magenta},
              0 0 160px ${magenta},
              0 0 200px ${lime};
          }
        }

        @keyframes yesFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* Symbiotic orbs - energy spheres that merge */
        .symbiotic-orbs {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          z-index: 0;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: orbMerge 3s ease-in-out infinite;
        }

        .orb-cyan {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, ${cyan} 0%, transparent 70%);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-magenta {
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, ${magenta} 0%, transparent 70%);
          top: 30%;
          right: 10%;
          animation-delay: 0.5s;
        }

        .orb-lime {
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, ${lime} 0%, transparent 70%);
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 1s;
        }

        @keyframes orbMerge {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(calc(50% - 100px), calc(50% - 100px)) scale(0.8);
            opacity: 0.9;
          }
        }

        .orb-lime {
          animation: orbMergeLime 3s ease-in-out infinite 1s;
        }

        @keyframes orbMergeLime {
          0%, 100% {
            transform: translateX(-50%) translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateX(-50%) translate(0, -50px) scale(0.8);
            opacity: 0.9;
          }
        }

        /* Intertwining strands */
        .symbiotic-strands {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 300px;
          z-index: 1;
          overflow: hidden;
        }

        .strand {
          position: absolute;
          width: 100%;
          height: 4px;
          top: 50%;
          left: -100%;
          animation: strandFlow 2s ease-out forwards;
        }

        .strand-1 {
          background: linear-gradient(90deg, transparent, ${cyan}, ${cyan}, transparent);
          animation-delay: 0.2s;
          transform: translateY(-20px);
        }

        .strand-2 {
          background: linear-gradient(90deg, transparent, ${magenta}, ${magenta}, transparent);
          animation-delay: 0.4s;
          transform: translateY(0);
        }

        .strand-3 {
          background: linear-gradient(90deg, transparent, ${lime}, ${lime}, transparent);
          animation-delay: 0.6s;
          transform: translateY(20px);
        }

        @keyframes strandFlow {
          0% {
            left: -100%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        /* AI highlight with shimmer */
        .ai-highlight {
          background: linear-gradient(
            135deg,
            ${cyan} 0%,
            ${magenta} 50%,
            ${cyan} 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: aiShimmer 2s ease-in-out infinite;
        }

        @keyframes aiShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Symbiotic text glow */
        .symbiotic-text {
          animation: symbioticPulse 2s ease-in-out infinite;
        }

        @keyframes symbioticPulse {
          0%, 100% {
            text-shadow:
              0 0 10px rgba(0,240,255,0.3),
              0 0 20px rgba(255,0,170,0.2);
          }
          50% {
            text-shadow:
              0 0 20px rgba(0,240,255,0.6),
              0 0 40px rgba(255,0,170,0.4),
              0 0 60px rgba(191,255,0,0.2);
          }
        }

        /* Tagline fade in */
        .symbiotic-tagline {
          animation: taglineFade 1s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        @keyframes taglineFade {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Gradient line with glow */
        .gradient-line-container {
          position: relative;
          width: 300px;
          height: 6px;
          margin: 32px auto 0;
          animation: lineFade 1s ease-out forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }

        @keyframes lineFade {
          0% {
            opacity: 0;
            width: 0;
          }
          100% {
            opacity: 1;
            width: 300px;
          }
        }

        .gradient-line {
          position: absolute;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, ${cyan}, ${magenta}, ${lime});
          background-size: 200% 100%;
          animation: gradientFlow 2s ease-in-out infinite;
        }

        .gradient-line-glow {
          position: absolute;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, ${cyan}, ${magenta}, ${lime});
          background-size: 200% 100%;
          animation: gradientFlow 2s ease-in-out infinite, glowPulse 1.5s ease-in-out infinite;
          filter: blur(8px);
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  )
}

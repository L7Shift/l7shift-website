import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'L7 Shift - Strategy. Systems. Solutions.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Gradient glow effects */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0,240,255,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,0,170,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontSize: '120px',
                fontWeight: 500,
                color: '#FAFAFA',
                fontFamily: 'Helvetica',
                letterSpacing: '-0.02em',
              }}
            >
              L7
            </span>
            <span
              style={{
                fontSize: '120px',
                fontWeight: 700,
                color: '#FAFAFA',
                fontFamily: 'Helvetica',
                letterSpacing: '-0.02em',
              }}
            >
              SHIFT
            </span>
          </div>

          {/* Gradient bar */}
          <div
            style={{
              width: '500px',
              height: '6px',
              background: 'linear-gradient(90deg, #00F0FF 0%, #FF00AA 50%, #BFFF00 100%)',
              marginBottom: '32px',
            }}
          />

          {/* Tagline */}
          <span
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#E5E5E5',
              letterSpacing: '0.3em',
              fontFamily: 'Helvetica',
            }}
          >
            STRATEGY • SYSTEMS • SOLUTIONS
          </span>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              color: '#888',
              fontFamily: 'Helvetica',
              letterSpacing: '0.1em',
            }}
          >
            BREAK THE SQUARE
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

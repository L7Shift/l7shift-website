import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Glitch layer - cyan shifted left */}
        <div
          style={{
            position: 'absolute',
            width: 110,
            height: 110,
            border: '8px solid #00F0FF',
            opacity: 0.6,
            left: 27,
            top: 35,
          }}
        />
        {/* Glitch layer - magenta shifted right */}
        <div
          style={{
            position: 'absolute',
            width: 110,
            height: 110,
            border: '8px solid #FF00AA',
            opacity: 0.6,
            left: 43,
            top: 35,
          }}
        />
        {/* Main gradient square */}
        <div
          style={{
            width: 110,
            height: 110,
            background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Inner cutout to make it a square outline */}
          <div
            style={{
              width: 94,
              height: 94,
              background: '#0A0A0A',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

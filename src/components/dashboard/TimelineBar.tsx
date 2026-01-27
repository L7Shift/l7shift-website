'use client'

interface TimelinePhase {
  name: string
  status: 'completed' | 'active' | 'upcoming'
}

interface TimelineBarProps {
  phases: TimelinePhase[]
  currentPhase?: number
  startDate?: string
  endDate?: string
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const statusColors = {
  completed: '#BFFF00',
  active: '#00F0FF',
  upcoming: 'rgba(255, 255, 255, 0.2)',
}

const sizes = {
  sm: { height: 6, fontSize: 10, gap: 4 },
  md: { height: 10, fontSize: 12, gap: 6 },
  lg: { height: 14, fontSize: 14, gap: 8 },
}

export function TimelineBar({
  phases,
  currentPhase,
  startDate,
  endDate,
  showLabels = true,
  size = 'md',
}: TimelineBarProps) {
  const sizeConfig = sizes[size]
  const completedCount = phases.filter(p => p.status === 'completed').length
  const progressPercentage = ((completedCount + (currentPhase !== undefined ? 0.5 : 0)) / phases.length) * 100

  return (
    <div style={{ width: '100%' }}>
      {/* Dates header */}
      {(startDate || endDate) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
            fontSize: 11,
            color: '#888',
          }}
        >
          {startDate && <span>Start: {startDate}</span>}
          {endDate && <span>Target: {endDate}</span>}
        </div>
      )}

      {/* Progress bar container */}
      <div
        style={{
          position: 'relative',
          height: sizeConfig.height,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: sizeConfig.height / 2,
          overflow: 'hidden',
        }}
      >
        {/* Gradient progress fill */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progressPercentage}%`,
            background: 'linear-gradient(90deg, #BFFF00, #00F0FF)',
            borderRadius: sizeConfig.height / 2,
            transition: 'width 0.5s ease-out',
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)',
          }}
        />

        {/* Phase markers */}
        {phases.map((_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: `${((index + 1) / phases.length) * 100}%`,
              transform: 'translateX(-50%)',
              width: 2,
              height: '100%',
              background: 'rgba(10, 10, 10, 0.5)',
            }}
          />
        ))}
      </div>

      {/* Phase labels */}
      {showLabels && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: sizeConfig.gap,
          }}
        >
          {phases.map((phase, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: index === 0 ? 'flex-start' : index === phases.length - 1 ? 'flex-end' : 'center',
                flex: 1,
              }}
            >
              {/* Status dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: statusColors[phase.status],
                  marginBottom: 4,
                  boxShadow: phase.status === 'active'
                    ? `0 0 8px ${statusColors[phase.status]}`
                    : 'none',
                  animation: phase.status === 'active' ? 'pulseDot 2s infinite' : 'none',
                }}
              />
              {/* Phase name */}
              <span
                style={{
                  fontSize: sizeConfig.fontSize,
                  color: phase.status === 'upcoming' ? '#666' : '#FAFAFA',
                  fontWeight: phase.status === 'active' ? 600 : 400,
                  textAlign: index === 0 ? 'left' : index === phases.length - 1 ? 'right' : 'center',
                  maxWidth: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {phase.name}
              </span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

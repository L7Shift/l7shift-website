'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

type ActivityType =
  | 'task_created'
  | 'task_shipped'
  | 'deliverable_uploaded'
  | 'deliverable_approved'
  | 'requirement_created'
  | 'requirement_approved'
  | 'feedback_received'
  | 'milestone_reached'
  | 'project_update'

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description?: string
  actor: string
  actorType: 'internal' | 'client' | 'system'
  timestamp: Date
  metadata?: {
    oldStatus?: string
    newStatus?: string
    version?: number
    phase?: string
  }
}

// Mock activity data
const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'deliverable_uploaded',
    title: 'Homepage Design v2 uploaded',
    description: 'Updated homepage with new hero section and improved mobile layout',
    actor: 'Ken',
    actorType: 'internal',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '2',
    type: 'task_shipped',
    title: 'User Authentication completed',
    description: 'Magic link and PIN authentication fully implemented',
    actor: 'Ken',
    actorType: 'internal',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    metadata: { oldStatus: 'review', newStatus: 'shipped' },
  },
  {
    id: '3',
    type: 'requirement_approved',
    title: 'Phase 1 Requirements signed off',
    actor: 'Client',
    actorType: 'client',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '4',
    type: 'milestone_reached',
    title: 'Design Phase Complete',
    description: 'All design deliverables approved and ready for development',
    actor: 'System',
    actorType: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    metadata: { phase: 'Design' },
  },
  {
    id: '5',
    type: 'feedback_received',
    title: 'Feedback on Dashboard wireframes',
    description: 'Great progress! Can we add a quick stats section at the top?',
    actor: 'Client',
    actorType: 'client',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: '6',
    type: 'task_shipped',
    title: 'Database Schema completed',
    actor: 'Ken',
    actorType: 'internal',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  },
  {
    id: '7',
    type: 'deliverable_approved',
    title: 'Brand Style Guide approved',
    actor: 'Client',
    actorType: 'client',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: '8',
    type: 'project_update',
    title: 'Project kicked off',
    description: 'Discovery phase initiated with initial requirements gathering',
    actor: 'Ken',
    actorType: 'internal',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
]

const activityConfig: Record<ActivityType, { icon: string; color: string; bgColor: string }> = {
  task_created: { icon: '📋', color: '#888', bgColor: 'rgba(136, 136, 136, 0.1)' },
  task_shipped: { icon: '🚀', color: '#BFFF00', bgColor: 'rgba(191, 255, 0, 0.1)' },
  deliverable_uploaded: { icon: '📤', color: '#00F0FF', bgColor: 'rgba(0, 240, 255, 0.1)' },
  deliverable_approved: { icon: '✅', color: '#BFFF00', bgColor: 'rgba(191, 255, 0, 0.1)' },
  requirement_created: { icon: '📝', color: '#888', bgColor: 'rgba(136, 136, 136, 0.1)' },
  requirement_approved: { icon: '✍️', color: '#BFFF00', bgColor: 'rgba(191, 255, 0, 0.1)' },
  feedback_received: { icon: '💬', color: '#FF00AA', bgColor: 'rgba(255, 0, 170, 0.1)' },
  milestone_reached: { icon: '🎯', color: '#00F0FF', bgColor: 'rgba(0, 240, 255, 0.1)' },
  project_update: { icon: '📢', color: '#888', bgColor: 'rgba(136, 136, 136, 0.1)' },
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type FilterType = 'all' | 'shipped' | 'approvals' | 'feedback'

export default function ActivityPage() {
  const params = useParams()
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredActivity = mockActivity.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'shipped') return item.type === 'task_shipped' || item.type === 'milestone_reached'
    if (filter === 'approvals') return item.type.includes('approved') || item.type === 'requirement_approved'
    if (filter === 'feedback') return item.type === 'feedback_received'
    return true
  })

  // Group by date
  const groupedActivity = filteredActivity.reduce((groups, item) => {
    const date = item.timestamp.toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
    return groups
  }, {} as Record<string, ActivityItem[]>)

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: '#FAFAFA',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            Activity
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            Track all updates and progress on your project
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 32,
        }}
      >
        {([
          { key: 'all', label: 'All Activity' },
          { key: 'shipped', label: 'Shipped' },
          { key: 'approvals', label: 'Approvals' },
          { key: 'feedback', label: 'Feedback' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '8px 16px',
              background: filter === key ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
              border: filter === key ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              color: filter === key ? '#00F0FF' : '#888',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 19,
            top: 40,
            bottom: 40,
            width: 2,
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />

        {Object.entries(groupedActivity).map(([date, items]) => (
          <div key={date} style={{ marginBottom: 32 }}>
            {/* Date Header */}
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#888',
                marginBottom: 16,
                marginLeft: 52,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>

            {/* Items for this date */}
            {items.map((item) => {
              const config = activityConfig[item.type]
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 16,
                    marginBottom: 16,
                    position: 'relative',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: config.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#FAFAFA' }}>
                        {item.title}
                      </h3>
                      <span
                        style={{
                          fontSize: 11,
                          color: '#666',
                        }}
                        title={formatFullDate(item.timestamp)}
                      >
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    {item.description && (
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#888', lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: item.actorType === 'internal'
                            ? 'linear-gradient(135deg, #00F0FF, #FF00AA)'
                            : item.actorType === 'client'
                            ? 'linear-gradient(135deg, #BFFF00, #00F0FF)'
                            : 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 600,
                          color: '#0A0A0A',
                        }}
                      >
                        {item.actor.charAt(0)}
                      </div>
                      <span style={{ fontSize: 12, color: '#666' }}>
                        {item.actor}
                        {item.actorType === 'internal' && (
                          <span style={{ color: '#00F0FF', marginLeft: 4 }}>• L7 Shift</span>
                        )}
                        {item.actorType === 'client' && (
                          <span style={{ color: '#BFFF00', marginLeft: 4 }}>• You</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {filteredActivity.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              color: '#666',
            }}
          >
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📭</span>
            <p style={{ fontSize: 15, margin: 0 }}>No activity found</p>
            <p style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

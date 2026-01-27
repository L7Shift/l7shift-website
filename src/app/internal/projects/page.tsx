'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProgressRing, StatusPill, MetricCard } from '@/components/dashboard'

// Mock data - will be replaced with Supabase queries
const mockProjects = [
  {
    id: '1',
    name: 'Scat Pack CLT',
    client: 'Eric Johnson',
    description: 'Dog waste removal SaaS platform',
    status: 'active' as const,
    completion: 78,
    shiftHours: 12.5,
    traditionalEstimate: 120,
    tasksTotal: 45,
    tasksShipped: 35,
    startDate: '2026-01-01',
    targetEnd: '2026-02-15',
  },
  {
    id: '2',
    name: 'Pretty Paid Closet',
    client: 'Jazz',
    description: 'Consignment + services platform',
    status: 'active' as const,
    completion: 35,
    shiftHours: 6,
    traditionalEstimate: 80,
    tasksTotal: 28,
    tasksShipped: 10,
    startDate: '2026-01-20',
    targetEnd: '2026-03-01',
  },
  {
    id: '3',
    name: 'Stitchwichs',
    client: 'Nicole Walker',
    description: 'Shopify optimization',
    status: 'backlog' as const,
    completion: 0,
    shiftHours: 0,
    traditionalEstimate: 60,
    tasksTotal: 0,
    tasksShipped: 0,
    startDate: '2026-01-15',
    targetEnd: '2026-03-15',
  },
]

type ViewMode = 'grid' | 'list'

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const filteredProjects = mockProjects.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'active') return p.status === 'active'
    if (filter === 'completed') return p.completion === 100
    return true
  })

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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
            Projects
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            {mockProjects.length} total projects
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {/* View toggle */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
              padding: 4,
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'grid' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: 6,
                color: viewMode === 'grid' ? '#00F0FF' : '#888',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              \u2588\u2588
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'list' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: 6,
                color: viewMode === 'list' ? '#00F0FF' : '#888',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              \u2261
            </button>
          </div>

          {/* New project button */}
          <button
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 16,
        }}
      >
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              background: filter === f ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
              border: filter === f ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
              borderRadius: 6,
              color: filter === f ? '#00F0FF' : '#888',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/internal/projects/${project.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="project-card"
                style={{
                  padding: 24,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top gradient line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: project.status === 'active'
                      ? 'linear-gradient(90deg, #00F0FF, #FF00AA)'
                      : 'rgba(255, 255, 255, 0.1)',
                  }}
                />

                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#FAFAFA',
                      }}
                    >
                      {project.name}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
                      {project.client}
                    </p>
                  </div>
                  <StatusPill status={project.status} size="sm" />
                </div>

                {/* Description */}
                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: 13,
                    color: '#666',
                    lineHeight: 1.5,
                  }}
                >
                  {project.description}
                </p>

                {/* Progress section */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <ProgressRing
                    percentage={project.completion}
                    size="sm"
                    label="Complete"
                    color={project.status === 'active' ? 'gradient' : 'lime'}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontSize: 12, color: '#888' }}>Tasks</span>
                      <span style={{ fontSize: 12, color: '#FAFAFA', fontWeight: 600 }}>
                        {project.tasksShipped}/{project.tasksTotal}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: project.tasksTotal > 0
                            ? `${(project.tasksShipped / project.tasksTotal) * 100}%`
                            : '0%',
                          background: '#BFFF00',
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer metrics */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 16,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>SHIFT HRS</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#00F0FF' }}>
                      {project.shiftHours}h
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>EST. SAVINGS</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#BFFF00' }}>
                      {project.traditionalEstimate > 0
                        ? `${Math.round(((project.traditionalEstimate - project.shiftHours) / project.traditionalEstimate) * 100)}%`
                        : '-'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>TARGET</div>
                    <div style={{ fontSize: 14, color: '#888' }}>
                      {new Date(project.targetEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* List view */
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
              gap: 16,
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: 11,
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span>Project</span>
            <span>Status</span>
            <span>Progress</span>
            <span>Shift Hrs</span>
            <span>Target</span>
            <span></span>
          </div>

          {/* Rows */}
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/internal/projects/${project.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="project-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
                  gap: 16,
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>{project.client}</div>
                </div>
                <StatusPill status={project.status} size="sm" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${project.completion}%`,
                        background: 'linear-gradient(90deg, #00F0FF, #BFFF00)',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, color: '#888', minWidth: 40 }}>
                    {project.completion}%
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#00F0FF' }}>
                  {project.shiftHours}h
                </div>
                <div style={{ fontSize: 13, color: '#888' }}>
                  {new Date(project.targetEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div style={{ textAlign: 'right', color: '#888' }}>\u2192</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .project-card:hover {
          border-color: rgba(0, 240, 255, 0.5) !important;
          box-shadow: 0 4px 24px rgba(0, 240, 255, 0.15);
          transform: translateY(-2px);
        }
        .project-row:hover {
          background: rgba(0, 240, 255, 0.05) !important;
        }
      `}</style>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Project } from '@/lib/database.types'
import { ProgressRing, StatusPill, MetricCard } from '@/components/dashboard'

interface ProjectWithMetrics extends Project {
  total_tasks: number
  shipped_tasks: number
  total_shift_hours: number
  total_traditional_estimate: number
}

type ViewMode = 'grid' | 'list'
type FilterOption = 'all' | 'active' | 'on_hold' | 'completed'

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterOption>('all')
  const [projects, setProjects] = useState<ProjectWithMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const res = await fetch('/api/internal/dashboard')
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true
    return p.status === filter
  })

  if (loading) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ color: '#888' }}>Loading projects...</div>
      </div>
    )
  }

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
            {projects.length} total projects
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
              ▦
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
              ≡
            </button>
          </div>

          {/* New project button */}
          <button
            onClick={() => setShowNewProjectModal(true)}
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
        {([
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'on_hold', label: 'On Hold' },
          { key: 'completed', label: 'Completed' },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px',
              background: filter === f.key ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
              border: filter === f.key ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
              borderRadius: 6,
              color: filter === f.key ? '#00F0FF' : '#888',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 ? (
        <div
          style={{
            padding: 60,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, color: '#FAFAFA' }}>
            {filter === 'all' ? 'No projects yet' : `No ${filter} projects`}
          </h2>
          <p style={{ margin: '0 0 24px', color: '#888', fontSize: 14 }}>
            {filter === 'all'
              ? 'Create your first project to get started'
              : 'No projects match this filter'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowNewProjectModal(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Create Project
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {filteredProjects.map((project) => {
            const completion = project.total_tasks > 0
              ? Math.round((project.shipped_tasks / project.total_tasks) * 100)
              : 0

            return (
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
                        {project.client_name}
                      </p>
                    </div>
                    <StatusPill status={project.status} size="sm" />
                  </div>

                  {/* Description */}
                  {project.description && (
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
                  )}

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
                      percentage={completion}
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
                          {project.shipped_tasks}/{project.total_tasks}
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
                            width: project.total_tasks > 0
                              ? `${(project.shipped_tasks / project.total_tasks) * 100}%`
                              : '0%',
                            background: '#BFFF00',
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hours comparison bar */}
                  {project.total_traditional_estimate > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 6,
                        }}
                      >
                        <span style={{ fontSize: 11, color: '#888' }}>Hours: Shift vs Traditional</span>
                        <span style={{ fontSize: 11, color: '#888' }}>
                          {project.total_shift_hours.toFixed(1)}h / {project.total_traditional_estimate}h
                        </span>
                      </div>
                      <div
                        style={{
                          height: 8,
                          background: '#FF00AA33',
                          borderRadius: 4,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        {/* Traditional estimate background (magenta) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '100%',
                            background: 'linear-gradient(90deg, #FF00AA44, #FF00AA22)',
                            borderRadius: 4,
                          }}
                        />
                        {/* Shift hours fill (cyan) */}
                        <div
                          style={{
                            position: 'relative',
                            height: '100%',
                            width: `${Math.min((project.total_shift_hours / project.total_traditional_estimate) * 100, 100)}%`,
                            background: 'linear-gradient(90deg, #00F0FF, #00F0FFCC)',
                            borderRadius: 4,
                            boxShadow: '0 0 8px rgba(0, 240, 255, 0.4)',
                          }}
                        />
                      </div>
                    </div>
                  )}

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
                        {project.total_shift_hours.toFixed(1)}h
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>EST. SAVINGS</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#BFFF00' }}>
                        {project.total_traditional_estimate > 0
                          ? `${Math.round(((project.total_traditional_estimate - project.total_shift_hours) / project.total_traditional_estimate) * 100)}%`
                          : '-'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>TARGET</div>
                      <div style={{ fontSize: 14, color: '#888' }}>
                        {project.target_end_date
                          ? new Date(project.target_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
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
          {filteredProjects.map((project) => {
            const completion = project.total_tasks > 0
              ? Math.round((project.shipped_tasks / project.total_tasks) * 100)
              : 0

            return (
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
                    <div style={{ fontSize: 12, color: '#666' }}>{project.client_name}</div>
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
                          width: `${completion}%`,
                          background: 'linear-gradient(90deg, #00F0FF, #BFFF00)',
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, color: '#888', minWidth: 40 }}>
                      {completion}%
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#00F0FF' }}>
                    {project.total_shift_hours.toFixed(1)}h
                  </div>
                  <div style={{ fontSize: 13, color: '#888' }}>
                    {project.target_end_date
                      ? new Date(project.target_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '-'}
                  </div>
                  <div style={{ textAlign: 'right', color: '#888' }}>→</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onSuccess={() => {
            setShowNewProjectModal(false)
            fetchProjects()
          }}
        />
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

// New Project Modal Component
function NewProjectModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [clientName, setClientName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !clientName) return

    setSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          client_name: clientName,
          description: description || null,
          status: 'active',
        }),
      })

      if (!res.ok) throw new Error('Failed to create project')
      onSuccess()
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1A1A1A',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: 32,
          width: '100%',
          maxWidth: 480,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 24px', fontSize: 20, color: '#FAFAFA' }}>New Project</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 14,
                outline: 'none',
              }}
              placeholder="e.g., Website Redesign"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Client Name *
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 14,
                outline: 'none',
              }}
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#FAFAFA',
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
              }}
              placeholder="Brief project description..."
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
                color: '#888',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name || !clientName}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                border: 'none',
                borderRadius: 8,
                color: '#0A0A0A',
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving || !name || !clientName ? 0.5 : 1,
              }}
            >
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

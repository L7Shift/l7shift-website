'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { RequirementStatus } from '@/lib/database.types'

interface RequirementRow {
  id: string
  project_id: string
  title: string
  content: string
  version: number
  status: RequirementStatus
  created_by: string
  created_at: string
  updated_at: string
}

interface Requirement {
  id: string
  projectId: string
  projectName: string
  clientName: string
  title: string
  status: RequirementStatus
  version: number
  createdAt: string
  updatedAt: string
  sectionsCount: number
}

interface ProjectOption {
  id: string
  name: string
  clientName: string
}

const statusConfig: Record<RequirementStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: '#888', bgColor: 'rgba(136, 136, 136, 0.1)' },
  review: { label: 'Awaiting Signoff', color: '#FF00AA', bgColor: 'rgba(255, 0, 170, 0.1)' },
  approved: { label: 'Approved', color: '#BFFF00', bgColor: 'rgba(191, 255, 0, 0.1)' },
  implemented: { label: 'Implemented', color: '#00F0FF', bgColor: 'rgba(0, 240, 255, 0.1)' },
}

function countSections(content: string): number {
  const matches = content.match(/^##\s+.+$/gm) || content.match(/^###\s+.+$/gm)
  return matches ? matches.length : (content.trim() ? 1 : 0)
}

type FilterStatus = 'all' | RequirementStatus

export default function InternalRequirementsPage() {
  const router = useRouter()
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [showNewModal, setShowNewModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newProjectId, setNewProjectId] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    if (!supabase) { setLoading(false); return }

    try {
      // Fetch requirements docs
      const { data: docs, error: docsError } = await (supabase as ReturnType<typeof Object>)
        .from('requirements_docs')
        .select('*')
        .order('updated_at', { ascending: false })

      if (docsError) throw docsError

      // Fetch projects for name lookup and for the create modal
      const { data: projects, error: projError } = await (supabase as ReturnType<typeof Object>)
        .from('projects')
        .select('id, name, client_name, status')

      if (projError) throw projError

      const projectMap = new Map<string, { name: string; clientName: string }>()
      const options: ProjectOption[] = []
      for (const p of (projects || [])) {
        projectMap.set(p.id, { name: p.name, clientName: p.client_name })
        if (p.status === 'active') {
          options.push({ id: p.id, name: p.name, clientName: p.client_name })
        }
      }
      setProjectOptions(options)

      const reqs: Requirement[] = (docs || []).map((doc: RequirementRow) => {
        const project = projectMap.get(doc.project_id)
        return {
          id: doc.id,
          projectId: doc.project_id,
          projectName: project?.name || 'Unknown Project',
          clientName: project?.clientName || '',
          title: doc.title,
          status: doc.status,
          version: doc.version,
          createdAt: doc.created_at,
          updatedAt: doc.updated_at,
          sectionsCount: countSections(doc.content || ''),
        }
      })
      setRequirements(reqs)
    } catch (err) {
      console.error('Error fetching requirements:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendForReview(reqId: string) {
    if (!supabase) return

    try {
      const { error } = await (supabase as ReturnType<typeof Object>)
        .from('requirements_docs')
        .update({ status: 'review', updated_at: new Date().toISOString() })
        .eq('id', reqId)

      if (error) throw error
      setRequirements(prev => prev.map(r =>
        r.id === reqId ? { ...r, status: 'review' as RequirementStatus, updatedAt: new Date().toISOString() } : r
      ))
    } catch (err) {
      console.error('Error sending for review:', err)
    }
  }

  async function handleCreateDoc() {
    if (!supabase || !newProjectId || !newTitle.trim()) return
    setCreating(true)

    try {
      const { data, error } = await (supabase as ReturnType<typeof Object>)
        .from('requirements_docs')
        .insert({
          project_id: newProjectId,
          title: newTitle.trim(),
          content: '',
          status: 'draft',
          version: 1,
          created_by: 'internal',
        })
        .select()
        .single()

      if (error) throw error

      setShowNewModal(false)
      setNewTitle('')
      setNewProjectId('')
      // Navigate to the new doc editor
      router.push(`/internal/requirements/${data.id}`)
    } catch (err) {
      console.error('Error creating requirement:', err)
    } finally {
      setCreating(false)
    }
  }

  // Get unique projects from actual data
  const projects = Array.from(new Set(requirements.map(r => r.projectId))).map(id => {
    const req = requirements.find(r => r.projectId === id)!
    return { id, name: req.projectName }
  })

  const filteredRequirements = requirements.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false
    if (projectFilter !== 'all' && r.projectId !== projectFilter) return false
    return true
  })

  // Stats
  const stats = {
    total: requirements.length,
    draft: requirements.filter(r => r.status === 'draft').length,
    awaitingSignoff: requirements.filter(r => r.status === 'review').length,
    approved: requirements.filter(r => r.status === 'approved' || r.status === 'implemented').length,
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 0', textAlign: 'center' }}>
        <div style={{ color: '#888', fontSize: 14 }}>Loading requirements...</div>
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
            Requirements Hub
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            Create, manage, and track client signoffs
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>+</span>
          New Requirement Doc
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: 20,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Documents
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#FAFAFA' }}>{stats.total}</div>
        </div>

        <div
          style={{
            padding: 20,
            background: 'rgba(136, 136, 136, 0.05)',
            border: '1px solid rgba(136, 136, 136, 0.2)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            In Draft
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#888' }}>{stats.draft}</div>
        </div>

        <div
          style={{
            padding: 20,
            background: 'rgba(255, 0, 170, 0.05)',
            border: '1px solid rgba(255, 0, 170, 0.2)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, color: '#FF00AA', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Awaiting Signoff
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#FF00AA' }}>{stats.awaitingSignoff}</div>
        </div>

        <div
          style={{
            padding: 20,
            background: 'rgba(191, 255, 0, 0.05)',
            border: '1px solid rgba(191, 255, 0, 0.2)',
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 11, color: '#BFFF00', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Approved
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#BFFF00' }}>{stats.approved}</div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'draft', 'review', 'approved', 'implemented'] as const).map((f) => (
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
              }}
            >
              {f === 'all' ? 'All' : f === 'review' ? 'Awaiting Signoff' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Project Filter */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 6,
            color: '#FAFAFA',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Requirements Table */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
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
          <span>Document</span>
          <span>Project</span>
          <span>Status</span>
          <span>Last Updated</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {filteredRequirements.map((req) => (
          <div
            key={req.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
              gap: 16,
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              alignItems: 'center',
              transition: 'background 0.2s ease',
            }}
            className="requirement-row"
          >
            {/* Document Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#666' }}>v{req.version}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
                {req.title}
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                {req.sectionsCount} section{req.sectionsCount !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Project */}
            <div>
              <div style={{ fontSize: 13, color: '#FAFAFA' }}>{req.projectName}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{req.clientName}</div>
            </div>

            {/* Status */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  background: statusConfig[req.status].bgColor,
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: statusConfig[req.status].color,
                }}
              >
                {req.status === 'approved' && '\u2713 '}
                {statusConfig[req.status].label}
              </div>
            </div>

            {/* Last Updated */}
            <div style={{ fontSize: 13, color: '#888' }}>
              {new Date(req.updatedAt).toLocaleDateString()}
              <div style={{ fontSize: 10, color: '#666' }}>
                {new Date(req.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                href={`/internal/requirements/${req.id}`}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#FAFAFA',
                  fontSize: 11,
                  fontWeight: 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                Edit
              </Link>
              {req.status === 'draft' && (
                <button
                  onClick={() => handleSendForReview(req.id)}
                  style={{
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                    border: 'none',
                    borderRadius: 6,
                    color: '#0A0A0A',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Send
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredRequirements.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              color: '#666',
            }}
          >
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📄</span>
            <p style={{ fontSize: 15, margin: 0 }}>No requirements found</p>
            <p style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
              {requirements.length === 0
                ? 'Create your first requirement document to get started'
                : 'Try adjusting your filters'}
            </p>
          </div>
        )}
      </div>

      {/* New Document Modal */}
      {showNewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowNewModal(false)}
        >
          <div
            style={{
              background: '#0A0A0A',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              padding: 32,
              maxWidth: 500,
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 600, color: '#FAFAFA' }}>
              New Requirement Document
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Project Select */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8 }}>
                  Project
                </label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 8,
                    color: '#FAFAFA',
                    fontSize: 14,
                  }}
                >
                  <option value="">Select a project...</option>
                  {projectOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8 }}>
                  Document Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Phase 1: Core Requirements"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 8,
                    color: '#FAFAFA',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  onClick={() => setShowNewModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#888',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDoc}
                  disabled={creating || !newProjectId || !newTitle.trim()}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: (!newProjectId || !newTitle.trim()) ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                    border: 'none',
                    borderRadius: 8,
                    color: (!newProjectId || !newTitle.trim()) ? '#666' : '#0A0A0A',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: (!newProjectId || !newTitle.trim()) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {creating ? 'Creating...' : 'Create Document'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .requirement-row:hover {
          background: rgba(0, 240, 255, 0.03) !important;
        }
      `}</style>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { RequirementDoc, RequirementStatus } from '@/lib/database.types'

interface Section {
  title: string
  content: string
}

const statusConfig: Record<RequirementStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: '#888', bgColor: 'rgba(136, 136, 136, 0.1)' },
  review: { label: 'Awaiting Signoff', color: '#FF00AA', bgColor: 'rgba(255, 0, 170, 0.1)' },
  approved: { label: 'Approved', color: '#BFFF00', bgColor: 'rgba(191, 255, 0, 0.1)' },
  implemented: { label: 'Implemented', color: '#00F0FF', bgColor: 'rgba(0, 240, 255, 0.1)' },
}

function parseContentToSections(content: string): Section[] {
  const lines = content.split('\n')
  const sections: Section[] = []
  let currentSection: Section | null = null

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/)
    const h3Match = line.match(/^###\s+(.+)$/)

    if (h2Match || h3Match) {
      if (currentSection) sections.push(currentSection)
      currentSection = { title: (h2Match || h3Match)![1], content: '' }
    } else if (currentSection) {
      currentSection.content += line + '\n'
    }
  }
  if (currentSection) sections.push(currentSection)
  if (sections.length === 0 && content.trim()) {
    sections.push({ title: 'Overview', content })
  }
  return sections
}

export default function RequirementEditorPage() {
  const params = useParams()
  const router = useRouter()
  const docId = params.id as string

  const [loading, setLoading] = useState(true)
  const [doc, setDoc] = useState<RequirementDoc | null>(null)
  const [projectName, setProjectName] = useState('')
  const [clientName, setClientName] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<RequirementStatus>('draft')
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDoc()
  }, [docId])

  async function fetchDoc() {
    if (!supabase) { setLoading(false); setError('Database not available'); return }

    try {
      const { data, error: fetchError } = await (supabase as ReturnType<typeof Object>)
        .from('requirements_docs')
        .select('*')
        .eq('id', docId)
        .single()

      if (fetchError || !data) {
        setError('Requirement document not found')
        setLoading(false)
        return
      }

      setDoc(data)
      setTitle(data.title)
      setContent(data.content)
      setStatus(data.status)

      // Fetch project info
      const { data: project } = await (supabase as ReturnType<typeof Object>)
        .from('projects')
        .select('name, client_name')
        .eq('id', data.project_id)
        .single()

      if (project) {
        setProjectName(project.name)
        setClientName(project.client_name || '')
      }
    } catch (err) {
      console.error('Error fetching requirement:', err)
      setError('Failed to load document')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!supabase || !doc) return
    setSaving(true)

    try {
      const { error: updateError } = await (supabase as ReturnType<typeof Object>)
        .from('requirements_docs')
        .update({
          title,
          content,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', doc.id)

      if (updateError) throw updateError
      setHasChanges(false)
      setDoc({ ...doc, title, content, status, updated_at: new Date().toISOString() })
    } catch (err) {
      console.error('Error saving:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleSendForReview() {
    if (!supabase || !doc) return
    setSaving(true)

    try {
      const { error: updateError } = await (supabase as ReturnType<typeof Object>)
        .from('requirements_docs')
        .update({
          title,
          content,
          status: 'review',
          updated_at: new Date().toISOString(),
        })
        .eq('id', doc.id)

      if (updateError) throw updateError
      setStatus('review')
      setHasChanges(false)
      setDoc({ ...doc, title, content, status: 'review', updated_at: new Date().toISOString() })
    } catch (err) {
      console.error('Error sending for review:', err)
    } finally {
      setSaving(false)
    }
  }

  const sections = content ? parseContentToSections(content) : []

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 0', textAlign: 'center' }}>
        <div style={{ color: '#888', fontSize: 14 }}>Loading document...</div>
      </div>
    )
  }

  if (error || !doc) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
        <h2 style={{ color: '#FAFAFA', fontSize: 20, marginBottom: 8 }}>{error || 'Document not found'}</h2>
        <Link href="/internal/requirements" style={{ color: '#00F0FF', textDecoration: 'none', fontSize: 14 }}>
          Back to Requirements
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/internal/requirements" style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>
            Requirements
          </Link>
          <span style={{ color: '#555' }}>/</span>
          <span style={{ color: '#FAFAFA', fontSize: 13 }}>{title}</span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 20px',
                background: 'rgba(191, 255, 0, 0.1)',
                border: '1px solid rgba(191, 255, 0, 0.3)',
                borderRadius: 8,
                color: '#BFFF00',
                fontSize: 13,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}

          {status === 'draft' && (
            <button
              onClick={handleSendForReview}
              disabled={saving}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                border: 'none',
                borderRadius: 8,
                color: '#0A0A0A',
                fontSize: 13,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              Send for Signoff
            </button>
          )}

          {status === 'review' && (
            <div style={{
              padding: '10px 20px',
              background: 'rgba(255, 0, 170, 0.1)',
              border: '1px solid rgba(255, 0, 170, 0.3)',
              borderRadius: 8,
              color: '#FF00AA',
              fontSize: 13,
              fontWeight: 600,
            }}>
              Awaiting Client Signoff
            </div>
          )}

          {status === 'approved' && (
            <div style={{
              padding: '10px 20px',
              background: 'rgba(191, 255, 0, 0.1)',
              border: '1px solid rgba(191, 255, 0, 0.3)',
              borderRadius: 8,
              color: '#BFFF00',
              fontSize: 13,
              fontWeight: 600,
            }}>
              Approved
            </div>
          )}
        </div>
      </div>

      {/* Document Header */}
      <div style={{
        padding: 28,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            padding: '4px 10px',
            background: statusConfig[status].bgColor,
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            color: statusConfig[status].color,
          }}>
            {statusConfig[status].label}
          </div>
          <span style={{ fontSize: 11, color: '#666' }}>v{doc.version}</span>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setHasChanges(true) }}
          style={{
            width: '100%',
            padding: 0,
            background: 'transparent',
            border: 'none',
            fontSize: 24,
            fontWeight: 600,
            color: '#FAFAFA',
            marginBottom: 8,
            outline: 'none',
          }}
          placeholder="Document Title"
        />

        <div style={{ fontSize: 13, color: '#888' }}>
          {projectName} {clientName && `\u2022 ${clientName}`}
        </div>
      </div>

      {/* Content Editor */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#FAFAFA' }}>
            Content ({sections.length} {sections.length === 1 ? 'section' : 'sections'})
          </h2>
        </div>

        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setHasChanges(true) }}
          style={{
            width: '100%',
            padding: 20,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            color: '#CCC',
            fontSize: 14,
            lineHeight: 1.8,
            resize: 'vertical',
            minHeight: 400,
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          placeholder="Write requirement content using ## headings to create sections..."
        />
      </div>

      {/* Preview */}
      {sections.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#888' }}>
            Preview
          </h2>
          {sections.map((section, i) => (
            <div key={i} style={{
              padding: 20,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 12,
              marginBottom: 12,
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600, color: '#00F0FF' }}>
                {section.title}
              </h3>
              <div style={{ fontSize: 14, color: '#AAA', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {section.content.trim()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Footer */}
      <div style={{
        padding: 20,
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#666',
      }}>
        <span>Created: {new Date(doc.created_at).toLocaleDateString()}</span>
        <span>Last updated: {new Date(doc.updated_at).toLocaleDateString()} at {new Date(doc.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span>ID: {doc.id}</span>
      </div>
    </div>
  )
}

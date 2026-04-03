'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  getProjectBySlug,
  getProjectActivity,
  getProjectRequirements,
  getProjectDeliverables,
  transformActivityEntry,
  type PortalProject,
} from '@/lib/portal-utils'
import { getClientConfig } from '@/lib/client-portal-config'
import type { RequirementDoc, Deliverable } from '@/lib/database.types'

// Action item that needs client attention
interface ActionItem {
  id: string
  type: 'approve_requirement' | 'review_deliverable' | 'upload_asset'
  title: string
  description: string
  icon: string
  priority: boolean
  href: string
  ctaLabel: string
}

export default function ClientPortalDashboard() {
  const params = useParams()
  const clientSlug = params.clientSlug as string
  const config = getClientConfig(clientSlug)

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestTitle, setRequestTitle] = useState('')
  const [requestDescription, setRequestDescription] = useState('')
  const [requestPriority, setRequestPriority] = useState<'normal' | 'urgent'>('normal')
  const [requestSubmitting, setRequestSubmitting] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [portalData, setPortalData] = useState<PortalProject | null>(null)
  const [requirements, setRequirements] = useState<RequirementDoc[]>([])
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [activityItems, setActivityItems] = useState<ReturnType<typeof transformActivityEntry>[]>([])

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [clientSlug])

  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const projectData = await getProjectBySlug(clientSlug)

      if (!projectData) {
        setError('Project not found')
        setLoading(false)
        return
      }

      setPortalData(projectData)

      const [reqs, dels, activity] = await Promise.all([
        getProjectRequirements(projectData.project.id),
        getProjectDeliverables(projectData.project.id),
        getProjectActivity(projectData.project.id, 10),
      ])

      setRequirements(reqs)
      setDeliverables(dels)
      setActivityItems(activity.map(transformActivityEntry))
    } catch (err) {
      console.error('Error loading portal data:', err)
      setError('Failed to load project data')
    } finally {
      setLoading(false)
    }
  }

  async function submitRequest() {
    if (!portalData || !requestTitle.trim()) return
    setRequestSubmitting(true)
    try {
      const res = await fetch('/api/client/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: portalData.project.id,
          title: requestTitle,
          description: requestDescription,
          priority: requestPriority,
          clientName: portalData.project.client_name || 'Client',
        }),
      })
      if (res.ok) {
        setRequestSuccess(true)
        setTimeout(() => {
          setShowRequestForm(false)
          setRequestTitle('')
          setRequestDescription('')
          setRequestPriority('normal')
          setRequestSuccess(false)
          loadData()
        }, 2000)
      }
    } catch (err) {
      console.error('Request submission error:', err)
    } finally {
      setRequestSubmitting(false)
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: config.primaryColor,
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#888', fontSize: 14 }}>Loading your project...</p>
      </div>
    )
  }

  if (error || !portalData) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ color: '#FAFAFA', fontSize: 20, marginBottom: 8 }}>
          {error || 'Project not found'}
        </h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
          We couldn&apos;t find a project associated with this portal.
        </p>
        <Link
          href="/"
          style={{ color: config.primaryColor, textDecoration: 'none', fontSize: 14 }}
        >
          Return to homepage
        </Link>
      </div>
    )
  }

  const { project, tasks, completion, shiftHours, traditionalEstimate } = portalData
  const clientName = project.client_name?.split(' ')[0] || 'there'
  const { primaryColor, accentColor } = config

  // Group tasks
  const activeTasks = tasks.filter(t => t.status === 'active' || t.status === 'review')
  const shippedTasks = tasks.filter(t => t.status === 'shipped')
  const totalActive = tasks.filter(t => t.status !== 'icebox').length
  const timeSaved = traditionalEstimate - shiftHours

  // Build action items from real data
  const actionItems: ActionItem[] = []

  // Requirements needing approval
  requirements
    .filter(r => r.status === 'review')
    .forEach(r => {
      actionItems.push({
        id: r.id,
        type: 'approve_requirement',
        title: r.title,
        description: r.content.length > 120 ? r.content.slice(0, 120) + '...' : r.content,
        icon: 'clipboard',
        priority: true,
        href: `/portal/${clientSlug}/requirements`,
        ctaLabel: 'Review & Approve',
      })
    })

  // Deliverables needing review
  deliverables
    .filter(d => d.status === 'in_review' || d.status === 'pending')
    .forEach(d => {
      actionItems.push({
        id: d.id,
        type: 'review_deliverable',
        title: d.name,
        description: d.description || 'A new deliverable is ready for your review.',
        icon: 'package',
        priority: true,
        href: `/portal/${clientSlug}/deliverables`,
        ctaLabel: 'Review & Approve',
      })
    })

  // Asset requests from config
  config.assetRequests.forEach((asset, i) => {
    actionItems.push({
      id: `asset_${i}`,
      type: 'upload_asset',
      title: asset.title,
      description: asset.description,
      icon: asset.icon,
      priority: asset.priority,
      href: `/portal/${clientSlug}/assets`,
      ctaLabel: 'Upload',
    })
  })

  const priorityActions = actionItems.filter(a => a.priority)
  const otherActions = actionItems.filter(a => !a.priority)

  const ICON_MAP: Record<string, string> = {
    clipboard: '\u{1F4CB}',
    package: '\u{1F4E6}',
    camera: '\u{1F4F8}',
    palette: '\u{1F3A8}',
    file: '\u{1F4C4}',
    image: '\u{1F5BC}\uFE0F',
    box: '\u{1F4E6}',
    pen: '\u{270D}\uFE0F',
  }

  return (
    <div>
      {/* Welcome Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em' }}>
            Welcome, {clientName}
          </h1>
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 14, fontWeight: 400 }}>
            Your project dashboard. Here&apos;s where everything stands.
          </p>
        </div>
        <button
          onClick={() => setShowRequestForm(true)}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: `1px solid ${primaryColor}50`,
            borderRadius: 10,
            color: primaryColor,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${primaryColor}15`
            e.currentTarget.style.borderColor = `${primaryColor}80`
            e.currentTarget.style.boxShadow = `0 0 20px ${primaryColor}15`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = `${primaryColor}50`
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          + New Request
        </button>
      </div>

      {/* Project Status Card — Premium */}
      <div
        style={{
          padding: 24,
          background: `linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
          border: `1px solid ${primaryColor}20`,
          borderRadius: 16,
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent glow */}
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}12, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
          <div>
            <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', fontWeight: 500, textTransform: 'uppercase' }}>Project</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#FAFAFA', marginTop: 4, letterSpacing: '-0.01em' }}>
              {project.name}
            </div>
          </div>
          <div
            style={{
              padding: '6px 16px',
              background: `${primaryColor}15`,
              border: `1px solid ${primaryColor}30`,
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              color: primaryColor,
              letterSpacing: '0.02em',
            }}
          >
            {completion}% Complete
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 20 }}>
          <div
            style={{
              height: '100%',
              width: `${Math.max(completion, 3)}%`,
              background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
              borderRadius: 2,
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 12px ${primaryColor}40`,
            }}
          />
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16 }}>
          {[
            { value: shippedTasks.length, label: 'SHIPPED', color: primaryColor },
            { value: activeTasks.length, label: 'IN PROGRESS', color: accentColor },
            { value: totalActive, label: 'TOTAL', color: '#FAFAFA' },
            ...(timeSaved > 0 ? [{ value: `${Math.round(timeSaved)}h`, label: 'TIME SAVED', color: '#4ADE80' }] : []),
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '12px 0',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              paddingLeft: i > 0 ? 16 : 0,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color, letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.1em', fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Required */}
      {priorityActions.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#FAFAFA', letterSpacing: '-0.01em' }}>
              Action Required
            </h2>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: primaryColor,
                background: `${primaryColor}15`,
                padding: '3px 10px',
                borderRadius: 10,
              }}
            >
              {priorityActions.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {priorityActions.map(item => (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '16px 18px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  alignItems: 'center',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${primaryColor}35`
                  e.currentTarget.style.background = `${primaryColor}06`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0, opacity: 0.9 }}>{ICON_MAP[item.icon] || '\u{1F4CB}'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#EAEAEA' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 3, lineHeight: 1.5 }}>
                    {item.description}
                  </div>
                </div>
                <span
                  style={{
                    padding: '8px 18px',
                    background: `${primaryColor}15`,
                    border: `1px solid ${primaryColor}30`,
                    borderRadius: 8,
                    color: primaryColor,
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {item.ctaLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Other Requests */}
      {otherActions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 600, color: '#888' }}>
            Also Helpful
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {otherActions.map(item => (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{ICON_MAP[item.icon] || '\u{1F4CB}'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#CCC' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{item.description}</div>
                </div>
                <span
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8,
                    color: '#888',
                    fontSize: 12,
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {item.ctaLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {activityItems.length > 0 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 16,
            padding: 22,
            marginBottom: 24,
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#FAFAFA', letterSpacing: '-0.01em' }}>
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activityItems.slice(0, 5).map((item, i) => {
              const iconMap: Record<string, string> = {
                task_created: '\u{1F4CB}',
                task_shipped: '\u{1F680}',
                deliverable_uploaded: '\u{1F4C1}',
                deliverable_approved: '\u2705',
                requirement_created: '\u{1F4DD}',
                requirement_approved: '\u2705',
                feedback_received: '\u{1F4AC}',
                milestone_reached: '\u{1F3C6}',
                project_update: '\u{1F4CC}',
              }
              const icon = iconMap[item.type] || '\u{1F4CC}'
              const timeAgo = (() => {
                const diff = Date.now() - new Date(item.timestamp).getTime()
                const mins = Math.floor(diff / 60000)
                if (mins < 60) return `${mins}m ago`
                const hrs = Math.floor(mins / 60)
                if (hrs < 24) return `${hrs}h ago`
                return `${Math.floor(hrs / 24)}d ago`
              })()
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: i < Math.min(activityItems.length, 5) - 1
                      ? '1px solid rgba(255,255,255,0.06)'
                      : 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#CCC' }}>{item.title}</div>
                    {item.description && (
                      <div style={{ fontSize: 12, color: '#777', marginTop: 2 }}>{item.description}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: '#555', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {timeAgo}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Contact */}
      <div
        style={{
          padding: 22,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#EAEAEA' }}>
          Questions? Need help?
        </h3>
        <p style={{ margin: '6px 0 16px', fontSize: 13, color: '#666' }}>
          Reach out anytime &mdash; we&apos;re building this together.
        </p>
        <a
          href="mailto:ken@l7shift.com"
          style={{
            display: 'inline-block',
            padding: '10px 22px',
            background: 'transparent',
            border: `1px solid ${primaryColor}40`,
            borderRadius: 8,
            color: primaryColor,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          Email Ken
        </a>
      </div>

      {/* New Request Modal */}
      {showRequestForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px 16px',
          }}
          onClick={() => !requestSubmitting && setShowRequestForm(false)}
        >
          <div
            style={{
              background: '#0A0A0A',
              border: requestSuccess ? '1px solid rgba(74,222,128,0.5)' : `1px solid ${primaryColor}33`,
              borderRadius: 16,
              maxWidth: 520,
              width: '100%',
              padding: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {requestSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(74,222,128,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 24,
                    color: '#4ADE80',
                  }}
                >
                  {'\u2713'}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600, color: '#4ADE80' }}>
                  Request Submitted
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: '#888' }}>
                  Ken has been notified and will follow up.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#FAFAFA' }}>
                    New Request
                  </h3>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    style={{ background: 'none', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer', padding: '0 4px' }}
                  >
                    {'\u00D7'}
                  </button>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                    What do you need?
                  </label>
                  <input
                    type="text"
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    placeholder="e.g., Add new product photos, Change color options..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      color: '#FAFAFA',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Details (optional)
                  </label>
                  <textarea
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    placeholder="Add any context, links, or specifics..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      color: '#FAFAFA',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Priority
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => setRequestPriority('normal')}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: requestPriority === 'normal' ? `${primaryColor}20` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${requestPriority === 'normal' ? primaryColor + '55' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8,
                        color: requestPriority === 'normal' ? primaryColor : '#888',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setRequestPriority('urgent')}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: requestPriority === 'urgent' ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${requestPriority === 'urgent' ? 'rgba(255,107,107,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8,
                        color: requestPriority === 'urgent' ? '#FF6B6B' : '#888',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Urgent
                    </button>
                  </div>
                </div>

                <button
                  onClick={submitRequest}
                  disabled={requestSubmitting || !requestTitle.trim()}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: !requestTitle.trim()
                      ? 'rgba(255,255,255,0.1)'
                      : `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                    border: 'none',
                    borderRadius: 10,
                    color: !requestTitle.trim() ? '#666' : '#0A0A0A',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: !requestTitle.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {requestSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getProjectBySlug,
  getProjectActivity,
  transformActivityEntry,
  CLIENT_SLUG_MAP,
  type PortalProject,
} from '@/lib/portal-utils'

export default function ClientPortalDashboard() {
  const params = useParams()
  const router = useRouter()
  const clientSlug = params.clientSlug as string

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [portalData, setPortalData] = useState<PortalProject | null>(null)
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

      const activity = await getProjectActivity(projectData.project.id, 10)
      setActivityItems(activity.map(transformActivityEntry))
    } catch (err) {
      console.error('Error loading portal data:', err)
      setError('Failed to load project data')
    } finally {
      setLoading(false)
    }
  }

  const config = CLIENT_SLUG_MAP[clientSlug] || {
    primaryColor: '#00F0FF',
    accentColor: '#BFFF00',
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
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
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

  const { project, completion, primaryColor } = portalData
  const clientName = project.client_name || 'there'

  // Phase items for the brand launch roadmap
  const phases = [
    {
      icon: '🎨',
      title: 'Brand Identity',
      description: 'Logo refinement, color palette, typography, brand voice',
      status: 'in-progress' as const,
    },
    {
      icon: '📦',
      title: 'Packaging & Product',
      description: 'Premium box design, lash tray inserts, aftercare cards, bags',
      status: 'upcoming' as const,
    },
    {
      icon: '🌐',
      title: 'Website & E-Commerce',
      description: 'Your own website with online ordering and payment',
      status: 'upcoming' as const,
    },
    {
      icon: '📱',
      title: 'Marketing & Social',
      description: 'Instagram content strategy, launch campaign, email marketing',
      status: 'upcoming' as const,
    },
    {
      icon: '🎪',
      title: 'Vendor Fair Domination',
      description: 'Display setup, QR codes, pricing strategy, launch event',
      status: 'upcoming' as const,
    },
  ]

  // What we need from her
  const needsFromClient = [
    {
      icon: '📸',
      title: 'Product Photos',
      description: 'Each lash style on white background + being worn. Close-up detail shots.',
      priority: true,
      action: 'Upload in "Photos" category',
    },
    {
      icon: '🎨',
      title: 'Logo & Brand Files',
      description: 'Your current logo, any design files, fonts you use.',
      priority: true,
      action: 'Upload in "Logos" category',
    },
    {
      icon: '📋',
      title: 'Inventory List',
      description: 'Every lash style name, quantity in stock, cost per unit, selling price.',
      priority: true,
      action: 'Upload as document or photo of your list',
    },
    {
      icon: '📦',
      title: 'Packaging Photos',
      description: 'Photos of your current packaging — boxes, trays, bags, aftercare cards.',
      priority: false,
      action: 'Upload in "Packaging" category',
    },
    {
      icon: '🖼️',
      title: 'Inspiration & Mood Board',
      description: 'Screenshots of brands/packaging/websites you love. What vibe do you want?',
      priority: false,
      action: 'Upload in "Other" category',
    },
    {
      icon: '📝',
      title: 'Your Story',
      description: 'A few sentences about why you started this, what makes your lashes different.',
      priority: false,
      action: 'Can text to Ken or type in Documents',
    },
  ]

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: '#FAFAFA',
          }}
        >
          Welcome, {clientName} ✨
        </h1>
        <p style={{ margin: '6px 0 0', color: '#888', fontSize: 14 }}>
          Your brand launch headquarters. Here&apos;s everything happening.
        </p>
      </div>

      {/* Project Status Card */}
      <div
        style={{
          padding: 20,
          background: `linear-gradient(135deg, ${primaryColor}18, ${primaryColor}08)`,
          border: `1px solid ${primaryColor}33`,
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: '#888', letterSpacing: '0.05em' }}>PROJECT</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: '#FAFAFA', marginTop: 2 }}>
              {project.name}
            </div>
          </div>
          <div
            style={{
              padding: '6px 14px',
              background: `${primaryColor}25`,
              border: `1px solid ${primaryColor}44`,
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              color: primaryColor,
            }}
          >
            {completion}% Complete
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
          <div
            style={{
              height: '100%',
              width: `${Math.max(completion, 3)}%`,
              background: `linear-gradient(90deg, ${primaryColor}, ${config.accentColor})`,
              borderRadius: 3,
              transition: 'width 1s ease',
            }}
          />
        </div>
      </div>

      {/* What We Need — TOP PRIORITY */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#FAFAFA' }}>
            What We Need From You
          </h2>
          <Link
            href={`/portal/${clientSlug}/assets`}
            style={{
              padding: '8px 16px',
              background: primaryColor,
              color: '#0A0A0A',
              textDecoration: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Upload Files →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {needsFromClient.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                padding: '14px 16px',
                background: item.priority ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
                border: `1px solid ${item.priority ? primaryColor + '25' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 12,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>{item.title}</span>
                  {item.priority && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: primaryColor,
                      background: `${primaryColor}20`,
                      padding: '2px 8px',
                      borderRadius: 10,
                      letterSpacing: '0.05em',
                    }}>
                      PRIORITY
                    </span>
                  )}
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#999', lineHeight: 1.4 }}>
                  {item.description}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#666' }}>
                  → {item.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Roadmap */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 600, color: '#FAFAFA' }}>
          Your Launch Roadmap
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {phases.map((phase, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 16px',
                background: phase.status === 'in-progress'
                  ? `${primaryColor}10`
                  : 'rgba(255,255,255,0.015)',
                border: `1px solid ${phase.status === 'in-progress'
                  ? primaryColor + '33'
                  : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 12,
                alignItems: 'flex-start',
              }}
            >
              {/* Step number with line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: phase.status === 'in-progress'
                      ? `linear-gradient(135deg, ${primaryColor}, ${config.accentColor})`
                      : 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: phase.status === 'in-progress' ? '#0A0A0A' : '#666',
                    fontWeight: 700,
                  }}
                >
                  {phase.status === 'in-progress' ? phase.icon : i + 1}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: phase.status === 'in-progress' ? '#FAFAFA' : '#888',
                  }}>
                    {phase.title}
                  </span>
                  {phase.status === 'in-progress' && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#0A0A0A',
                      background: primaryColor,
                      padding: '2px 8px',
                      borderRadius: 10,
                    }}>
                      ACTIVE
                    </span>
                  )}
                </div>
                <p style={{
                  margin: '4px 0 0',
                  fontSize: 13,
                  color: phase.status === 'in-progress' ? '#AAA' : '#666',
                  lineHeight: 1.4,
                }}>
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Link
          href={`/portal/${clientSlug}/assets`}
          style={{
            padding: '20px 16px',
            background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}08)`,
            border: `1px solid ${primaryColor}33`,
            borderRadius: 14,
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>📤</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>Upload Files</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Send us your assets</div>
        </Link>

        <Link
          href={`/portal/${clientSlug}/deliverables`}
          style={{
            padding: '20px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 14,
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>Deliverables</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Review our work</div>
        </Link>

        <Link
          href={`/portal/${clientSlug}/activity`}
          style={{
            padding: '20px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 14,
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🕐</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>Activity</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Project updates</div>
        </Link>
      </div>

      {/* Recent Activity */}
      {activityItems.length > 0 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 600, color: '#FAFAFA' }}>
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activityItems.slice(0, 5).map((item, i) => {
              const iconMap: Record<string, string> = {
                task_created: '📋',
                task_shipped: '🚀',
                deliverable_uploaded: '📁',
                deliverable_approved: '✅',
                requirement_created: '📝',
                requirement_approved: '✅',
                feedback_received: '💬',
                milestone_reached: '🏆',
                project_update: '📌',
              }
              const icon = iconMap[item.type] || '📌'
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
          padding: 20,
          background: `linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(255, 0, 170, 0.08))`,
          border: '1px solid rgba(0, 240, 255, 0.15)',
          borderRadius: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#FAFAFA' }}>
          Questions? Need help?
        </h3>
        <p style={{ margin: '6px 0 14px', fontSize: 13, color: '#AAA' }}>
          Reach out anytime — we&apos;re building this together.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="mailto:ken@l7shift.com"
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 8,
              color: '#FAFAFA',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Email Ken →
          </a>
          <a
            href="sms:+19802437078"
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              color: '#AAA',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Text Ken →
          </a>
        </div>
      </div>
    </div>
  )
}

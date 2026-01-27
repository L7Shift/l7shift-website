'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ProgressRing,
  StatusPill,
  ActionCard,
  InsightCard,
  MetricCard,
  VelocitySparkline,
  ComparisonChart,
  ActivityFeed,
} from '@/components/dashboard'

// Mock data - will be replaced with Supabase queries
const mockProjects = [
  {
    id: '1',
    name: 'Scat Pack CLT',
    client: 'Eric Johnson',
    status: 'active' as const,
    completion: 78,
    shiftHours: 12.5,
    traditionalEstimate: 120,
    pendingActions: 2,
  },
  {
    id: '2',
    name: 'Pretty Paid Closet',
    client: 'Jazz',
    status: 'active' as const,
    completion: 35,
    shiftHours: 6,
    traditionalEstimate: 80,
    pendingActions: 1,
  },
  {
    id: '3',
    name: 'Stitchwichs',
    client: 'Nicole Walker',
    status: 'backlog' as const,
    completion: 0,
    shiftHours: 0,
    traditionalEstimate: 60,
    pendingActions: 0,
  },
]

const mockVelocity = [2, 3, 5, 4, 7, 8, 6, 9, 11, 8, 12, 10, 14, 13]

const mockActivity = [
  {
    id: '1',
    type: 'task_shipped' as const,
    title: 'Customer Portal Auth',
    actor: 'Ken',
    actorType: 'internal' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    type: 'deliverable_uploaded' as const,
    title: 'Brand Guide v2',
    actor: 'Ken',
    actorType: 'internal' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    type: 'feedback_added' as const,
    title: 'Homepage Design',
    actor: 'Jazz',
    actorType: 'client' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '4',
    type: 'requirement_approved' as const,
    title: 'Phase 1 Requirements',
    actor: 'Eric',
    actorType: 'client' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
]

export default function InternalDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate totals
  const totalShiftHours = mockProjects.reduce((sum, p) => sum + p.shiftHours, 0)
  const totalTraditionalHours = mockProjects.reduce((sum, p) => sum + p.traditionalEstimate, 0)
  const activeProjects = mockProjects.filter(p => p.status === 'active').length
  const totalPendingActions = mockProjects.reduce((sum, p) => sum + p.pendingActions, 0)

  if (!mounted) return null

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
            Dashboard
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14 }}>
            Project management overview
          </p>
        </div>
        <Link
          href="/internal/projects"
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
            color: '#0A0A0A',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          + New Project
        </Link>
      </div>

      {/* Top metrics row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard
          label="Active Projects"
          value={activeProjects}
          color="cyan"
          size="lg"
        />
        <MetricCard
          label="Pending Actions"
          value={totalPendingActions}
          color={totalPendingActions > 0 ? 'magenta' : 'white'}
          size="lg"
        />
        <MetricCard
          label="Shift Hours (Total)"
          value={`${totalShiftHours}h`}
          subValue={`vs ${totalTraditionalHours}h traditional`}
          color="lime"
          size="lg"
        />
        <div
          style={{
            padding: 16,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
          }}
        >
          <VelocitySparkline
            data={mockVelocity}
            label="Velocity (14 days)"
            value={mockVelocity[mockVelocity.length - 1]}
            width={160}
            height={50}
            color="cyan"
          />
        </div>
      </div>

      {/* Insights row */}
      {totalPendingActions > 0 && (
        <div style={{ marginBottom: 32 }}>
          <InsightCard
            type="action"
            title="Client Actions Needed"
            message={`${totalPendingActions} items are waiting for client review or approval. Clearing these will keep projects moving.`}
            actionLabel="View Pending Items"
            onAction={() => {}}
          />
        </div>
      )}

      {/* Main content grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 24,
        }}
      >
        {/* Left column - Projects */}
        <div>
          <h2
            style={{
              margin: '0 0 16px',
              fontSize: 18,
              fontWeight: 600,
              color: '#FAFAFA',
            }}
          >
            Active Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                href={`/internal/projects/${project.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="project-card"
                  style={{
                    padding: 20,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  {/* Progress ring */}
                  <ProgressRing
                    percentage={project.completion}
                    size="sm"
                    showLabel={false}
                    color={project.status === 'active' ? 'cyan' : 'lime'}
                  />

                  {/* Project info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 600,
                          color: '#FAFAFA',
                        }}
                      >
                        {project.name}
                      </h3>
                      <StatusPill status={project.status} size="sm" />
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
                      {project.client}
                    </p>
                  </div>

                  {/* Hours comparison */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#00F0FF' }}>
                      {project.shiftHours}h
                    </div>
                    <div style={{ fontSize: 11, color: '#666' }}>
                      of {project.traditionalEstimate}h est.
                    </div>
                  </div>

                  {/* Pending badge */}
                  {project.pendingActions > 0 && (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#FF00AA',
                        color: '#FAFAFA',
                        fontSize: 12,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 12px rgba(255, 0, 170, 0.4)',
                      }}
                    >
                      {project.pendingActions}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Time savings chart */}
          <div
            style={{
              marginTop: 24,
              padding: 20,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
            }}
          >
            <h3
              style={{
                margin: '0 0 16px',
                fontSize: 16,
                fontWeight: 600,
                color: '#FAFAFA',
              }}
            >
              SymbAIotic Shift\u2122 Impact
            </h3>
            <ComparisonChart
              shiftHours={totalShiftHours}
              traditionalHours={totalTraditionalHours}
              size="lg"
            />
          </div>
        </div>

        {/* Right column - Activity & Actions */}
        <div>
          {/* Quick actions */}
          <h2
            style={{
              margin: '0 0 16px',
              fontSize: 18,
              fontWeight: 600,
              color: '#FAFAFA',
            }}
          >
            Quick Actions
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <ActionCard
              icon="\uD83D\uDCCB"
              title="Review"
              subtitle="Deliverables"
              badge={2}
              badgeColor="magenta"
            />
            <ActionCard
              icon="\u2705"
              title="Approve"
              subtitle="Requirements"
              badge={1}
              badgeColor="cyan"
            />
            <ActionCard
              icon="\uD83D\uDCAC"
              title="Feedback"
              subtitle="New comments"
              badge={3}
              badgeColor="orange"
            />
            <ActionCard
              icon="\uD83D\uDCC4"
              title="Reports"
              subtitle="Generate"
            />
          </div>

          {/* Activity feed */}
          <h2
            style={{
              margin: '0 0 16px',
              fontSize: 18,
              fontWeight: 600,
              color: '#FAFAFA',
            }}
          >
            Recent Activity
          </h2>
          <div
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
            }}
          >
            <ActivityFeed items={mockActivity} maxItems={5} compact />
          </div>
        </div>
      </div>

      <style jsx>{`
        .project-card:hover {
          border-color: rgba(0, 240, 255, 0.5) !important;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
        }
      `}</style>
    </div>
  )
}

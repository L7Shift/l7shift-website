'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ProgressRing,
  StatusPill,
  TimelineBar,
  ComparisonChart,
  KanbanBoard,
  MetricCard,
  ActivityFeed,
  InsightCard,
} from '@/components/dashboard'

// Types
type TaskStatus = 'backlog' | 'active' | 'review' | 'shipped'
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  shiftHours: number
  traditionalEstimate: number
  assignedTo: string
}

// Mock data - will be replaced with Supabase queries
const mockProject = {
  id: '1',
  name: 'Scat Pack CLT',
  client: 'Eric Johnson',
  description: 'Dog waste removal SaaS platform with customer portal, crew management, and automated scheduling.',
  status: 'active' as const,
  startDate: '2026-01-01',
  targetEnd: '2026-02-15',
  shiftHours: 12.5,
  traditionalEstimate: 120,
  budget: 5000,
  budgetUsed: 2500,
}

const mockTasks: Task[] = [
  { id: '1', title: 'Customer portal auth', description: 'Magic link + PIN authentication', status: 'shipped', priority: 'high', shiftHours: 1.5, traditionalEstimate: 16, assignedTo: 'Ken' },
  { id: '2', title: 'Crew scheduling UI', description: 'Drag-drop schedule builder', status: 'shipped', priority: 'high', shiftHours: 2, traditionalEstimate: 24, assignedTo: 'Ken' },
  { id: '3', title: 'Route optimization', description: 'Google Maps integration for optimal routes', status: 'review', priority: 'medium', shiftHours: 1, traditionalEstimate: 12, assignedTo: 'Ken' },
  { id: '4', title: 'Payment processing', description: 'Stripe integration for recurring billing', status: 'active', priority: 'high', shiftHours: 0.5, traditionalEstimate: 20, assignedTo: 'Ken' },
  { id: '5', title: 'Email notifications', description: 'Automated service reminders', status: 'active', priority: 'medium', shiftHours: 0, traditionalEstimate: 8, assignedTo: 'Ken' },
  { id: '6', title: 'Analytics dashboard', description: 'Business metrics and KPIs', status: 'backlog', priority: 'low', shiftHours: 0, traditionalEstimate: 16, assignedTo: 'Ken' },
  { id: '7', title: 'Mobile app wrapper', description: 'PWA configuration', status: 'backlog', priority: 'low', shiftHours: 0, traditionalEstimate: 8, assignedTo: 'Ken' },
]

const mockPhases = [
  { name: 'Discovery', status: 'completed' as const },
  { name: 'Design', status: 'completed' as const },
  { name: 'Build', status: 'active' as const },
  { name: 'Launch', status: 'upcoming' as const },
]

const mockActivity = [
  { id: '1', type: 'task_shipped' as const, title: 'Crew scheduling UI', actor: 'Ken', actorType: 'internal' as const, timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: '2', type: 'feedback_added' as const, title: 'Route optimization', actor: 'Eric', actorType: 'client' as const, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: '3', type: 'task_created' as const, title: 'Email notifications', actor: 'Ken', actorType: 'internal' as const, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) },
]

export default function ProjectDetailPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ))
  }

  const totalShiftHours = tasks.reduce((sum, t) => sum + t.shiftHours, 0)
  const totalTraditionalHours = tasks.reduce((sum, t) => sum + t.traditionalEstimate, 0)
  const completedTasks = tasks.filter(t => t.status === 'shipped').length
  const completion = Math.round((completedTasks / tasks.length) * 100)
  const reviewTasks = tasks.filter(t => t.status === 'review').length

  if (!mounted) return null

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Link href="/internal/projects" style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>
          Projects
        </Link>
        <span style={{ color: '#444', margin: '0 8px' }}>/</span>
        <span style={{ color: '#FAFAFA', fontSize: 13 }}>{mockProject.name}</span>
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: '#FAFAFA',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              {mockProject.name}
            </h1>
            <StatusPill status={mockProject.status} />
          </div>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14, maxWidth: 600 }}>
            {mockProject.description}
          </p>
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 13 }}>
            Client: <span style={{ color: '#00F0FF' }}>{mockProject.client}</span>
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
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'kanban' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: 6,
                color: viewMode === 'kanban' ? '#00F0FF' : '#888',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Kanban
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
                fontSize: 13,
              }}
            >
              List
            </button>
          </div>

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
            + Add Task
          </button>
        </div>
      </div>

      {/* Top metrics row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: 24,
          marginBottom: 24,
          padding: 20,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
        }}
      >
        {/* Progress ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ProgressRing
            percentage={completion}
            size="lg"
            label="Complete"
            color="gradient"
          />
          <div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Tasks</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FAFAFA' }}>
              {completedTasks}/{tasks.length}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '0 20px' }}>
          <TimelineBar
            phases={mockPhases}
            startDate={mockProject.startDate}
            endDate={mockProject.targetEnd}
            size="md"
          />
        </div>

        {/* Quick metrics */}
        <div style={{ display: 'flex', gap: 16 }}>
          <MetricCard
            label="Shift Hours"
            value={`${totalShiftHours}h`}
            color="cyan"
            size="sm"
          />
          <MetricCard
            label="Est. Savings"
            value={`${Math.round(((totalTraditionalHours - totalShiftHours) / totalTraditionalHours) * 100)}%`}
            color="lime"
            size="sm"
          />
        </div>
      </div>

      {/* Insight if there are items in review */}
      {reviewTasks > 0 && (
        <div style={{ marginBottom: 24 }}>
          <InsightCard
            type="action"
            title={`${reviewTasks} item${reviewTasks > 1 ? 's' : ''} ready for review`}
            message="These tasks are complete and waiting for client feedback or approval."
            actionLabel="Send Review Request"
            onAction={() => {}}
          />
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 24,
        }}
      >
        {/* Kanban board */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <KanbanBoard
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onTaskClick={(task) => console.log('Clicked task:', task)}
          />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hours comparison */}
          <div
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
            }}
          >
            <h3
              style={{
                margin: '0 0 16px',
                fontSize: 14,
                fontWeight: 600,
                color: '#FAFAFA',
              }}
            >
              SymbAIotic Shift\u2122 Impact
            </h3>
            <ComparisonChart
              shiftHours={totalShiftHours}
              traditionalHours={totalTraditionalHours}
              size="sm"
            />
          </div>

          {/* Activity feed */}
          <div
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
            }}
          >
            <h3
              style={{
                margin: '0 0 16px',
                fontSize: 14,
                fontWeight: 600,
                color: '#FAFAFA',
              }}
            >
              Recent Activity
            </h3>
            <ActivityFeed items={mockActivity} maxItems={5} compact />
          </div>

          {/* Budget */}
          <div
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
            }}
          >
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: 14,
                fontWeight: 600,
                color: '#FAFAFA',
              }}
            >
              Budget
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#888' }}>Used</span>
              <span style={{ fontSize: 12, color: '#FAFAFA' }}>
                ${mockProject.budgetUsed.toLocaleString()} / ${mockProject.budget.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(mockProject.budgetUsed / mockProject.budget) * 100}%`,
                  background: 'linear-gradient(90deg, #00F0FF, #BFFF00)',
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 8 }}>
              {Math.round((mockProject.budgetUsed / mockProject.budget) * 100)}% of budget used, {completion}% complete
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

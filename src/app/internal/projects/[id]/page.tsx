'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Project, Task, ActivityLogEntry, TaskStatus, TaskPriority, Database } from '@/lib/database.types'

type TaskUpdate = Database['public']['Tables']['tasks']['Update']
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

interface KanbanTask {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  shiftHours: number
  traditionalEstimate: number
  assignedTo: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activity, setActivity] = useState<ActivityLogEntry[]>([])
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [loading, setLoading] = useState(true)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  async function fetchProjectData() {
    if (!supabase) {
      console.error('Supabase client not initialized')
      setLoading(false)
      return
    }

    const db = supabase!

    try {
      // Fetch project
      const { data: projectData, error: projectError } = await db
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (projectError) throw projectError
      setProject(projectData)

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await db
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true })

      if (!tasksError && tasksData) {
        setTasks(tasksData)
      }

      // Fetch activity
      const { data: activityData, error: activityError } = await db
        .from('activity_log')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (!activityError && activityData) {
        setActivity(activityData)
      }
    } catch (error) {
      console.error('Error fetching project data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleTaskMove(taskId: string, newStatus: TaskStatus) {
    if (!supabase) return
    const db = supabase!

    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus, shipped_at: newStatus === 'shipped' ? new Date().toISOString() : t.shipped_at } : t
    ))

    try {
      const updateData: TaskUpdate = { status: newStatus }
      if (newStatus === 'shipped') {
        updateData.shipped_at = new Date().toISOString()
      }

      const { error } = await (db as any)
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)

      if (error) throw error

      // Log activity
      await (db as any).from('activity_log').insert({
        project_id: projectId,
        entity_type: 'task',
        entity_id: taskId,
        action: newStatus === 'shipped' ? 'task_shipped' : 'task_updated',
        actor: 'Ken', // TODO: Use actual user
        actor_type: 'internal',
        metadata: { title: tasks.find(t => t.id === taskId)?.title, new_status: newStatus },
      })
    } catch (error) {
      console.error('Error updating task:', error)
      // Revert on error
      fetchProjectData()
    }
  }

  // Transform tasks for KanbanBoard component
  const kanbanTasks: KanbanTask[] = tasks.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description || '',
    status: t.status,
    priority: t.priority,
    shiftHours: t.shift_hours,
    traditionalEstimate: t.traditional_hours_estimate,
    assignedTo: t.assigned_to || 'Unassigned',
  }))

  // Transform activity for ActivityFeed component
  const activityItems = activity.map(a => ({
    id: a.id,
    type: a.action as 'task_shipped' | 'deliverable_uploaded' | 'feedback_added' | 'requirement_approved' | 'task_created',
    title: (a.metadata as { title?: string })?.title || a.entity_type,
    actor: a.actor,
    actorType: a.actor_type as 'internal' | 'client',
    timestamp: new Date(a.created_at),
  }))

  // Calculate metrics
  const totalShiftHours = tasks.reduce((sum, t) => sum + t.shift_hours, 0)
  const totalTraditionalHours = tasks.reduce((sum, t) => sum + t.traditional_hours_estimate, 0)
  const completedTasks = tasks.filter(t => t.status === 'shipped').length
  const completion = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
  const reviewTasks = tasks.filter(t => t.status === 'review').length

  // Mock phases - could be derived from project data or sprints
  const mockPhases = [
    { name: 'Discovery', status: 'completed' as const },
    { name: 'Design', status: 'completed' as const },
    { name: 'Build', status: completion >= 100 ? 'completed' as const : 'active' as const },
    { name: 'Launch', status: completion >= 100 ? 'completed' as const : 'upcoming' as const },
  ]

  if (loading) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ color: '#888' }}>Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ color: '#888' }}>Project not found</div>
        <Link href="/internal/projects" style={{ color: '#00F0FF', marginTop: 16, display: 'inline-block' }}>
          ← Back to projects
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Link href="/internal/projects" style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>
          Projects
        </Link>
        <span style={{ color: '#444', margin: '0 8px' }}>/</span>
        <span style={{ color: '#FAFAFA', fontSize: 13 }}>{project.name}</span>
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
              {project.name}
            </h1>
            <StatusPill status={project.status} />
          </div>
          {project.description && (
            <p style={{ margin: '8px 0 0', color: '#888', fontSize: 14, maxWidth: 600 }}>
              {project.description}
            </p>
          )}
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 13 }}>
            Client: <span style={{ color: '#00F0FF' }}>{project.client_name}</span>
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
            onClick={() => setShowAddTaskModal(true)}
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
            startDate={project.start_date || new Date().toISOString()}
            endDate={project.target_end_date || new Date().toISOString()}
            size="md"
          />
        </div>

        {/* Quick metrics */}
        <div style={{ display: 'flex', gap: 16 }}>
          <MetricCard
            label="Shift Hours"
            value={`${totalShiftHours.toFixed(1)}h`}
            color="cyan"
            size="sm"
          />
          <MetricCard
            label="Est. Savings"
            value={totalTraditionalHours > 0 ? `${Math.round(((totalTraditionalHours - totalShiftHours) / totalTraditionalHours) * 100)}%` : '-'}
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
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#FAFAFA' }}>No tasks yet</h3>
              <p style={{ margin: '0 0 16px', color: '#888', fontSize: 13 }}>
                Add your first task to start tracking work
              </p>
              <button
                onClick={() => setShowAddTaskModal(true)}
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
          ) : (
            <KanbanBoard
              tasks={kanbanTasks}
              onTaskMove={handleTaskMove}
              onTaskClick={(task) => console.log('Clicked task:', task)}
            />
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hours comparison */}
          {totalTraditionalHours > 0 && (
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
                SymbAIotic Shift™ Impact
              </h3>
              <ComparisonChart
                shiftHours={totalShiftHours}
                traditionalHours={totalTraditionalHours}
                size="sm"
              />
            </div>
          )}

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
            {activityItems.length > 0 ? (
              <ActivityFeed items={activityItems} maxItems={5} compact />
            ) : (
              <p style={{ color: '#666', fontSize: 13, textAlign: 'center', padding: 12 }}>
                No activity yet
              </p>
            )}
          </div>

          {/* Budget */}
          {project.budget_total && (
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
                  ${(project.budget_used || 0).toLocaleString()} / ${project.budget_total.toLocaleString()}
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
                    width: `${((project.budget_used || 0) / project.budget_total) * 100}%`,
                    background: 'linear-gradient(90deg, #00F0FF, #BFFF00)',
                    borderRadius: 4,
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 8 }}>
                {Math.round(((project.budget_used || 0) / project.budget_total) * 100)}% of budget used, {completion}% complete
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <AddTaskModal
          projectId={projectId}
          onClose={() => setShowAddTaskModal(false)}
          onSuccess={() => {
            setShowAddTaskModal(false)
            fetchProjectData()
          }}
        />
      )}
    </div>
  )
}

// Add Task Modal Component
function AddTaskModal({
  projectId,
  onClose,
  onSuccess,
}: {
  projectId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [traditionalEstimate, setTraditionalEstimate] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !supabase) return
    const db = supabase!

    setSaving(true)
    try {
      const { error } = await (db as any).from('tasks').insert({
        project_id: projectId,
        title,
        description: description || null,
        priority,
        traditional_hours_estimate: parseInt(traditionalEstimate) || 0,
        status: 'backlog',
        shift_hours: 0,
      })

      if (error) throw error

      // Log activity
      await (db as any).from('activity_log').insert({
        project_id: projectId,
        entity_type: 'task',
        entity_id: 'new', // Will be replaced with actual ID
        action: 'task_created',
        actor: 'Ken', // TODO: Use actual user
        actor_type: 'internal',
        metadata: { title },
      })

      onSuccess()
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Failed to create task')
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
        <h2 style={{ margin: '0 0 24px', fontSize: 20, color: '#FAFAFA' }}>New Task</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              placeholder="e.g., Implement user authentication"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
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
              placeholder="Brief task description..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
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
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 8 }}>
                Traditional Estimate (hrs)
              </label>
              <input
                type="number"
                value={traditionalEstimate}
                onChange={(e) => setTraditionalEstimate(e.target.value)}
                min="0"
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
                placeholder="e.g., 8"
              />
            </div>
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
              disabled={saving || !title}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #00F0FF, #FF00AA)',
                border: 'none',
                borderRadius: 8,
                color: '#0A0A0A',
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving || !title ? 0.5 : 1,
              }}
            >
              {saving ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

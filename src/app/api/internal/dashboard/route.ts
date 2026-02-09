/**
 * /api/internal/dashboard - Dashboard data endpoint
 *
 * GET - Returns projects with metrics, recent activity, and velocity data
 * Uses service role key to bypass RLS
 */

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { Project } from '@/lib/database.types'

export async function GET() {
  try {
    const supabase = createServerClient()

    // Fetch projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })

    if (projectsError) throw projectsError

    const projects = (projectsData || []) as Project[]

    // Fetch task counts for each project
    const projectsWithMetrics = await Promise.all(
      projects.map(async (project) => {
        const { data: tasks } = await supabase
          .from('tasks')
          .select('status, shift_hours, traditional_hours_estimate')
          .eq('project_id', project.id)

        const taskList = (tasks || []) as { status: string; shift_hours: number | null; traditional_hours_estimate: number | null }[]
        const shippedTasks = taskList.filter(t => t.status === 'shipped')
        const reviewTasks = taskList.filter(t => t.status === 'review')

        return {
          ...project,
          total_tasks: taskList.length,
          shipped_tasks: shippedTasks.length,
          total_shift_hours: taskList.reduce((sum, t) => sum + (t.shift_hours || 0), 0),
          total_traditional_estimate: taskList.reduce((sum, t) => sum + (t.traditional_hours_estimate || 0), 0),
          pending_actions: reviewTasks.length,
        }
      })
    )

    // Fetch recent activity
    const { data: activityData } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Calculate velocity (tasks shipped per day over last 14 days)
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    const { data: recentTasks } = await supabase
      .from('tasks')
      .select('shipped_at')
      .not('shipped_at', 'is', null)
      .gte('shipped_at', fourteenDaysAgo.toISOString())

    const velocityMap = new Map<string, number>()
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))
      velocityMap.set(date.toISOString().split('T')[0], 0)
    }

    ((recentTasks || []) as { shipped_at: string | null }[]).forEach(task => {
      if (task.shipped_at) {
        const day = task.shipped_at.split('T')[0]
        if (velocityMap.has(day)) {
          velocityMap.set(day, (velocityMap.get(day) || 0) + 1)
        }
      }
    })

    return NextResponse.json({
      projects: projectsWithMetrics,
      activity: activityData || [],
      velocity: Array.from(velocityMap.values()),
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

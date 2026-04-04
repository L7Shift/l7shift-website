import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Slug → project lookup config (mirrors CLIENT_SLUG_MAP in portal-utils)
const SLUG_CONFIG: Record<string, { projectName?: string; clientName?: string }> = {
  'stitchwichs': { projectName: 'Stitchwichs', clientName: 'Nicole' },
  'scat-pack-clt': { projectName: 'Scat Pack', clientName: 'Ken' },
  'prettypaidcloset': { projectName: 'Pretty Paid', clientName: 'Jazz' },
  'shariels-lashes': { projectName: 'Shariels Lashes', clientName: 'Shariel' },
  'c2c': { projectName: 'College 2 Corporate' },
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }

    const config = SLUG_CONFIG[slug]
    if (!config) {
      return NextResponse.json({ error: 'Unknown client slug' }, { status: 404 })
    }

    const supabase = getSupabase()

    // Find project
    let query = supabase.from('projects').select('*')
    if (config.projectName) {
      query = query.ilike('name', `%${config.projectName}%`)
    } else if (config.clientName) {
      query = query.ilike('client_name', `%${config.clientName}%`)
    }

    const { data: projects, error: projectError } = await query.limit(1)
    if (projectError || !projects || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = projects[0]

    // Parallel fetch: tasks, pending requirements, pending deliverables, open bugs, open requests
    const [tasksRes, reqsRes, delsRes, bugsRes, requestsRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('project_id', project.id).order('order_index', { ascending: true }),
      supabase.from('requirements_docs').select('id').eq('project_id', project.id).eq('status', 'review'),
      supabase.from('deliverables').select('id').eq('project_id', project.id).in('status', ['in_review', 'pending']),
      supabase.from('bug_reports').select('id').eq('project_id', project.id).not('status', 'in', '("resolved","closed","wont_fix")'),
      supabase.from('client_requests').select('id').eq('project_id', project.id).not('status', 'in', '("completed","declined","withdrawn")'),
    ])

    const tasks = tasksRes.data || []
    const activeTasks = tasks.filter((t: { status: string }) => t.status !== 'icebox')
    const shippedCount = activeTasks.filter((t: { status: string }) => t.status === 'shipped').length
    const completion = activeTasks.length > 0 ? Math.round((shippedCount / activeTasks.length) * 100) : 0
    const shiftHours = activeTasks.reduce((sum: number, t: { shift_hours?: number }) => sum + (t.shift_hours || 0), 0)
    const traditionalEstimate = activeTasks.reduce((sum: number, t: { traditional_hours_estimate?: number }) => sum + (t.traditional_hours_estimate || 0), 0)

    return NextResponse.json({
      project,
      tasks,
      completion,
      shiftHours,
      traditionalEstimate,
      pendingApprovals: reqsRes.data?.length || 0,
      pendingDeliverables: delsRes.data?.length || 0,
      openBugs: bugsRes.data?.length || 0,
      openRequests: requestsRes.data?.length || 0,
    })
  } catch (err) {
    console.error('Project lookup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

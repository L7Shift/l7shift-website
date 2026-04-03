import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const limit = parseInt(searchParams.get('limit') || '100')
    const status = searchParams.get('status')

    let query = supabase
      .from('client_requests')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: requests, error } = await query

    if (error) {
      console.error('Failed to fetch requests:', error)
      return NextResponse.json({ error: 'Failed to load requests' }, { status: 500 })
    }

    return NextResponse.json({ requests: requests || [] })
  } catch (err) {
    console.error('Request list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, title, description, priority, clientName } = await req.json()

    if (!projectId || !title?.trim()) {
      return NextResponse.json({ error: 'Project ID and title are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Primary: insert into client_requests table
    const { data: request, error: requestError } = await supabase.from('client_requests').insert({
      project_id: projectId,
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'normal',
      status: 'open',
      requested_by: clientName || 'Client',
      requested_by_type: 'client',
    }).select().single()

    if (requestError) {
      console.error('Failed to create client request:', requestError)
      return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
    }

    // Secondary: audit trail in activity_log
    await supabase.from('activity_log').insert({
      project_id: projectId,
      entity_type: 'client_request',
      entity_id: request.id,
      action: priority === 'urgent' ? 'urgent_request' : 'client_request',
      actor: clientName || 'Client',
      actor_type: 'client',
      metadata: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'normal',
        submitted_at: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, requestId: request.id })
  } catch (err) {
    console.error('Client request error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

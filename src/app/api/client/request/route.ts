import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, title, description, priority, clientName } = await req.json()

    if (!projectId || !title?.trim()) {
      return NextResponse.json({ error: 'Project ID and title are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Log as activity
    const { error: activityError } = await supabase.from('activity_log').insert({
      project_id: projectId,
      entity_type: 'client_request',
      entity_id: projectId,
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

    if (activityError) {
      console.error('Failed to log client request:', activityError)
      return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Client request error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

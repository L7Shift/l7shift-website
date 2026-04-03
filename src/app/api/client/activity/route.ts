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
    const limit = parseInt(searchParams.get('limit') || '50')

    const { data: entries, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Failed to fetch activity:', error)
      return NextResponse.json({ error: 'Failed to load activity' }, { status: 500 })
    }

    return NextResponse.json({ activity: entries || [] })
  } catch (err) {
    console.error('Activity list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

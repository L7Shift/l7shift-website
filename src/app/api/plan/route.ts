/**
 * GET /api/plan?project_id=...
 * List plan documents for a project
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    if (!projectId || !UUID_REGEX.test(projectId)) {
      return NextResponse.json(
        { error: 'Valid project_id query parameter required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data, error } = await (supabase
      .from('plan_documents') as ReturnType<typeof supabase.from>)
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching plan documents:', error)
      return NextResponse.json(
        { error: 'Failed to fetch plan documents' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Error in plan route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * /api/plan/[id] — Single Plan Document API
 * GET  — Fetch plan document
 * PATCH — Update current_content (client edits)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const VALID_STATUSES = ['draft', 'review', 'approved']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: 'Invalid plan ID format' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await (supabase
      .from('plan_documents') as ReturnType<typeof supabase.from>)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      console.error('Error fetching plan:', error)
      return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in plan GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: 'Invalid plan ID format' }, { status: 400 })
    }

    const supabase = createServerClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {}
    let hasUpdates = false

    if (body.current_content !== undefined) {
      if (typeof body.current_content !== 'string') {
        return NextResponse.json({ error: 'current_content must be a string' }, { status: 400 })
      }
      updateData.current_content = body.current_content
      hasUpdates = true
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: `Invalid status. Must be: ${VALID_STATUSES.join(', ')}` }, { status: 400 })
      }
      updateData.status = body.status
      hasUpdates = true
    }

    if (body.last_edited_by !== undefined) {
      updateData.last_edited_by = body.last_edited_by
    }

    if (!hasUpdates) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
    }

    updateData.updated_at = new Date().toISOString()
    updateData.last_edited_at = new Date().toISOString()

    const { data, error } = await (supabase
      .from('plan_documents') as ReturnType<typeof supabase.from>)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      console.error('Error updating plan:', error)
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in plan PATCH:', error)
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

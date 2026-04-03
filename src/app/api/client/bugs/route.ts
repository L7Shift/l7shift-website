import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// POST — Submit a new bug report
export async function POST(req: NextRequest) {
  try {
    const { projectId, title, description, url, severity, clientName, screenshotPaths } = await req.json()

    if (!projectId || !title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Project ID, title, and description are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Get project for slug prefix
    const { data: project } = await supabase.from('projects').select('name').eq('id', projectId).single()
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const nameWords = project.name.split(/\s+/)
    const slugPrefix = nameWords.length >= 2
      ? (nameWords[0][0] + nameWords[1][0]).toUpperCase()
      : project.name.substring(0, 2).toUpperCase()

    // Generate bug number
    const { data: bugNumber, error: rpcError } = await supabase.rpc('generate_bug_number', {
      p_project_id: projectId,
      p_slug_prefix: slugPrefix,
    })

    const finalBugNumber = rpcError ? `BUG-${slugPrefix}-${Date.now()}` : bugNumber

    // Insert bug report
    const { data: bug, error: insertError } = await supabase.from('bug_reports').insert({
      project_id: projectId,
      bug_number: finalBugNumber,
      title: title.trim(),
      description: description.trim(),
      url: url?.trim() || null,
      severity: severity || 'medium',
      status: 'reported',
      reported_by: clientName || 'Client',
      reported_by_type: 'client',
      screenshot_paths: screenshotPaths || null,
    }).select().single()

    if (insertError) {
      console.error('Failed to create bug report:', insertError)
      return NextResponse.json({ error: 'Failed to submit bug report' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: projectId,
      entity_type: 'bug_report',
      entity_id: bug.id,
      action: severity === 'critical' ? 'critical_bug_reported' : 'bug_reported',
      actor: clientName || 'Client',
      actor_type: 'client',
      metadata: {
        bug_number: finalBugNumber,
        title: title.trim(),
        severity: severity || 'medium',
        url: url?.trim() || null,
        submitted_at: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, bug: { id: bug.id, bug_number: finalBugNumber } })
  } catch (err) {
    console.error('Bug report error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET — List bugs for a project
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    const supabase = getSupabase()

    let query = supabase
      .from('bug_reports')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (status) query = query.eq('status', status)

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch bugs:', error)
      return NextResponse.json({ error: 'Failed to fetch bugs' }, { status: 500 })
    }

    return NextResponse.json({ bugs: data || [] })
  } catch (err) {
    console.error('Bug list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH — Add a client note to a bug
export async function PATCH(req: NextRequest) {
  try {
    const { bugId, note } = await req.json()

    if (!bugId || !note?.content?.trim()) {
      return NextResponse.json({ error: 'Bug ID and note content are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Get current notes
    const { data: existing, error: fetchError } = await supabase
      .from('bug_reports')
      .select('notes, project_id, bug_number')
      .eq('id', bugId)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Bug not found' }, { status: 404 })
    }

    const currentNotes = existing.notes || []
    currentNotes.push({
      author: note.author || 'Client',
      content: note.content.trim(),
      created_at: new Date().toISOString(),
    })

    const { data: updated, error: updateError } = await supabase
      .from('bug_reports')
      .update({ notes: currentNotes })
      .eq('id', bugId)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update bug:', updateError)
      return NextResponse.json({ error: 'Failed to add note' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: existing.project_id,
      entity_type: 'bug_report',
      entity_id: bugId,
      action: 'bug_note_added',
      actor: note.author || 'Client',
      actor_type: 'client',
      metadata: { bug_number: existing.bug_number, note: note.content.trim() },
    })

    return NextResponse.json({ success: true, bug: updated })
  } catch (err) {
    console.error('Bug note error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

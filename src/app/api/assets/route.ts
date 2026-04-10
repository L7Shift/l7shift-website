import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// POST: Upload file to client-uploads bucket
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const projectId = formData.get('projectId') as string | null
    const category = formData.get('category') as string | null
    const subcategory = formData.get('subcategory') as string | null
    const description = formData.get('description') as string | null

    if (!file || !projectId) {
      return NextResponse.json({ error: 'File and projectId are required' }, { status: 400 })
    }

    // Validate file size (50MB)
    if (file.size > 52_428_800) {
      return NextResponse.json({ error: 'File too large. Maximum 50MB.' }, { status: 400 })
    }

    const db = getSupabase()

    // Verify project exists
    const { data: project } = await db
      .from('projects')
      .select('id, name, client_name')
      .eq('id', projectId)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Generate storage path — subcategory (if present) encoded as filename prefix: `{subcategory}__{timestamp}_{safename}`
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const safeSubcategory = subcategory ? subcategory.replace(/[^a-zA-Z0-9-]/g, '') : ''
    const filenamePart = safeSubcategory
      ? `${safeSubcategory}__${timestamp}_${safeName}`
      : `${timestamp}_${safeName}`
    const storagePath = `${projectId}/${category || 'general'}/${filenamePart}`

    // Upload to Supabase storage
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await db.storage
      .from('client-uploads')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 })
    }

    // Log to activity_log. entity_id is NOT NULL on activity_log, and uploads
    // don't have a primary record id yet, so anchor to the project itself.
    await db.from('activity_log').insert({
      project_id: projectId,
      entity_type: 'upload',
      entity_id: projectId,
      action: 'file_uploaded',
      actor: project.client_name || 'Client',
      actor_type: 'client',
      metadata: {
        title: `${project.client_name} uploaded: ${file.name}`,
        description: description || `File: ${file.name} (${(file.size / 1024).toFixed(1)}KB) — Category: ${category || 'general'}`,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: storagePath,
        category: category || 'general',
        subcategory: safeSubcategory || null,
      },
    })

    // Fire event to Artemis — she decides what to do
    const artemisUrl = `${req.nextUrl.origin}/api/artemis/webhook`
    fetch(artemisUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ARTEMIS_WEBHOOK_SECRET || ''}`,
      },
      body: JSON.stringify({
        type: 'INSERT',
        table: 'client_uploads',
        event_type: 'client_upload',
        record: {
          project_id: projectId,
          project_name: project.name,
          client_name: project.client_name,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          category: category || 'general',
          storage_path: storagePath,
        },
        context: {
          project_id: projectId,
          project_name: project.name,
          client_name: project.client_name,
        },
      }),
    }).catch(err => console.error('[ARTEMIS] Upload event failed:', err))

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
        path: storagePath,
        category: category || 'general',
      },
    })
  } catch (err) {
    console.error('Asset upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: List uploaded assets for a project
export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }

  try {
    const db = getSupabase()

    // List files in the project's folder
    const { data: files, error } = await db.storage
      .from('client-uploads')
      .list(projectId, {
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('List error:', error)
      return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }

    // Get files from subfolders too
    const allFiles: Array<{
      name: string
      category: string
      subcategory: string | null
      size: number
      created_at: string
      path: string
      url: string | null
    }> = []

    // Parse subcategory from filename prefix: `{subcategory}__{timestamp}_{safename}`
    const parseFilename = (raw: string): { display: string; subcategory: string | null } => {
      const subMatch = raw.match(/^([a-zA-Z0-9-]+)__(\d+_.+)$/)
      if (subMatch) {
        return { display: subMatch[2].replace(/^\d+_/, ''), subcategory: subMatch[1] }
      }
      return { display: raw.replace(/^\d+_/, ''), subcategory: null }
    }

    // List category folders
    const categories = (files || []).filter(f => !f.name.includes('.'))
    const directFiles = (files || []).filter(f => f.name.includes('.'))

    // Add direct files
    for (const f of directFiles) {
      const { data: urlData } = await db.storage
        .from('client-uploads')
        .createSignedUrl(`${projectId}/${f.name}`, 3600)

      const parsed = parseFilename(f.name)
      allFiles.push({
        name: parsed.display,
        category: 'general',
        subcategory: parsed.subcategory,
        size: (f.metadata as Record<string, unknown>)?.size as number || 0,
        created_at: f.created_at || '',
        path: `${projectId}/${f.name}`,
        url: urlData?.signedUrl || null,
      })
    }

    // List files in each category folder
    for (const cat of categories) {
      const { data: catFiles } = await db.storage
        .from('client-uploads')
        .list(`${projectId}/${cat.name}`)

      for (const f of catFiles || []) {
        if (!f.name.includes('.')) continue
        const fullPath = `${projectId}/${cat.name}/${f.name}`
        const { data: urlData } = await db.storage
          .from('client-uploads')
          .createSignedUrl(fullPath, 3600)

        const parsed = parseFilename(f.name)
        allFiles.push({
          name: parsed.display,
          category: cat.name,
          subcategory: parsed.subcategory,
          size: (f.metadata as Record<string, unknown>)?.size as number || 0,
          created_at: f.created_at || '',
          path: fullPath,
          url: urlData?.signedUrl || null,
        })
      }
    }

    return NextResponse.json({ files: allFiles })
  } catch (err) {
    console.error('Asset list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Remove an uploaded asset
export async function DELETE(req: NextRequest) {
  const { path } = await req.json()

  if (!path) {
    return NextResponse.json({ error: 'path is required' }, { status: 400 })
  }

  try {
    const db = getSupabase()
    const { error } = await db.storage
      .from('client-uploads')
      .remove([path])

    if (error) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Asset delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

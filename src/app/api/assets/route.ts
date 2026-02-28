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

    // Generate storage path
    const ext = file.name.split('.').pop() || 'bin'
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${projectId}/${category || 'general'}/${timestamp}_${safeName}`

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

    // Log to activity_log
    await db.from('activity_log').insert({
      project_id: projectId,
      event_type: 'asset_uploaded',
      title: `${project.client_name} uploaded: ${file.name}`,
      description: description || `File: ${file.name} (${(file.size / 1024).toFixed(1)}KB) — Category: ${category || 'general'}`,
      metadata: {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: storagePath,
        category: category || 'general',
      },
    })

    // Notify Ken via email on upload
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'L7 Shift <ken@l7shift.com>',
          to: ['ken@l7shift.com'],
          subject: `📤 ${project.client_name} uploaded: ${file.name}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; background: #0A0A0A; color: #FAFAFA; padding: 32px; border-radius: 12px;">
              <h2 style="color: #00F0FF; margin: 0 0 16px;">New Client Upload</h2>
              <table style="font-size: 14px; color: #CCC;">
                <tr><td style="padding: 4px 16px 4px 0; color: #888;">Client</td><td>${project.client_name}</td></tr>
                <tr><td style="padding: 4px 16px 4px 0; color: #888;">Project</td><td>${project.name}</td></tr>
                <tr><td style="padding: 4px 16px 4px 0; color: #888;">File</td><td>${file.name}</td></tr>
                <tr><td style="padding: 4px 16px 4px 0; color: #888;">Size</td><td>${(file.size / 1024).toFixed(1)} KB</td></tr>
                <tr><td style="padding: 4px 16px 4px 0; color: #888;">Category</td><td>${category || 'general'}</td></tr>
              </table>
              <div style="margin-top: 20px;">
                <a href="https://l7shift.com/internal" style="background: #00F0FF; color: #0A0A0A; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px;">
                  Review in ShiftBoard →
                </a>
              </div>
            </div>
          `,
        }),
      }).catch(err => console.error('Upload notification failed:', err))
    }

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
      size: number
      created_at: string
      path: string
      url: string | null
    }> = []

    // List category folders
    const categories = (files || []).filter(f => !f.name.includes('.'))
    const directFiles = (files || []).filter(f => f.name.includes('.'))

    // Add direct files
    for (const f of directFiles) {
      const { data: urlData } = await db.storage
        .from('client-uploads')
        .createSignedUrl(`${projectId}/${f.name}`, 3600)

      allFiles.push({
        name: f.name,
        category: 'general',
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

        allFiles.push({
          name: f.name.replace(/^\d+_/, ''), // Strip timestamp prefix
          category: cat.name,
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

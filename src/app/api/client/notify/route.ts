import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const resend = new Resend(process.env.RESEND_API_KEY)

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

function generateEmailHTML(title: string, bodyContent: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #FAFAFA; margin: 0; padding: 0; background: #0A0A0A;">
<table width="100%" cellpadding="0" cellspacing="0" style="background: #0A0A0A; padding: 20px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #1A1A1A; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
<tr><td style="padding: 24px; text-align: center; background: linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,0,170,0.1)); border-bottom: 1px solid rgba(255,255,255,0.1);">
<h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #00F0FF;">L7 SHIFT</h1>
<p style="color: #888; margin: 8px 0 0; font-size: 12px; letter-spacing: 2px;">THE SYMB<span style="color: #00F0FF;">AI</span>OTIC SHIFT&trade;</p>
</td></tr>
<tr><td style="padding: 32px 24px;">${bodyContent}</td></tr>
<tr><td style="background: #0A0A0A; padding: 16px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
<p style="color: #666; font-size: 11px; margin: 0;"><a href="https://l7shift.com" style="color: #00F0FF;">l7shift.com</a></p>
</td></tr></table></td></tr></table></body></html>`
}

/**
 * POST /api/client/notify
 * Send notification emails to clients when things change
 *
 * Body: { projectId, type, data }
 * Types: bug_resolved, task_shipped, request_completed, needs_attention
 */
export async function POST(req: NextRequest) {
  try {
    const { projectId, type, data } = await req.json()

    if (!projectId || !type) {
      return NextResponse.json({ error: 'projectId and type are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Look up client email from project
    const { data: project } = await supabase
      .from('projects')
      .select('name, client_id, client_name')
      .eq('id', projectId)
      .single()

    if (!project?.client_id) {
      return NextResponse.json({ error: 'No client linked to project' }, { status: 404 })
    }

    const { data: client } = await supabase
      .from('clients')
      .select('email, name')
      .eq('id', project.client_id)
      .single()

    if (!client?.email) {
      return NextResponse.json({ error: 'No client email found' }, { status: 404 })
    }

    // Determine portal slug from project name
    const slugMap: Record<string, string> = {
      'Stitchwichs': 'stitchwichs',
      'Scat Pack': 'scat-pack-clt',
      'Pretty Paid': 'prettypaidcloset',
    }
    const portalSlug = Object.entries(slugMap).find(([key]) => project.name?.includes(key))?.[1] || ''
    const portalUrl = portalSlug ? `https://l7shift.com/portal/${portalSlug}` : 'https://l7shift.com/portal'

    let subject = ''
    let bodyContent = ''

    switch (type) {
      case 'bug_resolved': {
        const bugNumber = data?.bugNumber || 'Bug'
        const title = data?.title || ''
        const resolution = data?.resolution || 'Fixed and deployed.'
        subject = `${bugNumber} Resolved: ${title}`
        bodyContent = `
          <h2 style="color: #22C55E; margin: 0 0 16px; font-size: 20px;">Bug Resolved</h2>
          <p style="color: #AAA; margin: 0 0 20px;">Good news — a reported bug has been fixed.</p>
          <div style="background: rgba(34,197,94,0.1); border-left: 3px solid #22C55E; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 8px;"><strong style="color: #22C55E;">${bugNumber}:</strong> <span style="color: #FAFAFA;">${title}</span></p>
            <p style="margin: 0;"><strong style="color: #22C55E;">Resolution:</strong> <span style="color: #CCC;">${resolution}</span></p>
          </div>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${portalUrl}/bugs" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #00F0FF, #FF00AA); color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View in Portal</a>
          </div>`
        break
      }
      case 'task_shipped': {
        const taskTitle = data?.title || 'Task'
        const notes = data?.notes || ''
        subject = `Shipped: ${taskTitle}`
        bodyContent = `
          <h2 style="color: #BFFF00; margin: 0 0 16px; font-size: 20px;">Feature Shipped</h2>
          <p style="color: #AAA; margin: 0 0 20px;">A new feature has been completed and deployed.</p>
          <div style="background: rgba(191,255,0,0.1); border-left: 3px solid #BFFF00; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 8px;"><strong style="color: #BFFF00;">Feature:</strong> <span style="color: #FAFAFA;">${taskTitle}</span></p>
            ${notes ? `<p style="margin: 0;"><strong style="color: #BFFF00;">Details:</strong> <span style="color: #CCC;">${notes}</span></p>` : ''}
          </div>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${portalUrl}/activity" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #00F0FF, #FF00AA); color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View Activity</a>
          </div>`
        break
      }
      case 'request_completed': {
        const reqTitle = data?.title || 'Request'
        const response = data?.response || 'Your request has been completed.'
        subject = `Request Completed: ${reqTitle}`
        bodyContent = `
          <h2 style="color: #A855F7; margin: 0 0 16px; font-size: 20px;">Request Completed</h2>
          <p style="color: #AAA; margin: 0 0 20px;">An enhancement you requested has been delivered.</p>
          <div style="background: rgba(168,85,247,0.1); border-left: 3px solid #A855F7; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 8px;"><strong style="color: #A855F7;">Request:</strong> <span style="color: #FAFAFA;">${reqTitle}</span></p>
            <p style="margin: 0;"><strong style="color: #A855F7;">Response:</strong> <span style="color: #CCC;">${response}</span></p>
          </div>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${portalUrl}/requests" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #00F0FF, #FF00AA); color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View in Portal</a>
          </div>`
        break
      }
      case 'needs_attention': {
        const items = data?.items || []
        const itemsHtml = items.map((item: { type: string; title: string }) =>
          `<li style="margin: 8px 0; color: #CCC;"><strong style="color: #FF00AA;">${item.type}:</strong> ${item.title}</li>`
        ).join('')
        subject = `Action needed on ${project.name}`
        bodyContent = `
          <h2 style="color: #FF00AA; margin: 0 0 16px; font-size: 20px;">Your Attention Needed</h2>
          <p style="color: #AAA; margin: 0 0 20px;">There are items on your project that need your review.</p>
          <div style="background: rgba(255,0,170,0.1); border-left: 3px solid #FF00AA; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">${itemsHtml}</ul>
          </div>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${portalUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #00F0FF, #FF00AA); color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Open Portal</a>
          </div>`
        break
      }
      default:
        return NextResponse.json({ error: `Unknown notification type: ${type}` }, { status: 400 })
    }

    const result = await resend.emails.send({
      from: 'L7 Shift <no-reply@l7shift.com>',
      to: client.email,
      subject,
      html: generateEmailHTML(subject, bodyContent),
    })

    return NextResponse.json({ success: true, emailId: result.data?.id })
  } catch (err) {
    console.error('Notification error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

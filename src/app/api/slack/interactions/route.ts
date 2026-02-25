/**
 * /api/slack/interactions — Slack Interactive Components endpoint
 *
 * Handles:
 * 1. Approval button clicks (approve/reject from approval_queue)
 * 2. Future: modal submissions, shortcuts
 *
 * When KJ clicks "Approve" or "Reject" on an approval request,
 * this endpoint processes it and updates ShiftBoard.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifySlackSignature, updateMessage, sectionBlock, contextBlock } from '@/lib/slack'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  // Slack sends interactions as application/x-www-form-urlencoded
  const rawBody = await request.text()
  const timestamp = request.headers.get('x-slack-request-timestamp') || ''
  const signature = request.headers.get('x-slack-signature') || ''

  if (!verifySlackSignature(rawBody, timestamp, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Parse the URL-encoded payload
  const params = new URLSearchParams(rawBody)
  const payloadStr = params.get('payload')
  if (!payloadStr) {
    return NextResponse.json({ error: 'No payload' }, { status: 400 })
  }

  const payload = JSON.parse(payloadStr)

  // Handle button clicks (block_actions)
  if (payload.type === 'block_actions') {
    const action = payload.actions?.[0]
    if (!action) return NextResponse.json({ ok: true })

    const actionId = action.action_id as string
    const approvalId = action.value

    // Check if this is an approval action
    if (actionId.startsWith('approve_') || actionId.startsWith('reject_')) {
      const decision = actionId.startsWith('approve_') ? 'approved' : 'rejected'

      try {
        const supabase = createServerClient()

        // Update the approval queue (cast needed — approval_queue not in generated types yet)
        const { data: approval, error } = await (supabase
          .from('approval_queue') as ReturnType<typeof supabase.from>)
          .update({
            status: decision,
            reviewed_by: 'kj',
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', approvalId)
          .select()
          .single()

        if (error) {
          console.error('Approval update failed:', error)
          return NextResponse.json({ ok: true })
        }

        // Update the original Slack message to show the decision
        const emoji = decision === 'approved' ? ':white_check_mark:' : ':x:'
        const channel = payload.channel?.id || payload.container?.channel_id
        const messageTs = payload.message?.ts || payload.container?.message_ts

        if (channel && messageTs) {
          await updateMessage(channel, messageTs, `${emoji} ${decision.toUpperCase()}`, [
            sectionBlock(`${emoji} *${approval.action_type}* — *${decision.toUpperCase()}*\n${approval.description || ''}`),
            contextBlock(`${decision === 'approved' ? 'Approved' : 'Rejected'} by KJ • ${new Date().toLocaleString()}`),
          ])
        }
      } catch (err) {
        console.error('Interaction handler error:', err)
      }

      return NextResponse.json({ ok: true })
    }
  }

  return NextResponse.json({ ok: true })
}

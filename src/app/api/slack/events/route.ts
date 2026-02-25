/**
 * /api/slack/events — Slack Events API endpoint
 *
 * Handles:
 * 1. URL verification challenge (Slack handshake)
 * 2. App mentions (@Artemis)
 * 3. Direct messages to the bot
 *
 * Artemis receives the message, parses intent, queries ShiftBoard, responds.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifySlackSignature } from '@/lib/slack'
import { parseIntent, handleIntent } from '@/lib/artemis'

export async function POST(request: NextRequest) {
  // Ignore Slack retries — cold starts cause timeouts, retries cause duplicates
  const retryNum = request.headers.get('x-slack-retry-num')
  if (retryNum) {
    return NextResponse.json({ ok: true })
  }

  // Read raw body for signature verification
  const rawBody = await request.text()
  const timestamp = request.headers.get('x-slack-request-timestamp') || ''
  const signature = request.headers.get('x-slack-signature') || ''

  // Verify request is from Slack
  if (!verifySlackSignature(rawBody, timestamp, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)

  // Handle URL verification challenge (Slack handshake when setting up events)
  if (payload.type === 'url_verification') {
    return NextResponse.json({ challenge: payload.challenge })
  }

  // Handle events
  if (payload.type === 'event_callback') {
    const event = payload.event

    // Ignore bot's own messages (prevent loops)
    if (event.bot_id || event.subtype === 'bot_message') {
      return NextResponse.json({ ok: true })
    }

    // Ignore message edits and deletes
    if (event.subtype === 'message_changed' || event.subtype === 'message_deleted') {
      return NextResponse.json({ ok: true })
    }

    // Handle app_mention events (@Artemis what's the status?)
    if (event.type === 'app_mention') {
      const parsed = parseIntent(event.text)

      // Run async — respond to Slack within 3 seconds
      handleIntent(parsed, event.channel, event.ts).catch(err => {
        console.error('Artemis handler error:', err)
      })

      return NextResponse.json({ ok: true })
    }

    // Handle direct messages
    if (event.type === 'message' && event.channel_type === 'im') {
      const parsed = parseIntent(event.text)

      handleIntent(parsed, event.channel, event.ts).catch(err => {
        console.error('Artemis handler error:', err)
      })

      return NextResponse.json({ ok: true })
    }
  }

  return NextResponse.json({ ok: true })
}

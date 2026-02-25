/**
 * /api/slack/events — Slack Events API endpoint
 *
 * Handles:
 * 1. URL verification challenge (Slack handshake)
 * 2. App mentions (@Artemis)
 * 3. Direct messages to the bot
 *
 * Every message goes to Claude. Claude IS Artemis.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifySlackSignature } from '@/lib/slack'
import { handleMessage } from '@/lib/artemis'

export const maxDuration = 30

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

    // Strip @mention from text
    const text = (event.text || '').replace(/<@[A-Z0-9]+>/g, '').trim()

    if (!text) {
      return NextResponse.json({ ok: true })
    }

    // App mentions or DMs — send everything to Claude
    if (event.type === 'app_mention' || (event.type === 'message' && event.channel_type === 'im')) {
      try {
        await handleMessage(text, event.channel, event.ts)
      } catch (err) {
        console.error('Artemis error:', err)
      }

      return NextResponse.json({ ok: true })
    }
  }

  return NextResponse.json({ ok: true })
}

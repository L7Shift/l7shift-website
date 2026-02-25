/**
 * Slack utilities for Artemis
 * Handles message posting, signature verification, and block formatting
 */

import crypto from 'crypto'

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET

// Channel IDs get set after the bot is installed
// For now we use channel names — Slack API resolves them
const CHANNELS = {
  artemis: process.env.SLACK_CHANNEL_ARTEMIS || '#artemis-hq',
  ops: process.env.SLACK_CHANNEL_OPS || '#ops',
  money: process.env.SLACK_CHANNEL_MONEY || '#money',
  comms: process.env.SLACK_CHANNEL_COMMS || '#comms-review',
}

/**
 * Verify Slack request signature
 */
export function verifySlackSignature(
  body: string,
  timestamp: string,
  signature: string
): boolean {
  if (!SLACK_SIGNING_SECRET) {
    console.warn('SLACK_SIGNING_SECRET not set — skipping verification')
    return true
  }

  // Reject requests older than 5 minutes (replay protection)
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    return false
  }

  const sigBasestring = `v0:${timestamp}:${body}`
  const hmac = crypto
    .createHmac('sha256', SLACK_SIGNING_SECRET)
    .update(sigBasestring)
    .digest('hex')

  const expectedSignature = `v0=${hmac}`

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Post a message to a Slack channel
 */
export async function postMessage(
  channel: string,
  text: string,
  blocks?: SlackBlock[]
): Promise<SlackPostResult> {
  if (!SLACK_BOT_TOKEN) {
    console.error('SLACK_BOT_TOKEN not set')
    return { ok: false, error: 'SLACK_BOT_TOKEN not configured' }
  }

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel,
      text, // fallback for notifications
      blocks,
    }),
  })

  const data = await res.json()
  if (!data.ok) {
    console.error('Slack postMessage failed:', data.error)
  }
  return data
}

/**
 * Reply in a thread
 */
export async function replyInThread(
  channel: string,
  threadTs: string,
  text: string,
  blocks?: SlackBlock[]
): Promise<SlackPostResult> {
  if (!SLACK_BOT_TOKEN) {
    return { ok: false, error: 'SLACK_BOT_TOKEN not configured' }
  }

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel,
      thread_ts: threadTs,
      text,
      blocks,
    }),
  })

  return res.json()
}

/**
 * Update an existing message (for approval button states)
 */
export async function updateMessage(
  channel: string,
  ts: string,
  text: string,
  blocks?: SlackBlock[]
): Promise<SlackPostResult> {
  if (!SLACK_BOT_TOKEN) {
    return { ok: false, error: 'SLACK_BOT_TOKEN not configured' }
  }

  const res = await fetch('https://slack.com/api/chat.update', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel,
      ts,
      text,
      blocks,
    }),
  })

  return res.json()
}

// ---- Block Kit Helpers ----

export function headerBlock(text: string): SlackBlock {
  return {
    type: 'header',
    text: { type: 'plain_text', text, emoji: true },
  }
}

export function sectionBlock(text: string): SlackBlock {
  return {
    type: 'section',
    text: { type: 'mrkdwn', text },
  }
}

export function fieldsBlock(fields: string[]): SlackBlock {
  return {
    type: 'section',
    fields: fields.map(f => ({ type: 'mrkdwn', text: f })),
  }
}

export function dividerBlock(): SlackBlock {
  return { type: 'divider' }
}

export function actionsBlock(buttons: SlackButton[]): SlackBlock {
  return {
    type: 'actions',
    elements: buttons.map(b => ({
      type: 'button',
      text: { type: 'plain_text', text: b.text, emoji: true },
      action_id: b.actionId,
      value: b.value,
      ...(b.style && { style: b.style }),
    })),
  }
}

export function contextBlock(text: string): SlackBlock {
  return {
    type: 'context',
    elements: [{ type: 'mrkdwn', text }],
  }
}

export { CHANNELS }

// ---- Types ----

interface SlackPostResult {
  ok: boolean
  error?: string
  ts?: string
  channel?: string
}

interface SlackBlock {
  type: string
  text?: { type: string; text: string; emoji?: boolean }
  fields?: { type: string; text: string }[]
  elements?: unknown[]
  [key: string]: unknown
}

interface SlackButton {
  text: string
  actionId: string
  value: string
  style?: 'primary' | 'danger'
}

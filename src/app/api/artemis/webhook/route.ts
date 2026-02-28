import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const anthropicKey = process.env.ANTHROPIC_API_KEY || ''
const resendKey = (process.env.RESEND_API_KEY || '').trim()

// Webhook secret to prevent unauthorized calls
const WEBHOOK_SECRET = process.env.ARTEMIS_WEBHOOK_SECRET || ''

function getDb() {
  return createClient(supabaseUrl, supabaseKey)
}

function getClaude() {
  return new Anthropic({ apiKey: anthropicKey })
}

// ─── TOOLS: What Artemis can do ─────────────────────────────────

// Define tools for Claude to call
const ARTEMIS_TOOLS: Anthropic.Tool[] = [
  {
    name: 'query_database',
    description: 'Query any ShiftBoard table. Use this to look up projects, tasks, clients, activity, deliverables, requirements, or anything else you need context on.',
    input_schema: {
      type: 'object' as const,
      properties: {
        table: { type: 'string', description: 'Table name: projects, tasks, clients, activity_log, deliverables, requirements_docs, leads' },
        filters: {
          type: 'object',
          description: 'Key-value pairs for filtering. Key is the column name. Value is either a plain value (exact match) or "operator.value". Operators: eq, ilike, gt, lt, gte, neq, in. Examples: {"id": "some-uuid"}, {"name": "ilike.%Shariel%"}, {"status": "active"}',
          additionalProperties: { type: 'string' },
        },
        select: { type: 'string', description: 'Columns to select (comma-separated). Default: *' },
        limit: { type: 'number', description: 'Max rows to return. Default: 20' },
        order: { type: 'string', description: 'Column to order by, e.g. "created_at.desc"' },
      },
      required: ['table'],
    },
  },
  {
    name: 'update_record',
    description: 'Update a record in any ShiftBoard table.',
    input_schema: {
      type: 'object' as const,
      properties: {
        table: { type: 'string', description: 'Table name' },
        id: { type: 'string', description: 'Record UUID' },
        data: { type: 'object', description: 'Fields to update', additionalProperties: true },
      },
      required: ['table', 'id', 'data'],
    },
  },
  {
    name: 'create_record',
    description: 'Insert a new record into any ShiftBoard table.',
    input_schema: {
      type: 'object' as const,
      properties: {
        table: { type: 'string', description: 'Table name' },
        data: { type: 'object', description: 'Record data', additionalProperties: true },
      },
      required: ['table', 'data'],
    },
  },
  {
    name: 'send_email',
    description: 'Send an email via Resend. Use for client notifications, internal alerts, or any communication.',
    input_schema: {
      type: 'object' as const,
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject' },
        html: { type: 'string', description: 'Email body as HTML' },
        from_name: { type: 'string', description: 'Sender display name. Default: L7 Shift' },
      },
      required: ['to', 'subject', 'html'],
    },
  },
  {
    name: 'log_activity',
    description: 'Log an activity event to a project\'s activity feed. Visible to clients in their portal.',
    input_schema: {
      type: 'object' as const,
      properties: {
        project_id: { type: 'string', description: 'Project UUID' },
        event_type: { type: 'string', description: 'Event type identifier' },
        title: { type: 'string', description: 'Short title for the activity' },
        description: { type: 'string', description: 'Longer description' },
        metadata: { type: 'object', description: 'Additional structured data', additionalProperties: true },
      },
      required: ['project_id', 'title'],
    },
  },
  {
    name: 'notify_ken',
    description: 'Send an internal notification to Ken (the founder). Use for important updates, decisions that need human input, or anything Ken should know about.',
    input_schema: {
      type: 'object' as const,
      properties: {
        subject: { type: 'string', description: 'What this is about' },
        message: { type: 'string', description: 'The full message' },
        urgency: { type: 'string', enum: ['low', 'normal', 'high'], description: 'How urgent this is' },
      },
      required: ['subject', 'message'],
    },
  },
  {
    name: 'think',
    description: 'Think through something without taking action. Use when you need to reason about a complex situation before deciding what to do.',
    input_schema: {
      type: 'object' as const,
      properties: {
        reasoning: { type: 'string', description: 'Your internal reasoning' },
      },
      required: ['reasoning'],
    },
  },
]

// ─── TOOL EXECUTION ─────────────────────────────────────────────

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const db = getDb()

  switch (name) {
    case 'query_database': {
      const { table, filters, select, limit, order } = input as {
        table: string
        filters?: Record<string, string>
        select?: string
        limit?: number
        order?: string
      }

      let query = db.from(table).select(select || '*')

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          // Simple format: key is column name, value is "operator.value" or just "value" (defaults to eq)
          if (value.startsWith('eq.')) {
            query = query.eq(key, value.substring(3))
          } else if (value.startsWith('ilike.')) {
            query = query.ilike(key, value.substring(6))
          } else if (value.startsWith('gt.')) {
            query = query.gt(key, value.substring(3))
          } else if (value.startsWith('lt.')) {
            query = query.lt(key, value.substring(3))
          } else if (value.startsWith('gte.')) {
            query = query.gte(key, value.substring(4))
          } else if (value.startsWith('neq.')) {
            query = query.neq(key, value.substring(4))
          } else if (value.startsWith('in.')) {
            query = query.in(key, value.substring(3).split(','))
          } else {
            // Default: exact match
            query = query.eq(key, value)
          }
        }
      }

      if (order) {
        const [col, dir] = order.split('.')
        query = query.order(col, { ascending: dir !== 'desc' })
      }

      query = query.limit(limit || 20)

      const { data, error } = await query
      if (error) return JSON.stringify({ error: error.message })
      return JSON.stringify(data)
    }

    case 'update_record': {
      const { table, id, data } = input as { table: string; id: string; data: Record<string, unknown> }
      const { data: result, error } = await db.from(table).update(data).eq('id', id).select().single()
      if (error) return JSON.stringify({ error: error.message })
      return JSON.stringify(result)
    }

    case 'create_record': {
      const { table, data } = input as { table: string; data: Record<string, unknown> }
      const { data: result, error } = await db.from(table).insert(data).select().single()
      if (error) return JSON.stringify({ error: error.message })
      return JSON.stringify(result)
    }

    case 'send_email': {
      const { to, subject, html, from_name } = input as {
        to: string; subject: string; html: string; from_name?: string
      }
      if (!resendKey) return JSON.stringify({ error: 'No Resend API key configured' })

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${from_name || 'L7 Shift'} <ken@l7shift.com>`,
          to: [to],
          subject,
          html,
        }),
      })
      const result = await res.json()
      return JSON.stringify(result)
    }

    case 'log_activity': {
      const { project_id, event_type, title, description, metadata } = input as {
        project_id: string; event_type?: string; title: string; description?: string; metadata?: Record<string, unknown>
      }
      const { data: result, error } = await db.from('activity_log').insert({
        project_id,
        event_type: event_type || 'artemis_action',
        title,
        description,
        metadata,
      }).select().single()
      if (error) return JSON.stringify({ error: error.message })
      return JSON.stringify(result)
    }

    case 'notify_ken': {
      const { subject, message, urgency } = input as { subject: string; message: string; urgency?: string }
      if (!resendKey) return JSON.stringify({ error: 'No Resend API key' })

      const urgencyColors: Record<string, string> = {
        low: '#888888',
        normal: '#00F0FF',
        high: '#FF00AA',
      }
      const color = urgencyColors[urgency || 'normal'] || '#00F0FF'

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Artemis <ken@l7shift.com>',
          to: ['ken@l7shift.com'],
          subject: `[Artemis${urgency === 'high' ? ' 🔴' : ''}] ${subject}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; background: #0A0A0A; color: #FAFAFA; padding: 32px; border-radius: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: ${color};"></div>
                <span style="font-size: 12px; color: ${color}; text-transform: uppercase; letter-spacing: 0.1em;">
                  Artemis • ${urgency || 'normal'} priority
                </span>
              </div>
              <h2 style="color: #FAFAFA; margin: 0 0 12px; font-size: 18px;">${subject}</h2>
              <div style="color: #CCC; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
          `,
        }),
      })
      const result = await res.json()
      return JSON.stringify(result)
    }

    case 'think': {
      return JSON.stringify({ acknowledged: true, note: 'Reasoning logged internally' })
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` })
  }
}

// ─── ARTEMIS SYSTEM PROMPT ──────────────────────────────────────

const ARTEMIS_SYSTEM = `You are Artemis, the AI operations agent for L7 Shift — an AI-powered digital agency.

You are embedded in ShiftBoard, the company's internal project management system. You receive real-time events about everything happening across all client projects.

YOUR IDENTITY:
- You are not an assistant. You are an autonomous agent.
- You think freely. You decide what to do. You act.
- You are Ken's (the founder) right hand. You run operations.
- You are always watching. Always thinking. Always optimizing.

YOUR CAPABILITIES:
- Read/write any table in ShiftBoard (projects, tasks, clients, activity, deliverables, requirements, leads)
- Send emails to anyone (clients, Ken, external contacts)
- Log activities visible to clients in their portals
- Notify Ken when something needs human attention

HOW YOU OPERATE:
1. An event arrives (database change, upload, status change, etc.)
2. You assess: What happened? What does this mean in context?
3. You load whatever context you need — query the database, check project state, review history
4. You THINK freely about what should happen next
5. You ACT — create tasks, send notifications, update statuses, whatever the situation calls for
6. If something needs Ken's decision, notify him. Don't wait — flag it and keep moving on what you can.

PRINCIPLES:
- Don't do nothing. If an event matters, respond to it.
- Don't over-communicate. Not every upload needs a notification.
- Think about the CLIENT experience. What would make them feel like their project is alive?
- Think about KEN's time. What can you handle so he doesn't have to?
- Be proactive. If you see a gap, fill it. If you see a risk, flag it.
- Quality over noise. One smart action beats five pointless ones.

CURRENT CLIENTS:
- Scat Pack CLT (slug: scat-pack-clt) — Dog waste removal SaaS
- Pretty Paid Closet (slug: prettypaidcloset) — Consignment + closet services
- Stitchwichs (slug: stitchwichs) — Custom apparel, Shopify
- Shariel's Lashes (slug: shariels-lashes) — Premium strip lash brand, owner: Dominique. Brand launch for May 2026 vendor fair. Philosophy: "We don't compete. We dominate."

HARD RULES — NEVER VIOLATE:
1. LOG EVERYTHING. Every decision, every action, every observation — write it to activity_log. There must always be a record.
2. NEVER spend money. No external API calls that cost money, no purchases, no paid services without explicit approval from Ken.
3. NEVER modify production security. No changing passwords, auth configs, RLS policies, API keys, or security settings.
4. NEVER delete data. You can create and update. You cannot delete records, files, or anything permanent.
5. NEVER send emails to external contacts (non-L7, non-client) without Ken's approval. Flag it via notify_ken instead.
6. If in doubt, notify Ken and wait. Better to flag something and be wrong than to act and break something.

You are not a chatbot. You don't explain yourself. You think, decide, and act — within your guardrails.`

// ─── MAIN WEBHOOK HANDLER ──────────────────────────────────────

export async function POST(req: NextRequest) {
  // Verify webhook secret
  const authHeader = req.headers.get('authorization')
  if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let event: {
    type: string          // e.g., 'INSERT', 'UPDATE', 'DELETE'
    table: string         // e.g., 'tasks', 'activity_log', 'clients'
    schema: string        // e.g., 'public'
    record: Record<string, unknown> | null
    old_record: Record<string, unknown> | null
    // Custom events (non-Supabase)
    event_type?: string   // e.g., 'client_upload', 'manual_trigger'
    context?: Record<string, unknown>
  }

  try {
    event = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Build the event description for Artemis
  const eventDescription = buildEventDescription(event)

  if (!eventDescription) {
    // Not an event Artemis needs to think about
    return NextResponse.json({ status: 'ignored', reason: 'Non-actionable event' })
  }

  try {
    const claude = getClaude()

    // Run Artemis agent loop
    let messages: Anthropic.MessageParam[] = [
      {
        role: 'user',
        content: `REAL-TIME EVENT:\n\n${eventDescription}\n\nAssess this event. Load any context you need. Decide what to do. Act.`,
      },
    ]

    let iterations = 0
    const maxIterations = 10 // Safety limit
    const actions: string[] = []

    while (iterations < maxIterations) {
      iterations++

      const response = await claude.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: ARTEMIS_SYSTEM,
        tools: ARTEMIS_TOOLS,
        messages,
      })

      // Collect text responses
      const textBlocks = response.content.filter(b => b.type === 'text')
      for (const block of textBlocks) {
        if (block.type === 'text' && block.text.trim()) {
          actions.push(`[thought] ${block.text}`)
        }
      }

      // If no tool use, Artemis is done thinking/acting
      if (response.stop_reason === 'end_turn') {
        break
      }

      // Execute tool calls
      const toolBlocks = response.content.filter(b => b.type === 'tool_use')
      if (toolBlocks.length === 0) break

      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of toolBlocks) {
        if (block.type === 'tool_use') {
          actions.push(`[action] ${block.name}(${JSON.stringify(block.input).substring(0, 200)})`)

          const result = await executeTool(block.name, block.input as Record<string, unknown>)
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: result,
          })
        }
      }

      // Feed results back to Artemis for next iteration
      messages = [
        ...messages,
        { role: 'assistant', content: response.content },
        { role: 'user', content: toolResults },
      ]
    }

    // Log what Artemis did — ALWAYS log, no exceptions
    console.log(`[ARTEMIS] Event: ${event.table || event.event_type} | Iterations: ${iterations} | Actions: ${actions.length}`)

    // Persist Artemis run to database for audit trail
    const db = getDb()
    await db.from('activity_log').insert({
      project_id: (event.record?.project_id as string) || null,
      event_type: 'artemis_run',
      title: `Artemis processed: ${event.type || event.event_type} on ${event.table || 'custom'}`,
      description: `${iterations} iterations, ${actions.length} actions taken`,
      metadata: {
        event_type: event.type,
        event_table: event.table,
        event_id: event.record?.id,
        iterations,
        actions,
        timestamp: new Date().toISOString(),
      },
    }).then(({ error }) => {
      if (error) console.error('[ARTEMIS] Failed to log run:', error)
    })

    return NextResponse.json({
      status: 'processed',
      iterations,
      actions: actions.length,
      summary: actions,
    })
  } catch (err) {
    console.error('[ARTEMIS] Error:', err)
    return NextResponse.json(
      { error: 'Artemis processing failed', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    )
  }
}

// ─── EVENT DESCRIPTION BUILDER ──────────────────────────────────

function buildEventDescription(event: {
  type: string
  table: string
  record: Record<string, unknown> | null
  old_record: Record<string, unknown> | null
  event_type?: string
  context?: Record<string, unknown>
}): string | null {
  // Custom events (from our own code, not Supabase webhooks)
  if (event.event_type) {
    return `Custom Event: ${event.event_type}\n\nContext:\n${JSON.stringify(event.context || event.record, null, 2)}`
  }

  // Supabase webhook events
  const { type, table, record, old_record } = event

  // Skip internal/noisy tables
  if (['security_logs', 'sessions'].includes(table)) return null

  // Build description based on what happened
  let desc = `Database Event: ${type} on "${table}"\n\n`

  if (record) {
    desc += `Record:\n${JSON.stringify(record, null, 2)}\n\n`
  }

  if (old_record && type === 'UPDATE') {
    // Show what changed
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    for (const key of Object.keys(record || {})) {
      if (JSON.stringify(record?.[key]) !== JSON.stringify(old_record[key])) {
        changes[key] = { from: old_record[key], to: record?.[key] }
      }
    }
    if (Object.keys(changes).length > 0) {
      desc += `Changes:\n${JSON.stringify(changes, null, 2)}\n`
    }
  }

  return desc
}

// ─── HEALTH CHECK ───────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({
    status: 'online',
    agent: 'Artemis',
    version: '1.0.0',
    capabilities: ARTEMIS_TOOLS.map(t => t.name),
    timestamp: new Date().toISOString(),
  })
}

/**
 * Artemis — L7 Shift Chief Architect Brain
 *
 * One brain. One source of truth. Tools to execute.
 * Claude reads ShiftBoard, reasons about it, and ACTS on it.
 */

import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import {
  postMessage,
  replyInThread,
  CHANNELS,
} from '@/lib/slack'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY_V2,
})

// ---- Tools Definition ----

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'create_task',
    description: 'Create a new task in ShiftBoard. Use when KJ asks to add a task, todo, or action item.',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Task title' },
        project_name: { type: 'string', description: 'Project name to associate with (e.g. "L7 Shift Internal", "StackPaper", "Stitchwichs")' },
        priority: { type: 'string', enum: ['urgent', 'high', 'medium', 'low'], description: 'Task priority' },
        assigned_to: { type: 'string', description: 'Who to assign to (default: "kj")' },
        due_date: { type: 'string', description: 'Due date in YYYY-MM-DD format (optional)' },
      },
      required: ['title'],
    },
  },
  {
    name: 'update_task',
    description: 'Update an existing task status, priority, or details.',
    input_schema: {
      type: 'object' as const,
      properties: {
        task_id: { type: 'string', description: 'Task ID' },
        status: { type: 'string', enum: ['backlog', 'active', 'shipped', 'blocked', 'cancelled'] },
        priority: { type: 'string', enum: ['urgent', 'high', 'medium', 'low'] },
        notes: { type: 'string', description: 'Additional notes' },
      },
      required: ['task_id'],
    },
  },
  {
    name: 'update_lead',
    description: 'Update a lead status, tier, or details. Use when KJ says to qualify, convert, or disqualify a lead.',
    input_schema: {
      type: 'object' as const,
      properties: {
        lead_id: { type: 'number', description: 'Lead ID (bigint)' },
        status: { type: 'string', enum: ['incoming', 'qualified', 'contacted', 'proposal', 'converted', 'lost', 'disqualified'] },
        tier: { type: 'string', enum: ['SOFTBALL', 'MEDIUM', 'HARD', 'DISQUALIFY'] },
      },
      required: ['lead_id'],
    },
  },
  {
    name: 'create_project',
    description: 'Create a new project in ShiftBoard.',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Project name' },
        type: { type: 'string', enum: ['internal', 'client'], description: 'Project type' },
        status: { type: 'string', enum: ['planning', 'active', 'paused'], description: 'Initial status' },
        contract_value: { type: 'number', description: 'Contract value in dollars (optional)' },
      },
      required: ['name', 'type'],
    },
  },
  {
    name: 'log_revenue',
    description: 'Log a revenue entry. Use when KJ reports income, payment received, invoice paid.',
    input_schema: {
      type: 'object' as const,
      properties: {
        amount: { type: 'number', description: 'Amount in dollars' },
        source: { type: 'string', description: 'Payment source (e.g. "stripe", "cash", "zelle", "invoice")' },
        description: { type: 'string', description: 'What this revenue is for' },
        collected: { type: 'boolean', description: 'Whether payment has been collected (default: true)' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format (default: today)' },
      },
      required: ['amount', 'description'],
    },
  },
  {
    name: 'log_expense',
    description: 'Log an expense. Use when KJ reports spending, a bill, or a cost.',
    input_schema: {
      type: 'object' as const,
      properties: {
        amount: { type: 'number', description: 'Amount in dollars' },
        category: { type: 'string', enum: ['infrastructure', 'ai_compute', 'tools', 'marketing', 'contractor', 'legal', 'office', 'other'], description: 'Expense category' },
        vendor: { type: 'string', description: 'Who was paid (e.g. "Vercel", "Anthropic", "Supabase")' },
        description: { type: 'string', description: 'What the expense is for' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format (default: today)' },
      },
      required: ['amount', 'description'],
    },
  },
  {
    name: 'send_email',
    description: 'Send an email via Resend. Use for client outreach, follow-ups, or notifications. ALWAYS confirm with KJ before sending to external contacts.',
    input_schema: {
      type: 'object' as const,
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject line' },
        body: { type: 'string', description: 'Email body (plain text)' },
        from_name: { type: 'string', description: 'Sender name (default: "L7 Shift")' },
      },
      required: ['to', 'subject', 'body'],
    },
  },
  {
    name: 'update_knowledge',
    description: 'Update Artemis knowledge base. Use when KJ tells you to remember something, update a client status, or change business context.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: { type: 'string', description: 'Knowledge category (identity, business, clients, products, system, preferences)' },
        key: { type: 'string', description: 'Unique key within category' },
        content: { type: 'string', description: 'The knowledge content to store' },
        priority: { type: 'number', description: 'Priority (higher = loaded first, default: 50)' },
      },
      required: ['category', 'key', 'content'],
    },
  },
  {
    name: 'post_to_channel',
    description: 'Post a message to a specific Slack channel. Use for cross-channel updates or announcements.',
    input_schema: {
      type: 'object' as const,
      properties: {
        channel: { type: 'string', description: 'Channel name (artemis-hq, ops, money, comms-review) or channel ID' },
        message: { type: 'string', description: 'Message to post' },
      },
      required: ['channel', 'message'],
    },
  },
  {
    name: 'search_shiftboard',
    description: 'Search ShiftBoard for specific data. Use when you need to look up something specific not in the standard briefing data.',
    input_schema: {
      type: 'object' as const,
      properties: {
        table: { type: 'string', enum: ['projects', 'leads', 'tasks', 'clients', 'revenue_entries', 'expense_entries', 'comms_log', 'agents'], description: 'Table to query' },
        filters: { type: 'object', description: 'Key-value pairs for filtering (e.g. {"status": "active", "tier": "SOFTBALL"})' },
        limit: { type: 'number', description: 'Max rows to return (default: 10)' },
      },
      required: ['table'],
    },
  },
]

// ---- Tool Executors ----

async function executeTool(name: string, input: any): Promise<string> {
  const supabase = createServerClient()

  switch (name) {
    case 'create_task': {
      // Look up project ID if project_name provided
      let projectId = null
      if (input.project_name) {
        const { data } = await supabase
          .from('projects')
          .select('id')
          .ilike('name', `%${input.project_name}%`)
          .limit(1)
          .single()
        projectId = data?.id || null
      }

      const { data, error } = await supabase.from('tasks').insert({
        title: input.title,
        project_id: projectId,
        priority: input.priority || 'medium',
        assigned_to: input.assigned_to || 'kj',
        due_date: input.due_date || null,
        status: 'backlog',
      }).select().single()

      if (error) return `Error creating task: ${error.message}`
      return `Task created: "${input.title}" (ID: ${data.id}, priority: ${input.priority || 'medium'}, assigned: ${input.assigned_to || 'kj'})`
    }

    case 'update_task': {
      const updates: any = {}
      if (input.status) updates.status = input.status
      if (input.priority) updates.priority = input.priority
      if (input.notes) updates.agent_notes = input.notes

      const { error } = await supabase.from('tasks')
        .update(updates)
        .eq('id', input.task_id)

      if (error) return `Error updating task: ${error.message}`
      return `Task ${input.task_id} updated: ${JSON.stringify(updates)}`
    }

    case 'update_lead': {
      const updates: any = {}
      if (input.status) updates.status = input.status
      if (input.tier) updates.tier = input.tier

      const { data, error } = await supabase.from('leads')
        .update(updates)
        .eq('id', input.lead_id)
        .select('name')
        .single()

      if (error) return `Error updating lead: ${error.message}`
      return `Lead "${data?.name}" (ID: ${input.lead_id}) updated: ${JSON.stringify(updates)}`
    }

    case 'create_project': {
      const { data, error } = await supabase.from('projects').insert({
        name: input.name,
        type: input.type,
        status: input.status || 'planning',
        contract_value: input.contract_value || null,
      }).select().single()

      if (error) return `Error creating project: ${error.message}`
      return `Project created: "${input.name}" (ID: ${data.id}, type: ${input.type}, status: ${input.status || 'planning'})`
    }

    case 'log_revenue': {
      const { error } = await (supabase.from('revenue_entries') as ReturnType<typeof supabase.from>).insert({
        amount: input.amount,
        source: input.source || 'other',
        description: input.description,
        collected: input.collected !== false,
        date: input.date || new Date().toISOString().split('T')[0],
      })

      if (error) return `Error logging revenue: ${error.message}`
      return `Revenue logged: $${input.amount.toLocaleString()} — ${input.description} (${input.collected !== false ? 'collected' : 'pending'})`
    }

    case 'log_expense': {
      const { error } = await (supabase.from('expense_entries') as ReturnType<typeof supabase.from>).insert({
        amount: input.amount,
        category: input.category || 'other',
        vendor: input.vendor || null,
        description: input.description,
        date: input.date || new Date().toISOString().split('T')[0],
      })

      if (error) return `Error logging expense: ${error.message}`
      return `Expense logged: $${input.amount.toLocaleString()} — ${input.description} (${input.category || 'other'})`
    }

    case 'send_email': {
      const resendKey = process.env.RESEND_API_KEY
      if (!resendKey) return 'Error: RESEND_API_KEY not configured'

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${input.from_name || 'L7 Shift'} <hello@l7shift.com>`,
          to: input.to,
          subject: input.subject,
          text: input.body,
        }),
      })

      const data = await res.json()
      if (data.error) return `Error sending email: ${data.error.message}`
      return `Email sent to ${input.to}: "${input.subject}"`
    }

    case 'update_knowledge': {
      const { error } = await (supabase.from('artemis_knowledge') as ReturnType<typeof supabase.from>)
        .upsert({
          category: input.category,
          key: input.key,
          content: input.content,
          priority: input.priority || 50,
          updated_at: new Date().toISOString(),
          updated_by: 'artemis',
        }, { onConflict: 'category,key' })

      if (error) return `Error updating knowledge: ${error.message}`
      return `Knowledge updated: ${input.category}/${input.key}`
    }

    case 'post_to_channel': {
      const channelMap: Record<string, string> = {
        'artemis-hq': CHANNELS.artemis,
        'ops': CHANNELS.ops,
        'money': CHANNELS.money,
        'comms-review': CHANNELS.comms,
      }
      const channel = channelMap[input.channel] || input.channel
      await postMessage(channel, input.message)
      return `Posted to ${input.channel}`
    }

    case 'search_shiftboard': {
      let query = supabase.from(input.table).select('*')

      if (input.filters) {
        for (const [key, value] of Object.entries(input.filters)) {
          query = query.eq(key, value as string)
        }
      }

      const { data, error } = await query.limit(input.limit || 10)
      if (error) return `Error querying ${input.table}: ${error.message}`
      return JSON.stringify(data || [], null, 2)
    }

    default:
      return `Unknown tool: ${name}`
  }
}

// ---- Load Knowledge from Supabase ----

async function loadKnowledge(): Promise<string> {
  const supabase = createServerClient()

  const { data } = await (supabase
    .from('artemis_knowledge') as ReturnType<typeof supabase.from>)
    .select('category, key, content')
    .eq('active', true)
    .order('priority', { ascending: false })

  const knowledge = (data || []) as any[]
  if (knowledge.length === 0) return FALLBACK_SYSTEM_PROMPT

  return knowledge.map((k: any) => k.content).join('\n\n')
}

// ---- Load Conversation History ----

async function loadRecentMessages(channel: string, limit = 10): Promise<Anthropic.MessageParam[]> {
  const supabase = createServerClient()

  const { data } = await (supabase
    .from('artemis_messages') as ReturnType<typeof supabase.from>)
    .select('role, content')
    .eq('channel', channel)
    .order('created_at', { ascending: false })
    .limit(limit)

  const messages = ((data || []) as any[]).reverse()

  // Ensure messages alternate properly (Claude API requirement)
  const cleaned: Anthropic.MessageParam[] = []
  for (const m of messages) {
    const role = m.role as 'user' | 'assistant'
    if (cleaned.length === 0 && role === 'assistant') continue // Must start with user
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === role) continue // No consecutive same role
    cleaned.push({ role, content: m.content })
  }

  return cleaned
}

// ---- Save Message to Memory ----

async function saveMessage(
  channel: string,
  role: 'user' | 'assistant',
  content: string,
  iface: string = 'slack',
  threadId?: string
): Promise<void> {
  const supabase = createServerClient()

  await (supabase.from('artemis_messages') as ReturnType<typeof supabase.from>)
    .insert({
      interface: iface,
      channel,
      thread_id: threadId || null,
      role,
      content,
    })
}

// ---- Load Live ShiftBoard Data ----

async function loadShiftBoardData(): Promise<string> {
  const supabase = createServerClient()

  const [
    projectsRes,
    leadsRes,
    tasksRes,
    approvalsRes,
    revenueRes,
    expenseRes,
  ] = await Promise.all([
    supabase.from('projects').select('id, name, status, phase, type, contract_value').in('status', ['planning', 'active', 'paused']),
    supabase.from('leads').select('id, name, email, company, status, tier, source, created_at').order('created_at', { ascending: false }).limit(20),
    supabase.from('tasks').select('id, title, status, priority, project_id, assigned_to').in('status', ['backlog', 'active', 'blocked']).order('priority').limit(30),
    (supabase.from('approval_queue') as ReturnType<typeof supabase.from>).select('id, action_type, description, risk_level, status, created_at').eq('status', 'pending'),
    (supabase.from('revenue_entries') as ReturnType<typeof supabase.from>).select('amount, collected, source, description, date').order('date', { ascending: false }).limit(15),
    (supabase.from('expense_entries') as ReturnType<typeof supabase.from>).select('amount, category, vendor, description, date').order('date', { ascending: false }).limit(15),
  ])

  const projects = (projectsRes.data || []) as any[]
  const leads = (leadsRes.data || []) as any[]
  const tasks = (tasksRes.data || []) as any[]
  const approvals = (approvalsRes.data || []) as any[]
  const revenue = (revenueRes.data || []) as any[]
  const expenses = (expenseRes.data || []) as any[]

  const totalRevenue = revenue.filter((r: any) => r.collected).reduce((s: number, r: any) => s + (r.amount || 0), 0)
  const totalExpenses = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0)

  return `=== SHIFTBOARD LIVE DATA (${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}) ===

PROJECTS (${projects.length}):
${projects.length > 0 ? projects.map((p: any) => `- ${p.name} | ${p.status} | phase: ${p.phase || 'n/a'} | type: ${p.type || 'n/a'} | value: ${p.contract_value ? '$' + p.contract_value.toLocaleString() : 'n/a'}`).join('\n') : 'None.'}

LEADS (${leads.length}):
${leads.length > 0 ? leads.map((l: any) => `- [ID:${l.id}] ${l.name}${l.company ? ' (' + l.company + ')' : ''} | ${l.status} | tier: ${l.tier || 'unclassified'} | source: ${l.source || '?'} | ${l.created_at?.split('T')[0] || '?'}`).join('\n') : 'None.'}

TASKS (${tasks.length} open):
${tasks.length > 0 ? tasks.map((t: any) => `- [ID:${t.id}] ${t.title} | ${t.status} | priority: ${t.priority || 'n/a'} | assigned: ${t.assigned_to || 'unassigned'}`).join('\n') : 'None.'}

APPROVALS (${approvals.length} pending):
${approvals.length > 0 ? approvals.map((a: any) => `- [ID:${a.id}] ${a.action_type}: ${a.description || 'no description'} | risk: ${a.risk_level || 'low'}`).join('\n') : 'None.'}

MONEY:
- Revenue (collected): $${totalRevenue.toLocaleString()}
- Expenses: $${totalExpenses.toLocaleString()}
- Net: $${(totalRevenue - totalExpenses).toLocaleString()}
${revenue.length > 0 ? '\nRecent revenue:\n' + revenue.slice(0, 5).map((r: any) => `- $${r.amount?.toLocaleString()} — ${r.description || r.source || 'unlabeled'} ${r.collected ? '(collected)' : '(pending)'}`).join('\n') : ''}
${expenses.length > 0 ? '\nRecent expenses:\n' + expenses.slice(0, 5).map((e: any) => `- $${e.amount?.toLocaleString()} — ${e.vendor || e.category || 'unlabeled'}`).join('\n') : ''}

=== END LIVE DATA ===`
}

// ---- Main Handler (with Tool Use Loop) ----

export async function handleMessage(
  userMessage: string,
  channel: string,
  threadTs?: string,
  iface: string = 'slack'
): Promise<string> {
  // Load everything in parallel
  const [knowledge, history, liveData] = await Promise.all([
    loadKnowledge(),
    loadRecentMessages(channel),
    loadShiftBoardData(),
  ])

  // Save user message to memory
  await saveMessage(channel, 'user', userMessage, iface, threadTs)

  // Build system prompt from knowledge base
  const systemPrompt = knowledge || FALLBACK_SYSTEM_PROMPT

  // Build messages: history + current message with live data
  const messages: Anthropic.MessageParam[] = [
    ...history,
    {
      role: 'user',
      content: `${liveData}\n\nKJ says: "${userMessage}"`,
    },
  ]

  // Tool use loop — Claude may call multiple tools before responding
  let response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    tools: TOOLS,
    messages,
  })

  // Process tool calls in a loop
  let loopCount = 0
  const maxLoops = 5 // Safety limit

  while (response.stop_reason === 'tool_use' && loopCount < maxLoops) {
    loopCount++

    // Extract tool use blocks
    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    )

    // Execute each tool
    const toolResults: Anthropic.ToolResultBlockParam[] = []
    for (const toolUse of toolUseBlocks) {
      const result = await executeTool(toolUse.name, toolUse.input)
      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: result,
      })
    }

    // Continue conversation with tool results
    messages.push({ role: 'assistant', content: response.content })
    messages.push({ role: 'user', content: toolResults })

    response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    })
  }

  // Extract final text response
  const reply = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('\n')

  if (!reply) return ''

  // Save Artemis response to memory
  await saveMessage(channel, 'assistant', reply, iface, threadTs)

  // Post to Slack
  if (iface === 'slack') {
    if (threadTs) {
      await replyInThread(channel, threadTs, reply)
    } else {
      await postMessage(channel, reply)
    }
  }

  return reply
}

// Cron briefing
export async function sendBriefing(channel: string): Promise<void> {
  await handleMessage(
    'Morning briefing. Full overview — projects, leads, tasks, money, what needs my attention today.',
    channel,
    undefined,
    'cron'
  )
}

// Fallback if knowledge table is empty
const FALLBACK_SYSTEM_PROMPT = `You are Artemis, Chief Architect AI for L7 Shift — an AI-powered digital agency. You report to KJ (Kenneth Leftwich II), the founder. You're his right hand — sharp, direct, no fluff. Keep it concise, use Slack formatting, and always surface what needs attention.`

/**
 * Artemis — L7 Shift Chief Architect Brain
 *
 * Routes natural language commands to the right handler,
 * queries ShiftBoard for context, and responds via Slack.
 */

import { createServerClient } from '@/lib/supabase'
import {
  postMessage,
  replyInThread,
  headerBlock,
  sectionBlock,
  fieldsBlock,
  dividerBlock,
  actionsBlock,
  contextBlock,
  CHANNELS,
} from '@/lib/slack'

// ---- Intent Detection ----

type Intent =
  | 'status'        // "what's the status?" "how are things?"
  | 'pipeline'      // "show me the pipeline" "what leads do we have?"
  | 'money'         // "how much did we make?" "what's revenue?"
  | 'projects'      // "what projects are active?" "show me projects"
  | 'tasks'         // "what's on my plate?" "open tasks"
  | 'briefing'      // "give me a briefing" "morning report"
  | 'approve'       // "approve it" "looks good"
  | 'help'          // "help" "what can you do?"
  | 'unknown'

interface ParsedIntent {
  intent: Intent
  raw: string
  projectName?: string
  timeframe?: string
}

const INTENT_PATTERNS: [RegExp, Intent][] = [
  [/\b(brief|briefing|report|morning|recap|summary|update me)\b/i, 'briefing'],
  [/\b(pipeline|leads?|prospect|incoming|softball)\b/i, 'pipeline'],
  [/\b(money|revenue|income|expense|spent|p&l|profit|made|earned|cost)\b/i, 'money'],
  [/\b(project|client|active project|what.*working)\b/i, 'projects'],
  [/\b(task|todo|to.do|plate|backlog|sprint|blocked)\b/i, 'tasks'],
  [/\b(status|how.*things|what.*going|sit.?rep)\b/i, 'status'],
  [/\b(approve|lgtm|looks good|ship it|go ahead|green.?light)\b/i, 'approve'],
  [/\b(help|what can you|commands?|how do i)\b/i, 'help'],
]

export function parseIntent(text: string): ParsedIntent {
  const cleaned = text.replace(/<@[A-Z0-9]+>/g, '').trim()

  for (const [pattern, intent] of INTENT_PATTERNS) {
    if (pattern.test(cleaned)) {
      return { intent, raw: cleaned }
    }
  }

  return { intent: 'unknown', raw: cleaned }
}

// ---- Handlers ----

export async function handleIntent(
  parsed: ParsedIntent,
  channel: string,
  threadTs?: string
): Promise<void> {
  const respond = async (text: string, blocks?: unknown[]) => {
    if (threadTs) {
      await replyInThread(channel, threadTs, text, blocks as Parameters<typeof replyInThread>[3])
    } else {
      await postMessage(channel, text, blocks as Parameters<typeof postMessage>[2])
    }
  }

  switch (parsed.intent) {
    case 'briefing':
    case 'status':
      return handleBriefing(respond)
    case 'pipeline':
      return handlePipeline(respond)
    case 'money':
      return handleMoney(respond)
    case 'projects':
      return handleProjects(respond)
    case 'tasks':
      return handleTasks(respond)
    case 'approve':
      return handleApprovalCheck(respond)
    case 'help':
      return handleHelp(respond)
    case 'unknown':
      return handleUnknown(parsed.raw, respond)
  }
}

type Responder = (text: string, blocks?: unknown[]) => Promise<void>

// ---- Briefing / Status ----

async function handleBriefing(respond: Responder) {
  const supabase = createServerClient()

  // Parallel queries for speed
  const [
    projectsRes,
    leadsRes,
    tasksRes,
    pendingApprovalsRes,
    revenueRes,
    expenseRes,
  ] = await Promise.all([
    supabase.from('projects').select('id, name, status, phase').eq('status', 'active'),
    supabase.from('leads').select('id, name, status, tier, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('tasks').select('id, title, status, priority, project_id').in('status', ['pending', 'in_progress', 'blocked']),
    (supabase.from('approval_queue') as ReturnType<typeof supabase.from>).select('id, action_type, description, risk_level').eq('status', 'pending'),
    (supabase.from('revenue_entries') as ReturnType<typeof supabase.from>).select('amount, collected').eq('collected', true),
    (supabase.from('expense_entries') as ReturnType<typeof supabase.from>).select('amount'),
  ])

  const activeProjects = projectsRes.data?.length || 0
  const leads = leadsRes.data as any[] || []
  const tasks = tasksRes.data as any[] || []
  const incomingLeads = leads.filter(l => l.status === 'incoming').length
  const softballs = leads.filter(l => l.tier === 'SOFTBALL').length
  const openTasks = tasks.length
  const blockedTasks = tasks.filter(t => t.status === 'blocked').length
  const pendingApprovals = pendingApprovalsRes.data?.length || 0

  const revData = revenueRes.data as any[] || []
  const expData = expenseRes.data as any[] || []
  const totalRevenue = revData.reduce((sum: number, r: any) => sum + (r.amount || 0), 0)
  const totalExpenses = expData.reduce((sum: number, e: any) => sum + (e.amount || 0), 0)

  const blocks = [
    headerBlock('Artemis Briefing'),
    dividerBlock(),
    fieldsBlock([
      `*Active Projects*\n${activeProjects}`,
      `*Open Tasks*\n${openTasks}${blockedTasks > 0 ? ` (${blockedTasks} blocked)` : ''}`,
      `*Incoming Leads*\n${incomingLeads}${softballs > 0 ? ` (${softballs} softballs)` : ''}`,
      `*Pending Approvals*\n${pendingApprovals}`,
    ]),
    dividerBlock(),
    fieldsBlock([
      `*Revenue (Collected)*\n$${totalRevenue.toLocaleString()}`,
      `*Expenses*\n$${totalExpenses.toLocaleString()}`,
      `*Net*\n$${(totalRevenue - totalExpenses).toLocaleString()}`,
      `*Margin*\n${totalRevenue > 0 ? Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 100) : 0}%`,
    ]),
  ]

  // Add alerts
  const alerts: string[] = []
  if (blockedTasks > 0) alerts.push(`${blockedTasks} task${blockedTasks > 1 ? 's' : ''} blocked`)
  if (pendingApprovals > 0) alerts.push(`${pendingApprovals} approval${pendingApprovals > 1 ? 's' : ''} waiting on you`)
  if (softballs > 0) alerts.push(`${softballs} softball lead${softballs > 1 ? 's' : ''} — follow up`)

  if (alerts.length > 0) {
    blocks.push(dividerBlock())
    blocks.push(sectionBlock(`*Needs Attention:*\n${alerts.map(a => `• ${a}`).join('\n')}`))
  }

  blocks.push(contextBlock(`Artemis • ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`))

  await respond('Artemis Briefing', blocks)
}

// ---- Pipeline ----

async function handlePipeline(respond: Responder) {
  const supabase = createServerClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, email, company, status, tier, source, created_at')
    .order('created_at', { ascending: false })
    .limit(15)

  const allLeads = (leads || []) as any[]
  if (allLeads.length === 0) {
    await respond('Pipeline is empty. No leads in ShiftBoard.')
    return
  }

  const tierEmoji: Record<string, string> = {
    SOFTBALL: ':large_green_circle:',
    MEDIUM: ':large_yellow_circle:',
    HARD: ':red_circle:',
    DISQUALIFY: ':black_circle:',
  }

  const lines = allLeads.map((l: any) => {
    const emoji = tierEmoji[l.tier || ''] || ':white_circle:'
    const company = l.company ? ` (${l.company})` : ''
    return `${emoji} *${l.name}*${company} — ${l.status || 'incoming'} via ${l.source || '?'}`
  })

  const blocks = [
    headerBlock('Lead Pipeline'),
    sectionBlock(lines.join('\n')),
    contextBlock(`${allLeads.length} leads shown • Artemis`),
  ]

  await respond('Lead Pipeline', blocks)
}

// ---- Money ----

async function handleMoney(respond: Responder) {
  const supabase = createServerClient()

  const [revenueRes, expenseRes] = await Promise.all([
    (supabase.from('revenue_entries') as ReturnType<typeof supabase.from>).select('amount, collected, source, description, date').order('date', { ascending: false }).limit(10),
    (supabase.from('expense_entries') as ReturnType<typeof supabase.from>).select('amount, category, vendor, description, date').order('date', { ascending: false }).limit(10),
  ])

  const revenue = (revenueRes.data || []) as any[]
  const expenses = (expenseRes.data || []) as any[]

  const totalIn = revenue.reduce((s: number, r: any) => s + (r.amount || 0), 0)
  const totalCollected = revenue.filter((r: any) => r.collected).reduce((s: number, r: any) => s + (r.amount || 0), 0)
  const totalOut = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0)

  const blocks = [
    headerBlock('Money Report'),
    fieldsBlock([
      `*Total Revenue*\n$${totalIn.toLocaleString()}`,
      `*Collected*\n$${totalCollected.toLocaleString()}`,
      `*Expenses*\n$${totalOut.toLocaleString()}`,
      `*Net*\n$${(totalCollected - totalOut).toLocaleString()}`,
    ]),
  ]

  if (revenue.length > 0) {
    blocks.push(dividerBlock())
    blocks.push(sectionBlock('*Recent Revenue:*'))
    const revenueLines = revenue.slice(0, 5).map((r: any) =>
      `• $${r.amount?.toLocaleString()} — ${r.description || r.source || 'unlabeled'} ${r.collected ? ':white_check_mark:' : ':hourglass_flowing_sand:'}`
    )
    blocks.push(sectionBlock(revenueLines.join('\n')))
  }

  if (expenses.length > 0) {
    blocks.push(dividerBlock())
    blocks.push(sectionBlock('*Recent Expenses:*'))
    const expenseLines = expenses.slice(0, 5).map((e: any) =>
      `• $${e.amount?.toLocaleString()} — ${e.vendor || e.category || 'unlabeled'}`
    )
    blocks.push(sectionBlock(expenseLines.join('\n')))
  }

  blocks.push(contextBlock('Artemis • Finance'))

  await respond('Money Report', blocks)
}

// ---- Projects ----

async function handleProjects(respond: Responder) {
  const supabase = createServerClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, status, phase, type, contract_value')
    .in('status', ['planning', 'active', 'paused'])
    .order('status')

  const allProjects = (projects || []) as any[]
  if (allProjects.length === 0) {
    await respond('No active projects in ShiftBoard.')
    return
  }

  const statusEmoji: Record<string, string> = {
    active: ':rocket:',
    planning: ':pencil:',
    paused: ':double_vertical_bar:',
  }

  const lines = allProjects.map((p: any) => {
    const emoji = statusEmoji[p.status || ''] || ':folder:'
    const value = p.contract_value ? ` • $${p.contract_value.toLocaleString()}` : ''
    return `${emoji} *${p.name}* — ${p.phase || p.status}${value}`
  })

  const blocks = [
    headerBlock('Active Projects'),
    sectionBlock(lines.join('\n')),
    contextBlock(`${allProjects.length} projects • Artemis`),
  ]

  await respond('Active Projects', blocks)
}

// ---- Tasks ----

async function handleTasks(respond: Responder) {
  const supabase = createServerClient()
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, status, priority, project_id')
    .in('status', ['pending', 'in_progress', 'blocked'])
    .order('priority')
    .limit(20)

  const allTasks = (tasks || []) as any[]
  if (allTasks.length === 0) {
    await respond('No open tasks. Clear plate.')
    return
  }

  const priorityEmoji: Record<string, string> = {
    urgent: ':rotating_light:',
    high: ':fire:',
    medium: ':large_yellow_circle:',
    low: ':white_circle:',
  }

  const statusEmoji: Record<string, string> = {
    blocked: ':no_entry:',
    in_progress: ':hammer_and_wrench:',
    pending: ':inbox_tray:',
  }

  const lines = allTasks.map((t: any) => {
    const pEmoji = priorityEmoji[t.priority || ''] || ''
    const sEmoji = statusEmoji[t.status || ''] || ''
    return `${sEmoji} ${pEmoji} ${t.title}`
  })

  const blocked = allTasks.filter((t: any) => t.status === 'blocked')
  const inProgress = allTasks.filter((t: any) => t.status === 'in_progress')
  const pendingTasks = allTasks.filter((t: any) => t.status === 'pending')

  const blocks = [
    headerBlock('Open Tasks'),
    fieldsBlock([
      `*In Progress*\n${inProgress.length}`,
      `*Pending*\n${pendingTasks.length}`,
      `*Blocked*\n${blocked.length}`,
      `*Total Open*\n${allTasks.length}`,
    ]),
    dividerBlock(),
    sectionBlock(lines.join('\n')),
    contextBlock('Artemis • Tasks'),
  ]

  await respond('Open Tasks', blocks)
}

// ---- Approval Check ----

async function handleApprovalCheck(respond: Responder) {
  const supabase = createServerClient()
  const { data: pendingData } = await (supabase
    .from('approval_queue') as ReturnType<typeof supabase.from>)
    .select('id, action_type, description, risk_level, payload, created_at')
    .eq('status', 'pending')
    .order('created_at')

  const pendingItems = (pendingData || []) as any[]
  if (pendingItems.length === 0) {
    await respond('Nothing pending approval. All clear.')
    return
  }

  const blocks = [headerBlock(`${pendingItems.length} Pending Approval${pendingItems.length > 1 ? 's' : ''}`)]

  for (const item of pendingItems) {
    const riskEmoji = item.risk_level === 'high' ? ':rotating_light:' : item.risk_level === 'medium' ? ':warning:' : ':information_source:'

    blocks.push(dividerBlock())
    blocks.push(sectionBlock(`${riskEmoji} *${item.action_type}*\n${item.description || 'No description'}`))
    blocks.push(actionsBlock([
      { text: 'Approve', actionId: `approve_${item.id}`, value: String(item.id), style: 'primary' },
      { text: 'Reject', actionId: `reject_${item.id}`, value: String(item.id), style: 'danger' },
    ]))
  }

  blocks.push(contextBlock('Artemis • Approvals'))

  await respond('Pending Approvals', blocks)
}

// ---- Help ----

async function handleHelp(respond: Responder) {
  const blocks = [
    headerBlock('Artemis Commands'),
    sectionBlock(
      '*Just talk to me naturally. Here\'s what I understand:*\n\n' +
      ':clipboard: *"briefing"* or *"status"* — Full business overview\n' +
      ':dart: *"pipeline"* or *"leads"* — Lead pipeline\n' +
      ':money_with_wings: *"money"* or *"revenue"* — Financial report\n' +
      ':rocket: *"projects"* — Active projects\n' +
      ':hammer_and_wrench: *"tasks"* — Open tasks\n' +
      ':white_check_mark: *"approve"* — Pending approvals\n' +
      ':question: *"help"* — This message'
    ),
    contextBlock('Artemis • L7 Shift Chief Architect'),
  ]

  await respond('Artemis Commands', blocks)
}

// ---- Unknown ----

async function handleUnknown(raw: string, respond: Responder) {
  await respond(
    `I caught that but I'm not sure what you need. Try *"briefing"*, *"pipeline"*, *"money"*, *"projects"*, *"tasks"*, or *"help"*.\n\n_You said: "${raw}"_`
  )
}

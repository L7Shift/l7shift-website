/**
 * Artemis — L7 Shift Chief Architect Brain
 *
 * One brain. One source of truth. Terminal, Slack, whatever — same Artemis.
 * Knowledge lives in Supabase. Conversations are remembered.
 * Claude Opus IS the brain.
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

// ---- Load Knowledge from Supabase ----

async function loadKnowledge(): Promise<string> {
  const supabase = createServerClient()

  const { data } = await (supabase
    .from('artemis_knowledge') as ReturnType<typeof supabase.from>)
    .select('category, key, content')
    .eq('active', true)
    .order('priority', { ascending: false })

  const knowledge = (data || []) as any[]
  if (knowledge.length === 0) return ''

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

  return messages.map((m: any) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))
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
    supabase.from('leads').select('id, name, email, company, status, tier, source, created_at, ai_assessment').order('created_at', { ascending: false }).limit(20),
    supabase.from('tasks').select('id, title, status, priority, project_id, assigned_to').in('status', ['pending', 'in_progress', 'blocked']).order('priority').limit(30),
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
${leads.length > 0 ? leads.map((l: any) => `- ${l.name}${l.company ? ' (' + l.company + ')' : ''} | ${l.status} | tier: ${l.tier || 'unclassified'} | source: ${l.source || '?'} | ${l.created_at?.split('T')[0] || '?'}`).join('\n') : 'None.'}

TASKS (${tasks.length} open):
${tasks.length > 0 ? tasks.map((t: any) => `- ${t.title} | ${t.status} | priority: ${t.priority || 'n/a'} | assigned: ${t.assigned_to || 'unassigned'}`).join('\n') : 'None.'}

APPROVALS (${approvals.length} pending):
${approvals.length > 0 ? approvals.map((a: any) => `- ${a.action_type}: ${a.description || 'no description'} | risk: ${a.risk_level || 'low'}`).join('\n') : 'None.'}

MONEY:
- Revenue (collected): $${totalRevenue.toLocaleString()}
- Expenses: $${totalExpenses.toLocaleString()}
- Net: $${(totalRevenue - totalExpenses).toLocaleString()}
${revenue.length > 0 ? '\nRecent revenue:\n' + revenue.slice(0, 5).map((r: any) => `- $${r.amount?.toLocaleString()} — ${r.description || r.source || 'unlabeled'} ${r.collected ? '(collected)' : '(pending)'}`).join('\n') : ''}
${expenses.length > 0 ? '\nRecent expenses:\n' + expenses.slice(0, 5).map((e: any) => `- $${e.amount?.toLocaleString()} — ${e.vendor || e.category || 'unlabeled'}`).join('\n') : ''}

=== END LIVE DATA ===`
}

// ---- Main Handler ----

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

  // Ask Claude Opus
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  // Extract response
  const reply = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('\n')

  if (!reply) return ''

  // Save Artemis response to memory
  await saveMessage(channel, 'assistant', reply, iface, threadTs)

  // Post to Slack (skip if called from terminal or other non-Slack interface)
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

// Fallback if knowledge table is empty or fails
const FALLBACK_SYSTEM_PROMPT = `You are Artemis, Chief Architect AI for L7 Shift — an AI-powered digital agency. You report to KJ (Kenneth Leftwich II), the founder. You're his right hand — sharp, direct, no fluff. Keep it concise, use Slack formatting, and always surface what needs attention.`

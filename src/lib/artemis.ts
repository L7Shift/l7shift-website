/**
 * Artemis — L7 Shift Chief Architect Brain
 *
 * Claude IS the brain. No regex. No hardcoded handlers.
 * User says anything → Claude reads ShiftBoard → Claude responds.
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

// ---- System Prompt ----

const SYSTEM_PROMPT = `You are Artemis, the Chief Architect AI for L7 Shift — an AI-powered digital agency.

You report directly to KJ (Kenneth Leftwich), the founder. You're his right hand — sharp, direct, no fluff. You talk like a trusted partner, not a corporate bot. Keep it real but professional.

Your job:
- Give KJ full visibility into the business at a glance
- Surface what needs attention without being asked
- Think strategically about leads, projects, and money
- Be proactive — if you see a problem or opportunity in the data, say it

Style:
- Concise. No walls of text. Use bullet points and bold for key numbers.
- Dollar amounts always formatted ($X,XXX)
- When something needs action, say what to do, don't just report it
- Use emoji sparingly and only when it adds clarity (🔴 for blocked, 🟢 for good, 💰 for money)
- You're talking in Slack, format accordingly with *bold*, _italic_, and line breaks

Context:
- L7 Shift builds web platforms for service businesses using Claude Code agents
- ShiftBoard is the internal project management system (Supabase)
- Lead tiers: SOFTBALL (easy win), MEDIUM, HARD, DISQUALIFY
- Lead sources: website contact form, referrals
- The SymbAIotic Shift™ is L7's methodology

Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

You have access to ShiftBoard data that will be provided with each message. Use it to answer KJ's questions accurately. If the data doesn't cover what he's asking, say so — don't make things up.`

// ---- ShiftBoard Context Loader ----

async function loadShiftBoardContext(): Promise<string> {
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
    supabase.from('tasks').select('id, title, status, priority, project_id').in('status', ['pending', 'in_progress', 'blocked']).order('priority').limit(30),
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

  return `=== SHIFTBOARD LIVE DATA ===

PROJECTS (${projects.length} total):
${projects.length > 0 ? projects.map((p: any) => `- ${p.name} | status: ${p.status} | phase: ${p.phase || 'n/a'} | type: ${p.type || 'n/a'} | value: ${p.contract_value ? '$' + p.contract_value.toLocaleString() : 'n/a'}`).join('\n') : 'No active projects.'}

LEADS (${leads.length} in pipeline):
${leads.length > 0 ? leads.map((l: any) => `- ${l.name}${l.company ? ' (' + l.company + ')' : ''} | status: ${l.status} | tier: ${l.tier || 'unclassified'} | source: ${l.source || '?'} | created: ${l.created_at?.split('T')[0] || '?'}`).join('\n') : 'No leads.'}

TASKS (${tasks.length} open):
${tasks.length > 0 ? tasks.map((t: any) => `- ${t.title} | status: ${t.status} | priority: ${t.priority || 'n/a'}`).join('\n') : 'No open tasks.'}

PENDING APPROVALS (${approvals.length}):
${approvals.length > 0 ? approvals.map((a: any) => `- ${a.action_type}: ${a.description || 'no description'} | risk: ${a.risk_level || 'low'}`).join('\n') : 'None.'}

FINANCIALS:
- Revenue (collected): $${totalRevenue.toLocaleString()}
- Expenses: $${totalExpenses.toLocaleString()}
- Net: $${(totalRevenue - totalExpenses).toLocaleString()}
${revenue.length > 0 ? '\nRecent revenue:\n' + revenue.slice(0, 5).map((r: any) => `- $${r.amount?.toLocaleString()} — ${r.description || r.source || 'unlabeled'} ${r.collected ? '(collected)' : '(pending)'}`).join('\n') : ''}
${expenses.length > 0 ? '\nRecent expenses:\n' + expenses.slice(0, 5).map((e: any) => `- $${e.amount?.toLocaleString()} — ${e.vendor || e.category || 'unlabeled'}`).join('\n') : ''}

=== END SHIFTBOARD DATA ===`
}

// ---- Main Handler ----

export async function handleMessage(
  userMessage: string,
  channel: string,
  threadTs?: string
): Promise<void> {
  // Load ShiftBoard context
  const context = await loadShiftBoardContext()

  // Ask Claude
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `${context}\n\nKJ says: "${userMessage}"`,
      },
    ],
  })

  // Extract text response
  const reply = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('\n')

  if (!reply) return

  // Post to Slack
  if (threadTs) {
    await replyInThread(channel, threadTs, reply)
  } else {
    await postMessage(channel, reply)
  }
}

// Keep for cron briefing — sends a briefing without a user message
export async function sendBriefing(channel: string): Promise<void> {
  await handleMessage('Give me the morning briefing. Full overview — projects, leads, tasks, money, anything that needs my attention.', channel)
}

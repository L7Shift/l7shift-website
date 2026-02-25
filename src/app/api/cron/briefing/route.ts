/**
 * /api/cron/briefing — Scheduled Artemis Briefing
 *
 * Called by Vercel Cron to deliver morning briefings to #artemis.
 * Schedule: Every weekday at 8am ET
 *
 * vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/briefing",
 *     "schedule": "0 13 * * 1-5"  // 8am ET = 1pm UTC
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { parseIntent, handleIntent } from '@/lib/artemis'
import { CHANNELS } from '@/lib/slack'

export async function GET(request: NextRequest) {
  // Verify this is from Vercel Cron (or allow in dev)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const parsed = parseIntent('briefing')
    await handleIntent(parsed, CHANNELS.artemis)

    return NextResponse.json({
      success: true,
      delivered: CHANNELS.artemis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Briefing cron failed:', error)
    return NextResponse.json(
      { error: 'Failed to deliver briefing' },
      { status: 500 }
    )
  }
}

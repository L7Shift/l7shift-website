/**
 * GET /api/intake/[token]
 * Fetches lead data for pre-filling the intake form
 *
 * Token is generated when a "Let's Talk" lead is approved for full intake
 */

import { NextRequest, NextResponse } from 'next/server'

// TODO: Connect to Supabase/ShiftBoard
// For now, mock data for testing
const mockLeads: Record<string, { name: string; email: string; company: string; phone?: string }> = {
  'test-token': {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // TODO: Look up token in Supabase
    // const { data, error } = await supabase
    //   .from('intake_tokens')
    //   .select('lead_id, leads(*)')
    //   .eq('token', token)
    //   .eq('used', false)
    //   .gt('expires_at', new Date().toISOString())
    //   .single()

    const lead = mockLeads[token]

    if (!lead) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      name: lead.name,
      email: lead.email,
      company: lead.company || '',
    })
  } catch (error) {
    console.error('Intake token lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lead data' },
      { status: 500 }
    )
  }
}

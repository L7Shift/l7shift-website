/**
 * POST /api/intake/submit
 * Submits the full intake questionnaire
 *
 * Saves to ShiftBoard and triggers Make.com automation for lead scoring
 */

import { NextRequest, NextResponse } from 'next/server'

type IntakeSubmission = {
  token: string
  name: string
  email: string
  company: string
  role: string
  companySize: string
  industry: string
  industryOther?: string
  needs: string[]
  needsOther?: string
  visionClarity: string
  timeline: string
  budget: string
  decisionMaker: string
  currentTools: string
  frustration: string
  frustrationOther?: string
  pastExperience: string
  successCriteria: string
  source: string
  sourceOther?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: IntakeSubmission = await request.json()

    // Validate required fields
    const requiredFields = [
      'role',
      'companySize',
      'industry',
      'visionClarity',
      'timeline',
      'budget',
      'decisionMaker',
      'currentTools',
      'frustration',
      'pastExperience',
      'successCriteria',
      'source',
    ]

    const missingFields = requiredFields.filter(field => !body[field as keyof IntakeSubmission])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    if (!body.needs || body.needs.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one project need' },
        { status: 400 }
      )
    }

    // TODO: Save to Supabase/ShiftBoard
    // const { data, error } = await supabase
    //   .from('intake_submissions')
    //   .insert({
    //     token: body.token,
    //     answers: {
    //       role: body.role,
    //       company_size: body.companySize,
    //       industry: body.industry,
    //       industry_other: body.industryOther,
    //       project_type: body.needs,
    //       project_type_other: body.needsOther,
    //       vision_clarity: body.visionClarity,
    //       timeline: body.timeline,
    //       budget: body.budget,
    //       decision_maker: body.decisionMaker,
    //       current_tools: body.currentTools,
    //       frustration: body.frustration,
    //       frustration_other: body.frustrationOther,
    //       past_experience: body.pastExperience,
    //       success_criteria: body.successCriteria,
    //       source: body.source,
    //       source_other: body.sourceOther,
    //     },
    //     submitted_at: new Date().toISOString(),
    //   })

    // TODO: Mark token as used
    // await supabase
    //   .from('intake_tokens')
    //   .update({ used: true, used_at: new Date().toISOString() })
    //   .eq('token', body.token)

    // TODO: Trigger Make.com webhook for lead scoring
    // await fetch(process.env.MAKE_INTAKE_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // })

    console.log('Intake submission received:', JSON.stringify(body, null, 2))

    // Send notification email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          message: formatIntakeEmail(body),
        }),
      })
    } catch (emailError) {
      console.error('Failed to send intake notification email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Intake submitted successfully',
    })
  } catch (error) {
    console.error('Intake submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit intake' },
      { status: 500 }
    )
  }
}

function formatIntakeEmail(data: IntakeSubmission): string {
  const formatValue = (key: string, value: string | string[], other?: string): string => {
    if (Array.isArray(value)) {
      let result = value.join(', ')
      if (value.includes('other') && other) {
        result += ` (${other})`
      }
      return result
    }
    if (value === 'other' && other) {
      return `Other: ${other}`
    }
    return value
  }

  return `
FULL INTAKE QUESTIONNAIRE SUBMITTED

=== Contact Info ===
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}

=== About Them ===
Role: ${data.role}
Company Size: ${data.companySize}
Industry: ${formatValue('industry', data.industry, data.industryOther)}

=== Project Details ===
Needs: ${formatValue('needs', data.needs, data.needsOther)}
Vision Clarity: ${data.visionClarity}

=== Timeline & Budget ===
Timeline: ${data.timeline}
Budget: ${data.budget}
Decision Maker: ${data.decisionMaker}

=== Current Situation ===
Current Tools: ${data.currentTools}
Biggest Frustration: ${formatValue('frustration', data.frustration, data.frustrationOther)}
Past Dev Experience: ${data.pastExperience}

=== Success Criteria ===
"${data.successCriteria}"

=== Lead Source ===
${formatValue('source', data.source, data.sourceOther)}
  `.trim()
}

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured')
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  try {
    const body = await request.json()
    const {
      businessName,
      contactName,
      email,
      phone,
      website,
      socialHandles,
      currentChallenges,
      goals,
      timeline,
      budget,
      additionalInfo,
    } = body

    // Send notification email to L7 Shift
    await resend.emails.send({
      from: 'L7 Shift Discovery <discovery@l7shift.com>',
      to: ['hello@l7shift.com'],
      subject: `New Discovery: ${businessName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FAFAFA; padding: 40px;">
          <div style="border-bottom: 2px solid #00F0FF; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Client Discovery</h1>
            <p style="margin: 8px 0 0; color: #00F0FF; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">${businessName}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 14px; color: #00F0FF; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">Contact Information</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${contactName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #00F0FF;">${email}</a></p>
            ${phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
            ${website ? `<p style="margin: 8px 0;"><strong>Website:</strong> <a href="${website}" style="color: #00F0FF;">${website}</a></p>` : ''}
            ${socialHandles ? `<p style="margin: 8px 0;"><strong>Social:</strong> ${socialHandles}</p>` : ''}
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 14px; color: #FF00AA; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">Challenges</h2>
            <p style="margin: 0; line-height: 1.6; color: #E5E5E5;">${currentChallenges}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 14px; color: #FF00AA; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">Goals & Vision</h2>
            <p style="margin: 0; line-height: 1.6; color: #E5E5E5;">${goals}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 14px; color: #BFFF00; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">Project Details</h2>
            ${timeline ? `<p style="margin: 8px 0;"><strong>Timeline:</strong> ${timeline}</p>` : ''}
            ${budget ? `<p style="margin: 8px 0;"><strong>Budget:</strong> ${budget}</p>` : ''}
            ${additionalInfo ? `<p style="margin: 16px 0 0; line-height: 1.6; color: #E5E5E5;"><strong>Additional Info:</strong><br/>${additionalInfo}</p>` : ''}
          </div>

          <div style="border-top: 1px solid #2A2A2A; padding-top: 20px; margin-top: 30px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              Submitted from l7shift.com/discovery/${businessName.toLowerCase().replace(/\s+/g, '')}
            </p>
          </div>
        </div>
      `,
    })

    // Send confirmation email to client
    await resend.emails.send({
      from: 'L7 Shift <hello@l7shift.com>',
      to: [email],
      subject: `Discovery Received - ${businessName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FAFAFA; padding: 40px;">
          <div style="border-bottom: 2px solid #00F0FF; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Discovery Received</h1>
            <p style="margin: 8px 0 0; color: #E5E5E5;">Thanks for reaching out, ${contactName.split(' ')[0]}!</p>
          </div>

          <p style="line-height: 1.8; color: #E5E5E5; margin-bottom: 24px;">
            We've received your discovery form for <strong>${businessName}</strong> and are excited to learn more about your project.
          </p>

          <p style="line-height: 1.8; color: #E5E5E5; margin-bottom: 24px;">
            Our team will review your submission and get back to you within <strong>24 hours</strong> with our initial thoughts and next steps.
          </p>

          <div style="background: #2A2A2A; padding: 24px; margin: 30px 0;">
            <p style="margin: 0 0 8px; color: #00F0FF; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">What happens next?</p>
            <ol style="margin: 0; padding-left: 20px; color: #E5E5E5; line-height: 2;">
              <li>We review your discovery submission</li>
              <li>We schedule a 30-min strategy call</li>
              <li>We present a tailored proposal</li>
              <li>We get to work</li>
            </ol>
          </div>

          <p style="line-height: 1.8; color: #E5E5E5;">
            In the meantime, feel free to reply to this email if you have any questions.
          </p>

          <div style="border-top: 1px solid #2A2A2A; padding-top: 20px; margin-top: 30px;">
            <p style="margin: 0; color: #E5E5E5;">
              — The L7 Shift Team<br/>
              <span style="color: #666; font-size: 14px;">Strategy. Systems. Solutions.</span>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Discovery form error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

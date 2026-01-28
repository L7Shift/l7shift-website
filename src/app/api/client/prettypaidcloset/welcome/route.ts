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
    const { to, name, cc } = body

    // Pretty Paid Closet Brand Colors
    const roseGold = '#B76E79'
    const hotPink = '#FF69B4'
    const gold = '#D4AF37'
    const softCream = '#FFF8F0'
    const charcoal = '#2D2D2D'

    const portalLink = `https://l7shift.com/login`

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background: ${softCream}; font-family: 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: ${softCream}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border: 1px solid rgba(183,110,121,0.15); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(183,110,121,0.08);">

          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 32px 32px; text-align: center; border-bottom: 1px solid rgba(183,110,121,0.1);">
              <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 300; color: ${charcoal}; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px;">
                Pretty Paid
              </div>
              <div style="display: inline-block;">
                <span style="display: inline-block; width: 30px; height: 1px; background: ${roseGold}; vertical-align: middle;"></span>
                <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 400; font-style: italic; color: ${roseGold}; letter-spacing: 0.12em; margin: 0 10px; vertical-align: middle;">closet</span>
                <span style="display: inline-block; width: 30px; height: 1px; background: ${roseGold}; vertical-align: middle;"></span>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-style: italic; color: ${charcoal}; line-height: 1.5; font-weight: 400;">
                ${name ? `Hey ${name.split(' ')[0]}, your portal is ready!` : 'Your portal is ready!'}
              </p>

              <p style="margin: 0 0 24px; font-size: 15px; color: #666; line-height: 1.8;">
                We've set up your client portal with insights about your closet and a roadmap to help you grow your business. Here's what you'll find inside:
              </p>

              <!-- Stats Preview -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td width="33%" style="padding: 20px 12px; text-align: center; background: rgba(183,110,121,0.08);">
                    <span style="display: block; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 500; color: ${roseGold};">47</span>
                    <span style="font-size: 9px; color: #888; letter-spacing: 0.12em; text-transform: uppercase;">Listings</span>
                  </td>
                  <td width="33%" style="padding: 20px 12px; text-align: center; background: rgba(255,105,180,0.08);">
                    <span style="display: block; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 500; color: ${hotPink};">$28</span>
                    <span style="font-size: 9px; color: #888; letter-spacing: 0.12em; text-transform: uppercase;">Avg Price</span>
                  </td>
                  <td width="33%" style="padding: 20px 12px; text-align: center; background: rgba(212,175,55,0.08);">
                    <span style="display: block; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 500; color: ${gold};">$1.3K</span>
                    <span style="font-size: 9px; color: #888; letter-spacing: 0.12em; text-transform: uppercase;">Inventory</span>
                  </td>
                </tr>
              </table>

              <!-- Login Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px; background: ${softCream}; border: 2px solid ${roseGold}; border-radius: 12px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; font-size: 11px; color: ${roseGold}; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600;">
                      Your Login Credentials
                    </p>
                    <p style="margin: 0 0 8px; font-size: 14px; color: ${charcoal};">
                      <strong>Email:</strong> ${to}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: ${charcoal};">
                      <strong>Password:</strong> prettypaid2026
                    </p>
                    <p style="margin: 16px 0 0; font-size: 12px; color: #888;">
                      You can change your password after logging in.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 32px; font-size: 15px; color: #666; line-height: 1.8;">
                Click below to log in to your portal and complete the discovery questionnaire so we can finalize your project.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${portalLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${roseGold}, ${hotPink}); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 8px; box-shadow: 0 8px 24px rgba(183,110,121,0.3);">
                      Log In to Portal
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Inside -->
          <tr>
            <td style="padding: 0 32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: ${softCream}; border-left: 3px solid ${roseGold}; border-radius: 0 8px 8px 0; padding: 20px 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 12px; font-size: 11px; color: ${roseGold}; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600;">
                      What's Inside Your Portal
                    </p>
                    <ul style="margin: 0; padding: 0 0 0 18px; color: #666; font-size: 13px; line-height: 2.2;">
                      <li>Discovery questionnaire to complete</li>
                      <li>Your closet analytics & performance</li>
                      <li>Brand deliverables & style guide</li>
                      <li>Growth roadmap & next steps</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid rgba(183,110,121,0.1); text-align: center; background: rgba(183,110,121,0.03);">
              <p style="margin: 0 0 8px; font-size: 10px; color: #999; letter-spacing: 0.1em;">
                POWERED BY
              </p>
              <a href="https://l7shift.com" style="color: ${roseGold}; text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.1em;">
                L7 SHIFT
              </a>
              <p style="margin: 8px 0 0; font-size: 11px; color: #bbb;">
                Strategy. Systems. Solutions.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: 'L7 Shift <onboarding@resend.dev>',
      to: [to],
      subject: `${name ? name + ', your' : 'Your'} Pretty Paid Closet portal is ready`,
      html: emailHtml,
    }

    if (cc) {
      emailOptions.cc = Array.isArray(cc) ? cc : [cc]
    }

    await resend.emails.send(emailOptions)

    return NextResponse.json({ success: true, sentTo: to, cc: cc || null })
  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

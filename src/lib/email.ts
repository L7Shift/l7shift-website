import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email addresses
export const emailAddresses = {
  noReply: 'no-reply@l7shift.com',
  info: 'info@l7shift.com',
  admin: 'ken@l7shift.com', // Owner gets all notifications
}

// Generate HTML email template
function generateEmailHTML(
  title: string,
  bodyContent: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #FAFAFA; margin: 0; padding: 0; background-color: #0A0A0A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #1A1A1A; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 24px; text-align: center; background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(255, 0, 170, 0.1)); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #00F0FF, #FF00AA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">L7 SHIFT</h1>
              <p style="color: #888; margin: 8px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Strategy • Systems • Solutions</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px; background: #1A1A1A;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #0A0A0A; padding: 20px 24px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="color: #666; font-size: 12px; margin: 0;">
                <a href="https://l7shift.com" style="color: #00F0FF;">l7shift.com</a>
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
}

/**
 * Send new lead notification to admin
 */
export async function sendNewLeadNotification(data: {
  name: string
  email: string
  message: string
  source?: string
}): Promise<{ success: boolean; error?: string; resendId?: string }> {
  const bodyContent = `
    <h2 style="color: #00F0FF; margin: 0 0 16px; font-size: 20px;">New Contact Form Submission</h2>

    <div style="background: rgba(0, 240, 255, 0.1); border-left: 3px solid #00F0FF; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0 0 8px;"><strong style="color: #00F0FF;">Name:</strong> ${data.name}</p>
      <p style="margin: 0 0 8px;"><strong style="color: #00F0FF;">Email:</strong> <a href="mailto:${data.email}" style="color: #FAFAFA;">${data.email}</a></p>
      ${data.source ? `<p style="margin: 0 0 8px;"><strong style="color: #00F0FF;">Source:</strong> ${data.source}</p>` : ''}
    </div>

    <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #888; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
      <p style="color: #FAFAFA; margin: 0; white-space: pre-wrap;">${data.message}</p>
    </div>

    <p style="color: #888; font-size: 12px; margin: 24px 0 0;">
      Received at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: `L7 Shift <${emailAddresses.noReply}>`,
      to: emailAddresses.admin,
      replyTo: data.email, // So Ken can reply directly to the lead
      subject: `New Lead: ${data.name}`,
      html: generateEmailHTML('New Contact Form Submission', bodyContent),
    })

    return {
      success: true,
      resendId: result.data?.id
    }
  } catch (error) {
    console.error('Error sending lead notification email:', error)
    return {
      success: false,
      error: String(error)
    }
  }
}

/**
 * Send confirmation email to the person who submitted the form
 */
export async function sendContactConfirmation(data: {
  name: string
  email: string
}): Promise<{ success: boolean; error?: string }> {
  const bodyContent = `
    <h2 style="color: #FAFAFA; margin: 0 0 16px; font-size: 20px;">Thanks for reaching out, ${data.name}!</h2>

    <p style="color: #AAA; margin: 0 0 20px;">We've received your message and will get back to you within 24 hours.</p>

    <div style="background: rgba(191, 255, 0, 0.1); border-left: 3px solid #BFFF00; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="color: #BFFF00; margin: 0; font-weight: 600;">What happens next?</p>
      <ul style="color: #AAA; margin: 12px 0 0; padding-left: 20px;">
        <li>We'll review your project needs</li>
        <li>You'll receive a personalized response from our team</li>
        <li>If it's a fit, we'll schedule a discovery call</li>
      </ul>
    </div>

    <p style="color: #AAA; margin: 20px 0;">In the meantime, feel free to explore our <a href="https://l7shift.com" style="color: #00F0FF;">website</a> to learn more about how we help businesses transform their digital presence.</p>

    <p style="color: #888; margin: 24px 0 0;">— The L7 Shift Team</p>
  `

  try {
    await resend.emails.send({
      from: `L7 Shift <${emailAddresses.noReply}>`,
      to: data.email,
      subject: "We got your message!",
      html: generateEmailHTML('Thanks for Reaching Out', bodyContent),
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending contact confirmation email:', error)
    return { success: false, error: String(error) }
  }
}

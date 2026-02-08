import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ContactSubmission } from '@/lib/supabase'
import { sendNewLeadNotification, sendContactConfirmation } from '@/lib/email'

// Create server-side Supabase client
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// Make.com webhook for lead pipeline automation (secondary)
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/ud1mk1qkvy4hpu7rw7wtn45ukxhlixru'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body as ContactSubmission

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Track what succeeded for error reporting
    const results = {
      supabase: false,
      emailNotification: false,
      emailConfirmation: false,
      makeWebhook: false
    }

    // 1. PRIMARY: Save to Supabase (this is our source of truth)
    const supabase = getServerSupabase()
    if (supabase) {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .insert([{
            name,
            email,
            message,
            created_at: new Date().toISOString()
          }])

        if (!error) {
          results.supabase = true
        } else {
          console.error('Supabase insert error:', error)
        }
      } catch (dbError) {
        console.error('Supabase connection error:', dbError)
      }
    } else {
      console.warn('Supabase not configured - skipping database save')
    }

    // 2. FAILSAFE: Send email notification to Ken directly
    // This ensures Ken gets notified even if Make.com is down
    try {
      const emailResult = await sendNewLeadNotification({
        name,
        email,
        message,
        source: 'website contact form'
      })
      results.emailNotification = emailResult.success
      if (!emailResult.success) {
        console.error('Lead notification email failed:', emailResult.error)
      }
    } catch (emailError) {
      console.error('Lead notification email error:', emailError)
    }

    // 3. Send confirmation email to the person who submitted
    try {
      const confirmResult = await sendContactConfirmation({ name, email })
      results.emailConfirmation = confirmResult.success
    } catch (confirmError) {
      console.error('Confirmation email error:', confirmError)
      // Non-critical - don't fail the request
    }

    // 4. SECONDARY: Send to Make.com for automation (lead classification, etc.)
    // This is now secondary - we have direct email as failsafe
    try {
      const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          timestamp: new Date().toISOString(),
          source: 'website'
        })
      })
      results.makeWebhook = webhookResponse.ok
      if (!webhookResponse.ok) {
        console.error('Make.com webhook returned:', webhookResponse.status)
      }
    } catch (webhookError) {
      console.error('Make.com webhook error:', webhookError)
      // Continue - we have failsafes in place
    }

    // Log what happened for debugging
    console.log('Contact form submission results:', {
      name,
      email: email.replace(/(.{3}).*@/, '$1***@'), // Partially redact email
      results
    })

    // Success if at least ONE primary method worked
    if (results.supabase || results.emailNotification) {
      return NextResponse.json(
        {
          success: true,
          message: 'Contact form submitted successfully'
        },
        { status: 201 }
      )
    }

    // If both primary methods failed, that's a problem
    console.error('CRITICAL: Both Supabase and email notification failed for contact form')
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again or email us directly at ken@l7shift.com' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

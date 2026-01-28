/**
 * ShiftCards™ - Google Wallet API
 *
 * Generates Google Wallet passes and "Add to Wallet" URLs.
 * Requires: GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_SERVICE_EMAIL, GOOGLE_WALLET_PRIVATE_KEY
 */

import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, importPKCS8 } from 'jose'
import {
  generateGooglePassObject,
  generateGooglePassClass,
  getTheme,
  type CardHolder,
} from '@/lib/wallet-templates'

// Card holder data - will move to Supabase later
const cardHolders: Record<string, CardHolder> = {
  ken: {
    id: 'ken',
    name: 'Ken Leftwich',
    title: 'Founder & Chief Architect',
    company: 'L7 Shift',
    tagline: 'Digital transformation for the non-conformist.',
    email: 'ken@l7shift.com',
    phone: '(704) 839-9448',
    website: 'https://l7shift.com',
    socials: {
      linkedin: 'https://linkedin.com/in/kenleftwich',
      twitter: 'https://x.com/CharlotteAgency',
      github: 'https://github.com/ScatPackCLT',
    },
    themeId: 'l7-shift',
  },
}

/**
 * GET /api/wallet/google?id=ken
 * Returns a Google Wallet "Add to Wallet" URL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const holderId = searchParams.get('id')

    if (!holderId) {
      return NextResponse.json(
        { error: 'Missing card holder ID' },
        { status: 400 }
      )
    }

    const holder = cardHolders[holderId]
    if (!holder) {
      return NextResponse.json(
        { error: 'Card holder not found' },
        { status: 404 }
      )
    }

    // Check for required env vars
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID
    const serviceEmail = process.env.GOOGLE_WALLET_SERVICE_EMAIL
    const privateKeyRaw = process.env.GOOGLE_WALLET_PRIVATE_KEY

    if (!issuerId || !serviceEmail || !privateKeyRaw) {
      return NextResponse.json(
        {
          error: 'Google Wallet not configured',
          configured: false,
          // Return pass data so frontend can show preview
          passData: generateGooglePassObject(holder, `${holderId}-${Date.now()}`),
        },
        { status: 503 }
      )
    }

    // Generate unique object ID
    const objectId = `${holderId}-${Date.now()}`

    // Generate pass object
    const passObject = generateGooglePassObject(holder, objectId)

    // Create JWT
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n')
    const key = await importPKCS8(privateKey, 'RS256')

    const jwt = await new SignJWT({
      iss: serviceEmail,
      aud: 'google',
      origins: [process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'],
      typ: 'savetowallet',
      payload: {
        genericObjects: [passObject],
      },
    })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuedAt()
      .sign(key)

    const saveUrl = `https://pay.google.com/gp/v/save/${jwt}`

    return NextResponse.json({
      success: true,
      saveUrl,
      passData: passObject,
    })
  } catch (error) {
    console.error('Google Wallet error:', error)
    return NextResponse.json(
      { error: 'Failed to generate Google Wallet pass', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wallet/google/class
 * Creates the Google Wallet pass class (one-time setup)
 */
export async function POST(request: NextRequest) {
  try {
    const { themeId } = await request.json()
    const theme = getTheme(themeId || 'l7-shift')
    const passClass = generateGooglePassClass(theme)

    // In production, this would call the Google Wallet API to create the class
    // For now, return the class definition

    return NextResponse.json({
      success: true,
      message: 'Pass class definition generated. Use Google Wallet API to create.',
      classDefinition: passClass,
    })
  } catch (error) {
    console.error('Google Wallet class error:', error)
    return NextResponse.json(
      { error: 'Failed to generate pass class' },
      { status: 500 }
    )
  }
}

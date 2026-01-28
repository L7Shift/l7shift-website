/**
 * ShiftCards™ - Digital Identity Wallet Pass System
 * by L7 Shift
 *
 * NFC-enabled digital business cards with Apple & Google Wallet integration.
 * Base L7 templates that can be themed/configured for clients.
 */

// =============================================================================
// TEMPLATE INTERFACES
// =============================================================================

export interface WalletTheme {
  id: string
  name: string
  // Colors
  backgroundColor: string      // Main background (hex with #)
  foregroundColor: string      // Primary text color
  labelColor: string          // Label/accent color
  accentColor?: string        // Secondary accent (gradients, etc.)
  // Brand
  organizationName: string
  logoText?: string           // Text logo if no image
  tagline?: string
  website: string
  // Assets (URLs to hosted images)
  assets: {
    // Apple Wallet
    appleIcon?: string        // 29x29 @1x, 58x58 @2x
    appleLogo?: string        // 160x50 @1x, 320x100 @2x
    appleStrip?: string       // 375x123 @1x, 750x246 @2x
    // Google Wallet
    googleLogo?: string       // 660x660 (circular safe zone)
    googleHero?: string       // 1032x336
  }
}

export interface CardHolder {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  tagline?: string
  photo?: string
  socials?: {
    linkedin?: string
    twitter?: string
    github?: string
    instagram?: string
  }
  // Theme override (uses default if not specified)
  themeId?: string
}

// =============================================================================
// L7 SHIFT BASE THEME
// =============================================================================

export const L7_THEME: WalletTheme = {
  id: 'l7-shift',
  name: 'L7 Shift',
  // Colors
  backgroundColor: '#0A0A0A',      // Void Black
  foregroundColor: '#FAFAFA',      // Clean White
  labelColor: '#00F0FF',           // Electric Cyan
  accentColor: '#FF00AA',          // Hot Magenta
  // Brand
  organizationName: 'L7 Shift',
  logoText: 'L7 SHIFT',
  tagline: 'Break the Square',
  website: 'https://l7shift.com',
  // Assets
  assets: {
    appleIcon: '/wallet-assets/l7/icon.png',
    appleLogo: '/wallet-assets/l7/logo.png',
    appleStrip: '/wallet-assets/l7/strip.png',
    googleLogo: '/wallet-assets/l7/logo-google.png',
    googleHero: '/wallet-assets/l7/hero.png',
  },
}

// =============================================================================
// CLIENT THEME EXAMPLES (for reference/testing)
// =============================================================================

export const EXAMPLE_CLIENT_THEMES: WalletTheme[] = [
  {
    id: 'scat-pack',
    name: 'Scat Pack CLT',
    backgroundColor: '#1B4332',      // Forest Green
    foregroundColor: '#FFFFFF',
    labelColor: '#95D5B2',           // Mint
    accentColor: '#74C69D',
    organizationName: 'Scat Pack CLT',
    tagline: 'Keeping Charlotte Clean',
    website: 'https://scatpackclt.com',
    assets: {
      // Would be populated with actual client assets
    },
  },
  {
    id: 'stitchwichs',
    name: 'Stitchwichs',
    backgroundColor: '#1A1A2E',      // Deep Navy
    foregroundColor: '#EAEAEA',
    labelColor: '#E94560',           // Coral Red
    accentColor: '#533483',          // Purple
    organizationName: 'Stitchwichs Custom Apparel',
    tagline: 'Custom Apparel & Embroidery',
    website: 'https://stitchwichs.com',
    assets: {},
  },
]

// =============================================================================
// THEME REGISTRY
// =============================================================================

const themeRegistry = new Map<string, WalletTheme>()

// Register L7 theme as default
themeRegistry.set('l7-shift', L7_THEME)
themeRegistry.set('default', L7_THEME)

// Register example client themes
EXAMPLE_CLIENT_THEMES.forEach(theme => {
  themeRegistry.set(theme.id, theme)
})

export function getTheme(themeId: string): WalletTheme {
  return themeRegistry.get(themeId) || L7_THEME
}

export function registerTheme(theme: WalletTheme): void {
  themeRegistry.set(theme.id, theme)
}

export function getAllThemes(): WalletTheme[] {
  return Array.from(themeRegistry.values())
}

// =============================================================================
// APPLE WALLET PASS GENERATOR
// =============================================================================

export function generateApplePass(holder: CardHolder, serialNumber: string) {
  const theme = getTheme(holder.themeId || 'l7-shift')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'

  // Convert hex to RGB for Apple format
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return 'rgb(10, 10, 10)'
    return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
  }

  return {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || 'pass.com.l7shift.card',
    serialNumber,
    teamIdentifier: process.env.APPLE_TEAM_ID || '',
    organizationName: theme.organizationName,
    description: `${holder.name} - Digital Business Card`,
    logoText: theme.logoText || theme.organizationName,

    // Theme colors
    backgroundColor: hexToRgb(theme.backgroundColor),
    foregroundColor: hexToRgb(theme.foregroundColor),
    labelColor: hexToRgb(theme.labelColor),

    // Generic pass type (best for business cards)
    generic: {
      primaryFields: [
        {
          key: 'name',
          label: 'NAME',
          value: holder.name,
        },
      ],
      secondaryFields: [
        {
          key: 'title',
          label: 'TITLE',
          value: holder.title,
        },
        {
          key: 'company',
          label: 'COMPANY',
          value: holder.company,
        },
      ],
      auxiliaryFields: [
        {
          key: 'email',
          label: 'EMAIL',
          value: holder.email,
        },
        {
          key: 'phone',
          label: 'PHONE',
          value: holder.phone,
        },
      ],
      backFields: [
        {
          key: 'website',
          label: 'WEBSITE',
          value: holder.website,
        },
        ...(holder.socials?.linkedin ? [{
          key: 'linkedin',
          label: 'LINKEDIN',
          value: holder.socials.linkedin,
        }] : []),
        ...(holder.socials?.twitter ? [{
          key: 'twitter',
          label: 'X / TWITTER',
          value: holder.socials.twitter,
        }] : []),
        {
          key: 'tagline',
          label: 'ABOUT',
          value: holder.tagline || theme.tagline || '',
        },
        {
          key: 'poweredBy',
          label: 'POWERED BY',
          value: 'ShiftCards™ by L7 Shift',
        },
      ],
    },

    // QR code linking to full digital card
    barcodes: [
      {
        format: 'PKBarcodeFormatQR',
        message: `${baseUrl}/card/${holder.id}`,
        messageEncoding: 'iso-8859-1',
        altText: 'Scan for full profile',
      },
    ],

    // Web service for pass updates
    webServiceURL: `${baseUrl}/api/wallet/apple`,
    authenticationToken: serialNumber,
  }
}

// =============================================================================
// GOOGLE WALLET PASS GENERATOR
// =============================================================================

export function generateGooglePassClass(theme: WalletTheme = L7_THEME) {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || ''
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'

  return {
    id: `${issuerId}.${theme.id}-digital-identity`,
    issuerName: theme.organizationName,
    reviewStatus: 'UNDER_REVIEW',

    // Logo
    logo: {
      sourceUri: {
        uri: theme.assets.googleLogo
          ? `${baseUrl}${theme.assets.googleLogo}`
          : `${baseUrl}/wallet-assets/l7/logo-google.png`,
      },
      contentDescription: {
        defaultValue: {
          language: 'en',
          value: `${theme.organizationName} Logo`,
        },
      },
    },

    // Hero image
    heroImage: {
      sourceUri: {
        uri: theme.assets.googleHero
          ? `${baseUrl}${theme.assets.googleHero}`
          : `${baseUrl}/wallet-assets/l7/hero.png`,
      },
      contentDescription: {
        defaultValue: {
          language: 'en',
          value: theme.tagline || theme.organizationName,
        },
      },
    },

    hexBackgroundColor: theme.backgroundColor,

    homepageUri: {
      uri: theme.website,
      description: `${theme.organizationName} Website`,
    },

    // NFC support
    enableSmartTap: true,
    redemptionIssuers: [issuerId],
  }
}

export function generateGooglePassObject(holder: CardHolder, objectId: string) {
  const theme = getTheme(holder.themeId || 'l7-shift')
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || ''
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'
  const classId = `${issuerId}.${theme.id}-digital-identity`

  return {
    id: `${issuerId}.${objectId}`,
    classId,
    state: 'ACTIVE',

    // Card header
    cardTitle: {
      defaultValue: {
        language: 'en',
        value: holder.name,
      },
    },

    // Subheader
    subheader: {
      defaultValue: {
        language: 'en',
        value: holder.title,
      },
    },

    header: {
      defaultValue: {
        language: 'en',
        value: holder.company,
      },
    },

    // Contact info as text modules
    textModulesData: [
      {
        id: 'email',
        header: 'EMAIL',
        body: holder.email,
      },
      {
        id: 'phone',
        header: 'PHONE',
        body: holder.phone,
      },
      ...(holder.tagline ? [{
        id: 'about',
        header: 'ABOUT',
        body: holder.tagline,
      }] : []),
    ],

    // Links
    linksModuleData: {
      uris: [
        {
          id: 'website',
          uri: holder.website,
          description: 'Website',
        },
        {
          id: 'profile',
          uri: `${baseUrl}/card/${holder.id}`,
          description: 'Full Digital Profile',
        },
        ...(holder.socials?.linkedin ? [{
          id: 'linkedin',
          uri: holder.socials.linkedin,
          description: 'LinkedIn',
        }] : []),
        ...(holder.socials?.twitter ? [{
          id: 'twitter',
          uri: holder.socials.twitter,
          description: 'X / Twitter',
        }] : []),
      ],
    },

    // QR code
    barcode: {
      type: 'QR_CODE',
      value: `${baseUrl}/card/${holder.id}`,
      alternateText: 'Scan for full profile',
    },

    hexBackgroundColor: theme.backgroundColor,
  }
}

// =============================================================================
// JWT GENERATION FOR GOOGLE WALLET
// =============================================================================

export interface GoogleWalletCredentials {
  clientEmail: string
  privateKey: string
}

export async function createGoogleWalletJWT(
  passObject: ReturnType<typeof generateGooglePassObject>,
  credentials?: GoogleWalletCredentials
): Promise<string> {
  const creds = credentials || {
    clientEmail: process.env.GOOGLE_WALLET_SERVICE_EMAIL || '',
    privateKey: (process.env.GOOGLE_WALLET_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  }

  if (!creds.clientEmail || !creds.privateKey) {
    throw new Error('Google Wallet credentials not configured')
  }

  // JWT claims for Google Wallet
  const now = Math.floor(Date.now() / 1000)
  const claims = {
    iss: creds.clientEmail,
    aud: 'google',
    iat: now,
    origins: [process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'],
    typ: 'savetowallet',
    payload: {
      genericObjects: [passObject],
    },
  }

  // We'll use jose library for JWT signing
  // For now, return the claims as base64 (will be signed server-side)
  const header = { alg: 'RS256', typ: 'JWT' }
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encodedPayload = Buffer.from(JSON.stringify(claims)).toString('base64url')

  // Note: Actual signing requires the jose library
  // This is a placeholder - the API route will handle actual signing
  return `${encodedHeader}.${encodedPayload}.SIGNATURE_PLACEHOLDER`
}

export function getGoogleWalletSaveUrl(jwt: string): string {
  return `https://pay.google.com/gp/v/save/${jwt}`
}

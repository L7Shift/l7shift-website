/**
 * L7 Digital Identity - Wallet Pass Generation
 *
 * Supports:
 * - Apple Wallet (.pkpass files)
 * - Google Wallet (JWT-based passes)
 *
 * Design specs maintained for consistent experience across platforms.
 */

// Brand colors
export const BRAND = {
  voidBlack: '#0A0A0A',
  electricCyan: '#00F0FF',
  hotMagenta: '#FF00AA',
  acidLime: '#BFFF00',
  white: '#FFFFFF',
  // Hex without # for pass formats
  voidBlackHex: '0A0A0A',
  electricCyanHex: '00F0FF',
  hotMagentaHex: 'FF00AA',
}

// Card holder interface
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
}

// Pass design specifications
export const PASS_SPECS = {
  apple: {
    // Generic pass type for business cards
    passType: 'generic',
    // Image dimensions (points, @1x)
    icon: { width: 29, height: 29 },      // Required
    logo: { width: 160, height: 50 },     // Header logo
    strip: { width: 375, height: 123 },   // Behind primary fields
    thumbnail: { width: 90, height: 90 }, // Optional photo
    // Colors (RGB values 0-255)
    backgroundColor: BRAND.voidBlack,
    foregroundColor: BRAND.white,
    labelColor: BRAND.electricCyan,
  },
  google: {
    // Generic pass class
    classId: 'l7shift.digital-identity',
    // Image dimensions (pixels)
    heroImage: { width: 1032, height: 336 },
    logo: { width: 660, height: 660 },  // Circular safe zone
    // Colors
    hexBackgroundColor: `#${BRAND.voidBlackHex}`,
  },
}

/**
 * Generate Apple Wallet pass.json content
 */
export function generateApplePassJson(holder: CardHolder, serialNumber: string) {
  const webServiceURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'

  return {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || 'pass.com.l7shift.card',
    serialNumber,
    teamIdentifier: process.env.APPLE_TEAM_ID || '',
    organizationName: 'L7 Shift',
    description: `${holder.name} - Digital Business Card`,

    // Colors (RGB string format)
    backgroundColor: 'rgb(10, 10, 10)',
    foregroundColor: 'rgb(250, 250, 250)',
    labelColor: 'rgb(0, 240, 255)',

    // Generic pass structure
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
        {
          key: 'linkedin',
          label: 'LINKEDIN',
          value: holder.socials?.linkedin || '',
        },
        {
          key: 'tagline',
          label: 'ABOUT',
          value: holder.tagline || 'Digital transformation for the non-conformist.',
        },
      ],
    },

    // Barcode linking to digital card
    barcodes: [
      {
        format: 'PKBarcodeFormatQR',
        message: `${webServiceURL}/card/${holder.id}`,
        messageEncoding: 'iso-8859-1',
        altText: 'Scan for full profile',
      },
    ],

    // Web service for updates (optional)
    webServiceURL: `${webServiceURL}/api/wallet/apple`,
    authenticationToken: serialNumber, // Simple auth for now

    // Relevance (optional - can add location/time based relevance)
    // locations: [],
    // relevantDate: '',
  }
}

/**
 * Generate Google Wallet pass object
 */
export function generateGooglePassObject(holder: CardHolder, objectId: string) {
  const webServiceURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || ''
  const classId = `${issuerId}.l7shift-digital-identity`

  return {
    id: `${issuerId}.${objectId}`,
    classId,
    state: 'ACTIVE',

    // Header
    header: {
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

    // Text modules (contact info)
    textModulesData: [
      {
        id: 'company',
        header: 'COMPANY',
        body: holder.company,
      },
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
      {
        id: 'tagline',
        header: 'ABOUT',
        body: holder.tagline || 'Digital transformation for the non-conformist.',
      },
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
          uri: `${webServiceURL}/card/${holder.id}`,
          description: 'Full Digital Profile',
        },
        ...(holder.socials?.linkedin ? [{
          id: 'linkedin',
          uri: holder.socials.linkedin,
          description: 'LinkedIn',
        }] : []),
      ],
    },

    // Barcode
    barcode: {
      type: 'QR_CODE',
      value: `${webServiceURL}/card/${holder.id}`,
      alternateText: 'Scan for full profile',
    },

    // Hero image (will be generated/hosted)
    heroImage: {
      sourceUri: {
        uri: `${webServiceURL}/wallet-assets/hero.png`,
      },
      contentDescription: {
        defaultValue: {
          language: 'en',
          value: 'L7 Shift - Break the Square',
        },
      },
    },

    // Logo
    logo: {
      sourceUri: {
        uri: `${webServiceURL}/wallet-assets/logo-google.png`,
      },
      contentDescription: {
        defaultValue: {
          language: 'en',
          value: 'L7 Shift',
        },
      },
    },

    // Hex background color
    hexBackgroundColor: '#0A0A0A',
  }
}

/**
 * Generate Google Wallet pass class (created once per pass type)
 */
export function generateGooglePassClass() {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || ''
  const webServiceURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'

  return {
    id: `${issuerId}.l7shift-digital-identity`,
    issuerName: 'L7 Shift',

    // Review status
    reviewStatus: 'UNDER_REVIEW',

    // Logo
    logo: {
      sourceUri: {
        uri: `${webServiceURL}/wallet-assets/logo-google.png`,
      },
      contentDescription: {
        defaultValue: {
          language: 'en',
          value: 'L7 Shift Logo',
        },
      },
    },

    // Hero image
    heroImage: {
      sourceUri: {
        uri: `${webServiceURL}/wallet-assets/hero.png`,
      },
      contentDescription: {
        defaultValue: {
          language: 'en',
          value: 'L7 Shift - Break the Square',
        },
      },
    },

    // Hex background color
    hexBackgroundColor: '#0A0A0A',

    // Homepage
    homepageUri: {
      uri: webServiceURL,
      description: 'L7 Shift Website',
    },

    // Enable smart tap (NFC)
    enableSmartTap: true,
    redemptionIssuers: [issuerId],
  }
}

/**
 * Create JWT for Google Wallet "Add to Wallet" link
 */
export async function createGoogleWalletJWT(passObject: object): Promise<string> {
  // This will use google-auth-library to sign the JWT
  // For now, return placeholder - will implement with actual credentials

  const credentials = {
    type: 'service_account',
    client_email: process.env.GOOGLE_WALLET_SERVICE_EMAIL || '',
    private_key: process.env.GOOGLE_WALLET_PRIVATE_KEY || '',
  }

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google Wallet credentials not configured')
  }

  // JWT payload for Google Wallet
  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [process.env.NEXT_PUBLIC_SITE_URL || 'https://l7shift.com'],
    typ: 'savetowallet',
    payload: {
      genericObjects: [passObject],
    },
  }

  // Sign with private key (will implement with jose or google-auth-library)
  // For now, this is the structure
  return JSON.stringify(claims)
}

/**
 * Generate "Add to Google Wallet" URL
 */
export function getGoogleWalletSaveUrl(jwt: string): string {
  return `https://pay.google.com/gp/v/save/${jwt}`
}

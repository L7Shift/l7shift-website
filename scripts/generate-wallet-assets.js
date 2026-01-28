/**
 * Generate Google Wallet assets for ShiftCards
 * Run: node scripts/generate-wallet-assets.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '../public/wallet-assets/l7');

// L7 Shift brand colors
const COLORS = {
  voidBlack: '#0A0A0A',
  cleanWhite: '#FAFAFA',
  electricCyan: '#00F0FF',
  hotMagenta: '#FF00AA',
  acidLime: '#BFFF00',
};

async function generateLogo() {
  // Google Wallet logo: 660x660 with circular safe zone
  // Create L7 text on dark background
  const size = 660;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${COLORS.electricCyan}"/>
          <stop offset="50%" style="stop-color:${COLORS.hotMagenta}"/>
          <stop offset="100%" style="stop-color:${COLORS.acidLime}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="${COLORS.voidBlack}"/>
      <text x="50%" y="45%"
            font-family="Helvetica Neue, Arial, sans-serif"
            font-size="200"
            font-weight="500"
            fill="${COLORS.cleanWhite}"
            text-anchor="middle"
            dominant-baseline="middle">L7</text>
      <text x="50%" y="70%"
            font-family="Helvetica Neue, Arial, sans-serif"
            font-size="80"
            font-weight="700"
            fill="url(#grad)"
            text-anchor="middle"
            dominant-baseline="middle">SHIFT</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'logo-google.png'));

  console.log('Created logo-google.png (660x660)');
}

async function generateHero() {
  // Google Wallet hero: 1032x336
  const width = 1032;
  const height = 336;
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${COLORS.electricCyan}"/>
          <stop offset="50%" style="stop-color:${COLORS.hotMagenta}"/>
          <stop offset="100%" style="stop-color:${COLORS.acidLime}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="${COLORS.voidBlack}"/>
      <!-- Gradient bar at top -->
      <rect x="0" y="0" width="${width}" height="4" fill="url(#heroGrad)"/>
      <!-- L7 SHIFT text -->
      <text x="50" y="${height/2 - 20}"
            font-family="Helvetica Neue, Arial, sans-serif"
            font-size="72"
            font-weight="500"
            fill="${COLORS.cleanWhite}">L7</text>
      <text x="145" y="${height/2 - 20}"
            font-family="Helvetica Neue, Arial, sans-serif"
            font-size="72"
            font-weight="700"
            fill="${COLORS.cleanWhite}">SHIFT</text>
      <!-- Tagline -->
      <text x="50" y="${height/2 + 40}"
            font-family="Inter, Arial, sans-serif"
            font-size="24"
            font-weight="600"
            letter-spacing="4"
            fill="${COLORS.electricCyan}">BREAK THE SQUARE</text>
      <!-- Gradient bar at bottom -->
      <rect x="0" y="${height - 4}" width="${width}" height="4" fill="url(#heroGrad)"/>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(OUTPUT_DIR, 'hero.png'));

  console.log('Created hero.png (1032x336)');
}

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  await generateLogo();
  await generateHero();

  console.log('\nWallet assets generated in:', OUTPUT_DIR);
}

main().catch(console.error);

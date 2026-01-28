# ShiftCards™ Wallet Assets

Required image assets for Apple Wallet and Google Wallet passes.

## L7 Shift Theme (`/l7/`)

### Apple Wallet Assets
| File | Size (@1x) | Size (@2x) | Description |
|------|-----------|-----------|-------------|
| `icon.png` | 29×29 | 58×58 | Pass icon (required) |
| `icon@2x.png` | 58×58 | - | Retina pass icon |
| `logo.png` | 160×50 | 320×100 | Header logo |
| `logo@2x.png` | 320×100 | - | Retina header logo |
| `strip.png` | 375×123 | 750×246 | Background strip behind fields |
| `strip@2x.png` | 750×246 | - | Retina strip |

### Google Wallet Assets
| File | Size | Description |
|------|------|-------------|
| `logo-google.png` | 660×660 | Square logo (circular safe zone) |
| `hero.png` | 1032×336 | Hero/banner image |

## Design Guidelines

### L7 Brand Colors
- **Background**: #0A0A0A (Void Black)
- **Primary**: #00F0FF (Electric Cyan)
- **Accent**: #FF00AA (Hot Magenta)
- **Text**: #FAFAFA (Clean White)

### Logo Requirements
- Use "L7 SHIFT" wordmark or broken square icon
- Maintain contrast against dark background
- Include gradient accent where appropriate

### Strip/Hero Image
- Feature broken square motif
- Use subtle gradient (cyan → magenta)
- Keep text minimal ("Break the Square" tagline)

## Client Themes

Create subdirectories for each client:
```
/wallet-assets/
├── l7/           # L7 Shift (default)
├── client-a/     # Client theme
└── client-b/     # Another client
```

Each client directory should contain the same file structure as `/l7/`.

# L7 Shift Security Documentation

## Overview

This document outlines the security measures implemented in the L7 Shift platform to protect client data and ensure enterprise-grade authentication.

## Authentication System

### Password Security

| Feature | Implementation |
|---------|----------------|
| Hashing Algorithm | bcrypt (12 rounds) |
| Salt | Automatically generated per-password |
| Minimum Strength | Timing-safe comparison |
| Storage | Never stored in plaintext |

### Session Management

- **Token Generation**: 32-byte cryptographically secure random tokens
- **Session Duration**: 7 days with sliding expiration
- **Storage**: Server-side in Supabase with client cookie reference
- **Invalidation**: On logout, password change, or security event

### Rate Limiting

| Protection | Limit | Window |
|------------|-------|--------|
| IP-based login attempts | 5 attempts | 15 minutes |
| Email-based login attempts | 5 attempts | 15 minutes |
| API requests | 100 requests | 1 minute |
| Account lockout | After 5 failures | 15 minutes |

**Implementation**: Upstash Redis (production) with in-memory fallback (development)

### CAPTCHA Integration

Supports multiple providers:
- **reCAPTCHA v3** (invisible, score-based)
- **hCaptcha** (privacy-focused alternative)
- **Cloudflare Turnstile** (lightweight)

Score threshold: 0.5 (configurable)

## Security Features

### Brute Force Protection

1. **Progressive delays**: Timing jitter on all responses (min 200ms)
2. **Account lockout**: Automatic after 5 failed attempts
3. **IP tracking**: Distributed attack detection
4. **Suspicious activity detection**: Bot signatures, multi-account attempts

### Timing Attack Prevention

- All password comparisons use constant-time algorithms
- Response times are normalized to prevent enumeration
- Generic error messages prevent user discovery

### Input Validation

| Field | Validation |
|-------|------------|
| Email | Max 255 characters, normalized lowercase |
| Password | Max 128 characters |
| Tokens | Exact length validation |

### Cookie Security

```
httpOnly: true      // Prevents XSS access
secure: true        // HTTPS only in production
sameSite: 'lax'     // CSRF protection
path: '/'           // Scoped to domain
```

### Audit Logging

All security events are logged:
- Login attempts (success/failure)
- Logout events
- Rate limit triggers
- Suspicious activity detection
- Session creation/invalidation
- Password changes

Log retention: 90 days (configurable)

## Environment Variables

### Required for Production

```env
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# CAPTCHA (choose one)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# OR
HCAPTCHA_SECRET_KEY=your_hcaptcha_secret

# OR
TURNSTILE_SECRET_KEY=your_turnstile_secret

# User Passwords (CHANGE IN PRODUCTION)
ADMIN_PASSWORD=strong_random_password
PPC_CLIENT_PASSWORD=strong_random_password
SCATPACK_CLIENT_PASSWORD=strong_random_password
STITCHWICHS_CLIENT_PASSWORD=strong_random_password
```

### Optional Security Enhancements

```env
PASSWORD_SALT=additional_salt_for_env_users
```

## Database Security

### Row Level Security (RLS)

- Users can only read their own data
- Admin role required for cross-user access
- Sessions scoped to owning user
- Security logs admin-only

### Schema

See `supabase/migrations/001_auth_security.sql` for full schema.

## Incident Response

### Suspicious Activity Detected

The system automatically:
1. Logs the event with full context
2. Blocks the request (403)
3. Continues monitoring the IP

### Account Lockout

1. User receives clear message about lockout
2. Automatic unlock after 15 minutes
3. Admin can manually unlock via database

### Data Breach Response

1. Invalidate all sessions: `DELETE FROM sessions;`
2. Force password reset for affected users
3. Review security logs for scope
4. Notify affected users

## Security Checklist

### Before Production

- [ ] Change all default passwords
- [x] Set up Upstash Redis for rate limiting *(Completed Jan 27, 2026 - shared with Scat Pack)*
- [ ] Configure CAPTCHA provider
- [ ] Enable Supabase RLS policies
- [ ] Test rate limiting thresholds
- [ ] Verify cookie security settings
- [ ] Review security log retention
- [ ] Set up monitoring alerts

### Ongoing Maintenance

- [ ] Review security logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate service keys quarterly
- [ ] Penetration test annually

## API Security Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/logout` | POST/GET | End session |
| `/api/auth/session` | GET | Validate session |

## Contact

For security concerns, contact: ken@l7shift.com

---

*Document version: 1.0*
*Last updated: January 2026*
*L7 Shift - Strategy. Systems. Solutions.*

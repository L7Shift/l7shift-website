/**
 * /api/slack/oauth — Slack OAuth Callback
 *
 * Exchanges the authorization code for a bot token after installation.
 * This endpoint is called by Slack after the user authorizes the app.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')

  if (error) {
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#0a0a0a;color:#eee">
        <h1 style="color:#ff5252">Installation Failed</h1>
        <p>Error: ${error}</p>
        <p><a href="https://api.slack.com/apps" style="color:#00e5ff">Back to Slack Apps</a></p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#0a0a0a;color:#eee">
        <h1 style="color:#ff5252">Missing Code</h1>
        <p>No authorization code received.</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Exchange code for token
  const clientId = process.env.SLACK_CLIENT_ID
  const clientSecret = process.env.SLACK_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#0a0a0a;color:#eee">
        <h1 style="color:#D4A843">Almost There</h1>
        <p>Artemis app authorized successfully.</p>
        <p style="color:#777">OAuth code received but SLACK_CLIENT_ID/SLACK_CLIENT_SECRET not configured on server yet.</p>
        <p>Go to <a href="https://api.slack.com/apps" style="color:#00e5ff">Slack Apps</a> → Artemis → OAuth & Permissions to find your Bot Token.</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  try {
    const res = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    })

    const data = await res.json()

    if (!data.ok) {
      return new NextResponse(
        `<html><body style="font-family:monospace;padding:40px;background:#0a0a0a;color:#eee">
          <h1 style="color:#ff5252">Token Exchange Failed</h1>
          <p>Error: ${data.error}</p>
          <p><a href="https://api.slack.com/apps" style="color:#00e5ff">Back to Slack Apps</a></p>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    }

    // Success — show the token (only visible to the person installing)
    const botToken = data.access_token
    const teamName = data.team?.name || 'your workspace'

    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#0a0a0a;color:#eee">
        <h1 style="color:#00E676">Artemis Installed</h1>
        <p>Successfully installed to <strong>${teamName}</strong></p>
        <p style="margin-top:20px;color:#777">Bot Token (store this in Keychain):</p>
        <code style="display:block;background:#161616;padding:16px;border:1px solid #1e1e1e;border-radius:8px;color:#00E676;word-break:break-all;margin:8px 0">${botToken}</code>
        <p style="margin-top:20px;color:#777">Run in Terminal:</p>
        <code style="display:block;background:#161616;padding:16px;border:1px solid #1e1e1e;border-radius:8px;color:#00e5ff;word-break:break-all">security add-generic-password -a l7shift -s SLACK_BOT_TOKEN -w "${botToken}"</code>
        <p style="margin-top:30px;color:#444">This page is not saved or logged. Close it after copying.</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err) {
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#0a0a0a;color:#eee">
        <h1 style="color:#ff5252">Error</h1>
        <p>Failed to exchange token. Try again.</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}

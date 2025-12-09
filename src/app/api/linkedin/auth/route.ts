import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let redirectUri = searchParams.get('redirectUri')
  
  // If no redirectUri provided, construct it from environment or use localhost
  if (!redirectUri) {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    redirectUri = `${baseUrl}/linkedin-callback`
  }
  
  // Ensure redirectUri has proper format (with protocol)
  if (!redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
    redirectUri = `http://${redirectUri}`
  }
  
  const clientId = process.env.LINKEDIN_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: 'LinkedIn Client ID not configured. Please set LINKEDIN_CLIENT_ID environment variable.' },
      { status: 500 }
    )
  }

  // LinkedIn OAuth 2.0 authorization URL with OpenID Connect
  const scope = 'openid profile email'
  const state = Math.random().toString(36).substring(7) // Simple state for CSRF protection
  
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`

  return NextResponse.json({ authUrl, state, redirectUri })
}


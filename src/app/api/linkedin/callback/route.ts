import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.json({
      success: false,
      error: 'LinkedIn authentication failed',
    })
  }

  if (!code) {
    return NextResponse.json({
      success: false,
      error: 'No authorization code received',
    })
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  // Use the same redirect URI that was used in the auth request
  // This must match EXACTLY what's configured in LinkedIn app settings
  const redirectUri = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/linkedin-callback`

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      success: false,
      error: 'LinkedIn OAuth not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables.',
    })
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('LinkedIn token error:', errorText)
      throw new Error('Failed to get access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch user profile from LinkedIn OpenID Connect endpoint
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text()
      console.error('LinkedIn profile error:', errorText)
      throw new Error('Failed to fetch profile')
    }

    const profile = await profileResponse.json()

    // Return profile data as JSON
    return NextResponse.json({
      success: true,
      profile: {
        firstName: profile.given_name || profile.firstName || '',
        lastName: profile.family_name || profile.lastName || '',
        email: profile.email || '',
        linkedinUrl: profile.sub ? `https://www.linkedin.com/in/${profile.sub}` : profile.linkedinUrl || '',
        picture: profile.picture || '',
      },
    })
  } catch (error: any) {
    console.error('LinkedIn OAuth error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Authentication failed',
    })
  }
}


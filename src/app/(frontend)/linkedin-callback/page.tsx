'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LinkedInCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage(
          { type: 'LINKEDIN_AUTH_ERROR', error: error },
          window.location.origin
        )
      }
      window.close()
      return
    }

    if (code) {
      // Exchange code for profile data
      const exchangeCode = async () => {
        try {
          const response = await fetch(`/api/linkedin/callback?code=${code}`)
          const data = await response.json()

          if (data.success && data.profile) {
            // Send profile data to parent window
            if (window.opener) {
              window.opener.postMessage(
                { type: 'LINKEDIN_AUTH_SUCCESS', profile: data.profile },
                window.location.origin
              )
            }
          } else {
            if (window.opener) {
              window.opener.postMessage(
                { type: 'LINKEDIN_AUTH_ERROR', error: 'Failed to fetch profile' },
                window.location.origin
              )
            }
          }
        } catch (error) {
          if (window.opener) {
            window.opener.postMessage(
              { type: 'LINKEDIN_AUTH_ERROR', error: 'Authentication failed' },
              window.location.origin
            )
          }
        } finally {
          setTimeout(() => {
            window.close()
          }, 1000)
        }
      }

      exchangeCode()
    }
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#488BF3] mx-auto mb-4"></div>
        <p className="text-[#000F19]">Completing LinkedIn authentication...</p>
      </div>
    </div>
  )
}


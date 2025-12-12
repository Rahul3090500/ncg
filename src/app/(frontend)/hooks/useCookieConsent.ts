'use client'

import { useState, useEffect } from 'react'

export type CookieConsentStatus = 'accepted' | 'rejected' | null

/**
 * Hook to check and manage cookie consent status
 * Returns the current consent status and a function to update it
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsentStatus>(null)

  useEffect(() => {
    // Check localStorage for existing consent
    const storedConsent = localStorage.getItem('ncg-cookie-consent') as CookieConsentStatus
    if (storedConsent === 'accepted' || storedConsent === 'rejected') {
      setConsent(storedConsent)
    }
  }, [])

  const updateConsent = (status: CookieConsentStatus) => {
    if (status) {
      localStorage.setItem('ncg-cookie-consent', status)
      setConsent(status)
    } else {
      localStorage.removeItem('ncg-cookie-consent')
      setConsent(null)
    }
  }

  return {
    consent,
    hasConsent: consent === 'accepted',
    hasRejected: consent === 'rejected',
    updateConsent,
  }
}

/**
 * Utility function to check if cookies are accepted (can be used outside React components)
 */
export function getCookieConsent(): CookieConsentStatus {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('ncg-cookie-consent') as CookieConsentStatus
}

/**
 * Utility function to check if cookies are accepted (can be used outside React components)
 */
export function hasCookieConsent(): boolean {
  return getCookieConsent() === 'accepted'
}

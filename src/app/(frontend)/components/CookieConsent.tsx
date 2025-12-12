'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCookieConsent } from '../hooks/useCookieConsent'

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { consent, updateConsent } = useCookieConsent()

  useEffect(() => {
    // Check if user has already made a choice
    if (!consent) {
      // Show banner after a small delay for smooth animation
      setTimeout(() => {
        setShowBanner(true)
        setTimeout(() => setIsVisible(true), 10)
      }, 500)
    }
  }, [consent])

  const handleAccept = () => {
    updateConsent('accepted')
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  const handleReject = () => {
    updateConsent('rejected')
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  if (!showBanner) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6 md:pb-8 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}
    >
      <div className="w-full max-w-6xl bg-[#001D5C] rounded-2xl md:rounded-3xl px-4 py-4 md:px-6 md:py-5 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          {/* Text Content */}
          <div className="flex-1 text-white text-sm md:text-base leading-relaxed">
            <span className="font-medium">NCG</span> uses cookies to improve your experience. By using our website, you agree to our{' '}
            <Link
              href="/privacy-policy"
              className="text-[#488BF3] cursor-pointer hover:text-[#488BF3] underline transition-colors duration-200 font-medium"
            >
              cookies policy
            </Link>
            .
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-3 md:gap-4 w-full md:w-auto">
            {/* Reject Button */}
            <button
              onClick={handleReject}
              className="px-5 cursor-pointer md:px-6 py-2.5 md:py-3 bg-[#488BF3] text-white rounded-xl md:rounded-2xl font-medium text-sm md:text-base hover:bg-[#488BF3] transition-all duration-200 active:scale-95 whitespace-nowrap flex-shrink-0"
              aria-label="Reject cookies"
            >
              Reject
            </button>

            {/* Accept Button */}
            <button
              onClick={handleAccept}
              className="px-5 cursor-pointer md:px-6 py-2.5 md:py-3 bg-white text-[#488BF3] rounded-xl md:rounded-2xl font-medium text-sm md:text-base hover:bg-gray-50 transition-all duration-200 active:scale-95 whitespace-nowrap flex-shrink-0"
              aria-label="Accept cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent

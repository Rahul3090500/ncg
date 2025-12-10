'use client'

import React, { useState, useEffect } from 'react'

interface ShareButtonProps {
  url?: string
  title: string
  className?: string
}

const ShareButton: React.FC<ShareButtonProps> = ({ url, title, className = '' }) => {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState(url || '')

  useEffect(() => {
    // Get current URL on client side if not provided
    if (!shareUrl && typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
  }, [shareUrl])

  const handleShare = async () => {
    const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '')
    const shareData = {
      title: title,
      url: currentUrl,
    }

    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(currentUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      // User cancelled or error occurred, try clipboard fallback
      if (error instanceof Error && error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(currentUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError)
          // Fallback: Show URL in alert
          alert(`Share this link: ${currentUrl}`)
        }
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`text-white hover:opacity-80 transition-opacity cursor-pointer relative ${className}`}
      aria-label="Share this page"
      title={copied ? 'Link copied!' : 'Share this page'}
    >
      <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.6705 9.75865H21.8876C21.6159 9.75865 21.3553 9.86659 21.1631 10.0587C20.971 10.2509 20.8631 10.5115 20.8631 10.7832C20.8631 11.0549 20.971 11.3155 21.1631 11.5076C21.3553 11.6998 21.6159 11.8077 21.8876 11.8077H25.6705C27.7181 11.8077 29.384 13.7098 29.384 16.0477V26.4959C29.384 28.8342 27.7181 30.7359 25.6705 30.7359H5.76255C3.71489 30.7359 2.04906 28.8342 2.04906 26.4959V16.0476C2.04906 13.7096 3.71489 11.8075 5.76255 11.8075H9.54544C9.81716 11.8075 10.0778 11.6996 10.2699 11.5074C10.462 11.3153 10.57 11.0547 10.57 10.783C10.57 10.5113 10.462 10.2507 10.2699 10.0585C10.0778 9.8664 9.81716 9.75846 9.54544 9.75846H5.76255C2.58502 9.75846 0 12.5798 0 16.0476V26.4959C0 29.9637 2.58502 32.785 5.76255 32.785H25.6705C28.848 32.785 31.433 29.9637 31.433 26.4959V16.0476C31.433 12.5798 28.848 9.75865 25.6705 9.75865Z" fill="white" />
        <path d="M10.8351 6.83876C11.1035 6.83909 11.3613 6.73374 11.5526 6.54549L14.6918 3.46523V19.3225C14.6918 19.5942 14.7997 19.8548 14.9919 20.0469C15.184 20.2391 15.4446 20.347 15.7163 20.347C15.988 20.347 16.2486 20.2391 16.4408 20.0469C16.6329 19.8548 16.7408 19.5942 16.7408 19.3225V3.46523L19.8799 6.54523C20.0739 6.73555 20.3355 6.84102 20.6072 6.83845C20.8789 6.83588 21.1385 6.72548 21.3288 6.53153C21.5191 6.33758 21.6246 6.07597 21.622 5.80425C21.6195 5.53253 21.5091 5.27296 21.3151 5.08265L16.4339 0.293278C16.2424 0.105306 15.9847 0 15.7163 0C15.448 0 15.1903 0.105306 14.9988 0.293278L10.1175 5.08297C9.97228 5.22547 9.87277 5.40798 9.83167 5.60725C9.79057 5.80651 9.80973 6.01351 9.8867 6.20184C9.96368 6.39018 10.095 6.55133 10.2639 6.66476C10.4328 6.77819 10.6317 6.83877 10.8351 6.83876Z" fill="white" />
      </svg>
      {copied && (
        <span className="absolute -top-8 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Link copied!
        </span>
      )}
    </button>
  )
}

export default ShareButton


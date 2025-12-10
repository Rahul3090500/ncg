'use client'

import React from 'react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, description }) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || '')

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    copy: url,
  }

  const handleShare = (platform: 'linkedin' | 'facebook' | 'twitter' | 'copy') => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      // You could add a toast notification here
      return
    }
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
      <span className="text-[#000F19] text-sm md:text-base lg:text-lg font-manrope-medium">Share:</span>
      <button
        onClick={() => handleShare('linkedin')}
        aria-label="Share on LinkedIn"
        className='cursor-pointer'
      >
        <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_5106_3121)">
            <path d="M6.05281 8.35455H0.833312C0.601587 8.35455 0.414062 8.54282 0.414062 8.77473V25.5797C0.414062 25.812 0.601912 25.9999 0.833312 25.9999H6.05281C6.28454 25.9999 6.47206 25.8117 6.47206 25.5797V8.77473C6.47206 8.54249 6.28421 8.35455 6.05281 8.35455Z" fill="#000F19" />
            <path d="M3.44435 0C1.54505 0 0 1.54683 0 3.44803C0 5.34924 1.54505 6.89737 3.44435 6.89737C5.34365 6.89737 6.88577 5.34989 6.88577 3.44803C6.88577 1.54683 5.34202 0 3.44435 0Z" fill="#000F19" />
            <path d="M19.3293 7.93683C17.2331 7.93683 15.6831 8.84004 14.7432 9.86637V8.7749C14.7432 8.54266 14.5554 8.35472 14.324 8.35472H9.3255C9.09377 8.35472 8.90625 8.54299 8.90625 8.7749V25.5799C8.90625 25.8122 9.0941 26.0001 9.3255 26.0001H14.5336C14.7654 26.0001 14.9529 25.8118 14.9529 25.5799V17.2654C14.9529 14.4635 15.7124 13.3721 17.6611 13.3721C19.7837 13.3721 19.9524 15.1218 19.9524 17.4096V25.5802C19.9524 25.8125 20.1402 26.0004 20.3716 26.0004H25.5817C25.8134 26.0004 26.0009 25.8122 26.0009 25.5802V16.3625C26.0009 12.1962 25.2083 7.93715 19.3293 7.93715V7.93683Z" fill="#000F19" />
          </g>
          <defs>
            <clipPath id="clip0_5106_3121">
              <rect width="26" height="26" fill="white" />
            </clipPath>
          </defs>
        </svg>


      </button>
      <button
        onClick={() => handleShare('facebook')}
        aria-label="Share on Facebook"
        className='cursor-pointer'
      >
        <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 0C5.82045 0 0 5.85037 0 13.0668C0 19.618 4.80114 25.0271 11.0571 25.9721V16.5301H7.84077V13.0953H11.0571V10.8098C11.0571 7.02579 12.8913 5.36452 16.0201 5.36452C17.5187 5.36452 18.3111 5.47618 18.6863 5.52726V8.52551H16.552C15.2236 8.52551 14.7597 9.7912 14.7597 11.2179V13.0953H18.6526L18.1244 16.5301H14.7597V26C21.1049 25.1346 26 19.6816 26 13.0668C26 5.85037 20.1795 0 13 0Z" fill="#000F19" />
        </svg>

      </button>
      <button
        onClick={() => handleShare('twitter')}
        aria-label="Share on X (Twitter)"
        className='cursor-pointer'
      >
        <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.0633906 0L10.1017 13.4222L0 24.335H2.27349L11.1175 14.7806L18.2632 24.335H26L15.3969 10.1578L24.7995 0H22.526L14.3811 8.79933L7.80016 0H0.0633906ZM3.40672 1.67465H6.96101L22.6561 22.66H19.1019L3.40672 1.67465Z" fill="#000F19" />
        </svg>

      </button>
      <button
        onClick={() => handleShare('copy')}
        aria-label="Copy link"
        className='cursor-pointer'
      >
        <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.0764 18.3865L10.8452 21.6178C9.06295 23.3986 6.16348 23.4016 4.38111 21.6178C2.60042 19.8356 2.60042 16.9366 4.38111 15.1543L7.6139 11.923C8.20893 11.3287 8.20893 10.3639 7.6139 9.76868C7.01886 9.17347 6.05486 9.17362 5.45967 9.76868L2.22704 13.0002C-0.742348 15.9697 -0.742348 20.8026 2.22704 23.7721C3.71174 25.2576 5.66213 26 7.61253 26C9.56445 26 11.5147 25.2576 12.9994 23.7721L16.2306 20.5408C16.8257 19.9457 16.8257 18.9817 16.2306 18.3865C15.6356 17.7913 14.6716 17.7914 14.0764 18.3865Z" fill="black" />
          <path d="M12.9998 2.22826L9.76854 5.45962C9.17351 6.05468 9.17351 7.01871 9.76854 7.61392C10.3636 8.20912 11.3276 8.20897 11.9228 7.61392L15.154 4.38255C16.9347 2.6018 19.8343 2.59876 21.6181 4.38255C23.3988 6.16482 23.3988 9.06377 21.6181 10.846L18.3853 14.0774C17.7903 14.6717 17.7903 15.6365 18.3853 16.2317C18.6828 16.5292 19.0726 16.6781 19.4623 16.6781C19.852 16.6781 20.2418 16.5292 20.5394 16.2317L23.7721 13.0002C26.7415 10.0307 26.7415 5.19774 23.7721 2.22826C20.8012 -0.743514 15.9677 -0.741991 12.9998 2.22826Z" fill="black" />
          <path d="M15.1529 8.69171L8.69042 15.1544C8.09538 15.7495 8.09538 16.7135 8.69042 17.3087C8.98794 17.6063 9.37777 17.7551 9.76745 17.7551C10.1571 17.7551 10.547 17.6063 10.8445 17.3087L17.307 10.846C17.902 10.2509 17.902 9.28692 17.307 8.69171C16.712 8.0965 15.748 8.09665 15.1529 8.69171Z" fill="black" />
        </svg>

      </button>
    </div>
  )
}

export default SocialShare


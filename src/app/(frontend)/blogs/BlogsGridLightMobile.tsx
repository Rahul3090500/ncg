'use client'

import React from 'react'
import Link from 'next/link'
import AnimatedButton from '../components/AnimatedButton'

interface BlogsGridLightMobileProps {
  imageUrl: string
  date: string
  title: string
  description: string
  href?: string
  slug?: string
}

const BlogsGridLightMobile: React.FC<BlogsGridLightMobileProps> = ({
  imageUrl,
  date,
  title,
  description,
  href,
  slug,
}) => {
  // Format date to "17 August 2025" format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      // If date parsing fails, return the original string
      return dateString
    }
  }

  // Determine the URL to use - prefer href, fallback to slug-based URL, or '#'
  const blogUrl: string = href && href !== '#' ? href : (slug ? `/blogs/${slug}` : '#')

  return (
    <Link href={blogUrl} className="block w-full overflow-hidden bg-white cursor-pointer">
      <div className="overflow-hidden px-3 bg-white">
        {/* IMAGE - Always in hovered state (smaller height) */}
        <div className="overflow-hidden" style={{ height: '199px', marginTop: '12px' }}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="pb-[16px] pt-[20px] relative">
          {/* Date */}
          <p className="text-slate-950 text-xs leading-3 font-manrope-normal mt-2">
            {formatDate(date)}
          </p>

          {/* Title */}
          <p className="mt-[4px] text-slate-950 text-lg leading-6">
            {title}
          </p>

          {/* Description - Always visible */}
          <p className="mt-[8px] h-[40px] text-black mb-4 text-base font-manrope-light leading-5 overflow-hidden">
            {description}
          </p>
          
          {/* Button - Always visible */}
          <div className="mt-[24px]">
            <AnimatedButton width='w-36' height='h-10' text="Read More" asDiv={true} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BlogsGridLightMobile


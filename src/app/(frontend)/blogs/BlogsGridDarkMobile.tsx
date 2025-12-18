'use client'

import React from 'react'
import Link from 'next/link'
import AnimatedButton from '../components/AnimatedButton'

interface BlogsGridDarkMobileProps {
  imageUrl: string
  date?: string | null
  title: string
  description: string
  href?: string
  slug?: string
}

const BlogsGridDarkMobile: React.FC<BlogsGridDarkMobileProps> = ({
  imageUrl,
  date,
  title,
  description,
  href,
  slug,
}) => {
  // Format date to "17 August 2025" format
  const formatDate = (dateString?: string | null) => {
    // Check if dateString exists and is not empty
    if (!dateString) {
      return ''
    }

    try {
      let date: Date

      // Handle different input types
      if (typeof dateString === 'number') {
        // If it's already a number (timestamp)
        date = new Date(dateString)
      } else if (typeof dateString === 'string') {
        // If it's a string, try parsing it
        const trimmed = dateString.trim()
        if (trimmed === '') {
          return ''
        }
        
        // Try parsing as timestamp first if it's a numeric string
        const timestamp = parseInt(trimmed, 10)
        if (!isNaN(timestamp) && String(timestamp) === trimmed) {
          date = new Date(timestamp)
        } else {
          // Try parsing as date string
          date = new Date(trimmed)
        }
      } else {
        return ''
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return ''
      }

      // Format valid date
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      // If date parsing fails, return empty string
      console.error('Error formatting date:', dateString, error)
      return ''
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
          <div className="mt-[24px] mb-[25px]">
            <AnimatedButton width='w-36' height='h-10' text="Read More" asDiv={true} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BlogsGridDarkMobile


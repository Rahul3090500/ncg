'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedButton from '../components/AnimatedButton'
interface BlogsGridDarkProps {
  imageUrl: string
  date?: string | null
  title: string
  description: string
  href?: string
  slug?: string
}

const BlogsGridDark: React.FC<BlogsGridDarkProps> = ({
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
    <Link href={blogUrl} className="group block w-full overflow-hidden bg-transparent cursor-pointer" style={{ perspective: 1000 }}>
      <motion.div
        initial="default"
        whileHover="hover"
        animate="default"
        variants={{
          default: { backgroundColor: 'rgba(255,255,255,0)' },
          hover: { backgroundColor: '#ffffff' },
        }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className=" overflow-hidden"
      >
        {/* IMAGE */}
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full object-cover"
          variants={{
            default: { height: 275, y: 0 },
            hover: { height: 250, y:0 },
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />

        {/* CONTENT */}
        <div className="pb-[16px] pt-3 relative px-3">
          {/* Date */}
          <p 
            className={`group-hover:text-slate-950 text-[#000F19] text-xs leading-3 font-manrope-normal mt-2`}
          >
            {formatDate(date)}
          </p>

          {/* Title */}
          <p 
            className={`mt-[4px] group-hover:text-slate-950 text-[#000F19] text-lg leading-6`}
          >
            {title}
          </p>

          {/* Description (fade + slide up) */}
          <motion.p
            variants={{
              default: { opacity: 0, y: 10 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="mt-[8px] h-[40px] text-black mb-4 text-base font-manrope-light leading-5 overflow-hidden"
          >
            {description}
          </motion.p>
          <motion.div
            variants={{
              default: { opacity: 0, y: 10 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="mt-[24px]"
          >
            <AnimatedButton width='w-36' height='h-10' text="Read More" asDiv={true} />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}

export default BlogsGridDark

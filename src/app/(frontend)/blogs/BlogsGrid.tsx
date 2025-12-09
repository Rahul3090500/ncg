'use client'

import React from 'react'
import { motion } from 'framer-motion'
import AnimatedButton from '../components/AnimatedButton'

interface BlogsGridProps {
  imageUrl: string
  date: string
  title: string
  description: string
  href?: string
  slug?: string
}

const BlogsGrid: React.FC<BlogsGridProps> = ({
  imageUrl,
  date,
  title,
  description,
  href = '#',
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
  return (
    <motion.a
      href={href}
      initial="default"
      whileHover="hover"
      animate="default"
      className="block w-full overflow-hidden bg-transparent cursor-pointer"
      style={{ perspective: 1000 }}
    >
      <motion.div
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
          className="w-full object-cover h-[200px] md:h-[240px] lg:h-[275px]"
          variants={{
            default: { height: 200, y: 0 },
            hover: { height: 199, y: 12 },
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />

        {/* CONTENT */}
        <div className="pb-3 md:pb-4 lg:pb-[16px] pt-4 md:pt-5 lg:pt-[20px] relative">
          {/* Date */}
          <p className="text-slate-950 text-[10px] md:text-xs leading-3 font-manrope-normal mt-1 md:mt-2">
            {formatDate(date)}
          </p>

          {/* Title */}
          <p className="mt-1 md:mt-[4px] text-slate-950 text-base md:text-lg leading-5 md:leading-6">
            {title}
          </p>

          {/* Description (fade + slide up) */}
          <motion.p
            variants={{
              default: { opacity: 0, y: 10 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="mt-2 md:mt-[8px] h-[36px] md:h-[40px] text-black text-sm md:text-base font-manrope-light leading-4 md:leading-5 overflow-hidden"
          >
            {description}
          </motion.p>

          {/* READ MORE BUTTON */}
          <motion.div
            variants={{
              default: { opacity: 0, y: 10 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="mt-4 md:mt-5 lg:mt-[24px]"
          >
            <AnimatedButton width='w-full md:w-32 lg:w-36' height='h-9 md:h-10' text="Read More" asDiv={true} />
          </motion.div>
        </div>
      </motion.div>
    </motion.a>
  )
}

export default BlogsGrid

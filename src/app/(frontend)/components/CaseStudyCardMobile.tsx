'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface CaseStudyCardMobileProps {
  image: string
  alt: string
  category: string
  title: string
  description: string
  link?: string
  icon?: React.ReactNode
  isFirst?: boolean
  isLast?: boolean
}

const CaseStudyCardMobile: React.FC<CaseStudyCardMobileProps> = ({
  image,
  alt,
  category,
  title,
  description,
  link = '#',
  icon,
  isFirst = false,
}) => {
  return (
    <motion.a
      href={link}
      className="relative w-full md:w-[477px] h-[450px] md:h-[520px] overflow-hidden cursor-pointer block md:border-r border-gray-300 flex-shrink-0"
      initial="default"
      animate="default"
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ 
        boxSizing: 'border-box',
      }}
    >
      <div className="px-4 md:pl-[38px] md:pr-[38px] pt-5 md:pt-[27px] h-full flex flex-col">
        {/* Category Tag */}
        <motion.div
          variants={{
            default: { color: '#000f19' },
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="mb-3 md:mb-[13px] flex-shrink-0"
        >
          <div className="w-[90px] md:w-[100px] h-[24px] md:h-[27px] py-[4px] md:py-[5px] bg-white rounded-[3px] outline outline-1 outline-[#000f19]/20 inline-flex justify-center items-center gap-[4px] md:gap-[5px]">
            {icon && <div className="flex items-center justify-center">{icon}</div>}
            <div className="text-right justify-start text-[#1c0909] text-[10px] md:text-xs font-manrope-medium strokeWidth">
              {category}
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          variants={{
            default: { color: '#000f19' },
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="text-lg md:text-[21px] font-manrope-semibold strokeWidth leading-tight md:leading-[25px] mb-[34px] md:mb-[34px] break-words"
        >
          {title}
        </motion.div>

        {/* Image Container */}
        <div className="h-[300px] md:h-[370px] overflow-hidden flex-shrink-0">
          <motion.img
            src={image}
            alt={alt}
            variants={{
              default: {
                y: 0,
                opacity: 1,
              },
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.a>
  )
}

export default CaseStudyCardMobile

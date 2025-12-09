'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface CaseStudyCardProps {
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

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
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
      className="relative w-full lg:w-[477px] h-auto lg:h-[520px] min-h-[450px] md:min-h-[480px] lg:min-h-[520px] overflow-hidden cursor-pointer block"
      initial="default"
      whileHover="variant2"
      animate="default"
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Background */}
      <motion.div
        variants={{
          default: { backgroundColor: 'rgba(0, 15, 25, 0)' },
          variant2: { backgroundColor: '#000f19' },
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`absolute inset-0 border-r border-gray-300 ${isFirst ? 'border-l' : ''}`}
      />

      {/* Category Tag */}
         <motion.div
        variants={{
          default: { color: '#000f19', top: '27px' },
          variant2: { color: '#ffffff', top: '37px' },
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }} className="absolute left-4 md:left-6 lg:left-[38px]">
        <div className="w-[90px] md:w-[95px] lg:w-[100px] h-[24px] md:h-[25px] lg:h-[27px] py-[4px] md:py-[4.5px] lg:py-[5px] bg-white rounded-[3px] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.15)] outline outline-1 outline-[#000f19]/20 inline-flex justify-center items-center gap-[4px] md:gap-[4.5px] lg:gap-[5px]">
          {icon && <div className="flex items-center justify-center">{icon}</div>}
          <div className="text-right justify-start text-[#1c0909] text-[10px] md:text-[11px] lg:text-xs font-manrope-medium strokeWidth">
            {category}
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        variants={{
          default: { color: '#000f19', top: '67px' },
          variant2: { color: '#ffffff', top: '77px' },
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute left-4 md:left-6 lg:left-[38px] right-4 md:right-6 lg:right-auto w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] lg:w-[400px] text-base md:text-lg lg:text-[21px] font-manrope-semibold strokeWidth leading-tight md:leading-[22px] lg:leading-[25px]"
      >
        {title}
      </motion.div>

      {/* Description */}
      <motion.div
        variants={{
          default: {
            opacity: 0,
            color: 'rgba(255,255,255,0)',
            top: '125px',
          },
          variant2: {
            opacity: 1,
            color: '#ffffff',
            top: '135px',
          },
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute left-4 md:left-6 lg:left-[38px] right-4 md:right-6 lg:right-auto w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] lg:w-[400px] text-sm md:text-[14px] lg:text-[15px] font-manrope-normal strokeWidth leading-4 md:leading-[18px] lg:leading-5"
      >
        {description}
      </motion.div>
      <motion.div
        variants={{
          default: {
            opacity: 0,
            color: 'rgba(255,255,255,0)',
            top: '227px',
          },
          variant2: {
            opacity: 1,
            color: '#ffffff',
            top: '230px',
          },
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute right-4 md:right-6 lg:right-[38px]"
      >
        <svg
          width="20"
          height="19"
          viewBox="0 0 20 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0.511719 17.4992L18.4869 0.748232" stroke="white" strokeWidth="1.5" />
          <path d="M3.49609 0.75H18.4883V15.7422" stroke="white" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Image Container */}
      <div className="absolute left-4 md:left-6 lg:left-[38px] right-4 md:right-6 lg:right-auto top-[150px] md:top-[150px] lg:top-[150px] w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] lg:w-[400px] h-[280px] md:h-[320px] lg:h-[370px] overflow-hidden">
        <motion.img
          src={image}
          alt={alt}
          variants={{
            default: {
              y: 0,
              opacity: 1,
            },
            variant2: {
              y: 113,
              opacity: 1,
            },
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-full h-full object-cover"
        />
      </div>
    </motion.a>
  )
}

export default CaseStudyCard

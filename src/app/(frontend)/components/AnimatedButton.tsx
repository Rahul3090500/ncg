'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
interface AnimatedButtonProps {
  text: string
  bgColor?: string
  hoverBgColor?: string
  textColor?: string
  hoverTextColor?: string
  link?: string
  className?: string
  width?: string
  height?: string
  roundness?: string
  centered?: boolean
  asDiv?: boolean // When true, renders as div instead of anchor tag
  openInNewTab?: boolean // When true, opens link in new tab
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  bgColor = '#488bf3',
  hoverBgColor = '#2f6edb',
  textColor = '#ffffff',
  hoverTextColor = '#ffffff',
  link = '#',
  className = '',
  width = 'w-[184px]',
  height = 'h-[49px]',
  roundness = 'rounded-[5px]',
  centered = false,
  asDiv = false,
  openInNewTab = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (asDiv && link.startsWith('#')) {
      e.preventDefault()
      const targetId = link.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const buttonContent = (
    <motion.div
      className={`relative ${width} ${height} overflow-hidden ${roundness} cursor-pointer block ${className}`}
      initial="default"
      whileHover="hover"
      animate="default"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      onClick={handleClick}
    >
      <motion.div
        variants={{
          default: { backgroundColor: bgColor },
          hover: { backgroundColor: hoverBgColor },
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`absolute inset-0 ${roundness}`}
      />
      {centered ? (
        <div className="absolute inset-0 flex items-center justify-center">
       <div className="relative w-[8px] h-[15px] overflow-visible mr-[5px]">
            <motion.div
              variants={{
                default: { x: 0 ,opacity:1 },
                hover: {  x: '100%' ,opacity:0 },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-[8px] h-[15px]"
            >
              <svg
                width="8"
                height="15"
                viewBox="0 0 8 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  variants={{
                    default: { stroke: textColor },
                    hover: { stroke: hoverTextColor },
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  d="M0.480469 0.437256L6.48047 7.03726L0.480469 13.6373"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
 
              </svg>
            </motion.div>
            <motion.div


              variants={{
                default: {  x: '-100%' ,opacity:0},
                hover: { x: 0 ,opacity:1 },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute top-0 w-[8px] h-[15px]"
            >
              <svg
                width="8"
                height="15"
                viewBox="0 0 8 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  variants={{
                    default: { stroke: hoverTextColor },
                    hover: { stroke: hoverTextColor },
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  d="M0.480469 0.437256L6.48047 7.03726L0.480469 13.6373"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />

              </svg>
            </motion.div>
          </div>
          <div className="relative h-[21px] overflow-hidden ml-[10px]">
            <motion.div
              variants={{
                default: { y: 0, color: textColor },
                hover: { y: '-100%', color: hoverTextColor },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="text-[17px] font-manrope-medium leading-[21px]"
            >
              {text}
            </motion.div>
            <motion.div
              variants={{
                default: { y: '100%', color: hoverTextColor },
                hover: { y: 0, color: hoverTextColor },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute top-0 text-[17px] font-manrope-medium leading-[21px]"
            >
              {text}
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center pl-[20px]">
          <div className="relative w-[8px] h-[15px] overflow-visible">
            <motion.div
              variants={{
                default: { x: 0 ,opacity:1 },
                hover: {  x: '100%' ,opacity:0 },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-[8px] h-[15px]"
            >
              <svg
                width="8"
                height="15"
                viewBox="0 0 8 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  variants={{
                    default: { stroke: textColor },
                    hover: { stroke: hoverTextColor },
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  d="M0.480469 0.437256L6.48047 7.03726L0.480469 13.6373"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
 
              </svg>
            </motion.div>
            <motion.div


              variants={{
                default: {  x: '-100%' ,opacity:0},
                hover: { x: 0 ,opacity:1 },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute top-0 w-[8px] h-[15px]"
            >
              <svg
                width="8"
                height="15"
                viewBox="0 0 8 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  variants={{
                    default: { stroke: hoverTextColor },
                    hover: { stroke: hoverTextColor },
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  d="M0.480469 0.437256L6.48047 7.03726L0.480469 13.6373"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />

              </svg>
            </motion.div>
          </div>
          <div className="relative h-[21px] overflow-hidden ml-[10px]">
            <motion.div
              variants={{
                default: { y: 0, color: textColor },
                hover: { y: '-100%', color: hoverTextColor },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="text-[17px] font-manrope-medium leading-[21px]"
            >
              {text}
            </motion.div>
            <motion.div
              variants={{
                default: { y: '100%', color: hoverTextColor },
                hover: { y: 0, color: hoverTextColor },
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute top-0 text-[17px] font-manrope-medium leading-[21px]"
            >
              {text}
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  )

  // If asDiv is true, render as div (for use inside Link components)
  if (asDiv) {
    return buttonContent
  }

  // Otherwise, wrap in Link
  return (
    <Link 
      href={link} 
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
    >
      {buttonContent}
    </Link>
  )
}

export default AnimatedButton

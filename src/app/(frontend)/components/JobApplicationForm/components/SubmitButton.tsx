'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SubmitButtonProps {
  text: string
  isLoading?: boolean
  disabled?: boolean
  bgColor?: string
  hoverBgColor?: string
  textColor?: string
  hoverTextColor?: string
  className?: string
  height?: string
  roundness?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  isLoading = false,
  disabled = false,
  bgColor = '#488BF3',
  hoverBgColor = '#3a7be0',
  textColor = '#ffffff',
  hoverTextColor = '#ffffff',
  className = '',
  height = 'h-[49px]',
  roundness = 'rounded-[5px]',
}) => {
  const isButtonDisabled = disabled || isLoading

  return (
    <button
      type="submit"
      disabled={isButtonDisabled}
      className={`border-0 bg-transparent p-0 m-0 ${className}`}
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        font: 'inherit',
        color: 'inherit',
        textDecoration: 'none',
        outline: 'none',
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      <motion.div
        className={`relative w-full ${height} overflow-hidden ${roundness} ${isButtonDisabled ? 'opacity-50' : ''}`}
        initial="default"
        whileHover={isButtonDisabled ? undefined : "hover"}
        animate="default"
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <motion.div
          variants={{
            default: { backgroundColor: bgColor },
            hover: { backgroundColor: hoverBgColor },
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`absolute inset-0 ${roundness}`}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[8px] h-[15px] overflow-visible mr-[5px]">
            <motion.div
              variants={{
                default: { x: 0, opacity: 1 },
                hover: { x: '100%', opacity: 0 },
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
                default: { x: '-100%', opacity: 0 },
                hover: { x: 0, opacity: 1 },
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
      </motion.div>
    </button>
  )
}

export default SubmitButton


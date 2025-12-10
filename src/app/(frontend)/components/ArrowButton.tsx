'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ArrowButtonProps {
    direction: 'left' | 'right'
    onClick: (e?: React.MouseEvent) => void
    disabled?: boolean
    ariaLabel: string
    className?: string
    bgColor?: string
    hoverBgColor?: string
    arrowColor?: string
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
    direction,
    onClick,
    disabled = false,
    ariaLabel,
    className = '',
    bgColor = 'bg-blue-500',
    hoverBgColor = 'hover:bg-[#3a7bd5]',
    arrowColor = 'white'
}) => {
    const baseClasses = `w-28 h-12 ${bgColor} rounded-[10px] ${hoverBgColor} flex items-center justify-center cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#488bf3] relative overflow-hidden`

    // Determine animation directions based on arrow direction
    const firstArrowExitX = direction === 'left' ? '-100%' : '100%'
    const secondArrowEnterX = direction === 'left' ? '100%' : '-100%'

    const LeftArrowSVG = () => (
        <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5044 8.92425L1.05949 8.92432" stroke={arrowColor} strokeWidth="1.5" />
            <path d="M9.45557 0.530273L1.0607 8.92514L9.45557 17.32" stroke={arrowColor} strokeWidth="1.5" />
        </svg>
    )

    const RightArrowSVG = () => (
        <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.495605 9.07575L19.9405 9.07568" stroke={arrowColor} strokeWidth="1.5" />
            <path d="M11.5444 0.681727L19.9393 9.07659L11.5444 17.4715" stroke={arrowColor} strokeWidth="1.5" />
        </svg>
    )

    const ArrowSVG = direction === 'left' ? LeftArrowSVG : RightArrowSVG

    const handleClick = (e: React.MouseEvent) => {
        if (disabled) {
            e.preventDefault()
            e.stopPropagation()
            return
        }
        e.preventDefault()
        e.stopPropagation()
        onClick(e)
    }

    return (
        <motion.button
            onClick={handleClick}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
            aria-label={ariaLabel}
            initial="default"
            whileHover={disabled ? "default" : "hover"}
            animate="default"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                {/* First Arrow - moves out and fades */}
                <motion.div
                    variants={{
                        default: { x: 0, opacity: 1 },
                        hover: { x: firstArrowExitX, opacity: 0 },
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute"
                >
                    <ArrowSVG />
                </motion.div>
                
                {/* Second Arrow - comes in and fades in */}
                <motion.div
                    variants={{
                        default: { x: secondArrowEnterX, opacity: 0 },
                        hover: { x: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute"
                >
                    <ArrowSVG />
                </motion.div>
            </div>
        </motion.button>
    )
}

export default ArrowButton


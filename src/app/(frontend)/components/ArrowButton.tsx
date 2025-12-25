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
    hoverArrowColor?: string
    useChevron?: boolean
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
    direction,
    onClick,
    disabled = false,
    ariaLabel,
    className = '',
    bgColor = 'bg-blue-500',
    hoverBgColor = 'hover:bg-[#3a7bd5]',
    arrowColor = 'white',
    hoverArrowColor,
    useChevron = false
}) => {
    // Use hoverArrowColor if provided, otherwise fall back to arrowColor
    const finalHoverArrowColor = hoverArrowColor || arrowColor
    // Adjust base classes based on useChevron prop
    const sizeClasses = useChevron ? 'w-12 h-12' : 'w-28 h-12'
    const baseClasses = `${sizeClasses} ${bgColor} rounded-[10px] ${hoverBgColor} flex items-center justify-center cursor-pointer transition-all duration-300 disabled:bg-transparent disabled:cursor-not-allowed disabled:hover:bg-transparent relative overflow-hidden`

    // Determine animation directions based on arrow direction
    const firstArrowExitX = direction === 'left' ? '-100%' : '100%'
    const secondArrowEnterX = direction === 'left' ? '100%' : '-100%'

    const LeftArrowSVG = ({ color }: { color: string }) => (
        <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5044 8.92425L1.05949 8.92432" stroke={color} strokeWidth="1.5" />
            <path d="M9.45557 0.530273L1.0607 8.92514L9.45557 17.32" stroke={color} strokeWidth="1.5" />
        </svg>
    )

    const RightArrowSVG = ({ color }: { color: string }) => (
        <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.495605 9.07575L19.9405 9.07568" stroke={color} strokeWidth="1.5" />
            <path d="M11.5444 0.681727L19.9393 9.07659L11.5444 17.4715" stroke={color} strokeWidth="1.5" />
        </svg>
    )

    const ChevronLeftSVG = ({ color }: { color: string }) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    const ChevronRightSVG = ({ color }: { color: string }) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    const ArrowSVG = useChevron
        ? (direction === 'left' ? ChevronLeftSVG : ChevronRightSVG)
        : (direction === 'left' ? LeftArrowSVG : RightArrowSVG)

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
                {/* First Arrow - moves out and fades (default color) */}
                <motion.div
                    variants={{
                        default: { x: 0, opacity: 1 },
                        hover: { x: firstArrowExitX, opacity: 0 },
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute"
                >
                    <ArrowSVG color={arrowColor} />
                </motion.div>
                
                {/* Second Arrow - comes in and fades in (hover color) */}
                <motion.div
                    variants={{
                        default: { x: secondArrowEnterX, opacity: 0 },
                        hover: { x: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute"
                >
                    <ArrowSVG color={finalHoverArrowColor} />
                </motion.div>
            </div>
        </motion.button>
    )
}

export default ArrowButton


'use client'

import React, { useRef, useState } from 'react'

interface Benefit {
    title: string
    description: string
    image?: {
        url?: string
    }
}

interface BenefitsCarouselProps {
    benefits: Benefit[]
}

const BenefitsCarousel: React.FC<BenefitsCarouselProps> = ({ benefits }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return
        setIsDragging(true)
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
        setScrollLeft(scrollContainerRef.current.scrollLeft)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return
        e.preventDefault()
        const x = e.pageX - scrollContainerRef.current.offsetLeft
        const walk = (x - startX) * 2 // Scroll speed multiplier
        scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }

    // Touch events for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!scrollContainerRef.current) return
        setIsDragging(true)
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
        setScrollLeft(scrollContainerRef.current.scrollLeft)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !scrollContainerRef.current) return
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
        const walk = (x - startX) * 2
        scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
    }

    // Update current index based on scroll position
    React.useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        const updateCurrentIndex = () => {
            const cards = container.querySelectorAll('.benefit-card')
            if (cards.length === 0) return

            const cardWidth = cards[0].clientWidth || 0
            const gap = window.innerWidth >= 768 ? 24 : 16 // gap-4 = 16px, gap-6 = 24px
            const scrollPosition = container.scrollLeft
            const newIndex = Math.round(scrollPosition / (cardWidth + gap))
            setCurrentIndex(Math.min(Math.max(0, newIndex), benefits.length - 1))
        }

        container.addEventListener('scroll', updateCurrentIndex)
        updateCurrentIndex()

        const handleResize = () => {
            updateCurrentIndex()
        }
        window.addEventListener('resize', handleResize)

        return () => {
            container.removeEventListener('scroll', updateCurrentIndex)
            window.removeEventListener('resize', handleResize)
        }
    }, [benefits.length])

    const scrollToIndex = (index: number) => {
        const container = scrollContainerRef.current
        if (!container) return

        const cards = container.querySelectorAll('.benefit-card')
        if (cards.length === 0) return

        const cardWidth = cards[0].clientWidth || 0
        const gap = window.innerWidth >= 768 ? 24 : 16
        const scrollPosition = index * (cardWidth + gap)
        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        })
    }

    if (!benefits || benefits.length === 0) {
        return null
    }

    return (
        <div className="relative containersection px-4 md:px-6 lg:px-10" style={{ overflow: 'visible' }}>
            {/* Cards Container - breaks out to full width end-to-end */}
            <div
                className="scrollbar-hide cursor-grab active:cursor-grabbing select-none"
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                    overflowX: 'auto',
                    overflowY: 'visible',
                    marginLeft: 'calc(-50vw + 50%)',
                    marginRight: 'calc(-50vw + 50%)',
                    width: '100vw',
                    paddingLeft: 'max(1rem, calc((100vw - 100%) / 2))',
                    paddingRight: 'max(1rem, calc((100vw - 100%) / 2))'
                }}
            >
                <div className="flex gap-4 md:gap-6" style={{ overflow: 'visible' }}>
                    {benefits.map((benefit, index) => (
                        <React.Fragment key={index}>
                            <div className="benefit-card flex flex-col shrink-0 w-[280px] md:w-[320px] lg:w-[344px]">
                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-[#000F19] font-manrope-semibold text-xl md:text-2xl leading-7 md:leading-8 mb-2 md:mb-1">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-[#000F19]/60 text-sm md:text-base font-manrope-normal leading-5 flex-1 pb-6 md:pb-10">
                                        {benefit.description}
                                    </p>
                                </div>
                                {benefit.image?.url && (
                                    <div className="relative h-48 md:h-52 lg:h-56 overflow-hidden mt-auto">
                                        <img
                                            src={benefit.image.url}
                                            alt={benefit.title}
                                            className="w-full h-full object-cover pointer-events-none"
                                            draggable={false}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="w-0 h-96 outline outline-offset-[-0.20px] outline-black/10 shrink-0 hidden lg:block" />
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Pagination Dots - Mobile/Tablet Only */}
            {benefits.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 md:mt-8 lg:hidden">
                    {benefits.map((_, index) => {
                        const isActive = currentIndex === index
                        return (
                            <button
                                key={index}
                                onClick={() => scrollToIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    isActive
                                        ? 'bg-[#488BF3] w-8'
                                        : 'bg-[#488BF3]/30 hover:bg-[#488BF3]/50 w-2'
                                }`}
                                aria-label={`Go to benefit ${index + 1}`}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default BenefitsCarousel


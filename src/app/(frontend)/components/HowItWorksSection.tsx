'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Step as StepType } from '@/types'
import { getStrapiImageUrl } from '@/helper'

gsap.registerPlugin(ScrollTrigger)

interface HowItWorksSectionProps {
  title: string
  steps: StepType[]
}

type ContentStep = {
  id: string
  type: 'content'
  title: string
  description: string
}

type ImageStep = {
  type: 'image'
  bgImage: string
}

type ProcessedStep = ContentStep | ImageStep

export default function HowItWorksSection({ title, steps: apiSteps }: HowItWorksSectionProps) {
  const stepsData: ProcessedStep[] = apiSteps.flatMap((step, index) => {
    const id = String(index + 1).padStart(2, '0')
    return [
      {
        id,
        type: 'content' as const,
        title: step.title,
        description: step.description,
      },
      {
        type: 'image' as const,
        bgImage: getStrapiImageUrl(step.image?.url || ''),
      },
    ]
  })

  const sectionRef = useRef<HTMLDivElement>(null)

  // Horizontal Section Scroll Function
  const horizontalSectionScroll = () => {
    // Only run on desktop
    if (window.innerWidth < 1024) return

    const horizontalSections = gsap.utils.toArray('section#howItWorksDiv') as HTMLElement[]

    horizontalSections.forEach((sec) => {
      const thisPinWrap = sec.querySelector('.pin-wrap') as HTMLElement
      const thisAnimWrap = thisPinWrap?.querySelector('.animation-wrap') as HTMLElement

      if (!thisPinWrap || !thisAnimWrap) return

      const getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth)

      gsap.fromTo(
        thisAnimWrap,
        {
          x: () =>
            thisAnimWrap.classList.contains('to-right') ? 0 : getToValue(),
        },
        {
          x: () =>
            thisAnimWrap.classList.contains('to-right') ? getToValue() : 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sec,
            scroller: document.querySelector('#content') || undefined, // Optional custom scroller
            pinType: 'transform',
            start: 'top top',
            end: () => '+=' + thisAnimWrap.scrollWidth,
            pin: thisPinWrap,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            scrub: true,
            markers: false,
          },
        }
      )
    })
  }

  useEffect(() => {
    if (!sectionRef.current || stepsData.length === 0) return

    // Only enable horizontal scroll on desktop
    const isDesktop = window.innerWidth >= 1024

    if (isDesktop) {
      // Wait for layout to be ready
      const initTimeout = setTimeout(() => {
        horizontalSectionScroll()
      }, 100)

      // Card animations
      gsap.set('.card-item', { opacity: 1, y: 0, scale: 1 })

      const cardAnimation = gsap.to('.card-item', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          toggleActions: 'play none none reverse',
        },
      })

      const dotsAnimation = gsap.to('.progress-dot', {
        y: -10,
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      })

      // Handle window resize
      const handleResize = () => {
        ScrollTrigger.refresh()
        if (window.innerWidth >= 1024) {
          horizontalSectionScroll()
        }
      }
      window.addEventListener('resize', handleResize)

      // Handle image loading
      const images = sectionRef.current.querySelectorAll('img')
      let loadedImages = 0
      const totalImages = images.length
      const imageLoadHandlers: Array<() => void> = []

      if (totalImages > 0) {
        images.forEach((img) => {
          if (img.complete) {
            loadedImages++
          } else {
            const handler = () => {
              loadedImages++
              if (loadedImages === totalImages) {
                ScrollTrigger.refresh()
              }
            }
            img.addEventListener('load', handler)
            imageLoadHandlers.push(() => img.removeEventListener('load', handler))
          }
        })

        if (loadedImages === totalImages) {
          ScrollTrigger.refresh()
        }
      }

      // Cleanup function
      return () => {
        clearTimeout(initTimeout)
        window.removeEventListener('resize', handleResize)
        // Clean up image load event listeners
        imageLoadHandlers.forEach((cleanup) => cleanup())
        if (cardAnimation.scrollTrigger) {
          cardAnimation.scrollTrigger.kill()
        }
        cardAnimation.kill()
        dotsAnimation.kill()
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === sectionRef.current) {
            trigger.kill()
          }
        })
      }
    }
  }, [stepsData])

  if (stepsData.length === 0) {
    return null
  }

  return (
    <section id="howItWorksDiv" ref={sectionRef} className="bg-[#488BF3] min-h-screen hidden lg:block">
      <div className="pin-wrap w-full flex items-center justify-center min-h-screen py-12">
        <div className="containersection overflow-visible! w-full">
          {/* Section Title */}
          <div className="text-center mb-16 px-6">
            <h2 className="font-diagrammSemibold text-[50px] leading-[40px] text-white font-semibold">
              {title}
            </h2>
          </div>

          {/* Desktop Layout - GSAP Horizontal Scroll Animation */}
          <div
            className="animation-wrap to-right flex gap-6 lg:gap-8 xl:gap-[25px] px-6 lg:px-8 xl:px-[33px] pb-6 min-w-max select-none"
            style={{
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          >
            {stepsData.map((step, index) => (
              <div key={index} className="flex flex-col gap-6">
                <div className="relative shrink-0 card-item">
                  {step.type === 'content' ? (
                    /* Content Card */
                    <div className="w-[470px] h-[397px] bg-white rounded-[20px] relative overflow-hidden transition-all duration-500">
                      {/* Content */}
                      <div className="relative z-10 px-[24px] lg:px-[32px] xl:px-[50px] py-[24px] lg:py-[30px] xl:py-[45px] h-full flex flex-col">
                        {/* Number Badge */}
                        <div className="bg-[#017EFF] text-white font-interSemibold text-[16px] lg:text-[18px] xl:text-[19px] leading-6 w-fit px-[8px] lg:px-[9px] xl:px-[10px] py-[8px] lg:py-[9px] xl:py-[10px] rounded-[5px] mb-4 lg:mb-5 xl:mb-6 font-semibold transition-all duration-300 hover:bg-[#0056CC]">
                          {step.id}
                        </div>
                        <div className="flex flex-col justify-center h-full mb-6 lg:mb-8 xl:mb-10">
                          {/* Title */}
                          <h3 className="font-interSemibold text-[24px] lg:text-[27px] xl:text-[30px] leading-[30px] lg:leading-[34px] xl:leading-[37px] text-[#000F19] mb-2 lg:mb-2.5 xl:mb-3 font-semibold max-w-[290px] lg:max-w-[340px] xl:max-w-[371px] transition-all duration-300">
                            {step.title}
                          </h3>

                          {/* Description */}
                          <p className="font-interLight text-[14px] lg:text-[15px] xl:text-[16px] leading-[20px] lg:leading-[22px] xl:leading-[24px] text-[#000F19] max-w-[290px] lg:max-w-[340px] xl:max-w-[371px] transition-all duration-300">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Image Card */
                    <div className="w-[470px] h-[397px] rounded-[20px] relative overflow-hidden transition-all duration-500">
                      <img
                        src={step.bgImage}
                        alt={`Step ${Math.floor(index / 2) + 1} illustration`}
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    </div>
                  )}
                </div>
                {/* Desktop Progress Elements */}
                <div className="relative mt-4">
                  {/* Progress Dots and Connecting Lines */}
                  <div
                    className="flex items-center justify-between"
                    style={{ width: `470px` }}
                  >
                    {stepsData
                      .filter((step) => step.type === 'content')
                      .map((step, contentIndex, contentSteps) => (
                        <div key={`progress-${contentIndex}`} className="flex items-center">
                          {/* Progress Dot */}
                          <div className="flex items-center justify-center relative z-10 progress-dot">
                            <div className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] xl:w-[26px] xl:h-[26px] rounded-full bg-[#017EFF] flex items-center justify-center transition-all duration-300 scale-110">
                              <div className="w-[8px] h-[8px] lg:w-[9.6px] lg:h-[9.6px] xl:w-[10.4px] xl:h-[10.4px] rounded-full bg-white transition-all duration-300" />
                            </div>
                          </div>
                          {/* Connecting Line to Next Content Card */}
                          {contentIndex < contentSteps.length - 1 && (
                            <div
                              className="custom-dashed-line"
                              style={{ width: '470px' }}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


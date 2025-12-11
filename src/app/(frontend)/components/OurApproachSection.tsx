'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Step as StepType } from '@/types';
import AnimatedButton from './AnimatedButton';

gsap.registerPlugin(ScrollTrigger);

interface OurApproachSectionProps {
  data: {
    title: string;
    heading: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    steps: StepType[];
  };
}

type ContentStep = {
  id: string;
  type: 'content';
  title: string;
  description: string;
};

type ImageStep = {
  type: 'image';
  bgImage: string;
};

type ProcessedStep = ContentStep | ImageStep;

export default function OurApproachSection({ data }: OurApproachSectionProps) {
  const { title, heading, description: sectionDescription, buttonText, buttonLink, steps: apiSteps } = data;

  // Debug: Log data structure in production
  if (process.env.NODE_ENV === 'production') {
    console.log('OurApproachSection: Received data:', {
      hasTitle: !!title,
      hasHeading: !!heading,
      hasSteps: !!apiSteps,
      stepsIsArray: Array.isArray(apiSteps),
      stepsLength: Array.isArray(apiSteps) ? apiSteps.length : 0,
      firstStep: Array.isArray(apiSteps) && apiSteps.length > 0
        ? {
            hasImage: !!apiSteps[0].image,
            imageType: typeof apiSteps[0].image,
            imageIsObject: typeof apiSteps[0].image === 'object',
            imageUrl: typeof apiSteps[0].image === 'object' ? apiSteps[0].image?.url : null
          }
        : null
    })
  }

  // Ensure apiSteps is an array
  const safeSteps = Array.isArray(apiSteps) ? apiSteps : []
  
  const stepsData: ProcessedStep[] = safeSteps.flatMap((step, index) => {
    const id = String(index + 1).padStart(2, '0');
    
    // Debug: Log step image in production
    if (process.env.NODE_ENV === 'production' && !step.image?.url) {
      console.warn(`OurApproachSection: Step ${index + 1} missing image URL:`, {
        stepTitle: step.title,
        hasImage: !!step.image,
        imageType: typeof step.image,
        imageIsObject: typeof step.image === 'object',
        imageValue: step.image
      })
    }
    
    return [
      {
        id,
        type: 'content' as const,
        title: step.title || '',
        description: step.description || ''
      },
      {
        type: 'image' as const,
        bgImage: step.image?.url || ''
      }
    ];
  });
  
  // Debug: Log final stepsData in production
  if (process.env.NODE_ENV === 'production') {
    console.log('OurApproachSection: Processed stepsData:', {
      totalSteps: stepsData.length,
      contentSteps: stepsData.filter(s => s.type === 'content').length,
      imageSteps: stepsData.filter(s => s.type === 'image').length,
      imageStepsWithUrl: stepsData.filter(s => s.type === 'image' && s.bgImage).length
    })
  }

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const pinWrap = section.querySelector('.pin-wrap');
    const animWrap = section.querySelector('.animation-wrap');

    if (!pinWrap || !animWrap) return;

    const getToValue = () => -(animWrap.scrollWidth - window.innerWidth);

    const horizontalAnimation = gsap.fromTo(
      animWrap,
      {
        x: 0, // Start from left
      },
      {
        x: getToValue, // Scroll to the right
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 10%", // Start when section is 80% visible
          end: () => "+=" + (animWrap.scrollWidth * 1.5), // Extended scroll distance for smoother feel
          pin: pinWrap,
          scrub: 2, // Increased scrub for smoother lag
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: "labels", // Snap to card positions
            duration: { min: 0.2, max: 0.8 },
            delay: 0.1,
            ease: "power2.inOut"
          }
        },
      }
    );

    gsap.set(".card-item", { opacity: 0, y: 10, scale: 0.95 });

    const cardAnimation = gsap.to(".card-item", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 30%",
        toggleActions: "play none none reverse"
      }
    });

    // Cleanup function
    return () => {
      if (horizontalAnimation.scrollTrigger) {
        horizontalAnimation.scrollTrigger.kill();
      }
      if (cardAnimation.scrollTrigger) {
        cardAnimation.scrollTrigger.kill();
      }
      horizontalAnimation.kill();
      cardAnimation.kill();
    };
  }, []);

  // Debug: Log why component might not render
  if (stepsData.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('OurApproachSection: Not rendering - stepsData is empty', {
        hasApiSteps: !!apiSteps,
        apiStepsIsArray: Array.isArray(apiSteps),
        apiStepsLength: Array.isArray(apiSteps) ? apiSteps.length : 0,
        safeStepsLength: safeSteps.length,
        dataReceived: {
          title,
          heading,
          hasSteps: !!apiSteps
        }
      })
    }
    return null;
  }

  return (
    <section ref={sectionRef} className="bg-[#000F19] py-24 hidden lg:block">
      <div className="pin-wrap containersection overflow-visible! top-[93px]!">
        {/* Section Title */}
        <div className="text-left px-6 space-y-4 lg:space-y-6">
          <div className="hero-content-line-inner overflow-hidden mb-[18px]">
            <h2 className="text-white text-lg font-manrope-semibold uppercase leading-[17px] tracking-widest">
              {title}
            </h2>
          </div>
          <p className="text-white mb-[10px] text-4xl font-manrope-semibold leading-10">
            {heading}
          </p>
          <p className="max-w-5xl text-white text-base font-manrope-medium mb-[40px] leading-6 section-description">
            {sectionDescription}
          </p>
          <div className="section-link mb-[55px]">
            <AnimatedButton
              link={buttonLink}
              text={buttonText}
              bgColor="#488BF3"
              hoverBgColor="#fff"
              textColor="#fff"
              hoverTextColor="#488BF3"
              width='w-[146px]'
              className="rounded-[10px]"
            />
          </div>
        </div>

        {/* Desktop Layout - GSAP Horizontal Scroll Animation */}
        <div className="animation-wrap flex flex-col min-w-max">
          {/* Cards Row */}
          <div className="flex gap-[25px] px-8 lg:px-[33px] pb-6">
            {stepsData.map((step, index) => (
              <div key={index} className="relative flex-shrink-0 card-item">
                {step.type === 'content' ? (
                  /* Content Card */
                  <div className="w-[470px] h-[397px] bg-white rounded-[20px] relative overflow-hidden transition-all duration-500">
                    {/* Content */}
                    <div className="relative z-10 px-[50px] py-[45px] h-full flex flex-col">
                      {/* Number Badge */}
                      <div className="bg-[#000F19] text-white font-manrope-semibold text-lg leading-6 w-fit px-[10px] py-[10px] rounded-[5px] mb-6 font-semibold transition-all duration-300 ">
                        {step.id}
                      </div>
                      <div className='flex flex-col justify-center h-full mb-10'>
                        {/* Title */}
                        <h3 className="font-manrope-bold text-3xl leading-[37px] text-[#000F19] mb-3 font-semibold max-w-[371px] transition-all duration-300">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="font-manrope-normal text-lg leading-[24px] text-[#000F19] max-w-[371px] leading-7 transition-all duration-300">
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
            ))}
          </div>

          {/* Desktop Progress Elements */}
          <div className="relative px-8 lg:px-[33px]">
            {/* Progress Dots and Connecting Lines */}
            <div className="relative" style={{ width: `${stepsData.length * 470 + (stepsData.length - 1) * 25}px`, height: '26px' }}>
              {stepsData.map((step, index) => {
                if (step.type !== 'content') return null;

                // Calculate the position of this content card in the stepsData array
                // Position = index * 470px (card width) + index * 25px (gaps before this card)
                const dotPosition = index * 470 + index * 25;

                // Find the next content card index
                const nextContentIndex = stepsData.findIndex((s, i) => i > index && s.type === 'content');
                const hasNextContent = nextContentIndex !== -1;
                const isLastContent = !hasNextContent;

                // Calculate line width
                let lineWidth = 0;
                if (hasNextContent) {
                  // Line to next content card: from right edge of this dot to left edge of next dot
                  const nextDotPosition = nextContentIndex * 470 + nextContentIndex * 25;
                  lineWidth = nextDotPosition - dotPosition - 26;
                } else if (isLastContent) {
                  // For the last content dot, extend line to the end dot position
                  const totalWidth = stepsData.length * 470 + (stepsData.length - 1) * 25;
                  const endDotPosition = totalWidth - 26; // Position dot at the end, accounting for dot width
                  lineWidth = endDotPosition - dotPosition - 26;
                }

                return (
                  <React.Fragment key={step.id}>
                    {/* Progress Dot */}
                    <div
                      className="absolute flex items-center justify-center progress-dot z-10"
                      style={{ left: `${dotPosition}px`, top: '0' }}
                    >
                      <div className="w-[26px] h-[26px] rounded-full bg-[#017EFF] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                        <div className="w-[10.4px] h-[10.4px] rounded-full bg-white transition-all duration-300" />
                      </div>
                    </div>

                    {/* Connecting Line - extends to next content card or end dot */}
                    {lineWidth > 0 && (
                      <div
                        className="absolute custom-dashed-line"
                        style={{
                          left: `${dotPosition + 26}px`,
                          top: '12px',
                          width: `${lineWidth}px`,
                          height: '2px'
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Always add a progress dot at the end */}
              {(() => {
                const totalWidth = stepsData.length * 470 + (stepsData.length - 1) * 25;
                const endDotPosition = totalWidth - 26; // Position dot at the end, accounting for dot width
                const lastStep = stepsData[stepsData.length - 1];

                // Only add end dot if the last card is not a content card (to avoid duplicate dot)
                // If last card is content, the content dot already serves as the end dot
                if (lastStep.type === 'content') return null;

                return (
                  <div
                    key="end-dot"
                    className="absolute flex items-center justify-center progress-dot z-10"
                    style={{ left: `${endDotPosition}px`, top: '0' }}
                  >
                    <div className="w-[26px] h-[26px] rounded-full bg-[#017EFF] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                      <div className="w-[10.4px] h-[10.4px] rounded-full bg-white transition-all duration-300" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
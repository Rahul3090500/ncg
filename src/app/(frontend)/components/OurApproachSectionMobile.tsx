'use client';

import React, { useState, useEffect } from 'react';
import { Step as StepType } from '@/types';
import AnimatedButton from './AnimatedButton';

interface OurApproachSectionMobileProps {
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

export default function OurApproachSectionMobile({ data }: OurApproachSectionMobileProps) {
  const { title, heading, description: sectionDescription, buttonText, buttonLink, steps: apiSteps } = data;
  const [isTablet, setIsTablet] = useState(false);

  // Ensure apiSteps is an array
  const safeSteps = Array.isArray(apiSteps) ? apiSteps : []
  
  // Debug: Log data structure in production
  if (process.env.NODE_ENV === 'production') {
    console.log('OurApproachSectionMobile: Received data:', {
      hasTitle: !!title,
      hasHeading: !!heading,
      hasSteps: !!apiSteps,
      stepsIsArray: Array.isArray(apiSteps),
      stepsLength: Array.isArray(apiSteps) ? apiSteps.length : 0,
      safeStepsLength: safeSteps.length
    })
  }

  const stepsData: ProcessedStep[] = safeSteps.flatMap((step, index) => {
    const id = String(index + 1).padStart(2, '0');
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
  
  // Debug: Log why component might not render
  if (stepsData.length === 0 && process.env.NODE_ENV === 'production') {
    console.warn('OurApproachSectionMobile: Not rendering - stepsData is empty', {
      hasApiSteps: !!apiSteps,
      apiStepsIsArray: Array.isArray(apiSteps),
      apiStepsLength: Array.isArray(apiSteps) ? apiSteps.length : 0,
      safeStepsLength: safeSteps.length
    })
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (stepsData.length === 0) {
    return null;
  }

  // Calculate responsive card width and gap
  const cardWidth = isTablet ? 470 : 350;
  const gapWidth = isTablet ? 24 : 16;

  return (
    <section className="bg-[#000F19] py-12 md:py-24 lg:hidden">
      <div className="containersection px-4 md:px-6">
        {/* Section Title */}
        <div className="text-left space-y-4 md:space-y-6 mb-8 md:mb-12">
          <div className="hero-content-line-inner overflow-hidden mb-[18px]">
            <h2 className="text-white text-base md:text-lg font-manrope-semibold uppercase leading-[17px] tracking-widest">
              {title}
            </h2>
          </div>
          <p className="text-white mb-[10px] text-2xl md:text-3xl lg:text-4xl font-manrope-semibold leading-tight md:leading-10">
            {heading}
          </p>
          <p className="max-w-5xl text-white text-sm md:text-base font-manrope-medium mb-6 md:mb-[40px] leading-5 md:leading-6 section-description">
            {sectionDescription}
          </p>
          <div className="section-link mb-8 md:mb-[55px]">
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

        {/* Mobile/Tablet Layout - Horizontal Row Scroll with Progress */}
        <div className="overflow-x-auto overflow-y-hidden -mx-4 md:-mx-6 px-4 md:px-6 scrollbar-hide">
          <div className="flex flex-col min-w-max">
            {/* Cards Row */}
            <div className="flex flex-row gap-4 md:gap-6 pb-6">
              {stepsData.map((step, index) => (
                <div key={index} className="flex-shrink-0">
                  {step.type === 'content' ? (
                    /* Content Card */
                    <div className="w-[350px] md:w-[470px] bg-white rounded-[20px] relative overflow-hidden transition-all duration-500">
                      {/* Content */}
                      <div className="relative z-10 px-6 md:px-[50px] py-6 md:py-[45px] flex flex-col h-[320px] md:h-[397px]">
                        {/* Number Badge */}
                        <div className="bg-[#000F19] text-white font-manrope-semibold text-base md:text-lg leading-6 w-fit px-[10px] py-[10px] rounded-[5px] mb-4 md:mb-6 font-semibold transition-all duration-300">
                          {step.id}
                        </div>
                        <div className='flex flex-col justify-center flex-1'>
                          {/* Title */}
                          <h3 className="font-manrope-bold text-xl md:text-2xl lg:text-3xl leading-tight md:leading-[37px] text-[#000F19] mb-3 font-semibold max-w-full transition-all duration-300">
                            {step.title}
                          </h3>

                          {/* Description */}
                          <p className="font-manrope-normal text-base md:text-lg leading-6 md:leading-[24px] text-[#000F19] max-w-full transition-all duration-300">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Image Card */
                    <div className="w-[350px] md:w-[470px] h-[320px] md:h-[397px] rounded-[20px] relative overflow-hidden transition-all duration-500">
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

            {/* Progress Dots and Connecting Lines */}
            <div className="relative px-0" style={{ 
              width: `${stepsData.length * cardWidth + (stepsData.length - 1) * gapWidth}px`,
              height: '26px'
            }}>
              {stepsData.map((step, index) => {
                if (step.type !== 'content') return null;

                // Calculate the position of this content card
                // Responsive: Mobile uses 350px + 16px, Tablet uses 470px + 24px
                const dotPosition = index * cardWidth + index * gapWidth;

                // Find the next content card index
                const nextContentIndex = stepsData.findIndex((s, i) => i > index && s.type === 'content');
                const hasNextContent = nextContentIndex !== -1;
                const isLastContent = !hasNextContent;

                // Calculate line width
                let lineWidth = 0;
                if (hasNextContent) {
                  // Line to next content card: from right edge of this dot to left edge of next dot
                  const nextDotPosition = nextContentIndex * cardWidth + nextContentIndex * gapWidth;
                  lineWidth = nextDotPosition - dotPosition - 26;
                } else if (isLastContent) {
                  // For the last content dot, extend line to the end dot position
                  const totalWidth = stepsData.length * cardWidth + (stepsData.length - 1) * gapWidth;
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
                const totalWidth = stepsData.length * cardWidth + (stepsData.length - 1) * gapWidth;
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


'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Step as StepType } from '@/types';
import AnimatedButton from './AnimatedButton';
import ArrowButton from './ArrowButton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isTablet, setIsTablet] = useState(false);

  // Ensure apiSteps is an array
  const safeSteps = Array.isArray(apiSteps) ? apiSteps : []
  
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

  // Check screen size for responsive calculations
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Check scroll position and update arrow states (desktop only)
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px threshold
  };

  // Scroll functions (desktop only)
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 470;
    const gapWidth = 25;
    const scrollAmount = cardWidth + gapWidth;
    
    scrollContainerRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 470;
    const gapWidth = 25;
    const scrollAmount = cardWidth + gapWidth;
    
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check (desktop only)
    checkScrollPosition();

    // Listen to scroll events (desktop only)
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [stepsData]);

  // Debug: Log why component might not render
  if (stepsData.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('OurApproachSection: Not rendering - stepsData is empty', {
        hasApiSteps: !!apiSteps,
        stepsIsArray: Array.isArray(apiSteps),
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

  // Calculate responsive card width and gap (for mobile/tablet progress dots)
  const cardWidth = isTablet ? 470 : 350;
  const gapWidth = isTablet ? 24 : 16;

  return (
    <section className="bg-[#000F19] py-12 md:py-24">
      <div className="containersection px-4 md:px-6">
        {/* Section Title */}
        <div className="text-left space-y-4 md:space-y-6 mb-8 md:mb-12">
          {/* Desktop: Heading with Arrow Controls */}
          <div className="hidden lg:flex items-start justify-between gap-6 md:px-[42px]">
            <div className="flex-1">
              <div className="hero-content-line-inner overflow-hidden mb-[18px]">
                <h2 className="text-white text-base md:text-lg font-manrope-semibold uppercase leading-[17px] tracking-widest">
                  {title}
                </h2>
              </div>
              <div className="flex items-start justify-between gap-6 mb-4">
                <p className="text-white mb-[10px] text-2xl md:text-3xl lg:text-4xl font-manrope-semibold leading-tight md:leading-10 flex-1">
                  {heading}
                </p>
              </div>
              <p className="max-w-5xl text-white text-sm md:text-base font-manrope-medium mb-6 md:mb-[40px] leading-5 md:leading-6 section-description">
                {sectionDescription}
              </p>
              <div className="section-link mb-8 md:mb-[35px] flex justify-between items-center gap-4">
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
                                {/* Arrow Navigation Controls - Desktop Only */}
                                <div className="flex gap-4 flex-shrink-0">
                  <ArrowButton
                    direction="left"
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    ariaLabel="Scroll left"
                    bgColor="bg-[#488BF3]"
                    hoverBgColor="hover:bg-[#3a7bd5]"
                    arrowColor="white"
                    className="flex-shrink-0"
                  />
                  <ArrowButton
                    direction="right"
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    ariaLabel="Scroll right"
                    bgColor="bg-[#488BF3]"
                    hoverBgColor="hover:bg-[#3a7bd5]"
                    arrowColor="white"
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Simple Layout */}
          <div className="lg:hidden">
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
        </div>

        {/* Mobile: Swiper with Pagination */}
        <div className="lg:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet our-approach-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active our-approach-bullet-active',
            }}
            className="our-approach-swiper"
            grabCursor={true}
          >
            {stepsData.map((step, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center px-2">
                  {step.type === 'content' ? (
                    /* Content Card */
                    <div className="w-full max-w-[350px] bg-white rounded-[20px] relative overflow-hidden transition-all duration-500">
                      {/* Content */}
                      <div className="relative z-10 px-6 py-6 flex flex-col h-[320px]">
                        {/* Number Badge */}
                        <div className="bg-[#000F19] text-white font-manrope-semibold text-base leading-6 w-fit px-[10px] py-[10px] rounded-[5px] mb-4 font-semibold transition-all duration-300">
                          {step.id}
                        </div>
                        <div className='flex flex-col justify-center flex-1'>
                          {/* Title */}
                          <h3 className="font-manrope-bold text-xl leading-tight text-[#000F19] mb-3 font-semibold max-w-full transition-all duration-300">
                            {step.title}
                          </h3>

                          {/* Description */}
                          <p className="font-manrope-normal text-base leading-6 text-[#000F19] max-w-full transition-all duration-300">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Image Card */
                    <div className="w-full max-w-[350px] h-[320px] rounded-[20px] relative overflow-hidden transition-all duration-500">
                      <img
                        src={step.bgImage}
                        alt={`Step ${Math.floor(index / 2) + 1} illustration`}
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop: Horizontal Scrollable Content */}
        <div className="hidden lg:block overflow-x-auto overflow-y-hidden -mx-4 md:-mx-6 px-4 md:px-16 scrollbar-hide" ref={scrollContainerRef}>
          <div className="flex flex-col min-w-max">
            {/* Cards Row */}
            <div className="flex flex-row gap-4 md:gap-6 lg:gap-[25px] pb-6">
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
                    <div className="w-[350px] md:w-[600px] h-[320px] md:h-[397px] rounded-[20px] relative overflow-hidden transition-all duration-500">
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
          </div>
        </div>
      </div>
    </section>
  );
}

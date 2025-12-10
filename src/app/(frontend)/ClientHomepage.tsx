"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import ServicesSection from './ServicesSection';
import AnimatedHeroSection from './components/AnimatedHeroSection';

interface ServicesData {
  sectionTitle: string;
  services: any[];
}

interface HomepageData {
  heroSection: {
    mainHeading: string;
    backgroundImage?: {
      url: string;
    } | null;
    animatedTexts?: Array<{
      id?: string | number;
      text: string;
    }> | null;
    backgroundImages?: Array<{
      id?: string | number;
      image?: {
        url: string;
      } | number | null;
    }> | null;
    callToAction: {
      description: string;
      ctaHeading: string;
      ctaLink: string;
      backgroundColor: string;
    };
  };
}

interface ClientHomepageProps {
  heroData: HomepageData['heroSection'];
  servicesData: ServicesData;
}

const ClientHomepage = ({ heroData, servicesData }: ClientHomepageProps) => {
  // Default animated texts
  const defaultPhrases = ['Identity Security', 'Digital Compliance', 'Digital Fraud'];
  // Default background images
  const defaultBackgroundImages = [
    '/assets/8669139b5ad96631528dce4a3734eddb4b03dc40.jpg',
    '/assets/44a78bc1d93f3caa1a0285e1634dbba906ab3fe9.jpg',
    '/assets/a0b2532e796484e0f389291d63718e140a6b2848.jpg',
  ];

  // Use CMS data if available, otherwise use defaults
  // Payload arrays return objects with id and field name: { id: string, text: string } or { id: string, image: Media }
  const phrases = heroData.animatedTexts && Array.isArray(heroData.animatedTexts) && heroData.animatedTexts.length > 0 
    ? heroData.animatedTexts
        .map((item: any): string | null => {
          // Handle Payload structure: { id: string, text: string }
          if (typeof item === 'object' && item !== null) {
            if ('text' in item) {
              const textValue = item.text;
              if (typeof textValue === 'string' && textValue.length > 0) {
                // Double-check we're not accidentally using the ID
                if (textValue === item.id) {
                  return null;
                }
                return textValue;
              }
            }
            return null;
          }
          
          // Handle direct string
          if (typeof item === 'string') {
            return item;
          }
          
          return null;
        })
        .filter((text: string | null): text is string => {
          if (!text || typeof text !== 'string' || text.length === 0) {
            return false;
          }
          // Reject the literal string "id" or any ID-like values
          if (text === 'id' || text === 'ID' || text.toLowerCase() === 'id') {
            return false;
          }
          return true;
        })
    : defaultPhrases;
  
  // Final validation: ensure all phrases are strings
  const validatedPhrases = phrases.map((phrase) => {
    if (typeof phrase !== 'string') {
      // If it's an object, try to extract text one more time
      if (typeof phrase === 'object' && phrase !== null && 'text' in phrase) {
        const extracted = (phrase as any).text;
        if (typeof extracted === 'string') {
          return extracted;
        }
      }
      return null;
    }
    // Additional check: make sure it's not the string "id"
    if (phrase === 'id' || phrase.toLowerCase() === 'id') {
      return null;
    }
    return phrase;
  }).filter((phrase): phrase is string => phrase !== null && phrase !== 'id');
  
  const finalPhrases = validatedPhrases.length > 0 ? validatedPhrases : defaultPhrases;
  
  // Final safety check: ensure no phrase is "id" or looks like an ID (MongoDB/ObjectId format)
  const safePhrases = finalPhrases.filter((phrase) => {
    const isIdLike = phrase === 'id' || phrase.toLowerCase() === 'id' || /^[a-f0-9]{24}$/i.test(phrase);
    return !isIdLike;
  });
  
  // Use validated phrases (fallback to defaults if all were filtered out)
  const phrasesToUse = safePhrases.length > 0 ? safePhrases : defaultPhrases;

  const backgroundImagesFromCMS = heroData.backgroundImages && Array.isArray(heroData.backgroundImages) && heroData.backgroundImages.length > 0
    ? heroData.backgroundImages
        .map((item: any): string | null => {
          // Handle Payload structure: { id: string, image: Media }
          if (typeof item === 'object' && item !== null) {
            // Payload returns: { id: string, image: { url: string } } or { id: string, image: number }
            const image = item.image;
            if (typeof image === 'object' && image !== null && 'url' in image) {
              return image.url;
            }
            // If image is a number (ID), we can't resolve it here, skip it
            if (typeof image === 'number') {
              return null;
            }
            // Handle direct url structure: { url: string }
            if ('url' in item) {
              return item.url;
            }
          }
          // Handle direct string
          if (typeof item === 'string') {
            return item;
          }
          return null;
        })
        .filter((url: string | null): url is string => Boolean(url))
    : defaultBackgroundImages;
  
  // Ensure background images array matches phrases length
  // If there are more phrases than images, repeat the last image
  // If there are more images than phrases, use only the needed ones
  const backgroundImages = phrasesToUse.map((_, index) => 
    backgroundImagesFromCMS[index] || backgroundImagesFromCMS[backgroundImagesFromCMS.length - 1] || defaultBackgroundImages[0]
  );
  
  // Fallback background image if no images are provided
  const fallbackBackgroundImage = heroData.backgroundImage && typeof heroData.backgroundImage === 'object' && 'url' in heroData.backgroundImage 
    ? heroData.backgroundImage.url 
    : '/home-images/hero-background-254e31.png';

  // Ensure we have at least one background image
  const finalBackgroundImages = backgroundImages.length > 0 
    ? backgroundImages 
    : [fallbackBackgroundImage];


  return (
    <div className="min-h-screen bg-white">
        <section 
        className="relative h-screen min-h-[600px] md:min-h-[700px] lg:min-h-[812px] flex items-center overflow-hidden" 
      > 
        {/* Unified Animated Hero Section (Background + Text) */}
        <AnimatedHeroSection 
          mainHeading={heroData.mainHeading}
          phrases={phrasesToUse}
          backgroundImages={finalBackgroundImages}
        />
        
        {/* Overlay */}
        <div className="inset-0 absolute bg-black/20 z-[1]" /> 
        
        {/* Content Container */}
        <div className="relative z-[2] w-full h-full flex flex-col mx-auto containersection px-0 md:px-6"> 
          <div className="w-full flex-1 flex flex-col"> 
            {/* Desktop: Bottom-right positioning */}
            <div className="hidden lg:flex justify-end items-end pb-5 h-full"> 
              <Link 
                href={heroData.callToAction.ctaLink}
                className="group relative px-8 py-6 w-[568px] overflow-hidden cursor-pointer"
                style={{ backgroundColor: heroData.callToAction.backgroundColor || '#488BF3' }}
              > 
                {/* Layer 1: Gradient from background color to lighter shade */}
                <div 
                  className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                  style={{ 
                    background: `linear-gradient(to right, ${heroData.callToAction.backgroundColor || '#488BF3'}, ${heroData.callToAction.backgroundColor || '#488BF3'}88)`
                  }}
                ></div>
                
                {/* Layer 2: Gradient mixing with white */}
                <div 
                  className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                  style={{ 
                    background: `linear-gradient(to right, ${heroData.callToAction.backgroundColor || '#488BF3'}88, ${heroData.callToAction.backgroundColor || '#488BF3'}44, #ffffff66)`
                  }}
                ></div>
                
                {/* Layer 3: More white mixing */}
                <div 
                  className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                  style={{ 
                    background: `linear-gradient(to right, ${heroData.callToAction.backgroundColor || '#488BF3'}44, #ffffff99)`
                  }}
                ></div>
                
                {/* Layer 4: Final white fade */}
                <div 
                  className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                ></div>
                
                <div className="relative z-10 flex items-start gap-6"> 
                  <div className="flex-1"> 
                    <p className="text-white group-hover:text-gray-900 transition-colors duration-300 font-manrope-medium text-base leading-relaxed mb-6">
                      {heroData.callToAction.description}
                    </p> 
                    <div className="w-full flex justify-between items-end">
                      <h2 className="text-white group-hover:text-gray-900 transition-colors duration-300 font-manrope-medium text-3xl md:text-4xl leading-tight">
                        {heroData.callToAction.ctaHeading.split('\n').map((line: string, index: number) => (
                          <span key={index} className="block">
                            {line}
                          </span>
                        ))}
                      </h2>
                      <div className="flex-shrink-0 mt-2"> 
                        <motion.svg 
                          width="40" 
                          height="24" 
                          viewBox="0 0 40 24" 
                          className='transition-all duration-300 group-hover:translate-x-2' 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg" 
                        > 
                          <path d="M0 12H40M40 12L28 0M40 12L28 24" stroke="#FFFFFF" strokeWidth="2" className="group-hover:stroke-gray-900 transition-colors duration-300"/> 
                        </motion.svg> 
                      </div>
                    </div> 
                  </div> 
                </div> 
              </Link> 
            </div>

            {/* Tablet/Mobile: Bottom positioning, full-width */}
            <div className="lg:hidden flex items-end pb-0 md:pb-8 mt-auto"> 
              <Link 
                href={heroData.callToAction.ctaLink}
                className="group relative w-full px-6 md:px-8 py-6 md:py-8 overflow-hidden cursor-pointer"
                style={{ backgroundColor: heroData.callToAction.backgroundColor || '#488BF3' }}
              > 
                {/* Layer 1: Gradient from background color to lighter shade */}
                <div 
                  className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                  style={{ 
                    background: `linear-gradient(to right, ${heroData.callToAction.backgroundColor || '#488BF3'}, ${heroData.callToAction.backgroundColor || '#488BF3'}88)`
                  }}
                ></div>
                
                {/* Layer 2: Gradient mixing with white */}
                <div 
                  className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                  style={{ 
                    background: `linear-gradient(to right, ${heroData.callToAction.backgroundColor || '#488BF3'}88, ${heroData.callToAction.backgroundColor || '#488BF3'}44, #ffffff66)`
                  }}
                ></div>
                
                {/* Layer 3: More white mixing */}
                <div 
                  className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                  style={{ 
                    background: `linear-gradient(to right, ${heroData.callToAction.backgroundColor || '#488BF3'}44, #ffffff99)`
                  }}
                ></div>
                
                {/* Layer 4: Final white fade */}
                <div 
                  className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                ></div>
                
                <div className="relative z-10 flex flex-col gap-4 md:gap-6"> 
                  <p className="text-white group-hover:text-gray-900 transition-colors duration-300 font-manrope-medium text-sm md:text-base leading-relaxed">
                    {heroData.callToAction.description}
                  </p> 
                  <div className="w-full flex justify-between items-end">
                    <h2 className="text-white group-hover:text-gray-900 transition-colors duration-300 font-manrope-medium text-2xl md:text-3xl leading-tight">
                      {heroData.callToAction.ctaHeading.split('\n').map((line: string, index: number) => (
                        <span key={index} className="block">
                          {line}
                        </span>
                      ))}
                    </h2>
                    <div className="flex-shrink-0 mt-2"> 
                      <motion.svg 
                        width="32" 
                        height="20" 
                        viewBox="0 0 40 24" 
                        className='transition-all duration-300 group-hover:translate-x-2' 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                      > 
                        <path d="M0 12H40M40 12L28 0M40 12L28 24" stroke="#FFFFFF" strokeWidth="2" className="group-hover:stroke-gray-900 transition-colors duration-300"/> 
                      </motion.svg> 
                    </div>
                  </div> 
                </div> 
              </Link> 
            </div>
          </div> 
        </div> 
      </section>
      <ServicesSection servicesData={servicesData} />

 </div>
  );
};

export default ClientHomepage;
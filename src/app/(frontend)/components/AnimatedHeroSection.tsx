"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedHeroSectionProps {
  mainHeading: string;
  phrases: string[];
  backgroundImages: string[];
  mobileTabletBackgroundImages?: string[];
}

const AnimatedHeroSection = ({ mainHeading, phrases, backgroundImages, mobileTabletBackgroundImages }: AnimatedHeroSectionProps) => {
  const [currentText, setCurrentText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const phraseIndexRef = useRef(0);

  // Get current background images safely
  const currentDesktopImage = backgroundImages[currentPhraseIndex] || backgroundImages[0] || '';
  const currentMobileTabletImage = mobileTabletBackgroundImages && mobileTabletBackgroundImages.length > 0
    ? (mobileTabletBackgroundImages[currentPhraseIndex] || mobileTabletBackgroundImages[0] || '')
    : currentDesktopImage; // Fallback to desktop image if mobile/tablet images not provided

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Preload images to ensure smooth transitions
  useEffect(() => {
    if (!isMounted) return;
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    if (mobileTabletBackgroundImages) {
      mobileTabletBackgroundImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [backgroundImages, mobileTabletBackgroundImages, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (phrases.length === 0) return;

    // Reset
    phraseIndexRef.current = 0;
    setCurrentPhraseIndex(0);
    
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    let timeoutId: NodeJS.Timeout;

    const typeEffect = () => {
      const phraseIndex = phraseIndexRef.current;
      const currentPhrase = phrases[phraseIndex];

      // Safety check
      if (typeof currentPhrase !== 'string') {
        phraseIndexRef.current = (phraseIndex + 1) % phrases.length;
        setCurrentPhraseIndex(phraseIndexRef.current);
        charIndex = 0;
        isDeleting = false;
        setTimeout(typeEffect, 100);
        return;
      }

      // --- TYPING LOGIC ---
      if (isDeleting) {
        setCurrentText(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        typeSpeed = 40; 
      } else {
        setCurrentText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        typeSpeed = 120;
      }

      // --- TRANSITION LOGIC ---
      if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing word, hold it
        isDeleting = true;
        typeSpeed = 2500; 
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, switch image and start next word
        isDeleting = false;
        const nextIndex = (phraseIndex + 1) % phrases.length;
        
        // Update references
        phraseIndexRef.current = nextIndex;
        setCurrentPhraseIndex(nextIndex); // Triggers cross-fade
        
        // Wait for cross-fade to settle before typing
        typeSpeed = 1000; 
      }

      timeoutId = setTimeout(typeEffect, typeSpeed);
    };

    timeoutId = setTimeout(typeEffect, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [phrases, backgroundImages, mobileTabletBackgroundImages, isMounted]);

  const displayDesktopImage = isMounted ? currentDesktopImage : (backgroundImages[0] || '');
  const displayMobileTabletImage = isMounted ? currentMobileTabletImage : (
    mobileTabletBackgroundImages && mobileTabletBackgroundImages.length > 0 
      ? mobileTabletBackgroundImages[0] 
      : backgroundImages[0] || ''
  );
  const displayPhraseIndex = isMounted ? currentPhraseIndex : 0;
  const displayText = isMounted ? currentText : '';

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">

        <AnimatePresence>
          {/* Desktop Background Image (lg and above) */}
          {displayDesktopImage && (
            <motion.div
              key={`bg-desktop-${displayPhraseIndex}`} // Unique key forces a new instance for every slide
              className="hidden lg:block absolute inset-0"
              initial={{ opacity: 0, scale: 1 }} // Start at normal scale
              animate={{ opacity: 1, scale: 1.15 }} // Zoom IN to 1.15
              exit={{ opacity: 0 }} // Fade out to reveal the next image underneath/above
              transition={{ 
                opacity: { duration: 1.2, ease: "easeInOut" }, 
                scale: { duration: 15, ease: "linear" } 
              }}
              style={{ 
                backgroundImage: `url(${displayDesktopImage})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat' 
              }}
            />
          )}
          {/* Mobile/Tablet Background Image (below lg) */}
          {displayMobileTabletImage && (
            <motion.div
              key={`bg-mobile-${displayPhraseIndex}`} // Unique key forces a new instance for every slide
              className="lg:hidden absolute inset-0"
              initial={{ opacity: 0, scale: 1 }} // Start at normal scale
              animate={{ opacity: 1, scale: 1.15 }} // Zoom IN to 1.15
              exit={{ opacity: 0 }} // Fade out to reveal the next image underneath/above
              transition={{ 
                opacity: { duration: 1.2, ease: "easeInOut" }, 
                scale: { duration: 15, ease: "linear" } 
              }}
              style={{ 
                backgroundImage: `url(${displayMobileTabletImage})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat' 
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Gradient Overlay applied permanently over the images */}
        <div className="absolute inset-0 z-10 bg-gradient-to-l from-blue-500/0 to-blue-900 mix-blend-multiply pointer-events-none" />
        
        {/* Subtle dark overlay to ensure text contrast if image is too bright */}
        <div className="absolute inset-0 z-10 bg-black/20 pointer-events-none" />
      </div>

      {/* Animated Heading */}
      <div className="absolute z-20 top-1/2 -translate-y-1/2 lg:top-[22%] lg:translate-y-0 w-full px-4 md:px-6 flex items-center justify-center lg:block">
        <h1 className="text-white capitalize containersection overflow-visible! px-4 md:px-8 lg:px-14 text-center lg:text-left font-manrope-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-0 lg:mb-8 drop-shadow-lg">
          {mainHeading.split('\n').map((line: string, index: number) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
          <span className="block mt-4 h-[1.2em]">
            <span className="inline-flex items-center justify-center">
              {displayText}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block w-[3px] h-[0.9em] bg-white ml-2 shadow-lg"
              />
            </span>
          </span>
        </h1>
      </div>
    </>
  );
};

export default AnimatedHeroSection;
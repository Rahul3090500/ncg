"use client";

import { useState, useEffect, useRef } from 'react';

interface AnimatedHeadingProps {
  mainHeading: string;
  phrases: string[];
  onPhraseChange?: (index: number) => void;
}

const AnimatedHeading = ({ mainHeading, phrases, onPhraseChange }: AnimatedHeadingProps) => {
  const [currentText, setCurrentText] = useState('');
  const phraseIndexRef = useRef(0);
console.log('🔍 [AnimatedHeading] Phrases:', phrases);
  useEffect(() => {
    if (phrases.length === 0) {
      console.warn('⚠️ [AnimatedHeading] No phrases available, skipping animation');
      return;
    }

    console.log('🎬 [AnimatedHeading] Starting typing animation with phrases:', phrases);
    
    // Reset to first phrase and notify parent immediately
    phraseIndexRef.current = 0;
    if (onPhraseChange) {
      onPhraseChange(0);
    }
    
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    let timeoutId: NodeJS.Timeout;

    const typeEffect = () => {
      const phraseIndex = phraseIndexRef.current;
      const currentPhrase = phrases[phraseIndex];

      // Safety check: ensure currentPhrase is a string
      if (typeof currentPhrase !== 'string') {
        console.error(`❌ [AnimatedHeading] Invalid phrase at index ${phraseIndex}:`, currentPhrase);
        phraseIndexRef.current = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        isDeleting = false;
        setTimeout(typeEffect, 100);
        return;
      }

      // CRITICAL: Check if phrase is "id" - this should never happen
      if (currentPhrase === 'id' || currentPhrase.toLowerCase() === 'id') {
        console.error(`❌ [AnimatedHeading] CRITICAL ERROR: Phrase is "id" at index ${phraseIndex}!`);
        phraseIndexRef.current = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        isDeleting = false;
        setTimeout(typeEffect, 100);
        return;
      }

      // Log what we're about to display and notify parent when starting a new phrase
      if (charIndex === 0 && !isDeleting) {
        console.log(`📝 [AnimatedHeading] Starting to type phrase ${phraseIndex + 1}/${phrases.length}: "${currentPhrase}"`);
        // Notify parent component immediately when starting to type a new phrase
        if (onPhraseChange) {
          onPhraseChange(phraseIndex);
        }
      }

      if (isDeleting) {
        // Remove character
        setCurrentText(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
        typeSpeed = 50; // Faster when deleting
      } else {
        // Add character
        setCurrentText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
        typeSpeed = 150; // Normal typing speed
      }

      // Logic to switch between typing and deleting
      if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing word, pause then delete
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
        console.log(`✅ [AnimatedHeading] Finished typing: "${currentPhrase}"`);
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next word
        isDeleting = false;
        phraseIndexRef.current = (phraseIndex + 1) % phrases.length;
        const nextIndex = phraseIndexRef.current;
        console.log(`🔄 [AnimatedHeading] Finished deleting, moving to phrase ${nextIndex + 1}/${phrases.length}: "${phrases[nextIndex]}"`);
        
        // Note: onPhraseChange will be called when we start typing the new phrase (charIndex === 0 && !isDeleting)
        // This ensures the background changes right when the new phrase starts appearing
        
        typeSpeed = 500; // Pause before typing new word
      }

      timeoutId = setTimeout(typeEffect, typeSpeed);
    };

    timeoutId = setTimeout(typeEffect, 100);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [phrases, onPhraseChange]);

  return (
    <h1 className="text-white w-max font-manrope-bold text-6xl md:text-7xl leading-tight mb-8">
      {mainHeading.split('\n').map((line: string, index: number) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
      <span className="block mt-4">
        <span className="inline-block min-w-[300px] text-left">
          {currentText}
          <span className="inline-block w-[3px] h-[1em] bg-white ml-1 animate-pulse"></span>
        </span>
      </span>
    </h1>
  );
};

export default AnimatedHeading;


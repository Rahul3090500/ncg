'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface LottieAnimationProps {
  className?: string
  width?: string
  height?: string
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ 
  className = '', 
  width = 'w-16 h-12 md:w-20 md:h-15 lg:w-[93px] lg:h-[69px]' 
}) => {
  const [animationData, setAnimationData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load the Lottie animation JSON file
    const loadAnimation = async () => {
      try {
        const response = await fetch('/assets/lottie/Music-NCG.json')
        if (!response.ok) {
          throw new Error('Failed to load animation')
        }
        const data = await response.json()
        setAnimationData(data)
      } catch (error) {
        console.error('Error loading Lottie animation:', error)
      }
    }
    loadAnimation()
  }, [])

  if (!isClient || !animationData) {
    return (
      <div className={`${width} ${className} flex items-center justify-center`}>
        <div className="w-full h-full bg-transparent" />
      </div>
    )
  }

  return (
    <div className={`${width} ${className}`}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default LottieAnimation


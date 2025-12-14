'use client'

import React, { useState, useRef, useEffect } from 'react'

interface VideoHeroProps {
  localVideoUrl: string
  cmsVideoUrl?: string | null
  cmsVideoUrlMobile?: string | null
  thumbnailUrl: string
  overlayOpacity?: number
  children?: React.ReactNode
}

const VideoHero = ({ localVideoUrl, cmsVideoUrl, cmsVideoUrlMobile, thumbnailUrl, overlayOpacity, children }: VideoHeroProps) => {
  const [showThumbnail, setShowThumbnail] = useState(true)
  const [videoSrc, setVideoSrc] = useState<string>(localVideoUrl)
  // Mobile video: use mobile video if available, otherwise fallback to desktop video, then local
  const mobileVideoUrl = cmsVideoUrlMobile || cmsVideoUrl || localVideoUrl
  const [videoSrcMobile, setVideoSrcMobile] = useState<string>(localVideoUrl)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoRefMobile = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Priority: local video first, then CMS video (Desktop)
    if (cmsVideoUrl && cmsVideoUrl !== localVideoUrl) {
      // Try local video first, fallback to CMS if local fails
      const video = videoRef.current
      if (video) {
        const handleError = () => {
          // If local video fails, try CMS video
          if (cmsVideoUrl && videoSrc === localVideoUrl) {
            setVideoSrc(cmsVideoUrl)
          }
        }
        video.addEventListener('error', handleError)
        return () => video.removeEventListener('error', handleError)
      }
    }
  }, [cmsVideoUrl, localVideoUrl, videoSrc])

  useEffect(() => {
    // Priority: local video first, then CMS mobile video (Mobile/Tablet)
    const mobileVideo = cmsVideoUrlMobile || cmsVideoUrl
    if (mobileVideo && mobileVideo !== localVideoUrl) {
      // Try local video first, fallback to CMS if local fails
      const video = videoRefMobile.current
      if (video) {
        const handleError = () => {
          // If local video fails, try CMS video
          if (mobileVideo && videoSrcMobile === localVideoUrl) {
            setVideoSrcMobile(mobileVideo)
          }
        }
        video.addEventListener('error', handleError)
        return () => video.removeEventListener('error', handleError)
      }
    }
  }, [cmsVideoUrlMobile, cmsVideoUrl, localVideoUrl, videoSrcMobile])

  const handleVideoCanPlay = () => {
    // Hide thumbnail when video is ready to play
    setShowThumbnail(false)
  }

  const handleVideoLoadStart = () => {
    // Keep thumbnail visible while loading
    setShowThumbnail(true)
  }

  return (
    <section className="relative h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden">
      {/* Thumbnail Image - shows while video loads */}
      {showThumbnail && (
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}
      
      {/* Desktop Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`hidden lg:block absolute inset-0 w-full h-full object-cover ${showThumbnail ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onCanPlay={handleVideoCanPlay}
        onLoadStart={handleVideoLoadStart}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      
      {/* Mobile/Tablet Video */}
      <video
        ref={videoRefMobile}
        autoPlay
        loop
        muted
        playsInline
        className={`block lg:hidden absolute inset-0 w-full h-full object-cover ${showThumbnail ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onCanPlay={handleVideoCanPlay}
        onLoadStart={handleVideoLoadStart}
      >
        <source src={videoSrcMobile} type="video/mp4" />
      </video>

      {/* Overlay */}
      {typeof overlayOpacity === 'number' && (
        <div className="absolute inset-0 z-20" style={{ backgroundColor: `rgba(0,15,25,${overlayOpacity})` }}></div>
      )}

      {/* Content */}
      <div className="relative z-30 w-full h-full flex flex-col justify-center containersection px-4 md:px-6 lg:px-20">
        {children}
      </div>
    </section>
  )
}

export default VideoHero


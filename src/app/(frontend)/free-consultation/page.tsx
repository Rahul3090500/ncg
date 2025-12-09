import React from 'react'
import FreeConsultationSection from '../components/FreeConsultationSection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const FreeConsultation = () => {
  // Use environment variable or fallback to dummy Calendly link for visibility
  const calendarLink = process.env.NEXT_PUBLIC_MS_TEAMS_LINK || 
                       process.env.NEXT_PUBLIC_CALENDLY_LINK || 
                       'https://calendly.com/demo/30min'
  
  return (
    <div className="min-h-screen relative">
      {/* Background Colors - 50/50 Split */}
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Blue Background (50%) */}
        <div className="bg-[#488BF3] min-h-screen"></div>
        {/* Right Side - Light Blue Background (50%) */}
        <div className="bg-[#e6f5ff] min-h-screen"></div>
      </div>
      {/* Content Overlay */}
      <div className="relative containersection px-0 overflow-visible! z-10">
        <FreeConsultationSection 
          data={{
            msTeamsLink: calendarLink,
          }}
        />
      </div>
    </div>
  )
}

export default FreeConsultation


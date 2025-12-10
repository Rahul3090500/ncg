'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import IGAServicesClient with SSR disabled
const IGAServicesClient = dynamic(() => import('./IGAServicesClient'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full" />
})

interface IGAService {
  title: string
  description: string
  backgroundImage?: {
    url: string
  }
  number?: string
}

interface IGAServicesSectionProps {
  igaServices: IGAService[]
}

const IGAServicesSection: React.FC<IGAServicesSectionProps> = ({ igaServices }) => {
  return <IGAServicesClient igaServices={igaServices} />
}

export default IGAServicesSection


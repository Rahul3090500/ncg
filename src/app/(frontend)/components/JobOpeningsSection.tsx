'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import JobOpeningsClient with SSR disabled
const JobOpeningsClientDynamic = dynamic(() => import('./JobOpeningsClient'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full" />
})

interface Job {
  id?: string
  image?: {
    url: string
  }
  applyByDate?: string
  title: string
  location: string
  type: string
  description: string
  link?: string
  slug?: string
}

interface JobOpeningsSectionProps {
  jobs: Job[]
}

const JobOpeningsSection: React.FC<JobOpeningsSectionProps> = ({ jobs }) => {
  return <JobOpeningsClientDynamic jobs={jobs} />
}

export default JobOpeningsSection


'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import WorkHereCardsClient from './WorkHereCardsClient'

// Dynamically import WorkHereCardsClient with SSR disabled
const WorkHereCardsClientDynamic = dynamic(() => import('./WorkHereCardsClient'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full" />
})

interface WorkHereCard {
  number?: string
  description?: string
  image?: {
    url: string
  }
}

interface WorkHereCardsSectionProps {
  cards: WorkHereCard[]
}

const WorkHereCardsSection: React.FC<WorkHereCardsSectionProps> = ({ cards }) => {
  return <WorkHereCardsClientDynamic cards={cards} />
}

export default WorkHereCardsSection


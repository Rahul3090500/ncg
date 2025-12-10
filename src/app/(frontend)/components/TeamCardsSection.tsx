'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import TeamCardsClient with SSR disabled
const TeamCardsClientDynamic = dynamic(() => import('./TeamCardsClient'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full" />
})

interface TeamMember {
  id?: string
  name?: string
  role?: string
  bio?: string
  image?: {
    url: string
  }
}

interface TeamCardsSectionProps {
  team: TeamMember[]
}

const TeamCardsSection: React.FC<TeamCardsSectionProps> = ({ team }) => {
  return <TeamCardsClientDynamic team={team} />
}

export default TeamCardsSection


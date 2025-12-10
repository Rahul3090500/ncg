'use client'

import React from 'react'
import CaseStudyCard from './CaseStudyCard'

interface CaseStudyItem {
  id: string
  image?: {
    url: string
  }
  category: string
  iconType: string
  iconAssetUrl?: string
  title: string
  description: string
  link?: string
  slug?: string
}

interface CaseStudiesGridProps {
  caseStudies: CaseStudyItem[]
  getIcon: (iconType: string, iconAssetUrl?: string) => React.ReactNode
}

const CaseStudiesGrid: React.FC<CaseStudiesGridProps> = ({ caseStudies, getIcon }) => {
  if (!caseStudies || caseStudies.length === 0) {
    return null
  }

  return (
    <div className="containersection px-0 md:px-0 lg:px-4 w-full max-w-full overflow-hidden">
      {/* Mobile: Single column, 1 card */}
      {/* Tablet: 2 columns, 2 cards */}
      {/* Desktop: Horizontal row, all cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row justify-center items-start gap-y-4 w-full">
        {caseStudies.map((caseStudy, index: number) => {
          const link = caseStudy.slug 
            ? `/case-studies/${caseStudy.slug}` 
            : (caseStudy.link || '#')
          
          return (
            <div 
              key={caseStudy.id}
              className="w-full md:w-full lg:w-auto flex justify-center flex-shrink-0 box-border overflow-hidden"
            >
              <div className="w-full max-w-full md:max-w-full lg:max-w-[477px] box-border overflow-hidden">
                <div className="w-full h-auto md:h-auto lg:h-[520px]">
                  <CaseStudyCard
                    image={caseStudy.image?.url || ''}
                    alt={`${caseStudy.category} Case Study`}
                    category={caseStudy.category}
                    title={caseStudy.title}
                    description={caseStudy.description}
                    link={link}
                    icon={getIcon(caseStudy.iconType, caseStudy.iconAssetUrl)}
                    isFirst={index === 0}
                    isLast={index === caseStudies.length - 1}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CaseStudiesGrid


"use client"
import React, { useMemo, useState } from 'react'
import CaseStudiesGridSection from './CaseStudiesGridSection'

interface CaseStudyItem {
  id: string
  image?: { url: string }
  category: string
  iconType: string
  iconAssetUrl?: string
  title: string
  description: string
  link?: string
  slug?: string
}

interface Props {
  items: CaseStudyItem[]
}

const CaseStudiesFilter = ({ items }: Props) => {
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const item of items || []) {
      if (item?.category) set.add(item.category)
    }
    return ['All', ...Array.from(set)]
  }, [items])

  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return items || []
    return (items || []).filter((i) => i.category === selectedCategory)
  }, [items, selectedCategory])

  return (
    <>
      <section className="py-4 md:py-6 lg:py-8 bg-white">
        <div className="w-full px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-[50px]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-[#000F19] text-base md:text-lg lg:text-[24px] cursor-pointer leading-tight md:leading-[0.7em] lg:leading-[0.58em] transition-all ${
                  selectedCategory === category ? 'font-manrope-semibold' : 'font-manrope-light'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

        <CaseStudiesGridSection
          data={{
            caseStudies: filtered,
            buttonText: 'All Case Studies',
            buttonLink: '/case-studies',
          }}
          showButton={false}
          useSwiper={false}
        />
    </>
  )
}

export default CaseStudiesFilter
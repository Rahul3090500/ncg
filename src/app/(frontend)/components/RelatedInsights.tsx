import React from 'react'
import { getBlogsPageData } from '@/lib/payload'
import RelatedInsightsClient from './RelatedInsightsClient'

interface RelatedInsightsProps {
  title?: string
  viewAllLink?: string
  backgroundColor?: string
  textColor?: string
  hoverColor?: string
}

interface BlogItem {
  imageUrl: string
  date: string
  title: string
  description: string
  href?: string
  slug?: string
  theme?: 'light' | 'dark'
}

const RelatedInsights = async ({
  title = 'Related Insights',
  viewAllLink = '/blogs',
  backgroundColor = '#000F19',
  textColor = '#FFFFFF',
  hoverColor = '#ffffff',
  theme = 'dark',
}: RelatedInsightsProps & { theme?: 'light' | 'dark' }) => {
  // Fetch blog data
  const { blogsAll } = await getBlogsPageData()
  
  const blogs: BlogItem[] = Array.isArray(blogsAll?.docs)
    ? blogsAll.docs.map((doc: any) => ({
        imageUrl: doc?.image?.url || '',
        date: doc?.date || '',
        title: doc?.title || '',
        description: doc?.description || '',
        href: doc?.slug ? `/blogs/${doc.slug}` : (doc?.link && doc?.link !== '#' ? doc.link : '#'),
        slug: doc?.slug,
      }))
    : []

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const displayBlogs = shuffleArray(blogs).slice(0, 4)

  if (displayBlogs.length === 0) {
    return null
  }

  return (
    <RelatedInsightsClient
      title={title}
      viewAllLink={viewAllLink}
      backgroundColor={backgroundColor}
      textColor={textColor}
      displayBlogs={displayBlogs}
      theme={theme}
    />
  )
}

export default RelatedInsights


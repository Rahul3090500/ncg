'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import AnimatedButton from './AnimatedButton'
import BlogsGridDark from '../blogs/BlogsGridDark'
import BlogsGridLight from '../blogs/BlogsGridLight'

// Dynamically import Swiper component with SSR disabled to avoid hydration issues
const RelatedInsightsSwiper = dynamic(() => import('./RelatedInsightsSwiper'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full" />
})

interface BlogItem {
  imageUrl: string
  date: string
  title: string
  description: string
  href?: string
  slug?: string
}

interface RelatedInsightsClientProps {
  title: string
  viewAllLink: string
  backgroundColor: string
  textColor: string
  displayBlogs: BlogItem[]
  theme?: 'light' | 'dark'
}

const RelatedInsightsClient: React.FC<RelatedInsightsClientProps> = ({
  title,
  viewAllLink,
  backgroundColor,
  textColor,
  displayBlogs,
  theme = 'dark',
}) => {
  return (
    <section 
      className="py-8 md:py-12 lg:py-[82px]"
      style={{ backgroundColor }}
    >
      <div className="containersection mx-auto px-4 md:px-6 lg:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-10 lg:mb-[70px] gap-4 md:gap-0">
          <h2 className={`text-[${textColor}] text-2xl md:text-3xl lg:text-4xl font-manrope-medium`}>
            {title}
          </h2>
          {/* View All Button in Header - Tablet and Desktop */}
          <div className="hidden md:block">
            <AnimatedButton
              text="View All"
              bgColor="#488BF3"
              hoverBgColor="#2f6edb"
              textColor="#ffffff"
              hoverTextColor="#ffffff"
              link={viewAllLink}
              width="w-30"
            />
          </div>
        </div>

        {/* Blog Cards - Swiper for Mobile/Tablet, Grid for Desktop */}
        <div className="lg:hidden">
          <RelatedInsightsSwiper
            blogs={displayBlogs}
            theme={theme}
          />
        </div>
        
        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-0">
          {displayBlogs.map((blog, index) => (
            theme === 'dark' ? (
              <BlogsGridDark
                key={blog.slug || index}
                imageUrl={blog.imageUrl}
                date={blog.date}
                title={blog.title}
                description={blog.description}
                href={blog.slug ? `/blogs/${blog.slug}` : (blog.href && blog.href !== '#' ? blog.href : '#')}
                slug={blog.slug}
              />
            ) : (
              <BlogsGridLight
                key={blog.slug || index}
                imageUrl={blog.imageUrl}
                date={blog.date}
                title={blog.title}
                description={blog.description}
                href={blog.slug ? `/blogs/${blog.slug}` : (blog.href && blog.href !== '#' ? blog.href : '#')}
                slug={blog.slug}
              />
            )
          ))}
        </div>

        {/* View All Button at Bottom - Mobile Only */}
        <div className="flex justify-center mt-8 md:hidden">
          <AnimatedButton
            text="View All"
            bgColor="#488BF3"
            hoverBgColor="#2f6edb"
            textColor="#ffffff"
            hoverTextColor="#ffffff"
            link={viewAllLink}
            width="w-30"
          />
        </div>
      </div>
    </section>
  )
}

export default RelatedInsightsClient


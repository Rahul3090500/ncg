import React from 'react'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getBlogBySlug } from '@/lib/payload'

// Dynamically import components for better code splitting
const SocialShare = dynamic(() => import('../../components/SocialShare'), {
  loading: () => <div className="h-[50px] w-full" />,
})

const RelatedInsights = dynamic(() => import('../../components/RelatedInsights'), {
  loading: () => <div className="h-[400px] w-full" />,
})

type PageProps = {
  params: Promise<{ slug: string }>
}

const BlogDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return ''
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString
      if (isNaN(date.getTime())) {
        // If it's already a formatted string, return as is
        return typeof dateString === 'string' ? dateString : ''
      }
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return typeof dateString === 'string' ? dateString : ''
    }
  }

  const displayDate = blog.date ? formatDate(blog.date) : ''
  // Get the base URL for social sharing
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ncg.com'
  const currentUrl = `${baseUrl}/blogs/${slug}`

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {blog.heroBackgroundImage?.url ? (
          <div className="absolute inset-0">
            <img
              src={blog.heroBackgroundImage.url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        ) : blog.image?.url ? (
          <div className="absolute inset-0">
            <img
              src={blog.image.url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#000F19] to-[#1a2d3d]"></div>
        )}

        {/* Content */}
        <div className="relative z-10 containersection px-4 md:px-6 lg:px-52 w-full">
          <div className="flex flex-col items-center justify-end mt-20 md:mt-32 lg:mt-44">
            {/* Date */}
            {displayDate && (
              <p className="text-white text-sm md:text-base mb-3 md:mb-4 font-manrope-medium">{displayDate}</p>
            )}

            {/* Title */}
            <h1 className="text-white font-manrope-semibold text-2xl md:text-3xl lg:text-5xl leading-tight md:leading-[40px] lg:leading-[60px] text-center px-4 md:px-0">
              {blog.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="containersection px-4 md:px-6 lg:px-28 py-6 md:py-8 lg:py-12">
        {/* Read Time & Share */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-8 py-4 md:py-5 border-b border-t border-[#000F19]">
          <p className="text-[#000F19] text-base md:text-lg font-manrope-medium">
            {blog.readTime || '15 Min Read'}
          </p>
          {blog.enableSocialSharing !== false && (
            <SocialShare
              url={currentUrl}
              title={blog.title}
              description={blog.description}
            />
          )}
        </div>

        {/* Content Sections */}
        {blog.contentSections && Array.isArray(blog.contentSections) && blog.contentSections.length > 0 ? (
          <div className="space-y-8 md:space-y-10 lg:space-y-12">
            {blog.contentSections.map((section: any, index: number) => (
              <div key={index} className="space-y-3 md:space-y-4">
                {/* 1. Title with Paragraphs */}
                {section.sectionType === 'titleParagraph' && (
                  <div className='mb-12 md:mb-16 lg:mb-20'>
                    {section.sectionTitle && (
                      <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-8 lg:leading-10 mb-3 md:mb-4 lg:mb-2">
                        {section.sectionTitle}
                      </h2>
                    )}
                    {section.paragraphs && Array.isArray(section.paragraphs) && section.paragraphs.length > 0 && (
                      <div className="space-y-4 md:space-y-5">
                        {section.paragraphs.map((para: any, paraIndex: number) => (
                          <p key={paraIndex} className="text-[#000F19B2] font-manrope-regular text-base md:text-lg lg:text-xl leading-6 md:leading-7 lg:leading-8">
                            {para.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Title, Paragraph & Bullet Points */}
                {section.sectionType === 'bulletList' && (
                  <div className='flex flex-col gap-3 md:gap-4'>
                    {section.sectionTitle && (
                      <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-8 lg:leading-10">
                        {section.sectionTitle}
                      </h2>
                    )}
                    {section.introParagraph && (
                      <p className="text-[#000F19B2] text-base md:text-lg leading-6 md:leading-relaxed">
                        {section.introParagraph}
                      </p>
                    )}
                    {section.bulletItems && Array.isArray(section.bulletItems) && section.bulletItems.length > 0 && (
                      <ul className="list-disc list-inside space-y-3 md:space-y-4 text-[#000F19] text-base md:text-lg">
                        {section.bulletItems.map((item: any, itemIndex: number) => (
                          <li key={itemIndex}>
                            <span className="font-manrope-semibold">{item.highlightText}</span>
                            {item.description && (
                              <span className="ml-2 text-[#000F19B2]">{item.description}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* 3. Quote Section */}
                {section.sectionType === 'quote' && section.quoteText && (
                  <blockquote className="px-4 md:px-8 lg:px-52 py-6 md:py-8 lg:py-10 my-6 md:my-8 lg:my-10">
                    <p className="text-slate-950 text-lg md:text-xl lg:text-2xl font-manrope-semibold text-center leading-7 md:leading-8 lg:leading-9">
                      &quot;{section.quoteText}&quot;
                    </p>
                  </blockquote>
                )}

                {/* 4. Title with Numbered Points */}
                {section.sectionType === 'numberedList' && (
                  <>
                    {section.sectionTitle && (
                      <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-8 lg:leading-10 mb-3 md:mb-4">
                        {section.sectionTitle}
                      </h2>
                    )}
                    {section.numberedItems && Array.isArray(section.numberedItems) && section.numberedItems.length > 0 && (
                      <ol className="list-decimal list-inside space-y-3 md:space-y-4 text-[#000F19] text-base md:text-lg lg:text-lg">
                        {section.numberedItems.map((item: any, itemIndex: number) => (
                          <li key={itemIndex} className="">
                            <span className="font-manrope-semibold text-lg md:text-xl leading-7 md:leading-8 lg:leading-9">{item.highlightText}</span>
                            {item.description && (
                              <span className="ml-2 text-lg md:text-xl leading-7 md:leading-8 lg:leading-9 text-slate-950/70">
                                {item.description}
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    )}
                  </>
                )}

                {/* 5. Image Section */}
                {section.sectionType === 'image' && section.sectionImage && (
                  <div className="w-full">
                    {typeof section.sectionImage === 'object' && section.sectionImage.url ? (
                      <img
                        src={section.sectionImage.url}
                        alt={section.sectionImage.alt || blog.title || 'Blog image'}
                        className="w-full h-auto object-cover"
                      />
                    ) : typeof section.sectionImage === 'string' ? (
                      <img
                        src={section.sectionImage}
                        alt={blog.title || 'Blog image'}
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Fallback: Show description if no content sections */
          blog.description && (
            <div className="space-y-4 md:space-y-6">
              <p className="text-[#000F19] text-base md:text-lg leading-6 md:leading-relaxed">
                {blog.description}
              </p>
            </div>
          )
        )}
        {/* Footer Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-8 py-4 md:py-5 border-b border-t border-[#000F19]">
          <p className="text-[#000F19] text-base md:text-lg font-manrope-medium">Thank you!</p>
          {blog.enableSocialSharing !== false && (
            <SocialShare
              url={currentUrl}
              title={blog.title}
              description={blog.description}
            />
          )}
        </div>
      </article>

      <RelatedInsights title="Explore More Insights" backgroundColor="#FFFFFF" theme="light"  textColor = '#000F19' />

    </div>
  )
}

export default BlogDetailPage

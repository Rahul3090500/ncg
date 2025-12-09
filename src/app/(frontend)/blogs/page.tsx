import { Key } from 'react'
import BlogsGrid from './BlogsGrid'
import { getBlogsPageData } from '@/lib/payload'

// Use ISR - revalidate every hour for blogs listing
export const revalidate = 3600

const Blogs = async () => {
  const { blogsPageHeroSection, blogsAll } = await getBlogsPageData()
  const heroHeading = blogsPageHeroSection?.heading || 'Knowledge Hub'
  const heroBg = blogsPageHeroSection?.backgroundImage?.url || "/assets/b1ff6240c2e18c94f5723fd22ff80b4174782915%20(1).png"
  const items = Array.isArray(blogsAll?.docs)
    ? blogsAll.docs.map((doc: any) => ({
      imageUrl: doc?.image?.url,
      date: doc?.date,
      title: doc?.title,
      description: doc?.description,
      href: doc?.slug ? `/blogs/${doc.slug}` : (doc?.link || undefined),
      slug: doc?.slug,
    }))
    : []
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[250px] md:h-[300px] lg:h-[330px] flex items-end pb-[8%] justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBg}')` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 w-full containersection mx-auto mt-24! md:mt-32! lg:mt-[140px]! px-4 md:px-6 lg:px-8">
          <div className="max-w-[1512px] mx-auto px-0 md:px-0 lg:px-[15px] text-center text-white">
            <h1 className="text-white text-3xl md:text-4xl lg:text-7xl font-manrope-semibold leading-tight mb-2 md:mb-3 lg:mb-2">
              {String(heroHeading).split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
            <p className="text-white font-manrope-medium text-base md:text-lg lg:text-2xl">The latest insights from the NCG community.</p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-8 md:pb-10 lg:pb-12 pt-4 md:pt-5 lg:pt-[19px]">
        <div className="w-full containersection px-4 md:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-[13px]">


          {items.map((post: { imageUrl: string; date: string; title: string; description: string; href: string | undefined; slug?: string }, idx: Key | null | undefined) => (
            <BlogsGrid
              key={idx}
              imageUrl={post.imageUrl}
              date={post.date}
              title={post.title}
              description={post.description}
              href={post.href}
              slug={post.slug}
            />
          ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;

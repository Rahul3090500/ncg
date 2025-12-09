import React from 'react'
import Link from 'next/link'

interface JobCardProps {
  image: string
  applyByDate: string
  title: string
  location: string
  type: string
  description: string
  link?: string
  slug?: string
}

const JobCard: React.FC<JobCardProps> = ({
  image,
  applyByDate,
  title,
  location,
  type,
  description,
  link,
  slug
}) => {
  const CardContent = (
    <>
      <img 
        className="w-full h-48 md:h-64 lg:h-80 rounded-[5px] object-cover" 
        src={image} 
        alt={title}
      />
      
      <div className="px-4 md:px-5 lg:px-[27px] py-4 md:py-5 lg:py-[17px] flex flex-col">
        <h3 className="text-[#000F19] text-lg md:text-xl lg:text-2xl font-manrope-medium leading-6 md:leading-7 mb-3 md:mb-4 lg:mb-[17px]">
          {title}
        </h3>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 mb-2 md:mb-[7px] mt-2 md:mt-[10px]">
          <span className="text-slate-950 text-sm md:text-base font-manrope-medium capitalize leading-4">
            Location: {location}
          </span>
          <span className="text-slate-950 text-sm md:text-base font-manrope-medium capitalize leading-4">
            Type: {type}
          </span>
        </div>
        
        <div className="w-full h-px bg-black mb-2 md:mb-[8px]"></div>
        
        <p className="text-[#000F19]/70 text-sm md:text-base font-manrope-light leading-5 mb-4 md:mb-6 lg:mb-[28px] min-h-[48px] md:min-h-[56px] lg:min-h-[64px]">
          {description}
        </p>
        
        <p className="text-[#000F19] mb-2 md:mb-[10px] text-sm md:text-base font-manrope-medium leading-3 mt-auto">
          {applyByDate}
        </p>
      </div>
    </>
  )

  // Priority: slug > link > no link
  if (slug) {
    return (
      <Link 
        href={`/jobs/${slug}`}
        prefetch={true}
        className="bg-white rounded-[5px] block overflow-hidden"
      >
        {CardContent}
      </Link>
    )
  }

  if (link) {
    return (
      <a 
        href={link}
        className="bg-white rounded-[5px] hover:shadow-2xl transition-shadow duration-300 block overflow-hidden"
      >
        {CardContent}
      </a>
    )
  }

  return (
    <div className="bg-white rounded-[5px] overflow-hidden">
      {CardContent}
    </div>
  )
}

export default JobCard


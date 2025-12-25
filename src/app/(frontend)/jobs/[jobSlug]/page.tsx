import React from 'react'
import { notFound } from 'next/navigation'
import { getJobBySlug } from '@/lib/payload'
import JobApplicationForm from '../../components/JobApplicationForm'
import AnimatedButton from '../../components/AnimatedButton'
import ShareButton from '../../components/ShareButton'

type PageProps = {
  params: Promise<{ jobSlug: string }>
}

const JobDetailPage = async ({ params }: PageProps) => {
  const { jobSlug } = await params
  const job = await getJobBySlug(jobSlug)

  if (!job) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const applyByDate = job.applyByDate ? formatDate(job.applyByDate) : ''
  const location = job.location || ''
  const type = job.type || ''
  const department = job.department || 'Technology'
  const remoteStatus = job.remoteStatus || type
  
  // Get the base URL for social sharing
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ncg.com'
  const shareUrl = `${baseUrl}/jobs/${jobSlug}`

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[546px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {job.heroImage?.url ? (
            <img
              src={job.heroImage.url}
              alt={job.title}
              className="w-full h-full object-cover"
            />
          ) : job.image?.url ? (
            <img
              src={job.image.url}
              alt={job.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#000F19] to-[#1a2d3d]" />
          )}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative containersection h-full flex flex-col justify-between px-4 sm:px-6">
          {/* Share Icon */}
          <div className="flex justify-end pt-16 scale-85 md:scale-100 sm:pt-16 md:pt-24 lg:pt-[90px]">
            <ShareButton 
              url={shareUrl}
              title={job.title}
            />
          </div>

          {/* Job Title and Description */}
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-[54px] px-4 sm:px-6 md:px-8 lg:px-[40px] flex flex-col justify-end items-center">
            <h1 className="text-white font-manrope-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight sm:leading-[40px] md:leading-[50px] lg:leading-[60px] mb-4 sm:mb-5 md:mb-[20px] text-center">
              {job.title}
            </h1>
            {job.roleDescription && (
              <p className="text-white font-manrope-medium text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 text-center max-w-[1144px] px-2 sm:px-0">
                {typeof job.roleDescription === 'string'
                  ? job.roleDescription
                  : job.description || ''}
              </p>
            )}
            {!job.roleDescription && job.description && (
              <p className="text-white font-manrope-medium text-sm sm:text-base md:text-lg lg:text-[19px] leading-5 sm:leading-6 md:leading-7 lg:leading-[23px] text-center max-w-[1144px] px-2 sm:px-0">
                {job.description}
              </p>
            )}
            <AnimatedButton
              text="Send Application"
              bgColor="#488BF3"
              hoverBgColor="#3a7be0"
              textColor="#fff"
              hoverTextColor="#fff"
              width="w-full sm:w-48"
              roundness="rounded-[5px]"
              centered={true}
              asDiv={true}
              className="mt-4 sm:mt-5 md:mt-[20px]"
              link="#application-form"
            />
          </div>
        </div>
      </section>

      {/* Job Overview Bar */}
      <section className="bg-white border-b border-[#000F19]">
        <div className="containersection px-4 sm:px-6 md:px-12 lg:px-24 py-4 sm:py-6 md:py-8 lg:py-[38px]">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 sm:gap-4 md:gap-6 text-[#000F19]">
            <div className="flex items-center gap-2">
              <span className="font-manrope-semibold text-base sm:text-lg md:text-xl leading-4">Location:</span>
              <span className="font-manrope-semibold text-base sm:text-lg md:text-xl leading-4">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-manrope-semibold text-base sm:text-lg md:text-xl leading-4">Apply By:</span>
              <span className="font-manrope-semibold text-base sm:text-lg md:text-xl leading-4">{applyByDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-manrope-semibold text-base sm:text-lg md:text-xl leading-4">Type:</span>
              <span className="font-manrope-semibold text-base sm:text-lg md:text-xl leading-4 capitalize">{type}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="pt-6 sm:pt-8 md:pt-10 lg:pt-[38px] bg-white">
        <div className="containersection px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
            {/* Company Introduction */}
            {job.companyIntroduction && (
              <div>
                <p className="text-[#000F19] text-base sm:text-lg md:text-xl leading-6 sm:leading-7 md:leading-relaxed">
                  {job.companyIntroduction}
                </p>
              </div>
            )}

            {/* Your Role And Responsibilities */}
            {job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[75px]">
                <h2 className="text-[#000F19] font-manrope-semibold text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-[40px] md:leading-[50px] mb-3 sm:mb-4 md:mb-[6px]">
                  Your Role And Responsibilities
                </h2>
                <p className="text-[#000F19] text-base sm:text-lg md:text-xl font-manrope-medium leading-6 sm:leading-7 md:leading-8 mb-3 sm:mb-4 md:mb-[6px]">
                  In the role of {job.title}, you will:
                </p>
                <ul className="list-disc list-inside space-y-2 font-manrope-light text-[#000F19] text-base sm:text-lg md:text-xl pl-2 sm:pl-0">
                  {job.responsibilities.map((item: any, index: number) => (
                    <li key={index}>{item.responsibility}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills And Experience */}
            {job.requiredSkills && Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
              <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[75px]">
                <h2 className="text-[#000F19] font-manrope-semibold text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-[40px] md:leading-[50px] mb-3 sm:mb-4 md:mb-[6px]">
                  Required Skills And Experience
                </h2>
                <p className="text-[#000F19] text-base sm:text-lg md:text-xl font-manrope-medium leading-6 sm:leading-7 md:leading-8 mb-3 sm:mb-4 md:mb-[6px]">
                  We&apos;re looking for candidates who possess:
                </p>
                <ul className="list-disc list-inside space-y-2 font-manrope-light text-[#000F19] text-base sm:text-lg md:text-xl pl-2 sm:pl-0">
                  {job.requiredSkills.map((item: any, index: number) => (
                    <li key={index}>{item.skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Attributes That Set You Apart */}
            {job.attributes && Array.isArray(job.attributes) && job.attributes.length > 0 && (
              <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[75px]">
                <h2 className="text-[#000F19] font-manrope-semibold text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-[40px] md:leading-[50px] mb-3 sm:mb-4 md:mb-[6px]">
                  Attributes That Set You Apart
                </h2>
                <p className="text-[#000F19] text-base sm:text-lg md:text-xl font-manrope-medium leading-6 sm:leading-7 md:leading-8 mb-3 sm:mb-4 md:mb-[6px]">
                  Your success in this role relies on:
                </p>
                <ul className="list-disc list-inside space-y-2 font-manrope-light text-[#000F19] text-base sm:text-lg md:text-xl pl-2 sm:pl-0">
                  {job.attributes.map((item: any, index: number) => (
                    <li key={index}>{item.attribute}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What We Offer */}
            {job.benefits && Array.isArray(job.benefits) && job.benefits.length > 0 && (
              <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[75px]">
                <h2 className="text-[#000F19] font-manrope-semibold text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-[40px] md:leading-[50px] mb-3 sm:mb-4 md:mb-[6px]">
                  What We Offer
                </h2>
                <ul className="list-disc list-inside space-y-2 font-manrope-light text-[#000F19] text-base sm:text-lg md:text-xl pl-2 sm:pl-0">
                  {job.benefits.map((item: any, index: number) => (
                    <li key={index}>{item.benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* How To Apply */}
            {job.howToApply && (
              <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[75px]">
                <h2 className="text-[#000F19] font-manrope-semibold text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-[40px] md:leading-[50px] mb-3 sm:mb-4 md:mb-[6px]">
                  How To Apply
                </h2>
                <p className="text-[#000F19] text-base sm:text-lg md:text-xl font-manrope-medium leading-6 sm:leading-7 md:leading-8 whitespace-pre-line">
                  {job.howToApply}
                </p>
              </div>
            )}
            {/* Summary Box */}
            <div className="bg-[#488BF3] py-6 sm:py-8 mb-8 sm:mb-12 md:mb-16 lg:mb-[75px] rounded-[10px]">
              <div className="containersection px-4 sm:px-6 md:px-12 lg:px-24">
                <div className="flex text-white flex-col justify-center items-center">
                  <div className="w-full flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                      <p className="font-manrope-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[60px] text-left sm:text-right sm:w-[180px] md:w-[200px] lg:w-[240px] sm:whitespace-nowrap">Department:</p>
                      <p className="font-manrope-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[60px] text-left flex-1">{department}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                      <p className="font-manrope-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[60px] text-left sm:text-right sm:w-[180px] md:w-[200px] lg:w-[240px] sm:whitespace-nowrap">Location:</p>
                      <p className="font-manrope-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[60px] text-left flex-1">{location}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                      <p className="font-manrope-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[60px] text-left sm:text-right sm:w-[180px] md:w-[200px] lg:w-[240px] sm:whitespace-nowrap">Remote Status:</p>
                      <p className="font-manrope-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[60px] text-left flex-1 capitalize">{remoteStatus}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                      <p className="font-manrope-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[60px] text-left sm:text-right sm:w-[180px] md:w-[200px] lg:w-[240px] sm:whitespace-nowrap">Employment Type:</p>
                      <p className="font-manrope-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[60px] text-left flex-1 capitalize">{type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Application Form */}
      <section id="application-form" className="pt-8 sm:pt-12 md:pt-16 lg:pt-[83px] bg-[#000F19]">
        <div className="max-w-[1512px] mx-auto px-4 sm:px-6">
          <JobApplicationForm jobId={job.id} jobTitle={job.title} />
        </div>
      </section>
    </div>
  )
}

export default JobDetailPage


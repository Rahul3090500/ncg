import React from 'react'
import { getJobsPageData } from '@/lib/payload'
import JobCard from '../components/JobCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const Jobs = async () => {
  const data: any = await getJobsPageData()
  const jobsSection: any = data?.jobsSection || null
  const selectedJobs = jobsSection?.selectedJobs || []

  return (
    <div className="bg-white">
      {/* Hero Section */}
      {jobsSection && (
        <section className="relative h-[329px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {jobsSection.backgroundImage?.url && (
              <img
                src={jobsSection.backgroundImage.url}
                alt="Jobs Background"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Content */}
          <div className="relative containersection mx-auto h-full flex flex-col justify-end">
            <div className="mb-[50px] px-[40px] flex flex-col items-center justify-center">
              {jobsSection.heading && (
                <h1 className="text-white font-manrope-semibold text-7xl leading-[70px] mb-[18px] capitalize">
                  {jobsSection.heading}
                </h1>
              )}
              {jobsSection.description && (
                <p className="text-white font-manrope-medium text-2xl leading-[23px] max-w-[1144px] text-center">
                  {jobsSection.description}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Jobs Grid Section */}
      {Array.isArray(selectedJobs) && selectedJobs.length > 0 && (
        <section className="py-[52px] bg-[#E7F5FF]">
          <div className="containersection px-10">
            {/* Job Cards Grid */}
            <div className="grid grid-cols-3 gap-[20px]">
              {selectedJobs.map((job: any, index: number) => (
                <JobCard
                  key={job?.id || index}
                  image={job?.image?.url || ''}
                  applyByDate={job?.applyByDate ? `Apply By: ${new Date(job.applyByDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                  title={job?.title || ''}
                  location={job?.location || ''}
                  type={job?.type || ''}
                  description={job?.description || ''}
                  link={job?.link}
                  slug={job?.slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {/* {(!Array.isArray(selectedJobs) || selectedJobs.length === 0) && (
        <section className="py-[100px] bg-[#F5F7FA]">
          <div className="max-w-[1512px] mx-auto px-[40px] text-center">
            <p className="text-[#000F19] text-xl font-manrope-medium">
              No job openings available at the moment. Please check back later.
            </p>
          </div>
        </section>
      )} */}
    </div>
  )
}

export default Jobs


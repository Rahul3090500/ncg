import React from 'react'
import FreeConsultationSection from '../components/FreeConsultationSection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const FreeConsultation = async () => {
  let freeConsultationData = null

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/free-consultation-read`, {
      next: { revalidate: 0 },
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
      },
    })

    if (response.ok) {
      const data = await response.json()
      freeConsultationData = data?.freeConsultationSection
    }
  } catch (error) {
    console.error('Failed to fetch free consultation data:', error)
  }

  // Extract data from CMS response
  const sectionData = freeConsultationData
    ? {
        leftTitle: freeConsultationData.leftTitle,
        leftSubtitle: freeConsultationData.leftSubtitle,
        rightTitle: freeConsultationData.rightTitle,
        rightDescription: freeConsultationData.rightDescription,
        calendlyUrl: freeConsultationData.calendlyUrl,
      }
    : undefined

  return <FreeConsultationSection data={sectionData} />
}

export default FreeConsultation

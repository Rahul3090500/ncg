import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// PATCH/PUT endpoint for updating a job application
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const payload = await getPayload({ config })

    // Validate application ID
    const applicationId = typeof id === 'string' ? parseInt(id, 10) : Number(id)
    if (!applicationId || isNaN(applicationId)) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      )
    }

    // Verify application exists
    let existingApplication
    try {
      existingApplication = await payload.findByID({
        collection: 'job-applications',
        id: applicationId,
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      )
    }

    // Prepare update data (only include fields that are provided)
    const updateData: any = {}

    // Update job opening if provided
    if (body.jobOpening !== undefined) {
      const jobOpeningId = typeof body.jobOpening === 'string' 
        ? parseInt(body.jobOpening, 10) 
        : Number(body.jobOpening)
      
      if (!jobOpeningId || isNaN(jobOpeningId)) {
        return NextResponse.json(
          { error: 'Invalid job opening ID' },
          { status: 400 }
        )
      }

      // Verify job opening exists
      try {
        await payload.findByID({
          collection: 'job-openings',
          id: jobOpeningId,
        })
        updateData.jobOpening = jobOpeningId
      } catch (error) {
        return NextResponse.json(
          { error: 'Job opening not found' },
          { status: 404 }
        )
      }
    }

    // Update personal information fields
    if (body.firstName !== undefined) {
      updateData.firstName = String(body.firstName).trim()
    }
    if (body.lastName !== undefined) {
      updateData.lastName = String(body.lastName).trim()
    }
    if (body.email !== undefined) {
      const email = String(body.email).trim().toLowerCase()
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
      updateData.email = email
    }
    if (body.phone !== undefined) {
      updateData.phone = body.phone ? String(body.phone).trim() : ''
    }
    if (body.location !== undefined) {
      updateData.location = String(body.location).trim()
    }

    // Update language skills
    if (body.languageSkills !== undefined) {
      const validLanguageSkills = ['swedish', 'english', 'finnish', 'danish', 'other']
      const languageSkills = Array.isArray(body.languageSkills) 
        ? body.languageSkills 
        : [body.languageSkills]
      
      const invalidLanguages = languageSkills.filter((lang: string) => !validLanguageSkills.includes(lang))
      if (invalidLanguages.length > 0) {
        return NextResponse.json(
          { error: `Invalid language skills: ${invalidLanguages.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.languageSkills = languageSkills
    }

    // Update radio button fields
    const validRadioOptions = ['yes', 'no']
    if (body.securityCheckConsent !== undefined) {
      if (!validRadioOptions.includes(body.securityCheckConsent)) {
        return NextResponse.json(
          { error: 'Invalid security check consent value' },
          { status: 400 }
        )
      }
      updateData.securityCheckConsent = body.securityCheckConsent
    }
    if (body.swedishTechIndustry !== undefined) {
      if (!validRadioOptions.includes(body.swedishTechIndustry)) {
        return NextResponse.json(
          { error: 'Invalid Swedish tech industry value' },
          { status: 400 }
        )
      }
      updateData.swedishTechIndustry = body.swedishTechIndustry
    }
    if (body.strategicPlansExperience !== undefined) {
      if (!validRadioOptions.includes(body.strategicPlansExperience)) {
        return NextResponse.json(
          { error: 'Invalid strategic plans experience value' },
          { status: 400 }
        )
      }
      updateData.strategicPlansExperience = body.strategicPlansExperience
    }

    // Update years of experience
    if (body.yearsOfExperience !== undefined) {
      updateData.yearsOfExperience = String(body.yearsOfExperience).trim()
    }

    // Update resume file
    if (body.resume !== undefined) {
      const resumeId = typeof body.resume === 'string' 
        ? parseInt(body.resume, 10) 
        : Number(body.resume)
      
      if (!resumeId || isNaN(resumeId)) {
        return NextResponse.json(
          { error: 'Invalid resume file ID' },
          { status: 400 }
        )
      }

      // Verify resume file exists
      try {
        await payload.findByID({
          collection: 'media',
          id: resumeId,
        })
        updateData.resume = resumeId
      } catch (error) {
        return NextResponse.json(
          { error: 'Resume file not found' },
          { status: 404 }
        )
      }
    }

    // Update additional files
    if (body.additionalFiles !== undefined) {
      if (Array.isArray(body.additionalFiles) && body.additionalFiles.length > 0) {
        const additionalFileIds = body.additionalFiles.map((id: string | number) => 
          typeof id === 'string' ? parseInt(id, 10) : Number(id)
        )
        
        // Verify all files exist
        for (const fileId of additionalFileIds) {
          try {
            await payload.findByID({
              collection: 'media',
              id: fileId,
            })
          } catch (error) {
            return NextResponse.json(
              { error: `Additional file with ID ${fileId} not found` },
              { status: 404 }
            )
          }
        }
        updateData.additionalFiles = additionalFileIds
      } else {
        updateData.additionalFiles = []
      }
    }

    // Update cover letter
    if (body.coverLetter !== undefined) {
      updateData.coverLetter = body.coverLetter ? String(body.coverLetter).trim() : ''
    }

    // Update consent checkboxes
    if (body.privacyPolicyConsent !== undefined) {
      updateData.privacyPolicyConsent = body.privacyPolicyConsent === true || body.privacyPolicyConsent === 'true'
    }
    if (body.futureOpportunitiesConsent !== undefined) {
      updateData.futureOpportunitiesConsent = body.futureOpportunitiesConsent === true || body.futureOpportunitiesConsent === 'true'
    }

    // Update LinkedIn URL
    if (body.linkedinUrl !== undefined) {
      updateData.linkedinUrl = body.linkedinUrl ? String(body.linkedinUrl).trim() : ''
    }

    // Update the job application in Payload CMS
    const updatedApplication = await payload.update({
      collection: 'job-applications',
      id: applicationId,
      data: updateData,
    })

    console.log('Job application updated successfully:', {
      id: updatedApplication.id,
      email: updatedApplication.email,
      updatedAt: updatedApplication.updatedAt,
    })

    return NextResponse.json(
      {
        success: true,
        id: updatedApplication.id,
        message: 'Application updated successfully',
        data: updatedApplication,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating job application:', {
      error: error?.message,
      stack: error?.stack,
      details: error?.data || error?.errors,
    })

    // Handle Payload-specific errors
    if (error?.data?.errors) {
      const validationErrors = error.data.errors.map((err: any) => err.message).join(', ')
      return NextResponse.json(
        { error: `Validation error: ${validationErrors}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to update application. Please try again.' },
      { status: 500 }
    )
  }
}

// PUT endpoint (same as PATCH for this use case)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PATCH(request, { params })
}

// GET endpoint for retrieving a single job application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const payload = await getPayload({ config })

    const applicationId = typeof id === 'string' ? parseInt(id, 10) : Number(id)
    if (!applicationId || isNaN(applicationId)) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      )
    }

    const application = await payload.findByID({
      collection: 'job-applications',
      id: applicationId,
    })

    return NextResponse.json(
      {
        success: true,
        data: application,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching job application:', error)
    return NextResponse.json(
      { error: error?.message || 'Job application not found' },
      { status: 404 }
    )
  }
}



import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = await getPayload({ config })
    
    // Validate and convert jobOpening ID
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
      const jobOpening = await payload.findByID({
        collection: 'job-openings',
        id: jobOpeningId,
      })
      if (!jobOpening) {
        return NextResponse.json(
          { error: 'Job opening not found' },
          { status: 404 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Job opening not found' },
        { status: 404 }
      )
    }
    
    // Validate required fields
    const requiredFields: Record<string, string> = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      location: 'Location',
      languageSkills: 'Language skills',
      securityCheckConsent: 'Security check consent',
      yearsOfExperience: 'Years of experience',
      swedishTechIndustry: 'Swedish tech industry experience',
      strategicPlansExperience: 'Strategic plans experience',
      resume: 'Resume',
      privacyPolicyConsent: 'Privacy policy consent',
    }
    
    const missingFields: string[] = []
    for (const [field, label] of Object.entries(requiredFields)) {
      if (field === 'languageSkills' && (!body[field] || !Array.isArray(body[field]) || body[field].length === 0)) {
        missingFields.push(label)
      } else if (field === 'privacyPolicyConsent' && body[field] !== true && body[field] !== 'true') {
        missingFields.push(label)
      } else if (field !== 'languageSkills' && field !== 'privacyPolicyConsent' && !body[field]) {
        missingFields.push(label)
      }
    }
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate language skills are valid options
    const validLanguageSkills = ['swedish', 'english', 'finnish', 'danish', 'other']
    const languageSkills = Array.isArray(body.languageSkills) ? body.languageSkills : [body.languageSkills]
    const invalidLanguages = languageSkills.filter((lang: string) => !validLanguageSkills.includes(lang))
    if (invalidLanguages.length > 0) {
      return NextResponse.json(
        { error: `Invalid language skills: ${invalidLanguages.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate radio button values
    const validRadioOptions = ['yes', 'no']
    if (!validRadioOptions.includes(body.securityCheckConsent)) {
      return NextResponse.json(
        { error: 'Invalid security check consent value' },
        { status: 400 }
      )
    }
    if (!validRadioOptions.includes(body.swedishTechIndustry)) {
      return NextResponse.json(
        { error: 'Invalid Swedish tech industry value' },
        { status: 400 }
      )
    }
    if (!validRadioOptions.includes(body.strategicPlansExperience)) {
      return NextResponse.json(
        { error: 'Invalid strategic plans experience value' },
        { status: 400 }
      )
    }

    // Verify resume file exists
    if (body.resume) {
      try {
        const resumeFile = await payload.findByID({
          collection: 'media',
          id: typeof body.resume === 'string' ? parseInt(body.resume, 10) : Number(body.resume),
        })
        if (!resumeFile) {
          return NextResponse.json(
            { error: 'Resume file not found' },
            { status: 400 }
          )
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Resume file not found or invalid' },
          { status: 400 }
        )
      }
    }

    // Verify additional files exist if provided
    if (body.additionalFiles && Array.isArray(body.additionalFiles) && body.additionalFiles.length > 0) {
      const additionalFileIds = body.additionalFiles.map((id: string | number) => 
        typeof id === 'string' ? parseInt(id, 10) : Number(id)
      )
      
      for (const fileId of additionalFileIds) {
        try {
          await payload.findByID({
            collection: 'media',
            id: fileId,
          })
        } catch (error) {
          return NextResponse.json(
            { error: `Additional file with ID ${fileId} not found` },
            { status: 400 }
          )
        }
      }
    }
    
    // Prepare data for Payload CMS
    const applicationData = {
      jobOpening: jobOpeningId,
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: body.phone ? String(body.phone).trim() : '',
      location: String(body.location).trim(),
      languageSkills: languageSkills,
      securityCheckConsent: body.securityCheckConsent as 'yes' | 'no',
      yearsOfExperience: String(body.yearsOfExperience).trim(),
      swedishTechIndustry: body.swedishTechIndustry as 'yes' | 'no',
      strategicPlansExperience: body.strategicPlansExperience as 'yes' | 'no',
      resume: typeof body.resume === 'string' ? parseInt(body.resume, 10) : Number(body.resume),
      additionalFiles: body.additionalFiles && Array.isArray(body.additionalFiles) && body.additionalFiles.length > 0
        ? body.additionalFiles.map((id: string | number) => typeof id === 'string' ? parseInt(id, 10) : Number(id))
        : [],
      coverLetter: body.coverLetter ? String(body.coverLetter).trim() : '',
      privacyPolicyConsent: body.privacyPolicyConsent === true || body.privacyPolicyConsent === 'true',
      futureOpportunitiesConsent: body.futureOpportunitiesConsent === true || body.futureOpportunitiesConsent === 'true' || false,
      linkedinUrl: body.linkedinUrl ? String(body.linkedinUrl).trim() : '',
    }
    
    // Create the job application in Payload CMS
    const application = await payload.create({
      collection: 'job-applications',
      data: applicationData,
    })
    
    console.log('Job application created successfully:', {
      id: application.id,
      email: application.email,
      jobOpening: application.jobOpening,
      createdAt: application.createdAt,
    })
    
    return NextResponse.json(
      { 
        success: true, 
        id: application.id,
        message: 'Application submitted successfully' 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating job application:', {
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
      { error: error?.message || 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}


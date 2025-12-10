import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = await getPayload({ config })
    
    // Validate required fields
    const requiredFields = [
      'jobOpening',
      'firstName',
      'lastName',
      'email',
      'location',
      'languageSkills',
      'securityCheckConsent',
      'yearsOfExperience',
      'swedishTechIndustry',
      'strategicPlansExperience',
      'resume',
      'privacyPolicyConsent',
    ]
    
    const missingFields = requiredFields.filter(field => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Create the job application
    const application = await payload.create({
      collection: 'job-applications',
      data: {
        jobOpening: body.jobOpening,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || '',
        location: body.location,
        languageSkills: Array.isArray(body.languageSkills) ? body.languageSkills : [body.languageSkills],
        securityCheckConsent: body.securityCheckConsent,
        yearsOfExperience: body.yearsOfExperience,
        swedishTechIndustry: body.swedishTechIndustry,
        strategicPlansExperience: body.strategicPlansExperience,
        resume: body.resume,
        additionalFiles: body.additionalFiles ? (Array.isArray(body.additionalFiles) ? body.additionalFiles : [body.additionalFiles]) : [],
        coverLetter: body.coverLetter || '',
        privacyPolicyConsent: body.privacyPolicyConsent === true || body.privacyPolicyConsent === 'true',
        futureOpportunitiesConsent: body.futureOpportunitiesConsent === true || body.futureOpportunitiesConsent === 'true',
        linkedinUrl: body.linkedinUrl || '',
      },
    })
    
    return NextResponse.json(
      { success: true, id: application.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating job application:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to submit application' },
      { status: 500 }
    )
  }
}


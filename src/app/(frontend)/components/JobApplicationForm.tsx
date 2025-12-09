'use client'

import React, { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import AnimatedButton from './AnimatedButton'
import CountryCodeSelector from './JobApplicationForm/components/CountryCodeSelector'
import CustomCheckbox from './JobApplicationForm/components/CustomCheckbox'
import CustomRadio from './JobApplicationForm/components/CustomRadio'
import type { FormData as FormDataType, SubmitStatus } from './JobApplicationForm/types'

interface JobApplicationFormProps {
  jobId: number | string
  jobTitle: string
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ jobId, jobTitle }) => {
  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+358',
    location: '',
    languageSkills: [],
    securityCheckConsent: '',
    yearsOfExperience: '',
    swedishTechIndustry: '',
    strategicPlansExperience: '',
    resume: null,
    additionalFiles: [],
    coverLetter: '',
    privacyPolicyConsent: false,
    futureOpportunitiesConsent: false,
    linkedinUrl: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    if (name === 'languageSkills') {
      setFormData(prev => ({
        ...prev,
        languageSkills: checked
          ? [...prev.languageSkills, value]
          : prev.languageSkills.filter(skill => skill !== value)
      }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'resume' | 'additionalFiles') => {
    const files = e.target.files
    if (!files) return

    if (field === 'resume' && files.length > 0) {
      setFormData(prev => ({ ...prev, resume: files[0] }))
    } else if (field === 'additionalFiles') {
      setFormData(prev => ({ ...prev, additionalFiles: Array.from(files) }))
    }
  }

  const handleLinkedInAuth = async () => {
    setIsLinkedInLoading(true)
    setErrorMessage('')

    try {
      // Get LinkedIn auth URL
      const redirectUri = `${window.location.origin}/linkedin-callback`
      const authResponse = await fetch(`/api/linkedin/auth?redirectUri=${encodeURIComponent(redirectUri)}`)

      if (!authResponse.ok) {
        const errorData = await authResponse.json()
        throw new Error(errorData.error || 'Failed to initialize LinkedIn authentication')
      }

      const { authUrl } = await authResponse.json()

      // Open LinkedIn OAuth in popup
      const width = 600
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const popup = window.open(
        authUrl,
        'LinkedIn Login',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      )

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.')
      }

      // Listen for message from popup
      const messageListener = (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) {
          return
        }

        if (event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
          const profile = event.data.profile

          // Pre-fill form with LinkedIn data
          setFormData(prev => ({
            ...prev,
            firstName: profile.firstName || prev.firstName,
            lastName: profile.lastName || prev.lastName,
            email: profile.email || prev.email,
            linkedinUrl: profile.linkedinUrl || prev.linkedinUrl,
          }))

          setIsLinkedInLoading(false)
          popup.close()
          window.removeEventListener('message', messageListener)
        } else if (event.data.type === 'LINKEDIN_AUTH_ERROR') {
          setErrorMessage(event.data.error || 'LinkedIn authentication failed')
          setIsLinkedInLoading(false)
          popup.close()
          window.removeEventListener('message', messageListener)
        }
      }

      window.addEventListener('message', messageListener)

      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          setIsLinkedInLoading(false)
        }
      }, 1000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to connect with LinkedIn')
      setIsLinkedInLoading(false)
    }
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `File upload failed (${response.status})`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      if (!data.doc?.id) {
        throw new Error('File uploaded but no ID returned')
      }
      return data.doc.id
    } catch (error: any) {
      console.error('Error uploading file:', error)
      throw error // Re-throw to be caught by handleSubmit
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Upload resume
      if (!formData.resume) {
        setErrorMessage('Resume is required')
        setIsSubmitting(false)
        return
      }

      let resumeId: string | null = null
      try {
        resumeId = await uploadFile(formData.resume)
        if (!resumeId) {
          setErrorMessage('Failed to upload resume: No file ID returned')
          setIsSubmitting(false)
          return
        }
      } catch (uploadError: any) {
        setErrorMessage(`Failed to upload resume: ${uploadError.message || 'Unknown error'}`)
        setIsSubmitting(false)
        return
      }

      // Upload additional files
      const additionalFileIds: string[] = []
      for (const file of formData.additionalFiles) {
        try {
          const fileId = await uploadFile(file)
          if (fileId) {
            additionalFileIds.push(fileId)
          }
        } catch (uploadError) {
          console.error('Error uploading additional file:', uploadError)
          // Continue with other files even if one fails
        }
      }

      // Submit application
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobOpening: jobId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone ? `${formData.countryCode} ${formData.phone}` : '',
          location: formData.location,
          languageSkills: formData.languageSkills,
          securityCheckConsent: formData.securityCheckConsent,
          yearsOfExperience: formData.yearsOfExperience,
          swedishTechIndustry: formData.swedishTechIndustry,
          strategicPlansExperience: formData.strategicPlansExperience,
          resume: resumeId,
          additionalFiles: additionalFileIds,
          coverLetter: formData.coverLetter,
          privacyPolicyConsent: formData.privacyPolicyConsent,
          futureOpportunitiesConsent: formData.futureOpportunitiesConsent,
          linkedinUrl: formData.linkedinUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit application')
      }

      setSubmitStatus('success')
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        countryCode: '+358',
        location: '',
        languageSkills: [],
        securityCheckConsent: '',
        yearsOfExperience: '',
        swedishTechIndustry: '',
        strategicPlansExperience: '',
        resume: null,
        additionalFiles: [],
        coverLetter: '',
        privacyPolicyConsent: false,
        futureOpportunitiesConsent: false,
        linkedinUrl: '',
      })
    } catch (error: any) {
      setSubmitStatus('error')
      setErrorMessage(error.message || 'An error occurred while submitting your application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-blue-400 text-xl font-manrope-semibold text-center leading-4 mb-[37px]">
          Technology • Stockholm Office, Sweden • Full-Time (Hybrid)
        </p>
        <h2 className="text-white font-manrope-medium text-7xl leading-[60px] mb-[20px] text-center">{jobTitle}</h2>
        <p className="text-white text-2xl leading-8 text-center font-manrope-medium">
          Ready to be part of shaping the future of cybersecurity? Join a team of experts in a forward-thinking company, tackling one of the most critical challenges in today&apos;s IT landscape. Welcome to NCG
        </p>
      </div>

      {/* Application Questions */}
      <form onSubmit={handleSubmit} className="space-y-8 mt-[115px] pb-[208px]">
        <div>
          <div className="space-y-6">
            {/* Location */}
            <div className="mb-[75px] flex gap-4">
              <span className="text-white font-manrope-medium text-2xl leading-8 flex-shrink-0">1.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-2xl leading-8 mb-[20px]">
                  In which country and city do you live?*
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Type your answer"
                  className="w-96 h-12 bg-white rounded-[5px] border-2  pl-[18px] pr-[18px] text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
                />
              </div>
            </div>

            {/* Language Skills */}
            <div className="mb-[85px] flex gap-4">
              <span className="text-white font-manrope-medium text-2xl leading-8 flex-shrink-0">2.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-2xl leading-8 mb-[5px]">
                  What language skills do you possess?*
                </label>
                <p className="text-white font-manrope-normal text-lg leading-6 mb-[20px]">
                  We are an international company with a Nordic focus, and mastering multiple languages is valued.
                </p>
                <div className="space-y-2 flex gap-[30px]">
                  {['swedish', 'english', 'finnish', 'danish', 'other'].map((lang) => (
                    <div key={lang} className='w-36 h-12 flex items-center justify-start bg-white rounded-[5px] border-2'>
                      <CustomCheckbox
                        checked={formData.languageSkills.includes(lang)}
                        onChange={(checked) => handleCheckboxChange('languageSkills', lang, checked)}
                        label={lang.charAt(0).toUpperCase() + lang.slice(1)}
                        className="w-full items-center"
                        labelClassName="capitalize text-lg font-manrope-normal text-zinc-950 leading-7"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Check */}
            <div className="mb-[70px] flex gap-4">
              <span className="text-white font-manrope-medium text-2xl leading-8 flex-shrink-0">3.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-2xl leading-8 mb-[5px]">
                  Do you allow us to carry out a security check?*
                </label>
                <p className="text-white font-manrope-normal text-lg leading-6 mb-[20px]">
                  Before employment, we need you to provide an extract from your criminal record or accept that we carry out a security check. This is a requirement for employment with NCG.
                </p>
                <div className="flex gap-[30px]">
                  <CustomRadio
                    name="securityCheckConsent"
                    value="yes"
                    checked={formData.securityCheckConsent === 'yes'}
                    onChange={(value) => handleRadioChange('securityCheckConsent', value)}
                    label="Yes"
                    required
                  />
                  <CustomRadio
                    name="securityCheckConsent"
                    value="no"
                    checked={formData.securityCheckConsent === 'no'}
                    onChange={(value) => handleRadioChange('securityCheckConsent', value)}
                    label="No"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Years of Experience */}
            <div className="mb-[85px] flex gap-4">
              <span className="text-white font-manrope-medium text-2xl leading-8 flex-shrink-0">4.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-2xl leading-8 mb-[20px]">
                  How many years of experience do you have in sales, particularly in Cyber Security?*
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  required
                  placeholder="Type your answer"
                  className="w-96 h-12 bg-white rounded-[5px] border-2  pl-[18px] pr-[18px] text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
                />
              </div>
            </div>

            {/* Swedish Tech Industry */}
            <div className="mb-[85px] flex gap-4" id="swedish-tech-industry">
              <span className="text-white font-manrope-medium text-2xl leading-8 flex-shrink-0">5.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-2xl leading-8 mb-[20px]">
                  Have you previously worked within the Swedish tech industry or with Swedish tech clients?*
                </label>
                <div className="flex gap-[30px]">
                  <CustomRadio
                    name="swedishTechIndustry"
                    value="yes"
                    checked={formData.swedishTechIndustry === 'yes'}
                    onChange={(value) => handleRadioChange('swedishTechIndustry', value)}
                    label="Yes"
                    required
                  />
                  <CustomRadio
                    name="swedishTechIndustry"
                    value="no"
                    checked={formData.swedishTechIndustry === 'no'}
                    onChange={(value) => handleRadioChange('swedishTechIndustry', value)}
                    label="No"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Strategic Plans Experience */}
            <div className="flex gap-4">
              <span className="text-white font-manrope-medium text-2xl leading-8 flex-shrink-0">6.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-2xl leading-8 mb-[20px]">
                  Do you have experience collaborating with a tech team to develop strategic Cyber Security plans?*
                </label>
                <div className="flex gap-[30px]">
                  <CustomRadio
                    name="strategicPlansExperience"
                    value="yes"
                    checked={formData.strategicPlansExperience === 'yes'}
                    onChange={(value) => handleRadioChange('strategicPlansExperience', value)}
                    label="Yes"
                    required
                  />
                  <CustomRadio
                    name="strategicPlansExperience"
                    value="no"
                    checked={formData.strategicPlansExperience === 'no'}
                    onChange={(value) => handleRadioChange('strategicPlansExperience', value)}
                    label="No"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="pt-[110px]">
          <div className="flex items-center justify-center gap-4 mb-[36px]">
            <div className="h-[1px] bg-[#5799FF] flex-1 max-w-[200px]"></div>
            <h3 className="text-white font-manrope-semibold leading-[60px] text-5xl whitespace-nowrap">Personal Information</h3>
            <div className="h-[1px] bg-[#5799FF] flex-1 max-w-[200px]"></div>
          </div>

          {/* LinkedIn Button */}
          <div className="w-full h-40 bg-white rounded-[10px] flex items-center justify-center mb-[66px]" id="linkedin-button">
            <button
              type="button"
              onClick={handleLinkedInAuth}
              disabled={isLinkedInLoading}
              className="w-80 h-14 bg-sky-600 rounded-[5px] cursor-pointer text-2xl disabled:bg-gray-500 text-white font-manrope-semibold leading-6 transition-colors flex items-center justify-center gap-2"
            >
              {isLinkedInLoading ? (
                <div className="text-xl flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting to LinkedIn...
                </div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Apply With LinkedIn
                </>
              )}
            </button>
          </div>
          <div className="grid md:grid-cols-2  gap-x-[42px] mb-[50px]">
            <div>
              <label className="block text-white font-manrope-medium mb-2 text-2xl leading-8">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Jonathan"
                className="w-full h-12 bg-white rounded-[5px] border-2  pl-[18px] pr-[18px] text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
              />
            </div>
            <div>
              <label className="block text-white font-manrope-medium mb-2 text-2xl leading-8">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Doe"
                className="w-full h-12 bg-white rounded-[5px] border-2  pl-[18px] pr-[18px] text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-[42px] mb-[50px]">
            <div>
              <label className="block text-white font-manrope-medium mb-2 text-2xl leading-8">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Jonathan@example.com"
                className="w-full h-12 bg-white rounded-[5px] border-2  pl-[18px] pr-[18px] text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
              />
            </div>
            <div>
              <label className="block text-white font-manrope-medium mb-2 text-2xl leading-8">
                Phone Number
              </label>
              <CountryCodeSelector
                value={formData.countryCode}
                phoneValue={formData.phone}
                onChange={(countryCode) => setFormData(prev => ({ ...prev, countryCode, phone: '' }))}
                onPhoneChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="mb-[50px]">
            <label className="block text-white font-manrope-medium mb-[20px] text-2xl leading-8 ">
              Upload Resume*
            </label>
            <div className="w-full bg-white rounded-[5px]  p-[14px] text-center">
              <div className="w-full bg-white rounded-[5px] border-2 border-dashed border-gray-300 p-8 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  required
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <p className="text-2xl font-manrope-medium text-zinc-950">
                    Drop your file or{' '}
                    <span className="underline">Upload</span>
                  </p>
                </label>
                {formData.resume && (
                  <p className="text-zinc-950 mt-2 text-sm">{formData.resume.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Files */}
          <div className="mb-[50px]">
            <label className="block text-white font-manrope-medium mb-[20px] text-2xl leading-8">
              Additional Files
            </label>
            <div className="w-full bg-white rounded-[5px]  p-[14px] text-center">
              <div className="w-full bg-white rounded-[5px] border-2 border-dashed border-gray-300 p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'additionalFiles')}
                  className="hidden"
                  id="additional-files-upload"
                />
                <label htmlFor="additional-files-upload" className="cursor-pointer">
                  <p className="text-2xl font-manrope-medium text-zinc-950">
                    Drop your file or{' '}
                    <span className="underline">Upload</span>
                  </p>
                </label>
                {formData.additionalFiles.length > 0 && (
                  <div className="text-zinc-950 mt-2 text-lg font-manrope-normal">
                    {formData.additionalFiles.map((file, index) => (
                      <p key={index}>{file.name}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-[84px]">
            <label className="block text-white font-manrope-medium mb-[20px] text-2xl leading-8">
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={6}
              placeholder="Write your message here..."
              className="w-full resize-none px-4 py-3 h-72 bg-white rounded-[5px] border-2 text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
            />
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4">
          <CustomCheckbox
            checked={formData.privacyPolicyConsent}
            onChange={(checked) => setFormData(prev => ({ ...prev, privacyPolicyConsent: checked }))}
            name="privacyPolicyConsent"
            required
            labelClassName="text-base font-manrope-medium leading-5"
            className="flex items-start text-white"
          >
            <span className="text-base font-manrope-medium leading-5">
              By submitting this application, I agree that I have read the{' '}
              <Link href="/privacy-policy" className="text-[#5799FF] font-manrope-bold">
                Privacy Policy
              </Link>{' '}
              and confirm that NCG store my personal details to be able to process my job application.*
            </span>
          </CustomCheckbox>

          <CustomCheckbox
            checked={formData.futureOpportunitiesConsent}
            onChange={(checked) => setFormData(prev => ({ ...prev, futureOpportunitiesConsent: checked }))}
            name="futureOpportunitiesConsent"
            labelClassName="text-base font-manrope-medium leading-5 mb-[50px]"
            className="flex items-start text-white"
          >
            <span className="text-base font-manrope-medium leading-5 mb-[50px]">
              Yes, NCG can contact me directly about specific future job opportunities.
            </span>
          </CustomCheckbox>
        </div>
        <AnimatedButton
          text="Submit Application"
          bgColor="#488BF3"
          hoverBgColor="#3a7be0"
          textColor="#fff"
          hoverTextColor="#fff"
          className="w-full rounded-[5px]"
          centered={true}
        />
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            Your application has been submitted successfully!
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  )
}

export default JobApplicationForm

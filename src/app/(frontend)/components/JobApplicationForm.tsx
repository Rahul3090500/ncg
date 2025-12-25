'use client'

import React, { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import SubmitButton from './JobApplicationForm/components/SubmitButton'
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'location':
        if (!value || !value.trim()) return 'Location is required'
        return ''
      case 'languageSkills':
        if (!value || value.length === 0) return 'Please select at least one language skill'
        return ''
      case 'securityCheckConsent':
        if (!value) return 'Please select an option'
        return ''
      case 'yearsOfExperience':
        if (!value || !value.trim()) return 'Years of experience is required'
        const yearsNum = Number(value)
        if (isNaN(yearsNum) || yearsNum < 0 || !Number.isInteger(yearsNum)) return 'Please enter a valid whole number'
        return ''
      case 'swedishTechIndustry':
        if (!value) return 'Please select an option'
        return ''
      case 'strategicPlansExperience':
        if (!value) return 'Please select an option'
        return ''
      case 'firstName':
        if (!value || !value.trim()) return 'First name is required'
        return ''
      case 'lastName':
        if (!value || !value.trim()) return 'Last name is required'
        return ''
      case 'email':
        if (!value || !value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address'
        return ''
      case 'resume':
        if (!value) return 'Resume is required'
        return ''
      case 'privacyPolicyConsent':
        if (!value) return 'You must agree to the privacy policy'
        return ''
      default:
        return ''
    }
  }

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {}
    
    errors.location = validateField('location', formData.location)
    errors.languageSkills = validateField('languageSkills', formData.languageSkills)
    errors.securityCheckConsent = validateField('securityCheckConsent', formData.securityCheckConsent)
    errors.yearsOfExperience = validateField('yearsOfExperience', formData.yearsOfExperience)
    errors.swedishTechIndustry = validateField('swedishTechIndustry', formData.swedishTechIndustry)
    errors.strategicPlansExperience = validateField('strategicPlansExperience', formData.strategicPlansExperience)
    errors.firstName = validateField('firstName', formData.firstName)
    errors.lastName = validateField('lastName', formData.lastName)
    errors.email = validateField('email', formData.email)
    errors.resume = validateField('resume', formData.resume)
    errors.privacyPolicyConsent = validateField('privacyPolicyConsent', formData.privacyPolicyConsent)

    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key]
    })

    setValidationErrors(errors)
    return errors
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
      // Validate checkbox fields if touched
      if (touchedFields[name]) {
        const error = validateField(name, checked)
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          if (error) {
            newErrors[name] = error
          } else {
            delete newErrors[name]
          }
          return newErrors
        })
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      // Validate on change if field has been touched
      if (touchedFields[name]) {
        const error = validateField(name, value)
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          if (error) {
            newErrors[name] = error
          } else {
            delete newErrors[name]
          }
          return newErrors
        })
      }
    }
  }

  const handleBlur = (name: string, value: any) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[name] = error
      } else {
        delete newErrors[name]
      }
      return newErrors
    })
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Mark as touched and validate immediately
    setTouchedFields(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[name] = error
      } else {
        delete newErrors[name]
      }
      return newErrors
    })
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    if (name === 'languageSkills') {
      const updatedSkills = checked
        ? [...formData.languageSkills, value]
        : formData.languageSkills.filter(skill => skill !== value)
      setFormData(prev => ({
        ...prev,
        languageSkills: updatedSkills
      }))
      // Mark as touched and validate immediately
      setTouchedFields(prev => ({ ...prev, [name]: true }))
      const error = validateField(name, updatedSkills)
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        if (error) {
          newErrors[name] = error
        } else {
          delete newErrors[name]
        }
        return newErrors
      })
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'resume' | 'additionalFiles') => {
    const files = e.target.files
    if (!files) return

    if (field === 'resume' && files.length > 0) {
      setFormData(prev => ({ ...prev, resume: files[0] }))
      // Validate resume - always validate on file change
      const error = validateField('resume', files[0])
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        if (error) {
          newErrors['resume'] = error
        } else {
          delete newErrors['resume']
        }
        return newErrors
      })
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

    // Mark all fields as touched
    setTouchedFields({
      location: true,
      languageSkills: true,
      securityCheckConsent: true,
      yearsOfExperience: true,
      swedishTechIndustry: true,
      strategicPlansExperience: true,
      firstName: true,
      lastName: true,
      email: true,
      resume: true,
      privacyPolicyConsent: true,
    })

    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false)
      // Scroll to first error after state update
      setTimeout(() => {
        const firstErrorField = Object.keys(errors)[0]
        // Try to find the error message element first, then fall back to input element
        const errorMessageElement = document.getElementById(`${firstErrorField}-error`)
        const inputElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
        const elementToScroll = errorMessageElement || inputElement
        if (elementToScroll) {
          elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Focus the input if it exists and is focusable
          if (inputElement && (inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'SELECT')) {
            inputElement.focus()
          }
        }
      }, 100)
      return
    }

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
      // Ensure jobId is converted to number
      const jobOpeningId = typeof jobId === 'string' ? parseInt(jobId, 10) : Number(jobId)
      
      if (!jobOpeningId || isNaN(jobOpeningId)) {
        setErrorMessage('Invalid job opening ID')
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobOpening: jobOpeningId,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone ? `${formData.countryCode} ${formData.phone}` : '',
          location: formData.location.trim(),
          languageSkills: formData.languageSkills,
          securityCheckConsent: formData.securityCheckConsent,
          yearsOfExperience: formData.yearsOfExperience,
          swedishTechIndustry: formData.swedishTechIndustry,
          strategicPlansExperience: formData.strategicPlansExperience,
          resume: resumeId,
          additionalFiles: additionalFileIds,
          coverLetter: formData.coverLetter.trim(),
          privacyPolicyConsent: formData.privacyPolicyConsent,
          futureOpportunitiesConsent: formData.futureOpportunitiesConsent,
          linkedinUrl: formData.linkedinUrl?.trim() || '',
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to submit application'
        try {
        const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Error ${response.status}: ${response.statusText || 'Failed to submit application'}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Application submitted successfully:', result)

      setSubmitStatus('success')
      
      // Scroll to success message
      setTimeout(() => {
        const successElement = document.getElementById('success-message')
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      
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
      setValidationErrors({})
      setTouchedFields({})
    } catch (error: any) {
      setSubmitStatus('error')
      setErrorMessage(error.message || 'An error occurred while submitting your application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <p className="text-blue-400 text-sm sm:text-base md:text-lg lg:text-xl font-manrope-semibold text-center leading-4 mb-4 sm:mb-4 md:mb-[37px]">
          Technology • Stockholm Office, Sweden • Full-Time (Hybrid)
        </p>
        <h2 className="text-white font-manrope-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight sm:leading-[40px] md:leading-[50px] lg:leading-[60px] mb-2 sm:mb-2 md:mb-[20px] text-center">{jobTitle}</h2>
        <p className="text-white text-sm sm:text-sm md:text-xl lg:text-2xl leading-5 sm:leading-6 md:leading-8 text-center font-manrope-medium px-2 sm:px-0">
          Ready to be part of shaping the future of cybersecurity? Join a team of experts in a forward-thinking company, tackling one of the most critical challenges in today&apos;s IT landscape. Welcome to NCG
        </p>
      </div>

      {/* Application Questions */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-8 mt-8 sm:mt-12 md:mt-16 lg:mt-[115px] pb-12 sm:pb-16 md:pb-24 lg:pb-[208px]">
        <div>
          <div className="space-y-6">
            {/* Location */}
            <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[75px] flex flex-row gap-2 sm:gap-4">
              <span className="text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 flex-shrink-0">1.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 mb-4 sm:mb-5 md:mb-[20px]">
                  In which country and city do you live?*
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('location', formData.location)}
                  placeholder="Type your answer"
                  className="w-full sm:w-80 md:w-96 h-12 bg-white rounded-[5px] border-2 pl-[18px] pr-[18px] text-base sm:text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
                />
                {validationErrors.location && (
                  <p id="location-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.location}</p>
                )}
              </div>
            </div>

            {/* Language Skills */}
            <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[85px] flex flex-row gap-2 sm:gap-4">
              <span className="text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 flex-shrink-0">2.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 mb-2 sm:mb-[5px]">
                  What language skills do you possess?*
                </label>
                <p className="text-white font-manrope-normal text-base sm:text-lg leading-5 sm:leading-6 mb-4 sm:mb-5 md:mb-[20px]">
                  We are an international company with a Nordic focus, and mastering multiple languages is valued.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-[30px]">
                  {['swedish', 'english', 'finnish', 'danish', 'other'].map((lang) => (
                    <div key={lang} className='w-full sm:w-32 md:w-36 h-12 flex items-center justify-start bg-white rounded-[5px] border-2'>
                      <CustomCheckbox
                        checked={formData.languageSkills.includes(lang)}
                        onChange={(checked) => handleCheckboxChange('languageSkills', lang, checked)}
                        label={lang.charAt(0).toUpperCase() + lang.slice(1)}
                        className="w-full items-center pl-[17px]"
                        labelClassName="capitalize text-base sm:text-lg font-manrope-normal text-zinc-950 leading-6 sm:leading-7"
                      />
                    </div>
                  ))}
                </div>
                {validationErrors.languageSkills && (
                  <p id="languageSkills-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.languageSkills}</p>
                )}
              </div>
            </div>

            {/* Security Check */}
            <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[70px] flex flex-row gap-2 sm:gap-4">
              <span className="text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 flex-shrink-0">3.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 mb-2 sm:mb-[5px]">
                  Do you allow us to carry out a security check?*
                </label>
                <p className="text-white font-manrope-normal text-base sm:text-lg leading-5 sm:leading-6 mb-4 sm:mb-5 md:mb-[20px]">
                  Before employment, we need you to provide an extract from your criminal record or accept that we carry out a security check. This is a requirement for employment with NCG.
                </p>
                <div className="flex flex-row gap-3 sm:gap-4 md:gap-[30px]">
                  <CustomRadio
                    name="securityCheckConsent"
                    value="yes"
                    checked={formData.securityCheckConsent === 'yes'}
                    onChange={(value) => handleRadioChange('securityCheckConsent', value)}
                    label="Yes"
                  />
                  <CustomRadio
                    name="securityCheckConsent"
                    value="no"
                    checked={formData.securityCheckConsent === 'no'}
                    onChange={(value) => handleRadioChange('securityCheckConsent', value)}
                    label="No"
                  />
                </div>
                {validationErrors.securityCheckConsent && (
                  <p id="securityCheckConsent-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.securityCheckConsent}</p>
                )}
              </div>
            </div>

            {/* Years of Experience */}
            <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[85px] flex flex-row gap-2 sm:gap-4">
              <span className="text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 flex-shrink-0">4.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 mb-4 sm:mb-5 md:mb-[20px]">
                  How many years of experience do you have in sales, particularly in Cyber Security?*
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('yearsOfExperience', formData.yearsOfExperience)}
                  placeholder="Type your answer"
                  className="w-full sm:w-80 md:w-96 h-12 bg-white rounded-[5px] border-2 pl-[18px] pr-[18px] text-base sm:text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
                />
                {validationErrors.yearsOfExperience && (
                  <p id="yearsOfExperience-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.yearsOfExperience}</p>
                )}
              </div>
            </div>

            {/* Swedish Tech Industry */}
            <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[85px] flex flex-row gap-2 sm:gap-4" id="swedish-tech-industry">
              <span className="text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 flex-shrink-0">5.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 mb-4 sm:mb-5 md:mb-[20px]">
                  Have you previously worked within the Swedish tech industry or with Swedish tech clients?*
                </label>
                <div className="flex flex-row gap-3 sm:gap-4 md:gap-[30px]">
                  <CustomRadio
                    name="swedishTechIndustry"
                    value="yes"
                    checked={formData.swedishTechIndustry === 'yes'}
                    onChange={(value) => handleRadioChange('swedishTechIndustry', value)}
                    label="Yes"
                  />
                  <CustomRadio
                    name="swedishTechIndustry"
                    value="no"
                    checked={formData.swedishTechIndustry === 'no'}
                    onChange={(value) => handleRadioChange('swedishTechIndustry', value)}
                    label="No"
                  />
                </div>
                {validationErrors.swedishTechIndustry && (
                  <p id="swedishTechIndustry-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.swedishTechIndustry}</p>
                )}
              </div>
            </div>

            {/* Strategic Plans Experience */}
            <div className="flex flex-row gap-2 sm:gap-4">
              <span className="text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 flex-shrink-0">6.</span>
              <div className="flex-1">
                <label className="block text-white font-manrope-medium text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8 mb-4 sm:mb-5 md:mb-[20px]">
                  Do you have experience collaborating with a tech team to develop strategic Cyber Security plans?*
                </label>
                <div className="flex flex-row gap-3 sm:gap-4 md:gap-[30px]">
                  <CustomRadio
                    name="strategicPlansExperience"
                    value="yes"
                    checked={formData.strategicPlansExperience === 'yes'}
                    onChange={(value) => handleRadioChange('strategicPlansExperience', value)}
                    label="Yes"
                  />
                  <CustomRadio
                    name="strategicPlansExperience"
                    value="no"
                    checked={formData.strategicPlansExperience === 'no'}
                    onChange={(value) => handleRadioChange('strategicPlansExperience', value)}
                    label="No"
                  />
                </div>
                {validationErrors.strategicPlansExperience && (
                  <p id="strategicPlansExperience-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.strategicPlansExperience}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="pt-8 sm:pt-12 md:pt-16 lg:pt-[110px]">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-[36px]">
            <div className="h-[1px] bg-[#5799FF] flex-1 max-w-[50px] sm:max-w-[100px] md:max-w-[150px] lg:max-w-[200px]"></div>
            <h3 className="text-white font-manrope-semibold leading-tight sm:leading-[40px] md:leading-[50px] lg:leading-[60px] text-2xl sm:text-3xl md:text-4xl lg:text-5xl whitespace-nowrap px-2 sm:px-0">Personal Information</h3>
            <div className="h-[1px] bg-[#5799FF] flex-1 max-w-[50px] sm:max-w-[100px] md:max-w-[150px] lg:max-w-[200px]"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-[42px] gap-y-4 sm:gap-y-6 mb-6 sm:mb-8 md:mb-[50px]">
            <div>
              <label className="block text-white font-manrope-medium mb-2 text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={() => handleBlur('firstName', formData.firstName)}
                placeholder="Jonathan"
                className="w-full h-12 bg-white rounded-[5px] border-2 pl-[18px] pr-[18px] text-base sm:text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
              />
              {validationErrors.firstName && (
                <p id="firstName-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-white font-manrope-medium mb-2 text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={() => handleBlur('lastName', formData.lastName)}
                placeholder="Doe"
                className="w-full h-12 bg-white rounded-[5px] border-2 pl-[18px] pr-[18px] text-base sm:text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
              />
              {validationErrors.lastName && (
                <p id="lastName-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-[42px] gap-y-4 sm:gap-y-6 mb-6 sm:mb-8 md:mb-[50px]">
            <div>
              <label className="block text-white font-manrope-medium mb-2 text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email', formData.email)}
                placeholder="Jonathan@example.com"
                className="w-full h-12 bg-white rounded-[5px] border-2 pl-[18px] pr-[18px] text-base sm:text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
              />
              {validationErrors.email && (
                <p id="email-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-white font-manrope-medium mb-2 text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8">
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
          <div className="mb-6 sm:mb-8 md:mb-[50px]">
            <label className="block text-white font-manrope-medium mb-4 sm:mb-5 md:mb-[20px] text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8">
              Upload Resume*
            </label>
            <div className="w-full bg-white rounded-[5px] p-3 sm:p-[14px] text-center">
              <div className="w-full bg-white rounded-[5px] border-2 border-dashed border-gray-300 p-4 sm:p-6 md:p-8 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    handleFileChange(e, 'resume')
                    setTouchedFields(prev => ({ ...prev, resume: true }))
                  }}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-manrope-medium text-zinc-950">
                    Drop your file or{' '}
                    <span className="underline text-[#5799FF]">Upload</span>
                  </p>
                </label>
                {formData.resume && (
                  <p className="text-zinc-950 mt-2 text-xs sm:text-sm break-words px-2">{formData.resume.name}</p>
                )}
              </div>
            </div>
            {validationErrors.resume && (
              <p id="resume-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.resume}</p>
            )}
          </div>

          {/* Additional Files */}
          <div className="mb-6 sm:mb-8 md:mb-[50px]">
            <label className="block text-white font-manrope-medium mb-4 sm:mb-5 md:mb-[20px] text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8">
              Additional Files
            </label>
            <div className="w-full bg-white rounded-[5px] p-3 sm:p-[14px] text-center">
              <div className="w-full bg-white rounded-[5px] border-2 border-dashed border-gray-300 p-4 sm:p-6 md:p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'additionalFiles')}
                  className="hidden"
                  id="additional-files-upload"
                />
                <label htmlFor="additional-files-upload" className="cursor-pointer">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-manrope-medium text-zinc-950">
                    Drop your file or{' '}
                    <span className="underline text-[#5799FF]">Upload</span>
                  </p>
                </label>
                {formData.additionalFiles.length > 0 && (
                  <div className="text-zinc-950 mt-2 text-sm sm:text-base md:text-lg font-manrope-normal">
                    {formData.additionalFiles.map((file, index) => (
                      <p key={index} className="break-words px-2">{file.name}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[84px]">
            <label className="block text-white font-manrope-medium mb-4 sm:mb-5 md:mb-[20px] text-lg sm:text-xl md:text-2xl leading-6 sm:leading-7 md:leading-8">
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={6}
              placeholder="Write your message here..."
              className="w-full resize-none px-4 py-3 h-48 sm:h-60 md:h-72 bg-white rounded-[5px] border-2 text-base sm:text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
            />
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4">
          <div>
            <CustomCheckbox
              checked={formData.privacyPolicyConsent}
              onChange={(checked) => {
                setFormData(prev => ({ ...prev, privacyPolicyConsent: checked }))
                setTouchedFields(prev => ({ ...prev, privacyPolicyConsent: true }))
                const error = validateField('privacyPolicyConsent', checked)
                setValidationErrors(prev => {
                  const newErrors = { ...prev }
                  if (error) {
                    newErrors.privacyPolicyConsent = error
                  } else {
                    delete newErrors.privacyPolicyConsent
                  }
                  return newErrors
                })
              }}
              name="privacyPolicyConsent"
              labelClassName="text-sm sm:text-base font-manrope-medium leading-5"
              className="flex items-start text-white"
            >
              <span className="text-sm sm:text-base font-manrope-medium leading-5">
                By submitting this application, I agree that I have read the{' '}
                <Link href="/privacy-policy" className="text-[#5799FF] font-manrope-bold">
                  Privacy Policy
                </Link>{' '}
                and confirm that NCG store my personal details to be able to process my job application.*
              </span>
            </CustomCheckbox>
            {validationErrors.privacyPolicyConsent && (
              <p id="privacyPolicyConsent-error" className="text-red-400 text-xs sm:text-sm mt-1 font-manrope-normal">{validationErrors.privacyPolicyConsent}</p>
            )}
          </div>

          <CustomCheckbox
            checked={formData.futureOpportunitiesConsent}
            onChange={(checked) => setFormData(prev => ({ ...prev, futureOpportunitiesConsent: checked }))}
            name="futureOpportunitiesConsent"
            labelClassName="text-sm sm:text-base font-manrope-medium leading-5 mb-8 sm:mb-10 md:mb-[50px]"
            className="flex items-start text-white"
          >
            <span className="text-sm sm:text-base font-manrope-medium leading-5 mb-8 sm:mb-10 md:mb-[50px]">
              Yes, NCG can contact me directly about specific future job opportunities.
            </span>
          </CustomCheckbox>
        </div>
        <SubmitButton
          text={isSubmitting ? 'Submitting...' : 'Submit Application'}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          bgColor="#488BF3"
          hoverBgColor="#3a7be0"
          textColor="#fff"
          hoverTextColor="#fff"
          className="w-full rounded-[5px]"
        />
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div id="success-message" className="mt-4 p-4 sm:p-6 bg-green-500/20 border-2 border-green-500 rounded-lg animate-fade-in">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-green-400 font-manrope-semibold text-lg sm:text-xl mb-1">Application Submitted Successfully!</h3>
                <p className="text-green-300 text-sm sm:text-base">
                  Thank you for your interest in joining NCG. We have received your application and will review it shortly. You will receive a confirmation email shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div id="error-message" className="mt-4 p-4 sm:p-6 bg-red-500/20 border-2 border-red-500 rounded-lg animate-fade-in">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-400 font-manrope-semibold text-lg sm:text-xl mb-1">Submission Failed</h3>
                <p className="text-red-300 text-sm sm:text-base break-words">
                  {errorMessage || 'An error occurred while submitting your application. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default JobApplicationForm

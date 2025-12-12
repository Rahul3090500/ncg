'use client'

import React, { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react'
import Link from 'next/link'
import AnimatedButton from './AnimatedButton'

interface ContactFormProps {
  heading: string
  submitButtonText: string
  privacyText: string
}

interface FormData {
  fullName: string
  email: string
  company: string
  website: string
  message: string
}

interface FormErrors {
  fullName?: string
  email?: string
  company?: string
  website?: string
  message?: string
}

const ContactForm: React.FC<ContactFormProps> = ({ heading, submitButtonText, privacyText }) => {
  const formRef = useRef<HTMLFormElement>(null)
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    website: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Auto-hide success message after 10 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 10000) // 10 seconds

      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full Name is required
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }

    // Email is required and must be valid
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Company Name is required
    if (!formData.company.trim()) {
      newErrors.company = 'Company Name is required'
    }

    // Website is optional, but if provided, must be a valid URL
    if (formData.website.trim() && !/^https?:\/\/.+\..+/.test(formData.website.trim())) {
      newErrors.website = 'Please enter a valid website URL (e.g., https://example.com)'
    }

    // Message is optional (no validation needed)

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormErrors]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API endpoint
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success message
      setShowSuccess(true)

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        company: '',
        website: '',
        message: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Error submitting form:', error)
      // You can add error handling here if needed
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (formRef.current && !isSubmitting) {
      formRef.current.requestSubmit()
    }
  }

  return (
    <div className="px-0 md:px-6 relative">
      {/* Heading */}
      <h2 className="text-[#000F19] font-manrope-bold text-2xl md:text-4xl leading-[1.1em] mb-6 md:mb-9 text-center lg:text-left lg:w-[90%]">
        {heading}
      </h2>

      {/* Success Message */}
      {showSuccess ? (
        <div className="p-4 md:p-6 bg-[#488BF3] text-white rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-manrope-bold text-lg md:text-xl mb-1">Thank you for contacting us!</h3>
              <p className="font-manrope-medium text-sm md:text-base opacity-90">
                We've received your message and will get back to you soon.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 md:space-y-[43px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-[#060608] font-manrope-medium text-[16px] leading-[0.94em] mb-3"
            >
              Full Name*
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full py-3 px-3 border rounded-lg bg-white text-sm outline-none transition-colors ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white focus:border-[#488BF3]'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-red-500 text-xs font-manrope-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[#060608] font-manrope-medium text-base leading-[0.94em] mb-3"
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg bg-white text-sm outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white focus:border-[#488BF3]'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-xs font-manrope-medium">{errors.email}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="company"
              className="block text-[#060608] font-manrope-medium text-base leading-[0.94em] mb-3"
            >
              Company Name*
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg bg-white text-sm outline-none transition-colors ${
                errors.company
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white focus:border-[#488BF3]'
              }`}
            />
            {errors.company && (
              <p className="mt-1 text-red-500 text-xs font-manrope-medium">{errors.company}</p>
            )}
          </div>

          {/* Company Website - Optional */}
          <div>
            <label
              htmlFor="website"
              className="block text-[#060608] font-manrope-medium text-base leading-[0.94em] mb-3"
            >
              Company Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className={`w-full px-3 py-3 border rounded-lg bg-white text-sm outline-none transition-colors ${
                errors.website
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white focus:border-[#488BF3]'
              }`}
            />
            {errors.website && (
              <p className="mt-1 text-red-500 text-xs font-manrope-medium">{errors.website}</p>
            )}
          </div>
        </div>

        {/* Message - Optional */}
        <div className="col-span-1 md:col-span-2 relative">
          <label
            htmlFor="message"
            className="block text-[#060608] font-manrope-medium text-base leading-[0.94em] mb-3"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 h-32 md:h-48 resize-none py-3 border border-white placeholder:text-base md:placeholder:text-lg placeholder:font-manrope-light rounded-lg bg-white text-base md:text-lg outline-none focus:border-[#488BF3] transition-colors"
            placeholder="Let us know how we can help - whether it's a question, a project idea, or something else. The more details you share, the better we can assist you."
          ></textarea>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div onClick={handleButtonClick} className="w-full">
            <AnimatedButton
              text={isSubmitting ? 'Submitting...' : submitButtonText}
              bgColor={isSubmitting ? '#9bb5f5' : '#488BF3'}
              hoverBgColor="#fff"
              textColor="#fff"
              hoverTextColor="#488BF3"
              className="w-full rounded-[5px]"
              centered={true}
              asDiv={true}
            />
          </div>
          <div className="col-span-2 mt-3 text-xs">
            <p className="text-[#060608] font-manrope-medium text-xs leading-[1.6em]">
              {(() => {
                const t = privacyText || ''
                const target = 'Privacy Policy'
                const i = t.indexOf(target)
                if (i === -1) return t
                return (
                  <>
                    {t.slice(0, i)}
                    <Link href="/privacy-policy" className="text-[#488bf3] cursor-pointer font-manrope-bold hover:underline">
                      {target}
                    </Link>
                    {t.slice(i + target.length)}
                  </>
                )
              })()}
            </p>
          </div>
        </div>
      </form>
      )}
    </div>
  )
}

export default ContactForm


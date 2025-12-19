'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import TwoColumnLayout from './TwoColumnLayout'
import AnimatedButton from './AnimatedButton'

interface GetInTouchSectionProps {
  data?: {
    leftTitle?: string
    leftSubtitle?: string
    rightTitle?: string
    rightSubtitle?: string
    submitButtonText?: string
    privacyText?: string
  }
}

const GetInTouchSection = ({ data }: GetInTouchSectionProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    phoneNumber: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const defaultData = {
    leftTitle: "Let's Connect",
    leftSubtitle: "What can we do for you?",
    rightTitle: "Get In Touch",
    rightSubtitle: "Tell us what you need. We'll handle the rest.",
    submitButtonText: "Send Message",
    privacyText: "By clicking submit, you acknowledge our Privacy Policy and agree to receive email communication from us.",
  }

  const finalData = { ...defaultData, ...data }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    setIsSubmitted(true)
  }

  return (
    <TwoColumnLayout
      leftTitle={finalData.leftTitle}
      leftSubtitle={finalData.leftSubtitle}
      rightTitle={finalData.rightTitle}
      rightDescription={finalData.rightSubtitle}
      isSubmitted={isSubmitted}
      successTitle="Thank you for reaching out to us."
      successDescription="Your message has been successfully submitted. Our team will get back to you shortly. In the meantime, feel free to explore our services or latest insights."
      primaryButton="contact"
    >
      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6 w-full max-w-full lg:max-w-[670px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-[30px]">
          <div>
            <label
              htmlFor="fullName"
              className="block text-[#060608] text-sm lg:text-base leading-[1.2em] mb-2 lg:mb-3 font-manrope-medium"
            >
              Full Name*
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full py-4 px-4 border border-gray-200 rounded-lg bg-white text-sm text-[#060608] outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-[#060608] text-sm lg:text-base leading-[1.2em] mb-2 lg:mb-3 font-manrope-medium"
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-4 border border-gray-200 rounded-lg bg-white text-sm text-[#060608] outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="companyName"
              className="block text-[#060608] text-sm lg:text-base leading-[1.2em] mb-2 lg:mb-3 font-manrope-medium"
            >
              Company Name*
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-4 border border-gray-200 rounded-lg bg-white text-sm text-[#060608] outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-[#060608] text-sm lg:text-base leading-[1.2em] mb-2 lg:mb-3 font-manrope-medium"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg bg-white text-sm text-[#060608] outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-[#060608] text-sm lg:text-base leading-[1.2em] mb-2 lg:mb-3 font-manrope-medium"
          >
            Your Message*
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 min-h-[48px] resize-none border border-gray-200 placeholder:text-sm md:placeholder:text-base lg:placeholder:text-lg placeholder:text-gray-400 placeholder:font-manrope-light rounded-lg bg-white text-sm md:text-base lg:text-lg text-[#060608] outline-none transition-all"
            placeholder="Let us know how we can help - whether it's a question, a project idea, or something else. The more details you share, the better we can assist you."
          />
        </div>

        <div>
          <AnimatedButton
            text={finalData.submitButtonText}
            bgColor="#488BF3"
            hoverBgColor="#488BF3"
            textColor="#fff"
            hoverTextColor="#fff"
            className="w-full rounded-[5px]"
            centered={true}
          />
          <div className="mt-3">
            <p className="text-[#060608] text-xs font-manrope-medium leading-[1.6em]">
              {(() => {
                const t = finalData.privacyText || ''
                const target = 'Privacy Policy'
                const i = t.indexOf(target)
                if (i === -1) return t
                return (
                  <>
                    {t.slice(0, i)}
                    <Link href="/privacy-policy" className="text-[#488BF3] font-manrope-bold cursor-pointer">
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
    </TwoColumnLayout>
  )
}

export default GetInTouchSection

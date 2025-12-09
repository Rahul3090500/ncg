'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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

  if (isSubmitted) {
    return (
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Column - Blue Background */}
        <div className="w-full lg:w-1/2 bg-[#488BF3] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-16 py-20 md:py-24 lg:py-24">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-manrope-normal leading-tight md:leading-[50px] lg:leading-[65px] xl:leading-[85px]">
            {finalData.leftTitle}
          </h1>
          <p className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-manrope-normal leading-7 md:leading-8 lg:leading-9 xl:leading-10 mt-4 md:mt-5 lg:mt-[20px] mb-8 md:mb-10 lg:mb-[54px]">
            {finalData.leftSubtitle}
          </p>
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-[35px]">
            <Link
              href="/free-consultation"
              className="w-full h-12 md:h-14 lg:h-16 rounded-[10px] hover:bg-white hover:text-[#000F19] transition-colors duration-300 border-2 border-white text-center text-white text-base md:text-lg lg:text-xl font-manrope-medium flex items-center justify-center leading-6 md:leading-7 lg:leading-8"
            >
              Free Consultation
            </Link>
            <Link
              href="/contact"
              className="w-full h-12 md:h-14 lg:h-16 bg-white rounded-[10px] text-center flex justify-center items-center text-slate-950 text-base md:text-lg lg:text-xl font-manrope-medium leading-6 md:leading-7 lg:leading-8"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Right Column - Success Message */}
        <div className="w-full lg:w-2/3 bg-[#e6f5ff] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-[133px] py-12 md:py-16 lg:py-24">
          <h1 className="text-slate-950 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-manrope-normal leading-tight md:leading-[40px] lg:leading-[50px] xl:leading-[65px]">
            Thank you for reaching out to us.
          </h1>
          <p className="text-slate-950 text-base md:text-lg lg:text-xl font-manrope-normal leading-6 md:leading-7 lg:leading-8 mt-4 md:mt-5 lg:mt-[16px] mb-8 md:mb-10 lg:mb-[54px]">
            Your message has been successfully submitted. Our team will get back to you shortly. In the meantime, feel free to explore our services or latest insights.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Blue Background */}
      <div className="w-full lg:w-1/2 bg-[#488BF3] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-16 py-20 md:py-24 lg:py-24">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-manrope-normal leading-tight md:leading-[50px] lg:leading-[65px] xl:leading-[85px]">
          {finalData.leftTitle}
        </h1>
        <p className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-manrope-normal leading-7 md:leading-8 lg:leading-9 xl:leading-10 mt-4 md:mt-5 lg:mt-[20px] mb-8 md:mb-10 lg:mb-[54px]">
          {finalData.leftSubtitle}
        </p>
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-[35px]">
          <Link
            href="/free-consultation"
            className="w-full h-12 md:h-14 lg:h-16 rounded-[10px] hover:bg-white hover:text-[#000F19] transition-colors duration-300 border-2 border-white text-center text-white text-base md:text-lg lg:text-xl font-manrope-medium flex items-center justify-center leading-6 md:leading-7 lg:leading-8"
          >
            Free Consultation
          </Link>
          <Link
            href="/contact"
            className="w-full h-12 md:h-14 lg:h-16 bg-white rounded-[10px] text-center flex justify-center items-center text-slate-950 text-base md:text-lg lg:text-xl font-manrope-medium leading-6 md:leading-7 lg:leading-8"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Right Column - Contact Form */}
      <div className="w-full lg:w-2/3 bg-[#e6f5ff] pt-8 md:pt-10 lg:pt-[43px] flex flex-col justify-center px-4 md:px-6 lg:px-12 xl:px-[133px] pb-8 md:pb-12 lg:pb-0">
        <h2 className="w-full max-w-full lg:max-w-[670px] text-slate-950 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-manrope-normal leading-tight md:leading-[40px] lg:leading-[50px] xl:leading-[65px]">
          {finalData.rightTitle}
        </h2>
        <p className="w-full max-w-full lg:max-w-[670px] text-zinc-950 text-base md:text-lg lg:text-xl xl:text-2xl font-manrope-medium mt-2 md:mt-3 lg:mt-[4px] mb-6 md:mb-8 lg:mb-[67px] leading-6 md:leading-7 lg:leading-8">
          {finalData.rightSubtitle}
        </p>

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
                className="w-full py-4 px-4 border border-gray-200 rounded-lg bg-white text-sm text-[#060608] outline-none  transition-all"
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
                className="w-full px-4 py-4 border border-gray-200 rounded-lg bg-white text-sm text-[#060608] outline-none  transition-all"
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
                className="w-full px-4 py-4 border border-gray-200 rounded-lg bg-white text-sm text-[#060608] outline-none  transition-all"
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
                className="w-full px-4 py-4 border border-gray-200 rounded-lg bg-white text-sm text-[#060608] outline-none  transition-all"
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
              className="w-full px-4 py-3 min-h-[48px] resize-none border border-gray-200 placeholder:text-sm md:placeholder:text-base lg:placeholder:text-lg placeholder:text-gray-400 placeholder:font-manrope-light rounded-lg bg-white text-sm md:text-base lg:text-lg text-[#060608] outline-none  transition-all"
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
                      <Link href="/privacy-policy" className="text-[#488bf3] font-manrope-bold cursor-pointer">
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
      </div>
    </section>
  )
}

export default GetInTouchSection


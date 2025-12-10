'use client'
import React from 'react'
import Marquee from 'react-fast-marquee'

interface TrustedBySectionProps {
  data: {
    overline: string
    heading: string
    description: string
    clients: Array<{
      name: string
      logo: {
        url: string
      }
    }>
  }
}

const TrustedBySection = ({ data }: TrustedBySectionProps) => {
  const defaultClients = [
    { name: 'Vattenfall', logo: { url: '/home-images/our-clients/vattenfall.png' } },
    { name: 'Mashable', logo: { url: '/home-images/our-clients/mashable.png' } },
    { name: 'Klarna', logo: { url: '/home-images/our-clients/klarna.png' } },
    { name: 'Bloomreach', logo: { url: '/home-images/our-clients/bloomreach.png' } },
  ]

  const clients = data.clients && data.clients.length > 0 ? data.clients : defaultClients

  return (
    <section className="pt-12 md:pt-16 lg:pt-[78px] bg-white">
      <div className="w-full containersection px-4 md:px-6">
        <div className="text-center">
          <h3 className="text-[#000f19] text-sm md:text-base lg:text-[19px] font-manrope-bold uppercase leading-tight md:leading-[19px] tracking-[2px] md:tracking-[3.80px] mb-2 md:mb-3 lg:mb-[12px]">
            {data.overline}
          </h3>
          <h2 className="text-[#000f19] text-2xl md:text-4xl lg:text-[50px] font-manrope-bold capitalize leading-tight md:leading-[48px] lg:leading-[60px] mb-2 md:mb-1">
            {data.heading}
          </h2>
          <p className="text-[#000f19] text-base md:text-lg lg:text-[21px] font-manrope-medium leading-relaxed md:leading-[26px] lg:leading-[29px] px-2 md:px-0">
            {data.description}
          </p>
          <div className="mt-6 md:mt-8 lg:mt-10 relative overflow-hidden">
            <div className="border-t-[1.50px] border-[#000f19]"/>
            {/* Left gradient overlay */}
            <div className="absolute left-0 -top-1 w-24 md:w-48 lg:w-[347px] h-16 md:h-20 lg:h-[100px] bg-gradient-to-r from-white to-white/0 pointer-events-none z-10"></div>

            {/* Right gradient overlay */}
            <div className="absolute right-0 -top-1 w-24 md:w-48 lg:w-[347px] h-16 md:h-20 lg:h-[100px] bg-gradient-to-l from-white to-white/0 pointer-events-none z-10"></div>

            {/* Marquee container */}
            <div className="my-6 md:my-8 lg:my-9">
              <Marquee direction="left" speed={50} gradient={false} pauseOnHover={false}>
                {clients.map((client, index) => (
                  <div key={index} className="flex items-center justify-center mx-8 md:mx-12 lg:mx-16">
                    <img
                      src={client.logo.url}
                      alt={client.name}
                      className="max-h-10 md:max-h-12 lg:max-h-14 object-contain transition-all duration-300"
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustedBySection
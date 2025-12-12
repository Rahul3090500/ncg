import React from 'react'

interface TestimonialCardProps {
  name: string
  position: string
  company: string
  image: string
  quote: string
  overline?: string
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  position,
  company,
  image,
  quote,
  overline
}) => {
  return (
    <div className="min-h-[497px] md:h-auto lg:h-[497px] flex flex-col lg:flex-row transition-opacity duration-300 ease-in-out">
      {/* Left Column - Heading (Desktop only) */}

      {/* Right Column - Testimonial Content */}
      <div className="flex-1 flex flex-col">
      {overline && (
        <div className="hidden lg:block lg:w-auto flex-shrink-0 mb-6">
          <h3 className="text-[#000f19] text-base md:text-lg lg:text-[19px] font-manrope-semibold mt-1 uppercase leading-[17px] tracking-widest text-center lg:text-left">
            {overline}
          </h3>
        </div>
      )}
        {/* Image and Name/Title Section - Vertical on tablet, side by side on desktop */}
        <div className="flex flex-col md:flex-col lg:flex-row items-center md:items-center lg:items-end mb-6 md:mb-8 lg:mb-10">
          <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gray-200 rounded-[20px] flex items-center justify-center mb-4 md:mb-4 lg:mb-0 flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover rounded-[20px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-[20px] flex items-center justify-center">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className='text-center md:text-center lg:text-left lg:ml-7'>
            <h4 className="text-[#000f19] text-2xl md:text-3xl font-manrope-semibold leading-tight md:leading-[30px] mb-2">
              {name}
            </h4>
            <p className="text-[#000f19] text-lg md:text-xl font-manrope-bold leading-tight md:leading-[26px]">
              {position}, {company}
            </p>
          </div>
        </div>
        {/* Quote Section - Centered on mobile/tablet, left-aligned on laptop/desktop */}
        <div className="text-[#000f19] text-xl md:text-2xl lg:text-3xl w-full font-manrope-light leading-7 md:leading-8 lg:leading-10 mb-8 text-center md:text-center lg:text-left xl:text-left md:px-8 lg:px-0">
          &quot;{quote}&quot;
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
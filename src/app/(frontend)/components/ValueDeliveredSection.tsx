'use client'

import dynamic from 'next/dynamic'

const ValueDeliveredSwiper = dynamic(() => import('./ValueDeliveredSwiper'), {
  ssr: false,
})

interface ValueCard {
  image?: {
    url: string
  }
  number?: string
  title: string
  description: string
}

interface ValueDeliveredSectionProps {
  valueCards: ValueCard[]
  title?: string
}

const ValueDeliveredSection: React.FC<ValueDeliveredSectionProps> = ({
  valueCards,
  title = 'Value Delivered',
}) => {
  return (
    <section className="pt-8 md:pt-12 lg:pt-[60px] bg-white">
      <div className="containersection ">
        <h2 className="text-[#000F19] font-manrope-semibold text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-[40px] lg:leading-[50px] text-center mb-6 md:mb-8 lg:mb-[40px]">
          {title}
        </h2>

        {/* Mobile and Tablet: Swiper */}
        <div className="lg:hidden">
          <ValueDeliveredSwiper valueCards={valueCards} />
        </div>

        {/* Desktop: Grid - Show only 3 cards */}
        <div className="hidden lg:grid lg:grid-cols-3 mt-[55px] gap-0">
          {valueCards.slice(0, 3).map((card, index) => (
            <div key={index} className="w-full">
              <div className="w-full h-96 bg-white border-[0.5px] border-[#DDE9F1] flex flex-col overflow-hidden group">
                {/* TOP IMAGE CONTAINER */}
                <div className="relative w-full overflow-hidden">
                  {card.image?.url ? (
                    <img
                      src={card.image.url}
                      alt={card.title}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className="w-full h-36 bg-gray-200" />
                  )}
                  <div className="absolute text-white font-manrope-normal text-[21px] top-16 leading-[23px] left-[29px]">
                    {card.number || String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1 flex flex-col px-8 pt-6 relative">
                  {/* TITLE */}
                  <h3 className="text-[#000F19] font-manrope-semibold text-xl leading-6 mb-3">
                    {card.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-[#000F19]/60 text-base font-manrope-light leading-5 mb-4">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValueDeliveredSection


import React from 'react';
import { getHomepageData, getServicesData } from '@/lib/payload';
import CaseStudiesGridSection from '../components/CaseStudiesGridSection';
import Link from 'next/link';

// Dynamic revalidate: instant updates in development, 1 hour in production
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600

// Helper function to generate URL-friendly slugs
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const Services = async () => {
  // Fetch services data
  const services = await getServicesData();

  // Fetch case studies grid data
  const homepageData = await getHomepageData();
  const caseStudiesGridSection = (homepageData as any)?.caseStudiesGridSection;
  const selected = Array.isArray(caseStudiesGridSection?.selectedCaseStudies)
    ? caseStudiesGridSection.selectedCaseStudies
    : [];
  const mappedSelected = selected.map((cs: any) => ({
    id: cs?.id,
    image: cs?.image?.url ? { url: cs.image.url } : undefined,
    category: cs?.category,
    iconType: cs?.iconType,
    iconAssetUrl: cs?.icon?.svg?.url,
    title: cs?.title,
    description: cs?.description,
    link: cs?.link,
  }));
  const caseStudiesGridData = {
    buttonText: caseStudiesGridSection?.buttonText || 'All Case Studies',
    buttonLink: caseStudiesGridSection?.buttonLink || '/case-studies',
    caseStudies: mappedSelected.slice(0, 3),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[912px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/2c635137081a2267e6ebfee54bd7a7d6302cff75.png')" }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F3A]/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[#182841]/30"></div>

        <div className="relative max-w-[1512px]  h-full">
          <div className="absolute top-[207px] left-[107px] w-[855px]">
            <p className="text-white font-manrope-bold text-[17px] tracking-[0.1em] uppercase leading-[30px] mb-[10px] mt-[70px]">
              Your Trusted Identity Security Partner
            </p>
            <h1 className="text-white font-manrope-semibold text-[70px] leading-[75px] uppercase mb-[37px]">
              Is Your Organizations&apos; Identity Security Ready for Tomorrow?
            </h1>
            <p className="text-white font-manrope-medium text-[21px] leading-[30px]">
              At NCG, we protect your digital identities with secure, scalable, and business-tailored solutions. Our expertise reinforces critical resources from advanced cyber risks, ensuring streamlined operations, regulatory compliance, and resilient processes. By leveraging our tools and strategies, we strengthen trust and long-term digital assurance. In this digital era, where attackers deploy sophisticated methods to steal sensitive data, protecting digital identities is no longer optional—it&apos;s essential for preventing financial losses, reputational damage, and identity fraud.
            </p>
          </div>
        </div>
      </section>




      {/* Our Identity Security Solutions */}
      <section className="py-[50px] bg-[#F4F7FF]">
        <div className="max-w-[1512px] mx-auto">
          <div className="text-center mb-[70px] px-[296px]">
            <h2 className="text-[#000F19] font-manrope-semibold text-[50px] leading-[70px] mb-[20px]">
              Our Identity Security Solutions
            </h2>
            <p className="text-[#000F19] font-manrope-normal text-[21px] leading-[30px]">
              NCG simplifies identity security by assessing, designing, and implementing IGA, PAM, and other identity security solutions that align with your business, reduce risk, control costs, and ensure only the right people have access.
            </p>
          </div>

          {/* Service Cards - Horizontal Scroll */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex -ml-px">
              {services.length > 0 ? (
                services.map((service: any, index: number) => {
                  const serviceSlug = service.slug || generateSlug(service.title);
                  return (
                    <Link
                      key={service.id || index}
                      href={`/services/${serviceSlug}`}
                      className="w-[505px] h-[542px] bg-white border-[1.5px] border-[#DDE9F1] -ml-px relative group hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                    >
                      {service.heroImage?.url ? (
                        <div
                          className="h-[137px] relative overflow-hidden bg-cover bg-center"
                          style={{ backgroundImage: `url('${service.heroImage.url}')` }}
                        >
                          <div className="absolute top-[57px] left-[32px]">
                            <span className="text-white font-manrope-medium text-[21px] leading-[23px]">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[137px] relative overflow-hidden bg-cover bg-center bg-gradient-to-r from-[#001D5C] to-[#5899FF]">
                          <div className="absolute top-[57px] left-[32px]">
                            <span className="text-white font-manrope-medium text-[21px] leading-[23px]">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="px-[32px] pt-[27px]">
                        <h3 className="text-[#000F19] font-manrope-bold text-[21px] leading-[23px] mb-[15px]">
                          {service.title}
                        </h3>
                        <p className="text-[#000F19]/60 font-manrope-medium text-[16px] leading-[22px]">
                          {service.description}
                        </p>
                      </div>
                      <div className="absolute bottom-[32px] left-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="bg-[#488BF3] text-white h-[49px] px-[38px] rounded-[5px] font-manrope-medium text-[17px] flex items-center gap-3">
                          Learn More
                          <svg width="6" height="13" viewBox="0 0 6 13" fill="none">
                            <path d="M1 1L5 6.5L1 12" stroke="white" strokeWidth="1.3" />
                          </svg>
                        </button>
                      </div>
                    </Link>
                  );
                })
              ) : (
                // Fallback to hardcoded services if no data from Payload
                <>
                  <div className="w-[505px] h-[542px] bg-white border-[1.5px] border-[#DDE9F1] -ml-px relative group hover:shadow-2xl transition-all duration-300">
                    <div className="h-[137px] relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/home-images/service-iga-74a521.png')" }}>
                      <div className="absolute top-[57px] left-[32px]">
                        <span className="text-white font-manrope-medium text-[21px] leading-[23px]">01</span>
                      </div>
                    </div>
                    <div className="px-[32px] pt-[27px]">
                      <h3 className="text-[#000F19] font-manrope-bold text-[21px] leading-[23px] mb-[15px]">
                        Identity Governance & Administration – IGA
                      </h3>
                      <p className="text-[#000F19]/60 font-manrope-medium text-[16px] leading-[22px]">
                        Our Identity Governance Administration (IGA) solutions serve as the bedrock of a resilient digital identity ecosystem.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ready to Strengthen */}
      <section className="h-[391px] bg-[#488BF3] flex items-center">
        <div className="max-w-[1512px] mx-auto px-[202px] w-full">
          <h2 className="text-white font-manrope-semibold text-[50px] leading-[90px] text-left mb-[20px] max-w-[1106px]">
            Ready to Strengthen Your Identity Security?
          </h2>
          <p className="text-white font-manrope-normal text-[24px] leading-[32px] text-left mb-[56px] max-w-[1108px]">
            Connect directly with one of our experts. We&apos;ll listen to your challenges, discuss your goals, and share tailored recommendations to help you build a stronger, more secure setup.
          </p>
          <button className="bg-white text-[#000F19] h-[49px] px-[38px] rounded-[5px] font-manrope-medium text-[17px] flex items-center gap-3 hover:shadow-lg transition-shadow duration-300">
            Contact Us
            <svg width="6" height="13" viewBox="0 0 6 13" fill="none">
              <path d="M1 1L5 6.5L1 12" stroke="#000F19" strokeWidth="1.3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Business Imperative Section */}

      <section className="pt-[100px] bg-white">
        <div className="max-w-[1512px] mx-auto">
          <div className="text-center mb-[83px] px-[234px]">
            <h2 className="text-[#000F19] font-manrope-semibold text-[40px] leading-[45px] mb-[12px] uppercase">
              Identity Security Isn&apos;t Just an IT Concern — It&apos;s a Business Imperative
            </h2>
            <p className="text-[#000F19] font-manrope-normal text-[19px] leading-[26px] max-w-[983px] mx-auto">
              Strong identity security protects more than systems — it protects your people, business continuity, compliance posture, and brand reputation. As attacks grow more sophisticated and regulations tighten, securing digital identities is now a boardroom priority, not just an IT task.
            </p>
          </div>
        </div>

        {/* Benefits Grid - Full Width */}
        <div className="grid grid-cols-4 gap-[10px] bg-[#000F19]">
          {/* Identity Visibility */}
          <div className="bg-white p-8">
            <div className="w-full h-[203px] bg-cover bg-center rounded-[7px] mb-6" style={{ backgroundImage: "url('/home-images/identity-visibility-24fa7b.png'), url('/home-images/case-study-1-442671.png')" }}></div>
            <h3 className="text-[#000F19] font-manrope-semibold text-[21px] leading-[19px] mb-4 uppercase">
              Identity Visibility
            </h3>
            <p className="text-[#000F19] font-manrope-normal text-[16px] leading-[22px]">
              Gain full clarity into who has access to what.
            </p>
          </div>

          {/* Reduce Attack Surface */}
          <div className="bg-white p-8">
            <div className="w-full h-[203px] bg-cover bg-center rounded-[7px] mb-6" style={{ backgroundImage: "url('/home-images/reduce-attack-surface-1f7cdd.png'), url('/home-images/case-study-2-3df659.png')" }}></div>
            <h3 className="text-[#000F19] font-manrope-semibold text-[21px] leading-[19px] mb-4 uppercase">
              Reduce Attack Surface
            </h3>
            <p className="text-[#000F19] font-manrope-normal text-[16px] leading-[22px]">
              Stop identity-based attacks before they spread.
            </p>
          </div>

          {/* Regulatory Alignment */}
          <div className="bg-white p-8">
            <div className="w-full h-[203px] bg-cover bg-center rounded-[7px] mb-6" style={{ backgroundImage: "url('/home-images/regulatory-alignment-41c3d9.png'), url('/home-images/case-study-3-1e9adb.png')" }}></div>
            <h3 className="text-[#000F19] font-manrope-semibold text-[21px] leading-[19px] mb-4 uppercase">
              Regulatory Alignment
            </h3>
            <p className="text-[#000F19] font-manrope-normal text-[16px] leading-[22px]">
              Meet the demands of GDPR, NIS2, DORA, and ISO 27001.
            </p>
          </div>

          {/* Executive Trust */}
          <div className="bg-white p-8">
            <div className="w-full h-[203px] bg-cover bg-center rounded-[7px] mb-6" style={{ backgroundImage: "url('/home-images/executive-trust-4f1c8d.png'), url('/home-images/team-member.png')" }}></div>
            <h3 className="text-[#000F19] font-manrope-semibold text-[21px] leading-[19px] mb-4 uppercase">
              Executive Trust
            </h3>
            <p className="text-[#000F19] font-manrope-normal text-[16px] leading-[22px]">
              Protect your brand, board, and customers.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="relative h-[664px] overflow-hidden">


        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/8669139b5ad96631528dce4a3734eddb4b03dc40.jpg')" }}></div>
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]"></div>

        <div className="relative max-w-[1512px] px-[79px] h-full flex flex-col justify-end">
          <div className="mb-[80px]">
            <p className="text-white font-manrope-bold text-[19px] leading-[17px] tracking-[0.2em] uppercase mb-[35px]">
              case studies
            </p>
            <h2 className="text-white font-manrope-semibold text-[100px] leading-[90px] uppercase">
              Identity Security In <span className="text-[#5799FF]">Action</span>
            </h2>
          </div>

          {/* Vertical lines */}
          <div className="absolute top-0 bottom-0 left-[41px] w-px bg-[rgba(0,0,0,0.2)]"></div>
          <div className="absolute top-0 bottom-0 left-[518px] w-px bg-[rgba(0,0,0,0.2)]"></div>
          <div className="absolute top-0 bottom-0 left-[995px] w-px bg-[rgba(0,0,0,0.2)]"></div>
        </div>
      </section>

      {/* Case Study Description */}
      <section className="bg-white py-[100px]">
        <div className="w-[100%] mx-auto px-[77px]">
          <div className="text-center px-[77px]">
            <p className="text-[#000F19] font-manrope-medium text-[21px] leading-[27px]">
              Discover how NCG has helped organizations protect digital identities, streamline access management, and build trust across their digital landscape. Our case studies highlight real-world challenges, tailored solutions, and measurable results—showing you what&apos;s possible when identity is secured the right way.
            </p>
          </div>
        </div>
      </section>

      {/* Case Study Cards */}
      <CaseStudiesGridSection data={caseStudiesGridData} showButton={false} />

      {/* Related Insights Section */}
      <section className="py-[100px] bg-[#000F19]">
        <div className="max-w-[1512px] mx-auto px-[79px]">
          <div className="flex justify-between items-center mb-[68px]">
            <h2 className="text-white font-manrope-medium text-[40px] leading-[40px]">
              Related Insights
            </h2>
            <button className="bg-[#5799FF] text-white h-[49px] px-6 rounded-[5px] font-manrope-medium text-[17px] flex items-center gap-3 hover:bg-[#4080D0] transition-colors duration-300">
              View All
              <svg width="6" height="13" viewBox="0 0 6 13" fill="none">
                <path d="M1 1L5 6.5L1 12" stroke="white" strokeWidth="1.3" />
              </svg>
            </button>
          </div>

          {/* Blog Cards */}
          <div className="grid grid-cols-4 -mx-[4.5px]">
            {/* Blog 1 */}
            <div className="bg-transparent overflow-hidden group hover:shadow-2xl transition-shadow duration-300 mx-[4.5px]">
              <div className="h-[276px] bg-cover bg-center" style={{ backgroundImage: "url('/home-images/blog-1-4158b7.png'), url('/home-images/case-study-1-442671.png')" }}></div>
              <div className="px-[12px] py-[25px]">
                <p className="text-white font-manrope-medium text-[12px] mb-3">23 June 2025</p>
                <h3 className="text-white font-manrope-medium text-[19px] leading-[25px] mb-3">
                  The rising cost of downtime: Why operational resilience is your best investment
                </h3>
                <p className="text-white font-manrope-normal text-[15px] leading-[21px]">
                  After a ransomware breach, MechaGlobal, a multinational manufacturer, partnered with us. Our rapid response contained the threat, restored systems in 24 hours, and reinforced long-term cyber resilience.
                </p>
              </div>
            </div>

            {/* Blog 2 */}
            <div className="bg-transparent overflow-hidden group hover:shadow-2xl transition-shadow duration-300 mx-[4.5px]">
              <div className="h-[275px] bg-cover bg-center" style={{ backgroundImage: "url('/home-images/blog-2-5ed131.png'), url('/home-images/case-study-2-3df659.png')" }}></div>
              <div className="px-[12px] py-[25px]">
                <p className="text-white font-manrope-medium text-[12px] mb-3">20 June 2025</p>
                <h3 className="text-white font-manrope-medium text-[19px] leading-[25px] mb-3">
                  Digital identity in 2025: What every business needs to know
                </h3>
                <p className="text-white font-manrope-normal text-[15px] leading-[21px]">
                  Explore the future of digital identity, zero trust frameworks, and how IAM (Identity & Access Management) can secure your organization in a hybrid work environment.
                </p>
              </div>
            </div>

            {/* Blog 3 */}
            <div className="bg-transparent overflow-hidden group hover:shadow-2xl transition-shadow duration-300 mx-[4.5px]">
              <div className="h-[275px] bg-cover bg-center" style={{ backgroundImage: "url('/home-images/blog-3-286aa7.png'), url('/home-images/case-study-3-1e9adb.png')" }}></div>
              <div className="px-[12px] py-[25px]">
                <p className="text-white font-manrope-medium text-[12px] mb-3">18 June 2025</p>
                <h3 className="text-white font-manrope-medium text-[19px] leading-[25px] mb-3">
                  From compliance to confidence: Building a culture of data privacy
                </h3>
                <p className="text-white font-manrope-normal text-[15px] leading-[21px]">
                  Discover how proactive privacy strategies—from GDPR compliance to data governance—can help businesses not only avoid penalties but strengthen customer trust and brand loyalty.
                </p>
              </div>
            </div>

            {/* Blog 4 */}
            <div className="bg-transparent overflow-hidden group hover:shadow-2xl transition-shadow duration-300 mx-[4.5px]">
              <div className="h-[275px] bg-cover bg-center" style={{ backgroundImage: "url('/home-images/blog-4-18ecb5.png'), url('/home-images/team-member.png')" }}></div>
              <div className="px-[12px] py-[25px]">
                <p className="text-white font-manrope-medium text-[12px] mb-3">16 June 2025</p>
                <h3 className="text-white font-manrope-medium text-[19px] leading-[25px] mb-3">
                  Why GRC isn&apos;t just for enterprises anymore
                </h3>
                <p className="text-white font-manrope-normal text-[15px] leading-[21px]">
                  Governance, Risk, and Compliance is no longer optional. Learn how SMBs and startups can integrate scalable GRC frameworks to stay secure and audit-ready from day one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-[130px] bg-[#E7F5FF]">
        <div className="max-w-[1512px] mx-auto px-[107px]">
          <div className="grid grid-cols-2 gap-[45px]">
            {/* Left - Expert Card */}
            <div className="relative h-[685px] w-[583px] rounded-[10px] overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/home-images/team-member.png')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>

              <div className="absolute bottom-10 left-10 right-10 text-white">
                <h3 className="text-white font-manrope-bold text-[30px] leading-[30px] mb-2 uppercase">
                  Shivam Mukhi
                </h3>
                <p className="text-white font-manrope-medium text-[21px] leading-[21px] mb-4 uppercase">
                  Identity Security Specialist
                </p>
                <div className="border-t border-white/20 pt-4 mt-4">
                  <p className="text-white font-manrope-normal text-[21px] leading-[21px]">
                    CISSP – Certified Information Systems Security Professional, Certified Information Security Manager,
                    Certified Identity and Access Manager, ISO/IEC 27001 Lead Implementer
                  </p>
                </div>
              </div>

              <div className="absolute top-10 right-10">
                <a href="#" className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center hover:bg-[#5799FF] transition-colors duration-300">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M5.91 5.56L12.09 11.74" stroke="#000" strokeWidth="1.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div>
              <h2 className="text-[#000F19] font-manrope-bold text-[40px] leading-[44px] mb-[32px] w-[70%]">
                Partner with NCG for cybersecurity excellence
              </h2>

              <form className="space-y-[30px]">
                <div className="grid grid-cols-2 gap-[30px]">
                  <div>
                    <label className="text-[#060608] font-manrope-medium text-[16px] mb-2 block">Full Name*</label>
                    <input type="text" className="w-full h-[50px] px-4 bg-white rounded-[10px] border-0 focus:ring-2 focus:ring-[#5799FF]" />
                  </div>
                  <div>
                    <label className="text-[#060608] font-manrope-medium text-[15px] mb-2 block">Email*</label>
                    <input type="email" className="w-full h-[50px] px-4 bg-white rounded-[10px] border-0 focus:ring-2 focus:ring-[#5799FF]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[30px]">
                  <div>
                    <label className="text-[#060608] font-manrope-medium text-[16px] mb-2 block">Company Name*</label>
                    <input type="text" className="w-full h-[50px] px-4 bg-white rounded-[10px] border-0 focus:ring-2 focus:ring-[#5799FF]" />
                  </div>
                  <div>
                    <label className="text-[#060608] font-manrope-medium text-[15px] mb-2 block">Company Website*</label>
                    <input type="url" className="w-full h-[50px] px-4 bg-white rounded-[10px] border-0 focus:ring-2 focus:ring-[#5799FF]" />
                  </div>
                </div>

                <div>
                  <label className="text-[#060608] font-manrope-medium text-[16px] mb-2 block">Your Message*</label>
                  <textarea rows={6} className="w-full px-4 py-3 bg-white rounded-[10px] border-0 focus:ring-2 focus:ring-[#5799FF]"
                    placeholder="Let us know how we can help — whether it's a question, a project idea, or something else. The more details you share, the better we can assist you."></textarea>
                </div>

                <p className="text-[#060608] font-manrope-medium text-[13px] leading-[23px]">
                  By clicking submit, you acknowledge our Privacy Policy and agree to receive email communication from us.
                </p>

                <button type="submit" className="w-full bg-[#488BF3] text-white h-[53px] rounded-[5px] font-manrope-medium text-[17px] flex items-center justify-center gap-3 hover:bg-[#3770D0] transition-colors duration-300">
                  Connect Today
                  <svg width="6" height="13" viewBox="0 0 6 13" fill="none">
                    <path d="M1 1L5 6.5L1 12" stroke="white" strokeWidth="1.3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

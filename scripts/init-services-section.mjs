import payload from 'payload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'
import configPayload from '../src/payload.config.ts'

// Load environment variables
config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') })

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET environment variable is not set')
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function initServicesSection() {
  try {
    // Initialize Payload
    await payload.init({
      config: configPayload,
      local: true,
    })

    console.log('🚀 Initializing Services Section...')

    // Check if ServicesSection global exists
    let servicesSection = await payload.findGlobal({ slug: 'services-section' }).catch(() => null)

    // Create a sample service if none exists
    const existingServices = await payload.find({
      collection: 'services',
      limit: 1,
    })

    let sampleService
    if (existingServices.docs.length === 0) {
      console.log('📝 Creating sample service...')
      sampleService = await payload.create({
        collection: 'services',
        data: {
          slug: 'identity-governance-administration',
          title: 'Identity Governance & Administration – IGA',
          description: 'Our Identity Governance Administration (IGA) solutions serve as the bedrock of a resilient digital identity ecosystem, ensuring that businesses can navigate the complexities of identity management with confidence and precision.',
          heroTitle: 'Is Your Organizations\' Identity Security Ready for Tomorrow?',
          heroSubtitle: 'At NCG, we protect your digital identities with secure, scalable, and business-tailored solutions.',
          introTitle: 'Our Identity Security Solutions',
          introDescription: 'NCG simplifies identity security by assessing, designing, and implementing IGA, PAM, and other identity security solutions that align with your business, reduce risk, control costs, and ensure only the right people have access.',
          ctaTitle: 'Ready to Strengthen Your Identity Security?',
          ctaDescription: 'Connect directly with one of our experts. We\'ll listen to your challenges, discuss your goals, and share tailored recommendations to help you build a stronger, more secure setup.',
        },
      })
      console.log(`✅ Created sample service: ${sampleService.title}`)
    } else {
      sampleService = existingServices.docs[0]
      console.log(`✅ Using existing service: ${sampleService.title}`)
    }

    // Create sample sub-services if none exist
    const existingSubServices = await payload.find({
      collection: 'sub-services',
      where: {
        service: {
          equals: typeof sampleService.id === 'number' ? sampleService.id : sampleService.id,
        },
      },
      limit: 5,
    })

    let subServices = existingSubServices.docs

    if (subServices.length === 0) {
      console.log('📝 Creating sample sub-services...')
      const subServicesData = [
        {
          slug: 'plan-development',
          title: 'Plan Development (Business Continuity And Disaster Recovery)',
          description: 'We help you prepare for the unexpected. Our team works with you to develop robust Business Continuity Plans (BCP) and Disaster Recovery Plans (DRP) tailored to your organization\'s needs.',
          service: typeof sampleService.id === 'number' ? sampleService.id : sampleService.id,
          order: 1,
        },
        {
          slug: 'exercising-testing',
          title: 'Exercising & Testing',
          description: 'A plan is only as strong as its execution. We offer certified, hands-on testing and simulation exercises to validate your readiness.',
          service: typeof sampleService.id === 'number' ? sampleService.id : sampleService.id,
          order: 2,
        },
        {
          slug: 'training',
          title: 'Training',
          description: 'People are at the heart of operational resilience. Our training programs—delivered by PECB-licensed instructors—range from basic awareness for all staff to advanced crisis management for leadership teams.',
          service: typeof sampleService.id === 'number' ? sampleService.id : sampleService.id,
          order: 3,
        },
      ]

      for (const subData of subServicesData) {
        const subService = await payload.create({
          collection: 'sub-services',
          data: subData,
        })
        subServices.push(subService)
        console.log(`✅ Created sub-service: ${subService.title}`)
      }
    } else {
      console.log(`✅ Using ${subServices.length} existing sub-services`)
    }

    // Initialize or update ServicesSection global
    const servicesSectionData = {
      sectionTitle: 'Our\nServices',
      services: [
        {
          service: typeof sampleService.id === 'number' ? sampleService.id : sampleService.id,
          subServices: subServices.slice(0, 3).map((sub: any) => 
            typeof sub.id === 'number' ? sub.id : sub.id
          ),
        },
      ],
    }

    if (!servicesSection) {
      console.log('📝 Creating Services Section global...')
      await payload.updateGlobal({
        slug: 'services-section',
        data: servicesSectionData,
      })
      console.log('✅ Created Services Section global')
    } else {
      console.log('📝 Updating Services Section global...')
      // Check if it already has services
      if (!servicesSection.services || servicesSection.services.length === 0) {
        await payload.updateGlobal({
          slug: 'services-section',
          data: {
            sectionTitle: servicesSection.sectionTitle || 'Our\nServices',
            services: servicesSectionData.services,
          },
        })
        console.log('✅ Updated Services Section global with sample data')
      } else {
        console.log('✅ Services Section global already has data')
      }
    }

    console.log('\n✅ Services Section initialization complete!')
    console.log('\n📋 Summary:')
    console.log(`   - Service: ${sampleService.title}`)
    console.log(`   - Sub-services: ${subServices.length}`)
    console.log(`   - Services Section: ${servicesSection ? 'Initialized' : 'Created'}`)
    console.log('\n🌐 You can now access: http://localhost:3000/admin/globals/services-section')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error initializing Services Section:', error)
    process.exit(1)
  }
}

initServicesSection()


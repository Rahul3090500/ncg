import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

// Load environment variables FIRST before any other imports
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '../.env')
config({ path: envPath })

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET environment variable is not set')
  console.error(`   Checked .env file at: ${envPath}`)
  console.error('   Please ensure PAYLOAD_SECRET is set in your .env file')
  process.exit(1)
}

// Helper function to generate slug from text
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function migrateServicesData() {
  try {
    // Dynamically import Payload and config after env vars are loaded
    const payload = (await import('payload')).default
    const configPayload = (await import('../src/payload.config.ts')).default

    // Initialize Payload
    await payload.init({
      config: configPayload,
      local: true,
    })

    console.log('🚀 Starting Services and Sub-Services data migration...')

    // Read existing services data
    const servicesData = JSON.parse(
      readFileSync(join(__dirname, '../src/data/services.json'), 'utf8')
    )

    const createdServices = []
    const createdSubServices = []

    // Process each service
    for (const serviceData of servicesData.services) {
      // Generate slug from title or use id
      const slug = generateSlug(serviceData.title || serviceData.id)

      // Check if service already exists
      const existingService = await payload.find({
        collection: 'services',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      })

      let service
      if (existingService.docs.length > 0) {
        service = existingService.docs[0]
        console.log(`⚠️  Service "${serviceData.title}" already exists, skipping creation`)
      } else {
        // Create service
        const servicePayload = {
          slug: slug,
          title: serviceData.title,
          description: serviceData.description,
          heroAlt: serviceData.heroAlt || '',
          heroTitle: serviceData.title,
          heroSubtitle: serviceData.description,
          introTitle: `Our ${serviceData.title} Solutions`,
          introDescription: serviceData.description,
          solutionsTitle: `Our ${serviceData.title} Solutions`,
          solutionsDescription: serviceData.description,
          ctaTitle: 'Ready to Strengthen Your Identity Security?',
          ctaDescription: 'Connect directly with one of our experts. We\'ll listen to your challenges, discuss your goals, and share tailored recommendations to help you build a stronger, more secure setup.',
        }

        // Try to find hero image if path exists
        if (serviceData.heroImage) {
          const imageResult = await payload.find({
            collection: 'media',
            where: {
              filename: {
                contains: serviceData.heroImage.split('/').pop().split('.')[0],
              },
            },
            limit: 1,
          })
          if (imageResult.docs.length > 0) {
            servicePayload.heroImage = imageResult.docs[0].id
          }
        }

        service = await payload.create({
          collection: 'services',
          data: servicePayload,
        })
        createdServices.push(service)
        console.log(`✅ Created service: ${service.title} (slug: ${slug})`)
      }

      // Process service cards as sub-services
      if (serviceData.serviceCards && Array.isArray(serviceData.serviceCards)) {
        for (let index = 0; index < serviceData.serviceCards.length; index++) {
          const card = serviceData.serviceCards[index]
          const subServiceSlug = generateSlug(card.title)

          // Check if sub-service already exists
          const existingSubService = await payload.find({
            collection: 'sub-services',
            where: {
              and: [
                {
                  slug: {
                    equals: subServiceSlug,
                  },
                },
                {
                  service: {
                    equals: typeof service.id === 'number' ? service.id : service.id,
                  },
                },
              ],
            },
            limit: 1,
          })

          if (existingSubService.docs.length > 0) {
            console.log(`⚠️  Sub-service "${card.title}" already exists, skipping creation`)
            continue
          }

          // Create sub-service
          const subServicePayload = {
            slug: subServiceSlug,
            service: typeof service.id === 'number' ? service.id : service.id,
            title: card.title,
            description: card.description,
            order: index + 1,
            heroTitle: card.title,
            heroSubtitle: card.description,
            introTitle: card.title,
            introDescription: card.description,
          }

          const subService = await payload.create({
            collection: 'sub-services',
            data: subServicePayload,
          })
          createdSubServices.push(subService)
          console.log(`   ✅ Created sub-service: ${card.title} (order: ${index + 1})`)
        }
      }
    }

    console.log('\n✅ Migration complete!')
    console.log('\n📊 Summary:')
    console.log(`   - Services created: ${createdServices.length}`)
    console.log(`   - Sub-services created: ${createdSubServices.length}`)
    console.log(`   - Total services in database: ${servicesData.services.length}`)
    
    if (createdServices.length > 0) {
      console.log('\n📋 Created Services:')
      createdServices.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.title} (slug: ${s.slug})`)
      })
    }

    if (createdSubServices.length > 0) {
      console.log('\n📋 Created Sub-Services:')
      createdSubServices.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.title} (slug: ${s.slug})`)
      })
    }

    console.log('\n💡 Next Steps:')
    console.log('   1. Go to http://localhost:3000/admin/collections/services to view services')
    console.log('   2. Go to http://localhost:3000/admin/collections/sub-services to view sub-services')
    console.log('   3. Go to http://localhost:3000/admin/globals/services-section to configure homepage display')
    console.log('   4. Run: node scripts/init-services-section.mjs to initialize the Services Section global')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error migrating services data:', error)
    process.exit(1)
  }
}

migrateServicesData()


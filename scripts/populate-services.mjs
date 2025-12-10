import payload from 'payload';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import configPayload from '../src/payload.config.ts';

// Load environment variables
config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET environment variable is not set');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read services data
const servicesData = JSON.parse(
  readFileSync(join(__dirname, '../src/data/services.json'), 'utf8')
);

async function populateServices() {
  try {
    // Initialize Payload
    await payload.init({
      config: configPayload,
      local: true,
    });

    console.log('🚀 Starting to populate services data...');

    // Transform services data to exclude heroImage for now (since it needs to be uploaded to media collection)
    const transformedServices = servicesData.services.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      heroAlt: service.heroAlt,
      serviceCards: service.serviceCards,
    }));

    // Check if homepage document exists
    const existingHomepage = await payload.find({
      collection: 'homepage',
      limit: 1,
    });

    let homepageId;
    
    if (existingHomepage.docs.length > 0) {
      // Update existing homepage
      homepageId = existingHomepage.docs[0].id;
      console.log('📝 Updating existing homepage document...');
      
      await payload.update({
        collection: 'homepage',
        id: homepageId,
        data: {
          servicesSection: {
            sectionTitle: 'Our Services',
            services: transformedServices,
          },
        },
      });
    } else {
      // Create new homepage document
      console.log('📄 Creating new homepage document...');
      
      const newHomepage = await payload.create({
        collection: 'homepage',
        data: {
          heroSection: {
            mainHeading: 'Your Trusted\nCybersecurity Partner',
            callToAction: {
              description: "You don't need another security provider sending you generic reports. You need cybersecurity experts who understand your business, give honest advice, and solve problems others can't even see.",
              ctaHeading: 'Get Free\nConsultation',
              ctaLink: '/contact',
              backgroundColor: '#001D5C'
            }
          },
          servicesSection: {
            sectionTitle: 'Our Services',
            services: transformedServices,
          },
        },
      });
      
      homepageId = newHomepage.id;
    }

    console.log('✅ Services data successfully added to Payload CMS!');
    console.log(`📊 Added ${servicesData.services.length} services:`);
    
    servicesData.services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.title} (${service.serviceCards.length} service cards)`);
    });

    console.log(`🆔 Homepage document ID: ${homepageId}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating services data:', error);
    process.exit(1);
  }
}

populateServices();
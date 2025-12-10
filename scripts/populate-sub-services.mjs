import payload from 'payload'
import { readFileSync } from 'fs'
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

console.log('✅ Environment variables loaded')
console.log('🚀 Script starting...')
process.stdout.write('Testing output...\n')

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Call the function and handle errors
populateSubServices().catch((error) => {
  console.error('❌ Unhandled error:', error)
  console.error(error.stack)
  process.exit(1)
})

async function populateSubServices() {
  try {
    console.log('🚀 Starting to populate sub-services data...')
    console.log('📦 Loading Payload configuration...')
    console.log(`📁 Config path: ${join(dirname(fileURLToPath(import.meta.url)), '../src/payload.config.ts')}`)
    
    // Initialize Payload
    const payloadInstance = await payload.init({
      config: configPayload,
      local: true,
    })

    console.log('✅ Payload initialized successfully')
    console.log('🔍 Searching for services...')

    // Find services by slug
    console.log('🔍 Looking for Digital Fraud & Fin Crime service...')
    const digitalFraudService = await payloadInstance.find({
      collection: 'services',
      where: {
        slug: {
          equals: 'digital-fraud-fin-crime',
        },
      },
      limit: 1,
    })

    console.log(`📊 Found ${digitalFraudService.docs.length} Digital Fraud service(s)`)

    const identitySecurityService = await payloadInstance.find({
      collection: 'services',
      where: {
        slug: {
          equals: 'identity-security',
        },
      },
      limit: 1,
    })

    console.log(`📊 Found ${identitySecurityService.docs.length} Identity Security service(s)`)

    const digitalComplianceService = await payloadInstance.find({
      collection: 'services',
      where: {
        slug: {
          equals: 'digital-compliance-cybersecurity',
        },
      },
      limit: 1,
    })

    console.log(`📊 Found ${digitalComplianceService.docs.length} Digital Compliance service(s)`)

    if (digitalFraudService.docs.length === 0) {
      console.error('❌ Digital Fraud & Fin Crime service not found')
      console.error('💡 Available services:')
      const allServices = await payloadInstance.find({
        collection: 'services',
        limit: 10,
      })
      allServices.docs.forEach((svc) => {
        console.error(`   - ${svc.title} (slug: ${svc.slug})`)
      })
      process.exit(1)
    }

    const digitalFraudServiceId = digitalFraudService.docs[0].id

    // Sub-service data for "Fraud/Financial Crime Risk Assessment"
    const fraudRiskAssessmentData = {
      service: digitalFraudServiceId,
      title: 'Fraud/Financial Crime Risk Assessment',
      description: 'This service involves evaluating an organization\'s susceptibility to fraud and financial crimes. It helps identify key risks, assess their potential impact, and determine the effectiveness of existing controls.',
      slug: 'fraud-financial-crime-risk-assessment',
      order: 1,
      heroTitle: 'Fraud/Financial Crime Risk Assessment',
      heroSubtitle: 'Comprehensive evaluation of your organization\'s vulnerability to fraud and financial crimes, identifying critical risks and assessing the effectiveness of existing controls.',
      introTitle: 'Understanding Fraud and Financial Crime Risks',
      introDescription: 'In today\'s complex financial landscape, organizations face increasing threats from fraud and financial crimes. Our comprehensive risk assessment helps you identify vulnerabilities, evaluate existing controls, and develop strategic defenses against evolving threats.',
      importanceTitle: 'The Importance of Fraud Risk Assessment in Modern Business',
      importanceDescription: 'Fraud and financial crime risk assessment serves as the cornerstone of effective financial security, allowing businesses to proactively identify vulnerabilities and strengthen their defenses. By leveraging advanced methodologies and industry best practices, our assessments ensure that risks are identified early, controls are evaluated thoroughly, and mitigation strategies are implemented effectively, all while adapting to emerging threats and regulatory changes.',
      challengesTitle: 'Key Challenges We Can Help You Overcome',
      challengesDescription: 'Our advisory and assessment services for fraud and financial crime risk are designed to tackle these issues head-on, providing tailored strategies that align with your unique operational demands. Curious about your current risk posture? Take our quick online assessment for personalized insights.',
      challengesButtonText: 'Start Assessment',
      challengesButtonLink: '/contact',
      challenges: [
        {
          number: '01',
          title: 'Identifying Hidden Vulnerabilities',
          description: 'Complex fraud schemes often exploit weaknesses that aren\'t immediately apparent, requiring deep analysis of processes, systems, and human factors.',
        },
        {
          number: '02',
          title: 'Regulatory Compliance Requirements',
          description: 'Navigating standards like AML/CTF, KYC, and FATF requires precise risk assessment and reporting, which can be resource-intensive without proper frameworks.',
        },
        {
          number: '03',
          title: 'Balancing Security with Operations',
          description: 'Overly restrictive controls can hinder business efficiency, while lax risk management increases exposure to financial losses and reputational damage.',
        },
        {
          number: '04',
          title: 'Evolving Threat Landscape',
          description: 'As fraud techniques become more sophisticated, manual risk assessment processes become unsustainable, leading to gaps in detection and prevention.',
        },
      ],
      benefitsTitle: 'Benefits Of Implementing Fraud Risk Assessment',
      benefitsDescription: 'Engaging our services to assess and optimize your fraud risk management delivers tangible advantages that strengthen your financial security posture:',
      benefitsConclusion: 'Many of our clients have seen up to 40% reduction in fraud-related incidents after engaging our services for comprehensive risk assessments. Join them—schedule a complimentary 30-minute consultation to explore how NCG can customize this for you.',
      benefitsButtonText: 'Book Now',
      benefitsButtonLink: '/contact',
      advantages: [
        {
          title: 'Enhanced Risk Mitigation',
          description: 'Proactively identify and address potential fraud vulnerabilities, reducing the likelihood of financial losses and regulatory violations.',
        },
        {
          title: 'Improved Compliance Posture',
          description: 'Generate detailed risk assessments and reports to meet regulatory requirements effortlessly, avoiding costly penalties and sanctions.',
        },
        {
          title: 'Cost Savings',
          description: 'Minimize financial losses and optimize resource allocation through intelligent risk identification and targeted control implementation.',
        },
        {
          title: 'Strategic Decision Making',
          description: 'Gain actionable insights into your risk landscape, enabling informed decisions about resource allocation and security investments.',
        },
      ],
      coreFeaturesTitle: 'Core Features We Focus On In Risk Assessment',
      coreFeaturesDescription: 'Our services emphasize cutting-edge capabilities in fraud risk assessment to deliver reliable performance:',
      coreFeatures: [
        {
          title: 'Comprehensive Risk Identification',
          description: 'Full analysis of fraud and financial crime risks across all business areas, including transaction monitoring, customer onboarding, and internal processes.',
        },
        {
          title: 'Control Effectiveness Evaluation',
          description: 'Regular assessment processes to verify that existing controls remain appropriate and effective over time.',
        },
        {
          title: 'Regulatory Alignment',
          description: 'Advanced frameworks aligned with AML/CTF, KYC, and FATF standards to ensure compliance and best practices.',
        },
        {
          title: 'Data-Driven Insights',
          description: 'Customizable dashboards and analytics for in-depth visibility into risk patterns and control effectiveness.',
        },
        {
          title: 'Remediation Roadmaps',
          description: 'Actionable recommendations and implementation plans to address identified gaps and strengthen your fraud defenses.',
        },
      ],
      igaServicesTitle: 'Our Fraud Risk Assessment Services',
      igaServicesDescription: 'As a dedicated cybersecurity consulting firm, NCG offers end-to-end support to assess, evaluate, and optimize fraud risk management:',
      igaServices: [
        {
          number: '01',
          title: 'Risk Assessment and Evaluation',
          description: 'Expert evaluations of your current fraud risk landscape, identifying vulnerabilities and recommending customized roadmaps for risk mitigation.',
        },
        {
          number: '02',
          title: 'Control Design and Implementation',
          description: 'Hands-on development of fraud prevention controls, including testing, validation, and integration with existing systems.',
        },
        {
          number: '03',
          title: 'Analytics and Monitoring Tools',
          description: 'Proprietary methodologies and tools to speed up risk identification and enhance assessment delivery, ensuring quick time-to-value.',
        },
      ],
      successStoriesTitle: 'Proven Outcomes And Success Stories',
      successStoriesDescription: 'Clients who partner with NCG for fraud risk assessment have achieved remarkable results, such as reducing fraud incidents by up to 40% and streamlining compliance audits. For example, a mid-sized financial institution we assisted with implementing a comprehensive risk assessment framework saw fraud detection improve by 50% and overall security resilience strengthen significantly.',
      successStoriesCtaText: 'Explore our resources section for more detailed case studies and insights.',
      successStoriesCtaLink: '/case-studies',
    }

    // Check if sub-service already exists
    console.log('🔍 Checking if sub-service already exists...')
    const existingSubService = await payloadInstance.find({
      collection: 'sub-services',
      where: {
        slug: {
          equals: 'fraud-financial-crime-risk-assessment',
        },
      },
      limit: 1,
    })

    if (existingSubService.docs.length > 0) {
      console.log('📝 Updating existing sub-service: Fraud/Financial Crime Risk Assessment')
      console.log(`   ID: ${existingSubService.docs[0].id}`)
      const updated = await payloadInstance.update({
        collection: 'sub-services',
        id: existingSubService.docs[0].id,
        data: fraudRiskAssessmentData,
      })
      console.log('✅ Sub-service updated successfully!')
      console.log(`   Title: ${updated.title}`)
    } else {
      console.log('📄 Creating new sub-service: Fraud/Financial Crime Risk Assessment')
      const created = await payloadInstance.create({
        collection: 'sub-services',
        data: fraudRiskAssessmentData,
      })
      console.log('✅ Sub-service created successfully!')
      console.log(`   ID: ${created.id}`)
      console.log(`   Title: ${created.title}`)
    }

    // Add a few more sub-services for other services
    if (identitySecurityService.docs.length > 0) {
      const identitySecurityServiceId = identitySecurityService.docs[0].id

      const igaSubServiceData = {
        service: identitySecurityServiceId,
        title: 'Identity Governance & Administration (IGA)',
        description: 'Comprehensive identity lifecycle management including user provisioning, access reviews, and role-based access control to ensure proper identity governance across your organization.',
        slug: 'identity-governance-administration-iga',
        order: 1,
        heroTitle: 'Identity Governance and Administration – IGA',
        heroSubtitle: 'Given the speed change in our digital landscapes, strong identity management is essential for protecting your organization\'s assets. Our advisory, implementation, and assessment services for Identity Governance and Administration (IGA) products provide a comprehensive framework to oversee user identities, access rights, and compliance needs, helping you mitigate risks while enabling agility across your organization.',
        introTitle: 'The Importance of IGA in Modern Cybersecurity',
        introDescription: 'IGA serves as the cornerstone of effective identity security, allowing businesses to automate and streamline the management of user accounts across diverse environments. By leveraging advanced tools and best practices from leading IGA products, our services ensure that access is granted appropriately, monitored continuously, and revoked when necessary, all while adapting to emerging threats and regulatory changes.',
        challengesTitle: 'Key Challenges We Can Help You Overcome',
        challengesDescription: 'Our advisory and implementation services for leading IGA products are designed to tackle these issues head-on, providing tailored strategies that align with your unique operational demands. Curious about your current IGA maturity? Take our quick online assessment for personalized insights.',
        challengesButtonText: 'Start Assessment',
        challengesButtonLink: '/contact',
        challenges: [
          {
            number: '01',
            title: 'Managing Complex Identities',
            description: 'Handling both human and machine-based identities in hybrid and multi-cloud setups can lead to oversight and vulnerabilities.',
          },
          {
            number: '02',
            title: 'Ensuring Regulatory Compliance',
            description: 'Navigating standards like GDPR, HIPAA, or SOX requires precise auditing and reporting, which can be resource-intensive without proper systems.',
          },
          {
            number: '03',
            title: 'Balancing Security with Productivity',
            description: 'Overly restrictive access controls can hinder employee efficiency, while lax policies increase exposure to breaches.',
          },
          {
            number: '04',
            title: 'Scalability Issues',
            description: 'As businesses grow, manual identity processes become unsustainable, leading to errors and delays.',
          },
        ],
        benefitsTitle: 'Benefits Of Implementing IGA',
        benefitsDescription: 'Engaging our services to implement and optimize IGA products delivers tangible advantages that strengthen your cybersecurity posture:',
        benefitsConclusion: 'Many of our clients have seen up to 30% reduction in compliance-related efforts after engaging our services for IGA product implementations. Join them—schedule a complimentary 30-minute consultation to explore how NCG can customize this for you.',
        benefitsButtonText: 'Book Now',
        benefitsButtonLink: '/contact',
        advantages: [
          {
            title: 'Enhanced Risk Mitigation',
            description: 'Proactively identify and address potential access-related threats, reducing the likelihood of data breaches and insider risks.',
          },
          {
            title: 'Improved Efficiency',
            description: 'Automate routine tasks such as user provisioning and de-provisioning, freeing up IT teams for strategic initiatives.',
          },
          {
            title: 'Stronger Compliance Posture',
            description: 'Generate detailed audit trails and reports to meet regulatory requirements effortlessly, avoiding costly penalties.',
          },
          {
            title: 'Cost Savings',
            description: 'Minimize administrative overhead and optimize resource allocation through intelligent automation and analytics.',
          },
        ],
        coreFeaturesTitle: 'Core Features We Focus On In IGA Products',
        coreFeaturesDescription: 'Our services emphasize cutting-edge capabilities in leading IGA products to deliver reliable performance:',
        coreFeatures: [
          {
            title: 'Identity Lifecycle Management',
            description: 'Full oversight from user onboarding to offboarding, including role-based access control (RBAC) and automated workflows.',
          },
          {
            title: 'Access Certification and Reviews',
            description: 'Regular attestation processes to verify access privileges and ensure they remain appropriate over time.',
          },
          {
            title: 'Policy Enforcement and Analytics',
            description: 'Advanced rules engines and AI-driven insights to detect anomalies and enforce security policies in real-time',
          },
          {
            title: 'Integration Flexibility',
            description: 'Seamless connectivity with existing directories, applications, and cloud services for a unified identity ecosystem.',
          },
          {
            title: 'Reporting and Auditing Tools',
            description: 'Customizable dashboards and logs for in-depth visibility into identity activities and compliance status.',
          },
        ],
        igaServicesTitle: 'Our IGA Services',
        igaServicesDescription: 'As a dedicated cybersecurity consulting firm, NCG offers end-to-end support to assess, implement, and optimize various IGA products:',
        igaServices: [
          {
            number: '01',
            title: 'Consulting and Assessment',
            description: 'Expert evaluations of your current identity infrastructure, identifying gaps and recommending customized roadmaps for suitable IGA products.',
          },
          {
            number: '02',
            title: 'Implementation and Integration',
            description: 'Hands-on deployment of selected IGA platforms, including configuration, testing, and migration from legacy systems.',
          },
          {
            number: '03',
            title: 'Accelerators and Tools',
            description: 'Proprietary utilities to speed up onboarding and enhance solution delivery, ensuring quick time-to-value.',
          },
        ],
        successStoriesTitle: 'Proven Outcomes And Success Stories',
        successStoriesDescription: 'Clients who partner with NCG for IGA advisory and implementation have achieved remarkable results, such as reducing access-related incidents by up to 40% and streamlining compliance audits. For example, a mid-sized financial institution we assisted with implementing an IGA product saw automated provisioning cut administrative time by half and improve overall security resilience.',
        successStoriesCtaText: 'Explore our resources section for more detailed case studies and insights.',
        successStoriesCtaLink: '/case-studies',
      }

      const existingIGA = await payloadInstance.find({
        collection: 'sub-services',
        where: {
          slug: {
            equals: 'identity-governance-administration-iga',
          },
        },
        limit: 1,
      })

      if (existingIGA.docs.length > 0) {
        console.log('📝 Updating existing sub-service: Identity Governance & Administration (IGA)')
        console.log(`   ID: ${existingIGA.docs[0].id}`)
        const updatedIGA = await payloadInstance.update({
          collection: 'sub-services',
          id: existingIGA.docs[0].id,
          data: igaSubServiceData,
        })
        console.log('✅ IGA sub-service updated successfully!')
        console.log(`   Title: ${updatedIGA.title}`)
      } else {
        console.log('📄 Creating new sub-service: Identity Governance & Administration (IGA)')
        const createdIGA = await payloadInstance.create({
          collection: 'sub-services',
          data: igaSubServiceData,
        })
        console.log('✅ IGA sub-service created successfully!')
        console.log(`   ID: ${createdIGA.id}`)
        console.log(`   Title: ${createdIGA.title}`)
      }
    }

    console.log('✅ Sub-services data successfully populated!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error populating sub-services data:', error)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}


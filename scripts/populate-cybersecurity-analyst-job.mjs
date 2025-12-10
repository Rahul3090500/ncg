import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import payload from 'payload'
import configPayload from '../src/payload.config.ts'

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') })

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET environment variable is not set')
  process.exit(1)
}

async function populateCybersecurityAnalystJob() {
  try {
    console.log('🚀 Starting Cybersecurity Analyst job data population...')
    console.log('📦 Loading Payload configuration...')
    
    // Initialize Payload
    const payloadInstance = await payload.init({
      config: configPayload,
      local: true,
    })
    
    console.log('✅ Payload initialized successfully')
    
    // Check if job already exists
    const existingJob = await payloadInstance.find({
      collection: 'job-openings',
      where: {
        slug: {
          equals: 'cybersecurity-analyst',
        },
      },
      limit: 1,
    })
    
    if (existingJob.docs.length > 0) {
      console.log('⚠️  Job with slug "cybersecurity-analyst" already exists. Updating...')
      const jobId = existingJob.docs[0].id
      
      await payloadInstance.update({
        collection: 'job-openings',
        id: jobId,
        data: {
          title: 'Cybersecurity Analyst',
          slug: 'cybersecurity-analyst',
          location: 'Stockholm, Sweden',
          type: 'full-time-hybrid',
          applyByDate: '2025-09-15',
          description: 'Help organizations detect, investigate, and respond to cyber threats. Work with leading tools, analyze incidents, and support proactive defense strategies.',
          companyIntroduction: 'At Nordic Cyber Group, we empower organizations to confidently manage cyber threats. As our Cybersecurity Analyst, you\'ll play a pivotal role in detecting threats, investigating incidents, and strengthening defenses using cutting-edge tools and techniques.',
          responsibilities: [
            {
              responsibility: 'Monitor alerts and events, triage incidents, and escalate with clear, actionable context',
            },
            {
              responsibility: 'Lead forensics and root-cause analysis; document findings and lessons learned',
            },
            {
              responsibility: 'Tune detections, playbooks, and dashboards to reduce noise and improve time-to-detect',
            },
            {
              responsibility: 'Hunt for threats using intel, hypotheses, and behavioral analytics',
            },
            {
              responsibility: 'Support vulnerability management: validation, prioritization, and remediation follow-up',
            },
            {
              responsibility: 'Partner with clients to improve security posture (hardening, MFA, least-privilege, logging)',
            },
            {
              responsibility: 'Contribute to incident response runbooks and readiness exercises (tabletop/tech drills)',
            },
          ],
          requiredSkills: [
            {
              skill: '2-5 years in SOC, threat hunting, or incident response roles',
            },
            {
              skill: 'Hands-on experience with SIEM/XDR platforms (e.g., Sentinel, CrowdStrike, Splunk)',
            },
            {
              skill: 'Solid foundation in network, endpoint, identity, and cloud security',
            },
            {
              skill: 'Strong communicator with analytical mindset',
            },
            {
              skill: 'Fluent in English; Swedish proficiency is a plus',
            },
          ],
          attributes: [
            {
              attribute: 'You\'re solution-oriented with a passion for staying ahead of threats',
            },
            {
              attribute: 'You engage collaboratively and educate clients with clarity',
            },
            {
              attribute: 'You\'re proactive—anticipating issues and acting before they escalate',
            },
            {
              attribute: 'You\'re driven to meet goals with precision and integrity',
            },
          ],
          benefits: [
            {
              benefit: 'Meaningful, high-impact work protecting real organizations',
            },
            {
              benefit: 'Expert mentorship and career growth opportunities',
            },
            {
              benefit: 'Competitive benefits, professional development, and certifications',
            },
            {
              benefit: 'A supportive, collaborative team culture in a hybrid work environment',
            },
          ],
          howToApply: 'NCG is an equal-opportunity employer. By applying, you consent to the processing of your data in line with GDPR. Apply today and share your CV, plus a brief note highlighting a security challenge you tackled. We\'re hiring now—apply now to be part of our journey.',
          department: 'Technology',
          remoteStatus: 'hybrid',
          featured: true,
        },
      })
      
      console.log('✅ Job updated successfully!')
    } else {
      // Create new job
      console.log('📝 Creating new Cybersecurity Analyst job...')
      
      const job = await payloadInstance.create({
        collection: 'job-openings',
        data: {
          title: 'Cybersecurity Analyst',
          slug: 'cybersecurity-analyst',
          location: 'Stockholm, Sweden',
          type: 'full-time-hybrid',
          applyByDate: '2025-09-15',
          description: 'Help organizations detect, investigate, and respond to cyber threats. Work with leading tools, analyze incidents, and support proactive defense strategies.',
          companyIntroduction: 'At Nordic Cyber Group, we empower organizations to confidently manage cyber threats. As our Cybersecurity Analyst, you\'ll play a pivotal role in detecting threats, investigating incidents, and strengthening defenses using cutting-edge tools and techniques.',
          responsibilities: [
            {
              responsibility: 'Monitor alerts and events, triage incidents, and escalate with clear, actionable context',
            },
            {
              responsibility: 'Lead forensics and root-cause analysis; document findings and lessons learned',
            },
            {
              responsibility: 'Tune detections, playbooks, and dashboards to reduce noise and improve time-to-detect',
            },
            {
              responsibility: 'Hunt for threats using intel, hypotheses, and behavioral analytics',
            },
            {
              responsibility: 'Support vulnerability management: validation, prioritization, and remediation follow-up',
            },
            {
              responsibility: 'Partner with clients to improve security posture (hardening, MFA, least-privilege, logging)',
            },
            {
              responsibility: 'Contribute to incident response runbooks and readiness exercises (tabletop/tech drills)',
            },
          ],
          requiredSkills: [
            {
              skill: '2-5 years in SOC, threat hunting, or incident response roles',
            },
            {
              skill: 'Hands-on experience with SIEM/XDR platforms (e.g., Sentinel, CrowdStrike, Splunk)',
            },
            {
              skill: 'Solid foundation in network, endpoint, identity, and cloud security',
            },
            {
              skill: 'Strong communicator with analytical mindset',
            },
            {
              skill: 'Fluent in English; Swedish proficiency is a plus',
            },
          ],
          attributes: [
            {
              attribute: 'You\'re solution-oriented with a passion for staying ahead of threats',
            },
            {
              attribute: 'You engage collaboratively and educate clients with clarity',
            },
            {
              attribute: 'You\'re proactive—anticipating issues and acting before they escalate',
            },
            {
              attribute: 'You\'re driven to meet goals with precision and integrity',
            },
          ],
          benefits: [
            {
              benefit: 'Meaningful, high-impact work protecting real organizations',
            },
            {
              benefit: 'Expert mentorship and career growth opportunities',
            },
            {
              benefit: 'Competitive benefits, professional development, and certifications',
            },
            {
              benefit: 'A supportive, collaborative team culture in a hybrid work environment',
            },
          ],
          howToApply: 'NCG is an equal-opportunity employer. By applying, you consent to the processing of your data in line with GDPR. Apply today and share your CV, plus a brief note highlighting a security challenge you tackled. We\'re hiring now—apply now to be part of our journey.',
          department: 'Technology',
          remoteStatus: 'hybrid',
          featured: true,
        },
      })
      
      console.log('✅ Job created successfully!')
      console.log(`   Job ID: ${job.id}`)
      console.log(`   Slug: ${job.slug}`)
      console.log(`   Title: ${job.title}`)
    }
    
    console.log('🎉 Data population completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('   1. Go to Payload Admin: http://localhost:3000/admin')
    console.log('   2. Navigate to Collections > Job Openings')
    console.log('   3. Find "Cybersecurity Analyst" job')
    console.log('   4. Add an image and hero image (if needed)')
    console.log('   5. View the job at: http://localhost:3000/jobs/cybersecurity-analyst')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error populating job data:', error)
    console.error(error.stack)
    process.exit(1)
  }
}

populateCybersecurityAnalystJob().catch((error) => {
  console.error('❌ Unhandled error:', error)
  console.error(error.stack)
  process.exit(1)
})


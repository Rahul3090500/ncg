import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const AboutCTASection: GlobalConfig = {
  slug: 'about-cta-section',
  label: 'About CTA Section',
  admin: {
    group: 'About Page',
    description: 'Manage CTA content and background',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [invalidateCacheAfterGlobalChange],
  },
  fields: [
    { name: 'title', type: 'textarea', required: true, defaultValue: 'Ready To Strengthen Your Cybersecurity?' },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        'Talk directly with our experts to understand your challenges, explore tailored solutions, and take the first step toward a more secure and resilient future.',
    },
    { name: 'buttonText', type: 'text', required: true, defaultValue: 'Contact Us' },
    { name: 'buttonLink', type: 'text', required: true, defaultValue: '/contact' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { name: 'overlayOpacity', type: 'number', required: true, defaultValue: 0.5 },
  ],
}
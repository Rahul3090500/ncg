import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const FreeConsultationSection: GlobalConfig = {
  slug: 'free-consultation-section',
  label: 'Free Consultation Section',
  admin: {
    group: 'Pages',
    description: 'Manage free consultation page content and Calendly URL',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [invalidateCacheAfterGlobalChange],
  },
  fields: [
    {
      name: 'leftTitle',
      type: 'text',
      required: true,
      defaultValue: "Let's Connect",
      label: 'Left Column Title',
    },
    {
      name: 'leftSubtitle',
      type: 'text',
      required: true,
      defaultValue: "What can we do for you?",
      label: 'Left Column Subtitle',
    },
    {
      name: 'rightTitle',
      type: 'text',
      required: true,
      defaultValue: 'Free Consultation',
      label: 'Right Column Title',
    },
    {
      name: 'rightDescription',
      type: 'textarea',
      required: true,
      defaultValue:
        'Our experts are ready to understand your challenges, answer your questions, and offer tailored cybersecurity guidance – no cost, no commitment.',
      label: 'Right Column Description',
    },
    {
      name: 'calendlyUrl',
      type: 'text',
      required: false,
      defaultValue: 'https://calendly.com/joshua-ekaathedesigncollective/ekaa-the-design-collective-1',
      label: 'Calendly URL',
      admin: {
        description: 'The full Calendly URL for the consultation booking. If not provided, the default URL will be used.',
      },
    },
  ],
}

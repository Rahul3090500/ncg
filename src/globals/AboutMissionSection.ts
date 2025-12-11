import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const AboutMissionSection: GlobalConfig = {
  slug: 'about-mission-section',
  label: 'About Mission Section',
  admin: {
    group: 'About Page',
    description: 'Manage mission title and description',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [invalidateCacheAfterGlobalChange],
  },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Our Mission' },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        'To deliver transparent, trusted, and expert-driven cybersecurity services that strengthen resilience, reduce risk, and protect what matters most—your people, your data, and your reputation.',
    },
  ],
}

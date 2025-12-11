import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const ContactSection: GlobalConfig = {
  slug: 'contact-section',
  label: 'Contact Section',
  admin: {
    group: 'Homepage',
    description: 'Manage contact section and team member',
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
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Partner with NCG for cybersecurity excellence',
    },
    {
      name: 'teamMember',
      type: 'group',
      label: 'Team Member',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'certifications',
          type: 'array',
          label: 'Certifications',
          minRows: 0,
          maxRows: 10,
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'linkedinUrl',
          type: 'text',
          label: 'LinkedIn URL',
        },
      ],
    },
    {
      name: 'submitButtonText',
      type: 'text',
      required: true,
      defaultValue: 'Connect Today',
    },
    {
      name: 'privacyText',
      type: 'textarea',
      required: true,
      defaultValue:
        'By clicking submit, you acknowledge our Privacy Policy and agree to receive email communication from us.',
    },
  ],
}


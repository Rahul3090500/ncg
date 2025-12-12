import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const ServicesSection: GlobalConfig = {
  slug: 'services-section',
  label: 'Services Section',
  admin: {
    group: 'Homepage',
    description: 'Manage homepage services section - select existing services and their sub-services',
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
      name: 'sectionTitle',
      type: 'textarea',
      required: true,
      defaultValue: 'Our\nServices',
      admin: {
        description: 'Services section title (use \\n for line breaks)',
      },
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 0,
      maxRows: 10,
      admin: {
        description: 'Select services to display on the homepage. ⚠️ NOTE: New services are automatically added here when created. For existing services, click "+ Add New" to add them. For each service, select which sub-services to show below.',
      },
      fields: [
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          required: true,
          admin: {
            description: 'Select an existing service from the Services collection. Note: New services are automatically added here when created, but you still need to select their sub-services below.',
          },
        },
        {
          name: 'subServices',
          type: 'relationship',
          relationTo: 'sub-services',
          hasMany: true,
          required: false,
          admin: {
            description: 'Select sub-services to display for this service. Sub-services can belong to multiple services.',
            condition: (data: any, siblingData: any) => {
              // Only show sub-services field when a service is selected
              const serviceId = siblingData?.service || data?.service
              return Boolean(serviceId)
            },
          },
          // Removed filterOptions to allow sub-services from any service to be selected
          // Sub-services can now belong to multiple services
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Service image to display in the featured card. This image is specific to this service entry and is separate from sub-service images.',
          },
        },
      ],
    },
  ],
}


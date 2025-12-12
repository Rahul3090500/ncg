import type { CollectionConfig } from 'payload'
import { invalidateCacheAfterChange, invalidateCacheAfterDelete } from '../hooks/payload'

export const SubServices: CollectionConfig = {
  slug: 'sub-services',
  labels: {
    singular: 'Sub Service',
    plural: 'Sub Services',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [invalidateCacheAfterChange],
    afterDelete: [invalidateCacheAfterDelete],
  },
  admin: {
    useAsTitle: 'title',
    description: 'Create and manage sub-services (detailed service offerings)',
    defaultColumns: ['title', 'services', 'slug', 'order', 'updatedAt'],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from title if not provided)',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          async ({ value, data, req, operation }) => {
            // Generate slug from title if slug is empty
            if (!value && data?.title) {
              // Generate base slug from title
              const baseSlug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
              
              // Check for duplicates and append number if needed
              let finalSlug = baseSlug
              let counter = 1
              let exists = true
              
              while (exists) {
                const existing = await req.payload.find({
                  collection: 'sub-services',
                  where: {
                    slug: {
                      equals: finalSlug,
                    },
                  },
                  limit: 1,
                })
                
                // If creating new, check if slug exists
                if (operation === 'create') {
                  exists = existing.docs.length > 0
                } else {
                  // For update, exclude current document
                  if (!data?.id) {
                    exists = existing.docs.length > 0
                  } else {
                    const currentId = typeof data.id === 'number' ? data.id : data.id
                    exists = existing.docs.length > 0 && existing.docs[0].id !== currentId
                  }
                }
                
                if (exists) {
                  finalSlug = `${baseSlug}-${counter}`
                  counter++
                }
              }
              
              return finalSlug
            }
            
            // If slug is provided, validate uniqueness
            if (value) {
              const existing = await req.payload.find({
                collection: 'sub-services',
                where: {
                  slug: {
                    equals: value,
                  },
                },
                limit: 1,
              })
              
              if (operation === 'create' && existing.docs.length > 0) {
                // Auto-append number if duplicate
                let finalSlug = value
                let counter = 1
                let exists = true
                
                while (exists) {
                  const check = await req.payload.find({
                    collection: 'sub-services',
                    where: {
                      slug: {
                        equals: finalSlug,
                      },
                    },
                    limit: 1,
                  })
                  exists = check.docs.length > 0
                  if (exists) {
                    finalSlug = `${value}-${counter}`
                    counter++
                  }
                }
                return finalSlug
              }
              
              if (operation === 'update' && existing.docs.length > 0 && data?.id) {
                // TypeScript now knows data is defined and has id due to the check above
                const currentId = typeof data!.id === 'number' ? data!.id : data!.id
                if (existing.docs[0].id !== currentId) {
                  // Auto-append number if duplicate
                  let finalSlug = value
                  let counter = 1
                  let exists = true
                  
                  while (exists) {
                    const check = await req.payload.find({
                      collection: 'sub-services',
                      where: {
                        slug: {
                          equals: finalSlug,
                        },
                      },
                      limit: 1,
                    })
                    const checkId = check.docs.length > 0 ? check.docs[0].id : null
                    exists = check.docs.length > 0 && checkId !== currentId
                    if (exists) {
                      finalSlug = `${value}-${counter}`
                      counter++
                    }
                  }
                  return finalSlug
                }
              }
            }
            
            return value
          },
        ],
      },
      validate: (value: any): true => {
        // Slug will be auto-generated if not provided, so it's optional
        // Basic validation - uniqueness is handled by beforeChange hook
        return true
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      required: true,
      minRows: 1,
      admin: {
        description: 'Services this sub-service belongs to (can belong to multiple services)',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      hooks: {
        beforeChange: [
          async ({ value, data, req, operation }) => {
            // If title changes and slug is empty or was auto-generated, regenerate slug
            if (value && operation === 'update' && data?.id) {
              const currentDoc = await req.payload.findByID({
                collection: 'sub-services',
                id: typeof data.id === 'number' ? data.id : data.id,
              })
              
              // If title changed, regenerate slug from new title
              if (currentDoc && currentDoc.title !== value) {
                const baseSlug = value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')
                
                // Check for duplicates and append number if needed
                let finalSlug = baseSlug
                let counter = 1
                let exists = true
                const currentId = typeof data.id === 'number' ? data.id : data.id
                
                while (exists) {
                  const existing = await req.payload.find({
                    collection: 'sub-services',
                    where: {
                      slug: {
                        equals: finalSlug,
                      },
                    },
                    limit: 1,
                  })
                  
                  const existingId = existing.docs.length > 0 
                    ? (typeof existing.docs[0].id === 'number' ? existing.docs[0].id : existing.docs[0].id)
                    : null
                  exists = existing.docs.length > 0 && existingId !== currentId
                  
                  if (exists) {
                    finalSlug = `${baseSlug}-${counter}`
                    counter++
                  }
                }
                
                // Update slug field
                if (data.slug === undefined || !data.slug) {
                  data.slug = finalSlug
                }
              }
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      required: false,
      admin: {
        description: 'Order for displaying sub-services within a service',
        defaultValue: 0,
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'heroTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Main heading for hero section',
      },
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Subtitle/description for hero section',
      },
    },
    {
      name: 'importanceTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for importance section (e.g., "The Importance of IGA in Modern Cybersecurity")',
      },
    },
    {
      name: 'importanceDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description for importance section',
      },
    },
    {
      name: 'importanceImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Image for importance section',
      },
    },
    {
      name: 'downloadBannerTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for download banner (e.g., "Mastering Identity Governance: Key Strategies For 2025")',
      },
    },
    {
      name: 'downloadBannerDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description for download banner',
      },
    },
    {
      name: 'downloadBannerButtonText',
      type: 'text',
      required: false,
      admin: {
        description: 'Button text (e.g., "Download Now")',
      },
    },
    {
      name: 'downloadBannerButtonLink',
      type: 'text',
      required: false,
      admin: {
        description: 'Button link URL',
      },
    },
    {
      name: 'downloadBannerImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Document/guide image for download banner',
      },
    },
    {
      name: 'challengesTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for challenges section (e.g., "Key Challenges We Can Help You Overcome")',
      },
    },
    {
      name: 'challengesDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description for challenges section',
      },
    },
    {
      name: 'challengesButtonText',
      type: 'text',
      required: false,
      admin: {
        description: 'Button text (e.g., "Start Assessment")',
      },
    },
    {
      name: 'challengesButtonLink',
      type: 'text',
      required: false,
      admin: {
        description: 'Button link URL',
      },
    },
    {
      name: 'challenges',
      type: 'array',
      label: 'Challenges',
      required: false,
      maxRows: 4,
      admin: {
        description: 'Add challenge cards (maximum 4 cards)',
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          required: false,
          admin: {
            description: 'Challenge number (e.g., "01", "02")',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
    {
      name: 'benefitsTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for benefits section (e.g., "Benefits Of Implementing IGA")',
      },
    },
    {
      name: 'benefitsDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description/intro for benefits section',
      },
    },
    {
      name: 'benefitsConclusion',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Conclusion text after benefits cards',
      },
    },
    {
      name: 'benefitsButtonText',
      type: 'text',
      required: false,
      admin: {
        description: 'Button text (e.g., "Book Now")',
      },
    },
    {
      name: 'benefitsButtonLink',
      type: 'text',
      required: false,
      admin: {
        description: 'Button link URL',
      },
    },
    {
      name: 'advantages',
      type: 'array',
      label: 'Benefits',
      required: false,
      admin: {
        description: 'Add benefit cards',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
    {
      name: 'coreFeaturesTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for core features section (e.g., "Core Features We Focus On In IGA Products")',
      },
    },
    {
      name: 'coreFeaturesDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description/intro for core features section',
      },
    },
    {
      name: 'coreFeaturesImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Image for core features section',
      },
    },
    {
      name: 'coreFeatures',
      type: 'array',
      label: 'Core Features',
      required: false,
      admin: {
        description: 'List of core features',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'igaServicesTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for IGA services section (e.g., "Our IGA Services")',
      },
    },
    {
      name: 'igaServicesDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description for IGA services section',
      },
    },
    {
      name: 'igaServices',
      type: 'array',
      label: 'IGA Services',
      required: false,
      admin: {
        description: 'Add IGA service cards (add as many as needed)',
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          required: false,
          admin: {
            description: 'Service number (e.g., "01", "02")',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Background pattern/image for the card',
          },
        },
      ],
    },
    {
      name: 'successStoriesTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for success stories section (e.g., "Proven Outcomes And Success Stories")',
      },
    },
    {
      name: 'successStoriesDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description for success stories section',
      },
    },
    {
      name: 'successStoriesCtaText',
      type: 'text',
      required: false,
      admin: {
        description: 'CTA text (e.g., "Explore our resources section for more detailed case studies and insights.")',
      },
    },
    {
      name: 'successStoriesCtaLink',
      type: 'text',
      required: false,
      admin: {
        description: 'CTA link URL',
      },
    },
    {
      name: 'successStoriesBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Background image for success stories section',
      },
    },
  ],
}


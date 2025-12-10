import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (!req || !req.payload || operation !== 'create') {
          return
        }

        try {
          // Auto-add newly created service to services-section global if it exists
          const servicesSection = await req.payload.findGlobal({
            slug: 'services-section',
          }).catch(() => null)

          if (servicesSection) {
            const serviceId = typeof doc.id === 'number' ? doc.id : doc.id
            
            // Check if service is already in the array
            const isAlreadyAdded = servicesSection.services?.some((item: any) => {
              const itemServiceId = typeof item.service === 'object' && item.service !== null
                ? (item.service.id || item.service)
                : item.service
              return itemServiceId === serviceId
            })

            // Only add if not already present
            if (!isAlreadyAdded) {
              const currentServices = Array.isArray(servicesSection.services) 
                ? servicesSection.services 
                : []
              
              await req.payload.updateGlobal({
                slug: 'services-section',
                data: {
                  services: [
                    ...currentServices,
                    {
                      service: serviceId,
                      subServices: [], // Empty initially, user can add sub-services later
                    },
                  ],
                },
              })
            }
          }
        } catch (error) {
          // Don't throw error - just log it, as this is a convenience feature
          console.error('Error auto-adding service to services-section:', error)
        }
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        if (!req || !req.payload) {
          return
        }

        try {
          const serviceId = typeof id === 'number' ? id : id

          // Check if service is referenced in services-section global
          const servicesSection = await req.payload.findGlobal({
            slug: 'services-section',
          })

          if (servicesSection?.services) {
            const isReferenced = servicesSection.services.some((item: any) => {
              const itemServiceId = typeof item.service === 'object' && item.service !== null
                ? (item.service.id || item.service)
                : item.service
              return itemServiceId === serviceId
            })

            if (isReferenced) {
              throw new Error(
                'Cannot delete service: It is currently being used in the Services Section on the homepage. Please remove it from the Services Section first.'
              )
            }
          }

          // Note: Sub-services can belong to multiple services now,
          // so we don't need to prevent deletion if sub-services exist.
          // The relationship will be automatically cleaned up by Payload.
        } catch (error) {
          // Re-throw the error to prevent deletion
          throw error
        }
      },
    ],
  },
  admin: {
    useAsTitle: 'title',
    description: 'Create and manage all main services used across the site. ⚠️ Note: New services are automatically added to the homepage Services Section. To display them, go to Globals > Services Section and select which sub-services to show for each service.',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from title if not provided)',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          async ({ value, data, req, operation }) => {
            // Skip if req is not available (e.g., during collection initialization)
            if (!req || !req.payload) {
              return value
            }
            
            try {
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
                
                while (exists && counter < 100) { // Safety limit
                  const existing = await req.payload.find({
                    collection: 'services',
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
                    if (data?.id) {
                      const currentId = typeof data.id === 'number' ? data.id : data.id
                      exists = existing.docs.length > 0 && existing.docs[0].id !== currentId
                    } else {
                      exists = existing.docs.length > 0
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
                  collection: 'services',
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
                  
                  while (exists && counter < 100) { // Safety limit
                    const check = await req.payload.find({
                      collection: 'services',
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
                  const currentId = typeof data.id === 'number' ? data.id : data.id
                  if (existing.docs[0].id !== currentId) {
                    // Auto-append number if duplicate
                    let finalSlug = value
                    let counter = 1
                    let exists = true
                    
                    while (exists && counter < 100) { // Safety limit
                      const check = await req.payload.find({
                        collection: 'services',
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
            } catch (error) {
              console.error('Error in slug beforeChange hook:', error)
              // Return the value as-is if there's an error
              return value
            }
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
      name: 'title',
      type: 'text',
      required: true,
      hooks: {
        beforeChange: [
          async ({ value, data, req, operation }) => {
            // Skip if req is not available (e.g., during collection initialization)
            if (!req || !req.payload) {
              return value
            }
            
            try {
              // If title changes and slug is empty or was auto-generated, regenerate slug
              if (value && operation === 'update' && data?.id) {
                const currentDoc = await req.payload.findByID({
                  collection: 'services',
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
                  
                  while (exists && counter < 100) { // Safety limit
                    const existing = await req.payload.find({
                      collection: 'services',
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
            } catch (error) {
              console.error('Error in title beforeChange hook:', error)
              return value
            }
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
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'heroAlt',
      type: 'text',
      required: false,
    },
    {
      name: 'heroTagline',
      type: 'text',
      required: false,
      admin: {
        description: 'Tagline above hero title (e.g., "YOUR TRUSTED IDENTITY SECURITY PARTNER")',
      },
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
      name: 'subServiceTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for sub-services section',
      },
    },
    {
      name: 'subServiceDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description for sub-services section',
      },
    },
    {
      name: 'ctaTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for CTA section',
      },
    },
    {
      name: 'ctaDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description for CTA section',
      },
    },
    {
      name: 'advantagesTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Title for advantages section (e.g., "Identity Security Isn\'t Just An IT Concern – It\'s A Business Imperative")',
      },
    },
    {
      name: 'advantagesDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Description/intro text for advantages section',
      },
    },
    {
      name: 'advantages',
      type: 'array',
      label: 'Advantages',
      required: false,
      maxRows: 4,
      admin: {
        description: 'Add advantage cards (maximum 4 cards allowed, e.g., Identity Visibility, Reduce Attack Surface, Regulatory Alignment, Executive Trust)',
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
      name: 'caseStudiesLabel',
      type: 'text',
      required: false,
      admin: {
        description: 'Label text for case studies section (e.g., "case studies")',
      },
    },
    {
      name: 'caseStudiesHeroTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Hero title for case studies section. Use **text** to highlight text in blue (e.g., "Identity Security In **Action**")',
      },
    },
    {
      name: 'caseStudiesIntro',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Introductory text for case studies section',
      },
    },
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      required: false,
    },
    {
      name: 'subServices',
      type: 'relationship',
      relationTo: 'sub-services',
      hasMany: true,
      required: false,
      admin: {
        description: 'Sub-services related to this service',
      },
    },
  ],
}


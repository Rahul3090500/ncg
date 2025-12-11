import type { CollectionConfig } from 'payload'
import { invalidateCacheAfterChange, invalidateCacheAfterDelete } from '../hooks/payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  labels: {
    singular: 'Blog',
    plural: 'Blogs',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'title',
    description: 'Create and manage blog posts displayed on the Blogs page',
  },
  hooks: {
    afterChange: [invalidateCacheAfterChange],
    afterDelete: [invalidateCacheAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      admin: {
        description: 'Auto-generated from title if left empty. Used for URL (e.g., why-cybersecurity-awareness-is-everyones-responsibility)',
      },
      hooks: {
        beforeChange: [
          async ({ data, req, operation, value }) => {
            if (operation === 'create' || operation === 'update') {
              if (value && typeof value === 'string' && value.trim() !== '') {
                const baseSlug = value
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                if (req?.payload) {
                  const currentId = data?.id
                  const existing = await req.payload.find({
                    collection: 'blogs',
                    where: {
                      and: [
                        {
                          slug: {
                            equals: baseSlug,
                          },
                        },
                        ...(currentId ? [{
                          id: {
                            not_equals: currentId,
                          },
                        }] : []),
                      ],
                    },
                    limit: 1,
                  })
                  
                  if (existing.docs.length > 0) {
                    let counter = 1
                    let uniqueSlug = `${baseSlug}-${counter}`
                    while (existing.docs.some((doc: any) => doc.slug === uniqueSlug)) {
                      counter++
                      uniqueSlug = `${baseSlug}-${counter}`
                    }
                    return uniqueSlug
                  }
                }
                return baseSlug
              } else if (data?.title) {
                const baseSlug = data.title
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                if (req?.payload) {
                  const currentId = data?.id
                  const existing = await req.payload.find({
                    collection: 'blogs',
                    where: {
                      and: [
                        {
                          slug: {
                            equals: baseSlug,
                          },
                        },
                        ...(currentId ? [{
                          id: {
                            not_equals: currentId,
                          },
                        }] : []),
                      ],
                    },
                    limit: 1,
                  })
                  
                  if (existing.docs.length > 0) {
                    let counter = 1
                    let uniqueSlug = `${baseSlug}-${counter}`
                    while (existing.docs.some((doc: any) => doc.slug === uniqueSlug)) {
                      counter++
                      uniqueSlug = `${baseSlug}-${counter}`
                    }
                    return uniqueSlug
                  }
                }
                return baseSlug
              }
            }
            return value
          },
        ],
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Short Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Card Image',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Legacy Link (Optional)',
      admin: {
        description: 'Old link field for backward compatibility',
      },
    },
    // Hero Section
    {
      name: 'heroBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Hero Background Image',
    },
    {
      name: 'readTime',
      type: 'text',
      required: false,
      label: 'Read Time',
      defaultValue: '15 Min Read',
      admin: {
        description: 'Estimated reading time (e.g., "15 Min Read")',
      },
    },
    // Content Sections
    {
      name: 'contentSections',
      type: 'array',
      required: false,
      label: 'Content Sections',
      minRows: 0,
      fields: [
        {
          name: 'sectionType',
          type: 'select',
          required: true,
          options: [
            { label: 'Title with Paragraphs', value: 'titleParagraph' },
            { label: 'Title, Paragraph & Bullet Points', value: 'bulletList' },
            { label: 'Quote', value: 'quote' },
            { label: 'Title with Numbered Points', value: 'numberedList' },
            { label: 'Image Section', value: 'image' },
          ],
          defaultValue: 'titleParagraph',
        },
        // Title with Paragraphs
        {
          name: 'sectionTitle',
          type: 'text',
          required: false,
          label: 'Section Title',
          admin: {
            condition: (_: unknown, siblingData: any) => 
              siblingData?.sectionType === 'titleParagraph' || 
              siblingData?.sectionType === 'bulletList' || 
              siblingData?.sectionType === 'numberedList',
          },
        },
        {
          name: 'paragraphs',
          type: 'array',
          required: false,
          label: 'Paragraphs',
          admin: {
            condition: (_: unknown, siblingData: any) => siblingData?.sectionType === 'titleParagraph',
          },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: false,
              label: 'Paragraph Text',
            },
          ],
        },
        // Bullet List Section
        {
          name: 'introParagraph',
          type: 'textarea',
          required: false,
          label: 'Intro Paragraph',
          admin: {
            condition: (_: unknown, siblingData: any) => siblingData?.sectionType === 'bulletList',
          },
        },
        {
          name: 'bulletItems',
          type: 'array',
          required: false,
          label: 'Bullet Points',
          admin: {
            condition: (_: unknown, siblingData: any) => siblingData?.sectionType === 'bulletList',
          },
          fields: [
            {
              name: 'highlightText',
              type: 'text',
              required: false,
              label: 'Highlight Text',
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
              label: 'Description',
            },
          ],
        },
        // Quote Section
        {
          name: 'quoteText',
          type: 'textarea',
          required: false,
          label: 'Quote Text',
          admin: {
            condition: (_: unknown, siblingData: any) => siblingData?.sectionType === 'quote',
          },
        },
        // Numbered List Section
        {
          name: 'numberedItems',
          type: 'array',
          required: false,
          label: 'Numbered Points',
          admin: {
            condition: (_: unknown, siblingData: any) => siblingData?.sectionType === 'numberedList',
          },
          fields: [
            {
              name: 'highlightText',
              type: 'text',
              required: false,
              label: 'Highlight Text',
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
              label: 'Description',
            },
          ],
        },
        // Image Section
        {
          name: 'sectionImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Image',
          admin: {
            condition: (_: unknown, siblingData: any) => siblingData?.sectionType === 'image',
          },
        },
      ],
    },
    // Social Sharing
    {
      name: 'enableSocialSharing',
      type: 'checkbox',
      required: false,
      defaultValue: true,
      label: 'Enable Social Sharing',
    },
  ],
}
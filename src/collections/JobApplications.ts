import type { CollectionConfig } from 'payload'
import { invalidateCacheAfterChange, invalidateCacheAfterDelete } from '../hooks/payload'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: {
    useAsTitle: 'firstName',
    group: 'Collections',
    description: 'View submitted job applications',
    defaultColumns: ['firstName', 'lastName', 'email', 'jobOpening', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // Allow public submissions
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [invalidateCacheAfterChange],
    afterDelete: [invalidateCacheAfterDelete],
  },
  fields: [
    {
      name: 'jobOpening',
      type: 'relationship',
      relationTo: 'job-openings',
      required: true,
      label: 'Job Position',
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Last Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      label: 'Phone Number',
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: 'Country and City',
    },
    {
      name: 'languageSkills',
      type: 'select',
      required: true,
      hasMany: true,
      options: [
        { label: 'Swedish', value: 'swedish' },
        { label: 'English', value: 'english' },
        { label: 'Finnish', value: 'finnish' },
        { label: 'Danish', value: 'danish' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Language Skills',
    },
    {
      name: 'securityCheckConsent',
      type: 'radio',
      required: true,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      defaultValue: 'no',
      label: 'Do you allow us to carry out a security check?',
    },
    {
      name: 'yearsOfExperience',
      type: 'text',
      required: true,
      label: 'Years of Experience in Sales/Cyber Security',
    },
    {
      name: 'swedishTechIndustry',
      type: 'radio',
      required: true,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      defaultValue: 'no',
      label: 'Have you previously worked within the Swedish tech industry or with Swedish tech clients?',
    },
    {
      name: 'strategicPlansExperience',
      type: 'radio',
      required: true,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      defaultValue: 'no',
      label: 'Do you have experience collaborating with a tech team to develop strategic Cyber Security plans?',
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Resume',
    },
    {
      name: 'additionalFiles',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: true,
      label: 'Additional Files',
    },
    {
      name: 'coverLetter',
      type: 'textarea',
      required: false,
      label: 'Cover Letter',
    },
    {
      name: 'privacyPolicyConsent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      label: 'Privacy Policy Consent',
    },
    {
      name: 'futureOpportunitiesConsent',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      label: 'Future Opportunities Consent',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      required: false,
      label: 'LinkedIn Profile URL',
    },
  ],
  timestamps: true,
}


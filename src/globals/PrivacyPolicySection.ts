import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const PrivacyPolicySection: GlobalConfig = {
  slug: 'privacy-policy-section',
  label: 'Privacy Policy Section',
  admin: {
    group: 'Privacy Policy',
    description: 'Manage Privacy Policy page content',
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
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Page Title',
          required: true,
          defaultValue: 'Privacy Policy',
        },
        {
          name: 'effectiveDate',
          type: 'text',
          label: 'Effective Date',
          required: true,
          defaultValue: '25 August 2025',
        },
      ],
    },
    {
      name: 'introduction',
      type: 'textarea',
      label: 'Introduction Text',
      required: true,
      defaultValue: 'Nordic Cyber Group (NCG) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect your information, and outlines your rights under applicable data protection laws, including the General Data Protection Regulation (GDPR).',
    },
    {
      name: 'privacyPolicySections',
      type: 'array',
      label: 'Privacy Policy Sections',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
      ],
      defaultValue: [
        {
          title: '1. Data We Collect',
          content: 'We collect information in three main categories:\n\n**Information you provide:** When you contact us through forms, submit career applications, or communicate directly with us, we may collect your name, email address, phone number, job title, CVs, and other information you voluntarily provide.\n\n**Automatically collected:** When you visit our website, we automatically collect technical information such as your IP address, device and browser details, usage patterns, and cookies.\n\n**Third-party sources:** We may receive information from publicly available professional sources such as LinkedIn, or from references during recruitment processes.',
        },
        {
          title: '2. How We Use Your Data',
          content: 'We use your personal data for the following purposes:\n\n• To respond to your inquiries and provide customer support\n• To deliver our services and fulfill contractual obligations\n• To send you marketing communications (with your consent)\n• To process career applications and manage recruitment\n• To comply with legal and regulatory requirements\n• To improve website security and prevent fraud',
        },
        {
          title: '3. Legal Basis for Processing',
          content: 'We process your personal data based on the following legal grounds:\n\n**Consent:** When you have given clear consent for specific purposes\n**Contract:** When processing is necessary to fulfill a contract with you\n**Legal obligation:** When we are required to comply with legal requirements\n**Legitimate interest:** When processing is necessary for our legitimate business interests',
        },
        {
          title: '4. Sharing Your Data',
          content: 'We do not sell your personal data. We may share your information with:\n\n• Trusted service providers who assist us in operating our business\n• Professional advisors such as lawyers and accountants\n• Regulators and government authorities when required by law\n• Other parties with your explicit consent',
        },
        {
          title: '5. Data Retention',
          content: 'We retain your personal data for different periods depending on the purpose:\n\n**Marketing data:** Until you unsubscribe or withdraw consent\n**Contract data:** For the duration of the contract plus any legal retention period\n**Recruitment data:** Up to 12 months unless you consent to longer retention',
        },
        {
          title: '6. Your Rights',
          content: 'Under data protection laws, you have the following rights:\n\n• Right to access your personal data\n• Right to rectification of inaccurate data\n• Right to deletion ("right to be forgotten")\n• Right to restrict or object to processing\n• Right to data portability\n• Right to withdraw consent at any time\n\nTo exercise these rights, please contact us at info@ncgrp.se',
        },
        {
          title: '7. Security',
          content: 'We implement industry-standard security measures to protect your personal data, including encryption, access controls, and regular security audits. However, no method of transmission over the internet is 100% secure.',
        },
        {
          title: '8. International Transfers',
          content: 'If we transfer your personal data outside the EU/EEA, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs), to protect your data in accordance with GDPR requirements.',
        },
        {
          title: '9. Updates',
          content: 'We may revise this Privacy Policy from time to time. Any updates will be posted on this page with a new effective date. We encourage you to review this policy periodically.',
        },
      ],
    },
    {
      name: 'cookiesPolicy',
      type: 'group',
      label: 'Cookies Policy',
      fields: [
        {
          name: 'introduction',
          type: 'textarea',
          label: 'What Are Cookies?',
          required: true,
          defaultValue: 'Cookies are small text files that are stored on your device when you visit our website. They help us improve functionality, analyze performance, and enhance your user experience.',
        },
        {
          name: 'sections',
          type: 'array',
          label: 'Cookies Policy Sections',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'content',
              type: 'textarea',
              required: true,
            },
          ],
          defaultValue: [
            {
              title: '1. Types of Cookies We Use',
              content: '**Essential Cookies:** Required for the website to function properly\n**Performance Cookies:** Help us understand how visitors use our website by collecting anonymized usage data\n**Functional Cookies:** Remember your preferences and settings to improve your experience\n**Marketing Cookies:** Used to deliver relevant content and measure campaign effectiveness (with your consent)',
            },
            {
              title: '2. Managing Cookies',
              content: 'You can manage or disable cookies through your browser settings. Please note that disabling essential cookies may affect the functionality of our website.',
            },
            {
              title: '3. Third-Party Cookies',
              content: 'We use trusted third-party services, such as Google Analytics, to analyze website usage and improve our services. These services may set their own cookies.',
            },
            {
              title: '4. Consent',
              content: 'When you first visit our website, a cookie consent banner will appear. By continuing to use our site, you consent to our use of cookies unless you change your settings.',
            },
            {
              title: '5. Updates',
              content: 'We may update this Cookies Policy from time to time. Any changes will be reflected on this page.',
            },
          ],
        },
      ],
    },
  ],
}

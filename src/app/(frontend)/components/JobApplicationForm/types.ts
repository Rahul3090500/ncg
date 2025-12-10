export interface Country {
  code: string
  flag: string
  name: string
}

export interface PhoneFormat {
  placeholder: string
  maxLength: number
}

export interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  location: string
  languageSkills: string[]
  securityCheckConsent: string
  yearsOfExperience: string
  swedishTechIndustry: string
  strategicPlansExperience: string
  resume: File | null
  additionalFiles: File[]
  coverLetter: string
  privacyPolicyConsent: boolean
  futureOpportunitiesConsent: boolean
  linkedinUrl: string
}

export type SubmitStatus = 'idle' | 'success' | 'error'


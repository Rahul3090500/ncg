#!/usr/bin/env node

/**
 * Add cache invalidation hooks to all globals
 * This script adds the hook import and hooks config to all global files
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const globalsDir = path.resolve(__dirname, '..', 'src', 'globals')
const globals = [
  'AboutUsSection.ts',
  'AboutStatsSection.ts',
  'AboutMissionSection.ts',
  'AboutCoreValuesSection.ts',
  'AboutTeamSection.ts',
  'AboutCTASection.ts',
  'BlogsPageHeroSection.ts',
  'CareerHeroSection.ts',
  'CareerStatsSection.ts',
  'CareerFindPlaceSection.ts',
  'CareerWorkHereSection.ts',
  'CareerTestimonialsSection.ts',
  'CareerLifeAtNCGSection.ts',
  'CareerSpotifySection.ts',
  'CareerJobSection.ts',
  'CaseStudiesPageSection.ts',
  'CaseStudiesPageHeroSection.ts',
  'CaseStudiesPageGridSection.ts',
  'JobsSection.ts',
  'PrivacyPolicySection.ts',
]

console.log('🔧 Adding cache invalidation hooks to all globals...\n')

let updatedCount = 0

for (const globalFile of globals) {
  const filePath = path.join(globalsDir, globalFile)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${globalFile}`)
    continue
  }

  let content = fs.readFileSync(filePath, 'utf8')

  // Skip if already has hook
  if (content.includes('invalidateCacheAfterGlobalChange')) {
    console.log(`✓ Already has hook: ${globalFile}`)
    continue
  }

  // Add import if not present
  if (!content.includes("from '../hooks/payload'")) {
    // Find the import line
    const importMatch = content.match(/^import type { GlobalConfig } from 'payload'/)
    if (importMatch) {
      content = content.replace(
        /^import type { GlobalConfig } from 'payload'/m,
        "import type { GlobalConfig } from 'payload'\nimport { invalidateCacheAfterGlobalChange } from '../hooks/payload'"
      )
    }
  }

  // Add hooks config
  // Find the access config
  const accessMatch = content.match(/access:\s*\{[^}]*\},/s)
  if (accessMatch) {
    // Check if hooks already exist
    if (!content.includes('hooks:')) {
      content = content.replace(
        /(access:\s*\{[^}]*\},)/s,
        `$1\n  hooks: {\n    afterChange: [invalidateCacheAfterGlobalChange],\n  },`
      )
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Added hook to: ${globalFile}`)
      updatedCount++
    } else {
      console.log(`⚠️  Already has hooks: ${globalFile}`)
    }
  } else {
    console.log(`⚠️  Could not find access config in: ${globalFile}`)
  }
}

console.log(`\n✅ Updated ${updatedCount} global files`)
console.log('🎉 All globals now have cache invalidation hooks!')

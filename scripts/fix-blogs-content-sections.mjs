import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pg from 'pg'
import fs from 'fs'

const { Client } = pg

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') })

console.log('🚀 Starting blogs contentSections table fix script...')
console.log(`📡 Database URI: ${process.env.DATABASE_URI ? 'Set' : 'Not set'}`)

// Use the same SSL resolution logic as payload.config.ts
function stripSslParams(uri) {
  if (!uri) return uri
  try {
    const u = new URL(uri)
    ;['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].forEach((p) => u.searchParams.delete(p))
    return u.toString()
  } catch {
    return uri
  }
}

function resolveCa() {
  const caPlain = process.env.PG_SSL_CA || ''
  if (caPlain.trim()) return caPlain
  const caBase64 = process.env.PG_SSL_CA_BASE64 || ''
  if (caBase64.trim()) return Buffer.from(caBase64.trim(), 'base64').toString('utf8')
  const caFile = process.env.PG_SSL_CA_BASE64_FILE || ''
  if (caFile.trim()) {
    const content = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', caFile.trim()), 'utf8').trim()
    return Buffer.from(content, 'base64').toString('utf8')
  }
  try {
    const fallback = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'infra/aws/rds-global-bundle.base64.txt'), 'utf8').trim()
    return Buffer.from(fallback, 'base64').toString('utf8')
  } catch {}
  return ''
}

async function fixBlogsContentSections() {
  const connectionString = stripSslParams(process.env.DATABASE_URI || process.env.POSTGRES_URL)
  const ca = resolveCa()
  const sslConfig = ca ? { ca, rejectUnauthorized: false } : process.env.NODE_ENV === 'production' ? true : { rejectUnauthorized: false }
  
  console.log(`🔍 SSL Config: ${ca ? 'Using CA certificate' : 'Using rejectUnauthorized: false'}`)
  
  const client = new Client({
    connectionString,
    ssl: sslConfig,
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Check if blogs_contentSections table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blogs_content_sections'
      )
    `)

    if (!tableCheck.rows[0].exists) {
      console.log('⚠️  blogs_content_sections table does not exist yet')
      console.log('   This is fine - Payload will create it with the correct structure')
      await client.end()
      return
    }

    console.log('🔄 Dropping old blogs_content_sections table structure...')
    
    // Drop all related tables in the correct order (child tables first)
    const tablesToDrop = [
      'blogs_content_sections_paragraphs',
      'blogs_content_sections_bullet_items',
      'blogs_content_sections_numbered_items',
      'blogs_content_sections',
    ]

    for (const tableName of tablesToDrop) {
      try {
        const existsCheck = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [tableName])

        if (existsCheck.rows[0].exists) {
          console.log(`   Dropping table: ${tableName}`)
          await client.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`)
          console.log(`   ✅ Dropped ${tableName}`)
        }
      } catch (error) {
        console.log(`   ⚠️  Error dropping ${tableName}: ${error.message}`)
        // Continue with other tables
      }
    }

    console.log('✅ Old table structure dropped successfully!')
    console.log('📝 Payload will recreate the tables with the new structure on next startup')

    await client.end()
    console.log('✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error fixing contentSections tables:', error)
    await client.end()
    process.exit(1)
  }
}

fixBlogsContentSections()


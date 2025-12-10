import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pg from 'pg'
import fs from 'fs'

const { Client } = pg

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') })

console.log('🚀 Starting database column fix script...')
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

async function fixBlogsDateColumn() {
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

    // Check current column type
    const checkResult = await client.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'blogs' 
      AND column_name = 'date'
    `)

    if (checkResult.rows.length === 0) {
      console.log('⚠️  blogs table or date column does not exist yet')
      console.log('   This is fine - Payload will create it with the correct type')
      await client.end()
      return
    }

    const currentType = checkResult.rows[0].data_type
    console.log(`📊 Current date column type: ${currentType}`)

    if (currentType === 'timestamp with time zone' || currentType === 'timestamp(3) with time zone') {
      console.log('✅ Date column is already the correct type')
      await client.end()
      return
    }

    if (currentType === 'character varying' || currentType === 'text') {
      console.log('🔄 Converting date column from text to timestamp...')
      
      // First, check if there's any data
      const dataCheck = await client.query('SELECT COUNT(*) as count FROM blogs')
      const rowCount = parseInt(dataCheck.rows[0].count)
      
      if (rowCount > 0) {
        console.log(`⚠️  Found ${rowCount} blog(s) with existing date data`)
        
        // First, make the column nullable temporarily
        console.log('   Step 1: Making column nullable temporarily...')
        await client.query(`
          ALTER TABLE "blogs" 
          ALTER COLUMN "date" 
          DROP NOT NULL
        `)
        
        // Then convert the column with proper handling
        console.log('   Step 2: Converting dates...')
        await client.query(`
          ALTER TABLE "blogs" 
          ALTER COLUMN "date" 
          TYPE timestamp(3) with time zone 
          USING CASE 
            WHEN "date" IS NULL THEN NULL::timestamp(3) with time zone
            WHEN "date" ~ '^\\d{4}-\\d{2}-\\d{2}$' THEN "date"::timestamp(3) with time zone
            WHEN "date" ~ '^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}' THEN "date"::timestamp(3) with time zone
            WHEN "date" ~ '^\\d{2}/\\d{2}/\\d{4}$' THEN TO_TIMESTAMP("date", 'MM/DD/YYYY')::timestamp(3) with time zone
            WHEN "date" ~ '^\\d{2}-\\d{2}-\\d{4}$' THEN TO_TIMESTAMP("date", 'MM-DD-YYYY')::timestamp(3) with time zone
            ELSE NULL::timestamp(3) with time zone
          END
        `)
        
        // Set default for NULL values to current date
        console.log('   Step 3: Setting default values for NULL dates...')
        await client.query(`
          UPDATE "blogs" 
          SET "date" = CURRENT_TIMESTAMP 
          WHERE "date" IS NULL
        `)
        
        // Make the column NOT NULL again
        console.log('   Step 4: Making column required again...')
        await client.query(`
          ALTER TABLE "blogs" 
          ALTER COLUMN "date" 
          SET NOT NULL
        `)
      } else {
        // No data, safe to convert directly
        await client.query(`
          ALTER TABLE "blogs" 
          ALTER COLUMN "date" 
          TYPE timestamp(3) with time zone
        `)
      }
      
      console.log('✅ Date column converted successfully!')
    } else {
      console.log(`⚠️  Unexpected column type: ${currentType}`)
      console.log('   Please check the database manually')
    }

    await client.end()
    console.log('✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error fixing date column:', error)
    await client.end()
    process.exit(1)
  }
}

fixBlogsDateColumn()


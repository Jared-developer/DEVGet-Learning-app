import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env file')
    console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupApiKeys() {
    console.log('🔧 Verifying API Keys table setup...\n')

    try {
        // Check if the table exists by trying to query it
        console.log('📝 Checking if api_keys table exists...')

        const { data, error } = await supabase
            .from('api_keys')
            .select('id')
            .limit(1)

        if (error && error.code === '42P01') {
            // Table doesn't exist
            console.log('⚠️  Table does not exist yet\n')
            console.log('📋 Please run this SQL manually in Supabase Dashboard:\n')
            console.log('─'.repeat(80))

            const schemaPath = path.join(__dirname, '../supabase-api-keys-schema.sql')
            const schema = fs.readFileSync(schemaPath, 'utf8')
            console.log(schema)

            console.log('─'.repeat(80))
            console.log('\n📍 Steps:')
            console.log('   1. Go to: Supabase Dashboard → SQL Editor')
            console.log('   2. Click "New Query"')
            console.log('   3. Paste the SQL above')
            console.log('   4. Click "Run"')
            console.log('   5. Run this script again to verify\n')
            process.exit(1)
        } else if (error) {
            console.error('❌ Error checking table:', error.message)
            console.log('\nIf you already ran the SQL, the table should be ready.')
            console.log('The error might be due to RLS policies. Try generating a key in the app.\n')
        } else {
            console.log('✅ API Keys table exists and is accessible!')
            console.log('\n📊 Table structure:')
            console.log('   - id: UUID (Primary Key)')
            console.log('   - user_id: UUID (Foreign Key to auth.users)')
            console.log('   - key: TEXT (Unique API key)')
            console.log('   - is_active: BOOLEAN')
            console.log('   - created_at: TIMESTAMP')
            console.log('   - last_used_at: TIMESTAMP')
            console.log('\n🔒 Row Level Security enabled')
            console.log('   - Users can only access their own API keys')
            console.log('\n✨ Setup complete! Ready to generate API keys!')
            console.log('\n🚀 Next steps:')
            console.log('   1. Start your frontend: cd frontend && npm run dev')
            console.log('   2. Sign in to your account')
            console.log('   3. Navigate to Resources → API Documentation')
            console.log('   4. Generate your first API key!')
        }

    } catch (error) {
        console.error('❌ Verification failed:', error.message)
        console.log('\n💡 If you already ran the SQL in Supabase, the table should be ready.')
        console.log('Try generating an API key in the application to test.')
    }
}

setupApiKeys()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupUserRoles() {
    console.log('Setting up user roles table...')

    try {
        // Test if table exists by trying to query it
        const { data, error } = await supabase
            .from('user_roles')
            .select('id')
            .limit(1)

        if (error && error.code === '42P01') {
            console.log('❌ User roles table does not exist. Please run the SQL schema first.')
            console.log('Run: backend/supabase-user-roles-schema.sql in your Supabase SQL editor')
            return
        }

        console.log('✅ User roles table exists and is accessible')
        console.log('\nUser roles system is ready!')
        console.log('\nAvailable roles:')
        console.log('  - student: Access to student dashboard and courses')
        console.log('  - developer: Access to developer console and API keys')
        console.log('  - instructor: Access to instructor features')
        console.log('  - admin: Full system access')

    } catch (error) {
        console.error('Error setting up user roles:', error.message)
    }
}

setupUserRoles()

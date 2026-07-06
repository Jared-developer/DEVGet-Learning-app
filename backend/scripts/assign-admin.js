import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') })

console.log('Loading environment variables...')
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables!')
    console.error('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing')
    console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
    console.error('\nMake sure backend/.env file exists with these variables.')
    process.exit(1)
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function assignAdminRole() {
    const targetEmail = 'mentor.idanganga@gmail.com'

    console.log('🔧 Assigning Admin Role')
    console.log('='.repeat(50))
    console.log(`📧 Target email: ${targetEmail}`)
    console.log('')

    try {
        // Step 1: Find user by email
        console.log('🔍 Step 1: Looking for user...')
        const { data: users, error: userError } = await supabase.auth.admin.listUsers()

        if (userError) {
            throw new Error(`Failed to list users: ${userError.message}`)
        }

        const targetUser = users.users.find(user => user.email === targetEmail)

        if (!targetUser) {
            console.log('❌ User not found!')
            console.log(`\nThe email "${targetEmail}" is not registered in the system.`)
            console.log('The user needs to sign up first before being assigned admin role.')
            console.log('\nTo resolve this:')
            console.log('1. Ask the user to sign up at your application')
            console.log('2. Then run this script again')
            return
        }

        console.log(`✅ User found: ${targetUser.email}`)
        console.log(`   User ID: ${targetUser.id}`)
        console.log(`   Created: ${new Date(targetUser.created_at).toLocaleString()}`)

        // Step 2: Check if user already has admin role
        console.log('\n🔍 Step 2: Checking existing roles...')
        const { data: existingRoles, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', targetUser.id)

        if (roleError) {
            throw new Error(`Failed to check existing roles: ${roleError.message}`)
        }

        const currentRoles = existingRoles.map(r => r.role)
        console.log(`   Current roles: ${currentRoles.length > 0 ? currentRoles.join(', ') : 'none'}`)

        if (currentRoles.includes('admin')) {
            console.log('✅ User already has admin role!')
            console.log('\n🎉 No action needed - user is already an admin.')
            return
        }

        // Step 3: Assign admin role
        console.log('\n➕ Step 3: Assigning admin role...')
        const { data: newRole, error: assignError } = await supabase
            .from('user_roles')
            .insert([{
                user_id: targetUser.id,
                role: 'admin'
            }])
            .select()

        if (assignError) {
            if (assignError.code === '23505') {
                console.log('✅ User already has admin role (duplicate prevented)')
            } else {
                throw new Error(`Failed to assign admin role: ${assignError.message}`)
            }
        } else {
            console.log('✅ Admin role assigned successfully!')
        }

        // Step 4: Verify the assignment
        console.log('\n🔍 Step 4: Verifying assignment...')
        const { data: updatedRoles, error: verifyError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', targetUser.id)

        if (verifyError) {
            throw new Error(`Failed to verify role assignment: ${verifyError.message}`)
        }

        const finalRoles = updatedRoles.map(r => r.role)
        console.log(`✅ Final roles: ${finalRoles.join(', ')}`)

        // Success message
        console.log('\n🎉 SUCCESS!')
        console.log('='.repeat(50))
        console.log(`📧 ${targetEmail} is now an admin!`)
        console.log('\n📋 Admin privileges include:')
        console.log('   • Full system access')
        console.log('   • User management')
        console.log('   • Course management')
        console.log('   • Role assignment')
        console.log('\n💡 The user can now access admin features when they sign in.')

    } catch (error) {
        console.error('\n❌ ERROR!')
        console.error('='.repeat(50))
        console.error(`Failed to assign admin role: ${error.message}`)
        console.error('\n🔧 Troubleshooting:')
        console.error('1. Check your Supabase environment variables')
        console.error('2. Ensure the user_roles table exists')
        console.error('3. Verify Supabase service role key permissions')
        process.exit(1)
    }
}

// Run the script
assignAdminRole()
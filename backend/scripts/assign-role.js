import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function assignRole() {
    const args = process.argv.slice(2)

    if (args.length < 2) {
        console.log('Usage: node assign-role.js <email> <role>')
        console.log('Roles: student, developer, instructor, admin')
        console.log('\nExample: node assign-role.js user@example.com developer')
        return
    }

    const [email, role] = args
    const validRoles = ['student', 'developer', 'instructor', 'admin']

    if (!validRoles.includes(role)) {
        console.log(`❌ Invalid role: ${role}`)
        console.log(`Valid roles: ${validRoles.join(', ')}`)
        return
    }

    try {
        // Find user by email
        const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()

        if (userError) {
            console.error('❌ Error fetching users:', userError.message)
            return
        }

        const user = users.find(u => u.email === email)

        if (!user) {
            console.log(`❌ User not found: ${email}`)
            return
        }

        console.log(`Found user: ${user.email} (${user.id})`)

        // Check existing roles
        const { data: existingRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)

        if (rolesError && rolesError.code !== 'PGRST116') {
            console.error('❌ Error checking existing roles:', rolesError.message)
            return
        }

        const currentRoles = existingRoles?.map(r => r.role) || []
        console.log(`Current roles: ${currentRoles.length > 0 ? currentRoles.join(', ') : 'none'}`)

        if (currentRoles.includes(role)) {
            console.log(`✅ User already has the ${role} role`)
            return
        }

        // Assign role
        const { error: insertError } = await supabase
            .from('user_roles')
            .insert([{
                user_id: user.id,
                role: role
            }])

        if (insertError) {
            console.error('❌ Error assigning role:', insertError.message)
            return
        }

        console.log(`✅ Successfully assigned ${role} role to ${email}`)
        console.log(`Updated roles: ${[...currentRoles, role].join(', ')}`)

    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

assignRole()

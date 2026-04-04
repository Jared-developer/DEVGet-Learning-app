import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function migrateExistingUsers() {
    console.log('🔄 Migrating existing users to role-based system...\n')

    try {
        // Assign student role to users with enrollments
        console.log('1. Assigning student role to users with enrollments...')
        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select('user_id')

        if (enrollError) {
            console.error('❌ Error fetching enrollments:', enrollError.message)
        } else {
            const uniqueStudentIds = [...new Set(enrollments.map(e => e.user_id))]
            console.log(`   Found ${uniqueStudentIds.length} unique students`)

            let studentCount = 0
            for (const userId of uniqueStudentIds) {
                const { error } = await supabase
                    .from('user_roles')
                    .insert([{ user_id: userId, role: 'student' }])
                    .select()

                if (error) {
                    if (error.code === '23505') {
                        // Already has role, skip
                        continue
                    }
                    console.error(`   ❌ Error assigning student role to ${userId}:`, error.message)
                } else {
                    studentCount++
                }
            }
            console.log(`   ✅ Assigned student role to ${studentCount} users\n`)
        }

        // Assign developer role to users with API keys
        console.log('2. Assigning developer role to users with API keys...')
        const { data: apiKeys, error: apiError } = await supabase
            .from('api_keys')
            .select('user_id')

        if (apiError) {
            if (apiError.code === '42P01') {
                console.log('   ℹ️  API keys table not found, skipping...\n')
            } else {
                console.error('❌ Error fetching API keys:', apiError.message)
            }
        } else {
            const uniqueDeveloperIds = [...new Set(apiKeys.map(k => k.user_id))]
            console.log(`   Found ${uniqueDeveloperIds.length} unique developers`)

            let developerCount = 0
            for (const userId of uniqueDeveloperIds) {
                const { error } = await supabase
                    .from('user_roles')
                    .insert([{ user_id: userId, role: 'developer' }])
                    .select()

                if (error) {
                    if (error.code === '23505') {
                        // Already has role, skip
                        continue
                    }
                    console.error(`   ❌ Error assigning developer role to ${userId}:`, error.message)
                } else {
                    developerCount++
                }
            }
            console.log(`   ✅ Assigned developer role to ${developerCount} users\n`)
        }

        // Check for users without any roles
        console.log('3. Checking for users without roles...')
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()

        if (usersError) {
            console.error('❌ Error fetching users:', usersError.message)
        } else {
            console.log(`   Total users in system: ${users.length}`)

            let usersWithoutRoles = 0
            for (const user of users) {
                const { data: roles, error: roleError } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', user.id)

                if (roleError) {
                    console.error(`   ❌ Error checking roles for ${user.email}:`, roleError.message)
                    continue
                }

                if (!roles || roles.length === 0) {
                    usersWithoutRoles++
                    console.log(`   ⚠️  User without role: ${user.email} (${user.id})`)
                }
            }

            if (usersWithoutRoles > 0) {
                console.log(`\n   ⚠️  ${usersWithoutRoles} users found without roles`)
                console.log('   You can assign roles manually using:')
                console.log('   node scripts/assign-role.js <email> <role>')
            } else {
                console.log('   ✅ All users have at least one role')
            }
        }

        console.log('\n✅ Migration complete!')

    } catch (error) {
        console.error('❌ Migration error:', error.message)
    }
}

migrateExistingUsers()

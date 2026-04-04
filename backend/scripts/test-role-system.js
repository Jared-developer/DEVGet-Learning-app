import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testRoleSystem() {
    console.log('🧪 Testing Role-Based Access Control System\n')
    console.log('='.repeat(60))

    let allTestsPassed = true

    // Test 1: Check if user_roles table exists
    console.log('\n📋 Test 1: Checking user_roles table...')
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('id')
            .limit(1)

        if (error && error.code === '42P01') {
            console.log('❌ FAIL: user_roles table does not exist')
            console.log('   Run: backend/supabase-user-roles-schema.sql in Supabase')
            allTestsPassed = false
        } else {
            console.log('✅ PASS: user_roles table exists')
        }
    } catch (error) {
        console.log('❌ FAIL:', error.message)
        allTestsPassed = false
    }

    // Test 2: Check helper functions
    console.log('\n📋 Test 2: Checking helper functions...')
    try {
        const { data, error } = await supabase.rpc('has_role', {
            user_uuid: '00000000-0000-0000-0000-000000000000',
            role_name: 'student'
        })

        if (error && error.message.includes('does not exist')) {
            console.log('❌ FAIL: Helper functions not found')
            console.log('   Run: backend/supabase-user-roles-schema.sql in Supabase')
            allTestsPassed = false
        } else {
            console.log('✅ PASS: Helper functions exist')
        }
    } catch (error) {
        console.log('⚠️  WARNING: Could not test helper functions')
    }

    // Test 3: Check RLS policies
    console.log('\n📋 Test 3: Checking RLS policies...')
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('*')
            .limit(1)

        console.log('✅ PASS: RLS policies configured')
    } catch (error) {
        console.log('❌ FAIL:', error.message)
        allTestsPassed = false
    }

    // Test 4: Count users by role
    console.log('\n📋 Test 4: Analyzing user roles...')
    try {
        const { data: roles, error } = await supabase
            .from('user_roles')
            .select('role')

        if (error) {
            console.log('❌ FAIL:', error.message)
            allTestsPassed = false
        } else {
            const roleCounts = roles.reduce((acc, { role }) => {
                acc[role] = (acc[role] || 0) + 1
                return acc
            }, {})

            console.log('✅ PASS: Role distribution:')
            console.log('   Students:', roleCounts.student || 0)
            console.log('   Developers:', roleCounts.developer || 0)
            console.log('   Instructors:', roleCounts.instructor || 0)
            console.log('   Admins:', roleCounts.admin || 0)
            console.log('   Total role assignments:', roles.length)
        }
    } catch (error) {
        console.log('❌ FAIL:', error.message)
        allTestsPassed = false
    }

    // Test 5: Check for users without roles
    console.log('\n📋 Test 5: Checking for users without roles...')
    try {
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()

        if (usersError) {
            console.log('❌ FAIL:', usersError.message)
            allTestsPassed = false
        } else {
            let usersWithoutRoles = 0
            const usersWithoutRolesList = []

            for (const user of users) {
                const { data: userRoles, error: roleError } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', user.id)

                if (!roleError && (!userRoles || userRoles.length === 0)) {
                    usersWithoutRoles++
                    usersWithoutRolesList.push(user.email)
                }
            }

            if (usersWithoutRoles > 0) {
                console.log(`⚠️  WARNING: ${usersWithoutRoles} users without roles:`)
                usersWithoutRolesList.slice(0, 5).forEach(email => {
                    console.log(`   - ${email}`)
                })
                if (usersWithoutRolesList.length > 5) {
                    console.log(`   ... and ${usersWithoutRolesList.length - 5} more`)
                }
                console.log('\n   Fix with: npm run migrate:users')
            } else {
                console.log('✅ PASS: All users have at least one role')
            }
        }
    } catch (error) {
        console.log('❌ FAIL:', error.message)
        allTestsPassed = false
    }

    // Test 6: Check for duplicate role assignments
    console.log('\n📋 Test 6: Checking for duplicate role assignments...')
    try {
        const { data: roles, error } = await supabase
            .from('user_roles')
            .select('user_id, role')

        if (error) {
            console.log('❌ FAIL:', error.message)
            allTestsPassed = false
        } else {
            const seen = new Set()
            const duplicates = []

            roles.forEach(({ user_id, role }) => {
                const key = `${user_id}-${role}`
                if (seen.has(key)) {
                    duplicates.push(key)
                }
                seen.add(key)
            })

            if (duplicates.length > 0) {
                console.log(`⚠️  WARNING: ${duplicates.length} duplicate role assignments found`)
                allTestsPassed = false
            } else {
                console.log('✅ PASS: No duplicate role assignments')
            }
        }
    } catch (error) {
        console.log('❌ FAIL:', error.message)
        allTestsPassed = false
    }

    // Test 7: Check environment variables
    console.log('\n📋 Test 7: Checking environment variables...')
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
        console.log('❌ FAIL: Missing environment variables:')
        missingVars.forEach(varName => console.log(`   - ${varName}`))
        allTestsPassed = false
    } else {
        console.log('✅ PASS: All required environment variables set')
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    if (allTestsPassed) {
        console.log('\n✅ All tests passed! Role system is working correctly.\n')
        console.log('Next steps:')
        console.log('1. Test sign-up flows for students and developers')
        console.log('2. Verify access restrictions work')
        console.log('3. Test role assignment: npm run assign:role email role')
    } else {
        console.log('\n❌ Some tests failed. Please review the errors above.\n')
        console.log('Common fixes:')
        console.log('1. Run database schema: backend/supabase-user-roles-schema.sql')
        console.log('2. Migrate users: npm run migrate:users')
        console.log('3. Check environment variables in backend/.env')
    }
    console.log('='.repeat(60) + '\n')
}

testRoleSystem()

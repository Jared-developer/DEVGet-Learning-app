import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key needed for admin operations
);

async function setAdminRole(email) {
    try {
        console.log(`Setting admin role for: ${email}`);

        // Get user by email
        const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();

        if (getUserError) {
            throw getUserError;
        }

        const user = users.users.find(u => u.email === email);

        if (!user) {
            console.error(`User not found with email: ${email}`);
            return;
        }

        // Update user metadata to add admin role
        const { data, error } = await supabase.auth.admin.updateUserById(
            user.id,
            {
                user_metadata: {
                    ...user.user_metadata,
                    role: 'admin'
                }
            }
        );

        if (error) {
            throw error;
        }

        console.log('✅ Admin role set successfully!');
        console.log('User details:', {
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata.role
        });
        console.log('\n⚠️  Please log out and log back in for changes to take effect.');

    } catch (error) {
        console.error('❌ Error setting admin role:', error.message);
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: node set-admin-role.js your-email@example.com');
    process.exit(1);
}

setAdminRole(email);

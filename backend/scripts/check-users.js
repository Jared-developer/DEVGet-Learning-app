import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('Checking users in database...\n');
  
  // Get all users from auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error fetching auth users:', authError);
    return;
  }
  
  console.log(`Total Auth Users: ${authUsers.users.length}\n`);
  
  // Get user roles if the table exists
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('*');
  
  if (rolesError && rolesError.code !== 'PGRST116') {
    console.error('Error fetching user roles:', rolesError);
  }
  
  // Display users with their details
  authUsers.users.forEach((user, index) => {
    console.log(`--- User ${index + 1} ---`);
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Email Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`Created: ${new Date(user.created_at).toLocaleDateString()}`);
    console.log(`Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);
    
    // Find role for this user
    if (userRoles && !rolesError) {
      const role = userRoles.find(r => r.user_id === user.id);
      console.log(`Role: ${role ? role.role : 'No role assigned'}`);
    }
    
    console.log('');
  });
  
  // Summary by role
  if (userRoles && !rolesError) {
    console.log('\n--- Role Summary ---');
    const roleCounts = {};
    userRoles.forEach(ur => {
      roleCounts[ur.role] = (roleCounts[ur.role] || 0) + 1;
    });
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`${role}: ${count}`);
    });
    console.log(`No role assigned: ${authUsers.users.length - userRoles.length}`);
  }
}

checkUsers().catch(console.error);

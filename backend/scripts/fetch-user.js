import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fetchUser() {
  const targetEmail = 'margaretmuchori49@gmail.com';

  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error('Error:', error.message); return; }

  const user = data.users.find(u => u.email === targetEmail);
  if (!user) { console.log(`User not found: ${targetEmail}`); return; }

  console.log('\n--- User Details ---');
  console.log(`ID:              ${user.id}`);
  console.log(`Email:           ${user.email}`);
  console.log(`Email Confirmed: ${user.email_confirmed_at ? 'Yes (' + new Date(user.email_confirmed_at).toLocaleString() + ')' : 'No'}`);
  console.log(`Created:         ${new Date(user.created_at).toLocaleString()}`);
  console.log(`Last Sign In:    ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);
  console.log(`Provider:        ${user.app_metadata?.provider || 'unknown'}`);

  // Fetch role
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  if (!rolesError) {
    console.log(`Role(s):         ${roles.length > 0 ? roles.map(r => r.role).join(', ') : 'None assigned'}`);
  }

  // Fetch profile if exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    console.log('\n--- Profile ---');
    console.log(JSON.stringify(profile, null, 2));
  }
}

fetchUser().catch(console.error);

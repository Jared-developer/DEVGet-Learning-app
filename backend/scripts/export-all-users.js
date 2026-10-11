import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Export ALL users from the system
 */
async function exportAllUsers() {
  try {
    console.log('🔍 Fetching ALL users from the system...\n');

    // Step 1: Get all auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error fetching users:', authError);
      return;
    }

    console.log(`✅ Found ${authData.users.length} users in auth system\n`);

    if (authData.users.length === 0) {
      console.log('❌ No users found');
      return;
    }

    const userIds = authData.users.map(u => u.id);

    // Step 2: Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds);

    if (rolesError && rolesError.code !== 'PGRST116') {
      console.error('⚠️  Error fetching user roles:', rolesError);
    }

    console.log(`✅ Found ${userRoles?.length || 0} user roles\n`);

    // Step 3: Build export data
    const exportData = [];

    authData.users.forEach(authUser => {
      const role = userRoles?.find(r => r.user_id === authUser.id);

      // Try multiple sources for the name
      let name = 'N/A';
      if (authUser.user_metadata?.full_name) {
        name = authUser.user_metadata.full_name;
      } else if (authUser.user_metadata?.name) {
        name = authUser.user_metadata.name;
      } else if (authUser.user_metadata?.first_name || authUser.user_metadata?.last_name) {
        name = `${authUser.user_metadata.first_name || ''} ${authUser.user_metadata.last_name || ''}`.trim();
      } else if (authUser.email) {
        name = authUser.email.split('@')[0];
      }

      exportData.push({
        name: name,
        email: authUser.email,
        userId: authUser.id,
        role: role?.role || 'student',
        emailConfirmed: authUser.email_confirmed_at ? 'Yes' : 'No',
        createdAt: new Date(authUser.created_at).toLocaleDateString(),
        lastSignIn: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at).toLocaleDateString() : 'Never'
      });
    });

    // Step 4: Generate CSV
    if (exportData.length === 0) {
      console.log('❌ No data to export');
      return;
    }

    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          // Escape commas, quotes, and newlines
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes(';')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `all-users-${timestamp}.csv`;
    const filepath = join(__dirname, filename);

    writeFileSync(filepath, csvContent);

    console.log('✅ Export completed successfully!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Total users: ${exportData.length}`);
    console.log(`   - Email confirmed: ${exportData.filter(u => u.emailConfirmed === 'Yes').length}`);
    console.log(`   - File location: ${filepath}`);
    console.log(`   - Filename: ${filename}\n`);
    
    // Display sample data
    console.log('📋 Sample data (first 5 rows):');
    exportData.slice(0, 5).forEach((user, idx) => {
      console.log(`\n${idx + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role} | Last Sign In: ${user.lastSignIn}`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the export
exportAllUsers().catch(console.error);

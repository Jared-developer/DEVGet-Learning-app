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
 * Export ALL students enrolled in AI & Machine Learning course
 */
async function exportAIGovernanceStudents() {
  try {
    console.log('🔍 Fetching ALL students enrolled in AI & Machine Learning course...\n');

    // Step 1: Get the AI/ML course ID
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .or('title.ilike.%AI%Machine Learning%,title.ilike.%Artificial Intelligence%');

    if (courseError) {
      console.error('❌ Error fetching courses:', courseError);
      return;
    }

    if (!courses || courses.length === 0) {
      console.log('❌ No AI & Machine Learning course found in database');
      return;
    }

    console.log('✅ Found AI/ML courses:');
    courses.forEach(course => console.log(`   - ${course.title} (${course.id})`));
    console.log('');

    const courseIds = courses.map(c => c.id);

    // Step 2: Get enrollments for AI/ML course
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('user_id, course_id, enrolled_at')
      .in('course_id', courseIds);

    if (enrollError) {
      console.error('❌ Error fetching enrollments:', enrollError);
      return;
    }

    console.log(`✅ Found ${enrollments?.length || 0} total enrollments\n`);

    if (!enrollments || enrollments.length === 0) {
      console.log('❌ No enrollments found for AI & Machine Learning course');
      return;
    }

    const userIds = enrollments.map(e => e.user_id);

    // Step 3: Get user details
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error fetching user details:', authError);
      return;
    }

    console.log(`✅ Found ${authData.users.length} auth users\n`);

    // Step 4: Get profiles table (may have additional name data)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, first_name, last_name')
      .in('id', userIds);

    if (profilesError && profilesError.code !== 'PGRST116') {
      console.error('⚠️  Error fetching profiles:', profilesError);
    }

    console.log(`✅ Found ${profiles?.length || 0} profiles\n`);

    // Step 5: Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds);

    if (rolesError && rolesError.code !== 'PGRST116') {
      console.error('⚠️  Error fetching user roles:', rolesError);
    }

    // Step 6: Build the export data
    const exportData = [];
    const orphanedUsers = [];

    userIds.forEach(userId => {
      const authUser = authData.users.find(u => u.id === userId);
      const enrollment = enrollments.find(e => e.user_id === userId);
      const role = userRoles?.find(r => r.user_id === userId);
      const profile = profiles?.find(p => p.id === userId);
      
      // If user was deleted from auth, add to orphaned list but still include in export
      if (!authUser) {
        orphanedUsers.push(userId);
        exportData.push({
          name: '[DELETED USER]',
          email: '[DELETED]',
          userId: userId,
          role: role?.role || 'unknown',
          enrolled: enrollment?.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : 'N/A'
        });
        return;
      }

      // Try multiple sources for the name
      let name = 'N/A';
      if (profile?.full_name) {
        name = profile.full_name;
      } else if (profile?.first_name || profile?.last_name) {
        name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      } else if (authUser.user_metadata?.full_name) {
        name = authUser.user_metadata.full_name;
      } else if (authUser.user_metadata?.name) {
        name = authUser.user_metadata.name;
      } else if (authUser.user_metadata?.first_name || authUser.user_metadata?.last_name) {
        name = `${authUser.user_metadata.first_name || ''} ${authUser.user_metadata.last_name || ''}`.trim();
      } else if (authUser.email) {
        // Use email username as fallback
        name = authUser.email.split('@')[0];
      }

      exportData.push({
        name: name,
        email: authUser.email,
        userId: userId,
        role: role?.role || 'student',
        enrolled: enrollment?.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : 'N/A'
      });
    });

    console.log(`✅ Processed ${exportData.length} enrolled students`);
    console.log(`   - Active users: ${exportData.length - orphanedUsers.length}`);
    console.log(`   - Deleted users: ${orphanedUsers.length}\n`);

    // Step 7: Generate CSV
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
          // Escape commas and quotes in values
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `ai-ml-all-students-${timestamp}.csv`;
    const filepath = join(__dirname, filename);

    writeFileSync(filepath, csvContent);

    console.log('✅ Export completed successfully!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Total students: ${exportData.length}`);
    console.log(`   - Active users: ${exportData.length - orphanedUsers.length}`);
    console.log(`   - Deleted users: ${orphanedUsers.length}`);
    console.log(`   - File location: ${filepath}`);
    console.log(`   - Filename: ${filename}\n`);
    
    // Display sample data
    console.log('📋 Sample data (first 5 rows):');
    exportData.slice(0, 5).forEach((student, idx) => {
      console.log(`\n${idx + 1}. ${student.name}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   Role: ${student.role} | Enrolled: ${student.enrolled}`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the export
exportAIGovernanceStudents().catch(console.error);

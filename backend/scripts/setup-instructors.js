const { supabase, supabaseAdmin } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

async function setupInstructors() {
    try {
        console.log('Setting up instructor system...\n');

        // Read and execute the schema
        const schemaPath = path.join(__dirname, '..', 'supabase-instructors-schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing instructor schema...');

        // Split by semicolons and execute each statement
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
            try {
                const { error } = await supabase.rpc('exec_sql', { sql: statement });
                if (error && !error.message.includes('already exists')) {
                    console.error('Statement error:', error.message);
                }
            } catch (err) {
                // Ignore "already exists" errors
                if (!err.message.includes('already exists')) {
                    console.error('Error:', err.message);
                }
            }
        }

        console.log('✓ Instructor schema setup complete\n');

        // Verify tables were created
        console.log('Verifying tables...');

        const tables = ['course_instructors', 'course_resources', 'class_sessions'];

        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`✗ Table ${table}: ${error.message}`);
            } else {
                console.log(`✓ Table ${table} is ready`);
            }
        }

        console.log('\n✓ Instructor system setup complete!');
        console.log('\nNext steps:');
        console.log('1. Use the admin panel to assign instructors to courses');
        console.log('2. Instructors can then manage their course content');
        console.log('3. Students will see resources and sessions for enrolled courses');

    } catch (error) {
        console.error('Setup error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    setupInstructors()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = { setupInstructors };

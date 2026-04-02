import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupCommunity() {
    try {
        console.log('🚀 Setting up community chat feature...\n');

        // Read the SQL schema file
        const schemaPath = join(__dirname, '../supabase-community-schema.sql');
        const schema = readFileSync(schemaPath, 'utf8');

        console.log('📝 Executing SQL schema...');

        // Split by semicolons and execute each statement
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
            if (statement.trim()) {
                const { error } = await supabase.rpc('exec_sql', { sql: statement });
                if (error && !error.message.includes('already exists')) {
                    console.error('Error executing statement:', error);
                }
            }
        }

        console.log('✅ Community schema created successfully!\n');

        // Test the setup by checking if the table exists
        const { data, error } = await supabase
            .from('community_messages')
            .select('count')
            .limit(1);

        if (error) {
            console.log('⚠️  Note: You may need to run the SQL manually in Supabase SQL Editor');
            console.log('📄 SQL file location: backend/supabase-community-schema.sql\n');
        } else {
            console.log('✅ Community messages table is ready!\n');
        }

        console.log('🎉 Community chat setup complete!');
        console.log('\nNext steps:');
        console.log('1. Restart your backend server');
        console.log('2. Navigate to a course you\'re enrolled in');
        console.log('3. Click the "Community" tab to start chatting!\n');

    } catch (error) {
        console.error('❌ Error setting up community:', error);
        console.log('\n📝 Manual Setup Instructions:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the contents of backend/supabase-community-schema.sql');
        console.log('4. Run the SQL script\n');
        process.exit(1);
    }
}

setupCommunity();

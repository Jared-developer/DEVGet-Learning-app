import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
    console.log('Testing Supabase connection...');
    console.log('URL:', process.env.SUPABASE_URL);

    // Try to fetch courses
    const { data, error } = await supabase.from('courses').select('*');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success! Found', data.length, 'courses');
        console.log('Courses:', data);
    }
}

testConnection();

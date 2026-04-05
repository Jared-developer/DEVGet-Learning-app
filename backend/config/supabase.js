import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
    throw new Error('Missing required Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
}

// Validate URL format
if (!supabaseUrl.match(/^https?:\/\//i)) {
    console.error('❌ Invalid SUPABASE_URL format:', supabaseUrl);
    throw new Error('SUPABASE_URL must be a valid HTTP or HTTPS URL');
}

console.log('✅ Supabase configuration loaded successfully');
console.log('📍 Supabase URL:', supabaseUrl);

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Admin client (same as supabase since we're using service role key)
export const supabaseAdmin = supabase;

export default supabase;

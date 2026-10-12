import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function listSignatures() {
    try {
        console.log('\n=== List Certificate Signatures ===\n');

        const certificateId = await question('Enter Certificate ID (or press Enter for all): ');

        let query = supabase
            .from('certificate_signatures')
            .select('*')
            .order('certificate_id')
            .order('slot_number');

        if (certificateId.trim()) {
            query = query.eq('certificate_id', certificateId.trim());
        }

        const { data, error } = await query;

        if (error) {
            console.log(`\n❌ Error fetching signatures: ${error.message}`);
            rl.close();
            return;
        }

        if (!data || data.length === 0) {
            console.log('\n📋 No signatures found');
            rl.close();
            return;
        }

        console.log(`\n📋 Found ${data.length} signature(s):\n`);

        data.forEach((sig, index) => {
            console.log(`${index + 1}. Certificate: ${sig.certificate_id}`);
            console.log(`   Slot: ${sig.slot_number}`);
            console.log(`   Name: ${sig.name}`);
            console.log(`   Title: ${sig.title}`);
            console.log(`   Confirmed: ${sig.confirmed ? '✓ Yes' : '✗ No (Draft)'}`);
            console.log(`   Created: ${new Date(sig.created_at).toLocaleString()}`);
            console.log(`   Updated: ${new Date(sig.updated_at).toLocaleString()}`);
            console.log('');
        });

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

listSignatures();

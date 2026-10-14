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

async function deleteAllSignatures() {
    try {
        console.log('\n=== Delete All Signatures for Certificate ===\n');

        const certificateId = await question('Enter Certificate ID: ');

        if (!certificateId) {
            console.log('❌ Certificate ID is required');
            rl.close();
            return;
        }

        // First, fetch all signatures for this certificate
        const { data: signatures, error: fetchError } = await supabase
            .from('certificate_signatures')
            .select('*')
            .eq('certificate_id', certificateId)
            .order('slot_number');

        if (fetchError) {
            console.log(`\n❌ Error fetching signatures: ${fetchError.message}`);
            rl.close();
            return;
        }

        if (!signatures || signatures.length === 0) {
            console.log(`\n❌ No signatures found for Certificate ID: ${certificateId}`);
            rl.close();
            return;
        }

        console.log(`\n📋 Found ${signatures.length} signature(s):\n`);
        signatures.forEach((sig, index) => {
            console.log(`${index + 1}. Slot ${sig.slot_number}: ${sig.name} - ${sig.title}`);
            console.log(`   Confirmed: ${sig.confirmed ? '✓ Yes' : '✗ No (Draft)'}`);
        });

        const confirm = await question('\n⚠️  Delete ALL signatures above? (yes/no): ');

        if (confirm.toLowerCase() !== 'yes') {
            console.log('\n❌ Deletion cancelled');
            rl.close();
            return;
        }

        // Delete all signatures
        const { error: deleteError } = await supabase
            .from('certificate_signatures')
            .delete()
            .eq('certificate_id', certificateId);

        if (deleteError) {
            console.log(`\n❌ Error deleting signatures: ${deleteError.message}`);
            rl.close();
            return;
        }

        console.log(`\n✅ Successfully deleted ${signatures.length} signature(s)!`);
        console.log('   All slots are now available for signing.');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

deleteAllSignatures();

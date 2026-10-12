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

async function deleteSignature() {
    try {
        console.log('\n=== Delete Certificate Signature ===\n');

        const certificateId = await question('Enter Certificate ID: ');
        const slotNumber = await question('Enter Slot Number (1, 2, or 3): ');

        if (!certificateId || !slotNumber) {
            console.log('❌ Certificate ID and Slot Number are required');
            rl.close();
            return;
        }

        const slot = parseInt(slotNumber);
        if (slot < 1 || slot > 3) {
            console.log('❌ Slot number must be 1, 2, or 3');
            rl.close();
            return;
        }

        // First, check if signature exists
        const { data: existing, error: fetchError } = await supabase
            .from('certificate_signatures')
            .select('*')
            .eq('certificate_id', certificateId)
            .eq('slot_number', slot)
            .single();

        if (fetchError || !existing) {
            console.log(`\n❌ No signature found for Certificate ID: ${certificateId}, Slot: ${slot}`);
            rl.close();
            return;
        }

        console.log('\n📋 Found signature:');
        console.log(`   Name: ${existing.name}`);
        console.log(`   Title: ${existing.title}`);
        console.log(`   Confirmed: ${existing.confirmed ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(existing.created_at).toLocaleString()}`);

        const confirm = await question('\n⚠️  Are you sure you want to delete this signature? (yes/no): ');

        if (confirm.toLowerCase() !== 'yes') {
            console.log('\n❌ Deletion cancelled');
            rl.close();
            return;
        }

        // Delete the signature
        const { error: deleteError } = await supabase
            .from('certificate_signatures')
            .delete()
            .eq('certificate_id', certificateId)
            .eq('slot_number', slot);

        if (deleteError) {
            console.log(`\n❌ Error deleting signature: ${deleteError.message}`);
            rl.close();
            return;
        }

        console.log('\n✅ Signature deleted successfully!');
        console.log(`   You can now re-add a signature to Slot ${slot}`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

deleteSignature();

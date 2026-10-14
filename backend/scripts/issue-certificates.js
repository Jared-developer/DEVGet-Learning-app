import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory (parent of scripts)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Issue certificates to a list of recipients
 * 
 * Usage:
 * node backend/scripts/issue-certificates.js <csv-file-path> <bootcamp-id>
 * 
 * Example:
 * node backend/scripts/issue-certificates.js recipients.csv ai-governance-bootcamp-1.0
 * 
 * CSV Format:
 * email,first_name,last_name
 * john@example.com,John,Doe
 * jane@example.com,Jane,Smith
 */

const generateCertificateId = (bootcampId, index) => {
    const year = new Date().getFullYear();
    const prefix = bootcampId.split('-')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    return `${prefix}-${year}-${String(index).padStart(4, '0')}`;
};

const parseCsvFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const recipients = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    });
    
    return recipients;
};

const issueCertificates = async (csvFilePath, bootcampId) => {
    console.log('📋 Starting certificate issuance process...\n');
    console.log(`   Bootcamp: ${bootcampId}`);
    console.log(`   CSV File: ${csvFilePath}\n`);

    // Parse CSV
    let recipients;
    try {
        recipients = parseCsvFile(csvFilePath);
        console.log(`✓ Parsed ${recipients.length} recipients from CSV\n`);
    } catch (error) {
        console.error('❌ Error parsing CSV file:', error.message);
        process.exit(1);
    }

    // Get existing certificates to find the next available index
    const { data: existingCerts } = await supabase
        .from('certificate_recipients')
        .select('certificate_id')
        .like('certificate_id', `${generateCertificateId(bootcampId, 1).split('-').slice(0, 2).join('-')}%`)
        .order('certificate_id', { ascending: false });

    let certIndex = 1;
    if (existingCerts && existingCerts.length > 0) {
        // Extract the highest number from existing certificates
        const numbers = existingCerts.map(cert => {
            const parts = cert.certificate_id.split('-');
            return parseInt(parts[parts.length - 1]);
        }).filter(n => !isNaN(n));
        
        if (numbers.length > 0) {
            certIndex = Math.max(...numbers) + 1;
        }
    }

    console.log(`📊 Starting certificate index: ${certIndex}\n`);

    const results = {
        success: [],
        errors: [],
        skipped: []
    };

    // Process each recipient
    for (const recipient of recipients) {
        const { email, first_name, last_name } = recipient;
        
        if (!email || !first_name || !last_name) {
            results.errors.push({
                email: email || 'unknown',
                error: 'Missing required fields (email, first_name, last_name)'
            });
            continue;
        }

        const recipientName = `${first_name} ${last_name}`;
        console.log(`Processing: ${recipientName} (${email})`);

        try {
            // Find user by email - fetch ALL users with pagination
            let allUsers = [];
            let page = 1;
            const perPage = 1000;
            let hasMore = true;

            while (hasMore) {
                const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
                    page,
                    perPage
                });
                
                if (userError) {
                    throw new Error(`Failed to fetch users: ${userError.message}`);
                }

                allUsers = allUsers.concat(userData.users);
                hasMore = userData.users.length === perPage;
                page++;
            }

            console.log(`   📊 Total users fetched: ${allUsers.length}`);
            console.log(`   🔍 Looking for email: ${email}`);
            
            const user = allUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

            if (!user) {
                results.skipped.push({
                    email,
                    name: recipientName,
                    reason: 'User not found in system'
                });
                console.log(`   ⚠️  Skipped: User not found\n`);
                continue;
            }

            const foundUser = user;

            // Check if certificate already exists
            const { data: existing } = await supabase
                .from('certificate_recipients')
                .select('certificate_id')
                .eq('user_id', foundUser.id)
                .eq('bootcamp_id', bootcampId)
                .single();

            if (existing) {
                results.skipped.push({
                    email,
                    name: recipientName,
                    certificateId: existing.certificate_id,
                    reason: 'Certificate already issued'
                });
                console.log(`   ⚠️  Skipped: Already has certificate ${existing.certificate_id}\n`);
                continue;
            }

            // Generate certificate ID
            const certificateId = generateCertificateId(bootcampId, certIndex++);
            const completionDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Issue certificate
            const { data: certificate, error: insertError } = await supabase
                .from('certificate_recipients')
                .insert({
                    user_id: foundUser.id,
                    bootcamp_id: bootcampId,
                    certificate_id: certificateId,
                    recipient_email: email,
                    recipient_name: recipientName,
                    completion_date: completionDate
                })
                .select()
                .single();

            if (insertError) {
                throw new Error(`Failed to insert certificate: ${insertError.message}`);
            }

            results.success.push({
                email,
                name: recipientName,
                certificateId
            });

            console.log(`   ✓ Issued certificate: ${certificateId}\n`);

        } catch (error) {
            results.errors.push({
                email,
                name: recipientName,
                error: error.message
            });
            console.log(`   ❌ Error: ${error.message}\n`);
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 CERTIFICATE ISSUANCE SUMMARY');
    console.log('='.repeat(60) + '\n');
    console.log(`✅ Successfully Issued: ${results.success.length}`);
    console.log(`⚠️  Skipped: ${results.skipped.length}`);
    console.log(`❌ Errors: ${results.errors.length}`);
    console.log(`📈 Total Processed: ${recipients.length}\n`);

    if (results.success.length > 0) {
        console.log('✅ SUCCESSFUL ISSUANCES:');
        results.success.forEach(r => {
            console.log(`   ${r.name} (${r.email}) - ${r.certificateId}`);
        });
        console.log('');
    }

    if (results.skipped.length > 0) {
        console.log('⚠️  SKIPPED:');
        results.skipped.forEach(r => {
            console.log(`   ${r.name} (${r.email}) - ${r.reason}${r.certificateId ? ` (${r.certificateId})` : ''}`);
        });
        console.log('');
    }

    if (results.errors.length > 0) {
        console.log('❌ ERRORS:');
        results.errors.forEach(r => {
            console.log(`   ${r.name} (${r.email}) - ${r.error}`);
        });
        console.log('');
    }

    console.log('='.repeat(60));
};

// Main execution
const main = async () => {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('\n❌ Error: Missing required arguments\n');
        console.log('Usage:');
        console.log('  node backend/scripts/issue-certificates.js <csv-file-path> <bootcamp-id>\n');
        console.log('Example:');
        console.log('  node backend/scripts/issue-certificates.js recipients.csv ai-governance-bootcamp-1.0\n');
        console.log('CSV Format:');
        console.log('  email,first_name,last_name');
        console.log('  john@example.com,John,Doe');
        console.log('  jane@example.com,Jane,Smith\n');
        process.exit(1);
    }

    const [csvFilePath, bootcampId] = args;

    // Validate file exists
    if (!fs.existsSync(csvFilePath)) {
        console.error(`\n❌ Error: CSV file not found: ${csvFilePath}\n`);
        process.exit(1);
    }

    await issueCertificates(csvFilePath, bootcampId);
};

main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});

#!/usr/bin/env node

/**
 * Generate Signatory Links for Certificates
 * Usage: node backend/scripts/generate-signatory-links.js CERT-2026-001
 */

const certificateId = process.argv[2];
const baseUrl = 'https://dev-get-learning-app.vercel.app';

if (!certificateId) {
    console.error('❌ Error: Certificate ID is required');
    console.log('\nUsage: node backend/scripts/generate-signatory-links.js CERT-2026-001\n');
    process.exit(1);
}

const signatories = [
    { name: 'Signatory 1', slot: 1 },
    { name: 'Signatory 2', slot: 2 },
    { name: 'Signatory 3', slot: 3 }
];

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║           📜 Certificate Signatory Links                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');
console.log(`Certificate ID: ${certificateId}\n`);

signatories.forEach(sig => {
    const link = `${baseUrl}/signatory/${certificateId}?slot=${sig.slot}`;
    console.log(`🔗 ${sig.name}:`);
    console.log(`   ${link}\n`);
});

console.log('─────────────────────────────────────────────────────────────────');
console.log('\n📋 Email Template:\n');
console.log(`Subject: Certificate Signature Request - AI Governance Bootcamp

Dear [Signatory Name],

You are requested to add your signature to the AI Governance Bootcamp certificate for [Student Name].

Please click the link below to review and sign:
[PASTE_LINK_HERE]

Instructions:
1. Review the certificate details
2. Click "Add Signature" button
3. Enter your full name and title
4. Draw your signature on the canvas
5. Click "Confirm & Lock" when satisfied

⚠️ Important: Once you confirm, your signature cannot be changed.

If you have any questions, please contact us.

Best regards,
DEVGet Learning Team
`);

console.log('─────────────────────────────────────────────────────────────────\n');
console.log('✅ Links generated successfully!\n');

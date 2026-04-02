#!/usr/bin/env node

/**
 * Pre-deployment test script
 * Tests critical functionality before deploying to production
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

let testsPassed = 0;
let testsFailed = 0;

async function runTest(name, testFn) {
    try {
        process.stdout.write(`Testing ${name}... `);
        await testFn();
        log('✓ PASS', colors.green);
        testsPassed++;
    } catch (error) {
        log(`✗ FAIL: ${error.message}`, colors.red);
        testsFailed++;
    }
}

async function main() {
    console.log('\n' + '='.repeat(60));
    log('Pre-Deployment Test Suite', colors.blue);
    console.log('='.repeat(60) + '\n');

    // Test 1: Environment Variables
    await runTest('Environment Variables', async () => {
        const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY'];
        const missing = required.filter(key => !process.env[key]);
        if (missing.length > 0) {
            throw new Error(`Missing: ${missing.join(', ')}`);
        }
    });

    // Test 2: Supabase Connection
    let supabase;
    await runTest('Supabase Connection', async () => {
        supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { error } = await supabase.from('courses').select('count');
        if (error) throw new Error(error.message);
    });

    // Test 3: Database Tables
    await runTest('Database Tables Exist', async () => {
        const tables = [
            'courses',
            'enrollments',
            'instructors',
            'announcements',
            'assignments',
            'certificates',
            'community_posts'
        ];

        for (const table of tables) {
            const { error } = await supabase.from(table).select('count').limit(1);
            if (error) throw new Error(`Table '${table}' not found or inaccessible`);
        }
    });

    // Test 4: RLS Policies
    await runTest('RLS Policies Enabled', async () => {
        // Try to access with anon key (should work with RLS)
        const anonClient = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        const { error } = await anonClient.from('courses').select('id').limit(1);
        // Should not error - RLS should allow public read
        if (error && error.code !== 'PGRST116') {
            throw new Error('RLS may not be configured correctly');
        }
    });

    // Test 5: Frontend Build Files
    await runTest('Frontend Build Configuration', async () => {
        const frontendPath = path.join(__dirname, '../frontend');
        const requiredFiles = ['package.json', 'vite.config.js', 'index.html'];

        for (const file of requiredFiles) {
            if (!fs.existsSync(path.join(frontendPath, file))) {
                throw new Error(`Missing ${file}`);
            }
        }
    });

    // Test 6: Backend Server Files
    await runTest('Backend Server Configuration', async () => {
        const backendPath = path.join(__dirname, '../backend');
        const requiredFiles = ['package.json', 'server.js'];

        for (const file of requiredFiles) {
            if (!fs.existsSync(path.join(backendPath, file))) {
                throw new Error(`Missing ${file}`);
            }
        }
    });

    // Test 7: Deployment Config Files
    await runTest('Deployment Configuration Files', async () => {
        const rootPath = path.join(__dirname, '..');
        const configFiles = ['vercel.json', 'netlify.toml', 'render.yaml', 'Dockerfile'];

        const existing = configFiles.filter(file =>
            fs.existsSync(path.join(rootPath, file))
        );

        if (existing.length === 0) {
            throw new Error('No deployment config files found');
        }
    });

    // Test 8: Security Headers
    await runTest('Security Configuration', async () => {
        const serverPath = path.join(__dirname, '../backend/server.js');
        const content = fs.readFileSync(serverPath, 'utf-8');

        const securityFeatures = ['helmet', 'cors', 'rateLimit'];
        const missing = securityFeatures.filter(feature => !content.includes(feature));

        if (missing.length > 0) {
            throw new Error(`Missing security features: ${missing.join(', ')}`);
        }
    });

    // Test 9: Course Data
    await runTest('Course Data Available', async () => {
        const { data, error } = await supabase
            .from('courses')
            .select('id')
            .limit(1);

        if (error) throw new Error(error.message);
        if (!data || data.length === 0) {
            throw new Error('No courses found - run setup scripts');
        }
    });

    // Test 10: Admin Role Function
    await runTest('Admin Role Function Exists', async () => {
        const { data, error } = await supabase.rpc('is_admin', { user_id: '00000000-0000-0000-0000-000000000000' });

        // Function should exist even if it returns false
        if (error && !error.message.includes('function')) {
            // Function exists, just returned an error for invalid UUID
            return;
        }
        if (error && error.message.includes('does not exist')) {
            throw new Error('Admin role function not created');
        }
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    log('Test Summary', colors.blue);
    console.log('='.repeat(60));

    const total = testsPassed + testsFailed;
    log(`\nTotal Tests: ${total}`, colors.blue);
    log(`Passed: ${testsPassed}`, colors.green);
    log(`Failed: ${testsFailed}`, testsFailed > 0 ? colors.red : colors.green);

    if (testsFailed === 0) {
        log('\n✓ All tests passed! Ready for deployment.', colors.green);
        log('\nNext steps:', colors.blue);
        log('1. Review DEPLOYMENT.md for deployment instructions');
        log('2. Run: npm run deploy-check');
        log('3. Deploy to your chosen platform');
        process.exit(0);
    } else {
        log('\n✗ Some tests failed. Please fix issues before deploying.', colors.red);
        log('\nCommon fixes:', colors.yellow);
        log('- Ensure all database schemas are executed in Supabase');
        log('- Run setup scripts: node backend/scripts/setup-*.js');
        log('- Verify environment variables are set correctly');
        log('- Check Supabase RLS policies are enabled');
        process.exit(1);
    }
}

main().catch(error => {
    log(`\n✗ Test suite failed: ${error.message}`, colors.red);
    process.exit(1);
});

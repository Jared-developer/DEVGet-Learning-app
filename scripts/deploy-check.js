#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Checks if all required configurations are in place
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

let errors = 0;
let warnings = 0;

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
    const fullPath = path.join(rootDir, filePath);
    if (fs.existsSync(fullPath)) {
        log(`✓ ${description}`, colors.green);
        return true;
    } else {
        log(`✗ ${description} - Missing: ${filePath}`, colors.red);
        errors++;
        return false;
    }
}

function checkEnvFile(filePath, requiredVars) {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
        log(`✗ Environment file missing: ${filePath}`, colors.red);
        errors++;
        return;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const missingVars = [];

    requiredVars.forEach(varName => {
        const regex = new RegExp(`^${varName}=.+`, 'm');
        if (!regex.test(content)) {
            missingVars.push(varName);
        }
    });

    if (missingVars.length === 0) {
        log(`✓ ${filePath} has all required variables`, colors.green);
    } else {
        log(`✗ ${filePath} missing variables: ${missingVars.join(', ')}`, colors.red);
        errors++;
    }
}

function checkPackageJson(filePath) {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
        log(`✗ package.json missing: ${filePath}`, colors.red);
        errors++;
        return;
    }

    try {
        const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        if (!pkg.scripts || !pkg.scripts.start) {
            log(`⚠ ${filePath} missing 'start' script`, colors.yellow);
            warnings++;
        } else {
            log(`✓ ${filePath} has start script`, colors.green);
        }

        if (!pkg.dependencies) {
            log(`✗ ${filePath} has no dependencies`, colors.red);
            errors++;
        } else {
            log(`✓ ${filePath} has dependencies`, colors.green);
        }
    } catch (error) {
        log(`✗ ${filePath} is invalid JSON`, colors.red);
        errors++;
    }
}

console.log('\n' + '='.repeat(60));
log('DEVGet Learning Platform - Deployment Readiness Check', colors.blue);
console.log('='.repeat(60) + '\n');

// Check backend files
log('\n📦 Backend Files:', colors.blue);
checkFile('backend/package.json', 'Backend package.json');
checkFile('backend/server.js', 'Backend server.js');
checkFile('backend/.env.example', 'Backend .env.example');
checkPackageJson('backend/package.json');

// Check frontend files
log('\n📦 Frontend Files:', colors.blue);
checkFile('frontend/package.json', 'Frontend package.json');
checkFile('frontend/index.html', 'Frontend index.html');
checkFile('frontend/.env.example', 'Frontend .env.example');
checkPackageJson('frontend/package.json');

// Check deployment configs
log('\n🚀 Deployment Configurations:', colors.blue);
checkFile('vercel.json', 'Vercel configuration');
checkFile('netlify.toml', 'Netlify configuration');
checkFile('render.yaml', 'Render configuration');
checkFile('Dockerfile', 'Docker configuration');
checkFile('docker-compose.yml', 'Docker Compose configuration');

// Check documentation
log('\n📚 Documentation:', colors.blue);
checkFile('DEPLOYMENT.md', 'Deployment guide');
checkFile('PRODUCTION-CHECKLIST.md', 'Production checklist');
checkFile('README.md', 'Backend README');
checkFile('frontend/README.md', 'Frontend README');

// Check database schemas
log('\n🗄️  Database Schemas:', colors.blue);
checkFile('backend/supabase-schema.sql', 'Main schema');
checkFile('backend/supabase-instructors-schema.sql', 'Instructors schema');
checkFile('backend/supabase-announcements-schema.sql', 'Announcements schema');
checkFile('backend/supabase-admissions-schema.sql', 'Admissions schema');
checkFile('backend/supabase-assignments-schema.sql', 'Assignments schema');
checkFile('backend/supabase-certificates-schema.sql', 'Certificates schema');
checkFile('backend/supabase-community-schema.sql', 'Community schema');

// Check environment variables (examples)
log('\n🔐 Environment Configuration:', colors.blue);
const backendRequiredVars = [
    'PORT',
    'NODE_ENV',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY',
    'JWT_SECRET',
    'FRONTEND_URL'
];
checkEnvFile('backend/.env.example', backendRequiredVars);

const frontendRequiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_API_URL'
];
checkEnvFile('frontend/.env.example', frontendRequiredVars);

// Check for common issues
log('\n⚠️  Common Issues Check:', colors.blue);

// Check if node_modules exist (should not be in repo)
if (fs.existsSync(path.join(rootDir, 'backend/node_modules'))) {
    log('⚠ backend/node_modules exists (should be in .gitignore)', colors.yellow);
    warnings++;
}
if (fs.existsSync(path.join(rootDir, 'frontend/node_modules'))) {
    log('⚠ frontend/node_modules exists (should be in .gitignore)', colors.yellow);
    warnings++;
}

// Check .gitignore
if (checkFile('.gitignore', 'Git ignore file')) {
    const gitignore = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf-8');
    const requiredIgnores = ['node_modules', '.env', 'dist', 'build'];
    const missingIgnores = requiredIgnores.filter(item => !gitignore.includes(item));

    if (missingIgnores.length === 0) {
        log('✓ .gitignore has all required entries', colors.green);
    } else {
        log(`⚠ .gitignore missing: ${missingIgnores.join(', ')}`, colors.yellow);
        warnings++;
    }
}

// Summary
console.log('\n' + '='.repeat(60));
log('Summary:', colors.blue);
console.log('='.repeat(60));

if (errors === 0 && warnings === 0) {
    log('\n✓ All checks passed! Ready for deployment.', colors.green);
    process.exit(0);
} else {
    if (errors > 0) {
        log(`\n✗ ${errors} error(s) found. Please fix before deploying.`, colors.red);
    }
    if (warnings > 0) {
        log(`⚠ ${warnings} warning(s) found. Review before deploying.`, colors.yellow);
    }

    log('\nRecommended actions:', colors.blue);
    log('1. Review DEPLOYMENT.md for detailed instructions', colors.reset);
    log('2. Check PRODUCTION-CHECKLIST.md for deployment steps', colors.reset);
    log('3. Ensure all environment variables are configured', colors.reset);
    log('4. Run database migrations in Supabase', colors.reset);

    process.exit(errors > 0 ? 1 : 0);
}

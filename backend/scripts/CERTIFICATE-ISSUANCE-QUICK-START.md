# Certificate Issuance Quick Start Guide

## Prerequisites
- ✅ Database migration completed (certificate_recipients table exists)
- ✅ Recipients have user accounts in the system
- ✅ CSV file with recipient information prepared

## Quick Steps

### 1. Prepare CSV File

Create `recipients.csv`:
```csv
email,first_name,last_name
john@example.com,John,Doe
jane@example.com,Jane,Smith
```

### 2. Run Issuance Script

```bash
node backend/scripts/issue-certificates.js recipients.csv ai-governance-bootcamp-1.0
```

### 3. Verify Results
Check the console output for:
- ✅ Number of certificates issued
- ⚠️ Skipped entries (users not found or already have certificates)
- ❌ Errors

### 4. Recipients Can Now:
1. Log into LMS
2. Click "Certificates" in sidebar
3. Click "View Certificate" on AI GOVERNANCE BOOTCAMP 1.0
4. Download PDF or share on LinkedIn/X

## Common Commands

### Issue certificates
```bash
node backend/scripts/issue-certificates.js recipients.csv ai-governance-bootcamp-1.0
```

### Check existing certificates in database
```sql
SELECT * FROM certificate_recipients;
```

### Delete all certificates for a bootcamp (Supabase SQL)
```sql
DELETE FROM certificate_recipients WHERE bootcamp_id = 'ai-governance-bootcamp-1.0';
```

### Check specific user's certificates
```sql
SELECT * FROM certificate_recipients WHERE recipient_email = 'user@example.com';
```

## CSV Format Rules
- Must have header row: `email,first_name,last_name`
- All three fields required
- Email must match existing user account
- No special characters in names (except spaces and hyphens)

## Error Handling
- **User not found**: Email doesn't match any account → Skip
- **Already issued**: User already has certificate → Skip
- **Database error**: Connection issues → Error logged

## Testing

Test with a single user first:
```csv
email,first_name,last_name
your.email@example.com,Your,Name
```

Then verify:
1. Certificate appears in modal
2. Can view certificate preview
3. Can download PDF
4. Share buttons work

## Support
See `BOOTCAMP-CERTIFICATE-ISSUANCE-SYSTEM.md` for full documentation.

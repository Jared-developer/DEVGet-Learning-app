# Bootcamp Certificate Issuance System

## Overview
This system allows administrators to issue certificates to bootcamp participants via a script. Recipients can then view, download (PDF), and share their certificates on LinkedIn and X (Twitter) directly from the LMS.

## Features
- ✅ **Script-based issuance** - Issue certificates to multiple recipients via CSV
- ✅ **Access control** - Only certificate recipients can view their certificates
- ✅ **Unique certificate IDs** - Each certificate has a unique identifier
- ✅ **Download as PDF** - High-quality PDF download with proper formatting
- ✅ **Social sharing** - Share directly to LinkedIn and X (Twitter)
- ✅ **Certificate preview** - Full-screen preview with all details
- ✅ **Digital signatures** - Support for signatory signatures (already implemented)

---

## Setup Instructions

### 1. Database Setup
Run the SQL migration to create the certificate recipients table:

```bash
# In Supabase SQL Editor, run:
cat backend/migrations/create-certificate-recipients-table.sql
```

Or copy and paste the contents of `backend/migrations/create-certificate-recipients-table.sql` into the Supabase SQL Editor and execute.

### 2. Prepare Recipient CSV File
Create a CSV file with recipient information in this format:

**Format:**
```csv
email,first_name,last_name
john.doe@example.com,John,Doe
jane.smith@example.com,Jane,Smith
alice.johnson@example.com,Alice,Johnson
```

**Important Notes:**
- First row must be headers: `email,first_name,last_name`
- All three columns are required
- Email must match existing user accounts in the system
- Recipients must have accounts before certificates can be issued

### 3. Issue Certificates

Run the certificate issuance script:

```bash
node backend/scripts/issue-certificates.js <csv-file-path> <bootcamp-id>
```

**Example:**
```bash
node backend/scripts/issue-certificates.js recipients.csv ai-governance-bootcamp-1.0
```

**Bootcamp IDs:**
- `ai-governance-bootcamp-1.0` - AI Governance and Digital Safety Bootcamp 1.0
- (Add more bootcamp IDs as needed)

**Script Output:**
```
📋 Starting certificate issuance process...

   Bootcamp: ai-governance-bootcamp-1.0
   CSV File: recipients.csv

✓ Parsed 10 recipients from CSV

Processing: John Doe (john.doe@example.com)
   ✓ Issued certificate: AGB-2026-0001

Processing: Jane Smith (jane.smith@example.com)
   ✓ Issued certificate: AGB-2026-0002

============================================================
📊 CERTIFICATE ISSUANCE SUMMARY
============================================================

✅ Successfully Issued: 8
⚠️  Skipped: 1
❌ Errors: 1
📈 Total Processed: 10

✅ SUCCESSFUL ISSUANCES:
   John Doe (john.doe@example.com) - AGB-2026-0001
   Jane Smith (jane.smith@example.com) - AGB-2026-0002
   ...

⚠️  SKIPPED:
   Bob Wilson (bob@example.com) - User not found in system

❌ ERRORS:
   Alice Error (alice@error.com) - Database connection failed

============================================================
```

---

## How It Works for Recipients

### 1. Navigate to Certificates Modal
Recipients log into the LMS and navigate to their dashboard. From the sidebar, they click on:
- **"My Certificates"** or **"Certificates"** button

### 2. View Available Certificates
In the Certificates Modal, they will see:
- **Bootcamp Certificates** section (highlighted in purple/gradient)
- List of all bootcamps they've received certificates for
- Each certificate shows:
  - Bootcamp name
  - Issue date
  - Certificate ID
  - "View Certificate" button

### 3. Click on Bootcamp Certificate
When they click **"View Certificate"** on "AI GOVERNANCE BOOTCAMP 1.0":
- They are taken to the full certificate preview page
- Shows their full certificate with:
  - Their name
  - Completion date
  - Unique certificate ID
  - QR code for verification
  - Digital signatures from signatories

### 4. Download and Share Options
On the certificate preview page, recipients can:

**Download as PDF:**
- Click "Download PDF" button
- High-quality PDF is generated and downloaded
- Filename includes their name and certificate ID

**Share on LinkedIn:**
- Click "LinkedIn" button
- Opens LinkedIn share dialog
- Pre-filled with professional message about completion
- Includes certificate link for verification

**Share on X (Twitter):**
- Click "Share on X" button
- Opens Twitter/X share dialog
- Pre-filled with congratulatory message and hashtags
- Includes certificate link

---

## Access Control

### Who Can See Certificates?
- ✅ **Only recipients** - Users can only see certificates issued to them
- ✅ **Verified by user ID** - Backend verifies the certificate belongs to the logged-in user
- ❌ **Non-recipients** - Users without issued certificates cannot access any certificates
- ❌ **Other users' certificates** - Users cannot view certificates belonging to others

### Technical Implementation
```javascript
// Backend verifies ownership
if (certificate.user_id !== user.id) {
    return res.status(403).json({ error: 'Access denied' });
}

// Frontend checks access
if (data.certificate.user_id !== user.id) {
    setError('You do not have access to this certificate');
    return;
}
```

---

## Certificate ID Format

Certificate IDs are automatically generated in this format:

**Format:** `{PREFIX}-{YEAR}-{NUMBER}`

**Examples:**
- `AGB-2026-0001` - AI Governance Bootcamp, 2026, Certificate #1
- `AGB-2026-0002` - AI Governance Bootcamp, 2026, Certificate #2

**Prefix Generation:**
- Takes first letter of each word in bootcamp ID
- Example: `ai-governance-bootcamp-1.0` → `AGB`

---

## Adding New Bootcamps

To add support for new bootcamps:

### 1. Update Frontend Modal
Edit `frontend/src/components/CertificatesModal.jsx`:

```javascript
const bootcamps = {
    'ai-governance-bootcamp-1.0': {
        title: 'AI GOVERNANCE BOOTCAMP 1.0',
        description: 'AI Governance and Digital Safety',
        color: 'from-purple-500 to-purple-700'
    },
    'your-new-bootcamp-id': {
        title: 'YOUR BOOTCAMP TITLE',
        description: 'Bootcamp Description',
        color: 'from-blue-500 to-blue-700'
    }
}
```

### 2. Update Certificate Preview (Optional)
If the new bootcamp needs different certificate styling, update:
`frontend/src/pages/BootcampCertificatePreview.jsx`

### 3. Issue Certificates
Use the same script with the new bootcamp ID:

```bash
node backend/scripts/issue-certificates.js recipients.csv your-new-bootcamp-id
```

---

## API Endpoints

### Get User's Certificates
```http
GET /api/certificate-recipients/user/:userId
```

**Response:**
```json
{
    "success": true,
    "certificates": [
        {
            "id": "uuid",
            "user_id": "uuid",
            "bootcamp_id": "ai-governance-bootcamp-1.0",
            "certificate_id": "AGB-2026-0001",
            "recipient_email": "john@example.com",
            "recipient_name": "John Doe",
            "issued_at": "2026-10-14T10:00:00Z",
            "completion_date": "October 14, 2026"
        }
    ]
}
```

### Get Certificate by ID
```http
GET /api/certificate-recipients/:certificateId
```

**Response:**
```json
{
    "success": true,
    "certificate": {
        "id": "uuid",
        "certificate_id": "AGB-2026-0001",
        "recipient_name": "John Doe",
        ...
    }
}
```

### Check Bootcamp Certificate
```http
GET /api/certificate-recipients/bootcamp/:bootcampId/user/:userId
```

**Response:**
```json
{
    "success": true,
    "hasCertificate": true,
    "certificate": { ... }
}
```

---

## Troubleshooting

### "User not found in system"
**Problem:** The email in CSV doesn't match any user account.

**Solution:**
- Verify the email is correct
- Check if the user has signed up
- Ensure user account exists before issuing certificates

### "Certificate already issued"
**Problem:** User already has a certificate for this bootcamp.

**Solution:**
- This is expected behavior (prevents duplicates)
- If you need to reissue, delete the old certificate first in Supabase
- Or use a different bootcamp ID

### "Access denied" when viewing certificate
**Problem:** User is trying to view someone else's certificate.

**Solution:**
- This is working as intended (security feature)
- Users can only view their own certificates
- Verify they're logged in with the correct account

### Certificate not appearing in modal
**Problem:** Certificate was issued but not showing up.

**Solution:**
1. Check database: `certificate_recipients` table
2. Verify `user_id` matches the logged-in user
3. Refresh the page
4. Check browser console for errors
5. Verify API endpoints are responding

---

## Files Created/Modified

### Backend
- ✅ `backend/migrations/create-certificate-recipients-table.sql` - Database schema
- ✅ `backend/scripts/issue-certificates.js` - Certificate issuance script
- ✅ `backend/routes/certificate-recipients.js` - API endpoints
- ✅ `backend/server.js` - Added new routes

### Frontend
- ✅ `frontend/src/components/CertificatesModal.jsx` - Updated with bootcamp certificates
- ✅ `frontend/src/pages/BootcampCertificatePreview.jsx` - Certificate preview page
- ✅ `frontend/src/App.jsx` - Added certificate route

### Existing Components Used
- ✅ `frontend/src/components/AIGovernanceCertificateWithSignatures.jsx` - Certificate template
- ✅ `backend/routes/signatures.js` - Signature management (already exists)

---

## Security Features

1. **Row Level Security (RLS)** - Database-level access control
2. **User verification** - Backend validates certificate ownership
3. **Frontend validation** - Additional check in UI
4. **Unique certificate IDs** - Prevents duplicates
5. **Authenticated routes** - Requires login to view certificates

---

## Future Enhancements

Potential improvements:
- [ ] Email notifications when certificates are issued
- [ ] Certificate verification page (public)
- [ ] Bulk certificate regeneration
- [ ] Certificate templates per bootcamp
- [ ] Certificate analytics (views, downloads)
- [ ] Certificate expiration dates
- [ ] Certificate revocation system
- [ ] Print-friendly version

---

## Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Verify database tables exist
5. Contact system administrator

---

**Last Updated:** October 14, 2026
**Version:** 1.0

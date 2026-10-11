# Certificate Signature System

## Overview
This system allows signatories to digitally sign certificates by adding their name, title/position, and handwritten signature to designated slots on the certificate.

## How It Works

### 1. Database Setup
First, run the SQL migration to create the signatures table:

```bash
# Run this in your Supabase SQL editor
cat backend/migrations/create-certificate-signatures-table.sql
```

### 2. Sending Links to Signatories
Generate and send unique links to each signatory:

**Format:** `https://your-domain.com/signatory/{certificateId}?slot={slotNumber}`

**Example:**
- Signatory 1: `http://localhost:3000/signatory/CERT-2026-001?slot=1`
- Signatory 2: `http://localhost:3000/signatory/CERT-2026-001?slot=2`
- Signatory 3: `http://localhost:3000/signatory/CERT-2026-001?slot=3`

### 3. Signatory Workflow

1. **Access the link** - Signatory opens their unique URL
2. **View certificate** - They see the certificate with empty signature slots
3. **Click "Add Signature"** - Opens a modal to add their details
4. **Fill in details:**
   - Full Name
   - Title/Position (e.g., "Program Director", "CEO")
   - Draw signature on canvas
5. **Save Draft** - Can save and edit later (signature not locked)
6. **Confirm & Lock** - Final submission, cannot be edited after this

### 4. Signature States

- **Empty**: No signature added yet - shows "Add Signature" button
- **Draft**: Signature saved but not confirmed - can be edited
- **Confirmed**: Signature locked - cannot be modified

### 5. API Endpoints

#### Get Signatures
```
GET /api/signatures/:certificateId
Response: { success: true, signatures: [...] }
```

#### Add/Update Signature
```
POST /api/signatures
Body: {
  certificateId: string,
  slotNumber: number (1-3),
  name: string,
  title: string,
  signature: string (base64 image),
  confirmed: boolean
}
Response: { success: true, signature: {...} }
```

### 6. Security Features

- Once confirmed, signatures cannot be modified (enforced at backend)
- Each certificate-slot combination is unique
- Signatures are stored as base64 images
- Row Level Security (RLS) policies protect the data

### 7. Testing Locally

1. **Start backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access signatory page:**
   ```
   http://localhost:3000/signatory/CERT-2026-001?slot=1
   ```

4. **Add test signature:**
   - Click "Add Signature"
   - Fill in name and title
   - Draw signature with mouse
   - Click "Save Draft" or "Confirm & Lock"

### 8. Generating Signatory Links Programmatically

You can create a script to generate and email links:

```javascript
const certificateId = 'CERT-2026-001';
const signatories = [
  { name: 'Dr. Jane Smith', email: 'jane@example.com', slot: 1 },
  { name: 'Prof. John Doe', email: 'john@example.com', slot: 2 },
  { name: 'Ms. Alice Johnson', email: 'alice@example.com', slot: 3 }
];

signatories.forEach(sig => {
  const link = `https://your-domain.com/signatory/${certificateId}?slot=${sig.slot}`;
  // Send email with link to sig.email
  console.log(`Send to ${sig.name}: ${link}`);
});
```

### 9. Viewing Final Certificate

- **With Signatures:** Use the SignatoryPage component with `editable={false}`
- **PDF Export:** Once all signatures are added, download as PDF

### 10. Files Created

**Frontend:**
- `frontend/src/components/SignatureModal.jsx` - Modal for adding signatures
- `frontend/src/components/AIGovernanceCertificateWithSignatures.jsx` - Certificate with signature support
- `frontend/src/pages/SignatoryPage.jsx` - Page for signatories to add signatures

**Backend:**
- `backend/routes/signatures.js` - API endpoints for signatures
- `backend/migrations/create-certificate-signatures-table.sql` - Database schema

## Notes

- The signature canvas uses mouse events (can be extended for touch support)
- Signatures are stored as PNG images in base64 format
- The system supports exactly 3 signature slots per certificate
- Clear instructions are shown to signatories on the page

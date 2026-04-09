# Admissions Image Upload Feature

## Overview
Add image upload capability to admissions and "Read More" functionality for long descriptions.

## Database Changes

### 1. Run Migration
Execute `backend/supabase-admissions-add-image.sql` in your Supabase SQL editor to add the `image_url` column.

## Frontend Changes Needed

### 1. AdmissionsManager Component
**File**: `frontend/src/components/AdmissionsManager.jsx`

Add image upload field to the form:
- Add file input for image upload
- Upload image to Supabase storage (`admissions` bucket)
- Store image URL in `image_url` field
- Show image preview when editing

### 2. AdmissionsSection Component  
**File**: `frontend/src/components/AdmissionsSection.jsx`

Add "Read More" functionality:
- Truncate description to ~150 characters
- Add "Read More" button if description exceeds limit
- Expand/collapse description on click
- Display admission image if `image_url` exists

## Implementation Steps

### Step 1: Update AdmissionsManager

```javascript
// Add to state
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

// Add image upload handler
const handleImageUpload = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('admissions')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('admissions')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Add to form
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }}
/>
```

### Step 2: Update AdmissionsSection

```javascript
const [expandedId, setExpandedId] = useState(null);

const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// In render
{admission.image_url && (
  <img 
    src={admission.image_url} 
    alt={admission.title}
    className="w-full h-48 object-cover rounded-lg mb-4"
  />
)}

<p className="text-gray-600 mb-4">
  {expandedId === admission.id 
    ? admission.description 
    : truncateText(admission.description)}
</p>

{admission.description.length > 150 && (
  <button
    onClick={() => setExpandedId(
      expandedId === admission.id ? null : admission.id
    )}
    className="text-accent-600 hover:text-accent-700"
  >
    {expandedId === admission.id ? 'Read Less' : 'Read More'}
  </button>
)}
```

## Testing

1. Run the SQL migration in Supabase
2. Test image upload in AdmissionsManager
3. Verify image displays on landing page
4. Test "Read More" with long descriptions
5. Test "Read More" doesn't show for short descriptions

## Notes

- Images are stored in Supabase storage `admissions` bucket
- Image URLs are public and accessible to all users
- Recommended image size: 1200x600px
- Supported formats: JPG, PNG, WebP
- Max file size: 5MB

Would you like me to implement these changes now?

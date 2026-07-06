# Google Forms Integration Setup - Easy Method

## Quick Start (No Entry IDs Required)

### Step 1: Create Your Google Form
1. Go to [Google Forms](https://forms.google.com)
2. Create a new form titled: "AI Governance & Digital Safety Bootcamp 1.0 - Assignment Submissions"

### Step 2: Add These Fields (in order):
1. **Student Name** - Short answer (Required)
2. **Email Address** - Short answer with email validation (Required)  
3. **Week Number** - Short answer (Required)
4. **Assignment Title** - Short answer (Required)
5. **Submission Type** - Multiple choice: Individual, Group (Required)
6. **GitHub Repository URL** - Short answer with URL validation (Required)
7. **Additional Notes** - Paragraph text (Optional)

### Step 3: Get Your Form URL
1. Click the "Send" button in your form
2. Click the link icon (🔗)
3. Copy the form URL (it looks like: `https://forms.google.com/forms/d/e/1FAIpQLSd...`)

### Step 4: Update the Component
Replace this line in the component:
```javascript
const googleFormUrl = "https://forms.google.com/your-form-id"
```

With your actual form URL:
```javascript
const googleFormUrl = "https://forms.google.com/forms/d/e/YOUR_ACTUAL_FORM_ID"
```

## Advanced Method (With Pre-filled Data)

### How to Get Entry IDs the Easy Way:

1. **Open your form in edit mode**
2. **Right-click on the first field** (Student Name) and select "Inspect Element"
3. **Look for the `name` attribute** - it will look like `entry.1234567890`
4. **Repeat for each field** and note down all the entry IDs

### Alternative Method to Find Entry IDs:

1. **Open your form** and fill it out with test data
2. **Before submitting**, right-click and "Inspect Element"
3. **Look at the form data** in the Network tab when you submit
4. **The entry IDs will be visible** in the form submission

### Example Entry ID Mapping:
```javascript
// Replace these numbers with your actual entry IDs
'entry.1234567890': formData.studentName,        // Student Name field
'entry.0987654321': formData.email,              // Email field  
'entry.1122334455': `Week ${weekNumber}`,        // Week Number field
'entry.5544332211': assignmentTitle,             // Assignment Title field
'entry.6677889900': formData.submissionType,     // Submission Type field
'entry.4433221100': formData.githubUrl,          // GitHub URL field
'entry.7766554433': formData.additionalNotes,    // Additional Notes field
```

### Step-by-Step to Get Entry IDs:

1. **Create your Google Form** with the 7 fields listed above
2. **Open the form** in a new tab (as if you were filling it out)
3. **Press F12** to open Developer Tools
4. **Click the "Network" tab** in Developer Tools
5. **Fill out the form** with test data
6. **Click Submit** (don't worry, it's just a test)
7. **Look in the Network tab** for a request called "formResponse"
8. **Click on it** and look at the "Form Data" section
9. **Copy the entry IDs** (they look like entry.1234567890)

### Once You Have Entry IDs:

1. **Uncomment the advanced code** in the component
2. **Replace the placeholder entry IDs** with your real ones
3. **Comment out** the simple approach
4. **Students will get pre-filled forms** with their data

## Current Setup

Right now, the component is set to use the **Simple Method**. Students will:
1. Click "Submit Assignment" 
2. A Google Form opens in a new tab
3. They manually fill in the form fields
4. All data is logged in the console for debugging

## Benefits of Each Method:

### Simple Method:
✅ **Quick to setup** (just need form URL)  
✅ **No technical complexity**
✅ **Works immediately**
❌ Students must manually enter data

### Advanced Method:  
✅ **Pre-filled data** (better user experience)
✅ **Faster for students**  
✅ **Less errors** (data auto-populated)
❌ Requires finding entry IDs

## Testing

1. **Create a test form** with a few fields
2. **Update the component** with your form URL
3. **Test the submission flow**
4. **Check your Google Form responses**
5. **Verify all data is captured correctly**

The form is ready to use with the Simple Method right now!
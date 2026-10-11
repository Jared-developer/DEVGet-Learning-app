# Export AI Governance Students Data

This script exports data for students enrolled in the AI & Machine Learning course who have started the AI Governance bootcamp weeks.

## What It Does

The script queries your Supabase database and extracts:

1. **Student Information**
   - User ID
   - Email
   - Full Name
   - Role (student/instructor/admin)
   - Enrollment date
   - Last sign-in date
   - Email confirmation status

2. **Course Progress**
   - Overall course progress percentage
   - Completed lessons count
   - Total lessons available
   - Last course access date

3. **Bootcamp Activity**
   - Number of bootcamp weeks started
   - Total bootcamp submissions
   - Average bootcamp score
   - Latest submission date

## Requirements

- Node.js installed
- Access to your Supabase database
- Backend `.env` file configured with:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## How to Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Run the script:
   ```bash
   node scripts/export-ai-governance-students.js
   ```

## Output

The script generates a CSV file with the naming format:
```
ai-governance-students-YYYY-MM-DD.csv
```

The file will be saved in the `backend/scripts/` directory.

## CSV Columns

| Column | Description |
|--------|-------------|
| user_id | Unique user identifier |
| email | Student's email address |
| full_name | Student's full name |
| role | User role (student/instructor/admin) |
| enrolled_at | Course enrollment date |
| last_sign_in | Most recent sign-in timestamp |
| email_confirmed | Whether email is confirmed (Yes/No) |
| course_progress_percentage | % of course completed |
| completed_lessons | Number of lessons completed |
| total_lessons | Total lessons in course |
| last_course_access | Last time they accessed the course |
| bootcamp_weeks_started | Number of bootcamp weeks they've started |
| bootcamp_submissions_count | Total bootcamp assignment submissions |
| average_bootcamp_score | Average score across bootcamp submissions |
| latest_submission | Date of most recent bootcamp submission |

## Filtering Criteria

The script only includes students who meet ALL of these conditions:

1. ✅ Enrolled in a course with "AI" and "Machine Learning" in the title
2. ✅ Have started the AI Governance bootcamp (indicated by):
   - At least one bootcamp submission, OR
   - At least one lesson marked as completed or in-progress

Students who are enrolled but haven't started any bootcamp content will NOT be included.

## Example Output

```
user_id,email,full_name,role,enrolled_at,...
abc123,student@example.com,John Doe,student,1/15/2026,...
def456,jane@example.com,Jane Smith,student,1/20/2026,...
```

## Troubleshooting

### "No AI & Machine Learning course found"
- Verify that a course exists in your `courses` table with "AI" and "Machine Learning" in the title
- Check the course title matches the expected format

### "No enrollments found"
- Check if students are enrolled in the `enrollments` table
- Verify the course_id matches the AI/ML course

### "No students have started the AI Governance bootcamp yet"
- Students need to either:
  - Submit at least one bootcamp assignment, OR
  - Complete or start at least one lesson
- Check the `bootcamp_submissions` and `lesson_progress` tables

### "Error fetching [table_name]"
- Ensure the table exists in your database
- Check that your service role key has proper permissions
- Verify Row Level Security policies allow service role access

## Security Notes

- This script uses the **SERVICE_ROLE_KEY** which bypasses Row Level Security
- Keep this script and the generated CSV files secure
- Do not commit the CSV output to version control
- The CSV may contain personal information - handle according to privacy regulations

## Related Files

- `backend/supabase-bootcamp-submissions-schema.sql` - Bootcamp submissions table schema
- `backend/migrations/add-progress-tracking.sql` - Progress tracking tables schema
- `frontend/src/data/courseContent.js` - Course content structure

# Quick Reference: Export AI Governance Students

## Run the Script

```bash
cd backend
node scripts/export-ai-governance-students.js
```

## What Gets Exported

Students in **AI & Machine Learning** course who have:
- ✅ Submitted bootcamp assignments, OR
- ✅ Completed/started bootcamp lessons

## Output File

Location: `backend/scripts/ai-governance-students-YYYY-MM-DD.csv`

## Data Columns

| Column | What It Shows |
|--------|---------------|
| email | Student's email |
| full_name | Student's name |
| course_progress_percentage | % of course completed |
| bootcamp_weeks_started | # of bootcamp weeks started |
| bootcamp_submissions_count | # of assignments submitted |
| average_bootcamp_score | Average score on bootcamp work |
| latest_submission | Most recent submission date |
| last_course_access | Last time they used the course |

## Requirements

- Node.js installed
- `backend/.env` file configured
- Run `npm install` in backend folder

## Troubleshooting

**"Module not found"**
```bash
cd backend && npm install
```

**"No students found"**
- Check students are enrolled in AI/ML course
- Verify they've submitted work or completed lessons

**"Cannot connect"**
- Check `backend/.env` has SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

## Full Documentation

See: `backend/scripts/EXPORT-AI-GOVERNANCE-README.md`

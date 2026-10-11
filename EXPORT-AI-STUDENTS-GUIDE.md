# Quick Guide: Export AI Governance Students

This guide will help you extract data for students enrolled in AI & Machine Learning who have started the AI Governance bootcamp.

## 🚀 Quick Start

Open your terminal and run these commands:

```bash
# Navigate to backend folder
cd backend

# Run the export script
node scripts/export-ai-governance-students.js
```

That's it! The script will create a CSV file in the `backend/scripts/` folder.

## 📊 What You'll Get

A CSV file named like: `ai-governance-students-2026-10-05.csv`

**Data included:**
- Student contact info (email, name)
- Enrollment details
- Course progress (% completed, lessons done)
- Bootcamp activity (weeks started, submissions, scores)
- Last activity dates

## ✅ What Gets Included

Students must meet these requirements to appear in the export:
1. Enrolled in AI & Machine Learning course
2. Started at least one AI Governance bootcamp week (submitted assignment or completed a lesson)

## 📁 Where to Find the File

After running the script, look for the CSV file here:
```
backend/scripts/ai-governance-students-YYYY-MM-DD.csv
```

## 🔧 Requirements

Before running, make sure you have:
- ✅ Node.js installed
- ✅ Backend `.env` file with Supabase credentials
- ✅ Run `npm install` in the backend folder

## 💡 Tips

- The script shows a preview of the data in your terminal
- It tells you how many students were found
- If no students are found, it explains why
- Run it anytime to get fresh data

## 📖 Need More Details?

See the full documentation:
- `backend/scripts/EXPORT-AI-GOVERNANCE-README.md` - Complete technical docs
- Explains all CSV columns, troubleshooting, and security notes

## 🐛 Common Issues

**"Module not found"**
```bash
cd backend
npm install
```

**"No students found"**
- Check if students are enrolled in the AI/ML course
- Verify they've submitted bootcamp assignments or completed lessons

**"Cannot connect to database"**
- Check your `backend/.env` file has correct Supabase credentials
- Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set

## 📧 Questions?

The script includes helpful console output that explains what it's doing and any issues it encounters.

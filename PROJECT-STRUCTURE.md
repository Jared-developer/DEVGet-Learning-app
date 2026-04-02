# Project Structure

Complete overview of the DEVGet Learning Platform structure.

## Root Directory

```
devget-learning/
├── 📁 .github/
│   └── 📁 workflows/
│       ├── ci.yml                    # Continuous Integration
│       └── deploy.yml                # Continuous Deployment
│
├── 📁 backend/                       # Backend API Server
│   ├── 📁 config/                    # Configuration files
│   │   └── supabase.js              # Supabase client config
│   │
│   ├── 📁 middleware/                # Express middleware
│   │   ├── errorHandler.js          # Global error handler
│   │   └── supabaseAuth.js          # Authentication middleware
│   │
│   ├── 📁 models/                    # Data models (if needed)
│   │
│   ├── 📁 routes/                    # API route handlers
│   │   ├── admin.js                 # Admin endpoints
│   │   ├── ai-assistant.js          # AI assistant endpoints
│   │   ├── assignments.js           # Assignment endpoints
│   │   ├── certificates.js          # Certificate endpoints
│   │   ├── community.js             # Community endpoints
│   │   ├── courses.js               # Course endpoints
│   │   └── instructors.js           # Instructor endpoints
│   │
│   ├── 📁 scripts/                   # Setup & utility scripts
│   │   ├── add-agentic-ai-to-supabase.js
│   │   ├── add-mern-to-supabase.js
│   │   ├── set-admin-role.js
│   │   ├── setup-api-keys.js
│   │   ├── setup-assignments.js
│   │   ├── setup-community.js
│   │   ├── setup-instructors.js
│   │   ├── test-ai-assistant.js
│   │   └── test-supabase.js
│   │
│   ├── 📁 services/                  # Business logic services
│   │
│   ├── 📄 .env                       # Environment variables (local)
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 package.json               # Backend dependencies
│   ├── 📄 package-lock.json          # Dependency lock file
│   ├── 📄 server.js                  # Main server entry point
│   ├── 📄 README.md                  # Backend documentation
│   ├── 📄 SETUP.md                   # Backend setup guide
│   ├── 📄 SUPABASE-SETUP.md          # Supabase setup guide
│   │
│   └── 📄 Database Schemas:
│       ├── supabase-schema.sql              # Main schema
│       ├── supabase-admissions-schema.sql   # Admissions
│       ├── supabase-announcements-schema.sql # Announcements
│       ├── supabase-api-keys-schema.sql     # API keys
│       ├── supabase-assignments-schema.sql  # Assignments
│       ├── supabase-certificates-schema.sql # Certificates
│       ├── supabase-community-schema.sql    # Community
│       └── supabase-instructors-schema.sql  # Instructors
│
├── 📁 frontend/                      # React Frontend
│   ├── 📁 public/                    # Static assets
│   │   ├── 📁 images/
│   │   │   ├── course-thumbnails/
│   │   │   └── logos/
│   │   └── _redirects               # Netlify redirects
│   │
│   ├── 📁 src/                       # Source code
│   │   ├── 📁 components/           # React components
│   │   │   ├── AdmissionsManager.jsx
│   │   │   ├── AdmissionsSection.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── AnnouncementsModal.jsx
│   │   │   ├── AssignmentSubmission.jsx
│   │   │   ├── AssignmentsModal.jsx
│   │   │   ├── CertificatesModal.jsx
│   │   │   ├── CourseCommunity.jsx
│   │   │   ├── CourseInstructors.jsx
│   │   │   ├── CourseResources.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── InstructorManager.jsx
│   │   │   ├── InstructorUpdates.jsx
│   │   │   ├── LessonNotes.jsx
│   │   │   ├── LiveClassModal.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProfileModal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StudentRegistration.jsx
│   │   │
│   │   ├── 📁 contexts/             # React contexts
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   │
│   │   ├── 📁 data/                 # Course content data
│   │   │   ├── courseContent.js
│   │   │   ├── htmlAbsoluteBeginners.js
│   │   │   ├── mernPhase1Notes.js
│   │   │   ├── mernPhase2Notes.js
│   │   │   ├── mernPhase3Notes.js
│   │   │   ├── mernPhase4Notes.js
│   │   │   ├── mernPhase5Notes.js
│   │   │   ├── aiMlPhase1Notes.js
│   │   │   ├── aiMlPhase2Notes.js
│   │   │   ├── aiMlPhase2Week5-6.js
│   │   │   ├── aiMlPhase3Week7-8.js
│   │   │   ├── aiMlPhase4Week8.js
│   │   │   ├── aiMlPhase4Week9-10.js
│   │   │   ├── aiMlPhase4Week11.js
│   │   │   ├── aiMlPhase5Week12.js
│   │   │   ├── aiMlPhase5Week13.js
│   │   │   ├── aiMlPhase5Week14.js
│   │   │   ├── aiMlPhase5Week15-16.js
│   │   │   ├── aiMlProjects.js
│   │   │   ├── agenticAIPhase1Notes.js
│   │   │   ├── agenticAIPhase1Projects.js
│   │   │   ├── agenticAIPhase1Week3-4.js
│   │   │   ├── agenticAIPhase2Notes.js
│   │   │   ├── agenticAIPhase3Notes.js
│   │   │   ├── agenticAIPhase3Week11-12.js
│   │   │   ├── agenticAIPhase4Week13-14.js
│   │   │   ├── agenticAIPhase5Week15-16.js
│   │   │   └── agenticAIFinalProject.js
│   │   │
│   │   ├── 📁 lib/                  # Utility libraries
│   │   │   └── supabase.js          # Supabase client
│   │   │
│   │   ├── 📁 pages/                # Page components
│   │   │   ├── AboutUs.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── CoursePage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Resources.jsx
│   │   │   └── SignIn.jsx
│   │   │
│   │   ├── 📁 services/             # API services
│   │   │   └── aiService.js         # AI service integration
│   │   │
│   │   ├── 📄 App.jsx               # Main app component
│   │   ├── 📄 main.jsx              # Entry point
│   │   ├── 📄 index.css             # Global styles
│   │   └── 📄 mobile-responsive.css # Mobile styles
│   │
│   ├── 📄 .env                       # Environment variables (local)
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 index.html                 # HTML template
│   ├── 📄 package.json               # Frontend dependencies
│   ├── 📄 package-lock.json          # Dependency lock file
│   ├── 📄 postcss.config.js          # PostCSS configuration
│   ├── 📄 tailwind.config.js         # Tailwind CSS config
│   ├── 📄 vite.config.js             # Vite configuration
│   └── 📄 README.md                  # Frontend documentation
│
├── 📁 scripts/                       # Root-level scripts
│   ├── deploy-check.js              # Deployment readiness check
│   └── pre-deploy-test.js           # Pre-deployment tests
│
├── 📄 Deployment Configuration Files:
│   ├── .dockerignore                # Docker ignore rules
│   ├── .gitignore                   # Git ignore rules
│   ├── docker-compose.yml           # Docker Compose config
│   ├── Dockerfile                   # Docker container config
│   ├── netlify.toml                 # Netlify config
│   ├── Procfile                     # Heroku config
│   ├── railway.json                 # Railway config
│   ├── render.yaml                  # Render config
│   └── vercel.json                  # Vercel config
│
├── 📄 Documentation Files:
│   ├── CLEANUP-SUMMARY.md           # Cleanup documentation
│   ├── DEPLOYMENT.md                # Detailed deployment guide
│   ├── DEPLOYMENT-STATUS.md         # Deployment tracker
│   ├── DEPLOYMENT-SUMMARY.md        # Deployment overview
│   ├── ENV-TEMPLATE.md              # Environment variables guide
│   ├── PRODUCTION-CHECKLIST.md      # Pre-deployment checklist
│   ├── PROJECT-STRUCTURE.md         # This file
│   ├── QUICK-DEPLOY.md              # Quick deployment guide
│   ├── README.md                    # Main project README
│   ├── START-SERVERS.md             # Local development guide
│   └── SUPABASE-MIGRATION.md        # Supabase migration guide
│
└── 📄 package.json                   # Root package configuration
```

## Key Directories Explained

### `/backend`
Contains the Express.js API server that handles:
- User authentication and authorization
- Course management
- Assignment submissions
- Certificate generation
- Community features
- Admin operations

### `/frontend`
React application built with Vite that provides:
- User interface
- Course browsing and enrollment
- Student dashboard
- Instructor management
- Community interaction
- Responsive design

### `/scripts`
Utility scripts for:
- Deployment readiness checks
- Pre-deployment testing
- Database setup
- Initial data population

### `/.github/workflows`
CI/CD pipelines for:
- Automated testing
- Linting
- Deployment automation

## File Types

### Configuration Files
- `.json` - Package and configuration files
- `.js` - JavaScript configuration (Vite, Tailwind, PostCSS)
- `.toml` - Netlify configuration
- `.yaml` - Render and GitHub Actions configuration
- `.env` - Environment variables (not committed to Git)

### Source Code
- `.js` - JavaScript files
- `.jsx` - React components
- `.css` - Stylesheets
- `.sql` - Database schemas

### Documentation
- `.md` - Markdown documentation files

## Important Files

### Must Configure Before Deployment
1. `backend/.env` - Backend environment variables
2. `frontend/.env` - Frontend environment variables
3. All `.sql` files - Must be executed in Supabase

### Deployment Configuration (Choose One)
1. `vercel.json` - For Vercel deployment
2. `netlify.toml` - For Netlify deployment
3. `render.yaml` - For Render deployment
4. `railway.json` - For Railway deployment
5. `Dockerfile` - For Docker deployment

### Documentation to Read
1. `README.md` - Start here
2. `QUICK-DEPLOY.md` - Fast deployment guide
3. `DEPLOYMENT.md` - Detailed deployment guide
4. `PRODUCTION-CHECKLIST.md` - Pre-deployment checklist

## File Count Summary

```
Total Files: 150+
├── Backend: 30+ files
├── Frontend: 80+ files
├── Documentation: 15+ files
├── Configuration: 10+ files
└── Scripts: 15+ files
```

## Dependencies

### Backend Dependencies
- Express.js - Web framework
- Supabase - Database and auth
- JWT - Token authentication
- Helmet - Security headers
- CORS - Cross-origin requests
- Rate Limit - API protection
- Nodemailer - Email sending
- Multer - File uploads

### Frontend Dependencies
- React - UI framework
- React Router - Routing
- Supabase - Backend integration
- Tailwind CSS - Styling
- Lucide React - Icons
- Vite - Build tool

### Dev Dependencies
- Nodemon - Auto-reload (backend)
- ESLint - Linting (frontend)
- Jest - Testing (backend)

## Build Outputs (Not in Git)

```
├── backend/node_modules/     # Backend dependencies
├── frontend/node_modules/    # Frontend dependencies
├── frontend/dist/            # Production build
└── backend/uploads/          # User uploads
```

## Environment Files (Not in Git)

```
├── backend/.env              # Backend secrets
├── frontend/.env             # Frontend config
└── .env.local               # Local overrides
```

## Git Ignored Items

- `node_modules/` - Dependencies
- `.env` files - Secrets
- `dist/` - Build outputs
- `uploads/` - User files
- `.DS_Store` - OS files
- IDE config files

## Deployment Artifacts

When deployed, the structure becomes:

### Backend (Node.js Server)
```
/app/
├── node_modules/
├── config/
├── middleware/
├── routes/
├── services/
├── server.js
└── package.json
```

### Frontend (Static Files)
```
/dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── images/
```

## Access Patterns

### Development
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
Database: Supabase Cloud
```

### Production
```
Frontend: https://your-app.vercel.app
Backend:  https://your-api.onrender.com
Database: Supabase Cloud
```

## Security Considerations

### Never Commit
- `.env` files
- API keys
- Database credentials
- JWT secrets
- Service role keys

### Always Commit
- `.env.example` files
- Configuration templates
- Documentation
- Source code

## Maintenance

### Regular Updates
- Dependencies (monthly)
- Security patches (as needed)
- Documentation (as features change)
- Database schemas (version controlled)

### Monitoring
- Backend logs (hosting platform)
- Frontend errors (browser console)
- Database usage (Supabase dashboard)
- API performance (hosting metrics)

---

**Last Updated:** 2026  
**Version:** 1.0.0  
**Total Lines of Code:** ~15,000+

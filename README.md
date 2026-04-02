# DEVGet Learning Platform

A modern, full-stack learning management system built with React, Node.js, Express, and Supabase.

## Features

- 🎓 Course Management (MERN Stack, AI/ML, Agentic AI)
- 👥 User Authentication & Authorization
- 📝 Assignment Submission & Grading
- 🎖️ Certificate Generation
- 💬 Community Discussion Forums
- 📢 Announcements & Updates
- 👨‍🏫 Instructor Management
- 🤖 AI Assistant Integration
- 📱 Fully Responsive Design
- 🔐 Secure with Row Level Security (RLS)

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Vite
- Supabase Client
- Lucide React Icons

### Backend
- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT Authentication
- Helmet (Security)
- Express Rate Limit
- Compression

### Database
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions

## Project Structure

```
devget-learning/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── scripts/            # Setup & utility scripts
│   ├── services/           # Business logic
│   ├── server.js           # Entry point
│   └── *.sql               # Database schemas
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── data/           # Course content
│   │   ├── lib/            # Utilities
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── index.html          # HTML template
├── scripts/                # Root-level scripts
├── DEPLOYMENT.md           # Detailed deployment guide
├── QUICK-DEPLOY.md         # Quick deployment guide
└── PRODUCTION-CHECKLIST.md # Pre-deployment checklist
```

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devget-learning.git
   cd devget-learning
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run all SQL files in `backend/` directory in Supabase SQL Editor
   - Copy your project URL and keys

4. **Configure environment variables**

   Backend (`backend/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:5173
   ```

   Frontend (`frontend/.env`):
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=http://localhost:5000
   ```

5. **Start development servers**

   Terminal 1 (Backend):
   ```bash
   npm run dev:backend
   ```

   Terminal 2 (Frontend):
   ```bash
   npm run dev:frontend
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## Deployment

### Quick Deploy (30 minutes)
See [QUICK-DEPLOY.md](QUICK-DEPLOY.md) for a step-by-step guide to deploy in under 30 minutes.

### Detailed Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:
- Multiple hosting options (Vercel, Netlify, Render, Railway, Heroku)
- Environment configuration
- Domain setup
- Monitoring and maintenance

### Pre-Deployment Check
Run the deployment readiness check:
```bash
npm run deploy-check
```

## Available Scripts

### Root Level
- `npm run install-all` - Install all dependencies (backend + frontend)
- `npm run deploy-check` - Check deployment readiness
- `npm run dev:backend` - Start backend development server
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run start:backend` - Start backend in production mode

### Backend
```bash
cd backend
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
```

### Frontend
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Database Setup

Execute SQL files in this order:
1. `supabase-schema.sql` - Main schema
2. `supabase-instructors-schema.sql` - Instructors
3. `supabase-announcements-schema.sql` - Announcements
4. `supabase-admissions-schema.sql` - Admissions
5. `supabase-api-keys-schema.sql` - API Keys
6. `supabase-assignments-schema.sql` - Assignments
7. `supabase-certificates-schema.sql` - Certificates
8. `supabase-community-schema.sql` - Community

## Initial Data Setup

After database setup, run these scripts:
```bash
cd backend
node scripts/setup-instructors.js
node scripts/add-mern-to-supabase.js
node scripts/add-agentic-ai-to-supabase.js
node scripts/setup-assignments.js
node scripts/set-admin-role.js your-email@example.com
```

## API Documentation

### Health Check
```
GET /health
```

### Courses
```
GET    /api/courses              # Get all courses
GET    /api/courses/:id          # Get course by ID
POST   /api/courses              # Create course (admin)
PUT    /api/courses/:id          # Update course (admin)
DELETE /api/courses/:id          # Delete course (admin)
```

### Assignments
```
GET    /api/assignments          # Get all assignments
POST   /api/assignments          # Submit assignment
GET    /api/assignments/:id      # Get assignment by ID
```

### Certificates
```
GET    /api/certificates         # Get user certificates
POST   /api/certificates         # Generate certificate
```

### Community
```
GET    /api/community/posts      # Get all posts
POST   /api/community/posts      # Create post
POST   /api/community/posts/:id/comments  # Add comment
```

### Admin
```
POST   /api/admin/users/:id/role # Set user role
GET    /api/admin/stats          # Get platform statistics
```

## Security Features

- JWT-based authentication
- Row Level Security (RLS) in Supabase
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting
- Input validation
- XSS protection
- SQL injection prevention

## Environment Variables

### Required Backend Variables
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)
- `SUPABASE_ANON_KEY` - Anonymous/public key
- `JWT_SECRET` - Secret for JWT signing
- `FRONTEND_URL` - Frontend URL for CORS

### Required Frontend Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Anonymous/public key
- `VITE_API_URL` - Backend API URL

### Optional Variables
See `.env.example` files in backend and frontend directories.

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend linting
cd frontend
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your frontend URL
- Check CORS configuration in `backend/server.js`

### Database Connection Issues
- Verify Supabase credentials
- Check RLS policies in Supabase dashboard
- Review Supabase logs

### Build Failures
- Ensure Node.js version is 18+
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing environment variables

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review Supabase logs
- Check browser console for frontend errors

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Video streaming integration
- [ ] Live coding sessions
- [ ] Peer review system
- [ ] Gamification features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration

## Acknowledgments

- React team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the styling system
- All contributors and users

---

**Version:** 1.0.0  
**Last Updated:** 2026  
**Status:** Production Ready

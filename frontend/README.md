# DEVGet Learning - Frontend

A modern e-learning platform built with React, Tailwind CSS, and Supabase.

## Features

- 🎯 **Landing Page** - Attractive homepage showcasing the platform
- 🔐 **Authentication** - Sign up/Sign in with Supabase Auth
- 📚 **Course Catalog** - Browse courses in Basics and Advanced categories
- 🎓 **Course Dashboard** - Access course materials, videos, quizzes, and assignments
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Fast & Modern** - Built with Vite and optimized for performance

## Course Categories

### Basics
- HTML Fundamentals
- CSS Styling
- JavaScript Essentials
- Python Basics
- Database Fundamentals

### Advanced
- MERN Stack Development
- AI/ML Fundamentals
- Agentic AI Systems
- Python for Data Science

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── ProtectedRoute.jsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx
│   ├── lib/               # Utilities and configurations
│   │   └── supabase.js
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   ├── SignIn.jsx
│   │   ├── Dashboard.jsx
│   │   └── CoursePage.jsx
│   ├── App.jsx            # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## Key Features Implementation

### Authentication Flow
1. Users land on the homepage
2. Click "Sign In" to access authentication
3. Can toggle between Sign In and Sign Up
4. After authentication, redirected to dashboard
5. Protected routes ensure only authenticated users access course content

### Course Management
- **Dashboard**: Browse courses by category (Basics/Advanced)
- **Course Page**: Detailed course information with enrollment
- **Course Content**: Access to videos, quizzes, assignments, and progress tracking

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized for desktop, tablet, and mobile devices
- Clean, modern UI with consistent design system

## Next Steps

To complete the full-stack implementation:

1. **Set up Supabase Database**
   - Create tables for courses, enrollments, progress
   - Set up Row Level Security (RLS) policies

2. **Backend Integration**
   - Connect course data to Supabase
   - Implement enrollment system
   - Add progress tracking

3. **Enhanced Features**
   - Video player integration
   - Quiz system
   - Assignment submission
   - Certificate generation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
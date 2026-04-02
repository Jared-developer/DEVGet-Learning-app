// MERN Stack Bootcamp - Phase 4 Detailed Notes
// The Complete MERN Stack: Building & Deploying a Full-Stack Application (Weeks 12-14)

export const phase4Week12Lesson1 = {
    title: 'Project Overview: Habit Tracker',
    videoUrl: 'https://www.youtube.com/embed/98BzS5Oz5E4',
    notes: `# 12.1 Project Overview: "Habit Tracker"

We'll build a Habit Tracker application where users can:
- Register/Login to their account
- Create custom habits (e.g., "Drink Water", "Read 30 mins", "Exercise")
- Mark habits as complete for each day
- View their progress on a dashboard with charts

## Tech Stack:
- **Frontend**: React (Vite), React Router, Context API, Axios, Recharts
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Deployment**: Render (Backend), Vercel (Frontend), MongoDB Atlas (Database)`,
    codeSnippet: `// Project Structure
habit-tracker/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md`
};

export const phase4Week12Lesson2 = {
    title: 'Backend Setup & Configuration',
    videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
    notes: `# 12.2 Backend Setup

Setting up the Express server with MongoDB connection and middleware.

## Key Concepts:
- Express server configuration
- MongoDB connection with Mongoose
- Environment variables with dotenv
- CORS configuration
- Middleware setup`,
    codeSnippet: `// Initialize Backend
mkdir habit-tracker
cd habit-tracker
mkdir backend
cd backend
npm init -y
npm install express mongoose dotenv bcrypt jsonwebtoken cors
npm install -D nodemon

// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
  });
});`
};

export const phase4Week12Lesson3 = {
    title: 'Database Models & Schemas',
    videoUrl: 'https://www.youtube.com/embed/DZBGEVgL2eE',
    notes: `# 12.3 Database Models

Creating Mongoose schemas for User and Habit models.

## User Model Features:
- Password hashing with bcrypt
- Email validation
- Password comparison method

## Habit Model Features:
- User reference
- Entries array for daily tracking
- Color customization
- Timestamps`,
    codeSnippet: `// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);`
};

export const phase4Week12Lesson4 = {
    title: 'Authentication System',
    videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
    notes: `# 12.4 Authentication Routes & Controllers

Implementing JWT-based authentication with register, login, and protected routes.

## Features:
- User registration with validation
- User login with JWT token generation
- Protected route middleware
- Token verification`,
    codeSnippet: `// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// controllers/authController.js
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};`
};

export const phase4Week12Lesson5 = {
    title: 'Habit CRUD Operations',
    videoUrl: 'https://www.youtube.com/embed/WDrU305J1yw',
    notes: `# 12.5 Habit Routes & Controllers

Implementing full CRUD operations for habits with user ownership validation.

## Features:
- Get all habits for authenticated user
- Create new habit
- Update habit
- Delete habit
- Toggle daily entries`,
    codeSnippet: `// controllers/habitController.js
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHabit = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const habit = await Habit.create({
      user: req.user._id,
      name,
      description,
      color,
      entries: []
    });
    
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleHabitEntry = async (req, res) => {
  try {
    const { date, completed, note } = req.body;
    const habit = await Habit.findById(req.params.id);
    
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const entryDate = new Date(date).setHours(0, 0, 0, 0);
    const existingEntryIndex = habit.entries.findIndex(
      entry => new Date(entry.date).setHours(0, 0, 0, 0) === entryDate
    );
    
    if (existingEntryIndex > -1) {
      habit.entries[existingEntryIndex].completed = completed;
    } else {
      habit.entries.push({ date: entryDate, completed, note });
    }
    
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};`
};

export const phase4Week13Lesson1 = {
    title: 'Frontend Setup & Structure',
    videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
    notes: `# 13.1 Frontend Setup

Setting up React with Vite and organizing the project structure.

## Installation:
- React with Vite
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- date-fns for date handling`,
    codeSnippet: `// Initialize Frontend
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom recharts date-fns

// Project Structure
frontend/src/
├── components/
│   ├── HabitCard.jsx
│   ├── HabitForm.jsx
│   ├── CalendarView.jsx
│   └── LoadingSpinner.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Landing.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   ├── api.js
│   └── habitService.js
├── App.jsx
└── main.jsx`
};

export const phase4Week13Lesson2 = {
    title: 'API Service & Axios Setup',
    videoUrl: 'https://www.youtube.com/embed/6LyagkoRWYA',
    notes: `# 13.2 API Service Setup

Creating an Axios instance with interceptors for authentication.

## Features:
- Base URL configuration
- Request interceptor to add JWT token
- Response interceptor for error handling
- Automatic token refresh on 401`,
    codeSnippet: `// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// services/habitService.js
import api from './api';

export const habitService = {
  async getHabits() {
    const response = await api.get('/habits');
    return response.data;
  },
  
  async createHabit(habitData) {
    const response = await api.post('/habits', habitData);
    return response.data;
  },
  
  async toggleEntry(habitId, entryData) {
    const response = await api.post(\`/habits/\${habitId}/entries\`, entryData);
    return response.data;
  }
};`
};

export const phase4Week13Lesson3 = {
    title: 'Authentication Context',
    videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc',
    notes: `# 13.3 Authentication Context

Creating a global authentication context for managing user state.

## Features:
- User state management
- Login/Register functions
- Logout functionality
- Persistent authentication
- Loading states`,
    codeSnippet: `// contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return response.data;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};`
};

export const phase4Week13Lesson4 = {
    title: 'Dashboard & Components',
    videoUrl: 'https://www.youtube.com/embed/Law0fMj6DHY',
    notes: `# 13.4 Dashboard Page

Building the main dashboard with habit management.

## Features:
- Display all user habits
- Create new habits
- Toggle habit completion
- Delete habits
- Calendar view
- Real-time updates`,
    codeSnippet: `// pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { habitService } from '../services/habitService';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    loadHabits();
  }, []);
  
  const loadHabits = async () => {
    try {
      const data = await habitService.getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateHabit = async (habitData) => {
    try {
      const newHabit = await habitService.createHabit(habitData);
      setHabits([newHabit, ...habits]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };
  
  const handleToggleEntry = async (habitId, date, completed) => {
    try {
      await habitService.toggleEntry(habitId, { date, completed });
      await loadHabits();
    } catch (error) {
      console.error('Failed to toggle entry:', error);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Habit'}
        </button>
      </div>
      
      {showForm && (
        <HabitForm 
          onSubmit={handleCreateHabit}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      <div className="habits-section">
        {habits.map(habit => (
          <HabitCard
            key={habit._id}
            habit={habit}
            onToggle={handleToggleEntry}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;`
};

export const phase4Week14Lesson1 = {
    title: 'Preparing for Deployment',
    videoUrl: 'https://www.youtube.com/embed/l134cBAJCuc',
    notes: `# 14.1 Preparing for Deployment

Getting your application ready for production deployment.

## Backend Preparation:
- Configure CORS for production
- Set up environment variables
- Optimize build settings

## Frontend Preparation:
- Build optimization
- Environment variables
- API URL configuration`,
    codeSnippet: `// Backend - server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Frontend - vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true
  }
})

// .env.production
VITE_API_URL=https://your-backend-url.com/api

// Build frontend
npm run build`
};

export const phase4Week14Lesson2 = {
    title: 'Deploying to Render & Vercel',
    videoUrl: 'https://www.youtube.com/embed/bnCOyGaSe84',
    notes: `# 14.2 Deployment Process

Step-by-step deployment to Render (backend) and Vercel (frontend).

## Render Deployment:
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

## Vercel Deployment:
1. Import GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy`,
    codeSnippet: `// Render Configuration
Name: habit-tracker-api
Environment: Node
Build Command: npm install
Start Command: npm start

Environment Variables:
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-app.vercel.app

// Vercel Configuration
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist

Environment Variables:
VITE_API_URL=https://habit-tracker-api.onrender.com/api`
};

export const phase4Week14Lesson3 = {
    title: 'MongoDB Atlas Setup',
    videoUrl: 'https://www.youtube.com/embed/rPqRyYJmx2g',
    notes: `# 14.3 MongoDB Atlas Configuration

Setting up MongoDB Atlas for production database.

## Steps:
1. Create MongoDB Atlas account
2. Create a cluster
3. Configure network access
4. Create database user
5. Get connection string
6. Update environment variables`,
    codeSnippet: `// MongoDB Atlas Connection String
mongodb+srv://<username>:<password>@cluster.mongodb.net/habit-tracker-prod

// Network Access
Whitelist IP: 0.0.0.0/0 (Allow from anywhere)

// Database User
Username: production-user
Password: secure_password_here
Privileges: Read and write to any database

// Environment Variable in Render
MONGO_URI=mongodb+srv://production-user:secure_password@cluster.mongodb.net/habit-tracker-prod`
};

export const phase4Week14Lesson4 = {
    title: 'Testing & Troubleshooting',
    videoUrl: 'https://www.youtube.com/embed/OPxOtZ2jd6I',
    notes: `# 14.4 Post-Deployment Testing

Testing your deployed application and troubleshooting common issues.

## Testing Checklist:
- User registration
- User login
- Creating habits
- Toggling completions
- Deleting habits
- Mobile responsiveness
- Authentication persistence

## Common Issues:
- CORS errors
- MongoDB connection issues
- Environment variables not loading
- Build failures`,
    codeSnippet: `// Common CORS Fix
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// MongoDB Connection Debug
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Environment Variable Check
console.log('API URL:', import.meta.env.VITE_API_URL);

// Network Request Debug (Browser Console)
fetch('https://your-api.onrender.com/api/habits', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`
};


// Week 12 Quiz
export const phase4Week12Quiz = {
    title: 'Week 12 Quiz: Full-Stack Project Setup',
    questions: [
        {
            id: 1,
            question: 'What is a monorepo?',
            options: [
                'A single repository',
                'A repository containing multiple related projects',
                'A MongoDB repository',
                'A private repository'
            ],
            correctAnswer: 1,
            explanation: 'A monorepo is a single repository that contains multiple related projects (like frontend and backend).'
        },
        {
            id: 2,
            question: 'What is the purpose of environment variables?',
            options: [
                'To style components',
                'To store configuration and sensitive data',
                'To manage state',
                'To handle routing'
            ],
            correctAnswer: 1,
            explanation: 'Environment variables store configuration and sensitive data like API keys and database URLs.'
        },
        {
            id: 3,
            question: 'What is CORS?',
            options: [
                'A database',
                'Cross-Origin Resource Sharing - a security feature',
                'A React library',
                'A CSS framework'
            ],
            correctAnswer: 1,
            explanation: 'CORS is a security feature that controls which domains can access your API.'
        },
        {
            id: 4,
            question: 'What is middleware in Express?',
            options: [
                'A database layer',
                'Functions that execute during request-response cycle',
                'A frontend library',
                'A testing tool'
            ],
            correctAnswer: 1,
            explanation: 'Middleware functions have access to request and response objects and can modify them or end the request-response cycle.'
        },
        {
            id: 5,
            question: 'What is the purpose of a schema in Mongoose?',
            options: [
                'To style components',
                'To define the structure of documents',
                'To handle routing',
                'To manage authentication'
            ],
            correctAnswer: 1,
            explanation: 'A schema defines the structure, data types, and validation rules for MongoDB documents.'
        }
    ]
};

// Week 13 Quiz
export const phase4Week13Quiz = {
    title: 'Week 13 Quiz: Frontend Integration',
    questions: [
        {
            id: 1,
            question: 'What is the purpose of an API service layer?',
            options: [
                'To style components',
                'To centralize and organize API calls',
                'To manage state',
                'To handle routing'
            ],
            correctAnswer: 1,
            explanation: 'An API service layer centralizes API calls, making code more maintainable and reusable.'
        },
        {
            id: 2,
            question: 'What is an interceptor in Axios?',
            options: [
                'A middleware function',
                'A function that intercepts requests/responses',
                'A state manager',
                'A routing component'
            ],
            correctAnswer: 1,
            explanation: 'Interceptors allow you to modify requests before they are sent or responses before they are handled.'
        },
        {
            id: 3,
            question: 'What is optimistic UI update?',
            options: [
                'Updating UI before server confirms the change',
                'Updating UI after server response',
                'A CSS animation',
                'A routing technique'
            ],
            correctAnswer: 0,
            explanation: 'Optimistic updates immediately update the UI, assuming the server request will succeed.'
        },
        {
            id: 4,
            question: 'What is the purpose of loading states?',
            options: [
                'To improve SEO',
                'To provide user feedback during async operations',
                'To manage authentication',
                'To handle errors'
            ],
            correctAnswer: 1,
            explanation: 'Loading states inform users that an operation is in progress, improving user experience.'
        },
        {
            id: 5,
            question: 'What is prop drilling?',
            options: [
                'A performance optimization',
                'Passing props through multiple component levels',
                'A testing technique',
                'A routing method'
            ],
            correctAnswer: 1,
            explanation: 'Prop drilling is passing props through intermediate components that don\'t need them.'
        }
    ]
};

// Week 14 Quiz
export const phase4Week14Quiz = {
    title: 'Week 14 Quiz: Deployment & Production',
    questions: [
        {
            id: 1,
            question: 'What is the difference between development and production builds?',
            options: [
                'No difference',
                'Production builds are optimized and minified',
                'Development builds are faster',
                'Production builds have more features'
            ],
            correctAnswer: 1,
            explanation: 'Production builds are optimized, minified, and have debugging tools removed for better performance.'
        },
        {
            id: 2,
            question: 'What is MongoDB Atlas?',
            options: [
                'A local database',
                'A cloud-hosted MongoDB service',
                'A frontend framework',
                'A deployment platform'
            ],
            correctAnswer: 1,
            explanation: 'MongoDB Atlas is a fully-managed cloud database service for MongoDB.'
        },
        {
            id: 3,
            question: 'What is Render used for?',
            options: [
                'Rendering React components',
                'Deploying and hosting web applications',
                'Database management',
                'CSS styling'
            ],
            correctAnswer: 1,
            explanation: 'Render is a cloud platform for deploying and hosting web applications and APIs.'
        },
        {
            id: 4,
            question: 'What is Vercel primarily used for?',
            options: [
                'Backend deployment',
                'Frontend deployment and hosting',
                'Database hosting',
                'Email services'
            ],
            correctAnswer: 1,
            explanation: 'Vercel specializes in frontend deployment, especially for React, Next.js, and static sites.'
        },
        {
            id: 5,
            question: 'Why should you never commit .env files to Git?',
            options: [
                'They are too large',
                'They contain sensitive information like API keys',
                'They slow down the repository',
                'They cause merge conflicts'
            ],
            correctAnswer: 1,
            explanation: '.env files contain sensitive information like API keys and passwords that should never be public.'
        }
    ]
};

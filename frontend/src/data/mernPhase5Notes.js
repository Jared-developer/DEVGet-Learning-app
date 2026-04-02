// MERN Stack Bootcamp - Phase 5 Detailed Notes
// Professional Polish: Advanced Topics & Career Readiness (Weeks 15-16)

export const phase5Week15Lesson1 = {
  title: 'File Uploads with Multer',
  videoUrl: 'https://www.youtube.com/embed/wIOpe8S2Mk8',
  notes: `# 15.1 File Uploads with Multer

Most real-world applications require file uploads (profile pictures, document attachments, etc.). Multer is a Node.js middleware for handling multipart/form-data.

## Key Concepts:
- Multer middleware for handling file uploads
- Cloudinary for cloud-based image storage
- File validation and size limits
- Image transformations
- Frontend file upload components`,
  codeSnippet: `// Install dependencies
npm install multer cloudinary multer-storage-cloudinary

// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'habit-tracker',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Create multer upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload route
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.avatar = {
      publicId: req.file.filename,
      url: req.file.path
    };
    
    await user.save();
    res.json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Frontend Upload Component
const AvatarUpload = ({ currentAvatar, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar?.url);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      const response = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadComplete(response.data.avatar);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <img src={preview || '/default-avatar.png'} alt="Avatar" />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
    </div>
  );
};`
};

export const phase5Week15Lesson2 = {
  title: 'WebSockets with Socket.io',
  videoUrl: 'https://www.youtube.com/embed/1BfCnjr_Vjg',
  notes: `# 15.2 WebSockets with Socket.io

Real-time features (live chat, notifications, collaborative editing) require WebSockets.

## Features:
- Real-time bidirectional communication
- Authentication with Socket.io
- Room-based messaging
- Event handling
- Frontend integration`,
  codeSnippet: `// Install Socket.io
npm install socket.io

// backend/server.js
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Socket.io middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Connection handling
io.on('connection', (socket) => {
  console.log(\`User \${socket.userId} connected\`);
  
  // Join user to their personal room
  socket.join(\`user:\${socket.userId}\`);
  
  // Handle habit completion notification
  socket.on('habit-completed', async (data) => {
    socket.broadcast.emit('notification', {
      type: 'habit-completed',
      userId: socket.userId,
      habitName: data.habitName,
      timestamp: new Date()
    });
  });
  
  socket.on('disconnect', () => {
    console.log(\`User \${socket.userId} disconnected\`);
  });
});

server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

// Frontend Socket Integration
npm install socket.io-client

// SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const newSocket = io(import.meta.env.VITE_API_URL.replace('/api', ''), {
      auth: { token }
    });

    newSocket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 50));
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};`
};

export const phase5Week15Lesson3 = {
  title: 'Introduction to TypeScript',
  videoUrl: 'https://www.youtube.com/embed/d56mG7DezGs',
  notes: `# 15.3 Introduction to TypeScript

TypeScript adds static typing to JavaScript, catching errors at compile time rather than runtime.

## Why TypeScript?
- Catch errors early during development
- Better IDE support with autocomplete
- Self-documenting code through types
- Safer refactoring
- Better team collaboration`,
  codeSnippet: `// Install TypeScript
npm install -D typescript @types/node @types/express
npx tsc --init

// types/index.ts
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: {
    publicId: string;
    url: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IHabit {
  _id: string;
  user: string | IUser;
  name: string;
  description?: string;
  color: string;
  entries: IHabitEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models/User.js';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    const user = await User.create({ name, email, password });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};`
};

export const phase5Week15Lesson4 = {
  title: 'TypeScript with React',
  videoUrl: 'https://www.youtube.com/embed/TPACABQTHvM',
  notes: `# 15.4 TypeScript with React

Using TypeScript with React provides better type safety and developer experience.

## Benefits:
- Props type checking
- State type safety
- Better IDE support
- Catch errors at compile time
- Self-documenting components`,
  codeSnippet: `// Create React + TypeScript project
npm create vite@latest frontend-ts -- --template react-ts

// types/index.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    publicId: string;
    url: string;
  };
}

export interface Habit {
  _id: string;
  user: string;
  name: string;
  description?: string;
  color: string;
  entries: HabitEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// components/HabitCard.tsx
import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  selectedDate: Date;
  onToggle: (habitId: string, date: Date, completed: boolean) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  selectedDate,
  onToggle,
  onDelete
}) => {
  const [isToggling, setIsToggling] = useState<boolean>(false);
  
  const handleToggle = async (): Promise<void> => {
    setIsToggling(true);
    try {
      await onToggle(habit._id, selectedDate, !isCompleted);
    } finally {
      setIsToggling(false);
    }
  };
  
  return (
    <div className="habit-card">
      <h3>{habit.name}</h3>
      <button onClick={handleToggle} disabled={isToggling}>
        {isToggling ? '...' : 'Toggle'}
      </button>
    </div>
  );
};

export default HabitCard;`
};

export const phase5Week16Lesson1 = {
  title: 'Capstone Project Planning',
  videoUrl: 'https://www.youtube.com/watch?v=fYq5PXgSsbE',
  notes: `# 16.1 Capstone Project Requirements

Students will build and deploy a full-stack MERN application of their choice. This is their portfolio piece.

## Project Ideas:
- E-commerce Platform
- Social Media Dashboard
- Task Management Tool
- Blog Platform
- Real Estate Listing Platform

## Technical Requirements:
- Backend: Node.js/Express with TypeScript
- Frontend: React with TypeScript
- Database: MongoDB with Mongoose
- Authentication: JWT
- File uploads
- Real-time features (choose 1)
- Deployment: Render + Vercel`,
  codeSnippet: `// Project Structure
project-name/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.ts
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── .env
│   └── package.json
└── README.md

// Timeline
Day 1-2: Planning & Setup
Day 3-5: Backend Development
Day 6-8: Frontend Development
Day 9-10: Advanced Features
Day 11-12: Deployment
Day 13-14: Documentation & Presentation`
};

export const phase5Week16Lesson2 = {
  title: 'Professional Portfolio Development',
  videoUrl: 'https://www.youtube.com/embed/0h2b4ftbZcU',
  notes: `# 16.2 Building Your Developer Portfolio

Create a personal portfolio website showcasing your best work.

## Portfolio Essentials:
- Your best 3-4 projects (including capstone)
- Clear description of your role and technologies
- Live links and GitHub repositories
- Your tech stack and skills
- Contact information and social links

## Resume Tips:
- Use STAR method for project descriptions
- Highlight technical skills clearly
- Include metrics and achievements
- Keep it concise (1-2 pages)`,
  codeSnippet: `// Professional README Template
# Project Name

![Project Screenshot](./screenshot.png)

## 📝 Description
A brief description of your project, what problem it solves, and who it's for.

## 🚀 Live Demo
- **Frontend:** [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend API:** [https://your-api.onrender.com](https://your-api.onrender.com)

## ✨ Features
- User authentication (JWT)
- Real-time updates with Socket.io
- Responsive design for all devices
- File upload with Cloudinary

## 🛠️ Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS
**Backend:** Node.js, Express, MongoDB
**DevOps:** Vercel, Render, MongoDB Atlas

## 📦 Installation
\`\`\`bash
git clone https://github.com/yourusername/project-name.git
cd project-name/backend
npm install
npm run dev
\`\`\`

## 👨‍💻 Author
Your Name
- GitHub: @yourusername
- LinkedIn: Your Name
- Portfolio: yourportfolio.com`
};

export const phase5Week16Lesson3 = {
  title: 'Interview Preparation',
  videoUrl: 'https://www.youtube.com/embed/1qw5ITr3k9E',
  notes: `# 16.3 Interview Preparation

## Common MERN Stack Interview Questions

### JavaScript:
- Explain closures and give an example
- What's the difference between == and ===?
- Explain event delegation
- How does the 'this' keyword work?
- Explain promises and async/await

### React:
- What is the virtual DOM and how does it work?
- Explain the useEffect hook and its dependency array
- What's the difference between props and state?
- How do you optimize React performance?
- Explain the Context API and when to use it

### Node.js/Express:
- How does the event loop work?
- What are middleware functions?
- How do you handle errors in Express?
- Explain JWT authentication flow

### System Design:
- How would you design a URL shortener?
- How do you handle rate limiting?
- Explain how you'd scale a MERN application`,
  codeSnippet: `// Behavioral Questions (STAR Method)
// Situation, Task, Action, Result

// Example: "Tell me about a challenging bug you fixed"
// Situation: In my Habit Tracker app, users reported streaks resetting
// Task: Identify why streak calculations were inconsistent
// Action: Added logging, discovered timezone issues, implemented UTC solution
// Result: 100% accurate calculations, added unit tests

// Take-home Challenge Tips:
// 1. Read requirements carefully
// 2. Plan before coding
// 3. Write clean, modular code
// 4. Add error handling
// 5. Include tests
// 6. Write documentation
// 7. Deploy it

// Common Coding Challenges:
function reverseString(str) {
  return str.split('').reverse().join('');
}

function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}`
};

export const phase5Week16Lesson4 = {
  title: 'Career Development & Next Steps',
  videoUrl: 'https://www.youtube.com/watch?v=xpaz7nrNmXA',
  notes: `# 16.4 Next Steps After the Bootcamp

## Job Search Strategy
- **Week 1-2:** Polish portfolio, update LinkedIn
- **Week 3-4:** Apply to 5-10 jobs daily, network
- **Week 5-6:** Practice coding challenges, interviews
- **Week 7-8:** Follow up, negotiate offers

## Continuous Learning Path
- Deepen knowledge: Advanced patterns, system design
- Learn related technologies: Next.js, GraphQL, Docker
- Contribute to open source projects
- Build more projects solving real problems
- Write technical blogs
- Attend meetups and conferences

## Resources for Growth
- Books: "You Don't Know JS", "Clean Code"
- Courses: Advanced React, System Design
- Practice: LeetCode, Frontend Mentor
- Communities: DEV, Reddit, Discord groups`,
  codeSnippet: `// Your MERN Stack Journey Checklist:
// ✅ Phase 1: Foundation (JavaScript, HTML, CSS)
// ✅ Phase 2: Backend (Node, Express, MongoDB, Auth)
// ✅ Phase 3: Frontend (React, Hooks, Router, Context)
// ✅ Phase 4: Full Stack (Complete MERN Application)
// ✅ Phase 5: Professional Polish (Advanced Topics, Career Prep)

// Technical Skills for Resume:
const skills = {
  languages: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3'],
  frontend: ['React', 'React Router', 'Context API', 'Tailwind CSS'],
  backend: ['Node.js', 'Express.js', 'REST APIs', 'Socket.io'],
  database: ['MongoDB', 'Mongoose', 'MongoDB Atlas'],
  tools: ['Git', 'GitHub', 'Vercel', 'Render', 'Postman', 'VS Code'],
  other: ['JWT Authentication', 'Cloudinary', 'Agile/Scrum']
};

// Project Description Template (STAR Method):
const projectDescription = \`
Habit Tracker | MERN Stack, TypeScript, Socket.io, Recharts
• Developed full-stack habit tracking app with JWT authentication
• Implemented real-time notifications using Socket.io
• Created interactive charts with Recharts for progress visualization
• Deployed on Vercel (frontend) and Render (backend)
• Reduced page load time by 40% through code splitting
\`;

// Final Words of Wisdom:
// "The expert in anything was once a beginner." — Helen Hayes
// Keep building. Keep learning. Keep failing and fixing.
// Every bug you fix makes you a better developer.
// Now go build something amazing! 🚀`
};

// Week 15 Quiz
export const phase5Week15Quiz = {
  title: 'Week 15 Quiz: Advanced Topics & TypeScript',
  questions: [
    {
      id: 1,
      question: 'What is Multer used for in Node.js applications?',
      options: [
        'Database connection management',
        'Handling multipart/form-data for file uploads',
        'User authentication',
        'API rate limiting'
      ],
      correctAnswer: 1,
      explanation: 'Multer is a Node.js middleware for handling multipart/form-data, which is primarily used for uploading files.'
    },
    {
      id: 2,
      question: 'Which cloud service is commonly used with Multer for storing uploaded images?',
      options: [
        'MongoDB Atlas',
        'Heroku',
        'Cloudinary',
        'Vercel'
      ],
      correctAnswer: 2,
      explanation: 'Cloudinary is a popular cloud-based image and video management service that integrates well with Multer for storing uploaded files.'
    },
    {
      id: 3,
      question: 'What is the main advantage of WebSockets over traditional HTTP requests?',
      options: [
        'Better security',
        'Real-time bidirectional communication',
        'Smaller file sizes',
        'Easier to implement'
      ],
      correctAnswer: 1,
      explanation: 'WebSockets enable real-time bidirectional communication between client and server, allowing instant data updates without polling.'
    },
    {
      id: 4,
      question: 'In Socket.io, what method is used to send a message to all connected clients except the sender?',
      options: [
        'socket.emit()',
        'socket.broadcast.emit()',
        'io.emit()',
        'socket.send()'
      ],
      correctAnswer: 1,
      explanation: 'socket.broadcast.emit() sends a message to all connected clients except the sender.'
    },
    {
      id: 5,
      question: 'What is the primary benefit of using TypeScript over JavaScript?',
      options: [
        'Faster execution speed',
        'Smaller bundle sizes',
        'Static type checking at compile time',
        'Better browser compatibility'
      ],
      correctAnswer: 2,
      explanation: 'TypeScript adds static type checking, catching errors during development before runtime, improving code quality and maintainability.'
    },
    {
      id: 6,
      question: 'Which file is used to configure TypeScript compiler options?',
      options: [
        'package.json',
        'tsconfig.json',
        'typescript.config.js',
        '.tsrc'
      ],
      correctAnswer: 1,
      explanation: 'tsconfig.json is the configuration file for TypeScript compiler options and project settings.'
    },
    {
      id: 7,
      question: 'In TypeScript with React, what is the correct way to define props for a functional component?',
      options: [
        'Using PropTypes',
        'Using an interface or type',
        'Using JSDoc comments',
        'Props are automatically inferred'
      ],
      correctAnswer: 1,
      explanation: 'In TypeScript with React, you define props using an interface or type, providing type safety for component props.'
    },
    {
      id: 8,
      question: 'What does React.FC stand for in TypeScript?',
      options: [
        'React Function Call',
        'React Functional Component',
        'React Form Control',
        'React File Component'
      ],
      correctAnswer: 1,
      explanation: 'React.FC stands for React Functional Component, a TypeScript type for functional components.'
    },
    {
      id: 9,
      question: 'What is the maximum file size limit commonly set for file uploads to prevent abuse?',
      options: [
        '500KB',
        '1MB',
        '5MB',
        '50MB'
      ],
      correctAnswer: 2,
      explanation: '5MB is a common limit for file uploads, balancing user needs with server resources and preventing abuse.'
    },
    {
      id: 10,
      question: 'In Socket.io, what is a "room" used for?',
      options: [
        'Storing user data',
        'Grouping sockets for targeted message broadcasting',
        'Managing database connections',
        'Handling authentication'
      ],
      correctAnswer: 1,
      explanation: 'Rooms in Socket.io allow you to group sockets together so you can broadcast messages to specific groups of clients.'
    }
  ]
};

// Week 16 Quiz
export const phase5Week16Quiz = {
  title: 'Week 16 Quiz: Capstone Project & Career Prep',
  questions: [
    {
      id: 1,
      question: 'What should be the primary focus of your capstone project?',
      options: [
        'Using as many technologies as possible',
        'Solving a real problem with clean, functional code',
        'Making it visually complex',
        'Copying existing applications exactly'
      ],
      correctAnswer: 1,
      explanation: 'Your capstone should focus on solving a real problem with clean, well-structured code that demonstrates your skills effectively.'
    },
    {
      id: 2,
      question: 'How many projects should you showcase in your developer portfolio?',
      options: [
        '1-2 projects',
        '3-4 best projects',
        '10+ projects',
        'All projects you\'ve ever built'
      ],
      correctAnswer: 1,
      explanation: 'Quality over quantity - showcase your 3-4 best projects that demonstrate different skills and are well-polished.'
    },
    {
      id: 3,
      question: 'What does the STAR method stand for in behavioral interviews?',
      options: [
        'Skills, Tasks, Actions, Results',
        'Situation, Task, Action, Result',
        'Start, Test, Analyze, Review',
        'Strategy, Tactics, Assessment, Reflection'
      ],
      correctAnswer: 1,
      explanation: 'STAR stands for Situation, Task, Action, Result - a structured way to answer behavioral interview questions.'
    },
    {
      id: 4,
      question: 'What is the recommended length for a developer resume?',
      options: [
        'Half a page',
        '1-2 pages',
        '3-4 pages',
        'As long as needed'
      ],
      correctAnswer: 1,
      explanation: 'A developer resume should be concise at 1-2 pages, highlighting relevant skills, projects, and experience.'
    },
    {
      id: 5,
      question: 'Which section is most important in a project README file?',
      options: [
        'Author biography',
        'Project description and setup instructions',
        'Future feature wishlist',
        'Personal opinions'
      ],
      correctAnswer: 1,
      explanation: 'Clear project description and setup instructions are crucial so others can understand and run your project easily.'
    },
    {
      id: 6,
      question: 'What is the virtual DOM in React?',
      options: [
        'A cloud storage system',
        'A lightweight copy of the actual DOM for efficient updates',
        'A database for React components',
        'A testing framework'
      ],
      correctAnswer: 1,
      explanation: 'The virtual DOM is a lightweight JavaScript representation of the actual DOM, allowing React to efficiently update only what changed.'
    },
    {
      id: 7,
      question: 'In a technical interview, what should you do if you don\'t know the answer to a question?',
      options: [
        'Make up an answer',
        'Stay silent',
        'Explain your thought process and what you do know',
        'Change the subject'
      ],
      correctAnswer: 2,
      explanation: 'Be honest, explain your thought process, and show how you would find the answer. Interviewers value problem-solving approach.'
    },
    {
      id: 8,
      question: 'What is the recommended frequency for applying to jobs during your job search?',
      options: [
        '1-2 jobs per week',
        '5-10 jobs per day',
        '20+ jobs per day',
        'Wait for perfect matches only'
      ],
      correctAnswer: 1,
      explanation: 'Applying to 5-10 quality jobs daily with tailored applications is more effective than mass applying without customization.'
    },
    {
      id: 9,
      question: 'Which of these is NOT a good practice for your GitHub profile?',
      options: [
        'Pinning your best repositories',
        'Writing clear README files',
        'Committing regularly',
        'Pushing all practice code including broken experiments'
      ],
      correctAnswer: 3,
      explanation: 'Your GitHub should showcase quality work. Keep practice code private and only showcase polished, working projects.'
    },
    {
      id: 10,
      question: 'What is the best way to continue learning after completing a bootcamp?',
      options: [
        'Stop learning and only apply for jobs',
        'Build projects, contribute to open source, and learn new technologies',
        'Only watch tutorial videos',
        'Memorize interview questions'
      ],
      correctAnswer: 1,
      explanation: 'Continuous learning through building projects, contributing to open source, and exploring new technologies keeps your skills sharp and demonstrates passion.'
    }
  ]
};

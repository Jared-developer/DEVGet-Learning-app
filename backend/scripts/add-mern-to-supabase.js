import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const mernCourse = {
    title: 'Complete MERN Stack Development',
    description: 'Master full-stack web development with MongoDB, Express.js, React, and Node.js. Build production-ready applications from scratch with hands-on projects, live sessions, and comprehensive assignments.',
    category: 'advanced',
    difficulty: 'intermediate',
    duration: '16 weeks',
    instructor: 'DEVGet Learning Team',
    thumbnail: '/images/course-thumbnails/mern-stack.jpg',
    price: 0,
    is_free: true,
    lessons: [
        {
            id: 'week-1-2',
            title: 'Week 1-2: MongoDB Fundamentals',
            description: 'Master NoSQL database concepts and MongoDB operations',
            duration: '2 weeks',
            topics: [
                'Introduction to MERN Stack & Course Overview',
                'Introduction to MongoDB & NoSQL Databases',
                'MongoDB CRUD Operations',
                'MongoDB Schema Design & Relationships',
                'Live Sessions and Assignments'
            ]
        },
        {
            id: 'week-3-4',
            title: 'Week 3-4: Node.js & Express.js',
            description: 'Build robust backend APIs with Node.js and Express',
            duration: '2 weeks',
            topics: [
                'Introduction to Node.js',
                'Express.js Framework Basics',
                'RESTful API Design Principles',
                'Middleware in Express',
                'Building a Task Management API'
            ]
        },
        {
            id: 'week-5-6',
            title: 'Week 5-6: Authentication & Security',
            description: 'Implement secure authentication and authorization',
            duration: '2 weeks',
            topics: [
                'JWT Authentication',
                'Password Hashing with bcrypt',
                'Protected Routes',
                'Role-Based Access Control',
                'Security Best Practices'
            ]
        },
        {
            id: 'week-7-8',
            title: 'Week 7-8: React Fundamentals',
            description: 'Build modern user interfaces with React',
            duration: '2 weeks',
            topics: [
                'React Components and JSX',
                'State and Props',
                'React Hooks (useState, useEffect)',
                'Event Handling',
                'Conditional Rendering'
            ]
        },
        {
            id: 'week-9-10',
            title: 'Week 9-10: Advanced React',
            description: 'Master advanced React patterns and state management',
            duration: '2 weeks',
            topics: [
                'Context API',
                'Custom Hooks',
                'React Router',
                'Form Handling',
                'API Integration'
            ]
        },
        {
            id: 'week-11-12',
            title: 'Week 11-12: Full Stack Integration',
            description: 'Connect frontend and backend',
            duration: '2 weeks',
            topics: [
                'Connecting React to Express API',
                'Axios and Fetch',
                'Error Handling',
                'Loading States',
                'Authentication Flow'
            ]
        },
        {
            id: 'week-13-14',
            title: 'Week 13-14: Advanced Features',
            description: 'Add real-time features and file uploads',
            duration: '2 weeks',
            topics: [
                'File Uploads with Multer',
                'Image Optimization',
                'Real-time with Socket.io',
                'Notifications',
                'Search and Filtering'
            ]
        },
        {
            id: 'week-15-16',
            title: 'Week 15-16: Deployment & Best Practices',
            description: 'Deploy your application to production',
            duration: '2 weeks',
            topics: [
                'Environment Variables',
                'Production Build',
                'Deploying to Heroku/Vercel',
                'MongoDB Atlas Setup',
                'CI/CD Basics',
                'Final Project'
            ]
        }
    ]
};

async function addMernCourse() {
    try {
        console.log('🚀 Adding MERN Stack course to Supabase...');

        const { data, error } = await supabase
            .from('courses')
            .insert([mernCourse])
            .select();

        if (error) {
            console.error('❌ Error adding course:', error);
            process.exit(1);
        }

        console.log('✅ MERN Stack course added successfully!');
        console.log('📊 Course ID:', data[0].id);
        console.log('📚 Course Title:', data[0].title);
        console.log('🎓 Lessons:', data[0].lessons.length);

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

addMernCourse();

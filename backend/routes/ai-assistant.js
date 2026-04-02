import express from 'express';
import { supabase } from '../config/supabase.js';
import { supabaseProtect } from '../middleware/supabaseAuth.js';

const router = express.Router();

// Mock AI responses for different course topics
const aiResponses = {
    'javascript': {
        keywords: ['javascript', 'js', 'function', 'variable', 'array', 'object', 'dom', 'event'],
        responses: [
            "JavaScript is a versatile programming language! What specific concept would you like me to explain?",
            "I can help you with JavaScript fundamentals like variables, functions, arrays, and DOM manipulation.",
            "JavaScript can be tricky at first, but with practice it becomes second nature. What's challenging you?"
        ]
    },
    'react': {
        keywords: ['react', 'component', 'jsx', 'state', 'props', 'hook', 'usestate', 'useeffect'],
        responses: [
            "React is a powerful library for building user interfaces! Components are the building blocks.",
            "React hooks like useState and useEffect make managing state and side effects much easier.",
            "JSX allows you to write HTML-like syntax in JavaScript. It's compiled to regular JavaScript."
        ]
    },
    'python': {
        keywords: ['python', 'list', 'dictionary', 'function', 'class', 'import', 'pandas', 'numpy'],
        responses: [
            "Python is great for beginners! Its syntax is clean and readable.",
            "Python has powerful libraries like pandas for data analysis and numpy for numerical computing.",
            "Python functions are defined with 'def' and classes with 'class'. Indentation is important!"
        ]
    },
    'ai': {
        keywords: ['ai', 'machine learning', 'ml', 'neural network', 'tensorflow', 'pytorch', 'model', 'training'],
        responses: [
            "AI and Machine Learning are fascinating fields! Are you working on a specific algorithm?",
            "Machine learning models learn patterns from data. What type of problem are you trying to solve?",
            "Neural networks are inspired by the human brain and are great for complex pattern recognition."
        ]
    },
    'mern': {
        keywords: ['mern', 'mongodb', 'express', 'node', 'fullstack', 'api', 'database'],
        responses: [
            "MERN stack combines MongoDB, Express, React, and Node.js for full-stack development!",
            "The MERN stack is perfect for building modern web applications with JavaScript everywhere.",
            "Each part of MERN has its role: MongoDB for data, Express for APIs, React for UI, Node for server."
        ]
    },
    'general': {
        keywords: ['help', 'stuck', 'confused', 'error', 'bug', 'problem'],
        responses: [
            "I'm here to help! Can you tell me more about what you're working on?",
            "Don't worry, everyone gets stuck sometimes. What specific topic or concept is challenging you?",
            "Let's break down the problem step by step. What are you trying to accomplish?"
        ]
    }
};

// Get AI response based on user message and course context
const generateAIResponse = (message, courseId, enrollment) => {
    const lowerMessage = message.toLowerCase();
    const courseTitle = enrollment?.course?.title?.toLowerCase() || '';
    const courseCategory = enrollment?.course?.category?.toLowerCase() || '';

    // Find matching topic based on keywords
    let matchedTopic = 'general';
    let maxMatches = 0;

    for (const [topic, data] of Object.entries(aiResponses)) {
        const matches = data.keywords.filter(keyword =>
            lowerMessage.includes(keyword)
        ).length;

        if (matches > maxMatches) {
            maxMatches = matches;
            matchedTopic = topic;
        }
    }

    // Get random response from matched topic
    const responses = aiResponses[matchedTopic].responses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add course-specific context based on actual enrollment
    let contextualResponse = randomResponse;

    if (enrollment?.course) {
        const courseName = enrollment.course.title;

        // MERN Stack Course
        if (courseTitle.includes('mern') || courseCategory.includes('mern')) {
            contextualResponse += ` Since you're enrolled in "${courseName}", I can help you with MongoDB database design, Express.js API development, React component architecture, Node.js backend logic, and full-stack integration. What specific aspect would you like to explore?`;
        }
        // AI/ML Course
        else if (courseTitle.includes('ai') || courseTitle.includes('machine learning') || courseCategory.includes('ai')) {
            contextualResponse += ` As you're taking "${courseName}", I can assist with machine learning algorithms, neural networks, data preprocessing, model training and evaluation, TensorFlow/PyTorch, and AI project implementation. What would you like to dive into?`;
        }
        // Agentic AI Course
        else if (courseTitle.includes('agentic') || courseCategory.includes('agentic')) {
            contextualResponse += ` In your "${courseName}" course, I can help with autonomous agents, LangChain, agent architectures, tool integration, multi-agent systems, and building intelligent AI applications. What topic interests you?`;
        }
        // HTML/CSS Course
        else if (courseTitle.includes('html') || courseTitle.includes('css') || courseCategory.includes('web')) {
            contextualResponse += ` For "${courseName}", I can explain HTML5 semantic elements, CSS layouts (Flexbox, Grid), responsive design, accessibility, and modern web development practices. What would you like to learn?`;
        }
        // Python Course
        else if (courseTitle.includes('python') || courseCategory.includes('python')) {
            contextualResponse += ` In "${courseName}", I can help with Python syntax, data structures (lists, dictionaries, sets), functions, OOP concepts, popular libraries (pandas, numpy), and best practices. What's your question?`;
        }
        // JavaScript Course
        else if (courseTitle.includes('javascript') || courseCategory.includes('javascript')) {
            contextualResponse += ` For your "${courseName}" course, I can explain JavaScript fundamentals, ES6+ features, async/await, promises, DOM manipulation, closures, and modern JS patterns. What would you like to understand better?`;
        }
        // Blockchain Course
        else if (courseTitle.includes('blockchain') || courseCategory.includes('blockchain')) {
            contextualResponse += ` In "${courseName}", I can help with blockchain fundamentals, smart contracts, Solidity, Web3, DeFi concepts, and decentralized application development. What aspect interests you?`;
        }
        // Generic advanced course
        else {
            contextualResponse += ` I'm here to help you succeed in "${courseName}". Feel free to ask me anything about the course content, concepts, or projects!`;
        }
    }

    return contextualResponse;
};

// Chat with AI assistant
router.post('/chat', supabaseProtect, async (req, res) => {
    try {
        const { message, courseId, conversationId } = req.body;
        const userId = req.user.id;

        console.log('🤖 AI Chat Request:', { userId, courseId, message: message?.substring(0, 50) });

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Message is required'
            });
        }

        if (!courseId) {
            return res.status(400).json({
                status: 'error',
                message: 'Course ID is required'
            });
        }

        // Check if user is enrolled in the course
        console.log('📝 Checking enrollment...');
        const { data: enrollment, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('id, course_id, status')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (enrollmentError) {
            console.error('❌ Enrollment error:', enrollmentError);
        }
        if (!enrollment) {
            console.log('❌ No enrollment found');
        }

        if (enrollmentError || !enrollment) {
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course to use the AI assistant'
            });
        }

        console.log('✅ Enrollment found:', enrollment);

        // Get course details to check if it's advanced (paid)
        console.log('📚 Fetching course details...');
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('id, title, category, is_free, price, difficulty')
            .eq('id', courseId)
            .single();

        if (courseError) {
            console.error('❌ Course error:', courseError);
        }
        if (!course) {
            console.log('❌ No course found');
        }

        if (courseError || !course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        console.log('✅ Course found:', { title: course.title, is_free: course.is_free });

        // Check if course is advanced (not free)
        if (course.is_free) {
            console.log('🔒 Course is free - access denied');
            return res.status(403).json({
                status: 'error',
                message: 'Get.AI assistant is only available for advanced (Pro) courses. Upgrade to Pro to access AI assistance!'
            });
        }

        console.log('✅ Course is Pro - generating response...');

        // Create enrollment object with course data for context
        const enrollmentWithCourse = {
            ...enrollment,
            course: course
        };

        // Generate AI response with course context
        const aiResponse = generateAIResponse(message, courseId, enrollmentWithCourse);

        console.log('✅ AI response generated');

        // Store conversation in database (optional - for future conversation history)
        const conversationData = {
            user_id: userId,
            course_id: courseId,
            conversation_id: conversationId || `conv_${Date.now()}_${userId}`,
            user_message: message,
            ai_response: aiResponse,
            created_at: new Date().toISOString()
        };

        // For now, we'll just return the response without storing
        // In a real implementation, you might want to store conversations

        res.json({
            status: 'success',
            data: {
                response: aiResponse,
                conversationId: conversationData.conversation_id,
                timestamp: conversationData.created_at
            }
        });

    } catch (error) {
        console.error('❌ AI Assistant error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get AI response',
            error: error.message
        });
    }
});

// Get conversation history (optional feature)
router.get('/conversations', supabaseProtect, async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, limit = 50 } = req.query;

        // For now, return empty array since we're not storing conversations
        // In a real implementation, you would query the conversations table

        res.json({
            status: 'success',
            data: {
                conversations: [],
                total: 0
            }
        });

    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get conversation history'
        });
    }
});

// Get AI assistant suggestions based on current lesson
router.post('/suggestions', supabaseProtect, async (req, res) => {
    try {
        const { courseId, lessonId, lessonTitle } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({
                status: 'error',
                message: 'Course ID is required'
            });
        }

        // Check if user is enrolled
        const { data: enrollment, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('id, course_id, status')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (enrollmentError || !enrollment) {
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course'
            });
        }

        // Get course details to check if it's advanced
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('id, title, is_free')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        if (course.is_free) {
            return res.status(403).json({
                status: 'error',
                message: 'Get.AI assistant is only available for advanced (Pro) courses'
            });
        }

        // Generate contextual suggestions based on lesson
        const suggestions = [];

        if (lessonTitle) {
            const lowerTitle = lessonTitle.toLowerCase();

            if (lowerTitle.includes('javascript') || lowerTitle.includes('js')) {
                suggestions.push(
                    "Can you explain JavaScript closures?",
                    "How do I handle asynchronous operations?",
                    "What's the difference between let, const, and var?"
                );
            } else if (lowerTitle.includes('react')) {
                suggestions.push(
                    "How do React hooks work?",
                    "What's the difference between state and props?",
                    "How do I handle forms in React?"
                );
            } else if (lowerTitle.includes('python')) {
                suggestions.push(
                    "How do I work with lists and dictionaries?",
                    "Can you explain Python decorators?",
                    "What are the best practices for error handling?"
                );
            } else if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning')) {
                suggestions.push(
                    "What's the difference between supervised and unsupervised learning?",
                    "How do I choose the right algorithm?",
                    "Can you explain neural network basics?"
                );
            } else if (lowerTitle.includes('mongodb') || lowerTitle.includes('database')) {
                suggestions.push(
                    "How do I design a MongoDB schema?",
                    "What's the difference between SQL and NoSQL?",
                    "How do I optimize database queries?"
                );
            } else if (lowerTitle.includes('express') || lowerTitle.includes('api')) {
                suggestions.push(
                    "How do I create RESTful APIs?",
                    "What's middleware in Express?",
                    "How do I handle errors in Express?"
                );
            } else if (lowerTitle.includes('node')) {
                suggestions.push(
                    "How does Node.js event loop work?",
                    "What are streams in Node.js?",
                    "How do I handle async operations?"
                );
            } else if (lowerTitle.includes('agentic') || lowerTitle.includes('agent')) {
                suggestions.push(
                    "How do autonomous agents work?",
                    "What is LangChain used for?",
                    "How do I build a multi-agent system?"
                );
            } else {
                suggestions.push(
                    "I'm stuck on this concept, can you help?",
                    "Can you give me a practical example?",
                    "What are the key points I should remember?"
                );
            }
        } else {
            suggestions.push(
                "I need help understanding this topic",
                "Can you explain this in simpler terms?",
                "What should I focus on learning next?"
            );
        }

        res.json({
            status: 'success',
            data: {
                suggestions: suggestions.slice(0, 3) // Return top 3 suggestions
            }
        });

    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get suggestions'
        });
    }
});

export default router;
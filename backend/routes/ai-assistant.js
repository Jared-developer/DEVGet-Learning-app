import express from 'express';
import Groq from 'groq-sdk';
import { supabase } from '../config/supabase.js';
import { supabaseProtect } from '../middleware/supabaseAuth.js';

const router = express.Router();

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

console.log('🤖 Groq AI initialized:', process.env.GROQ_API_KEY ? 'API key found' : 'API key missing');

// Course context data for AI understanding
const courseContexts = {
    'mern-stack': {
        title: 'MERN Stack Development',
        description: 'Full-stack web development using MongoDB, Express.js, React, and Node.js',
        topics: [
            'MongoDB database design and operations',
            'Express.js API development and middleware',
            'React component architecture and hooks',
            'Node.js backend development',
            'RESTful API design',
            'Authentication and authorization',
            'State management with Redux',
            'Full-stack application deployment'
        ],
        level: 'Advanced'
    },
    'ai-ml': {
        title: 'AI & Machine Learning',
        description: 'Comprehensive AI and ML from fundamentals to deep learning',
        topics: [
            'Machine learning fundamentals',
            'Supervised and unsupervised learning',
            'Neural networks and deep learning',
            'TensorFlow and PyTorch',
            'Natural Language Processing',
            'Computer Vision',
            'Model training and evaluation',
            'AI project deployment'
        ],
        level: 'Intermediate to Advanced'
    },
    'agentic-ai': {
        title: 'Agentic AI Development',
        description: 'Building autonomous AI agents and intelligent systems',
        topics: [
            'Autonomous agent architectures',
            'LangChain framework',
            'Tool integration and function calling',
            'Multi-agent systems',
            'Agent memory and context management',
            'RAG (Retrieval Augmented Generation)',
            'Agent orchestration',
            'Production AI agent deployment'
        ],
        level: 'Expert'
    },
    'html-fundamentals': {
        title: 'HTML Fundamentals',
        description: 'Building blocks of web development with HTML5',
        topics: [
            'HTML5 semantic elements',
            'Document structure',
            'Forms and input types',
            'Multimedia elements',
            'Accessibility best practices',
            'SEO fundamentals',
            'HTML validation',
            'Modern HTML features'
        ],
        level: 'Beginner'
    },
    'css-styling': {
        title: 'CSS Styling',
        description: 'Master styling and responsive design',
        topics: [
            'CSS selectors and specificity',
            'Flexbox layout',
            'CSS Grid',
            'Responsive design',
            'CSS animations',
            'Modern CSS features',
            'CSS preprocessors',
            'Design systems'
        ],
        level: 'Beginner to Intermediate'
    },
    'javascript-essentials': {
        title: 'JavaScript Essentials',
        description: 'Programming fundamentals and DOM manipulation',
        topics: [
            'JavaScript syntax and data types',
            'Functions and scope',
            'Arrays and objects',
            'DOM manipulation',
            'Event handling',
            'Asynchronous JavaScript',
            'ES6+ features',
            'Modern JavaScript patterns'
        ],
        level: 'Beginner to Intermediate'
    },
    'python-basics': {
        title: 'Python Basics',
        description: 'Learn Python programming from scratch',
        topics: [
            'Python syntax and data types',
            'Control flow and loops',
            'Functions and modules',
            'Object-oriented programming',
            'File handling',
            'Error handling',
            'Popular libraries (pandas, numpy)',
            'Python best practices'
        ],
        level: 'Beginner'
    }
};

// Generate system prompt based on course context
const generateSystemPrompt = (courseContext) => {
    if (!courseContext) {
        return `You are Get.AI, a helpful and knowledgeable learning assistant for DEVGet Learning Platform. 
You help students understand programming concepts, debug code, and provide guidance on their learning journey.
Be encouraging, clear, and provide practical examples when explaining concepts.`;
    }

    return `You are Get.AI, a specialized learning assistant for the "${courseContext.title}" course on DEVGet Learning Platform.

Course Description: ${courseContext.description}
Course Level: ${courseContext.level}

Key Topics Covered:
${courseContext.topics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

Your role is to:
- Help students understand course concepts deeply
- Provide clear explanations with practical examples
- Debug code and explain errors
- Suggest best practices and industry standards
- Encourage students and build their confidence
- Stay focused on topics relevant to this course
- Provide code examples when helpful
- Break down complex topics into digestible parts

Always be supportive, patient, and educational. If a question is outside the course scope, gently guide the student back to relevant topics while still being helpful.`;
};

// Get course context by ID or title
const getCourseContext = async (courseId) => {
    try {
        // First try to get from database
        const { data: course, error } = await supabase
            .from('courses')
            .select('id, title, description, category, difficulty')
            .eq('id', courseId)
            .single();

        if (error || !course) {
            return null;
        }

        // Map course title to context
        const courseTitle = course.title.toLowerCase();

        if (courseTitle.includes('mern')) return courseContexts['mern-stack'];
        if (courseTitle.includes('ai') && courseTitle.includes('machine learning')) return courseContexts['ai-ml'];
        if (courseTitle.includes('agentic')) return courseContexts['agentic-ai'];
        if (courseTitle.includes('html')) return courseContexts['html-fundamentals'];
        if (courseTitle.includes('css')) return courseContexts['css-styling'];
        if (courseTitle.includes('javascript')) return courseContexts['javascript-essentials'];
        if (courseTitle.includes('python')) return courseContexts['python-basics'];

        // Return generic context if no match
        return {
            title: course.title,
            description: course.description || 'A comprehensive programming course',
            topics: ['Programming fundamentals', 'Best practices', 'Project development'],
            level: course.difficulty || 'Intermediate'
        };
    } catch (error) {
        console.error('Error getting course context:', error);
        return null;
    }
};

// Chat with AI assistant using Groq
router.post('/chat', supabaseProtect, async (req, res) => {
    try {
        const { message, courseId, conversationHistory = [] } = req.body;
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

        // Check Groq API key
        if (!process.env.GROQ_API_KEY) {
            console.error('❌ GROQ_API_KEY not configured');
            return res.status(500).json({
                status: 'error',
                message: 'AI service is not configured. Please contact support.'
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

        if (enrollmentError || !enrollment) {
            console.log('❌ No enrollment found');
            return res.status(403).json({
                status: 'error',
                message: 'You must be enrolled in this course to use the AI assistant'
            });
        }

        console.log('✅ Enrollment found:', enrollment);

        // Get course details
        console.log('📚 Fetching course details...');
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('id, title, category, is_free, price, difficulty')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            console.log('❌ No course found');
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        console.log('✅ Course found:', { title: course.title, is_free: course.is_free });

        // AI assistant is now available for all courses
        console.log('✅ Generating response with Groq...');

        // Get course context
        const courseContext = await getCourseContext(courseId);
        const systemPrompt = generateSystemPrompt(courseContext);

        // Build conversation messages
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // Add conversation history (limit to last 10 messages for context)
        const recentHistory = conversationHistory.slice(-10);
        messages.push(...recentHistory);

        // Add current user message
        messages.push({ role: 'user', content: message });

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.1-70b-versatile', // Fast and capable model
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

        console.log('✅ AI response generated via Groq');

        res.json({
            status: 'success',
            data: {
                response: aiResponse,
                model: 'llama-3.1-70b-versatile',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ AI Assistant error:', error);

        // Handle Groq-specific errors
        if (error.status === 401) {
            return res.status(500).json({
                status: 'error',
                message: 'AI service authentication failed. Please contact support.'
            });
        }

        if (error.status === 429) {
            return res.status(429).json({
                status: 'error',
                message: 'AI service is currently busy. Please try again in a moment.'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to get AI response',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get AI assistant suggestions based on current lesson
router.post('/suggestions', supabaseProtect, async (req, res) => {
    try {
        const { courseId, lessonTitle } = req.body;
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

        // Get course details
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

        // AI assistant is now available for all courses
        // Get course context
        const courseContext = await getCourseContext(courseId);

        // Generate contextual suggestions using Groq
        if (process.env.GROQ_API_KEY && lessonTitle) {
            try {
                const prompt = `Based on the lesson "${lessonTitle}" in the ${courseContext?.title || course.title} course, generate 3 helpful questions a student might ask. Return only the questions, one per line, without numbering.`;

                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: 'You are a helpful learning assistant that generates relevant questions students might ask.' },
                        { role: 'user', content: prompt }
                    ],
                    model: 'llama-3.1-70b-versatile',
                    temperature: 0.8,
                    max_tokens: 200
                });

                const response = chatCompletion.choices[0]?.message?.content || '';
                const suggestions = response.split('\n').filter(s => s.trim()).slice(0, 3);

                if (suggestions.length > 0) {
                    return res.json({
                        status: 'success',
                        data: { suggestions }
                    });
                }
            } catch (error) {
                console.error('Error generating suggestions with Groq:', error);
                // Fall through to default suggestions
            }
        }

        // Default suggestions if Groq fails or no API key
        const defaultSuggestions = [
            "Can you explain this concept in simpler terms?",
            "What are some practical examples of this?",
            "What should I focus on learning next?"
        ];

        res.json({
            status: 'success',
            data: { suggestions: defaultSuggestions }
        });

    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get suggestions'
        });
    }
});

// Get conversation history (optional feature)
router.get('/conversations', supabaseProtect, async (req, res) => {
    try {
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

export default router;

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const agenticAICourse = {
    title: 'Agentic AI Development',
    description: 'Master the art of building autonomous AI agents with the latest 2026 tools and frameworks. Learn to create intelligent systems that can reason, plan, and act independently using Claude, OpenAI, and cutting-edge agent architectures.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    duration: '16 weeks',
    instructor: 'DEVGet Learning Team',
    thumbnail: '/images/course-thumbnails/agentic-ai.jpg',
    price: 299.00,
    is_free: false,
    lessons: [
        {
            id: 'week1-lesson1',
            title: 'What is Generative AI and the Evolution to Agents',
            type: 'video',
            duration: '45 min',
            week: 1
        },
        {
            id: 'week1-lesson2',
            title: 'Claude\'s Agent Capabilities and Computer Use',
            type: 'video',
            duration: '50 min',
            week: 1
        },
        {
            id: 'week1-lesson3',
            title: 'Understanding LLM Fundamentals for Agent Development',
            type: 'video',
            duration: '40 min',
            week: 1
        },
        {
            id: 'week1-lesson4',
            title: 'Hands-on: Exploring LLM Capabilities',
            type: 'video',
            duration: '60 min',
            week: 1
        },
        {
            id: 'week1-quiz',
            title: 'Week 1 Quiz: AI Landscape and Agents',
            type: 'quiz',
            duration: '15 min',
            week: 1
        },
        {
            id: 'week2-lesson1',
            title: 'Python Essentials for AI Development',
            type: 'video',
            duration: '55 min',
            week: 2
        },
        {
            id: 'week2-lesson2',
            title: 'Asynchronous Programming for Agents',
            type: 'video',
            duration: '45 min',
            week: 2
        },
        {
            id: 'week2-lesson3',
            title: 'Essential Libraries for AI Agents (2026)',
            type: 'video',
            duration: '50 min',
            week: 2
        },
        {
            id: 'week2-quiz',
            title: 'Week 2 Quiz: Python for AI Engineers',
            type: 'quiz',
            duration: '15 min',
            week: 2
        },
        {
            id: 'week3-lesson1',
            title: 'Advanced Prompt Engineering Techniques',
            type: 'video',
            duration: '60 min',
            week: 3
        },
        {
            id: 'week3-lesson2',
            title: 'Structured Output and JSON Generation',
            type: 'video',
            duration: '45 min',
            week: 3
        },
        {
            id: 'week3-lesson3',
            title: 'Claude\'s Prompt Improver and Optimization',
            type: 'video',
            duration: '40 min',
            week: 3
        },
        {
            id: 'week3-quiz',
            title: 'Week 3 Quiz: Mastering Prompt Engineering',
            type: 'quiz',
            duration: '15 min',
            week: 3
        },
        {
            id: 'week4-lesson1',
            title: 'API Integration and Authentication',
            type: 'video',
            duration: '50 min',
            week: 4
        },
        {
            id: 'week4-lesson2',
            title: 'Building a Command-Line AI Assistant',
            type: 'video',
            duration: '70 min',
            week: 4
        },
        {
            id: 'week4-lesson3',
            title: 'Testing and Deployment',
            type: 'video',
            duration: '45 min',
            week: 4
        },
        {
            id: 'week4-quiz',
            title: 'Week 4 Quiz: Building Your First LLM Application',
            type: 'quiz',
            duration: '15 min',
            week: 4
        },
        {
            id: 'week5-lesson1',
            title: 'Defining Agents vs. Simple LLM Workflows',
            type: 'video',
            duration: '45 min',
            week: 5
        },
        {
            id: 'week5-lesson2',
            title: 'Agent Architecture Patterns',
            type: 'video',
            duration: '50 min',
            week: 5
        },
        {
            id: 'week5-quiz',
            title: 'Week 5 Quiz: Agent Architecture',
            type: 'quiz',
            duration: '15 min',
            week: 5
        },
        {
            id: 'week6-lesson1',
            title: 'Tool Design and Implementation',
            type: 'video',
            duration: '55 min',
            week: 6
        },
        {
            id: 'week6-lesson2',
            title: 'Advanced Tool Orchestration',
            type: 'video',
            duration: '50 min',
            week: 6
        },
        {
            id: 'week6-quiz',
            title: 'Week 6 Quiz: Tool Integration',
            type: 'quiz',
            duration: '15 min',
            week: 6
        },
        {
            id: 'week7-lesson1',
            title: 'Memory Architecture for Agents',
            type: 'video',
            duration: '50 min',
            week: 7
        },
        {
            id: 'week7-lesson2',
            title: 'Conversation Memory with LangChain',
            type: 'video',
            duration: '45 min',
            week: 7
        },
        {
            id: 'week7-quiz',
            title: 'Week 7 Quiz: Agent Memory',
            type: 'quiz',
            duration: '15 min',
            week: 7
        },
        {
            id: 'week8-lesson1',
            title: 'Beyond Basic RAG: Agentic RAG Architecture',
            type: 'video',
            duration: '60 min',
            week: 8
        },
        {
            id: 'week8-lesson2',
            title: 'Query Rewriting and Self-Evaluation',
            type: 'video',
            duration: '55 min',
            week: 8
        },
        {
            id: 'week8-quiz',
            title: 'Week 8 Quiz: Agentic RAG',
            type: 'quiz',
            duration: '15 min',
            week: 8
        },
        // Week 9
        {
            id: 'week9-lesson1',
            title: 'Framework Landscape in 2026',
            type: 'video',
            duration: '60 min',
            week: 9
        },
        {
            id: 'week9-lesson2',
            title: 'LlamaIndex Agentic RAG',
            type: 'video',
            duration: '55 min',
            week: 9
        },
        {
            id: 'week9-quiz',
            title: 'Week 9 Quiz: Agent Frameworks',
            type: 'quiz',
            duration: '15 min',
            week: 9
        },
        // Week 10
        {
            id: 'week10-lesson1',
            title: 'Reasoning Patterns for Agents',
            type: 'video',
            duration: '55 min',
            week: 10
        },
        {
            id: 'week10-lesson2',
            title: 'Tree-of-Thoughts & Reflexion',
            type: 'video',
            duration: '60 min',
            week: 10
        },
        {
            id: 'week10-project',
            title: 'Week 10 Project: Build a Reasoning Agent',
            type: 'project',
            duration: '4 hours',
            week: 10
        },
        {
            id: 'week10-quiz',
            title: 'Week 10 Quiz: Advanced Reasoning',
            type: 'quiz',
            duration: '15 min',
            week: 10
        },
        // Week 11
        {
            id: 'week11-lesson1',
            title: 'CrewAI Multi-Agent Collaboration',
            type: 'video',
            duration: '60 min',
            week: 11
        },
        {
            id: 'week11-lesson2',
            title: 'Microsoft AutoGen Conversational Agents',
            type: 'video',
            duration: '55 min',
            week: 11
        },
        {
            id: 'week11-project',
            title: 'Week 11 Project: Multi-Agent System',
            type: 'project',
            duration: '5 hours',
            week: 11
        },
        {
            id: 'week11-quiz',
            title: 'Week 11 Quiz: Multi-Agent Systems',
            type: 'quiz',
            duration: '15 min',
            week: 11
        },
        // Week 12
        {
            id: 'week12-lesson1',
            title: 'LangGraph Stateful Workflows',
            type: 'video',
            duration: '60 min',
            week: 12
        },
        {
            id: 'week12-lesson2',
            title: 'Advanced Graph Patterns with Cycles',
            type: 'video',
            duration: '55 min',
            week: 12
        },
        {
            id: 'week12-project',
            title: 'Week 12 Project: Graph-Based Agent System',
            type: 'project',
            duration: '5 hours',
            week: 12
        },
        {
            id: 'week12-quiz',
            title: 'Week 12 Quiz: Graph Workflows',
            type: 'quiz',
            duration: '15 min',
            week: 12
        }
    ]
};

async function addAgenticAICourse() {
    try {
        console.log('Adding Agentic AI course to Supabase...');

        // Check if course already exists
        const { data: existingCourse, error: checkError } = await supabase
            .from('courses')
            .select('*')
            .eq('title', agenticAICourse.title)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingCourse) {
            console.log('Agentic AI course already exists. Updating...');

            const { data, error } = await supabase
                .from('courses')
                .update(agenticAICourse)
                .eq('title', agenticAICourse.title)
                .select()
                .single();

            if (error) throw error;

            console.log('Agentic AI course updated successfully!');
            console.log('Updated course:', data);
        } else {
            console.log('Creating new Agentic AI course...');

            const { data, error } = await supabase
                .from('courses')
                .insert([agenticAICourse])
                .select()
                .single();

            if (error) throw error;

            console.log('Agentic AI course added successfully!');
            console.log('New course:', data);
        }

        // Verify the course was added/updated
        const { data: finalCourse, error: verifyError } = await supabase
            .from('courses')
            .select('*')
            .eq('title', agenticAICourse.title)
            .single();

        if (verifyError) throw verifyError;

        console.log('\n=== Course Details ===');
        console.log(`ID: ${finalCourse.id}`);
        console.log(`Title: ${finalCourse.title}`);
        console.log(`Price: $${finalCourse.price}`);
        console.log(`Category: ${finalCourse.category}`);
        console.log(`Difficulty: ${finalCourse.difficulty}`);
        console.log(`Lessons: ${finalCourse.lessons.length}`);
        console.log(`Is Free: ${finalCourse.is_free}`);

    } catch (error) {
        console.error('Error adding Agentic AI course:', error);
    }
}

// Run the script
addAgenticAICourse();
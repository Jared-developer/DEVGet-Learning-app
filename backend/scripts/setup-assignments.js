import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupAssignments() {
    try {
        console.log('Setting up optional weekly final projects...');

        // Get all courses
        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('id, title');

        if (coursesError) throw coursesError;

        console.log(`Found ${courses.length} courses`);

        // Define optional final projects for each course type
        const projectTemplates = {
            'MERN': [
                { week: 1, title: 'Week 1 Final Project: Personal Portfolio', description: 'Build a responsive personal portfolio using HTML and CSS (Optional)' },
                { week: 2, title: 'Week 2 Final Project: Interactive Calculator', description: 'Create an interactive calculator with JavaScript (Optional)' },
                { week: 3, title: 'Week 3 Final Project: React Todo App', description: 'Build a full-featured todo application with React (Optional)' },
                { week: 4, title: 'Week 4 Final Project: REST API Backend', description: 'Create a RESTful API with Express and MongoDB (Optional)' },
                { week: 5, title: 'Week 5 Final Project: Full Stack MERN App', description: 'Complete MERN stack application with authentication (Optional)' }
            ],
            'AI': [
                { week: 1, title: 'Week 1 Final Project: Python Data Structures', description: 'Implement core data structures and algorithms in Python (Optional)' },
                { week: 2, title: 'Week 2 Final Project: Data Analysis Dashboard', description: 'Create a data analysis dashboard with Pandas (Optional)' },
                { week: 3, title: 'Week 3 Final Project: Linear Regression Model', description: 'Build and train a linear regression model from scratch (Optional)' },
                { week: 4, title: 'Week 4 Final Project: Neural Network', description: 'Implement a neural network using NumPy (Optional)' },
                { week: 5, title: 'Week 5 Final Project: ML Classification System', description: 'Complete machine learning classification project (Optional)' }
            ],
            'Agentic': [
                { week: 1, title: 'Week 1 Final Project: AI Chatbot', description: 'Create an AI chatbot using LangChain (Optional)' },
                { week: 2, title: 'Week 2 Final Project: RAG Application', description: 'Build a Retrieval Augmented Generation system (Optional)' },
                { week: 3, title: 'Week 3 Final Project: Multi-Agent System', description: 'Implement a collaborative multi-agent system (Optional)' },
                { week: 4, title: 'Week 4 Final Project: Agentic AI Platform', description: 'Complete agentic AI application with tools (Optional)' }
            ],
            'HTML': [
                { week: 1, title: 'Week 1 Final Project: Semantic HTML Page', description: 'Create a well-structured HTML page with semantic elements (Optional)' },
                { week: 2, title: 'Week 2 Final Project: Responsive Website', description: 'Build a complete responsive multi-page website (Optional)' }
            ],
            'CSS': [
                { week: 1, title: 'Week 1 Final Project: Styled Landing Page', description: 'Create a beautiful landing page with advanced CSS (Optional)' },
                { week: 2, title: 'Week 2 Final Project: Responsive Grid Layout', description: 'Build a complex responsive layout using CSS Grid and Flexbox (Optional)' },
                { week: 3, title: 'Week 3 Final Project: Animated Portfolio', description: 'Create an animated portfolio with CSS animations and transitions (Optional)' }
            ],
            'JavaScript': [
                { week: 1, title: 'Week 1 Final Project: Interactive Quiz App', description: 'Build an interactive quiz application with vanilla JavaScript (Optional)' },
                { week: 2, title: 'Week 2 Final Project: Weather Dashboard', description: 'Create a weather dashboard using APIs and async JavaScript (Optional)' },
                { week: 3, title: 'Week 3 Final Project: Task Manager', description: 'Build a full-featured task manager with local storage (Optional)' },
                { week: 4, title: 'Week 4 Final Project: Game Development', description: 'Create an interactive game using JavaScript (Optional)' }
            ],
            'React': [
                { week: 1, title: 'Week 1 Final Project: Component Library', description: 'Build a reusable React component library (Optional)' },
                { week: 2, title: 'Week 2 Final Project: E-commerce Frontend', description: 'Create an e-commerce product catalog with React (Optional)' },
                { week: 3, title: 'Week 3 Final Project: Social Media Dashboard', description: 'Build a social media dashboard with React hooks (Optional)' },
                { week: 4, title: 'Week 4 Final Project: Real-time Chat App', description: 'Create a real-time chat application with React (Optional)' }
            ],
            'Node': [
                { week: 1, title: 'Week 1 Final Project: CLI Tool', description: 'Build a command-line tool with Node.js (Optional)' },
                { week: 2, title: 'Week 2 Final Project: File Processing System', description: 'Create a file processing and management system (Optional)' },
                { week: 3, title: 'Week 3 Final Project: RESTful API', description: 'Build a complete RESTful API with Express (Optional)' },
                { week: 4, title: 'Week 4 Final Project: Real-time Server', description: 'Create a real-time server with WebSockets (Optional)' }
            ],
            'MongoDB': [
                { week: 1, title: 'Week 1 Final Project: Database Schema Design', description: 'Design and implement a complex database schema (Optional)' },
                { week: 2, title: 'Week 2 Final Project: Data Migration Tool', description: 'Build a data migration and seeding tool (Optional)' },
                { week: 3, title: 'Week 3 Final Project: Aggregation Pipeline', description: 'Create complex data aggregations and analytics (Optional)' }
            ],
            'Python': [
                { week: 1, title: 'Week 1 Final Project: Python Automation Script', description: 'Build an automation script for file management (Optional)' },
                { week: 2, title: 'Week 2 Final Project: Web Scraper', description: 'Create a web scraping tool with BeautifulSoup (Optional)' },
                { week: 3, title: 'Week 3 Final Project: API Integration', description: 'Build a Python application that integrates multiple APIs (Optional)' },
                { week: 4, title: 'Week 4 Final Project: Data Processing Pipeline', description: 'Create a complete data processing pipeline (Optional)' }
            ],
            'Data Science': [
                { week: 1, title: 'Week 1 Final Project: Exploratory Data Analysis', description: 'Perform comprehensive EDA on a real dataset (Optional)' },
                { week: 2, title: 'Week 2 Final Project: Data Visualization Dashboard', description: 'Create an interactive data visualization dashboard (Optional)' },
                { week: 3, title: 'Week 3 Final Project: Predictive Model', description: 'Build and evaluate a predictive machine learning model (Optional)' },
                { week: 4, title: 'Week 4 Final Project: End-to-End ML Project', description: 'Complete end-to-end machine learning project with deployment (Optional)' }
            ]
        };

        let totalInserted = 0;

        for (const course of courses) {
            let templates = [];

            if (course.title.includes('MERN')) {
                templates = projectTemplates['MERN'];
            } else if (course.title.includes('AI') && course.title.includes('Machine Learning')) {
                templates = projectTemplates['AI'];
            } else if (course.title.includes('Agentic')) {
                templates = projectTemplates['Agentic'];
            } else if (course.title.includes('HTML')) {
                templates = projectTemplates['HTML'];
            } else if (course.title.includes('CSS')) {
                templates = projectTemplates['CSS'];
            } else if (course.title.includes('JavaScript') && !course.title.includes('React')) {
                templates = projectTemplates['JavaScript'];
            } else if (course.title.includes('React')) {
                templates = projectTemplates['React'];
            } else if (course.title.includes('Node')) {
                templates = projectTemplates['Node'];
            } else if (course.title.includes('MongoDB')) {
                templates = projectTemplates['MongoDB'];
            } else if (course.title.includes('Python') && !course.title.includes('Data Science')) {
                templates = projectTemplates['Python'];
            } else if (course.title.includes('Data Science')) {
                templates = projectTemplates['Data Science'];
            }

            if (templates.length > 0) {
                const assignments = templates.map(t => ({
                    course_id: course.id,
                    week_number: t.week,
                    title: t.title,
                    description: t.description,
                    points: 100,
                    due_date: null // Optional - no due date
                }));

                const { data, error } = await supabase
                    .from('assignments')
                    .insert(assignments)
                    .select();

                if (error) {
                    console.error(`Error inserting projects for ${course.title}:`, error);
                } else {
                    console.log(`✓ Inserted ${data.length} optional final projects for ${course.title}`);
                    totalInserted += data.length;
                }
            }
        }

        console.log(`\n✓ Successfully set up ${totalInserted} optional final projects!`);
    } catch (error) {
        console.error('Error setting up assignments:', error);
        process.exit(1);
    }
}

setupAssignments();

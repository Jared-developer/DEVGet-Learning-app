import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addHTMLCourse() {
    try {
        console.log('Adding HTML for Absolute Beginners course to Supabase...');

        // Check if course already exists
        const { data: existingCourse } = await supabase
            .from('courses')
            .select('id, title')
            .eq('title', 'HTML for Absolute Beginners')
            .single();

        if (existingCourse) {
            console.log('HTML course already exists:', existingCourse.title);
            console.log('Course ID:', existingCourse.id);
            return;
        }

        // Insert the HTML course
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert([
                {
                    title: 'HTML for Absolute Beginners',
                    description: 'Welcome! You\'re about to learn HTML, the skeleton of every webpage you\'ve ever seen. It\'s the easiest and most rewarding place to start your journey into web development. No prior experience is needed.',
                    category: 'basics',
                    difficulty: 'beginner',
                    duration: '4 weeks',
                    instructor: 'DEVGet Learning Team',
                    thumbnail_url: '/images/course-thumbnails/html-fundamentals.jpg',
                    is_published: true,
                    prerequisites: [],
                    learning_outcomes: [
                        'Understand what HTML is and how it works',
                        'Create well-structured HTML documents',
                        'Use semantic HTML elements properly',
                        'Build forms and handle user input',
                        'Create accessible web content',
                        'Understand HTML best practices'
                    ],
                    syllabus: {
                        weeks: [
                            {
                                week: 1,
                                title: 'HTML Fundamentals',
                                topics: [
                                    'What is HTML?',
                                    'Setting up your workspace',
                                    'HTML document structure',
                                    'Basic HTML tags',
                                    'Text formatting'
                                ]
                            },
                            {
                                week: 2,
                                title: 'Links, Images, and Lists',
                                topics: [
                                    'Creating hyperlinks',
                                    'Working with images',
                                    'Ordered and unordered lists',
                                    'Nested lists',
                                    'Navigation menus'
                                ]
                            },
                            {
                                week: 3,
                                title: 'Tables and Forms',
                                topics: [
                                    'Creating tables',
                                    'Table structure and styling',
                                    'Form elements',
                                    'Input types',
                                    'Form validation'
                                ]
                            },
                            {
                                week: 4,
                                title: 'Semantic HTML and Best Practices',
                                topics: [
                                    'Semantic HTML elements',
                                    'Accessibility basics',
                                    'SEO fundamentals',
                                    'HTML5 features',
                                    'Best practices and next steps'
                                ]
                            }
                        ]
                    }
                }
            ])
            .select()
            .single();

        if (courseError) {
            console.error('Error inserting HTML course:', courseError);
            throw courseError;
        }

        console.log('✅ HTML course added successfully!');
        console.log('Course ID:', course.id);
        console.log('Title:', course.title);

        // Add some sample modules/lessons
        console.log('\nAdding course modules...');

        const modules = [
            {
                course_id: course.id,
                title: 'Week 1: HTML Fundamentals',
                description: 'Learn the basics of HTML and create your first web page',
                order_index: 1,
                duration_minutes: 180
            },
            {
                course_id: course.id,
                title: 'Week 2: Links, Images, and Lists',
                description: 'Master hyperlinks, images, and list structures',
                order_index: 2,
                duration_minutes: 180
            },
            {
                course_id: course.id,
                title: 'Week 3: Tables and Forms',
                description: 'Create data tables and interactive forms',
                order_index: 3,
                duration_minutes: 180
            },
            {
                course_id: course.id,
                title: 'Week 4: Semantic HTML and Best Practices',
                description: 'Write clean, accessible, and SEO-friendly HTML',
                order_index: 4,
                duration_minutes: 180
            }
        ];

        const { data: insertedModules, error: modulesError } = await supabase
            .from('modules')
            .insert(modules)
            .select();

        if (modulesError) {
            console.error('Error inserting modules:', modulesError);
        } else {
            console.log(`✅ Added ${insertedModules.length} modules`);
        }

        console.log('\n🎉 HTML course setup complete!');
        console.log('Students can now enroll in the HTML for Absolute Beginners course.');

    } catch (error) {
        console.error('Error adding HTML course:', error);
        process.exit(1);
    }
}

// Run the script
addHTMLCourse()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });

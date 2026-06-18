import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import the HTML course content
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the actual course content
import { htmlAbsoluteBeginners } from '../../frontend/src/data/htmlAbsoluteBeginners.js';

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
            return existingCourse;
        }

        // Insert the HTML course using the actual content
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert([
                {
                    title: 'HTML for Absolute Beginners',
                    description: htmlAbsoluteBeginners.description,
                    category: 'basics',
                    difficulty: 'beginner',
                    duration: 'Self-paced',
                    lessons: 8,
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
                        'Understand HTML best practices',
                        'Build your first complete webpage',
                        'Use proper HTML document structure'
                    ],
                    tags: ['HTML', 'Web Development', 'Beginner', 'Frontend'],
                    price: 0,
                    enrollment_count: 0
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

        // Add the course modules based on the content structure
        console.log('\nAdding course modules...');

        const modules = htmlAbsoluteBeginners.sections.map((section, index) => ({
            course_id: course.id,
            title: section.title,
            description: section.content.substring(0, 200) + '...',
            order_index: index + 1,
            duration_minutes: 45,
            content: JSON.stringify({
                sections: [section],
                keyTakeaways: index === htmlAbsoluteBeginners.sections.length - 1 ? htmlAbsoluteBeginners.keyTakeaways : [],
                practiceExercises: index === htmlAbsoluteBeginners.sections.length - 1 ? htmlAbsoluteBeginners.practiceExercises : []
            })
        }));

        const { data: insertedModules, error: modulesError } = await supabase
            .from('modules')
            .insert(modules)
            .select();

        if (modulesError) {
            console.error('Error inserting modules:', modulesError);
        } else {
            console.log(`✅ Added ${insertedModules.length} modules`);
            
            // Log the modules that were added
            insertedModules.forEach((module, index) => {
                console.log(`  ${index + 1}. ${module.title}`);
            });
        }

        // Add some assignments for the course
        console.log('\nAdding course assignments...');

        const assignments = [
            {
                course_id: course.id,
                title: 'Create Your First Webpage',
                description: 'Build a personal bio page using HTML elements learned in the course',
                instructions: 'Create an HTML file with your personal information including headings, paragraphs, images, and links. Use proper HTML5 structure.',
                due_date: null, // Self-paced
                max_points: 100,
                assignment_type: 'project',
                is_published: true
            },
            {
                course_id: course.id,
                title: 'Recipe Page Project', 
                description: 'Build a recipe page with ingredients list and instructions',
                instructions: 'Create a complete recipe webpage with proper HTML structure, including unordered lists for ingredients and ordered lists for instructions.',
                due_date: null, // Self-paced
                max_points: 100,
                assignment_type: 'project',
                is_published: true
            }
        ];

        const { data: insertedAssignments, error: assignmentsError } = await supabase
            .from('assignments')
            .insert(assignments)
            .select();

        if (assignmentsError) {
            console.error('Error inserting assignments:', assignmentsError);
        } else {
            console.log(`✅ Added ${insertedAssignments.length} assignments`);
            insertedAssignments.forEach((assignment, index) => {
                console.log(`  ${index + 1}. ${assignment.title}`);
            });
        }

        console.log('\n🎉 HTML course setup complete!');
        console.log('Students can now enroll in the HTML for Absolute Beginners course.');

        return course;

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

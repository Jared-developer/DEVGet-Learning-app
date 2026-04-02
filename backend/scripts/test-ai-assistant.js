import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, '..', '.env') });

// Create Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function testAIAssistant() {
    console.log('🧪 Testing AI Assistant Setup...\n');

    try {
        // Test 1: Check if courses table has is_free column
        console.log('1️⃣ Checking courses table structure...');
        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('id, title, is_free, price')
            .limit(3);

        if (coursesError) {
            console.error('❌ Error fetching courses:', coursesError.message);
            return;
        }

        console.log('✅ Courses table structure is correct');
        console.log('Sample courses:');
        courses.forEach(course => {
            console.log(`  - ${course.title}: is_free=${course.is_free}, price=${course.price}`);
        });

        // Test 2: Check enrollments
        console.log('\n2️⃣ Checking enrollments table...');
        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select('id, user_id, course_id, status')
            .limit(3);

        if (enrollError) {
            console.error('❌ Error fetching enrollments:', enrollError.message);
            return;
        }

        console.log('✅ Enrollments table is accessible');
        console.log(`Found ${enrollments.length} sample enrollments`);

        // Test 3: Test a specific enrollment with course details
        if (enrollments.length > 0) {
            console.log('\n3️⃣ Testing enrollment + course query...');
            const testEnrollment = enrollments[0];

            // Get enrollment
            const { data: enrollment, error: enrollmentError } = await supabase
                .from('enrollments')
                .select('id, course_id, status')
                .eq('id', testEnrollment.id)
                .single();

            if (enrollmentError) {
                console.error('❌ Error fetching enrollment:', enrollmentError.message);
                return;
            }

            // Get course
            const { data: course, error: courseError } = await supabase
                .from('courses')
                .select('id, title, category, is_free, price')
                .eq('id', enrollment.course_id)
                .single();

            if (courseError) {
                console.error('❌ Error fetching course:', courseError.message);
                return;
            }

            console.log('✅ Successfully fetched enrollment and course');
            console.log('Enrollment:', enrollment);
            console.log('Course:', course);
            console.log(`Course is ${course.is_free ? 'FREE' : 'PAID (Pro)'}`);
        }

        console.log('\n✅ All tests passed! AI Assistant backend should work correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error);
    }
}

testAIAssistant();

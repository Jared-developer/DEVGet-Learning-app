import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function executeSQL(query, description) {
    console.log(`Executing: ${description}`)
    
    // Try using rpc method
    try {
        const { error } = await supabase.rpc('exec_sql', { sql: query })
        if (error) throw error
        console.log(`✓ ${description} - Success`)
        return true
    } catch (rpcError) {
        console.log(`RPC failed for ${description}, trying direct approach...`)
        
        // If RPC fails, we'll need to use Supabase dashboard to run this SQL
        console.log(`SQL to run manually in Supabase dashboard:`)
        console.log('---')
        console.log(query)
        console.log('---')
        return false
    }
}

async function createProgressTables() {
    console.log('Creating progress tracking tables...')
    
    try {
        // Create lesson_progress table
        const lessonTableSQL = `
            CREATE TABLE IF NOT EXISTS lesson_progress (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                course_id UUID NOT NULL,
                lesson_id VARCHAR NOT NULL,
                lesson_title VARCHAR NOT NULL,
                lesson_type VARCHAR DEFAULT 'video',
                status VARCHAR DEFAULT 'not_started',
                completion_date TIMESTAMP WITH TIME ZONE,
                time_spent INTEGER DEFAULT 0,
                quiz_score INTEGER,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, course_id, lesson_id)
            );
        `
        
        await executeSQL(lessonTableSQL, 'Creating lesson_progress table')
        // Create course_progress table
        const courseTableSQL = `
            CREATE TABLE IF NOT EXISTS course_progress (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                course_id UUID NOT NULL,
                total_lessons INTEGER DEFAULT 0,
                completed_lessons INTEGER DEFAULT 0,
                progress_percentage INTEGER DEFAULT 0,
                last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                estimated_completion DATE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, course_id)
            );
        `
        
        await executeSQL(courseTableSQL, 'Creating course_progress table')

        // Enable RLS
        await executeSQL('ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;', 'Enabling RLS on lesson_progress')
        await executeSQL('ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;', 'Enabling RLS on course_progress')

        // Create RLS policies for lesson_progress
        const lessonPolicies = [
            `CREATE POLICY IF NOT EXISTS "Users can view their own lesson progress" 
            ON lesson_progress FOR SELECT 
            USING (auth.uid() = user_id);`,
            
            `CREATE POLICY IF NOT EXISTS "Users can insert their own lesson progress" 
            ON lesson_progress FOR INSERT 
            WITH CHECK (auth.uid() = user_id);`,
            
            `CREATE POLICY IF NOT EXISTS "Users can update their own lesson progress" 
            ON lesson_progress FOR UPDATE 
            USING (auth.uid() = user_id);`
        ]

        for (const policy of lessonPolicies) {
            await executeSQL(policy, 'Creating lesson_progress RLS policy')
        }

        // Create RLS policies for course_progress
        const coursePolicies = [
            `CREATE POLICY IF NOT EXISTS "Users can view their own course progress" 
            ON course_progress FOR SELECT 
            USING (auth.uid() = user_id);`,
            
            `CREATE POLICY IF NOT EXISTS "Users can insert their own course progress" 
            ON course_progress FOR INSERT 
            WITH CHECK (auth.uid() = user_id);`,
            
            `CREATE POLICY IF NOT EXISTS "Users can update their own course progress" 
            ON course_progress FOR UPDATE 
            USING (auth.uid() = user_id);`
        ]

        for (const policy of coursePolicies) {
            await executeSQL(policy, 'Creating course_progress RLS policy')
        }

        // Create function to update course progress
        const updateFunction = `
            CREATE OR REPLACE FUNCTION update_course_progress()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO course_progress (user_id, course_id, total_lessons, completed_lessons, progress_percentage, last_accessed)
                SELECT 
                    NEW.user_id,
                    NEW.course_id,
                    COUNT(*) as total_lessons,
                    COUNT(*) FILTER (WHERE status = 'completed') as completed_lessons,
                    ROUND((COUNT(*) FILTER (WHERE status = 'completed')::float / COUNT(*)::float) * 100) as progress_percentage,
                    NOW()
                FROM lesson_progress 
                WHERE user_id = NEW.user_id AND course_id = NEW.course_id
                GROUP BY user_id, course_id
                ON CONFLICT (user_id, course_id) 
                DO UPDATE SET
                    total_lessons = EXCLUDED.total_lessons,
                    completed_lessons = EXCLUDED.completed_lessons,
                    progress_percentage = EXCLUDED.progress_percentage,
                    last_accessed = EXCLUDED.last_accessed,
                    updated_at = NOW();

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `

        await executeSQL(updateFunction, 'Creating update function')

        // Create trigger
        const triggerSQL = `
            DROP TRIGGER IF EXISTS update_course_progress_trigger ON lesson_progress;
            CREATE TRIGGER update_course_progress_trigger
                AFTER INSERT OR UPDATE ON lesson_progress
                FOR EACH ROW
                EXECUTE FUNCTION update_course_progress();
        `

        await executeSQL(triggerSQL, 'Creating trigger')

        // Create indexes
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON lesson_progress(user_id, course_id);',
            'CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);',
            'CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);',
            'CREATE INDEX IF NOT EXISTS idx_course_progress_last_accessed ON course_progress(last_accessed);'
        ]

        for (const indexSQL of indexes) {
            await executeSQL(indexSQL, 'Creating index')
        }

        console.log('\n✅ Progress tracking setup completed!')
        console.log('\nIf any SQL statements failed above, please run them manually in your Supabase dashboard.')
        console.log('Go to: Supabase Dashboard > SQL Editor > New Query')

        console.log('\n=== MANUAL SQL TO RUN (if needed) ===')
        console.log('Copy and paste the SQL statements shown above into your Supabase SQL editor.')
        
    } catch (error) {
        console.error('❌ Error in setup process:', error)
        
        console.log('\n=== FALLBACK: Manual Setup Required ===')
        console.log('Please run the following SQL manually in your Supabase dashboard:')
        console.log('Go to: Supabase Dashboard > SQL Editor > New Query')
        console.log('\nSQL to copy and paste:')
        console.log('-- Copy the content from backend/migrations/add-progress-tracking.sql --')
    }
}

createProgressTables()
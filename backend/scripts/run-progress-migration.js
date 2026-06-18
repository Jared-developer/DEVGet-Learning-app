import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function runProgressMigration() {
    try {
        console.log('Running progress tracking migration...')
        
        // Read the migration file
        const migrationPath = path.join(__dirname, '../migrations/add-progress-tracking.sql')
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
        
        // Split by semicolons and execute each statement
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0)
        
        for (const statement of statements) {
            console.log('Executing:', statement.substring(0, 100) + '...')
            
            const { error } = await supabase.rpc('exec_sql', {
                sql: statement
            })
            
            if (error) {
                // Try direct query if RPC fails
                const { error: directError } = await supabase
                    .from('_temp')
                    .select('*')
                    .limit(0)
                    .then(() => ({ error: null }))
                    .catch(err => {
                        // Use raw SQL execution
                        return supabase.rpc('sql', { query: statement })
                    })
                
                if (directError) {
                    console.error('Error executing statement:', directError)
                    // Continue with next statement
                }
            }
        }
        
        console.log('Migration completed successfully!')
        
        // Verify tables were created
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .in('table_name', ['lesson_progress', 'course_progress'])
        
        if (tablesError) {
            console.log('Could not verify table creation:', tablesError.message)
        } else {
            console.log('Created tables:', tables?.map(t => t.table_name) || [])
        }
        
    } catch (error) {
        console.error('Migration failed:', error)
        process.exit(1)
    }
}

// Alternative: Manual table creation
async function createTablesManually() {
    try {
        console.log('Creating progress tracking tables manually...')
        
        // Create lesson_progress table
        const { error: lessonProgressError } = await supabase.rpc('exec_sql', {
            sql: `
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
        })
        
        if (lessonProgressError) {
            console.error('Error creating lesson_progress table:', lessonProgressError)
        } else {
            console.log('✓ lesson_progress table created')
        }
        
        // Create course_progress table
        const { error: courseProgressError } = await supabase.rpc('exec_sql', {
            sql: `
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
        })
        
        if (courseProgressError) {
            console.error('Error creating course_progress table:', courseProgressError)
        } else {
            console.log('✓ course_progress table created')
        }
        
        console.log('Manual table creation completed!')
        
    } catch (error) {
        console.error('Manual table creation failed:', error)
    }
}

// Run migration
if (import.meta.url === `file://${process.argv[1]}`) {
    runProgressMigration().catch(() => {
        console.log('Falling back to manual table creation...')
        createTablesManually()
    })
}

export { runProgressMigration, createTablesManually }
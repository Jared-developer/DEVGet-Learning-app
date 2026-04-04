-- Fix RLS policies for user_roles table

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON user_roles;

-- Recreate policy for users to view their own roles
CREATE POLICY "Users can view own roles"
    ON user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy for service role to manage all roles
CREATE POLICY "Service role can manage roles"
    ON user_roles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Ensure grants are in place
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT ON user_roles TO anon;

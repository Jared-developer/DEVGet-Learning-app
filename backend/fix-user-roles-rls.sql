-- Fix User Roles RLS Policies
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON user_roles;

-- Policy: Authenticated users can view their own roles
CREATE POLICY "Users can view own roles"
    ON user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Authenticated users can view their own roles (anon fallback)
CREATE POLICY "Anon users can view roles"
    ON user_roles
    FOR SELECT
    TO anon
    USING (true);

-- Policy: Service role can manage all roles
CREATE POLICY "Service role can manage roles"
    ON user_roles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy: Admins can manage all roles
CREATE POLICY "Admins can manage roles"
    ON user_roles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Grant proper permissions
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT ON user_roles TO anon;

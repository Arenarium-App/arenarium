# Debugging Team Logo Update Issue

## Issue Summary
Team logos are being uploaded successfully to Supabase Storage, but the database update is not persisting. The console logs show:
- ✅ Image upload successful to Supabase Storage
- 🔍 Database update returns `[]` (no rows updated)
- 🔍 Verification shows old placeholder URL still in database

## Root Cause Identified
The issue is **Row Level Security (RLS) policies** blocking the `UPDATE` operation on the `teams` table. The `supabase.from('teams').update(...)` call returns an empty array, indicating no rows were affected.

## Immediate Fix Required

### Step 1: Check Current RLS Policies
Run this in your Supabase SQL Editor:
```sql
-- Check current RLS policies on teams table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'teams';
```

### Step 2: Fix RLS Policies
Run this in your Supabase SQL Editor:
```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON teams;
DROP POLICY IF EXISTS "Enable update access for all users" ON teams;
DROP POLICY IF EXISTS "Enable insert access for all users" ON teams;
DROP POLICY IF EXISTS "Enable delete access for all users" ON teams;

-- Create new policies that allow public access
CREATE POLICY "Enable read access for all users" ON teams
    FOR SELECT USING (true);

CREATE POLICY "Enable update access for all users" ON teams
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable insert access for all users" ON teams
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON teams
    FOR DELETE USING (true);
```

### Step 3: Test the Fix
After applying the policies, test with:
```sql
-- Test update
UPDATE teams 
SET logo = 'https://via.placeholder.com/150x150/FF0000/FFFFFF?text=TEST' 
WHERE id = 1;

-- Verify
SELECT id, team_name, logo FROM teams WHERE id = 1;
```

## Alternative: Disable RLS Temporarily
If you want to quickly test without RLS:
```sql
-- Temporarily disable RLS (NOT recommended for production)
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;

-- Test your logo update
-- Then re-enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
```

## Verification Steps
1. Apply the RLS policy fixes
2. Try uploading a team logo again
3. Check console logs - should see:
   - ✅ Database update successful for team X
   - ✅ Update result: [affected_rows] (not empty array)
4. Refresh the page - logo should persist
5. Check `/teams` page - logo should appear

## Files to Check
- `src/components/TeamLogoManager.tsx` - Logo update logic
- `src/lib/supabase-storage.ts` - Database operations
- Database RLS policies on `teams` table

## Expected Console Output After Fix
```
TeamLogoManager.tsx:80 ✅ Database update successful for team 2
TeamLogoManager.tsx:81 ✅ Update result: [1]  // Should show affected rows, not []
TeamLogoManager.tsx:93 🔍 Verification - Team 2 logo in DB: [NEW_LOGO_URL]
```

## Next Steps After Fix
1. Test logo upload functionality
2. Remove debug logging from production code
3. Consider implementing proper authentication-based RLS policies
4. Test on different user roles if applicable

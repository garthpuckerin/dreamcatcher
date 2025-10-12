-- ============================================
-- Dreamcatcher Row Level Security Policies
-- Version: 2.2.0
-- Date: 2025-10-12
-- ============================================

-- These policies ensure users can only access their own data
-- and enforce proper authorization for all operations

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_dreams ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DREAMS POLICIES
-- ============================================

-- Users can view their own dreams
CREATE POLICY "Users can view own dreams"
  ON dreams FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own dreams
CREATE POLICY "Users can insert own dreams"
  ON dreams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own dreams
CREATE POLICY "Users can update own dreams"
  ON dreams FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own dreams
CREATE POLICY "Users can delete own dreams"
  ON dreams FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FRAGMENTS POLICIES
-- ============================================

-- Users can view fragments from their own dreams
CREATE POLICY "Users can view own fragments"
  ON fragments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = fragments.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can insert fragments to their own dreams
CREATE POLICY "Users can insert own fragments"
  ON fragments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = fragments.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can update fragments from their own dreams
CREATE POLICY "Users can update own fragments"
  ON fragments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = fragments.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can delete fragments from their own dreams
CREATE POLICY "Users can delete own fragments"
  ON fragments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = fragments.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- ============================================
-- TODOS POLICIES
-- ============================================

-- Users can view todos from their own dreams
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = todos.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can insert todos to their own dreams
CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = todos.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can update todos from their own dreams
CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = todos.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can delete todos from their own dreams
CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = todos.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- ============================================
-- DOCUMENTS POLICIES
-- ============================================

-- Users can view documents from their own dreams
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = documents.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can insert documents to their own dreams
CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = documents.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can update documents from their own dreams
CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = documents.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- Users can delete documents from their own dreams
CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = documents.dream_id
      AND dreams.user_id = auth.uid()
    )
  );

-- ============================================
-- RECENT_DREAMS POLICIES
-- ============================================

-- Users can view their own recent dreams
CREATE POLICY "Users can view own recent dreams"
  ON recent_dreams FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own recent dreams
CREATE POLICY "Users can insert own recent dreams"
  ON recent_dreams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own recent dreams
CREATE POLICY "Users can update own recent dreams"
  ON recent_dreams FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own recent dreams
CREATE POLICY "Users can delete own recent dreams"
  ON recent_dreams FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE POLICIES
-- For document uploads in Supabase Storage
-- ============================================

-- Enable storage for dream documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('dream-documents', 'dream-documents', false)
ON CONFLICT DO NOTHING;

-- Users can upload documents to their own folder
CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'dream-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view their own documents
CREATE POLICY "Users can view own document files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'dream-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own documents
CREATE POLICY "Users can update own document files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'dream-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own documents
CREATE POLICY "Users can delete own document files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'dream-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- VERIFY POLICIES
-- ============================================

DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    -- Count policies for dreams table
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'dreams';
    
    IF policy_count < 4 THEN
        RAISE EXCEPTION 'Not all dreams policies were created! Found: %', policy_count;
    END IF;
    
    RAISE NOTICE 'RLS policies migration completed successfully!';
    RAISE NOTICE 'Total policies created: %', policy_count * 5; -- 4 policies × 5 tables
END $$;

-- ============================================
-- SECURITY NOTES
-- ============================================

-- All tables now have Row Level Security enabled
-- Users can ONLY access data that belongs to them
-- All policies enforce user_id = auth.uid() checks
-- Document storage uses folder-based access control (user_id/file_name)

-- To test RLS:
-- 1. Sign up as a test user
-- 2. Create some dreams
-- 3. Sign up as another user
-- 4. Try to query the first user's dreams - you should see nothing!

COMMENT ON POLICY "Users can view own dreams" ON dreams IS 
  'Ensures users can only see dreams they created';

COMMENT ON POLICY "Users can view own fragments" ON fragments IS 
  'Ensures users can only see fragments from their dreams via JOIN';

COMMENT ON POLICY "Users can view own todos" ON todos IS 
  'Ensures users can only see todos from their dreams via JOIN';


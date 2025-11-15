-- ============================================
-- Dreamcatcher Database Schema
-- Version: 2.2.0
-- Date: 2025-10-12
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DREAMS TABLE
-- Stores project/dream metadata
-- ============================================
CREATE TABLE dreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT, -- 'BC Innovations', 'BC Studio', 'MPGWorldwide', 'Accordingto', 'Personal'
  status TEXT DEFAULT 'idea', -- 'idea', 'planning', 'in-progress', 'paused', 'completed', 'abandoned'
  tags TEXT[], -- array of tags
  summary TEXT, -- auto-generated summary
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for dreams
CREATE INDEX idx_dreams_user ON dreams(user_id);
CREATE INDEX idx_dreams_brand ON dreams(brand);
CREATE INDEX idx_dreams_status ON dreams(status);
CREATE INDEX idx_dreams_updated ON dreams(updated_at DESC);
CREATE INDEX idx_dreams_tags ON dreams USING GIN(tags);

-- ============================================
-- FRAGMENTS TABLE
-- Stores conversation pieces/fragments
-- ============================================
CREATE TABLE fragments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT, -- 'Claude conversation', 'ChatGPT', etc.
  url TEXT, -- original conversation URL
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  features TEXT[], -- array of features mentioned
  code_snippets TEXT[], -- array of code snippets
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fragments
CREATE INDEX idx_fragments_dream ON fragments(dream_id);
CREATE INDEX idx_fragments_date ON fragments(date DESC);
CREATE INDEX idx_fragments_features ON fragments USING GIN(features);

-- ============================================
-- TODOS TABLE
-- Stores tasks/action items for dreams
-- ============================================
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'coding', 'admin', 'design', 'marketing', 'devops', 'strategy'
  deadline TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'manual', -- 'manual', 'document', 'ai-parsed', 'pipelineos'
  priority INTEGER DEFAULT 0, -- 0 = normal, 1 = high, 2 = urgent
  order_index INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for todos
CREATE INDEX idx_todos_dream ON todos(dream_id);
CREATE INDEX idx_todos_deadline ON todos(deadline);
CREATE INDEX idx_todos_completed ON todos(completed, deadline);
CREATE INDEX idx_todos_priority ON todos(priority DESC, deadline);

-- ============================================
-- DOCUMENTS TABLE
-- Stores uploaded documents metadata
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL, -- path in Supabase Storage
  file_type TEXT, -- 'markdown', 'pdf', 'docx', etc.
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parsed_todos INTEGER DEFAULT 0,
  parsed_deadlines INTEGER DEFAULT 0,
  parsed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for documents
CREATE INDEX idx_documents_dream ON documents(dream_id);
CREATE INDEX idx_documents_uploaded ON documents(uploaded_at DESC);

-- ============================================
-- RECENT_DREAMS TABLE
-- Tracks recently accessed dreams for quick access
-- ============================================
CREATE TABLE recent_dreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, dream_id)
);

-- Indexes for recent_dreams
CREATE INDEX idx_recent_user ON recent_dreams(user_id, accessed_at DESC);

-- ============================================
-- TRIGGERS
-- Auto-update timestamps and tracking
-- ============================================

-- Update updated_at timestamp on dreams
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dreams_updated_at 
  BEFORE UPDATE ON dreams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update completed_at on todos when completed
CREATE OR REPLACE FUNCTION update_todo_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        NEW.completed_at = NOW();
    ELSIF NEW.completed = FALSE THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_completed_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_todo_completed_at();

-- ============================================
-- FUNCTIONS
-- Utility functions for common operations
-- ============================================

-- Function to track dream access
CREATE OR REPLACE FUNCTION track_dream_access(p_dream_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO recent_dreams (user_id, dream_id, accessed_at)
    VALUES (auth.uid(), p_dream_id, NOW())
    ON CONFLICT (user_id, dream_id) 
    DO UPDATE SET accessed_at = NOW();
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to get dream with all related data
CREATE OR REPLACE FUNCTION get_dream_full(p_dream_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Track access
    PERFORM track_dream_access(p_dream_id);
    
    -- Return full dream data
    SELECT json_build_object(
        'dream', row_to_json(d.*),
        'fragments', (SELECT json_agg(f.*) FROM fragments f WHERE f.dream_id = p_dream_id),
        'todos', (SELECT json_agg(t.*) FROM todos t WHERE t.dream_id = p_dream_id ORDER BY t.order_index),
        'documents', (SELECT json_agg(doc.*) FROM documents doc WHERE doc.dream_id = p_dream_id)
    ) INTO result
    FROM dreams d
    WHERE d.id = p_dream_id;
    
    RETURN result;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- ============================================
-- COMMENTS
-- Document table purposes
-- ============================================

COMMENT ON TABLE dreams IS 'Stores project/dream metadata and high-level information';
COMMENT ON TABLE fragments IS 'Stores conversation pieces captured from AI chats';
COMMENT ON TABLE todos IS 'Stores tasks and action items for dreams';
COMMENT ON TABLE documents IS 'Stores uploaded document metadata and parsing results';
COMMENT ON TABLE recent_dreams IS 'Tracks recently accessed dreams for quick access sidebar';

-- ============================================
-- COMPLETE
-- ============================================

-- Verify tables were created
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'dreams') THEN
        RAISE EXCEPTION 'Dreams table not created!';
    END IF;
    RAISE NOTICE 'Schema migration completed successfully!';
END $$;


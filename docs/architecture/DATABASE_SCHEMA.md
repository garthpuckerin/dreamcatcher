# Dreamcatcher Database Schema

**Version:** 2.0.0  
**Date:** December 2024  
**Status:** Implementation Planning  
**Purpose:** Define comprehensive database schema for Dreamcatcher microservice

---

## 🎯 **Schema Overview**

Dreamcatcher uses PostgreSQL as its primary database, with Redis for caching and real-time features. The schema is designed to support both PipelineOS integration and standalone operation.

---

## 🏗️ **Core Tables**

### **1. Dreams Table**

```sql
CREATE TABLE dreams (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'idea',
    tags JSONB DEFAULT '[]',
    created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_with_pipelineos BOOLEAN DEFAULT FALSE,
    synced_at TIMESTAMP WITH TIME ZONE,
    pipelineos_project_id VARCHAR(255),
    brand VARCHAR(100) DEFAULT 'personal',
    summary TEXT,
    todos JSONB DEFAULT '[]',
    documents JSONB DEFAULT '[]',
    user_id VARCHAR(255),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_dreams_status ON dreams(status);
CREATE INDEX idx_dreams_brand ON dreams(brand);
CREATE INDEX idx_dreams_created ON dreams(created);
CREATE INDEX idx_dreams_updated ON dreams(updated);
CREATE INDEX idx_dreams_user_id ON dreams(user_id);
CREATE INDEX idx_dreams_pipelineos_project_id ON dreams(pipelineos_project_id);
CREATE INDEX idx_dreams_synced ON dreams(synced_with_pipelineos);

-- GIN index for JSONB columns
CREATE INDEX idx_dreams_tags ON dreams USING GIN(tags);
CREATE INDEX idx_dreams_todos ON dreams USING GIN(todos);
CREATE INDEX idx_dreams_documents ON dreams USING GIN(documents);
```

### **2. Fragments Table**

```sql
CREATE TABLE fragments (
    id VARCHAR(255) PRIMARY KEY,
    dream_id VARCHAR(255) NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    url VARCHAR(1000),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    features JSONB DEFAULT '[]',
    code_snippets JSONB DEFAULT '[]',
    user_id VARCHAR(255),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_fragments_dream_id ON fragments(dream_id);
CREATE INDEX idx_fragments_source ON fragments(source);
CREATE INDEX idx_fragments_date ON fragments(date);
CREATE INDEX idx_fragments_user_id ON fragments(user_id);

-- GIN indexes for JSONB columns
CREATE INDEX idx_fragments_features ON fragments USING GIN(features);
CREATE INDEX idx_fragments_code_snippets ON fragments USING GIN(code_snippets);
```

### **3. Implementations Table**

```sql
CREATE TABLE implementations (
    id VARCHAR(255) PRIMARY KEY,
    dream_id VARCHAR(255) NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    project_id VARCHAR(255),
    tickets_created INTEGER DEFAULT 0,
    agents_assigned INTEGER DEFAULT 0,
    estimated_completion VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    implementation_data JSONB DEFAULT '{}',
    user_id VARCHAR(255),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_implementations_dream_id ON implementations(dream_id);
CREATE INDEX idx_implementations_status ON implementations(status);
CREATE INDEX idx_implementations_project_id ON implementations(project_id);
CREATE INDEX idx_implementations_created_at ON implementations(created_at);
CREATE INDEX idx_implementations_user_id ON implementations(user_id);

-- GIN index for JSONB column
CREATE INDEX idx_implementations_data ON implementations USING GIN(implementation_data);
```

### **4. Users Table**

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(1000),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active);

-- GIN index for JSONB column
CREATE INDEX idx_users_preferences ON users USING GIN(preferences);
```

### **5. Sync Sessions Table**

```sql
CREATE TABLE sync_sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL, -- 'pipelineos', 'standalone', 'manual'
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    total_dreams INTEGER DEFAULT 0,
    synced_dreams INTEGER DEFAULT 0,
    failed_dreams INTEGER DEFAULT 0,
    error_message TEXT,
    sync_data JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_sync_sessions_user_id ON sync_sessions(user_id);
CREATE INDEX idx_sync_sessions_status ON sync_sessions(status);
CREATE INDEX idx_sync_sessions_started_at ON sync_sessions(started_at);
CREATE INDEX idx_sync_sessions_session_type ON sync_sessions(session_type);

-- GIN index for JSONB column
CREATE INDEX idx_sync_sessions_data ON sync_sessions USING GIN(sync_data);
```

---

## 🔧 **Extended Tables**

### **6. Brands Table**

```sql
CREATE TABLE brands (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_brands_is_active ON brands(is_active);

-- Insert default brands
INSERT INTO brands (id, name, display_name, description, color, icon) VALUES
('personal', 'Personal', 'Personal Projects', 'Personal development projects', '#3B82F6', 'user'),
('bc-innovations', 'BC Innovations', 'Blurred Concepts Innovations', 'BC Innovations projects', '#10B981', 'lightbulb'),
('bc-studio', 'BC Studio', 'Blurred Concepts Studio', 'BC Studio design projects', '#F59E0B', 'palette'),
('mpgworldwide', 'MPGWorldwide', 'MPGWorldwide Projects', 'MPGWorldwide business projects', '#8B5CF6', 'globe'),
('accordingto', 'Accordingto', 'Accordingto Projects', 'Accordingto content projects', '#EF4444', 'book');
```

### **7. Tags Table**

```sql
CREATE TABLE tags (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    color VARCHAR(7), -- Hex color code
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_category ON tags(category);
CREATE INDEX idx_tags_usage_count ON tags(usage_count);

-- Insert default tags
INSERT INTO tags (id, name, category, color, description) VALUES
('coding', 'Coding', 'Task', '#3B82F6', 'Programming and development tasks'),
('admin', 'Admin', 'Task', '#6B7280', 'Administrative tasks'),
('design', 'Design', 'Task', '#F59E0B', 'Design and UI/UX tasks'),
('marketing', 'Marketing', 'Task', '#10B981', 'Marketing and promotion tasks'),
('devops', 'DevOps', 'Task', '#8B5CF6', 'DevOps and infrastructure tasks'),
('strategy', 'Strategy', 'Task', '#EF4444', 'Strategic planning tasks');
```

### **8. Dream Tags Junction Table**

```sql
CREATE TABLE dream_tags (
    dream_id VARCHAR(255) NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
    tag_id VARCHAR(255) NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (dream_id, tag_id)
);

-- Indexes
CREATE INDEX idx_dream_tags_dream_id ON dream_tags(dream_id);
CREATE INDEX idx_dream_tags_tag_id ON dream_tags(tag_id);
```

### **9. Documents Table**

```sql
CREATE TABLE documents (
    id VARCHAR(255) PRIMARY KEY,
    dream_id VARCHAR(255) NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parsed BOOLEAN DEFAULT FALSE,
    parsed_data JSONB DEFAULT '{}',
    user_id VARCHAR(255),
    created_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_documents_dream_id ON documents(dream_id);
CREATE INDEX idx_documents_file_type ON documents(file_type);
CREATE INDEX idx_documents_upload_date ON documents(upload_date);
CREATE INDEX idx_documents_parsed ON documents(parsed);
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- GIN index for JSONB column
CREATE INDEX idx_documents_parsed_data ON documents USING GIN(parsed_data);
```

### **10. Todos Table**

```sql
CREATE TABLE todos (
    id VARCHAR(255) PRIMARY KEY,
    dream_id VARCHAR(255) NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    deadline TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100), -- 'manual', 'ai_generated', 'document_parsed'
    notes TEXT,
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id VARCHAR(255),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_todos_dream_id ON todos(dream_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_deadline ON todos(deadline);
CREATE INDEX idx_todos_category ON todos(category);
CREATE INDEX idx_todos_assigned_to ON todos(assigned_to);
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_created_at ON todos(created_at);
```

---

## 🔄 **Views and Functions**

### **1. Dream Summary View**

```sql
CREATE VIEW dream_summary AS
SELECT 
    d.id,
    d.title,
    d.description,
    d.status,
    d.brand,
    d.created,
    d.updated,
    d.synced_with_pipelineos,
    d.pipelineos_project_id,
    COUNT(f.id) as fragment_count,
    COUNT(t.id) as todo_count,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_todos,
    COUNT(doc.id) as document_count,
    array_agg(DISTINCT tag.name) as tag_names
FROM dreams d
LEFT JOIN fragments f ON d.id = f.dream_id
LEFT JOIN todos t ON d.id = t.dream_id
LEFT JOIN documents doc ON d.id = doc.dream_id
LEFT JOIN dream_tags dt ON d.id = dt.dream_id
LEFT JOIN tags tag ON dt.tag_id = tag.id
GROUP BY d.id, d.title, d.description, d.status, d.brand, d.created, d.updated, d.synced_with_pipelineos, d.pipelineos_project_id;
```

### **2. User Activity View**

```sql
CREATE VIEW user_activity AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    COUNT(DISTINCT d.id) as total_dreams,
    COUNT(DISTINCT f.id) as total_fragments,
    COUNT(DISTINCT t.id) as total_todos,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_todos,
    MAX(d.updated) as last_dream_update,
    MAX(f.date) as last_fragment_created,
    u.last_login
FROM users u
LEFT JOIN dreams d ON u.id = d.user_id
LEFT JOIN fragments f ON d.id = f.dream_id
LEFT JOIN todos t ON d.id = t.dream_id
GROUP BY u.id, u.username, u.email, u.last_login;
```

### **3. Sync Status Function**

```sql
CREATE OR REPLACE FUNCTION get_sync_status(user_id_param VARCHAR(255))
RETURNS TABLE (
    total_dreams BIGINT,
    synced_dreams BIGINT,
    unsynced_dreams BIGINT,
    last_sync TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_dreams,
        COUNT(CASE WHEN d.synced_with_pipelineos THEN 1 END) as synced_dreams,
        COUNT(CASE WHEN NOT d.synced_with_pipelineos THEN 1 END) as unsynced_dreams,
        MAX(d.synced_at) as last_sync
    FROM dreams d
    WHERE d.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;
```

### **4. Dream Statistics Function**

```sql
CREATE OR REPLACE FUNCTION get_dream_statistics(dream_id_param VARCHAR(255))
RETURNS TABLE (
    fragment_count BIGINT,
    todo_count BIGINT,
    completed_todos BIGINT,
    document_count BIGINT,
    completion_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(f.id) as fragment_count,
        COUNT(t.id) as todo_count,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_todos,
        COUNT(doc.id) as document_count,
        CASE 
            WHEN COUNT(t.id) > 0 THEN 
                ROUND((COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::NUMERIC / COUNT(t.id)) * 100, 2)
            ELSE 0
        END as completion_percentage
    FROM dreams d
    LEFT JOIN fragments f ON d.id = f.dream_id
    LEFT JOIN todos t ON d.id = t.dream_id
    LEFT JOIN documents doc ON d.id = doc.dream_id
    WHERE d.id = dream_id_param
    GROUP BY d.id;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 **Security and Permissions**

### **1. Row Level Security (RLS)**

```sql
-- Enable RLS on all tables
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- RLS policies for dreams
CREATE POLICY dreams_user_policy ON dreams
    FOR ALL TO authenticated
    USING (user_id = current_setting('app.current_user_id'));

-- RLS policies for fragments
CREATE POLICY fragments_user_policy ON fragments
    FOR ALL TO authenticated
    USING (user_id = current_setting('app.current_user_id'));

-- RLS policies for implementations
CREATE POLICY implementations_user_policy ON implementations
    FOR ALL TO authenticated
    USING (user_id = current_setting('app.current_user_id'));

-- RLS policies for sync_sessions
CREATE POLICY sync_sessions_user_policy ON sync_sessions
    FOR ALL TO authenticated
    USING (user_id = current_setting('app.current_user_id'));

-- RLS policies for documents
CREATE POLICY documents_user_policy ON documents
    FOR ALL TO authenticated
    USING (user_id = current_setting('app.current_user_id'));

-- RLS policies for todos
CREATE POLICY todos_user_policy ON todos
    FOR ALL TO authenticated
    USING (user_id = current_setting('app.current_user_id'));
```

### **2. Database Functions for Security**

```sql
-- Function to set current user context
CREATE OR REPLACE FUNCTION set_current_user(user_id_param VARCHAR(255))
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id_param, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's dreams
CREATE OR REPLACE FUNCTION get_user_dreams(user_id_param VARCHAR(255))
RETURNS TABLE (
    id VARCHAR(255),
    title VARCHAR(500),
    description TEXT,
    status VARCHAR(50),
    brand VARCHAR(100),
    created TIMESTAMP WITH TIME ZONE,
    updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.title, d.description, d.status, d.brand, d.created, d.updated
    FROM dreams d
    WHERE d.user_id = user_id_param
    ORDER BY d.updated DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📊 **Performance Optimization**

### **1. Partitioning Strategy**

```sql
-- Partition dreams table by created date (monthly partitions)
CREATE TABLE dreams_partitioned (
    LIKE dreams INCLUDING ALL
) PARTITION BY RANGE (created);

-- Create monthly partitions
CREATE TABLE dreams_2024_01 PARTITION OF dreams_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE dreams_2024_02 PARTITION OF dreams_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Continue for other months...
```

### **2. Materialized Views**

```sql
-- Materialized view for dream statistics
CREATE MATERIALIZED VIEW dream_statistics AS
SELECT 
    d.id,
    d.title,
    d.status,
    d.brand,
    COUNT(f.id) as fragment_count,
    COUNT(t.id) as todo_count,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_todos,
    COUNT(doc.id) as document_count,
    d.updated
FROM dreams d
LEFT JOIN fragments f ON d.id = f.dream_id
LEFT JOIN todos t ON d.id = t.dream_id
LEFT JOIN documents doc ON d.id = doc.dream_id
GROUP BY d.id, d.title, d.status, d.brand, d.updated;

-- Create index on materialized view
CREATE INDEX idx_dream_statistics_id ON dream_statistics(id);
CREATE INDEX idx_dream_statistics_status ON dream_statistics(status);
CREATE INDEX idx_dream_statistics_brand ON dream_statistics(brand);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_dream_statistics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dream_statistics;
END;
$$ LANGUAGE plpgsql;
```

### **3. Database Maintenance**

```sql
-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
    -- Delete old sync sessions (older than 30 days)
    DELETE FROM sync_sessions 
    WHERE started_at < NOW() - INTERVAL '30 days';
    
    -- Delete old implementations (older than 90 days)
    DELETE FROM implementations 
    WHERE created_at < NOW() - INTERVAL '90 days' 
    AND status = 'completed';
    
    -- Update statistics
    ANALYZE dreams;
    ANALYZE fragments;
    ANALYZE todos;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run daily)
-- This would be set up in a cron job or scheduled task
```

---

## 🔄 **Migration Scripts**

### **1. Initial Migration**

```sql
-- Migration: 001_initial_schema.sql
-- Create all tables and indexes
-- Insert default data
-- Set up RLS policies
-- Create views and functions
```

### **2. Schema Updates**

```sql
-- Migration: 002_add_brand_organization.sql
-- Add brand column to dreams table
-- Create brands table
-- Insert default brands
-- Update existing dreams with default brand

-- Migration: 003_add_todos_system.sql
-- Create todos table
-- Add todos column to dreams table
-- Create dream_tags junction table
-- Create tags table
-- Insert default tags

-- Migration: 004_add_documents_system.sql
-- Create documents table
-- Add documents column to dreams table
-- Add file storage support
-- Create document parsing functions
```

---

## 🎯 **Conclusion**

The database schema provides:

- **Comprehensive Data Model**: All necessary tables for dreams, fragments, todos, and documents
- **Performance Optimization**: Proper indexing, partitioning, and materialized views
- **Security**: Row-level security and user isolation
- **Scalability**: Designed to handle large amounts of data
- **Flexibility**: JSONB columns for extensible data
- **Maintainability**: Clear structure and documentation

**Success depends on proper implementation, monitoring, and maintenance.**

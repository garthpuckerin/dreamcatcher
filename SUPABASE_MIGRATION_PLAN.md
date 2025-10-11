# Dreamcatcher → Supabase Migration Plan

**Date:** October 11, 2025  
**Version:** Backend v1.0  
**Timeline:** 1 week  
**Goal:** Move from LocalStorage to cloud-backed persistent storage

---

## 🎯 **Why Supabase?**

- ✅ PostgreSQL (enterprise-grade)
- ✅ Free tier: 500MB DB, 1GB storage
- ✅ Auto-generated REST API
- ✅ Real-time subscriptions
- ✅ Built-in auth
- ✅ File storage included
- ✅ 2-3 day integration time
- ✅ Self-hostable later

---

## 📊 **Database Schema**

### **dreams table**
```sql
CREATE TABLE dreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT, -- 'BC Innovations', 'BC Studio', etc.
  status TEXT DEFAULT 'idea', -- idea, planning, in-progress, paused, completed, abandoned
  tags TEXT[], -- array of tags
  summary TEXT, -- auto-generated summary
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dreams_user ON dreams(user_id);
CREATE INDEX idx_dreams_brand ON dreams(brand);
CREATE INDEX idx_dreams_status ON dreams(status);
CREATE INDEX idx_dreams_updated ON dreams(updated_at DESC);
```

### **fragments table**
```sql
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

CREATE INDEX idx_fragments_dream ON fragments(dream_id);
CREATE INDEX idx_fragments_date ON fragments(date DESC);
```

### **todos table** (v2.1)
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'coding', 'admin', 'design', 'marketing', 'devops'
  deadline TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'manual', -- 'manual', 'document', 'ai-parsed', 'pipelineos'
  priority INTEGER DEFAULT 0, -- 0 = normal, 1 = high, 2 = urgent
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_todos_dream ON todos(dream_id);
CREATE INDEX idx_todos_deadline ON todos(deadline);
CREATE INDEX idx_todos_completed ON todos(completed, deadline);
```

### **documents table** (v2.2)
```sql
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

CREATE INDEX idx_documents_dream ON documents(dream_id);
```

### **recent_dreams table** (tracking)
```sql
CREATE TABLE recent_dreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, dream_id)
);

CREATE INDEX idx_recent_user ON recent_dreams(user_id, accessed_at DESC);
```

---

## 🔧 **Supabase Configuration**

### **1. Create Project**
```bash
# Visit: https://supabase.com/dashboard
# Click: New Project
# Name: dreamcatcher-prod
# Region: Choose closest to users
# Database Password: [generate strong password]
```

### **2. Run Migrations**
```sql
-- Run in Supabase SQL Editor
-- Copy schemas from above
```

### **3. Enable Row Level Security (RLS)**
```sql
-- Users can only see their own dreams
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_dreams ENABLE ROW LEVEL SECURITY;

-- Dreams policies
CREATE POLICY "Users can view own dreams"
  ON dreams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dreams"
  ON dreams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dreams"
  ON dreams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dreams"
  ON dreams FOR DELETE
  USING (auth.uid() = user_id);

-- Fragments policies (inherit from dreams)
CREATE POLICY "Users can view own fragments"
  ON fragments FOR SELECT
  USING (
    dream_id IN (
      SELECT id FROM dreams WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own fragments"
  ON fragments FOR INSERT
  WITH CHECK (
    dream_id IN (
      SELECT id FROM dreams WHERE user_id = auth.uid()
    )
  );

-- Similar policies for todos, documents, recent_dreams
```

### **4. Storage Bucket**
```javascript
// Create 'documents' bucket in Supabase Storage
// Enable: Public = false
// Max file size: 50MB
```

---

## 💻 **Frontend Integration**

### **1. Install Supabase Client**
```bash
cd C:\MPGWorldwide\dreamcatcher
npm install @supabase/supabase-js
```

### **2. Environment Setup**
```bash
# Create .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **3. Supabase Client Setup**
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### **4. Migrate Data Layer**
```javascript
// src/hooks/useDreams.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useDreams() {
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDreams()
    
    // Real-time subscription
    const subscription = supabase
      .channel('dreams')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dreams'
      }, payload => {
        // Update local state
        handleRealtimeUpdate(payload)
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  async function loadDreams() {
    const { data, error } = await supabase
      .from('dreams')
      .select(`
        *,
        fragments (*)
      `)
      .order('updated_at', { ascending: false })
    
    if (error) console.error(error)
    else setDreams(data)
    setLoading(false)
  }

  async function createDream(dream) {
    const { data, error } = await supabase
      .from('dreams')
      .insert([dream])
      .select()
    
    if (error) console.error(error)
    return data?.[0]
  }

  async function updateDream(id, updates) {
    const { error } = await supabase
      .from('dreams')
      .update(updates)
      .eq('id', id)
    
    if (error) console.error(error)
  }

  async function deleteDream(id) {
    const { error } = await supabase
      .from('dreams')
      .delete()
      .eq('id', id)
    
    if (error) console.error(error)
  }

  return {
    dreams,
    loading,
    createDream,
    updateDream,
    deleteDream
  }
}
```

---

## 🔐 **Authentication**

### **Simple Email/Password (MVP)**
```javascript
// src/components/Auth.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) alert(error.message)
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) alert(error.message)
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={signIn}>Sign In</button>
      <button onClick={signUp}>Sign Up</button>
    </div>
  )
}
```

### **OAuth Providers (Later)**
- Google
- GitHub
- Twitter

---

## 📦 **Migration Strategy**

### **Option A: Automatic Migration**
```javascript
// Migrate LocalStorage data on first login
async function migrateLocalStorage() {
  const localDreams = localStorage.getItem('dreamcatcher-dreams')
  if (localDreams) {
    const dreams = JSON.parse(localDreams)
    for (const dream of dreams) {
      await supabase.from('dreams').insert([dream])
    }
    localStorage.removeItem('dreamcatcher-dreams')
    alert('Data migrated to cloud!')
  }
}
```

### **Option B: Export/Import**
```javascript
// Let users manually export/import
function exportData() {
  const data = {
    dreams: localStorage.getItem('dreamcatcher-dreams'),
    exportedAt: new Date().toISOString()
  }
  downloadJSON(data, 'dreamcatcher-export.json')
}

async function importData(file) {
  const data = await file.text()
  const { dreams } = JSON.parse(data)
  // Insert into Supabase
}
```

---

## 📅 **Implementation Timeline**

### **Day 1: Setup**
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Configure RLS policies
- [ ] Set up storage bucket
- [ ] Get API keys

### **Day 2-3: Frontend Integration**
- [ ] Install Supabase client
- [ ] Create data hooks (useDreams, useFragments)
- [ ] Update App.jsx to use hooks
- [ ] Test CRUD operations

### **Day 4: Authentication**
- [ ] Build auth UI
- [ ] Implement sign up/sign in
- [ ] Session management
- [ ] Protected routes

### **Day 5: Migration**
- [ ] LocalStorage → Supabase migration tool
- [ ] Test with sample data
- [ ] Ensure data integrity

### **Day 6-7: Testing & Polish**
- [ ] End-to-end testing
- [ ] Handle edge cases
- [ ] Loading states
- [ ] Error handling
- [ ] Deploy updated app

---

## 💰 **Cost Analysis**

### **Supabase Free Tier:**
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ Social OAuth providers

**Estimate:** Free for first 1,000-5,000 users

### **Pro Tier ($25/month):**
- 8GB database
- 100GB file storage
- 100,000 monthly active users
- Daily backups
- Email support

**When to upgrade:** 5,000+ active users or 500MB+ data

---

## 🚀 **Launch Strategy**

### **v2.0 (Current) - LocalStorage**
- Launch Oct 17 with LocalStorage
- Works offline
- No auth required
- Simple onboarding

### **v2.1 (Oct 24) - Cloud Backend**
- Add "Sign in to sync" option
- LocalStorage still works
- Cloud sync optional
- Migrate existing data

### **v2.2+ - Cloud-First**
- Default to cloud storage
- Offline mode with sync
- Team features
- Full PM capabilities

---

## ✅ **Success Criteria**

- [ ] All dreams/fragments migrate without loss
- [ ] App works online & offline
- [ ] Real-time sync across devices
- [ ] < 2 second load time
- [ ] 99.9% uptime (Supabase SLA)
- [ ] Zero data loss incidents

---

## 🔮 **Future: Self-Hosted Option**

For enterprise customers who want data on-premises:

```bash
# Supabase is open source!
docker-compose up

# Full stack:
- PostgreSQL
- PostgREST (API)
- GoTrue (Auth)
- Realtime
- Storage
```

**Pricing:** Enterprise tier ($299+/month) includes self-hosted support

---

**Next Step:** Create Supabase project and start Day 1 tasks? 🚀



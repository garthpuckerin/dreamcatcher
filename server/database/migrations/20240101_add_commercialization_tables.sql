-- Database Migrations for Commercialization Features
-- Adds tables for: Portfolios, Templates, Integrations, Analytics, Versioning

-- ============================================================================
-- PORTFOLIOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  bio TEXT,
  skills TEXT[], -- Array of skill tags
  theme VARCHAR(50) DEFAULT 'minimal',
  custom_domain VARCHAR(255),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_portfolios_public ON portfolios(is_public) WHERE is_public = TRUE;

-- Portfolio-Dream association (many-to-many with ordering)
CREATE TABLE IF NOT EXISTS portfolio_dreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  dream_id UUID NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(portfolio_id, dream_id)
);

CREATE INDEX idx_portfolio_dreams_portfolio ON portfolio_dreams(portfolio_id);
CREATE INDEX idx_portfolio_dreams_dream ON portfolio_dreams(dream_id);

-- Case Studies
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dream_id UUID NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  sections JSONB NOT NULL, -- { overview, problem, solution, process, challenges, results, learnings }
  format VARCHAR(50) DEFAULT 'standard',
  generated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, dream_id)
);

CREATE INDEX idx_case_studies_user ON case_studies(user_id);
CREATE INDEX idx_case_studies_dream ON case_studies(dream_id);

-- ============================================================================
-- TEMPLATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- product, project, personal, business, learning
  price DECIMAL(10,2) DEFAULT 0.00,
  dream JSONB NOT NULL, -- Template dream structure
  todos JSONB NOT NULL, -- Array of template todos
  is_public BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  uses INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_author ON templates(author_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_public ON templates(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_templates_rating ON templates(rating DESC);
CREATE INDEX idx_templates_uses ON templates(uses DESC);

-- Template Purchases
CREATE TABLE IF NOT EXISTS template_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  stripe_payment_id VARCHAR(255),
  purchased_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

CREATE INDEX idx_template_purchases_user ON template_purchases(user_id);
CREATE INDEX idx_template_purchases_template ON template_purchases(template_id);

-- Template Ratings
CREATE TABLE IF NOT EXISTS template_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

CREATE INDEX idx_template_ratings_template ON template_ratings(template_id);

-- ============================================================================
-- INTEGRATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- github, slack, google_calendar
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  provider_user_id VARCHAR(255),
  provider_username VARCHAR(255),
  metadata JSONB, -- Provider-specific data
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE INDEX idx_integrations_user ON integrations(user_id);
CREATE INDEX idx_integrations_provider ON integrations(provider);

-- ============================================================================
-- ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event VARCHAR(100) NOT NULL,
  properties JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  session_id VARCHAR(255)
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_event ON analytics_events(event);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);

-- ============================================================================
-- VERSIONING
-- ============================================================================

CREATE TABLE IF NOT EXISTS dream_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dream_id UUID NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  data JSONB NOT NULL, -- Complete dream state snapshot
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_snapshots_dream ON dream_snapshots(dream_id);
CREATE INDEX idx_snapshots_user ON dream_snapshots(user_id);
CREATE INDEX idx_snapshots_created ON dream_snapshots(created_at DESC);

CREATE TABLE IF NOT EXISTS dream_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_dream_id UUID NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  branch_dream_id UUID NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  branch_name VARCHAR(255) NOT NULL,
  branched_from_snapshot_id UUID REFERENCES dream_snapshots(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_branches_source ON dream_branches(source_dream_id);
CREATE INDEX idx_branches_branch ON dream_branches(branch_dream_id);

-- ============================================================================
-- TRANSACTIONS & EARNINGS (for marketplace)
-- ============================================================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- template_sale, subscription, refund
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  template_id UUID REFERENCES templates(id),
  buyer_id UUID REFERENCES users(id),
  stripe_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- ============================================================================
-- UPDATE EXISTING TABLES
-- ============================================================================

-- Add external_id to dreams for integration tracking
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS external_id VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_dreams_external ON dreams(external_id);

-- Add metadata columns to existing tables
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::JSONB;
ALTER TABLE fragments ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::JSONB;
ALTER TABLE todos ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::JSONB;

-- Add source field to fragments for integration tracking
ALTER TABLE fragments ADD COLUMN IF NOT EXISTS source VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_fragments_source ON fragments(source);

-- Add completion timestamp to todos
ALTER TABLE todos ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Add display order to todos
ALTER TABLE todos ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (for development)
-- ============================================================================

-- Insert built-in templates
INSERT INTO templates (id, author_id, name, description, category, price, dream, todos, is_public, rating, uses)
SELECT
  gen_random_uuid(),
  (SELECT id FROM users LIMIT 1),
  'MVP Launch Checklist',
  'Complete checklist for launching your MVP',
  'product',
  0.00,
  '{"title": "MVP Launch", "description": "Launch your minimum viable product", "tags": ["mvp", "launch", "product"]}'::JSONB,
  '[
    {"title": "Define core features", "category": "planning", "notes": "Focus on must-have features only"},
    {"title": "Create landing page", "category": "marketing", "notes": "Simple one-pager explaining value prop"},
    {"title": "Set up analytics", "category": "admin", "notes": "Google Analytics or Mixpanel"},
    {"title": "Beta user outreach", "category": "marketing", "notes": "Find 10-20 early testers"},
    {"title": "Collect feedback", "category": "admin", "notes": "Survey or interviews"}
  ]'::JSONB,
  TRUE,
  4.8,
  1234
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE name = 'MVP Launch Checklist');

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO dreamcatcher_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO dreamcatcher_app;

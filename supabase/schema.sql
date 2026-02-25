-- L7 Shift Internal Platform - Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE project_status AS ENUM ('active', 'completed', 'on_hold', 'cancelled');
CREATE TYPE task_status AS ENUM ('backlog', 'active', 'review', 'shipped');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE requirement_status AS ENUM ('draft', 'review', 'approved', 'implemented');
CREATE TYPE deliverable_status AS ENUM ('pending', 'uploaded', 'in_review', 'approved', 'rejected');
CREATE TYPE author_type AS ENUM ('internal', 'client', 'system');

-- ============================================
-- TABLES
-- ============================================

-- Projects - Core project management
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  client_id UUID,
  client_name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'active',
  budget_total NUMERIC(10, 2),
  budget_used NUMERIC(10, 2) DEFAULT 0,
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sprints - Time-boxed work periods
CREATE TABLE sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goals TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks - Individual work items
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'backlog',
  priority task_priority DEFAULT 'medium',
  shift_hours NUMERIC(5, 2) DEFAULT 0,
  traditional_hours_estimate NUMERIC(5, 2) DEFAULT 0,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  order_index INTEGER DEFAULT 0
);

-- Task Comments - Discussion on tasks
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_type author_type DEFAULT 'internal',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Portal Sessions
CREATE TABLE client_portal_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  pin_hash TEXT,
  magic_link_token TEXT,
  magic_link_expires TIMESTAMPTZ,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliverables - Files and assets for client review
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'image', 'document', 'prototype', 'code', etc.
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  status deliverable_status DEFAULT 'pending',
  version INTEGER DEFAULT 1,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  client_approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  approved_by TEXT
);

-- Client Feedback - Comments on deliverables
CREATE TABLE client_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ
);

-- Requirements Documents
CREATE TABLE requirements_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- MDX content
  version INTEGER DEFAULT 1,
  status requirement_status DEFAULT 'draft',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requirement Signoffs - Audit trail
CREATE TABLE requirement_signoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doc_id UUID NOT NULL REFERENCES requirements_docs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Requirement Comments
CREATE TABLE requirement_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doc_id UUID NOT NULL REFERENCES requirements_docs(id) ON DELETE CASCADE,
  author_type author_type NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

-- Activity Log - Track all changes
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'task', 'deliverable', 'requirement', etc.
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'status_changed', 'approved', etc.
  actor TEXT NOT NULL,
  actor_type author_type DEFAULT 'internal',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_sprint ON tasks(sprint_id);
CREATE INDEX idx_deliverables_project ON deliverables(project_id);
CREATE INDEX idx_deliverables_status ON deliverables(status);
CREATE INDEX idx_requirements_project ON requirements_docs(project_id);
CREATE INDEX idx_requirements_status ON requirements_docs(status);
CREATE INDEX idx_activity_project ON activity_log(project_id);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);

-- ============================================
-- VIEWS
-- ============================================

-- Project metrics view for dashboard
CREATE VIEW project_metrics AS
SELECT
  p.id AS project_id,
  COUNT(CASE WHEN t.status != 'icebox' THEN 1 END) AS total_tasks,
  COUNT(CASE WHEN t.status = 'shipped' THEN 1 END) AS shipped_tasks,
  COUNT(CASE WHEN t.status = 'active' THEN 1 END) AS active_tasks,
  COUNT(CASE WHEN t.status = 'review' THEN 1 END) AS review_tasks,
  COUNT(CASE WHEN t.status = 'backlog' THEN 1 END) AS backlog_tasks,
  COUNT(CASE WHEN t.status = 'icebox' THEN 1 END) AS icebox_tasks,
  COALESCE(SUM(CASE WHEN t.status != 'icebox' THEN t.shift_hours ELSE 0 END), 0) AS total_shift_hours,
  COALESCE(SUM(CASE WHEN t.status != 'icebox' THEN t.traditional_hours_estimate ELSE 0 END), 0) AS total_traditional_estimate,
  CASE
    WHEN COUNT(CASE WHEN t.status != 'icebox' THEN 1 END) > 0
    THEN ROUND((COUNT(CASE WHEN t.status = 'shipped' THEN 1 END)::NUMERIC / COUNT(CASE WHEN t.status != 'icebox' THEN 1 END)) * 100, 1)
    ELSE 0
  END AS completion_percentage
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
GROUP BY p.id;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Get project velocity (tasks shipped per day over last N days)
CREATE OR REPLACE FUNCTION get_project_velocity(p_project_id UUID, days INTEGER DEFAULT 14)
RETURNS TABLE (date DATE, shipped_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.date::DATE,
    COUNT(t.id) AS shipped_count
  FROM generate_series(
    CURRENT_DATE - (days || ' days')::INTERVAL,
    CURRENT_DATE,
    '1 day'::INTERVAL
  ) AS d(date)
  LEFT JOIN tasks t ON
    t.project_id = p_project_id
    AND t.shipped_at::DATE = d.date::DATE
  GROUP BY d.date
  ORDER BY d.date;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER requirements_updated_at
  BEFORE UPDATE ON requirements_docs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-set shipped_at when task status changes to shipped
CREATE OR REPLACE FUNCTION set_shipped_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'shipped' AND OLD.status != 'shipped' THEN
    NEW.shipped_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_shipped_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_shipped_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirement_signoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Service role bypass (for internal operations)
CREATE POLICY "Service role has full access to projects" ON projects
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to tasks" ON tasks
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to sprints" ON sprints
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to task_comments" ON task_comments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to client_portal_sessions" ON client_portal_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to deliverables" ON deliverables
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to client_feedback" ON client_feedback
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to requirements_docs" ON requirements_docs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to requirement_signoffs" ON requirement_signoffs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to requirement_comments" ON requirement_comments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to activity_log" ON activity_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Anon users can read projects (for client portal)
CREATE POLICY "Anon can read projects" ON projects
  FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can read tasks" ON tasks
  FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can read deliverables" ON deliverables
  FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can read requirements" ON requirements_docs
  FOR SELECT TO anon USING (true);

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Uncomment to add sample data
/*
INSERT INTO projects (name, client_name, description, status, budget_total, start_date, target_end_date) VALUES
  ('Scat Pack CLT', 'Eric Johnson', 'Dog waste removal SaaS platform', 'active', 5000, '2026-01-01', '2026-02-15'),
  ('Pretty Paid Closet', 'Jazz', 'Consignment + services platform', 'active', 4500, '2026-01-20', '2026-03-01'),
  ('Stitchwichs', 'Nicole Walker', 'Shopify optimization', 'active', 3500, '2026-01-15', '2026-03-15');
*/

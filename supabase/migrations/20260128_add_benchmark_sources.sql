-- Migration: Add benchmark source citations for defensible estimates
-- Date: 2026-01-28
-- Purpose: Make traditional time estimates externally verifiable

-- ============================================
-- ADD BENCHMARK FIELDS TO TASKS
-- ============================================

-- Source citation for where the traditional estimate came from
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS benchmark_source TEXT;
COMMENT ON COLUMN tasks.benchmark_source IS 'Citation for traditional estimate (e.g., "Clutch 2025", "Shopify Partners", "Client quote")';

-- Feature category to link to standard benchmarks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS benchmark_category TEXT;
COMMENT ON COLUMN tasks.benchmark_category IS 'Industry benchmark category (e.g., "auth", "payment", "ecommerce", "scheduling")';

-- ============================================
-- ASSETS TABLE (Outcome Catalog)
-- ============================================

-- Reusable components with benchmark data
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'get_paid', 'book_time', 'manage_customers', etc.
  description TEXT NOT NULL,

  -- Status
  status TEXT DEFAULT 'planned', -- 'ready', 'in_progress', 'planned'
  source_project TEXT, -- Where it was first built
  github_path TEXT,

  -- Hours (L7 Shift actual)
  shift_hours NUMERIC(5, 2) NOT NULL,

  -- Traditional benchmarks (DEFENSIBLE)
  traditional_hours_low NUMERIC(5, 2) NOT NULL,
  traditional_hours_high NUMERIC(5, 2) NOT NULL,
  benchmark_source TEXT NOT NULL, -- Primary citation
  benchmark_url TEXT, -- Link to source

  -- Dependencies & tags
  dependencies TEXT[],
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to assets" ON assets
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anon can read assets" ON assets
  FOR SELECT TO anon USING (true);

-- ============================================
-- STANDARD BENCHMARK REFERENCE TABLE
-- ============================================

-- Industry standard benchmarks for quick lookup
CREATE TABLE IF NOT EXISTS benchmark_standards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Feature identification
  feature_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'auth', 'payment', 'ecommerce', 'scheduling', 'admin', 'email', 'data'

  -- Traditional estimates (hours)
  hours_low NUMERIC(5, 2) NOT NULL,
  hours_mid NUMERIC(5, 2) NOT NULL,
  hours_high NUMERIC(5, 2) NOT NULL,

  -- Source citation
  source TEXT NOT NULL, -- e.g., "Clutch 2025", "GoodFirms 2025"
  source_url TEXT,
  notes TEXT,

  -- L7 Shift typical hours (for comparison)
  shift_hours_typical NUMERIC(5, 2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(feature_name, category)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_benchmarks_category ON benchmark_standards(category);

-- Enable RLS
ALTER TABLE benchmark_standards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to benchmark_standards" ON benchmark_standards
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anon can read benchmark_standards" ON benchmark_standards
  FOR SELECT TO anon USING (true);

-- ============================================
-- SEED STANDARD BENCHMARKS
-- ============================================

INSERT INTO benchmark_standards (feature_name, category, hours_low, hours_mid, hours_high, source, source_url, shift_hours_typical, notes) VALUES

-- Authentication & User Management
('Basic email/password auth', 'auth', 16, 20, 24, 'Clutch 2025', 'https://clutch.co/developers/pricing', 2, 'Setup, security, password reset'),
('OAuth social login (1 provider)', 'auth', 8, 10, 12, 'GoodFirms 2025', 'https://www.goodfirms.co/resources/software-development-cost', 1, 'Google/Facebook/Apple'),
('OAuth social login (3+ providers)', 'auth', 20, 26, 32, 'GoodFirms 2025', NULL, 3, 'Multiple integrations'),
('User registration flow', 'auth', 12, 16, 20, 'Clutch 2025', NULL, 2, 'Form, validation, confirmation'),
('Customer portal/dashboard', 'auth', 40, 60, 80, 'GoodFirms 2025', NULL, 8, 'Auth + basic dashboard'),
('Role-based access control', 'auth', 16, 24, 32, 'Stack Overflow Survey', 'https://survey.stackoverflow.co/2025/', 3, 'Permissions, guards'),

-- Payment Integration
('Stripe one-time checkout', 'payment', 12, 16, 20, 'Stripe Docs/Clutch 2025', 'https://stripe.com/docs', 2, 'Basic payment flow'),
('Stripe subscription billing', 'payment', 24, 32, 40, 'Stripe Docs/GoodFirms 2025', NULL, 4, 'Recurring + customer portal'),
('Invoice generation system', 'payment', 20, 26, 32, 'Clutch 2025', NULL, 4, 'PDF generation, tracking'),
('Commission/payout system', 'payment', 32, 40, 48, 'Clutch 2025', NULL, 6, 'Multi-party payments'),

-- E-commerce (Shopify)
('Theme customization (basic)', 'ecommerce', 8, 12, 16, 'Shopify Partners', 'https://www.shopify.com/partners/blog/pricing-web-design', 2, 'Colors, fonts, layout'),
('Theme customization (major)', 'ecommerce', 40, 60, 80, 'Shopify Partners', NULL, 8, 'New sections, features'),
('Custom Liquid section', 'ecommerce', 4, 6, 8, 'Shopify Partners', NULL, 1, 'Product badges, banners'),
('Variant price rules', 'ecommerce', 8, 12, 16, 'Shopify Partners', NULL, 2, 'Size upcharges, etc.'),
('Shopify Function', 'ecommerce', 16, 24, 32, 'Shopify Partners', NULL, 4, 'Discounts, validation'),
('Shopify Flow workflow', 'ecommerce', 2, 3, 4, 'Shopify Partners', NULL, 0.5, 'Automation setup'),
('App replacement (custom code)', 'ecommerce', 16, 28, 40, 'L7 Shift/Industry average', NULL, 4, 'Replace app with native'),

-- Scheduling & Booking
('Basic appointment booking', 'scheduling', 24, 32, 40, 'GoodFirms 2025', NULL, 4, 'Calendar, slots, confirmation'),
('Multi-resource scheduling', 'scheduling', 60, 80, 100, 'GoodFirms 2025', NULL, 12, 'Staff, rooms, equipment'),
('Route optimization', 'scheduling', 40, 50, 60, 'Clutch 2025', NULL, 8, 'Algorithm, maps integration'),
('SMS/email reminders', 'scheduling', 8, 12, 16, 'Twilio/Resend docs', NULL, 2, 'Notification system'),

-- Admin Dashboards
('Dashboard layout/navigation', 'admin', 16, 20, 24, 'Clutch 2025', NULL, 3, 'Sidebar, header, routing'),
('Data table with CRUD', 'admin', 20, 26, 32, 'GoodFirms 2025', NULL, 4, 'List, create, edit, delete per entity'),
('Charts/analytics widget', 'admin', 8, 12, 16, 'GoodFirms 2025', NULL, 2, 'Chart library integration'),
('Export functionality', 'admin', 8, 10, 12, 'Clutch 2025', NULL, 1, 'CSV/PDF reports'),

-- Email Systems
('Transactional email setup', 'email', 8, 10, 12, 'SendGrid/Resend docs', NULL, 1, 'Provider integration'),
('Email template', 'email', 2, 3, 4, 'Clutch 2025', NULL, 0.5, 'Design + code each'),
('Email automation flow', 'email', 4, 6, 8, 'Mailchimp/Klaviyo', NULL, 1, 'Trigger + sequence'),
('Drip campaign (multi-step)', 'email', 12, 16, 20, 'GoodFirms 2025', NULL, 3, 'Logic, templates, tracking'),

-- Data & Integrations
('REST API endpoint', 'data', 4, 6, 8, 'GoodFirms 2025', NULL, 1, 'Design, build, test each'),
('Third-party API integration', 'data', 8, 16, 24, 'GoodFirms 2025', NULL, 2, 'Depends on API complexity'),
('Database schema design', 'data', 16, 28, 40, 'Clutch 2025', NULL, 3, 'Data modeling, relations'),
('Data migration script', 'data', 8, 16, 24, 'Clutch 2025', NULL, 2, 'ETL, validation'),
('Webhook system', 'data', 12, 16, 20, 'GoodFirms 2025', NULL, 2, 'Receive, validate, process')

ON CONFLICT (feature_name, category) DO UPDATE SET
  hours_low = EXCLUDED.hours_low,
  hours_mid = EXCLUDED.hours_mid,
  hours_high = EXCLUDED.hours_high,
  source = EXCLUDED.source,
  shift_hours_typical = EXCLUDED.shift_hours_typical,
  updated_at = NOW();

-- ============================================
-- HELPER FUNCTION: Get benchmark for task
-- ============================================

CREATE OR REPLACE FUNCTION get_task_benchmark(p_feature_name TEXT, p_category TEXT DEFAULT NULL)
RETURNS TABLE (
  feature TEXT,
  category TEXT,
  traditional_hours_low NUMERIC,
  traditional_hours_mid NUMERIC,
  traditional_hours_high NUMERIC,
  shift_hours NUMERIC,
  savings_percent NUMERIC,
  source TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.feature_name,
    b.category,
    b.hours_low,
    b.hours_mid,
    b.hours_high,
    b.shift_hours_typical,
    ROUND(((b.hours_mid - COALESCE(b.shift_hours_typical, 0)) / b.hours_mid) * 100, 0),
    b.source
  FROM benchmark_standards b
  WHERE
    (p_feature_name IS NULL OR b.feature_name ILIKE '%' || p_feature_name || '%')
    AND (p_category IS NULL OR b.category = p_category);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEW: Tasks with benchmark context
-- ============================================

CREATE OR REPLACE VIEW tasks_with_benchmarks AS
SELECT
  t.*,
  CASE
    WHEN t.traditional_hours_estimate > 0 AND t.shift_hours > 0
    THEN ROUND(((t.traditional_hours_estimate - t.shift_hours) / t.traditional_hours_estimate) * 100, 0)
    ELSE 0
  END AS savings_percent,
  CASE
    WHEN t.shift_hours > 0
    THEN ROUND(t.traditional_hours_estimate / t.shift_hours, 1)
    ELSE 0
  END AS shift_multiplier
FROM tasks t;

-- Grant access to view
GRANT SELECT ON tasks_with_benchmarks TO anon, authenticated, service_role;

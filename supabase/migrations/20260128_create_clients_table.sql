-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'prospect' CHECK (status IN ('active', 'completed', 'prospect', 'churned')),
  total_value NUMERIC DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
CREATE POLICY "Service role can do anything" ON clients
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated users (read only for now)
CREATE POLICY "Authenticated users can read" ON clients
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for anon users (read only for now)
CREATE POLICY "Anon can read clients" ON clients
  FOR SELECT
  TO anon
  USING (true);

-- Insert seed data
INSERT INTO clients (id, name, company, email, phone, status, total_value, joined_at, last_active) VALUES
  (uuid_generate_v4(), 'Ken Leftwich', 'Scat Pack CLT', 'ken@scatpackclt.com', '(704) 555-0123', 'active', 5000, '2026-01-01'::timestamptz, NOW()),
  (uuid_generate_v4(), 'Jazz', 'Pretty Paid Closet', 'jazz@prettypaidcloset.com', NULL, 'active', 4500, '2026-01-20'::timestamptz, NOW() - interval '1 day'),
  (uuid_generate_v4(), 'Nicole Walker', 'Stitchwichs', 'nicole@stitchwichs.com', '(704) 555-0456', 'prospect', 3500, '2026-01-15'::timestamptz, NOW() - interval '3 days')
ON CONFLICT DO NOTHING;

import pg from 'pg';
const { Client } = pg;

// Supabase PostgreSQL connection (uses service role)
const connectionString = 'postgresql://postgres.xvdoorpshysqzphjkgbn:' + process.env.SUPABASE_DB_PASSWORD + '@aws-0-us-east-1.pooler.supabase.com:6543/postgres';

const sql = `
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

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Service role can do anything" ON clients;
DROP POLICY IF EXISTS "Authenticated users can read" ON clients;
DROP POLICY IF EXISTS "Anon can read clients" ON clients;

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
`;

const seedSql = `
-- Insert seed data (only if table is empty)
INSERT INTO clients (name, company, email, phone, status, total_value, joined_at, last_active)
SELECT 'Ken Leftwich', 'Scat Pack CLT', 'ken@scatpackclt.com', '(704) 555-0123', 'active', 5000, '2026-01-01'::timestamptz, NOW()
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE company = 'Scat Pack CLT');

INSERT INTO clients (name, company, email, phone, status, total_value, joined_at, last_active)
SELECT 'Jazz', 'Pretty Paid Closet', 'jazz@prettypaidcloset.com', NULL, 'active', 4500, '2026-01-20'::timestamptz, NOW() - interval '1 day'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE company = 'Pretty Paid Closet');

INSERT INTO clients (name, company, email, phone, status, total_value, joined_at, last_active)
SELECT 'Nicole Walker', 'Stitchwichs', 'nicole@stitchwichs.com', '(704) 555-0456', 'prospect', 3500, '2026-01-15'::timestamptz, NOW() - interval '3 days'
WHERE NOT EXISTS (SELECT 1 FROM clients WHERE company = 'Stitchwichs');
`;

async function main() {
  if (!process.env.SUPABASE_DB_PASSWORD) {
    console.error('Error: SUPABASE_DB_PASSWORD environment variable is required');
    console.log('You can find this in your Supabase dashboard under Settings > Database > Connection string');
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    console.log('Connecting to Supabase...');
    await client.connect();

    console.log('Creating clients table...');
    await client.query(sql);

    console.log('Inserting seed data...');
    await client.query(seedSql);

    console.log('Verifying table...');
    const result = await client.query('SELECT COUNT(*) FROM clients');
    console.log(`Success! clients table has ${result.rows[0].count} rows`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();

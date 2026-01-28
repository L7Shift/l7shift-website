-- Create leads table for contact form submissions + AI classification
-- Matches current contact form fields (name, email, message) + adds classification fields

CREATE TABLE IF NOT EXISTS public.leads (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    -- Contact form fields (match contact_submissions)
    name TEXT,
    email TEXT,
    message TEXT,

    -- Classification fields for Make.com automation
    status TEXT DEFAULT 'incoming',  -- incoming, qualified, disqualified, converted
    tier TEXT,                        -- SOFTBALL, MEDIUM, HARD, DISQUALIFY
    source TEXT DEFAULT 'website',    -- website, referral, etc.

    -- AI classification response from Claude
    ai_assessment JSONB               -- {reasoning, confidence, flags, recommended_action}
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated access (for ShiftBoard internal dashboard)
CREATE POLICY "Authenticated users can read leads" ON public.leads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role full access (for Make.com automation)
CREATE POLICY "Service role has full access" ON public.leads
    FOR ALL USING (auth.role() = 'service_role');

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);

-- Create index on tier for filtering
CREATE INDEX IF NOT EXISTS leads_tier_idx ON public.leads(tier);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text DEFAULT 'outfit_check',
  occasion text,
  intensity text,
  score numeric,
  marketing_consent boolean DEFAULT false,
  consent_text text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at);

-- Migration: Create email_templates table
-- Description: Stores customizable email templates for different purposes

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sender_email TEXT,
  cta_text TEXT,
  cta_url TEXT,
  check_account_text TEXT,
  check_account_email TEXT,
  social_twitter_url TEXT,
  social_facebook_url TEXT,
  social_instagram_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_templates_template_type ON email_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_email_templates_status ON email_templates(status);
CREATE INDEX IF NOT EXISTS idx_email_templates_created_by ON email_templates(created_by);

-- Add comments for documentation
COMMENT ON TABLE email_templates IS 'Stores customizable email templates for different notification types';
COMMENT ON COLUMN email_templates.template_type IS 'Checklist, Welcome, Affiliate, Match';
COMMENT ON COLUMN email_templates.status IS 'draft, active';
COMMENT ON COLUMN email_templates.body IS 'Rich text HTML content for email body';
COMMENT ON COLUMN email_templates.cta_text IS 'Call-to-action button text';
COMMENT ON COLUMN email_templates.check_account_text IS 'Text for check account section (e.g., CTA text or reminder)';

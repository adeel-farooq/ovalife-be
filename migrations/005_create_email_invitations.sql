-- Migration: Create email_invitations table
-- Description: Tracks all email invitations sent through the platform

CREATE TABLE IF NOT EXISTS email_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_phone TEXT,
  recipient_role TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitation_link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  opened_at TIMESTAMP,
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP,
  metadata JSONB,
  error_message TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- Create indexes for better query performance
CREATE INDEX idx_email_invitations_recipient_email ON email_invitations(recipient_email);
CREATE INDEX idx_email_invitations_sender_id ON email_invitations(sender_id);
CREATE INDEX idx_email_invitations_status ON email_invitations(status);
CREATE INDEX idx_email_invitations_sent_at ON email_invitations(sent_at);
CREATE INDEX idx_email_invitations_invitation_type ON email_invitations(invitation_type);

-- Add comments for documentation
COMMENT ON TABLE email_invitations IS 'Tracks all email invitations sent through the platform';
COMMENT ON COLUMN email_invitations.invitation_type IS 'parent, donor, clinic, etc.';
COMMENT ON COLUMN email_invitations.recipient_role IS 'Donor, Parent (from dropdown)';
COMMENT ON COLUMN email_invitations.status IS 'sent, failed, opened, accepted, expired';
COMMENT ON COLUMN email_invitations.metadata IS 'Additional data like parent_id, donor_id for invitation context';

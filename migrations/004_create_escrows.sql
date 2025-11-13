-- Migration: Create escrows table
-- Description: Stores escrow information for donor-parent matches with payment tracking

CREATE TABLE IF NOT EXISTS escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_number TEXT UNIQUE NOT NULL,
  donor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  clinic_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'action_needed',
  process_status TEXT NOT NULL DEFAULT 'initialized_payment',
  type TEXT NOT NULL,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  date_of_match DATE,
  legal_agreement_text TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- Create indexes for better query performance
CREATE INDEX idx_escrows_donor_id ON escrows(donor_id);
CREATE INDEX idx_escrows_parent_id ON escrows(parent_id);
CREATE INDEX idx_escrows_clinic_id ON escrows(clinic_id);
CREATE INDEX idx_escrows_status ON escrows(status);
CREATE INDEX idx_escrows_process_status ON escrows(process_status);
CREATE INDEX idx_escrows_escrow_number ON escrows(escrow_number);

-- Add comments for documentation
COMMENT ON TABLE escrows IS 'Stores escrow transactions between donors and parents';
COMMENT ON COLUMN escrows.status IS 'action_needed, in_progress, completed, cancelled';
COMMENT ON COLUMN escrows.process_status IS 'initialized_payment, pending_payment, payment_received, cycling, escrow_complete';
COMMENT ON COLUMN escrows.type IS 'fresh_cycle, frozen_cycle';

-- Migration: Add user profile fields and create related tables
-- Description: Extends users table and creates partner_info, user_addresses, notification_settings, matching_preferences tables

-- Add new columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;

-- Create user_addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL DEFAULT 'home',
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  is_primary BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- Create partner_information table
CREATE TABLE IF NOT EXISTS partner_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  email TEXT,
  profile_picture_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  UNIQUE(user_id)
);

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  toast_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  UNIQUE(user_id, notification_type)
);

-- Create matching_preferences table
CREATE TABLE IF NOT EXISTS matching_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  use_intended_parents_picture BOOLEAN DEFAULT TRUE,
  use_partner_picture BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  UNIQUE(user_id)
);

-- Create two_factor_devices table for managing 2FA devices
CREATE TABLE IF NOT EXISTS two_factor_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  device_type TEXT,
  last_used_at TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_information_user_id ON partner_information(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON notification_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_matching_preferences_user_id ON matching_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factor_devices_user_id ON two_factor_devices(user_id);

-- Insert default notification settings for notification types
-- These will be used as templates for new users
COMMENT ON TABLE notification_settings IS 'Stores user notification preferences for different event types';
COMMENT ON COLUMN notification_settings.notification_type IS 'appointments, tags_messaging_center, announcements_messaging_center, etc.';

-- Add comments
COMMENT ON TABLE user_addresses IS 'Stores user home addresses and other address types';
COMMENT ON TABLE partner_information IS 'Stores partner details for users';
COMMENT ON TABLE matching_preferences IS 'Stores OVA matching engine preferences';
COMMENT ON TABLE two_factor_devices IS 'Stores registered 2FA devices for users';

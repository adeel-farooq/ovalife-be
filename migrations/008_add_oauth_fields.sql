-- Migration: Add OAuth 2.0 fields to users table
-- Description: Adds Google OAuth support with provider, google_id, and access token fields

ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_access_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_refresh_token TEXT;

-- Add index for faster OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider ON users(oauth_provider);

-- Make password nullable for OAuth users (they don't have passwords)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

COMMENT ON COLUMN users.oauth_provider IS 'OAuth provider name (google, facebook, etc.)';
COMMENT ON COLUMN users.google_id IS 'Unique Google user identifier from OAuth';
COMMENT ON COLUMN users.oauth_access_token IS 'OAuth access token for API calls';
COMMENT ON COLUMN users.oauth_refresh_token IS 'OAuth refresh token for token renewal';

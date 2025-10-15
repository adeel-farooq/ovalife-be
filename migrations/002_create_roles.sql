-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

BEGIN;

-- 1️⃣ Create Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('operation', 'module')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ Create Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ Create Role-Permissions Table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE,
    CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);

-- 4️⃣ Optional: Automatically update updated_at on row change
DO $$
BEGIN
    -- Create a reusable trigger function (idempotent with CREATE OR REPLACE)
    CREATE OR REPLACE FUNCTION update_updated_at_trigger()
    RETURNS trigger AS $func$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_permissions_timestamp'
    ) THEN
        CREATE TRIGGER update_permissions_timestamp
        BEFORE UPDATE ON permissions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_trigger();
    END IF;
END $$;

-- 5️⃣ Clean up old data (safe way)
TRUNCATE TABLE role_permissions, roles, permissions RESTART IDENTITY CASCADE;

-- 6️⃣ Insert Initial Permissions
INSERT INTO permissions (name, title, type)
VALUES
    ('create', 'Create', 'operation'),
    ('notification', 'Notification', 'operation'),
    ('read', 'Read', 'operation'),
    ('update', 'Update', 'operation'),
    ('delete', 'Delete', 'operation'),
    ('view_details', 'View Details', 'operation'),
    ('audit_logs', 'Audit Logs', 'operation'),
    ('export', 'Export', 'operation'),
    ('dry_run_rule', 'Dry Run Rule', 'operation'),
    ('duplicate_rule', 'Duplicate Rule', 'operation'),
    ('restore', 'Restore', 'operation'),
    ('bulk_edit_rule', 'Bulk Edit Rule', 'operation'),
    ('update_profile', 'Update Profile', 'operation'),
    ('change_alert_status', 'Change Alert Status', 'operation'),

    ('dashboard', 'Dashboard', 'module'),
    ('rule_builder', 'Rule Builder', 'module'),
    ('alert_inbox', 'Alert Inbox', 'module'),
    ('sanctions', 'Sanctions', 'module'),
    ('transactions', 'Transactions', 'module'),
    ('roles', 'Roles', 'module'),
    ('api_client', 'API Client', 'module'),
    ('client_management', 'Client Management', 'module');

-- 7️⃣ Insert Super Admin Role
INSERT INTO roles (id, role_name, description)
VALUES (
    '11111111-2222-3333-4444-555555555555',
    'super_admin',
    'System-wide access with full privileges'
)
ON CONFLICT (role_name) DO NOTHING;

-- 8️⃣ Assign All Permissions to Super Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    '11111111-2222-3333-4444-555555555555',
    p.id
FROM permissions p
WHERE NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = '11111111-2222-3333-4444-555555555555'
      AND rp.permission_id = p.id
);

-- 9️⃣ Add Helpful Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions (role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions (permission_id);

COMMIT;

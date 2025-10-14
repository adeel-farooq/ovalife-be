CREATE TABLE
    IF NOT EXISTS permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        role_name TEXT UNIQUE NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS role_permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        role_id UUID NOT NULL,
        permission_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
        CONSTRAINT fk_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE,
        CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
    );

-- Insert initial permission rows
INSERT INTO
    permissions (
        id,
        name,
        title,
        type,
        is_active,
        created_at,
        updated_at
    )
VALUES
    -- Operation Permissions
    (
        gen_random_uuid (),
        'create',
        'Create',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'notification',
        'Notification',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'read',
        'Read',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'update',
        'Update',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'delete',
        'Delete',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'view_details',
        'View Details',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'audit_logs',
        'Audit Logs',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'export',
        'Export',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'dry_run_rule',
        'Dry Run Rule',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'duplicate_rule',
        'Duplicate Rule',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'restore',
        'Restore',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'bulk_edit_rule',
        'Bulk Edit Rule',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'update_profile',
        'Update Profile',
        'operation',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'change_alert_status',
        'Change Alert Status',
        'operation',
        true,
        now (),
        now ()
    ),
    -- Module Permissions
    (
        gen_random_uuid (),
        'dashboard',
        'Dashboard',
        'module',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'rule_builder',
        'Rule Builder',
        'module',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'alert_inbox',
        'Alert Inbox',
        'module',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'sanctions',
        'Sanctions',
        'module',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'transactions',
        'Transactions',
        'module',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'roles',
        'Roles',
        'module',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'api_client',
        'API Client',
        'module',
        true,
        now (),
        now ()
    ),
    (
        gen_random_uuid (),
        'client_management',
        'Client Management',
        'module',
        true,
        now (),
        now ()
    );

INSERT INTO
    public.roles (
        id,
        role_name,
        description,
        is_active,
        created_at,
        updated_at
    )
VALUES
    (
        '11111111-2222-3333-4444-555555555555',
        'super_admin',
        'System-wide access with full privileges',
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO
    role_permissions (id, role_id, permission_id, created_at)
SELECT
    gen_random_uuid (),
    '11111111-2222-3333-4444-555555555555', -- Super Admin role_id
    p.id,
    NOW ()
FROM
    permissions p
WHERE
    p.id NOT IN (
        SELECT
            permission_id
        FROM
            role_permissions
        WHERE
            role_id = '11111111-2222-3333-4444-555555555555'
    );
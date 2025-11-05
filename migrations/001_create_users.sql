CREATE TABLE
    IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        is_archived BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_by TEXT,
        updated_by TEXT
    );

CREATE TABLE
    IF NOT EXISTS attribute_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'blood_type'
        label VARCHAR(100), -- Optional: UI label
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE
    );

CREATE TABLE
    IF NOT EXISTS attribute_values (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        attribute_type_id UUID NOT NULL REFERENCES attribute_types (id),
        value VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE
    );

-- Attribute Types Seed Data
INSERT INTO
    attribute_types (id, name, label)
VALUES
    (gen_random_uuid (), 'blood_type', 'Blood Type'),
    (gen_random_uuid (), 'ethnicity', 'Ethnicity'),
    (gen_random_uuid (), 'eye_color', 'Eye Color'),
    (gen_random_uuid (), 'hair_color', 'Hair Color'),
    (gen_random_uuid (), 'height', 'Height'),
    (gen_random_uuid (), 'body_type', 'Body Type'),
    (gen_random_uuid (), 'education', 'Education'),
    (gen_random_uuid (), 'occupation', 'Occupation') ON CONFLICT (name) DO NOTHING;

DELETE FROM attribute_values;

-- Blood Type
INSERT INTO
    attribute_values (attribute_type_id, value, created_by)
VALUES
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'blood_type'
        ),
        'A+',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'blood_type'
        ),
        'A-',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'blood_type'
        ),
        'B+',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'blood_type'
        ),
        'B-',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'blood_type'
        ),
        'AB+',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'blood_type'
        ),
        'AB-',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'blood_type'
        ),
        'O+',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'blood_type'
        ),
        'O-',
        'system'
    );

-- Ethnicity
INSERT INTO
    attribute_values (attribute_type_id, value, created_by)
VALUES
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'ethnicity'
        ),
        'South Asian',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'ethnicity'
        ),
        'Middle Eastern',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'ethnicity'
        ),
        'East Asian',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'ethnicity'
        ),
        'African',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'ethnicity'
        ),
        'Caucasian',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'ethnicity'
        ),
        'Latino',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'ethnicity'
        ),
        'Indigenous',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'ethnicity'
        ),
        'Other',
        'system'
    );

-- Eye Color
INSERT INTO
    attribute_values (attribute_type_id, value, created_by)
VALUES
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'eye_color'
        ),
        'Brown',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'eye_color'
        ),
        'Hazel',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'eye_color'
        ),
        'Green',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'eye_color'
        ),
        'Blue',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'eye_color'
        ),
        'Gray',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'eye_color'
        ),
        'Amber',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'eye_color'
        ),
        'Other',
        'system'
    );

-- Hair Color
INSERT INTO
    attribute_values (attribute_type_id, value, created_by)
VALUES
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'Black',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'Brown',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'Blonde',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'Red',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'Gray',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'White',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'Bald',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'Dyed',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'hair_color'
        ),
        'Other',
        'system'
    );

-- Height (in cm ranges)
INSERT INTO
    attribute_values (attribute_type_id, value, created_by)
VALUES
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'height'
        ),
        '150-159',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'height'
        ),
        '160-169',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'height'
        ),
        '170-179',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'height'
        ),
        '180-189',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'height'
        ),
        '190+',
        'system'
    );

-- Body Type
INSERT INTO
    attribute_values (attribute_type_id, value, created_by)
VALUES
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'body_type'
        ),
        'Slim',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'body_type'
        ),
        'Athletic',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'body_type'
        ),
        'Average',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'body_type'
        ),
        'Heavy',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'body_type'
        ),
        'Other',
        'system'
    );

-- Education
INSERT INTO
    attribute_values (attribute_type_id, value, created_by)
VALUES
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'education'
        ),
        'High School',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'education'
        ),
        'Diploma',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'education'
        ),
        'Bachelor’s',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'education'
        ),
        'Master’s',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'education'
        ),
        'PhD',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'education'
        ),
        'Other',
        'system'
    );

-- Occupation
INSERT INTO
    attribute_values (attribute_type_id, value, created_by)
VALUES
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'occupation'
        ),
        'Backend Developer',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'occupation'
        ),
        'Frontend Developer',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'occupation'
        ),
        'Designer',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'occupation'
        ),
        'Product Manager',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'occupation'
        ),
        'QA Engineer',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'occupation'
        ),
        'DevOps Engineer',
        'system'
    ),
    (
        (
            SELECT
                id
            FROM
                attribute_types
            WHERE
                name = 'occupation'
        ),
        'Other',
        'system'
    );

-- Add more in users table as needed
ALTER TABLE users
ADD COLUMN IF NOT EXISTS mobile TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_password_token TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP;
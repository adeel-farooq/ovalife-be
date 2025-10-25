CREATE TABLE
    IF NOT EXISTS contact_information (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        address_line_1 TEXT NOT NULL,
        address_line_2 TEXT,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        country TEXT NOT NULL,
        phone_country_code TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        consent_to_messages BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            created_by TEXT,
            updated_by TEXT,
            is_active BOOLEAN DEFAULT TRUE
    );

CREATE TABLE
    IF NOT EXISTS physical_characteristics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES users (id),
        subject_type TEXT NOT NULL DEFAULT 'self',
        ethnicity TEXT,
        hair_color TEXT,
        eye_color TEXT,
        skin_tone TEXT,
        height NUMERIC(5, 2),
        weight NUMERIC(5, 2),
        blood_type TEXT,
        profile_image_path TEXT,
        interest_sharing BOOLEAN,
        egg_cycle_preference TEXT,
        pre_genetic_test BOOLEAN,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            created_by TEXT,
            updated_by TEXT,
            is_active BOOLEAN DEFAULT TRUE
    );

alter table contact_information
add column if not exists user_id UUID REFERENCES users (id);

alter table physical_characteristics
add column if not exists user_id UUID REFERENCES users (id);

CREATE TABLE
    IF NOT EXISTS user_filters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        donor_code VARCHAR(36) UNIQUE NOT NULL,
        race VARCHAR(36),
        user_id UUID REFERENCES users (id),
        hair_color VARCHAR(36),
        eye_color VARCHAR(36),
        education_level VARCHAR(100),
        height_cm DECIMAL(5, 2),
        blood_type VARCHAR(10),
        identification VARCHAR(50),
        available_for_fresh_cycles BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            created_by TEXT,
            updated_by TEXT,
            is_active BOOLEAN DEFAULT TRUE
    );

CREATE INDEX if not exists idx_ethnicity ON physical_characteristics (ethnicity);

CREATE INDEX if not exists idx_hair_color ON physical_characteristics (hair_color);

CREATE INDEX if not exists idx_eye_color ON physical_characteristics (eye_color);

CREATE INDEX if not exists idx_skin_tone ON physical_characteristics (skin_tone);

CREATE INDEX if not exists idx_blood_type ON physical_characteristics (blood_type);

CREATE INDEX if not exists idx_created_at ON physical_characteristics (created_at DESC);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS type VARCHAR(50),
ADD COLUMN IF NOT EXISTS job_title VARCHAR(50);
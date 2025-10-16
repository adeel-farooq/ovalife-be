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
CREATE TABLE
  IF NOT EXISTS questionnaires (
    id uuid PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_publish BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by varchar,
    updated_by varchar
  );

CREATE TABLE
  IF NOT EXISTS sections (
    id uuid PRIMARY KEY,
    questionnaire_id uuid REFERENCES questionnaires (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
  );

CREATE TABLE
  IF NOT EXISTS pages (
    id uuid PRIMARY KEY,
    section_id uuid REFERENCES sections (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tools JSONB, -- optional: store tool definitions as JSON
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
  );
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  headline TEXT,
  education JSONB,
  skills JSONB NOT NULL,
  projects JSONB NOT NULL,
  links JSONB,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_profiles_projects ON profiles USING GIN (projects);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

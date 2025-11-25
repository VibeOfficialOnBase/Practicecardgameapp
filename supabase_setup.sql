/*
  Supabase Schema Setup Script

  To run this:
  1. Go to your Supabase Dashboard -> SQL Editor.
  2. Paste the content of this file.
  3. Run the script.
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE,
  username TEXT,
  profile_image_url TEXT,
  -- Add auth.users linkage for security if using Supabase Auth
  auth_id UUID REFERENCES auth.users(id)
);

-- Table: practices
CREATE TABLE IF NOT EXISTS practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT, -- journaling, mood, breathwork, chakra, etc
  content TEXT,
  mood_value INT,
  emotion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: tarot_pulls
CREATE TABLE IF NOT EXISTS tarot_pulls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  card_name TEXT,
  card_meaning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: vibagotchi
CREATE TABLE IF NOT EXISTS vibagotchi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level INT DEFAULT 1,
  energy INT DEFAULT 100,
  happiness INT DEFAULT 100,
  evolution_stage TEXT DEFAULT 'Spark',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: global_pulse
CREATE TABLE IF NOT EXISTS global_pulse (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_practices INT DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: wallet_connections
CREATE TABLE IF NOT EXISTS wallet_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wallet_address TEXT,
  project TEXT -- "AlgoLeagues" or "VibeOfficial"
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_pulls ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibagotchi ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;

-- Policies (Basic example - adjust for production)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can view own practices" ON practices FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Users can insert own practices" ON practices FOR INSERT WITH CHECK (true); -- Needs refinement to enforce user_id

-- Trigger for Global Pulse update on Practice insert
CREATE OR REPLACE FUNCTION update_global_pulse()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE global_pulse SET total_practices = total_practices + 1, last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_practice_created
AFTER INSERT ON practices
FOR EACH ROW EXECUTE FUNCTION update_global_pulse();

-- Initial Seed for Global Pulse
INSERT INTO global_pulse (total_practices) SELECT 0 WHERE NOT EXISTS (SELECT 1 FROM global_pulse);

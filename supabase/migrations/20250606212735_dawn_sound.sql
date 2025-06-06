/*
  # User Profiles Schema

  1. New Tables
    - `user_profiles`
      - Comprehensive user profile data
      - JSON fields for flexible data storage
      - Tracks completion status and timestamps

  2. Security
    - Enable RLS on user_profiles table
    - Users can only access their own profiles
    - Admins can view all profiles
*/

-- User Profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  personal_info jsonb,
  education jsonb,
  experience jsonb,
  technical_skills jsonb,
  soft_skills jsonb,
  self_assessment jsonb,
  certifications jsonb,
  goals jsonb,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can manage their own profile"
  ON user_profiles
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_completed_at ON user_profiles(completed_at);
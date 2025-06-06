/*
  # Assessment System Schema

  1. New Tables
    - `assessments`
      - Core assessment information and settings
      - Tracks title, description, time limits, etc.
    - `questions`
      - Question bank for all assessments
      - Supports multiple question types and metadata
    - `assessment_questions`
      - Links questions to assessments
      - Tracks question order and points
    - `user_assessments`
      - Tracks user attempts and progress
      - Stores completion status and scores
    - `user_responses`
      - Records user answers for each question
      - Enables progress saving and review

  2. Security
    - Enable RLS on all tables
    - Admins can manage all content
    - Users can only access permitted assessments
    - Users can only view their own responses
*/

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructions text,
  time_limit_minutes integer,
  passing_score integer,
  attempts_allowed integer DEFAULT 1,
  randomize_questions boolean DEFAULT false,
  is_published boolean DEFAULT false,
  start_date timestamptz,
  end_date timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
  options jsonb,
  correct_answer text,
  explanation text,
  category text,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessment Questions junction table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  points integer DEFAULT 1,
  question_order integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(assessment_id, question_id)
);

-- User Assessments table
CREATE TABLE IF NOT EXISTS user_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  score integer,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Responses table
CREATE TABLE IF NOT EXISTS user_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_assessment_id uuid REFERENCES user_assessments(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  response text,
  is_correct boolean,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- Policies for assessments
CREATE POLICY "Admins can manage all assessments"
  ON assessments
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view published assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (is_published = true OR created_by = auth.uid());

-- Policies for questions
CREATE POLICY "Admins can manage all questions"
  ON questions
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view questions in their assessments"
  ON questions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM assessment_questions aq
    JOIN user_assessments ua ON ua.assessment_id = aq.assessment_id
    WHERE aq.question_id = questions.id
    AND ua.user_id = auth.uid()
  ));

-- Policies for assessment questions
CREATE POLICY "Admins can manage assessment questions"
  ON assessment_questions
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view assessment questions"
  ON assessment_questions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_assessments ua
    WHERE ua.assessment_id = assessment_questions.assessment_id
    AND ua.user_id = auth.uid()
  ));

-- Policies for user assessments
CREATE POLICY "Users can manage their own assessments"
  ON user_assessments
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all user assessments"
  ON user_assessments
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for user responses
CREATE POLICY "Users can manage their own responses"
  ON user_responses
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_assessments ua
    WHERE ua.id = user_responses.user_assessment_id
    AND ua.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_assessments ua
    WHERE ua.id = user_responses.user_assessment_id
    AND ua.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all user responses"
  ON user_responses
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
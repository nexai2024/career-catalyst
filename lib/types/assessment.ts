export interface Assessment {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  time_limit_minutes?: number;
  passing_score?: number;
  attempts_allowed: number;
  randomize_questions: boolean;
  is_published: boolean;
  start_date?: string;
  end_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: {
    choices: string[];
  };
  correct_answer?: string;
  explanation?: string;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_id: string;
  points: number;
  question_order: number;
  question?: Question;
}

export interface UserAssessment {
  id: string;
  user_id: string;
  assessment_id: string;
  start_time: string;
  end_time?: string;
  score?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: string;
  user_assessment_id: string;
  question_id: string;
  response: string;
  is_correct?: boolean;
  points_earned: number;
  created_at: string;
  updated_at: string;
}
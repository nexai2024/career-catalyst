export type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  currentPosition?: string;
  location?: string;
  bio?: string;
  careerGoals?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  id: string;
  user_id?: string;
  personal_info?: any;
  education?: any;
  experience?: any;
  technical_skills?: any;
  soft_skills?: any;
  self_assessment?: any;
  certifications?: any;
  goals?: any;
  completed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
};
export type UserMetadata = {
  profile_completed?: boolean;
  profile_completion_date?: Date;
  last_login?: Date;
  preferences?: any;
};
export type Profile = {
    id: string;
    user_id: string;
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
    achievements?: string[];
    created_at?: Date;
    updated_at?: Date;
}
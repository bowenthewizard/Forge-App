import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching our database schema
export type WorkoutSession = {
  id: string;
  user_id: string;
  name: string;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  total_volume_lbs: number;
  created_at: string;
};

export type WorkoutSet = {
  id: string;
  workout_session_id: string;
  exercise_name: string;
  equipment_type: string;
  set_number: number;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  created_at: string;
};

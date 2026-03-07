export interface Mountain {
  id: string;
  name: string;
  height: number;
  country: string;
  pointsRequired: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  pointsPerHour: number;
  color: string;
}

export interface TimeSession {
  id: string;
  user_id: string;
  activity_id: string;
  start_time: string;
  end_time: string | null;
  duration: number;
  points: number;
  created_at: string;
}

export interface UserProgress {
  totalPoints: number;
  currentMountainId: string;
  mountainProgress: number;
  completedMountains: string[];
}



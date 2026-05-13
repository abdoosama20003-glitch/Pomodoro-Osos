// ============================================================
// Core Types for FitForge Fitness Application
// ============================================================

export interface Exercise {
  name: string;
  video: string;
  description?: string;
  sets?: number;
  reps?: string;
  completed?: boolean;
}

export interface WorkoutDay {
  day: string;
  title: string;
  image: string;
  exercises: Exercise[];
}

export interface WorkoutLog {
  date: string; // ISO date string YYYY-MM-DD
  dayIndex: number;
  completedExercises: string[];
  duration?: number; // in seconds
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  date: string;
}

export interface NutritionDay {
  date: string;
  meals: Meal[];
  waterMl: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface DailyHabits {
  date: string;
  workout: boolean;
  walking: boolean;
  sleep: boolean;
  water: boolean;
  healthyMeals: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  currentWeight: number; // kg
  targetWeight: number; // kg
  equipment: string;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  waterGoal: number; // ml
}

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  notifications: boolean;
}

export interface TimerState {
  isRunning: boolean;
  elapsed: number; // seconds
  isFloating: boolean;
}

export interface WeeklyStats {
  workoutsCompleted: number;
  totalWorkouts: number;
  caloriesAvg: number;
  waterAvg: number;
  habitsCompleted: number;
  totalHabits: number;
  weightChange: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'weight' | 'workout' | 'nutrition' | 'habit';
}

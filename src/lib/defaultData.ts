import { WorkoutDay, UserProfile, AppSettings, Goal } from "./types";

export const defaultWorkoutDays: WorkoutDay[] = [
  {
    day: "Day 1",
    title: "Chest + Core",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop",
    exercises: [
      {
        name: "Push-ups",
        video: "https://www.youtube.com/results?search_query=push+up+proper+form",
        description: "A classic exercise for chest, shoulders, and triceps.",
        sets: 3,
        reps: "12-15",
      },
      {
        name: "Dumbbell Floor Press",
        video:
          "https://www.youtube.com/results?search_query=dumbbell+floor+press+exercise",
        description: "Great for building chest strength with reduced shoulder strain.",
        sets: 4,
        reps: "10-12",
      },
      {
        name: "Dumbbell Fly",
        video:
          "https://www.youtube.com/results?search_query=dumbbell+fly+exercise",
        description: "Isolates the chest muscles for a better stretch and contraction.",
        sets: 3,
        reps: "12",
      },
    ],
  },
  {
    day: "Day 2",
    title: "Legs + Cardio",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop",
    exercises: [
      {
        name: "Squats",
        video: "https://www.youtube.com/results?search_query=squat+proper+form",
        description: "The king of leg exercises, targeting quads, hamstrings, and glutes.",
        sets: 4,
        reps: "15",
      },
      {
        name: "Goblet Squat",
        video:
          "https://www.youtube.com/results?search_query=goblet+squat+exercise",
        description: "A squat variation holding a weight at chest level.",
        sets: 3,
        reps: "12",
      },
      {
        name: "Lunges",
        video: "https://www.youtube.com/results?search_query=lunge+exercise",
        description: "Unilateral leg exercise for balance and strength.",
        sets: 3,
        reps: "10 per leg",
      },
    ],
  },
  {
    day: "Day 3",
    title: "Recovery",
    image:
      "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=1600&auto=format&fit=crop",
    exercises: [
      {
        name: "Stretching",
        video:
          "https://www.youtube.com/results?search_query=full+body+stretching+routine",
        description: "Full body static stretching to improve flexibility.",
        sets: 1,
        reps: "15 mins",
      },
      {
        name: "Mobility",
        video:
          "https://www.youtube.com/results?search_query=mobility+exercise+routine",
        description: "Dynamic movements to improve joint health.",
        sets: 1,
        reps: "15 mins",
      },
    ],
  },
  {
    day: "Day 4",
    title: "Back + Arms",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1600&auto=format&fit=crop",
    exercises: [
      {
        name: "One Arm Row",
        video:
          "https://www.youtube.com/results?search_query=one+arm+dumbbell+row",
        description: "Excellent for lat development and back thickness.",
        sets: 4,
        reps: "10-12 per arm",
      },
      {
        name: "Bicep Curl",
        video:
          "https://www.youtube.com/results?search_query=bicep+curl+exercise",
        description: "Classic isolation exercise for the biceps.",
        sets: 3,
        reps: "12-15",
      },
      {
        name: "Hammer Curl",
        video:
          "https://www.youtube.com/results?search_query=hammer+curl+exercise",
        description: "Targets the brachialis for thicker looking arms.",
        sets: 3,
        reps: "12",
      },
    ],
  },
];

export const defaultUserProfile: UserProfile = {
  name: "Athlete",
  age: 25,
  height: 180,
  currentWeight: 75,
  targetWeight: 70,
  equipment: "Dumbbells",
  calorieGoal: 2500,
  proteinGoal: 160,
  carbsGoal: 250,
  fatsGoal: 70,
  waterGoal: 3000,
};

export const defaultSettings: AppSettings = {
  darkMode: true,
  soundEnabled: true,
  notifications: false,
};

export const defaultGoals: Goal[] = [
  {
    id: "g1",
    title: "Drink 3L Water",
    target: 3000,
    current: 0,
    unit: "ml",
    deadline: new Date().toISOString(),
    category: "nutrition"
  },
  {
    id: "g2",
    title: "Workout 4x Week",
    target: 4,
    current: 0,
    unit: "days",
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    category: "workout"
  }
];

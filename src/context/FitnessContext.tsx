"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  UserProfile,
  AppSettings,
  WorkoutLog,
  NutritionDay,
  WeightEntry,
  DailyHabits,
  Goal,
} from "@/lib/types";
import { defaultUserProfile, defaultSettings, defaultGoals } from "@/lib/defaultData";
import { safeLocalStorageGet, safeLocalStorageSet, formatDate } from "@/lib/utils";

interface FitnessContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  workoutLogs: WorkoutLog[];
  logWorkout: (log: WorkoutLog) => void;
  nutritionDays: Record<string, NutritionDay>;
  updateNutrition: (date: string, updates: Partial<NutritionDay>) => void;
  weightHistory: WeightEntry[];
  logWeight: (entry: WeightEntry) => void;
  removeWeight: (date: string) => void;
  habits: Record<string, DailyHabits>;
  updateHabit: (date: string, key: keyof Omit<DailyHabits, 'date'>, value: boolean) => void;
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  isMounted: boolean;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export function FitnessProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // State
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [nutritionDays, setNutritionDays] = useState<Record<string, NutritionDay>>({});
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [habits, setHabits] = useState<Record<string, DailyHabits>>({});
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);

  // Load from localStorage on mount
  useEffect(() => {
    setProfile(safeLocalStorageGet("fitforge_profile", defaultUserProfile));
    setSettings(safeLocalStorageGet("fitforge_settings", defaultSettings));
    setWorkoutLogs(safeLocalStorageGet("fitforge_workouts", []));
    setNutritionDays(safeLocalStorageGet("fitforge_nutrition", {}));
    setWeightHistory(safeLocalStorageGet("fitforge_weight", []));
    setHabits(safeLocalStorageGet("fitforge_habits", {}));
    setGoals(safeLocalStorageGet("fitforge_goals", defaultGoals));
    setIsMounted(true);
  }, []);

  // Save to localStorage when state changes (after mount)
  useEffect(() => {
    if (!isMounted) return;
    safeLocalStorageSet("fitforge_profile", profile);
  }, [profile, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    safeLocalStorageSet("fitforge_settings", settings);
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    safeLocalStorageSet("fitforge_workouts", workoutLogs);
  }, [workoutLogs, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    safeLocalStorageSet("fitforge_nutrition", nutritionDays);
  }, [nutritionDays, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    safeLocalStorageSet("fitforge_weight", weightHistory);
  }, [weightHistory, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    safeLocalStorageSet("fitforge_habits", habits);
  }, [habits, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    safeLocalStorageSet("fitforge_goals", goals);
  }, [goals, isMounted]);

  // Actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const logWorkout = (log: WorkoutLog) => {
    setWorkoutLogs((prev) => {
      // Replace if same date and dayIndex, otherwise add
      const existingIndex = prev.findIndex(
        (w) => w.date === log.date && w.dayIndex === log.dayIndex
      );
      if (existingIndex >= 0) {
        const newLogs = [...prev];
        newLogs[existingIndex] = log;
        return newLogs;
      }
      return [...prev, log];
    });
  };

  const updateNutrition = (date: string, updates: Partial<NutritionDay>) => {
    setNutritionDays((prev) => {
      const current = prev[date] || { date, meals: [], waterMl: 0 };
      return {
        ...prev,
        [date]: { ...current, ...updates },
      };
    });
  };

  const logWeight = (entry: WeightEntry) => {
    setWeightHistory((prev) => {
      // Update existing date or add new
      const filtered = prev.filter((w) => w.date !== entry.date);
      return [...filtered, entry].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
    // Also update profile current weight
    updateProfile({ currentWeight: entry.weight });
  };

  const removeWeight = (date: string) => {
    setWeightHistory((prev) => {
      const filtered = prev.filter((w) => w.date !== date);
      // Update profile current weight to the last entry if exists
      if (filtered.length > 0) {
        updateProfile({ currentWeight: filtered[filtered.length - 1].weight });
      }
      return filtered;
    });
  };

  const updateHabit = (
    date: string,
    key: keyof Omit<DailyHabits, "date">,
    value: boolean
  ) => {
    setHabits((prev) => {
      const current = prev[date] || {
        date,
        workout: false,
        walking: false,
        sleep: false,
        water: false,
        healthyMeals: false,
      };
      return {
        ...prev,
        [date]: { ...current, [key]: value },
      };
    });
  };

  const addGoal = (goal: Goal) => {
    setGoals((prev) => [...prev, goal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <FitnessContext.Provider
      value={{
        profile,
        updateProfile,
        settings,
        updateSettings,
        workoutLogs,
        logWorkout,
        nutritionDays,
        updateNutrition,
        weightHistory,
        logWeight,
        removeWeight,
        habits,
        updateHabit,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        isMounted,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error("useFitness must be used within a FitnessProvider");
  }
  return context;
}

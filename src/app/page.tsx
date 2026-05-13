"use client";

import { useFitness } from "@/context/FitnessContext";
import { motion } from "framer-motion";
import { Droplet, Flame, Target, Trophy, TrendingUp, Calendar, Scale } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const { profile, nutritionDays, workoutLogs, weightHistory, habits } = useFitness();
  const today = formatDate();

  // Current stats calculations
  const todayNutrition = nutritionDays[today] || { meals: [], waterMl: 0 };
  const caloriesConsumed = todayNutrition.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const waterPercentage = Math.min(100, Math.round((todayNutrition.waterMl / profile.waterGoal) * 100));
  
  const todayHabits = habits[today] || {
    workout: false, walking: false, sleep: false, water: false, healthyMeals: false
  };
  const habitsCompleted = Object.values(todayHabits).filter(v => v === true).length;
  // Exclude date key
  const totalHabits = 5; 
  const habitsPercentage = Math.round((habitsCompleted / totalHabits) * 100);

  // Weekly workout completion
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const weeklyWorkouts = workoutLogs.filter(w => new Date(w.date) >= thisWeekStart).length;
  
  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : profile.currentWeight;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="p-6 md:p-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <p className="uppercase tracking-[0.4em] text-cyan-400 text-sm font-semibold mb-2">
            Overview
          </p>
          <h1 className="text-4xl md:text-5xl font-black">
            Welcome back, <span className="text-cyan-400">{profile.name}</span>
          </h1>
          <p className="text-slate-400 mt-2">Let's crush your goals today.</p>
        </div>
        
        <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-4 border-l-4 border-l-cyan-400">
          <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Active Streak</p>
            <h3 className="text-2xl font-bold">{weeklyWorkouts} Days</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* Calories Card */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-slate-400 text-sm">Today</span>
          </div>
          <h3 className="text-3xl font-black">{caloriesConsumed}</h3>
          <div className="flex items-center justify-between mt-1 mb-4">
            <p className="text-slate-400">/ {profile.calorieGoal} kcal</p>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (caloriesConsumed / profile.calorieGoal) * 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Water Card */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
              <Droplet className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-slate-400 text-sm">Today</span>
          </div>
          <h3 className="text-3xl font-black">{todayNutrition.waterMl}</h3>
          <div className="flex items-center justify-between mt-1 mb-4">
            <p className="text-slate-400">/ {profile.waterGoal} ml</p>
            <span className="text-blue-400 text-sm font-bold">{waterPercentage}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${waterPercentage}%` }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Weight Card */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-500/20">
              <Scale className="w-6 h-6 text-violet-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>On Track</span>
            </div>
          </div>
          <h3 className="text-3xl font-black">{currentWeight} <span className="text-xl text-slate-400 font-medium">kg</span></h3>
          <div className="mt-1">
            <p className="text-slate-400">Target: {profile.targetWeight} kg</p>
          </div>
          <Link href="/weight" className="mt-4 block text-center py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors border border-white/5">
            Log Weight
          </Link>
        </motion.div>

        {/* Habits Card */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/20">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-slate-400 text-sm">Daily Habits</span>
          </div>
          <h3 className="text-3xl font-black">{habitsCompleted}/{totalHabits}</h3>
          <div className="flex items-center justify-between mt-1 mb-4">
            <p className="text-slate-400">Completed</p>
            <span className="text-cyan-400 text-sm font-bold">{habitsPercentage}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${habitsPercentage}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions / Today's Plan */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Today's Focus</h2>
            <Link href="/workouts" className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">
              View Plan →
            </Link>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden min-h-[240px] group cursor-pointer border border-white/10">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  Day 1
                </span>
                <span className="flex items-center text-xs font-medium text-slate-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  3 Exercises
                </span>
              </div>
              <h3 className="text-3xl font-black mb-1">Chest + Core</h3>
              <p className="text-slate-300 text-sm max-w-md">Focus on upper body strength and core stability. Complete all sets to maintain your streak.</p>
              
              <div className="mt-4 flex gap-3">
                <Link href="/workouts" className="bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-cyan-400/20">
                  Start Workout
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="uppercase tracking-[0.2em] text-violet-400 text-xs font-bold mb-4">
              Daily Motivation
            </p>
            <h3 className="text-2xl font-bold leading-snug mb-6">
              "The only bad workout is the one that didn't happen."
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10"></div>
              <div>
                <p className="font-semibold text-sm">Coach Mike</p>
                <p className="text-xs text-slate-400">Head Trainer</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

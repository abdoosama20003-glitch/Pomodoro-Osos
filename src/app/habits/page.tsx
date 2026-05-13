"use client";

import { useFitness } from "@/context/FitnessContext";
import { formatDate } from "@/lib/utils";
import { 
  CheckCircle2, Circle, Dumbbell, Footprints, 
  Moon, Droplets, Apple 
} from "lucide-react";
import { motion } from "framer-motion";

export default function HabitsPage() {
  const { habits, updateHabit } = useFitness();
  const today = formatDate();
  const todayHabits = habits[today] || {
    workout: false,
    walking: false,
    sleep: false,
    water: false,
    healthyMeals: false,
  };

  const habitList = [
    {
      id: "workout",
      title: "Daily Workout",
      desc: "Complete your scheduled training",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200&h=200",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/20"
    },
    {
      id: "walking",
      title: "10,000 Steps",
      desc: "Stay active throughout the day",
      image: "https://images.unsplash.com/photo-1552674605-15c213624dc4?auto=format&fit=crop&q=80&w=200&h=200",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      id: "sleep",
      title: "8 Hours Sleep",
      desc: "Proper recovery for muscle growth",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=200&h=200",
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      border: "border-violet-400/20"
    },
    {
      id: "water",
      title: "Hydration Goal",
      desc: "Drink 3L+ of water daily",
      image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=200&h=200",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      id: "healthyMeals",
      title: "Clean Eating",
      desc: "Hit your protein & calorie goals",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=200&h=200",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20"
    }
  ];

  const completedCount = Object.values(todayHabits).filter(v => v === true).length;
  // exclude date key
  const totalCount = habitList.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <p className="uppercase tracking-[0.4em] text-emerald-400 text-sm font-semibold mb-2">
          Discipline
        </p>
        <h1 className="text-4xl md:text-5xl font-black">
          Daily <span className="text-emerald-400">Habits</span>
        </h1>
      </div>

      <div className="glass-card rounded-3xl p-8 mb-10 border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Today's Progress</h2>
            <p className="text-slate-400 max-w-md">
              Consistency is key. Check off your daily habits to build a strong foundation for your fitness journey.
            </p>
          </div>
          
          <div className="w-32 h-32 relative shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="64" cy="64" r="56" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="12" fill="none" 
              />
              <motion.circle 
                cx="64" cy="64" r="56" 
                stroke="#10b981" 
                strokeWidth="12" fill="none"
                strokeDasharray="351.8" /* 2 * pi * 56 */
                initial={{ strokeDashoffset: 351.8 }}
                animate={{ strokeDashoffset: 351.8 - (351.8 * progressPercentage) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-black">{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habitList.map((habit, index) => {
          const isCompleted = todayHabits[habit.id as keyof typeof todayHabits];
          
          return (
            <motion.div 
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => updateHabit(today, habit.id as any, !isCompleted)}
              className={`cursor-pointer rounded-3xl p-6 flex items-center gap-6 transition-all duration-300 border ${
                isCompleted 
                  ? 'bg-white/10 border-white/20 shadow-lg' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 relative ${
                isCompleted ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#060816]' : 'opacity-70 grayscale hover:grayscale-0 hover:opacity-100'
              }`}>
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${habit.image})` }}
                />
                {!isCompleted && <div className="absolute inset-0 bg-black/40"></div>}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-xl font-bold transition-colors ${isCompleted ? 'text-white' : 'text-slate-300'}`}>
                  {habit.title}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{habit.desc}</p>
              </div>

              <div className="shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <Circle className="w-8 h-8 text-slate-600 group-hover:text-slate-400" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

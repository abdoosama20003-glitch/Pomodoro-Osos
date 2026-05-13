"use client";

import { useState } from "react";
import { CheckCircle2, Circle, PlayCircle, ChevronDown, ChevronUp, Edit2, Plus, Trash2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Stopwatch from "@/components/Stopwatch";
import { useFitness } from "@/context/FitnessContext";
import { Exercise, WorkoutDay } from "@/lib/types";

export default function WorkoutsPage() {
  const { workoutDays, updateWorkoutDays, isMounted } = useFitness();
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  
  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState<WorkoutDay[]>([]);

  if (!isMounted) return null;

  const toggleExercise = (dayIndex: number, exerciseIndex: number) => {
    if (isEditing) return;
    const key = `${dayIndex}-${exerciseIndex}`;
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleEditClick = () => {
    setEditState(JSON.parse(JSON.stringify(workoutDays)));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateWorkoutDays(editState);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const addDay = () => {
    const newDay: WorkoutDay = {
      id: Math.random().toString(),
      day: `Day ${editState.length + 1}`,
      title: "New Workout Day",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop",
      exercises: []
    };
    setEditState([...editState, newDay]);
  };

  const updateDay = (index: number, key: keyof WorkoutDay, value: string) => {
    const newState = [...editState];
    newState[index] = { ...newState[index], [key]: value };
    setEditState(newState);
  };

  const removeDay = (index: number) => {
    const newState = [...editState];
    newState.splice(index, 1);
    setEditState(newState);
  };

  const addExercise = (dayIndex: number) => {
    const newState = [...editState];
    newState[dayIndex].exercises.push({
      id: Math.random().toString(),
      name: "New Exercise",
      video: "",
      description: "",
      sets: "3",
      reps: "10"
    });
    setEditState(newState);
  };

  const updateExercise = (dayIndex: number, exIndex: number, key: keyof Exercise, value: string) => {
    const newState = [...editState];
    newState[dayIndex].exercises[exIndex] = { ...newState[dayIndex].exercises[exIndex], [key]: value };
    setEditState(newState);
  };

  const removeExercise = (dayIndex: number, exIndex: number) => {
    const newState = [...editState];
    newState[dayIndex].exercises.splice(exIndex, 1);
    setEditState(newState);
  };

  const displayDays = isEditing ? editState : workoutDays;

  return (
    <div className="p-6 md:p-10 relative">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="uppercase tracking-[0.4em] text-cyan-400 text-sm font-semibold mb-2">
            Training Plan
          </p>
          <h1 className="text-4xl md:text-5xl font-black">
            Workout <span className="text-cyan-400">Programs</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Complete your daily workouts to maintain your streak. Customize your routine to fit your goals.
          </p>
        </div>
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={handleCancelEdit} className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all">
                <X className="w-5 h-5" /> Cancel
              </button>
              <button onClick={handleSaveEdit} className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-cyan-500/25">
                <Save className="w-5 h-5" /> Save Changes
              </button>
            </>
          ) : (
            <button onClick={handleEditClick} className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all">
              <Edit2 className="w-5 h-5" /> Edit Program
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {displayDays.map((day, dayIndex) => {
          const isExpanded = expandedDay === dayIndex || isEditing;
          
          const totalExercises = day.exercises.length;
          const completedCount = day.exercises.filter((_, i) => completedExercises[`${dayIndex}-${i}`]).length;
          const progressPercentage = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;
          const isDayComplete = progressPercentage === 100 && totalExercises > 0;

          return (
            <motion.div 
              key={dayIndex}
              initial={false}
              className={`rounded-[32px] overflow-hidden border transition-all duration-500 ${
                isExpanded && !isEditing ? 'border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]' : 'border-white/10 glass-card'
              }`}
            >
              <div 
                className="relative cursor-pointer group min-h-[200px] flex flex-col justify-end p-8"
                onClick={() => !isEditing && setExpandedDay(isExpanded ? null : dayIndex)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${day.image})` }}
                ></div>
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isExpanded || isEditing
                    ? 'bg-gradient-to-t from-[#060816] via-[#060816]/90 to-[#060816]/40' 
                    : 'bg-gradient-to-t from-[#060816] via-[#060816]/70 to-[#060816]/20'
                }`}></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
                  {isEditing ? (
                    <div className="w-full space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-between items-center">
                         <input 
                          type="text" 
                          value={day.day}
                          onChange={(e) => updateDay(dayIndex, 'day', e.target.value)}
                          className="bg-white/10 border border-white/20 rounded px-3 py-1 text-cyan-400 font-semibold tracking-[0.2em] uppercase text-sm w-1/3"
                          placeholder="Day Label"
                        />
                        <button onClick={() => removeDay(dayIndex)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm bg-red-400/10 px-3 py-1 rounded">
                          <Trash2 className="w-4 h-4" /> Remove Day
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={day.title}
                        onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-4 py-2 text-3xl font-black w-full text-white"
                        placeholder="Day Title"
                      />
                      <input 
                        type="text" 
                        value={day.image}
                        onChange={(e) => updateDay(dayIndex, 'image', e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-4 py-2 text-sm w-full text-white"
                        placeholder="Background Image URL"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-cyan-400 font-semibold tracking-[0.2em] uppercase text-sm">
                            {day.day}
                          </span>
                          {isDayComplete && (
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold flex items-center border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                            </span>
                          )}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black">{day.title}</h2>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:bg-white/20">
                          {isExpanded ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
                        </div>
                        {progressPercentage > 0 && !isExpanded && (
                          <div className="mt-3 w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {(isExpanded || isEditing) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#060816]/95 backdrop-blur-xl border-t border-white/5"
                  >
                    <div className="p-6 md:p-8 space-y-4">
                      {!isEditing && (
                        <div className="mb-8">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Workout Progress</span>
                            <span className="text-cyan-400 font-bold">{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {day.exercises.map((exercise, i) => {
                        const isCompleted = completedExercises[`${dayIndex}-${i}`];
                        return (
                          <div
                            key={i}
                            className={`rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 border ${
                              isCompleted && !isEditing
                                ? 'bg-cyan-900/10 border-cyan-500/30' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-start md:items-center gap-4 flex-1 w-full">
                              {!isEditing && (
                                <button 
                                  onClick={() => toggleExercise(dayIndex, i)}
                                  className="mt-1 md:mt-0 flex-shrink-0 focus:outline-none"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                                  ) : (
                                    <Circle className="w-8 h-8 text-slate-500 hover:text-cyan-400 transition-colors" />
                                  )}
                                </button>
                              )}

                              <div className="flex-1 space-y-2 w-full">
                                {isEditing ? (
                                  <>
                                    <input 
                                      type="text" 
                                      value={exercise.name}
                                      onChange={(e) => updateExercise(dayIndex, i, 'name', e.target.value)}
                                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-xl font-bold w-full text-white"
                                      placeholder="Exercise Name"
                                    />
                                    <input 
                                      type="text" 
                                      value={exercise.description || ''}
                                      onChange={(e) => updateExercise(dayIndex, i, 'description', e.target.value)}
                                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm w-full text-slate-300"
                                      placeholder="Description"
                                    />
                                    <div className="flex gap-3">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Sets:</span>
                                        <input 
                                          type="text" 
                                          value={exercise.sets || ''}
                                          onChange={(e) => updateExercise(dayIndex, i, 'sets', e.target.value)}
                                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm w-16 text-white"
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Reps:</span>
                                        <input 
                                          type="text" 
                                          value={exercise.reps || ''}
                                          onChange={(e) => updateExercise(dayIndex, i, 'reps', e.target.value)}
                                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm w-24 text-white"
                                        />
                                      </div>
                                    </div>
                                    <input 
                                      type="text" 
                                      value={exercise.video}
                                      onChange={(e) => updateExercise(dayIndex, i, 'video', e.target.value)}
                                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm w-full text-white"
                                      placeholder="Video URL"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <h3 className={`text-xl font-bold ${isCompleted ? 'text-slate-300 line-through decoration-cyan-500/50' : 'text-white'}`}>
                                      {exercise.name}
                                    </h3>
                                    {exercise.description && (
                                      <p className="text-slate-400 text-sm mt-1 mb-3">
                                        {exercise.description}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {exercise.sets && (
                                        <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-slate-300">
                                          {exercise.sets} Sets
                                        </span>
                                      )}
                                      {exercise.reps && (
                                        <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-slate-300">
                                          {exercise.reps} Reps
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {isEditing ? (
                              <button 
                                onClick={() => removeExercise(dayIndex, i)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            ) : (
                              <a
                                href={exercise.video || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#282828] hover:bg-[#3f3f3f] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm flex-shrink-0"
                              >
                                <PlayCircle className="w-5 h-5 text-[#ff0000]" />
                                شرح التمرين
                              </a>
                            )}
                          </div>
                        );
                      })}

                      {isEditing && (
                        <button 
                          onClick={() => addExercise(dayIndex)}
                          className="w-full py-4 border border-dashed border-cyan-400/30 hover:border-cyan-400/60 rounded-2xl flex flex-col items-center justify-center text-cyan-400/60 hover:text-cyan-400 transition-colors bg-cyan-400/5 hover:bg-cyan-400/10"
                        >
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-sm font-semibold">Add Exercise</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {isEditing && (
          <button 
            onClick={addDay}
            className="w-full py-8 border-2 border-dashed border-white/20 hover:border-white/40 rounded-[32px] flex flex-col items-center justify-center text-white/50 hover:text-white transition-colors glass-card"
          >
            <Plus className="w-10 h-10 mb-2" />
            <span className="text-lg font-bold">Add Workout Day</span>
          </button>
        )}
      </div>
      
      {!isEditing && <Stopwatch />}
    </div>
  );
}

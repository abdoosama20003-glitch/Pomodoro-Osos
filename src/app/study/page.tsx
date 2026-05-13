"use client";

import { useState } from "react";
import { BookOpen, Plus, CheckCircle2, Circle, GraduationCap, Library, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
}

export default function StudyPage() {
  const [tasks, setTasks] = useState<StudyTask[]>([
    { id: "1", title: "Read Chapter 4: React Context", subject: "Programming", completed: false },
    { id: "2", title: "Complete Math Assignment", subject: "Mathematics", completed: true },
    { id: "3", title: "Review UI/UX Guidelines", subject: "Design", completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("");

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    setTasks([
      {
        id: Math.random().toString(),
        title: newTaskTitle,
        subject: newTaskSubject || "General",
        completed: false
      },
      ...tasks
    ]);
    setNewTaskTitle("");
    setNewTaskSubject("");
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <p className="uppercase tracking-[0.4em] text-cyan-400 text-sm font-semibold mb-2 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> Academic
        </p>
        <h1 className="text-4xl md:text-5xl font-black">
          Study <span className="text-cyan-400">Tracker</span>
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Manage your study sessions, assignments, and learning goals in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={addTask} className="glass-card p-6 rounded-[32px] border border-white/10 flex flex-col md:flex-row gap-4">
            <input 
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What do you need to study?"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
            <input 
              type="text"
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              placeholder="Subject (e.g. Math)"
              className="w-full md:w-48 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
            <button 
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> Add Task
            </button>
          </form>

          <div className="space-y-4">
            {tasks.map(task => (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-panel p-5 rounded-2xl border flex items-center gap-4 transition-colors ${
                  task.completed ? 'border-cyan-500/30 bg-cyan-900/10' : 'border-white/10'
                }`}
              >
                <button onClick={() => toggleTask(task.id)} className="shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                  ) : (
                    <Circle className="w-7 h-7 text-slate-500 hover:text-cyan-400 transition-colors" />
                  )}
                </button>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-slate-300">
                      {task.subject}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => removeTask(task.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors shrink-0 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                <Library className="w-12 h-12 mb-3 opacity-20" />
                <p>No study tasks yet. Add one above to get started!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[32px] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" /> Study Progress
            </h3>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-5xl font-black text-white">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-slate-400">
              <span>{completedCount} Completed</span>
              <span>{tasks.length - completedCount} Remaining</span>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-[32px] border border-white/10">
            <h3 className="font-bold mb-4">Study Tips</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                <p>Use the Pomodoro timer to maintain focus without burning out.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p>Break large chapters into smaller, manageable tasks.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                <p>Stay hydrated! Drink water during your short breaks.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

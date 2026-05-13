"use client";

import { useState } from "react";
import { useFitness } from "@/context/FitnessContext";
import { Save, User, Activity, Settings2 } from "lucide-react";

export default function SettingsPage() {
  const { profile, updateProfile, settings, updateSettings } = useFitness();
  
  const [formData, setFormData] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'name' || name === 'equipment' ? value : Number(value);
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    updateProfile({ [name]: newValue });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="uppercase tracking-[0.4em] text-slate-400 text-sm font-semibold mb-2">
            Configuration
          </p>
          <h1 className="text-4xl md:text-5xl font-black">
            User <span className="text-white">Settings</span>
          </h1>
        </div>
      </div>

      <div className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Section */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-cyan-400" /> Personal Info
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Age</label>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Height (cm)</label>
                <input 
                  type="number" 
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Current Weight (kg)</label>
                <input 
                  type="number" 
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-violet-400" /> Targets & Goals
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Target Weight (kg)</label>
                <input 
                  type="number" 
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Daily Calories (kcal)</label>
                <input 
                  type="number" 
                  name="calorieGoal"
                  value={formData.calorieGoal}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Daily Protein (g)</label>
                <input 
                  type="number" 
                  name="proteinGoal"
                  value={formData.proteinGoal}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Water Goal (ml)</label>
                <input 
                  type="number" 
                  name="waterGoal"
                  value={formData.waterGoal}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-slate-400" /> Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div>
                  <h4 className="font-bold">Dark Mode</h4>
                  <p className="text-sm text-slate-400">Pure black futuristic theme</p>
                </div>
                <button 
                  type="button"
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${settings.darkMode ? 'bg-cyan-400' : 'bg-slate-700'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div>
                  <h4 className="font-bold">Sound Effects</h4>
                  <p className="text-sm text-slate-400">Timer and completion sounds</p>
                </div>
                <button 
                  type="button"
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-cyan-400' : 'bg-slate-700'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="submit"
              className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
            {saved && (
              <span className="text-emerald-400 font-bold flex items-center gap-2 animate-fade-in">
                Saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

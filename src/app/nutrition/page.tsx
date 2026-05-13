"use client";

import { useState } from "react";
import { useFitness } from "@/context/FitnessContext";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Droplet, Plus, Trash2, Undo2 } from "lucide-react";

export default function NutritionPage() {
  const { profile, nutritionDays, updateNutrition } = useFitness();
  const today = formatDate();
  const todayData = nutritionDays[today] || { meals: [], waterMl: 0 };

  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  const addWater = (amount: number) => {
    updateNutrition(today, { waterMl: todayData.waterMl + amount });
  };

  const addMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName || !calories) return;

    // Pick a random food image for aesthetic purposes based on time
    const foodImages = [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=200&h=200", // salad
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200&h=200", // bowl
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200&h=200", // chicken
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=200&h=200", // pizza/toast
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=200&h=200"  // breakfast
    ];
    
    // basic hash to pick image
    const imageIndex = mealName.length % foodImages.length;
    const selectedImage = foodImages[imageIndex];

    const newMeal = {
      id: Date.now().toString(),
      name: mealName,
      calories: parseInt(calories),
      protein: parseInt(protein) || 0,
      carbs: 0,
      fats: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: today,
      image: selectedImage
    };

    updateNutrition(today, { 
      meals: [...todayData.meals, newMeal] 
    });

    setMealName("");
    setCalories("");
    setProtein("");
  };

  const removeMeal = (id: string) => {
    updateNutrition(today, {
      meals: todayData.meals.filter(m => m.id !== id)
    });
  };

  const removeWater = (amount: number) => {
    updateNutrition(today, { waterMl: Math.max(0, todayData.waterMl - amount) });
  };

  const totalCalories = todayData.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = todayData.meals.reduce((sum, m) => sum + m.protein, 0);
  const waterPercentage = Math.min(100, (todayData.waterMl / profile.waterGoal) * 100);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <p className="uppercase tracking-[0.4em] text-orange-400 text-sm font-semibold mb-2">
          Diet & Hydration
        </p>
        <h1 className="text-4xl md:text-5xl font-black">
          Nutrition <span className="text-orange-400">Tracker</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Panel: Meals */}
        <div className="lg:col-span-2 space-y-8">
          {/* Calorie Overview */}
          <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <h2 className="text-2xl font-bold">Calories Consumed</h2>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-orange-400">{totalCalories}</span>
                  <span className="text-slate-400 font-medium">/ {profile.calorieGoal} kcal</span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-slate-400 text-sm">Remaining</p>
                <p className="text-2xl font-bold text-white">{Math.max(0, profile.calorieGoal - totalCalories)}</p>
              </div>
            </div>

            <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative z-10">
              <motion.div 
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalCalories / profile.calorieGoal) * 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-slate-400 text-sm mb-1">Protein</p>
                <p className="text-xl font-bold">{totalProtein}g <span className="text-xs text-slate-500">/ {profile.proteinGoal}g</span></p>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(100, (totalProtein / profile.proteinGoal) * 100)}%` }}></div>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-slate-400 text-sm mb-1">Carbs</p>
                <p className="text-xl font-bold">-- <span className="text-xs text-slate-500">/ {profile.carbsGoal}g</span></p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-slate-400 text-sm mb-1">Fats</p>
                <p className="text-xl font-bold">-- <span className="text-xs text-slate-500">/ {profile.fatsGoal}g</span></p>
              </div>
            </div>
          </div>

          {/* Add Meal Form & History */}
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Today's Meals
            </h2>

            <form onSubmit={addMeal} className="flex flex-col sm:flex-row gap-4 mb-8">
              <input 
                type="text" 
                placeholder="Meal name (e.g. Chicken Salad)" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                required
              />
              <div className="flex gap-4">
                <input 
                  type="number" 
                  placeholder="Kcal" 
                  className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
                <input 
                  type="number" 
                  placeholder="Protein (g)" 
                  className="w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors hidden sm:block"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
                <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-black p-3 rounded-xl transition-colors font-bold flex items-center justify-center min-w-[3rem]">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {todayData.meals.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border border-dashed border-white/10 rounded-2xl">
                  No meals logged today yet.
                </div>
              ) : (
                todayData.meals.map((meal: any) => (
                  <div key={meal.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group transition-all duration-300 hover:bg-white/10">
                    <div className="flex items-center gap-4">
                      {meal.image ? (
                        <div 
                          className="w-12 h-12 rounded-full bg-cover bg-center shrink-0 border border-white/10"
                          style={{ backgroundImage: `url(${meal.image})` }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=200&h=200" alt="Food" className="w-full h-full rounded-full object-cover opacity-80" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-lg">{meal.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{meal.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-black text-orange-400 text-lg">{meal.calories} kcal</p>
                        {meal.protein > 0 && <p className="text-xs text-slate-300 font-medium">{meal.protein}g protein</p>}
                      </div>
                      <button 
                        onClick={() => removeMeal(meal.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-400/20 rounded-xl transition-all"
                        title="Delete Meal"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Water Tracker */}
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between min-h-[500px]">
          <div className="w-full text-center">
            <h2 className="text-2xl font-bold mb-2">Hydration</h2>
            <p className="text-slate-400 text-sm">Target: {profile.waterGoal / 1000}L per day</p>
          </div>

          {/* Liquid Progress Indicator */}
          <div className="relative w-48 h-48 rounded-full border-4 border-slate-800 p-2 my-8 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
              <Droplet className="w-8 h-8 text-blue-400 mb-1" />
              <span className="text-3xl font-black">{todayData.waterMl}</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">ml</span>
            </div>
            
            <div className="w-full h-full bg-slate-900 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-cyan-400 opacity-80"
                initial={{ height: 0 }}
                animate={{ height: `${waterPercentage}%` }}
                transition={{ duration: 1.5, type: "spring" }}
              >
                {/* CSS Waves (simplified with a flat top for stability) */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-blue-300/30"></div>
              </motion.div>
            </div>
          </div>

          <div className="w-full space-y-3 relative z-10">
            <div className="flex gap-2">
              <button 
                onClick={() => addWater(250)}
                className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Droplet className="w-4 h-4" /> +250ml Glass
              </button>
              <button 
                onClick={() => removeWater(250)}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                title="Undo 250ml"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => addWater(500)}
                className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Droplet className="w-4 h-4" /> +500ml Bottle
              </button>
              <button 
                onClick={() => removeWater(500)}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                title="Undo 500ml"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => addWater(1000)}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 py-3 rounded-xl font-black transition-colors shadow-lg shadow-blue-500/20"
              >
                +1L Large Jug
              </button>
              <button 
                onClick={() => removeWater(1000)}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                title="Undo 1L"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

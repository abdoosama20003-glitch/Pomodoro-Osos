"use client";

import { useState } from "react";
import { useFitness } from "@/context/FitnessContext";
import { formatDate } from "@/lib/utils";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { Scale, TrendingDown, TrendingUp, Minus, Trash2 } from "lucide-react";

export default function WeightPage() {
  const { profile, weightHistory, logWeight, removeWeight } = useFitness();
  const [weightInput, setWeightInput] = useState("");
  const today = formatDate();

  useEffect(() => {
    const sw = localStorage.getItem("fitforge_weight_input");
    if (sw) setWeightInput(sw);
  }, []);

  useEffect(() => {
    localStorage.setItem("fitforge_weight_input", weightInput);
  }, [weightInput]);

  // Create mock data if history is empty for demonstration purposes
  const chartData = weightHistory.length > 0 
    ? weightHistory 
    : [
        { date: "2024-04-01", weight: profile.currentWeight + 2 },
        { date: "2024-04-08", weight: profile.currentWeight + 1.5 },
        { date: "2024-04-15", weight: profile.currentWeight + 0.8 },
        { date: "2024-04-22", weight: profile.currentWeight + 0.3 },
        { date: today, weight: profile.currentWeight },
      ];

  const currentWeight = chartData[chartData.length - 1].weight;
  const previousWeight = chartData.length > 1 ? chartData[chartData.length - 2].weight : currentWeight;
  const weightChange = currentWeight - previousWeight;
  
  const progressToTarget = profile.currentWeight > profile.targetWeight 
    ? ((profile.currentWeight - currentWeight) / (profile.currentWeight - profile.targetWeight)) * 100
    : ((currentWeight - profile.currentWeight) / (profile.targetWeight - profile.currentWeight)) * 100;

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput) return;
    
    logWeight({
      date: today,
      weight: parseFloat(weightInput)
    });
    setWeightInput("");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-xl border border-white/20 shadow-2xl">
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <p className="text-2xl font-black text-violet-400">
            {payload[0].value} <span className="text-sm">kg</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <p className="uppercase tracking-[0.4em] text-violet-400 text-sm font-semibold mb-2">
          Body Analytics
        </p>
        <h1 className="text-4xl md:text-5xl font-black">
          Weight <span className="text-violet-400">Tracker</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Weight */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="flex items-start justify-between mb-2 relative z-10">
            <span className="text-slate-400">Current Weight</span>
            <Scale className="w-5 h-5 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <h2 className="text-5xl font-black">{currentWeight}</h2>
            <span className="text-xl text-slate-400">kg</span>
          </div>
          
          <div className="mt-4 flex items-center gap-2 relative z-10">
            {weightChange < 0 ? (
              <span className="flex items-center text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                <TrendingDown className="w-4 h-4 mr-1" /> {Math.abs(weightChange).toFixed(1)} kg
              </span>
            ) : weightChange > 0 ? (
              <span className="flex items-center text-red-400 text-sm font-bold bg-red-400/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-4 h-4 mr-1" /> +{weightChange.toFixed(1)} kg
              </span>
            ) : (
              <span className="flex items-center text-slate-400 text-sm font-bold bg-white/5 px-2 py-1 rounded-lg">
                <Minus className="w-4 h-4 mr-1" /> No change
              </span>
            )}
            <span className="text-slate-500 text-xs">Since last log</span>
          </div>
        </div>

        {/* Target Weight */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="flex items-start justify-between mb-2 relative z-10">
            <span className="text-slate-400">Target Weight</span>
            <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            </div>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <h2 className="text-5xl font-black">{profile.targetWeight}</h2>
            <span className="text-xl text-slate-400">kg</span>
          </div>
          
          <div className="mt-6 relative z-10">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Progress to goal</span>
              <span>{Math.max(0, Math.min(100, Math.round(progressToTarget || 0)))}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(0, Math.min(100, progressToTarget || 0))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Log Form */}
        <div className="glass-card p-6 rounded-3xl border border-violet-500/30 relative flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4 text-violet-400">Log Today's Weight</h3>
            <form onSubmit={handleLogWeight} className="space-y-4">
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Enter weight..." 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-xl focus:outline-none focus:border-violet-400 transition-colors"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kg</span>
              </div>
              <button 
                type="submit" 
                className="w-full bg-violet-500 hover:bg-violet-400 text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-violet-500/20"
              >
                Save Entry
              </button>
            </form>
          </div>

          {weightHistory.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-bold text-slate-400 mb-3">Recent Logs</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {[...weightHistory].reverse().slice(0, 3).map((entry) => (
                  <div key={entry.date} className="flex justify-between items-center bg-white/5 p-3 rounded-xl group hover:bg-white/10 transition-colors">
                    <span className="text-slate-300 text-sm font-medium">{entry.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-violet-400">{entry.weight} kg</span>
                      <button 
                        onClick={() => removeWeight(entry.date)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[400px]">
        <h3 className="text-xl font-bold mb-8">Weight History</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                tick={{ fill: '#64748b' }}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth()+1}`;
                }}
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']} 
                stroke="#64748b" 
                tick={{ fill: '#64748b' }}
                tickFormatter={(val) => `${val}kg`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8b5cf6" 
                strokeWidth={4}
                dot={{ r: 6, fill: '#8b5cf6', stroke: '#060816', strokeWidth: 3 }}
                activeDot={{ r: 8, fill: '#c4b5fd', stroke: '#8b5cf6', strokeWidth: 2 }}
                animationDuration={1500}
              />
              {/* Target Weight Line */}
              <Line 
                type="stepAfter" 
                dataKey={() => profile.targetWeight} 
                stroke="#22d3ee" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500"></div>
            <span className="text-sm text-slate-400">Actual Weight</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400" style={{ border: '1px dashed #22d3ee' }}></div>
            <span className="text-sm text-slate-400">Target ({profile.targetWeight}kg)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

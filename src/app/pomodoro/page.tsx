"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, Coffee, Brain, X, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PomodoroPage() {
  const [customTimes, setCustomTimes] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [isMounted, setIsMounted] = useState(false);
  
  // Settings & Media States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [musicType, setMusicType] = useState<"none" | "youtube" | "file">("none");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");
  const [audioFile, setAudioFile] = useState<string | null>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("fitforge_pomodoro_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle both old format (just customTimes object) and new format
        const loadedTimes = parsed.customTimes ? parsed.customTimes : parsed;
        setCustomTimes(loadedTimes);
        
        if (parsed.musicType) setMusicType(parsed.musicType);
        if (parsed.youtubeUrl) setYoutubeUrl(parsed.youtubeUrl);
        if (parsed.youtubeEmbedUrl) setYoutubeEmbedUrl(parsed.youtubeEmbedUrl);
        
        setTimeLeft(loadedTimes.work * 60);
      } catch (e) {}
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("fitforge_pomodoro_settings", JSON.stringify({
        customTimes,
        musicType,
        youtubeUrl,
        youtubeEmbedUrl
      }));
    }
  }, [customTimes, musicType, youtubeUrl, youtubeEmbedUrl, isMounted]);

  const modes = {
    work: { time: customTimes.work * 60, label: "Focus Time", icon: Brain, color: "text-cyan-400", bg: "bg-cyan-400" },
    shortBreak: { time: customTimes.shortBreak * 60, label: "Short Break", icon: Coffee, color: "text-emerald-400", bg: "bg-emerald-400" },
    longBreak: { time: customTimes.longBreak * 60, label: "Long Break", icon: Coffee, color: "text-blue-400", bg: "bg-blue-400" },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Optional: play sound here
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].time);
  };

  const switchMode = (newMode: keyof typeof modes) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(modes[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (match && match[1]) {
      setYoutubeEmbedUrl(`https://www.youtube.com/embed/${match[1]}`);
    } else {
      setYoutubeEmbedUrl("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioFile(url);
      setMusicType("file");
    }
  };

  const applyTimes = () => {
    setTimeLeft(customTimes[mode] * 60);
    setIsRunning(false);
  };

  if (!isMounted) return null;

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;
  const CurrentIcon = modes[mode].icon;

  return (
    <div className="p-6 md:p-10 min-h-full flex flex-col items-center justify-center relative">
      <div className="w-full max-w-2xl text-center mb-12 mt-10">
        <p className="uppercase tracking-[0.4em] text-cyan-400 text-sm font-semibold mb-2">
          Productivity
        </p>
        <h1 className="text-4xl md:text-5xl font-black">
          Pomodoro <span className="text-cyan-400">Timer</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Boost your focus and productivity with custom intervals and background music.
        </p>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[40px] w-full max-w-md relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Progress Background */}
        <div 
          className="absolute bottom-0 left-0 right-0 opacity-10 transition-all duration-1000 ease-linear"
          style={{ height: `${progress}%`, backgroundColor: modes[mode].color.includes('cyan') ? '#22d3ee' : modes[mode].color.includes('emerald') ? '#34d399' : '#60a5fa' }}
        />

        <div className="flex justify-center gap-2 md:gap-4 mb-10 relative z-10">
          {(Object.keys(modes) as Array<keyof typeof modes>).map((k) => (
            <button
              key={k}
              onClick={() => switchMode(k)}
              className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                mode === k 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-md' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {modes[k].label}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center relative z-10 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <CurrentIcon className={`w-8 h-8 ${modes[mode].color}`} />
          </div>
          <div className="text-7xl md:text-8xl font-black tabular-nums tracking-tight">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 relative z-10">
          <button
            onClick={resetTimer}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isRunning 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 shadow-red-500/20 border border-red-500/30' 
                : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/25 border border-cyan-400/50'
            }`}
          >
            {isRunning ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all text-slate-300 hover:text-white"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {musicType === "youtube" && youtubeEmbedUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10"
        >
          <iframe 
            width="100%" 
            height="150" 
            src={youtubeEmbedUrl} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </motion.div>
      )}

      {musicType === "file" && audioFile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full max-w-md bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col items-center shadow-2xl relative z-10"
        >
           <Music className="w-6 h-6 text-cyan-400 mb-3" />
           <p className="text-sm text-slate-300 mb-3 font-medium">Local Audio Playing</p>
           <audio controls src={audioFile} loop className="w-full h-12 outline-none rounded-xl" />
        </motion.div>
      )}

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 md:p-8 rounded-[32px] w-full max-w-lg relative border border-white/10 shadow-2xl bg-slate-900/90"
            >
              <button 
                onClick={() => setIsSettingsOpen(false)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-cyan-400" /> Settings
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Timer Durations (minutes)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">Focus</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={customTimes.work} 
                        onChange={(e) => setCustomTimes({...customTimes, work: parseInt(e.target.value) || 1})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">Short Break</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={customTimes.shortBreak} 
                        onChange={(e) => setCustomTimes({...customTimes, shortBreak: parseInt(e.target.value) || 1})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">Long Break</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={customTimes.longBreak} 
                        onChange={(e) => setCustomTimes({...customTimes, longBreak: parseInt(e.target.value) || 1})} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 transition-colors" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={applyTimes}
                    className="mt-4 w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    Apply Times
                  </button>
                </div>

                <div className="h-px w-full bg-white/10"></div>

                <div>
                  <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Background Music</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      onClick={() => setMusicType("none")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${musicType === "none" ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 hover:text-white"}`}
                    >
                      None
                    </button>
                    <button 
                      onClick={() => setMusicType("youtube")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${musicType === "youtube" ? "bg-red-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}
                    >
                      YouTube
                    </button>
                    <button 
                      onClick={() => setMusicType("file")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${musicType === "file" ? "bg-emerald-500 text-black" : "bg-white/5 text-slate-400 hover:text-white"}`}
                    >
                      Upload File
                    </button>
                  </div>

                  {musicType === "youtube" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="block text-xs text-slate-400 mb-2">YouTube Video URL</label>
                      <input 
                        type="text" 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        value={youtubeUrl}
                        onChange={handleYoutubeChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-400 transition-colors" 
                      />
                      <p className="text-xs text-slate-500 mt-2">Paste any YouTube URL (e.g. Lofi Girl) to play in the background.</p>
                    </motion.div>
                  )}

                  {musicType === "file" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="block text-xs text-slate-400 mb-2">Select Audio File</label>
                      <input 
                        type="file" 
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 cursor-pointer transition-colors"
                      />
                      <p className="text-xs text-slate-500 mt-2">Upload a local .mp3 or .wav file to loop while studying.</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

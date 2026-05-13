"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, Coffee, Brain, X, Music, Volume2, VolumeX, FastForward, Rewind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";

const Player = ReactPlayer as any;

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
  const [audioFile, setAudioFile] = useState<string | null>(null);

  // Custom Player States
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const [mediaVolume, setMediaVolume] = useState(0.5);
  const [mediaMuted, setMediaMuted] = useState(false);
  const [mediaPlayed, setMediaPlayed] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const playerRef = useRef<any>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("fitforge_pomodoro_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const loadedTimes = parsed.customTimes ? parsed.customTimes : parsed;
        setCustomTimes(loadedTimes);
        
        if (parsed.musicType) setMusicType(parsed.musicType);
        if (parsed.youtubeUrl) setYoutubeUrl(parsed.youtubeUrl);
        
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
      }));
    }
  }, [customTimes, musicType, youtubeUrl, isMounted]);

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
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
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
  const activeMediaUrl = musicType === "youtube" ? youtubeUrl : audioFile;

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

      {/* Hidden ReactPlayer */}
      <div className="absolute inset-0 opacity-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {musicType !== "none" && activeMediaUrl && (
          <Player 
            ref={playerRef}
            url={activeMediaUrl}
            playing={mediaPlaying}
            volume={mediaVolume}
            muted={mediaMuted}
            onProgress={(p: any) => setMediaPlayed(p.played)}
            onDuration={(d: number) => setMediaDuration(d)}
            width="100%"
            height="100%"
            playsinline
            config={{
              youtube: {
                playerVars: { 
                  autoplay: 1,
                  controls: 0,
                  disablekb: 1,
                }
              }
            }}
            onReady={() => console.log('Player ready')}
            onError={(e: any) => console.log('Player error', e)}
          />
        )}
      </div>

      {/* Custom Audio Player UI */}
      <AnimatePresence>
        {musicType !== "none" && activeMediaUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-8 w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl relative z-10"
          >
            <div className="flex items-center gap-4 mb-5">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${musicType === 'youtube' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {musicType === 'youtube' ? <Play className="w-6 h-6" /> : <Music className="w-6 h-6" />}
               </div>
               <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-white truncate text-sm uppercase tracking-widest mb-1">
                    {musicType === 'youtube' ? 'YouTube Stream' : 'Local Audio'}
                  </h4>
                  <p className="text-xs text-slate-400 truncate opacity-80">
                    {musicType === 'youtube' ? youtubeUrl : 'Playing from device'}
                  </p>
               </div>
            </div>

            <div className="space-y-5">
              {/* Progress Bar */}
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium font-mono">
                <span>{formatTime(mediaPlayed * mediaDuration)}</span>
                <div 
                  className="flex-1 h-2 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
                  onClick={(e) => {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - bounds.left;
                    const newProgress = x / bounds.width;
                    playerRef.current?.seekTo(newProgress, "fraction");
                  }}
                >
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-150 ${musicType === 'youtube' ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${mediaPlayed * 100}%` }}
                  />
                  {/* Hover effect indicator */}
                  <div className="absolute top-0 left-0 h-full bg-white/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity w-full"></div>
                </div>
                <span>{formatTime(mediaDuration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 group relative">
                   <button onClick={() => setMediaMuted(!mediaMuted)} className="text-slate-400 hover:text-white transition-colors p-1">
                     {mediaMuted || mediaVolume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                   </button>
                   {/* Custom styled volume slider */}
                   <input 
                     type="range" 
                     min={0} 
                     max={1} 
                     step="any" 
                     value={mediaMuted ? 0 : mediaVolume}
                     onChange={(e) => {
                       setMediaVolume(parseFloat(e.target.value));
                       if(mediaMuted) setMediaMuted(false);
                     }}
                     className={`w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer transition-opacity opacity-70 group-hover:opacity-100
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                       [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg
                     `}
                   />
                </div>

                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => playerRef.current?.seekTo(mediaPlayed - 0.05)}
                     className="text-slate-400 hover:text-white transition-colors"
                   >
                     <Rewind className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={() => setMediaPlaying(!mediaPlaying)}
                     className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                       musicType === 'youtube' 
                         ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-red-400 hover:scale-105' 
                         : 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:scale-105'
                     }`}
                   >
                     {mediaPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                   </button>
                   <button 
                     onClick={() => playerRef.current?.seekTo(mediaPlayed + 0.05)}
                     className="text-slate-400 hover:text-white transition-colors"
                   >
                     <FastForward className="w-5 h-5" />
                   </button>
                </div>
                
                {/* Download Button */}
                <div className="flex items-center gap-2">
                   <a 
                     href={musicType === 'youtube' && youtubeUrl ? youtubeUrl.replace('youtube.com', 'ssyoutube.com') : (activeMediaUrl || '#')} 
                     target="_blank" 
                     rel="noreferrer"
                     download={musicType === 'file' ? 'audio_file' : undefined}
                     className={`p-2 rounded-xl transition-all border ${
                       musicType === 'youtube' 
                         ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-white' 
                         : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-white'
                     }`}
                     title="Download Media"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                   </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      onClick={() => { setMusicType("none"); setMediaPlaying(false); }}
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

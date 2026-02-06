
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Info, 
  Radio, 
  Activity,
  BarChart3,
  Share2
} from 'lucide-react';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use the local proxy path defined in server.js
  const STREAM_URL = '/stream';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      // We reset the src to ensure we're getting the latest live chunk
      audioRef.current.src = STREAM_URL;
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.error("Playback failed", err);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioRef.current.muted = nextMute;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        preload="none"
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />

      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-zinc-600'}`} />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-300">
            {isPlaying ? 'Live' : 'Offline'}
          </span>
        </div>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/CNBC_2023.svg/500px-CNBC_2023.svg.png" 
          alt="CNBC" 
          className="h-5 opacity-80"
        />
        <button className="p-2 text-zinc-500 hover:text-white transition-colors">
          <Share2 size={18} />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-8 md:gap-12">
        
        {/* Modernized Visualizer */}
        <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72">
          {/* Ambient Outer Glow */}
          <div className={`absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Rotating Rings */}
          <div className={`absolute inset-0 rounded-full border border-zinc-800/40 transition-transform duration-1000 ${isPlaying ? 'scale-125 rotate-45' : 'scale-100 rotate-0'}`} />
          <div className={`absolute inset-4 rounded-full border border-zinc-700/20 transition-transform duration-700 ${isPlaying ? 'scale-110 -rotate-45' : 'scale-100 rotate-0'}`} />

          {/* Central Disk */}
          <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-zinc-800 to-black border border-zinc-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            {/* Dynamic Center Icon */}
            <div className={`transition-all duration-500 ${isPlaying ? 'scale-110' : 'scale-90 opacity-50'}`}>
              {isPlaying ? (
                <div className="flex gap-1 items-end h-16">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-blue-500 rounded-full animate-bounce"
                      style={{ 
                        height: `${30 + Math.random() * 70}%`, 
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.8s'
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Radio size={56} className="text-zinc-400" />
              )}
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Station Info */}
        <div className="text-center space-y-3 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
            <BarChart3 size={12} className="text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Market Watch</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
            CNBC Live <span className="text-zinc-500">Audio</span>
          </h1>
          <p className="text-zinc-400 text-sm font-medium tracking-wide flex items-center justify-center gap-2">
            Real-time Business & Financial News
          </p>
        </div>

        {/* Live Progress Bar (Decorative for Audio) */}
        <div className="w-full px-8">
          <div className="flex justify-between items-end mb-3">
            <div className="flex flex-col items-start">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</span>
               <span className="text-xs font-mono text-blue-400">{isPlaying ? 'CONNECTED' : 'STANDBY'}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Local Time</span>
               <span className="text-xs font-mono text-zinc-300">{currentTime.toLocaleTimeString([], { hour12: false })}</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ${isPlaying ? 'w-full animate-pulse' : 'w-0'}`} 
            />
          </div>
        </div>
      </main>

      {/* Glassmorphic Controls Footer */}
      <footer className="w-full max-w-md bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 pb-10 mb-4 flex flex-col items-center gap-8 shadow-2xl shadow-black">
        
        {/* Main Play/Pause */}
        <div className="flex items-center justify-between w-full px-4">
          <button className="p-3 text-zinc-500 hover:text-white transition-all active:scale-90">
             <Info size={22} />
          </button>

          <button 
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-20 h-20 flex items-center justify-center rounded-full transition-all duration-300 transform active:scale-95 shadow-xl ${
              isPlaying 
              ? 'bg-white text-black hover:bg-zinc-200' 
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
          </button>

          <button className="p-3 text-zinc-500 hover:text-white transition-all active:scale-90">
            <Maximize2 size={22} />
          </button>
        </div>

        {/* Volume System */}
        <div className="w-full flex items-center gap-4 px-2 group">
          <button onClick={toggleMute} className="text-zinc-500 hover:text-white transition-colors shrink-0">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="flex-1 relative flex items-center h-6">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500 outline-none
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-125"
            />
          </div>
          
          <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </footer>

      {/* Device Safe Area */}
      <div className="h-2 w-full" />
    </div>
  );
};

export default App;

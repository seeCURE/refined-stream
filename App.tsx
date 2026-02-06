
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
  ChevronDown
} from 'lucide-react';

/**
 * CNBC Live Stream Player Component
 * Focused on premium dark UI and mobile-first experience.
 */

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Stream URL from the original request
  // Note: Direct access might be blocked by CORS if not proxied, 
  // but we maintain the structure for the intended use.
  const STREAM_URL = 'https://radiokrug.ru/usa/CNBC/icecast.audio';

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      audioRef.current.play().catch(err => {
        console.error("Playback failed", err);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
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
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-between p-6 select-none overflow-hidden">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={STREAM_URL}
        preload="auto"
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
      />

      {/* Top Navigation / Header */}
      <header className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">Live</span>
        </div>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/CNBC_2023.svg/500px-CNBC_2023.svg.png" 
          alt="CNBC" 
          className="h-6 opacity-90 brightness-110"
        />
        <button className="p-2 text-zinc-500 hover:text-zinc-200 transition-colors">
          <Info size={18} />
        </button>
      </header>

      {/* Main Player Display */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-12">
        
        {/* Visualizer Area */}
        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
          {/* Animated Glow Backdrop */}
          <div className={`absolute inset-0 bg-blue-600/5 rounded-full blur-[80px] transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Circular Visualizer Ring (Fake animation) */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className={`w-full h-full rounded-full border border-zinc-800/50 flex items-center justify-center transition-transform duration-500 ${isPlaying ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-[85%] h-[85%] rounded-full border border-zinc-700/30 flex items-center justify-center ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
                    <div className="flex gap-[3px] items-center h-12">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-[3px] bg-zinc-400 rounded-full ${isPlaying ? 'animate-bounce' : 'h-2'}`}
                          style={{ 
                            height: isPlaying ? `${Math.random() * 100}%` : '8px',
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.6s'
                          }}
                        />
                      ))}
                    </div>
                </div>
             </div>
          </div>

          {/* Album/Station Art (CNBC Placeholder) */}
          <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full bg-zinc-900 border-2 border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-transparent to-zinc-800" />
            <Radio size={48} className={`text-zinc-600 transition-all duration-700 ${isPlaying ? 'scale-125 text-blue-500' : 'scale-100'}`} />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-8 h-8 border-2 border-zinc-400 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">CNBC Live Audio</h1>
          <p className="text-zinc-400 text-sm font-medium tracking-wide uppercase flex items-center justify-center gap-2">
            <Activity size={14} className="text-blue-500" />
            Global Markets & Business
          </p>
        </div>

        {/* Live Indicator Bar */}
        <div className="w-full px-4 space-y-3">
          <div className="relative h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 ${isPlaying ? 'animate-pulse' : 'w-0'}`} />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-zinc-500 tracking-tighter">
            <span>LIVE STREAM</span>
            <span className="text-zinc-300">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </main>

      {/* Control Bar */}
      <footer className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-[2.5rem] p-4 pb-8 mb-2 flex flex-col items-center gap-6 shadow-2xl">
        
        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-10 w-full">
          <button className="text-zinc-500 hover:text-white transition-all active:scale-90">
             <div className="rotate-180">
                <ChevronDown size={28} className="rotate-90" />
             </div>
          </button>

          <button 
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-20 h-20 flex items-center justify-center rounded-full transition-all duration-300 transform active:scale-95 shadow-lg ${
              isPlaying 
              ? 'bg-zinc-100 text-black shadow-zinc-100/10' 
              : 'bg-blue-600 text-white shadow-blue-600/20'
            }`}
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button className="text-zinc-500 hover:text-white transition-all active:scale-90">
            <Maximize2 size={24} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="w-full px-6 flex items-center gap-4 group">
          <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="flex-1 relative flex items-center h-10">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500 transition-all focus:outline-none focus:ring-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
      </footer>

      {/* Bottom Safe Area Spacer */}
      <div className="h-4 w-full" />
    </div>
  );
};

export default App;

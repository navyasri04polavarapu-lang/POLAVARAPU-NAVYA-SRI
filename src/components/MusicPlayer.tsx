import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, Disc } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#ff007f"
  },
  {
    id: 2,
    title: "Digital Rain",
    artist: "Cyber Echo",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#00f3ff"
  },
  {
    id: 3,
    title: "Quantum Pulse",
    artist: "Electro AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#9d00ff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="bg-black/80 border-t border-white/10 backdrop-blur-xl p-4 md:p-6 w-full max-w-4xl rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,1)]">
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4 flex-1 w-full">
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="flex-shrink-0"
          >
            <div 
              className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center relative shadow-lg"
              style={{ backgroundColor: currentTrack.color + '22', border: `2px solid ${currentTrack.color}` }}
            >
              <Disc className="w-6 h-6 md:w-8 md:h-8" style={{ color: currentTrack.color }} />
              <div className="absolute inset-0 rounded-full animate-pulse opacity-20" style={{ backgroundColor: currentTrack.color }} />
            </div>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold truncate md:text-xl tracking-tight">{currentTrack.title}</h3>
            <p className="text-white/50 text-sm md:text-base font-mono flex items-center gap-2">
              <Music className="w-3 h-3" />
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-8">
            <button 
              onClick={handlePrev}
              className="text-white/40 hover:text-white transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-12 h-12 md:w-14 md:h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </motion.button>

            <button 
              onClick={handleNext}
              className="text-white/40 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full md:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white shadow-[0_0_10px_white]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        {/* Volume / Extra */}
        <div className="hidden lg:flex items-center gap-3 text-white/40 flex-1 justify-end">
          <Volume2 className="w-5 h-5" />
          <div className="w-24 h-1 bg-white/10 rounded-full relative">
            <div className="absolute left-0 top-0 h-full w-2/3 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

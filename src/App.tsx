import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Radio } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/5 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg neon-glow-cyan">
             <Gamepad2 className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">NEON PULSE</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-cyan-400">Tactical Arcade Unit</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-white/40 tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            SYSTEM STABLE
          </div>
          <div className="flex items-center gap-2">
             <Radio className="w-3 h-3" />
             LIVE FEED READY
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500 opacity-50" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-pink-500 opacity-50" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-purple-500 opacity-50" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500 opacity-50" />
          
          <div className="bg-black/60 border border-white/10 rounded-2xl p-2 backdrop-blur-2xl shadow-2xl">
            <SnakeGame />
          </div>
        </motion.div>
      </main>

      {/* Footer / Music Player */}
      <footer className="relative z-10 mt-auto flex justify-center">
        <MusicPlayer />
      </footer>

      {/* Visual Glitch Effect (Subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-overlay">
        <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      </div>
    </div>
  );
}

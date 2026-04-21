import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const TICK_RATE = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake body
      const onSnake = snake.some(segment => segment.x === newFood?.x && segment.y === newFood?.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood());
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const head = { 
        x: prevSnake[0].x + direction.x, 
        y: prevSnake[0].y + direction.y 
      };

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPlaying, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, TICK_RATE);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver, moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 select-none">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-lg">
        <div className="flex items-center gap-2 text-cyan-400 neon-text-cyan">
          <Trophy className="w-5 h-5" />
          <span>SCORE: {score}</span>
        </div>
        <div className="flex items-center gap-2 text-pink-500 neon-text-pink opacity-80">
          <span>HIGH: {highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-black/40 border-2 border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_0_20px_rgba(0,243,255,0.1)]"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-5">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>

        {/* Snake Body */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={i === 0 ? { scale: 0.8 } : false}
            animate={{ scale: 1 }}
            className="absolute rounded-sm"
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
              backgroundColor: i === 0 ? '#00f3ff' : '#9d00ff',
              boxShadow: i === 0 ? '0 0 10px #00f3ff' : 'none',
              zIndex: i === 0 ? 10 : 5
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute w-[20px] h-[20px] bg-pink-500 rounded-full neon-glow-pink"
          style={{
            left: food.x * 20,
            top: food.y * 20,
            zIndex: 8
          }}
        />

        {/* Overlay */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-20 backdrop-blur-md"
            >
              {isGameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-pink-500 neon-text-pink mb-2">GAME OVER</h2>
                  <p className="text-cyan-400 font-mono mb-6">FINAL SCORE: {score}</p>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-cyan-400 neon-text-cyan mb-2">SNAKE NEON</h2>
                  <p className="text-white/60 font-mono mb-6">USE ARROW KEYS TO NAVIGATE</p>
                </div>
              )}
              
              <button
                onClick={resetGame}
                className="group flex items-center gap-2 px-8 py-3 bg-cyan-500/10 border-2 border-cyan-500 text-cyan-400 rounded-full hover:bg-cyan-500 hover:text-black transition-all duration-300 neon-glow-cyan"
              >
                {isGameOver ? <RefreshCw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span className="font-bold tracking-widest">{isGameOver ? 'TRY AGAIN' : 'START GAME'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-xs font-mono text-white/40 uppercase tracking-tighter">
        <span>↑ Up</span>
        <span>↓ Down</span>
        <span>← Left</span>
        <span>→ Right</span>
      </div>
    </div>
  );
}

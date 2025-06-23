"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface GameState {
  score: number;
  combo: number;
  lives: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  timeLeft: number;
}

interface Fruit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  active: boolean;
}

interface SliceTrail {
  id: number;
  points: Array<{x: number, y: number}>;
  timestamp: number;
}

const fruits = [
  { type: "🍎", color: "#ff6b6b", points: 10, size: 60 },
  { type: "🍊", color: "#ffa726", points: 15, size: 55 },
  { type: "🍌", color: "#ffeb3b", points: 20, size: 70 },
  { type: "🍓", color: "#f44336", points: 25, size: 45 },
  { type: "🍇", color: "#9c27b0", points: 30, size: 50 },
  { type: "🍉", color: "#4caf50", points: 35, size: 80 },
  { type: "🥝", color: "#8bc34a", points: 40, size: 40 },
  { type: "🍍", color: "#ff9800", points: 45, size: 65 }
];

const bombs = [
  { type: "💣", color: "#424242", points: -50, size: 50 }
];

const FruitSliceGame = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 0,
    lives: 3,
    isPlaying: false,
    isPaused: false,
    gameOver: false,
    timeLeft: 60
  });

  const [fruitsList, setFruitsList] = useState<Fruit[]>([]);
  const [sliceTrails, setSliceTrails] = useState<SliceTrail[]>([]);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, color: string}>>([]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const fruitIdRef = useRef(0);
  const isMouseDown = useRef(false);
  const mouseTrail = useRef<Array<{x: number, y: number}>>([]);
  const lastMousePos = useRef<{x: number, y: number} | null>(null);

  const gravity = 0.3;
  const spawnRate = 0.02;
  
  const createFruit = useCallback(() => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const isBomb = Math.random() < 0.15;
    const item = isBomb ? bombs[0] : fruits[Math.floor(Math.random() * fruits.length)];
    
    const newFruit: Fruit = {
      id: fruitIdRef.current++,
      x: Math.random() * (rect.width - item.size),
      y: rect.height + item.size,
      vx: (Math.random() - 0.5) * 4,
      vy: -15 - Math.random() * 5,
      type: item.type,
      size: item.size,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 10,
      active: true
    };
    
    setFruitsList(prev => [...prev, newFruit]);
  }, []);

  const createParticles = (x: number, y: number, color: string, count: number = 8) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 3,
      color
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const checkSlice = useCallback((mouseX: number, mouseY: number) => {
    setFruitsList(prev => {
      const newFruits = [...prev];
      
      newFruits.forEach(fruit => {
        if (!fruit.active) return;
        
        const distance = Math.sqrt(
          Math.pow(mouseX - (fruit.x + fruit.size/2), 2) + 
          Math.pow(mouseY - (fruit.y + fruit.size/2), 2)
        );
        
        if (distance < fruit.size/2) {
          fruit.active = false;
          
          const item = fruit.type === "💣" ? bombs[0] : fruits.find(f => f.type === fruit.type);
          if (item) {
            const points = fruit.type === "💣" ? item.points : item.points * (gameState.combo + 1);
            
            setGameState(prevState => ({
              ...prevState,
              score: Math.max(0, prevState.score + points),
              combo: fruit.type === "💣" ? 0 : prevState.combo + 1,
              lives: fruit.type === "💣" ? Math.max(0, prevState.lives - 1) : prevState.lives
            }));
            
            createParticles(fruit.x + fruit.size/2, fruit.y + fruit.size/2, item.color, fruit.type === "💣" ? 12 : 8);
          }
        }
      });
      
      return newFruits;
    });
  }, [gameState.combo, createParticles]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    isMouseDown.current = true;
    mouseTrail.current = [];
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseTrail.current.push({ x, y });
      lastMousePos.current = { x, y };
      checkSlice(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !gameState.isPlaying || gameState.isPaused) return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (lastMousePos.current) {
        const distance = Math.sqrt(
          Math.pow(x - lastMousePos.current.x, 2) + 
          Math.pow(y - lastMousePos.current.y, 2)
        );
        
        if (distance > 5) {
          mouseTrail.current.push({ x, y });
          lastMousePos.current = { x, y };
          checkSlice(x, y);
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (isMouseDown.current && mouseTrail.current.length > 2) {
      const trail: SliceTrail = {
        id: Date.now(),
        points: [...mouseTrail.current],
        timestamp: Date.now()
      };
      setSliceTrails(prev => [...prev, trail]);
    }
    
    isMouseDown.current = false;
    mouseTrail.current = [];
    lastMousePos.current = null;
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    // Update fruits physics
    setFruitsList(prev => prev.map(fruit => ({
      ...fruit,
      x: fruit.x + fruit.vx,
      y: fruit.y + fruit.vy,
      vy: fruit.vy + gravity,
      rotation: fruit.rotation + fruit.rotationSpeed,
      active: fruit.y < (gameAreaRef.current?.clientHeight || 600) + fruit.size
    })).filter(fruit => fruit.active));

    // Remove old slice trails
    setSliceTrails(prev => prev.filter(trail => Date.now() - trail.timestamp < 1000));

    // Move particles
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vx: particle.vx * 0.98,
      vy: particle.vy * 0.98
    })).filter(particle => 
      particle.x > 0 && 
      particle.x < (gameAreaRef.current?.clientWidth || 800) &&
      particle.y > 0 && 
      particle.y < (gameAreaRef.current?.clientHeight || 600)
    ));

    // Spawn new fruits
    if (Math.random() < spawnRate) {
      createFruit();
    }

    // Update timer
    setGameState(prev => {
      if (prev.timeLeft <= 0) {
        return { ...prev, isPlaying: false, gameOver: true };
      }
      return { ...prev, timeLeft: prev.timeLeft - 1/60 };
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft, createFruit]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gameState.isPlaying, gameState.isPaused]);

  const startGame = () => {
    setGameState({
      score: 0,
      combo: 0,
      lives: 3,
      isPlaying: true,
      isPaused: false,
      gameOver: false,
      timeLeft: 60
    });
    setFruitsList([]);
    setSliceTrails([]);
    setParticles([]);
    fruitIdRef.current = 0;
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      combo: 0,
      lives: 3,
      isPlaying: false,
      isPaused: false,
      gameOver: false,
      timeLeft: 60
    });
    setFruitsList([]);
    setSliceTrails([]);
    setParticles([]);
    fruitIdRef.current = 0;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#ff6b6b]/30 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-r from-[#ff6b6b]/20 to-[#ee5a52]/20 border-b border-[#ff6b6b]/30 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#ff6b6b] font-[Orbitron,Arial,sans-serif] uppercase tracking-widest">
              FRUIT SLICE
            </h2>
            <button
              onClick={() => router.push('/games')}
              className="text-2xl hover:text-[#ffb347] transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Game Stats */}
          <div className="flex justify-between items-center mt-4 text-white font-[Orbitron,Arial,sans-serif]">
            <div className="flex gap-6">
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">SCORE</div>
                <div className="text-2xl font-bold text-[#ff6b6b]">{gameState.score}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">COMBO</div>
                <div className="text-2xl font-bold text-[#ffeb3b]">{gameState.combo}x</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">LIVES</div>
                <div className="text-2xl font-bold text-[#4caf50]">{gameState.lives}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">TIME</div>
                <div className="text-2xl font-bold text-[#9c27b0]">{Math.ceil(gameState.timeLeft)}s</div>
              </div>
            </div>
            
            {gameState.isPlaying && (
              <button
                onClick={pauseGame}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                {gameState.isPaused ? '▶️' : '⏸️'}
              </button>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div className="relative w-full h-full flex flex-col">
          <div
            ref={gameAreaRef}
            className="flex-1 w-full h-full bg-gradient-to-b from-gray-900 to-black relative overflow-hidden cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Fruits */}
            {fruitsList.map(fruit => (
              <motion.div
                key={fruit.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute cursor-pointer select-none"
                style={{
                  left: fruit.x,
                  top: fruit.y,
                  width: fruit.size,
                  height: fruit.size,
                  transform: `rotate(${fruit.rotation}deg)`,
                  fontSize: `${fruit.size * 0.8}px`,
                  filter: fruit.type === "💣" ? "drop-shadow(0 0 10px #ff0000)" : "drop-shadow(0 0 10px rgba(255,255,255,0.3))"
                }}
              >
                {fruit.type}
              </motion.div>
            ))}

            {/* Slice Trails */}
            {sliceTrails.map(trail => (
              <svg
                key={trail.id}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 1000 }}
              >
                <polyline
                  points={trail.points.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#ff6b6b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
              </svg>
            ))}

            {/* Particles */}
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 10px ${particle.color}`
                }}
              />
            ))}

            {/* Game Overlay */}
            {!gameState.isPlaying && !gameState.gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-[#ff6b6b] font-[Orbitron,Arial,sans-serif] mb-4 uppercase tracking-widest">
                    FRUIT SLICE
                  </h3>
                  <p className="text-gray-300 font-[Inter,sans-serif] mb-6 max-w-md">
                    Slice fruits with your mouse to score points! Create combos for bonus points. 
                    Avoid bombs - they&apos;ll hurt you!
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff6b6b] to-[#ee5a52] text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#ff6b6b] hover:from-[#ee5a52] hover:to-[#ff6b6b] transition-all duration-300 uppercase tracking-widest text-lg"
                  >
                    START SLICING
                  </button>
                </div>
              </div>
            )}

            {/* Game Over */}
            {gameState.gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-[#f472b6] font-[Orbitron,Arial,sans-serif] mb-4 uppercase tracking-widest">
                    TIME&apos;S UP!
                  </h3>
                  <p className="text-gray-300 font-[Inter,sans-serif] mb-6">
                    Final Score: <span className="text-[#ff6b6b] font-bold">{gameState.score}</span>
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={startGame}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ee5a52] text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#ff6b6b] hover:from-[#ee5a52] hover:to-[#ff6b6b] transition-all duration-300 uppercase tracking-widest"
                    >
                      RETRY
                    </button>
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold font-[Orbitron,Arial,sans-serif] transition-all uppercase tracking-widest"
                    >
                      EXIT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Paused Overlay */}
            {gameState.isPaused && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-[#ffb347] font-[Orbitron,Arial,sans-serif] mb-4 uppercase tracking-widest">
                    PAUSED
                  </h3>
                  <button
                    onClick={pauseGame}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ee5a52] text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#ff6b6b] hover:from-[#ee5a52] hover:to-[#ff6b6b] transition-all duration-300 uppercase tracking-widest"
                  >
                    RESUME
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 border-t border-[#ff6b6b]/30">
          <div className="text-center text-gray-400 font-[Inter,sans-serif] text-sm">
            <span className="text-[#ff6b6b] font-bold">SLICE</span> fruits with mouse • 
            <span className="text-[#ffeb3b] font-bold"> COMBO</span> for bonus points • 
            <span className="text-[#f44336] font-bold"> AVOID</span> bombs
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FruitSliceGame;

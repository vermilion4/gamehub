"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface GameState {
  score: number;
  level: number;
  lives: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
}

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  points: number;
  active: boolean;
}

const NeuralHackGame = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lives: 3,
    isPlaying: false,
    isPaused: false,
    gameOver: false
  });

  const [targets, setTargets] = useState<Target[]>([]);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, color: string}>>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const targetIdRef = useRef(0);

  const colors = ['#00eaff', '#f472b6', '#ffb347', '#10b981', '#8b5cf6'];
  
  const createTarget = useCallback(() => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const size = Math.random() * 40 + 20;
    const speed = Math.random() * 0.5 + 0.3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const points = Math.floor(100 / size) + 10;
    
    const newTarget: Target = {
      id: targetIdRef.current++,
      x: Math.random() * (rect.width - size),
      y: -size - Math.random() * 100,
      size,
      color,
      speed,
      points,
      active: true
    };
    
    setTargets(prev => [...prev, newTarget]);
  }, []);

  const createParticles = (x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y: y - 50,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      color
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleTargetClick = (target: Target) => {
    if (!target.active) return;
    
    // Update score
    setGameState(prev => ({
      ...prev,
      score: prev.score + target.points
    }));
    
    // Create particles
    createParticles(target.x + target.size/2, target.y + target.size/2, target.color);
    
    // Remove target
    setTargets(prev => prev.filter(t => t.id !== target.id));
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    // Move targets
    setTargets(prev => prev.map(target => ({
      ...target,
      y: target.y + target.speed,
      active: target.y < (gameAreaRef.current?.clientHeight || 600)
    })).filter(target => target.active));

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

    // Check for missed targets
    setTargets(prev => {
      const missed = prev.filter(target => target.y > (gameAreaRef.current?.clientHeight || 600));
      if (missed.length > 0) {
        setGameState(prevState => ({
          ...prevState,
          lives: prevState.lives - missed.length
        }));
      }
      return prev.filter(target => target.y <= (gameAreaRef.current?.clientHeight || 600));
    });

    // Check game over
    if (gameState.lives <= 0) {
      setGameState(prev => ({ ...prev, isPlaying: false, gameOver: true }));
      return;
    }

    // Spawn new targets
    if (Math.random() < 0.01 + gameState.level * 0.002) {
      createTarget();
    }

    // Level up
    if (gameState.score > gameState.level * 1000) {
      setGameState(prev => ({ ...prev, level: prev.level + 1 }));
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.lives, gameState.score, gameState.level, createTarget]);

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
      level: 1,
      lives: 3,
      isPlaying: true,
      isPaused: false,
      gameOver: false
    });
    setTargets([]);
    setParticles([]);
    targetIdRef.current = 0;
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      lives: 3,
      isPlaying: false,
      isPaused: false,
      gameOver: false
    });
    setTargets([]);
    setParticles([]);
    targetIdRef.current = 0;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#00eaff]/30 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-r from-[#00eaff]/20 to-[#f472b6]/20 border-b border-[#00eaff]/30 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#00eaff] font-[Orbitron,Arial,sans-serif] uppercase tracking-widest">
              NEURAL HACK
            </h2>
            <button
              onClick={() => router.push('/')}
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
                <div className="text-2xl font-bold text-[#00eaff]">{gameState.score}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">LEVEL</div>
                <div className="text-2xl font-bold text-[#f472b6]">{gameState.level}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">LIVES</div>
                <div className="text-2xl font-bold text-[#ffb347]">{gameState.lives}</div>
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

        {/* Game Area - Full Screen */}
        <div className="relative w-full h-full">
          <div
            ref={gameAreaRef}
            className="w-full h-full bg-gradient-to-b from-gray-900 to-black relative overflow-hidden cursor-crosshair"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 234, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 234, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          >
            {/* Targets */}
            {targets.map(target => (
              <motion.div
                key={target.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => handleTargetClick(target)}
                className="absolute cursor-pointer"
                style={{
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                  backgroundColor: target.color,
                  borderRadius: '50%',
                  boxShadow: `0 0 20px ${target.color}80`,
                  border: `2px solid ${target.color}`
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
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
                  <h3 className="text-4xl font-bold text-[#00eaff] font-[Orbitron,Arial,sans-serif] mb-4 uppercase tracking-widest">
                    NEURAL HACK
                  </h3>
                  <p className="text-gray-300 font-[Inter,sans-serif] mb-6 max-w-md">
                    Click the floating neural nodes to hack the system. 
                    Don&apos;t let them reach the bottom or you&apos;ll lose a life!
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00eaff] to-[#0099bb] text-black font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#00eaff] hover:from-[#0099bb] hover:to-[#00eaff] transition-all duration-300 uppercase tracking-widest text-lg"
                  >
                    START HACK
                  </button>
                </div>
              </div>
            )}

            {/* Game Over */}
            {gameState.gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-[#f472b6] font-[Orbitron,Arial,sans-serif] mb-4 uppercase tracking-widest">
                    SYSTEM BREACH
                  </h3>
                  <p className="text-gray-300 font-[Inter,sans-serif] mb-6">
                    Final Score: <span className="text-[#00eaff] font-bold">{gameState.score}</span>
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={startGame}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00eaff] to-[#0099bb] text-black font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#00eaff] hover:from-[#0099bb] hover:to-[#00eaff] transition-all duration-300 uppercase tracking-widest"
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
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00eaff] to-[#0099bb] text-black font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#00eaff] hover:from-[#0099bb] hover:to-[#00eaff] transition-all duration-300 uppercase tracking-widest"
                  >
                    RESUME
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 border-t border-[#00eaff]/30">
          <div className="text-center text-gray-400 font-[Inter,sans-serif] text-sm">
            <span className="text-[#00eaff] font-bold">CLICK</span> neural nodes to hack • 
            <span className="text-[#f472b6] font-bold"> AVOID</span> letting them reach bottom • 
            <span className="text-[#ffb347] font-bold"> SURVIVE</span> as long as possible
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NeuralHackGame; 
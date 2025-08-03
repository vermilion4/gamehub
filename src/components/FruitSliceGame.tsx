import React, { useState, useEffect, useRef, useCallback } from "react";

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
  color: string;
  points: number;
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
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 0,
    lives: 5,
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
  const gameLoopRef = useRef<boolean>(false);

  const gravity = 0.3;
  const spawnRate = 0.025;
  
  const createFruit = useCallback(() => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const gameWidth = rect.width;
    const gameHeight = rect.height;
    const isBomb = Math.random() < 0.15;
    const item = isBomb ? bombs[0] : fruits[Math.floor(Math.random() * fruits.length)];
    
    const newFruit: Fruit = {
      id: fruitIdRef.current++,
      x: Math.random() * (gameWidth - item.size * 1.5) + item.size * 0.5,
      y: gameHeight + item.size,
      vx: (Math.random() - 0.5) * 4,
      vy: -12 - Math.random() * 6,
      type: item.type,
      size: item.size,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 10,
      active: true,
      color: item.color,
      points: item.points
    };
    
    setFruitsList(prev => [...prev, newFruit]);
  }, []);

  const particleIdRef = useRef(0);

  const createParticles = useCallback((x: number, y: number, color: string, count: number = 8) => {
    const newParticles = Array.from({ length: count }, () => ({
      id: particleIdRef.current++,
      x,
      y,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15 - 5,
      color
    }));
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const checkSlice = useCallback((mouseX: number, mouseY: number) => {
    setFruitsList(prev => {
      const newFruits = prev.map(fruit => {
        if (!fruit.active) return fruit;
        
        const distance = Math.sqrt(
          Math.pow(mouseX - (fruit.x + fruit.size/2), 2) + 
          Math.pow(mouseY - (fruit.y + fruit.size/2), 2)
        );
        
        if (distance < fruit.size/2) {
          const points = fruit.type === "💣" ? fruit.points : fruit.points * Math.max(1, gameState.combo + 1);
          
          setGameState(prevState => ({
            ...prevState,
            score: Math.max(0, prevState.score + points),
            combo: fruit.type === "💣" ? 0 : prevState.combo + 1,
            lives: fruit.type === "💣" ? Math.max(0, prevState.lives - 1) : prevState.lives
          }));
          
          createParticles(fruit.x + fruit.size/2, fruit.y + fruit.size/2, fruit.color, fruit.type === "💣" ? 12 : 8);
          
          return { ...fruit, active: false };
        }
        
        return fruit;
      });
      
      return newFruits;
    });
  }, [gameState.combo, createParticles]);

  const getMousePosition = (e: React.MouseEvent) => {
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return null;
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    isMouseDown.current = true;
    mouseTrail.current = [];
    const pos = getMousePosition(e);
    if (pos) {
      mouseTrail.current.push(pos);
      lastMousePos.current = pos;
      checkSlice(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !gameState.isPlaying || gameState.isPaused) return;
    
    const pos = getMousePosition(e);
    if (pos && lastMousePos.current) {
      const distance = Math.sqrt(
        Math.pow(pos.x - lastMousePos.current.x, 2) + 
        Math.pow(pos.y - lastMousePos.current.y, 2)
      );
      
      if (distance > 3) {
        mouseTrail.current.push(pos);
        if (mouseTrail.current.length > 20) {
          mouseTrail.current.shift();
        }
        lastMousePos.current = pos;
        checkSlice(pos.x, pos.y);
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
    if (!gameLoopRef.current) return;

    setFruitsList(prev => {
      const gameAreaElement = gameAreaRef.current;
      if (!gameAreaElement) return prev;
      
      const activeHeight = gameAreaElement.clientHeight;
      
      return prev.map(fruit => ({
        ...fruit,
        x: fruit.x + fruit.vx,
        y: fruit.y + fruit.vy,
        vy: fruit.vy + gravity,
        rotation: fruit.rotation + fruit.rotationSpeed
      })).filter(fruit => {
        if (fruit.y > activeHeight + fruit.size + 100) {
          // Fruit fell off screen
          if (fruit.type !== "💣") {
            setGameState(prevState => ({
              ...prevState,
              lives: Math.max(0, prevState.lives - 1),
              combo: 0
            }));
          }
          return false;
        }
        return fruit.active || fruit.y < activeHeight + fruit.size;
      });
    });

    // Remove old slice trails
    setSliceTrails(prev => prev.filter(trail => Date.now() - trail.timestamp < 800));

    // Update particles
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vx: particle.vx * 0.95,
      vy: particle.vy * 0.95 + 0.3
    })).filter(particle => {
      const gameAreaElement = gameAreaRef.current;
      if (!gameAreaElement) return false;
      
      const bounds = gameAreaElement.getBoundingClientRect();
      return particle.x > -50 && 
        particle.x < bounds.width + 50 &&
        particle.y > -50 && 
        particle.y < bounds.height + 50;
    }));

    // Spawn new fruits
    if (Math.random() < spawnRate) {
      createFruit();
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [createFruit]);

  // Timer effect
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 0 || prev.lives <= 0) {
          return { ...prev, isPlaying: false, gameOver: true };
        }
        return { ...prev, timeLeft: Math.max(0, prev.timeLeft - 0.1) };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.isPaused]);

  // Game loop effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      gameLoopRef.current = true;
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      gameLoopRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      gameLoopRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gameState.isPlaying, gameState.isPaused]);

  const startGame = () => {
    setGameState({
      score: 0,
      combo: 0,
      lives: 5,
      isPlaying: true,
      isPaused: false,
      gameOver: false,
      timeLeft: 60
    });
    setFruitsList([]);
    setSliceTrails([]);
    setParticles([]);
    fruitIdRef.current = 0;
    particleIdRef.current = 0;
    particleIdRef.current = 0;
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      combo: 0,
      lives: 5,
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
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black border-2 border-red-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border-b border-red-500/30 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-red-500 uppercase tracking-widest">
              FRUIT SLICE
            </h2>
            <button
              onClick={resetGame}
              className="text-xl hover:text-orange-400 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Game Stats */}
          <div className="flex justify-between items-center mt-3 text-white">
            <div className="flex gap-6">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">SCORE</div>
                <div className="text-xl font-bold text-red-500">{gameState.score}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">COMBO</div>
                <div className="text-xl font-bold text-yellow-400">{gameState.combo}x</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">LIVES</div>
                <div className="text-xl font-bold text-green-500">{'❤️'.repeat(gameState.lives)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">TIME</div>
                <div className="text-xl font-bold text-purple-500">{Math.ceil(gameState.timeLeft)}s</div>
              </div>
            </div>
            
            {gameState.isPlaying && (
              <button
                onClick={pauseGame}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                {gameState.isPaused ? '▶️' : '⏸️'}
              </button>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          className="absolute left-0 right-0 top-24 bottom-12 bg-gradient-to-b from-gray-900 to-black overflow-hidden cursor-crosshair select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ touchAction: 'none' }}
        >
          {/* Fruits */}
          {fruitsList.map(fruit => (
            <div
              key={fruit.id}
              className="absolute pointer-events-none"
              style={{
                left: fruit.x,
                top: fruit.y,
                width: fruit.size,
                height: fruit.size,
                transform: `rotate(${fruit.rotation}deg)`,
                fontSize: `${fruit.size * 0.8}px`,
                filter: fruit.type === "💣" 
                  ? "drop-shadow(0 0 15px #ff0000)" 
                  : "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                zIndex: 10
              }}
            >
              {fruit.type}
            </div>
          ))}

          {/* Slice Trails */}
          {sliceTrails.map(trail => (
            <svg
              key={trail.id}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 20 }}
            >
              <polyline
                points={trail.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#ff6b6b"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
                style={{
                  filter: "drop-shadow(0 0 8px #ff6b6b)"
                }}
              />
            </svg>
          ))}

          {/* Current slice trail */}
          {isMouseDown.current && mouseTrail.current.length > 1 && (
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
              <polyline
                points={mouseTrail.current.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
            </svg>
          )}

          {/* Particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                boxShadow: `0 0 8px ${particle.color}`,
                zIndex: 15
              }}
            />
          ))}

          {/* Game Overlay */}
          {!gameState.isPlaying && !gameState.gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-red-500 mb-4 uppercase tracking-widest">
                  FRUIT SLICE
                </h3>
                <p className="text-gray-300 mb-6 max-w-md">
                  Slice fruits with your mouse to score points! Create combos for bonus points. 
                  Avoid bombs - they&apos;ll hurt you!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg border-2 border-red-500 hover:from-red-600 hover:to-red-500 transition-all duration-300 uppercase tracking-widest text-lg"
                >
                  START SLICING
                </button>
              </div>
            </div>
          )}

          {/* Game Over */}
          {gameState.gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-pink-400 mb-4 uppercase tracking-widest">
                  {gameState.lives <= 0 ? "GAME OVER!" : "TIME'S UP!"}
                </h3>
                <p className="text-gray-300 mb-6">
                  Final Score: <span className="text-red-500 font-bold">{gameState.score}</span>
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg border-2 border-red-500 hover:from-red-600 hover:to-red-500 transition-all duration-300 uppercase tracking-widest"
                  >
                    RETRY
                  </button>
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all uppercase tracking-widest"
                  >
                    EXIT
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paused Overlay */}
          {gameState.isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-orange-400 mb-4 uppercase tracking-widest">
                  PAUSED
                </h3>
                <button
                  onClick={pauseGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg border-2 border-red-500 hover:from-red-600 hover:to-red-500 transition-all duration-300 uppercase tracking-widest"
                >
                  RESUME
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 border-t border-red-500/30">
          <div className="text-center text-gray-400 text-sm">
            <span className="text-red-500 font-bold">SLICE</span> fruits with mouse • 
            <span className="text-yellow-400 font-bold"> COMBO</span> for bonus points • 
            <span className="text-red-400 font-bold"> AVOID</span> bombs
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitSliceGame;
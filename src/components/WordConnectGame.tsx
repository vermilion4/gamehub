"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface GameState {
  score: number;
  level: number;
  timeLeft: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  currentWord: string;
  foundWords: string[];
}

interface Letter {
  id: number;
  char: string;
  x: number;
  y: number;
  selected: boolean;
  connected: boolean;
}

const words = [
  "GAME", "PLAY", "FUN", "WIN", "SCORE", "LEVEL", "TIME", "WORD", "LETTER", "CONNECT",
  "PUZZLE", "BRAIN", "THINK", "FAST", "QUICK", "SMART", "CLEVER", "GENIUS", "MIND", "LOGIC",
  "SOLVE", "FIND", "MATCH", "LINK", "JOIN", "UNITE", "MERGE", "COMBINE", "CREATE", "BUILD"
];

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const WordConnectGame = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    timeLeft: 120,
    isPlaying: false,
    isPaused: false,
    gameOver: false,
    currentWord: "",
    foundWords: []
  });

  const [letterGrid, setLetterGrid] = useState<Letter[][]>([]);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  
  const animationRef = useRef<number>(0);
  const letterIdRef = useRef(0);

  const gridSize = 8;
  
  const generateGrid = useCallback(() => {
    const newGrid: Letter[][] = [];
    const newAvailableWords: string[] = [];
    
    // Generate random letters
    for (let i = 0; i < gridSize; i++) {
      newGrid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        newGrid[i][j] = {
          id: letterIdRef.current++,
          char: letters[Math.floor(Math.random() * letters.length)],
          x: i,
          y: j,
          selected: false,
          connected: false
        };
      }
    }
    
    // Try to embed some words
    const wordsToEmbed = words.slice(0, 5 + gameState.level);
    wordsToEmbed.forEach(word => {
      if (Math.random() < 0.7) { // 70% chance to embed each word
        const direction = Math.floor(Math.random() * 8); // 8 directions
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize);
        
        let canEmbed = true;
        const positions: {x: number, y: number}[] = [];
        
        // Check if word can fit
        for (let i = 0; i < word.length; i++) {
          let x = startX;
          let y = startY;
          
          switch (direction) {
            case 0: x += i; break; // right
            case 1: x += i; y += i; break; // diagonal down-right
            case 2: y += i; break; // down
            case 3: x -= i; y += i; break; // diagonal down-left
            case 4: x -= i; break; // left
            case 5: x -= i; y -= i; break; // diagonal up-left
            case 6: y -= i; break; // up
            case 7: x += i; y -= i; break; // diagonal up-right
          }
          
          if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            canEmbed = false;
            break;
          }
          positions.push({x, y});
        }
        
        if (canEmbed) {
          // Embed the word
          for (let i = 0; i < word.length; i++) {
            newGrid[positions[i].x][positions[i].y].char = word[i];
          }
          newAvailableWords.push(word);
        }
      }
    });
    
    setLetterGrid(newGrid);
    setAvailableWords(newAvailableWords);
  }, [gameState.level]);

  const checkWord = useCallback((word: string) => {
    if (availableWords.includes(word) && !gameState.foundWords.includes(word)) {
      const points = word.length * 10 * gameState.level;
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        foundWords: [...prev.foundWords, word],
        currentWord: ""
      }));
      
      // Mark letters as connected
      setLetterGrid(prev => {
        const newGrid = prev.map(row => row.map(letter => ({...letter})));
        selectedLetters.forEach(letter => {
          newGrid[letter.x][letter.y].connected = true;
        });
        return newGrid;
      });
      
      setSelectedLetters([]);
      return true;
    }
    return false;
  }, [availableWords, gameState.foundWords, selectedLetters]);

  const handleLetterClick = (letter: Letter) => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    if (letter.selected) {
      // Deselect letter
      setSelectedLetters(prev => prev.filter(l => l.id !== letter.id));
      setLetterGrid(prev => {
        const newGrid = prev.map(row => row.map(l => ({...l})));
        newGrid[letter.x][letter.y].selected = false;
        return newGrid;
      });
    } else {
      // Select letter
      const newSelected = [...selectedLetters, letter];
      setSelectedLetters(newSelected);
      setLetterGrid(prev => {
        const newGrid = prev.map(row => row.map(l => ({...l})));
        newGrid[letter.x][letter.y].selected = true;
        return newGrid;
      });
      
      // Check if we have a word
      const word = newSelected.map(l => l.char).join("");
      if (word.length >= 3) {
        checkWord(word);
      }
    }
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    // Update timer
    setGameState(prev => {
      if (prev.timeLeft <= 0) {
        return { ...prev, isPlaying: false, gameOver: true };
      }
      return { ...prev, timeLeft: prev.timeLeft - 1/60 };
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft]);

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
      timeLeft: 120,
      isPlaying: true,
      isPaused: false,
      gameOver: false,
      currentWord: "",
      foundWords: []
    });
    setSelectedLetters([]);
    letterIdRef.current = 0;
    generateGrid();
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      timeLeft: 120,
      isPlaying: false,
      isPaused: false,
      gameOver: false,
      currentWord: "",
      foundWords: []
    });
    setSelectedLetters([]);
    setLetterGrid([]);
    setAvailableWords([]);
    letterIdRef.current = 0;
  };

  const currentWord = selectedLetters.map(l => l.char).join("");

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#4ecdc4]/30 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-r from-[#4ecdc4]/20 to-[#44a08d]/20 border-b border-[#4ecdc4]/30 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#4ecdc4] font-[Orbitron,Arial,sans-serif] uppercase tracking-widest">
              WORD CONNECT
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
                <div className="text-2xl font-bold text-[#4ecdc4]">{gameState.score}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">LEVEL</div>
                <div className="text-2xl font-bold text-[#f472b6]">{gameState.level}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">TIME</div>
                <div className="text-2xl font-bold text-[#ffb347]">{Math.ceil(gameState.timeLeft)}s</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">WORDS</div>
                <div className="text-2xl font-bold text-[#10b981]">{gameState.foundWords.length}</div>
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
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="max-w-4xl w-full p-8">
            {/* Current Word Display */}
            {gameState.isPlaying && (
              <div className="text-center mb-8">
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">CURRENT WORD</div>
                <div className="text-4xl font-bold text-[#4ecdc4] font-[Orbitron,Arial,sans-serif] min-h-[3rem]">
                  {currentWord || "..."}
                </div>
              </div>
            )}

            {/* Letter Grid */}
            {letterGrid.length > 0 && (
              <div className="flex justify-center">
                <div className="grid grid-cols-8 gap-2 bg-white/5 p-6 rounded-2xl border border-[#4ecdc4]/30 w-[32rem]">
                  {letterGrid.flat().map((letter) => (
                    <motion.button
                      key={letter.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLetterClick(letter)}
                      className={`w-12 h-12 rounded-lg font-bold text-lg transition-all duration-200 ${
                        letter.selected
                          ? 'bg-[#4ecdc4] text-black shadow-lg'
                          : letter.connected
                          ? 'bg-[#10b981] text-white shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {letter.char}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Found Words */}
            {gameState.foundWords.length > 0 && (
              <div className="mt-8 text-center">
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-4">FOUND WORDS</div>
                <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto">
                  {gameState.foundWords.map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-3 py-1 bg-[#10b981] text-white rounded-full text-sm font-bold"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Game Overlay */}
          {!gameState.isPlaying && !gameState.gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-[#4ecdc4] font-[Orbitron,Arial,sans-serif] mb-4 uppercase tracking-widest">
                  WORD CONNECT
                </h3>
                <p className="text-gray-300 font-[Inter,sans-serif] mb-6 max-w-md">
                  Connect letters to form words! Click letters in sequence to build words. 
                  Find all hidden words before time runs out!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4ecdc4] to-[#44a08d] text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#4ecdc4] hover:from-[#44a08d] hover:to-[#4ecdc4] transition-all duration-300 uppercase tracking-widest text-lg"
                >
                  START GAME
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
                  Final Score: <span className="text-[#4ecdc4] font-bold">{gameState.score}</span>
                </p>
                <p className="text-gray-300 font-[Inter,sans-serif] mb-6">
                  Words Found: <span className="text-[#10b981] font-bold">{gameState.foundWords.length}</span>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4ecdc4] to-[#44a08d] text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#4ecdc4] hover:from-[#44a08d] hover:to-[#4ecdc4] transition-all duration-300 uppercase tracking-widest"
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
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4ecdc4] to-[#44a08d] text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#4ecdc4] hover:from-[#44a08d] hover:to-[#4ecdc4] transition-all duration-300 uppercase tracking-widest"
                >
                  RESUME
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 border-t border-[#4ecdc4]/30">
          <div className="text-center text-gray-400 font-[Inter,sans-serif] text-sm">
            <span className="text-[#4ecdc4] font-bold">CLICK</span> letters to connect • 
            <span className="text-[#10b981] font-bold"> FORM</span> words of 3+ letters • 
            <span className="text-[#ffb347] font-bold"> FIND</span> all hidden words
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WordConnectGame;

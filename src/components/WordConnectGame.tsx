"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface GameState {
  score: number;
  level: number;
  timeLeft: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  foundWords: string[];
  targetWords: string[];
  combo: number;
  maxCombo: number;
}

interface Letter {
  id: number;
  char: string;
  x: number;
  y: number;
  selected: boolean;
  connected: boolean;
  isTarget: boolean;
}

const WORD_LISTS = {
  1: ["CAT", "DOG", "SUN", "FUN", "RUN", "WIN", "BIG", "RED", "HOT", "TOP"],
  2: ["GAME", "PLAY", "FAST", "JUMP", "COOL", "STAR", "BLUE", "FIRE", "ROCK", "GOLD"],
  3: ["BRAIN", "QUICK", "SMART", "POWER", "MAGIC", "HEART", "DREAM", "LIGHT", "STORM", "FLASH"],
  4: ["PUZZLE", "CLEVER", "GENIUS", "WONDER", "BRIGHT", "STRONG", "ENERGY", "MASTER", "LEGEND", "COSMIC"],
  5: ["CONNECT", "VICTORY", "AMAZING", "PERFECT", "DIAMOND", "THUNDER", "CRYSTAL", "SUPREME", "ULTIMATE", "INFINITY"]
};

const WordConnectGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    timeLeft: 180,
    isPlaying: false,
    isPaused: false,
    gameOver: false,
    foundWords: [],
    targetWords: [],
    combo: 0,
    maxCombo: 0
  });

  const [letterGrid, setLetterGrid] = useState<Letter[][]>([]);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [connectionPath, setConnectionPath] = useState<{x: number, y: number}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [showWordEffect, setShowWordEffect] = useState<{word: string, points: number} | null>(null);

  
  const animationRef = useRef<number>(0);
  const letterIdRef = useRef(0);
  const gridSize = 8;

  // Check if two letters are adjacent (including diagonally)
  const areAdjacent = (letter1: Letter, letter2: Letter): boolean => {
    const dx = Math.abs(letter1.x - letter2.x);
    const dy = Math.abs(letter1.y - letter2.y);
    return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
  };

  // Check if the selected path forms a valid connection
  const isValidPath = (letters: Letter[]): boolean => {
    if (letters.length < 2) return true;
    
    for (let i = 1; i < letters.length; i++) {
      if (!areAdjacent(letters[i-1], letters[i])) {
        return false;
      }
    }
    return true;
  };

  const generateGrid = useCallback(() => {
    const newGrid: Letter[][] = [];
    const levelWords = WORD_LISTS[Math.min(gameState.level, 5) as keyof typeof WORD_LISTS] || WORD_LISTS[5];
    
    // Shuffle the word list to ensure random selection and prevent duplicates
    const shuffledWords = [...levelWords].sort(() => Math.random() - 0.5);
    const targetWords = shuffledWords.slice(0, 3 + Math.floor(gameState.level / 2));
    
    // Ensure no duplicate target words (extra safety check)
    const uniqueTargetWords = [...new Set(targetWords)];
    
    // Initialize grid with random letters
    const commonLetters = "AEIOURSTLNMDHBCFGPVWYKJXQZ";
    for (let i = 0; i < gridSize; i++) {
      newGrid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        newGrid[i][j] = {
          id: letterIdRef.current++,
          char: commonLetters[Math.floor(Math.random() * commonLetters.length)],
          x: i,
          y: j,
          selected: false,
          connected: false,
          isTarget: false
        };
      }
    }

    // Place target words in the grid with improved placement logic
    const placedWords: string[] = [];
    const usedPositions = new Set<string>(); // Track used positions to avoid conflicts
    
    uniqueTargetWords.forEach(word => {
      let attempts = 0;
      let placed = false;
      
      while (!placed && attempts < 200) { // Increased attempts
        const direction = Math.floor(Math.random() * 8);
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize);
        
        const positions: {x: number, y: number}[] = [];
        let canPlace = true;
        
        for (let i = 0; i < word.length; i++) {
          let x = startX, y = startY;
          
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
            canPlace = false;
            break;
          }
          
          // Check if position is already used by another word
          const posKey = `${x},${y}`;
          if (usedPositions.has(posKey)) {
            canPlace = false;
            break;
          }
          
          positions.push({x, y});
        }
        
        if (canPlace) {
          // Place the word and mark positions as used
          for (let i = 0; i < word.length; i++) {
            newGrid[positions[i].x][positions[i].y].char = word[i];
            usedPositions.add(`${positions[i].x},${positions[i].y}`);
          }
          placedWords.push(word);
          placed = true;
        }
        attempts++;
      }
      
      // If word couldn't be placed, try a simpler placement strategy
      if (!placed) {
        // Try placing word in a simple horizontal or vertical line
        const simpleDirections = [0, 2, 4, 6]; // right, down, left, up only
        for (const dir of simpleDirections) {
          for (let startX = 0; startX < gridSize; startX++) {
            for (let startY = 0; startY < gridSize; startY++) {
              const positions: {x: number, y: number}[] = [];
              let canPlace = true;
              
              for (let i = 0; i < word.length; i++) {
                let x = startX, y = startY;
                
                switch (dir) {
                  case 0: x += i; break; // right
                  case 2: y += i; break; // down
                  case 4: x -= i; break; // left
                  case 6: y -= i; break; // up
                }
                
                if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
                  canPlace = false;
                  break;
                }
                
                const posKey = `${x},${y}`;
                if (usedPositions.has(posKey)) {
                  canPlace = false;
                  break;
                }
                
                positions.push({x, y});
              }
              
              if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                  newGrid[positions[i].x][positions[i].y].char = word[i];
                  usedPositions.add(`${positions[i].x},${positions[i].y}`);
                }
                placedWords.push(word);
                placed = true;
                break;
              }
            }
            if (placed) break;
          }
          if (placed) break;
        }
      }
    });
    
    // If we still couldn't place all words, regenerate the grid with fewer words
    if (placedWords.length < uniqueTargetWords.length) {
      console.log(`Could only place ${placedWords.length}/${uniqueTargetWords.length} words, regenerating...`);
      // Try again with fewer words
      const fewerWords = uniqueTargetWords.slice(0, Math.max(2, placedWords.length));
      return generateGridWithWords(fewerWords);
    }
    
    setLetterGrid(newGrid);
    setGameState(prev => ({ ...prev, targetWords: placedWords }));
  }, [gameState.level]);

  // Helper function to generate grid with specific words
  const generateGridWithWords = useCallback((words: string[]) => {
    const newGrid: Letter[][] = [];
    
    // Initialize grid with random letters
    const commonLetters = "AEIOURSTLNMDHBCFGPVWYKJXQZ";
    for (let i = 0; i < gridSize; i++) {
      newGrid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        newGrid[i][j] = {
          id: letterIdRef.current++,
          char: commonLetters[Math.floor(Math.random() * commonLetters.length)],
          x: i,
          y: j,
          selected: false,
          connected: false,
          isTarget: false
        };
      }
    }

    const placedWords: string[] = [];
    const usedPositions = new Set<string>();
    
    words.forEach(word => {
      let placed = false;
      
      // Try simple horizontal placement first
      for (let row = 0; row < gridSize && !placed; row++) {
        for (let col = 0; col <= gridSize - word.length && !placed; col++) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            const posKey = `${row},${col + i}`;
            if (usedPositions.has(posKey)) {
              canPlace = false;
              break;
            }
          }
          
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              newGrid[row][col + i].char = word[i];
              usedPositions.add(`${row},${col + i}`);
            }
            placedWords.push(word);
            placed = true;
          }
        }
      }
      
      // If horizontal placement failed, try vertical
      if (!placed) {
        for (let col = 0; col < gridSize && !placed; col++) {
          for (let row = 0; row <= gridSize - word.length && !placed; row++) {
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
              const posKey = `${row + i},${col}`;
              if (usedPositions.has(posKey)) {
                canPlace = false;
                break;
              }
            }
            
            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                newGrid[row + i][col].char = word[i];
                usedPositions.add(`${row + i},${col}`);
              }
              placedWords.push(word);
              placed = true;
            }
          }
        }
      }
    });
    
    setLetterGrid(newGrid);
    setGameState(prev => ({ ...prev, targetWords: placedWords }));
  }, []);

  const checkWord = useCallback((word: string, letters: Letter[]) => {
    if (word.length < 3) return false;
    
    if (gameState.targetWords.includes(word) && !gameState.foundWords.includes(word)) {
      const basePoints = word.length * 10;
      const levelMultiplier = gameState.level;
      const comboBonus = gameState.combo * 5;
      const totalPoints = (basePoints * levelMultiplier) + comboBonus;
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + totalPoints,
        foundWords: [...prev.foundWords, word],
        combo: prev.combo + 1,
        maxCombo: Math.max(prev.maxCombo, prev.combo + 1)
      }));
      
      // Show word effect
      setShowWordEffect({ word, points: totalPoints });
      setTimeout(() => setShowWordEffect(null), 2000);
      
      // Mark letters as connected
      setLetterGrid(prev => {
        const newGrid = prev.map(row => row.map(letter => ({...letter})));
        letters.forEach(letter => {
          newGrid[letter.x][letter.y].connected = true;
        });
        return newGrid;
      });
      
      // Check level completion
      if (gameState.foundWords.length + 1 >= gameState.targetWords.length) {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            level: prev.level + 1,
            timeLeft: prev.timeLeft + 30, // Bonus time
            foundWords: [],
            targetWords: []
          }));
          generateGrid();
        }, 1500);
      }
      
      return true;
    } else {
      // Reset combo on invalid word
      setGameState(prev => ({ ...prev, combo: 0 }));
      return false;
    }
  }, [gameState.targetWords, gameState.foundWords, gameState.combo, gameState.level, generateGrid]);

  const handleLetterMouseDown = (letter: Letter) => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    setIsDragging(true);
    setSelectedLetters([letter]);
    setConnectionPath([{x: letter.x, y: letter.y}]);
    setCurrentWord(letter.char);
    
    setLetterGrid(prev => {
      const newGrid = prev.map(row => row.map(l => ({...l, selected: false})));
      newGrid[letter.x][letter.y].selected = true;
      return newGrid;
    });
  };

  const handleLetterMouseEnter = (letter: Letter) => {
    if (!isDragging || !gameState.isPlaying || gameState.isPaused) return;
    
    const lastSelected = selectedLetters[selectedLetters.length - 1];
    if (!lastSelected || letter.id === lastSelected.id) return;
    
    // Check if already selected (allow backtracking)
    const existingIndex = selectedLetters.findIndex(l => l.id === letter.id);
    if (existingIndex !== -1) {
      // Backtrack to this letter
      const newSelected = selectedLetters.slice(0, existingIndex + 1);
      const newPath = connectionPath.slice(0, existingIndex + 1);
      setSelectedLetters(newSelected);
      setConnectionPath(newPath);
      setCurrentWord(newSelected.map(l => l.char).join(""));
      
      setLetterGrid(prev => {
        const newGrid = prev.map(row => row.map(l => ({...l, selected: false})));
        newSelected.forEach(selectedLetter => {
          newGrid[selectedLetter.x][selectedLetter.y].selected = true;
        });
        return newGrid;
      });
      return;
    }
    
    // Check if adjacent to last selected
    if (areAdjacent(lastSelected, letter)) {
      const newSelected = [...selectedLetters, letter];
      const newPath = [...connectionPath, {x: letter.x, y: letter.y}];
      
      if (isValidPath(newSelected)) {
        setSelectedLetters(newSelected);
        setConnectionPath(newPath);
        setCurrentWord(newSelected.map(l => l.char).join(""));
        
        setLetterGrid(prev => {
          const newGrid = prev.map(row => row.map(l => ({...l})));
          newGrid[letter.x][letter.y].selected = true;
          return newGrid;
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (selectedLetters.length >= 3) {
      const word = selectedLetters.map(l => l.char).join("");
      const isValid = checkWord(word, selectedLetters);
      
      if (!isValid) {
        // Clear selection if word is invalid
        setTimeout(() => {
          setSelectedLetters([]);
          setConnectionPath([]);
          setCurrentWord("");
          setLetterGrid(prev => 
            prev.map(row => row.map(l => ({...l, selected: false})))
          );
        }, 500);
      } else {
        // Clear selection after successful word
        setTimeout(() => {
          setSelectedLetters([]);
          setConnectionPath([]);
          setCurrentWord("");
          setLetterGrid(prev => 
            prev.map(row => row.map(l => ({...l, selected: false})))
          );
        }, 1000);
      }
    } else {
      // Clear selection if word too short
      setSelectedLetters([]);
      setConnectionPath([]);
      setCurrentWord("");
      setLetterGrid(prev => 
        prev.map(row => row.map(l => ({...l, selected: false})))
      );
    }
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    setGameState(prev => {
      if (prev.timeLeft <= 0) {
        return { ...prev, isPlaying: false, gameOver: true };
      }
      return { ...prev, timeLeft: prev.timeLeft - 1/60 };
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused]);

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
      timeLeft: 180,
      isPlaying: true,
      isPaused: false,
      gameOver: false,
      foundWords: [],
      targetWords: [],
      combo: 0,
      maxCombo: 0
    });
    setSelectedLetters([]);
    setConnectionPath([]);
    setCurrentWord("");
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
      timeLeft: 180,
      isPlaying: false,
      isPaused: false,
      gameOver: false,
      foundWords: [],
      targetWords: [],
      combo: 0,
      maxCombo: 0
    });
    setSelectedLetters([]);
    setConnectionPath([]);
    setCurrentWord("");
    setLetterGrid([]);
    letterIdRef.current = 0;
  };

  const goToHome = () => {
    // This will close the game modal and return to the main page
    window.history.back();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg overflow-y-auto overflow-x-hidden">
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative">
        
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-cyan-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-purple-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <div className="sticky top-0 z-20 p-3 sm:p-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-cyan-400/30 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap mb-3 sm:mb-0">
            <h2 className="text-lg sm:text-3xl font-bold text-cyan-400 font-mono uppercase tracking-widest">
              WORD CONNECT
            </h2>
                      
          {/* Game Stats - Responsive Grid */}
          <div className="grid grid-cols-4 sm:flex sm:gap-8 gap-2 items-center text-white font-mono">
            <div className="text-center sm:text-left">
              <div className="text-xs text-gray-400 uppercase tracking-wider">SCORE</div>
              <div className="text-sm sm:text-2xl font-bold text-cyan-400">{gameState.score.toLocaleString()}</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs text-gray-400 uppercase tracking-wider">LEVEL</div>
              <div className="text-sm sm:text-2xl font-bold text-purple-400">{gameState.level}</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs text-gray-400 uppercase tracking-wider">TIME</div>
              <div className={`text-sm sm:text-2xl font-bold ${gameState.timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                {Math.ceil(gameState.timeLeft)}s
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs text-gray-400 uppercase tracking-wider">COMBO</div>
              <div className="text-sm sm:text-2xl font-bold text-green-400">×{gameState.combo}</div>
            </div>
            
           
          </div>
                     <div className="flex gap-2 items-center">
             <button
               onClick={goToHome}
               className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 hover:scale-105 text-sm font-mono"
             >
               ← HOME
             </button>
             {gameState.isPlaying && (
               <div className="col-span-4 sm:col-span-1 sm:ml-auto mt-2 sm:mt-0 flex justify-center">
                 <button
                   onClick={pauseGame}
                   className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 hover:scale-105 text-sm"
                 >
                   {gameState.isPaused ? '▶️' : '⏸️'}
                 </button>
               </div>
             )}
             <button
               onClick={resetGame}
               className="text-xl sm:text-2xl hover:text-red-400 transition-colors duration-300 p-2"
             >
               ✕
             </button>
           </div>
          </div>

        </div>

        {/* Game Content */}
        <div className="relative p-3 sm:p-6 pb-8 sm:pb-6">
          
          <div>
          {/* Current Word Display */}
          {gameState.isPlaying && (
            <div className="text-center mb-4 sm:mb-5">
              <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-2">CURRENT WORD</div>
              <div className={`text-xl sm:text-4xl font-bold font-mono min-h-[2rem] sm:min-h-[3rem] transition-all duration-300 ${
                currentWord.length >= 3 && gameState.targetWords.includes(currentWord) && !gameState.foundWords.includes(currentWord)
                  ? 'text-green-400 scale-110' 
                  : currentWord.length >= 3 
                  ? 'text-red-400' 
                  : 'text-cyan-400'
              }`}>
                {currentWord || "START CONNECTING..."}
              </div>
            </div>
          )}

          {/* Target Words */}
          {gameState.isPlaying && gameState.targetWords.length > 0 && (
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-3">FIND THESE WORDS</div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
                {gameState.targetWords.map((word, index) => (
                  <div
                    key={index}
                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-500 ${
                      gameState.foundWords.includes(word)
                        ? 'bg-green-500 text-white border-green-400 scale-110'
                        : 'bg-gray-800 text-gray-300 border-gray-600'
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>

          {/* Letter Grid - Responsive */}
          {letterGrid.length > 0 && (
            <div className="flex justify-center px-2 md:scale-75 origin-top" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
              <div className="relative bg-black/30 p-3 sm:p-6 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-cyan-400/30 backdrop-blur-sm max-w-full overflow-hidden">
                
                {/* Responsive Grid */}
                <div 
                  id="letter-grid"
                  className="grid grid-cols-8 gap-1 sm:gap-2 md:gap-2 lg:gap-3 w-full max-w-[90vw] sm:max-w-[28rem] md:max-w-[32rem] lg:max-w-[36rem] xl:max-w-[40rem] relative"
                >
                  
                  
                  {letterGrid.flat().map((letter) => (
                    <button
                      key={letter.id}
                      onMouseDown={() => handleLetterMouseDown(letter)}
                      onMouseEnter={() => handleLetterMouseEnter(letter)}
                      onTouchStart={() => handleLetterMouseDown(letter)}
                      className={`w-8 h-8 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg md:text-lg lg:text-xl transition-all duration-200 relative z-10 select-none touch-manipulation ${
                        letter.selected
                          ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/50 scale-110 ring-2 ring-cyan-300'
                          : letter.connected
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                          : 'bg-slate-700/60 text-white hover:bg-slate-600/80 border border-slate-500/30'
                      } hover:scale-105 cursor-pointer active:scale-95`}
                      style={{userSelect: 'none'}}
                    >
                      {letter.char}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Word Effect */}
          {showWordEffect && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none text-center">
              <div className="text-3xl sm:text-6xl font-bold text-green-400 animate-bounce">
                {showWordEffect.word}
              </div>
              <div className="text-lg sm:text-2xl font-bold text-yellow-400 animate-pulse">
                +{showWordEffect.points}
              </div>
            </div>
          )}
        </div>

        {/* Game Start Overlay */}
        {!gameState.isPlaying && !gameState.gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-40 p-4">
            <div className="text-center max-w-md w-full">
              <h3 className="text-3xl sm:text-5xl font-bold text-cyan-400 font-mono mb-6 uppercase tracking-widest animate-pulse">
                WORD CONNECT
              </h3>
              <p className="text-gray-300 mb-8 text-sm sm:text-lg leading-relaxed px-4">
                Drag to connect adjacent letters and form words! Find all the target words before time runs out. 
                Build combos for bonus points!
              </p>
              <button
                onClick={startGame}
                className="px-8 sm:px-12 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold font-mono shadow-lg border-2 border-cyan-400 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 uppercase tracking-widest text-lg sm:text-xl hover:scale-110 hover:shadow-cyan-400/50"
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-40 p-4">
            <div className="text-center max-w-md w-full">
              <h3 className="text-2xl sm:text-4xl font-bold text-red-400 font-mono mb-6 uppercase tracking-widest animate-pulse">
                GAME OVER
              </h3>
              <div className="space-y-3 sm:space-y-4 mb-8 text-sm sm:text-base">
                <p className="text-gray-300">
                  Final Score: <span className="text-cyan-400 font-bold text-lg sm:text-2xl">{gameState.score.toLocaleString()}</span>
                </p>
                <p className="text-gray-300">
                  Level Reached: <span className="text-purple-400 font-bold text-lg sm:text-xl">{gameState.level}</span>
                </p>
                <p className="text-gray-300">
                  Max Combo: <span className="text-green-400 font-bold text-lg sm:text-xl">×{gameState.maxCombo}</span>
                </p>
                <p className="text-gray-300">
                  Words Found: <span className="text-yellow-400 font-bold text-lg sm:text-xl">{gameState.foundWords.length}</span>
                </p>
              </div>
                             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button
                   onClick={startGame}
                   className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold font-mono shadow-lg border-2 border-cyan-400 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 uppercase tracking-widest hover:scale-105"
                 >
                   PLAY AGAIN
                 </button>
                 <button
                   onClick={goToHome}
                   className="px-6 sm:px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-bold font-mono transition-all uppercase tracking-widest hover:scale-105"
                 >
                   HOME
                 </button>
               </div>
            </div>
          </div>
        )}


                 {/* Paused Overlay */}
         {gameState.isPaused && (
           <div className="sticky bottom-0 h-screen flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
             <div className="text-center max-w-md w-full">
               <h3 className="text-3xl sm:text-5xl font-bold text-yellow-400 font-mono mb-6 uppercase tracking-widest animate-pulse">
                 PAUSED
               </h3>
               <p className="text-gray-300 mb-8 text-sm sm:text-lg leading-relaxed px-4">
                 Game is paused. Click resume to continue playing!
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button
                   onClick={pauseGame}
                   className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold font-mono shadow-lg border-2 border-cyan-400 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 uppercase tracking-widest hover:scale-105"
                 >
                   RESUME
                 </button>
                 <button
                   onClick={goToHome}
                   className="px-6 sm:px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-bold font-mono transition-all uppercase tracking-widest hover:scale-105"
                 >
                   HOME
                 </button>
               </div>
             </div>
           </div>
         )}
      </div>
        {/* Instructions - Fixed at Bottom */}
        <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 bg-black/80 border-t border-cyan-400/30 backdrop-blur-sm z-10">
          <div className="text-center text-gray-400 font-mono text-xs sm:text-sm">
            <span className="text-cyan-400 font-bold">DRAG</span> to connect adjacent letters • 
            <span className="text-green-400 font-bold"> FORM</span> target words • 
            <span className="text-yellow-400 font-bold"> BUILD</span> combos for bonus points
          </div>
        </div>
    </div>
  );
};

export default WordConnectGame;
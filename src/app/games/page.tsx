"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  path: string;
  difficulty: string;
}

const games: GameCard[] = [
  {
    id: "neural-hack",
    title: "Neural Hack",
    description: "Click floating neural nodes to hack the system. Don't let them reach the bottom!",
    icon: "🧠",
    color: "#00eaff",
    gradient: "from-[#00eaff] to-[#0099bb]",
    path: "/games/neural-hack",
    difficulty: "Medium"
  },
  {
    id: "fruit-slice",
    title: "Fruit Slice",
    description: "Slice fruits in mid-air with your mouse. Create combos for higher scores!",
    icon: "🍎",
    color: "#ff6b6b",
    gradient: "from-[#ff6b6b] to-[#ee5a52]",
    path: "/games/fruit-slice",
    difficulty: "Easy"
  },
  {
    id: "word-connect",
    title: "Word Connect",
    description: "Connect letters to form words. Challenge your vocabulary and speed!",
    icon: "🔤",
    color: "#4ecdc4",
    gradient: "from-[#4ecdc4] to-[#44a08d]",
    path: "/games/word-connect",
    difficulty: "Hard"
  }
];

const GamesHub = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="relative p-8">
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-bold text-white font-[Orbitron,Arial,sans-serif] uppercase tracking-widest"
          >
            Game Hub
          </motion.h1>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold font-[Orbitron,Arial,sans-serif] transition-all uppercase tracking-widest"
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 font-[Inter,sans-serif] mt-4 max-w-2xl"
        >
          Choose your challenge from our collection of mind-bending games. Each game offers unique mechanics and increasing difficulty levels.
        </motion.p>
      </div>

      {/* Games Grid */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer"
              onClick={() => router.push(game.path)}
            >
              <div className="relative h-80 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 overflow-hidden backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(${game.color}20 1px, transparent 1px),
                      linear-gradient(90deg, ${game.color}20 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-between">
                  {/* Header */}
                  <div className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {game.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white font-[Orbitron,Arial,sans-serif] uppercase tracking-wider mb-2">
                      {game.title}
                    </h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${game.gradient}`}>
                      {game.difficulty}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 font-[Inter,sans-serif] text-center leading-relaxed">
                    {game.description}
                  </p>

                  {/* Play Button */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${game.gradient} text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300 uppercase tracking-widest group-hover:shadow-2xl`}>
                      <span>Play Now</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${game.color}20 0%, transparent 70%)`
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="px-8 py-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#00eaff] font-[Orbitron,Arial,sans-serif]">
                {games.length}
              </div>
              <div className="text-gray-400 font-[Inter,sans-serif] uppercase tracking-wider text-sm">
                Games Available
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f472b6] font-[Orbitron,Arial,sans-serif]">
                3
              </div>
              <div className="text-gray-400 font-[Inter,sans-serif] uppercase tracking-wider text-sm">
                Difficulty Levels
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ffb347] font-[Orbitron,Arial,sans-serif]">
                ∞
              </div>
              <div className="text-gray-400 font-[Inter,sans-serif] uppercase tracking-wider text-sm">
                Hours of Fun
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesHub; 
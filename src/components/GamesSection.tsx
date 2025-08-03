'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import GameCard from './GameCard';

const GamesSection = () => {
  const router = useRouter();
  
  const games = [
    {
      id: 'fruit-slice',
      title: 'Fruit Slice',
      description: 'Slice fruits in mid-air with your mouse. Create combos for higher scores!',
      icon: '🍎',
      color: '#ff6b6b',
      gradient: 'from-[#ff6b6b] to-[#ee5a52]',
      difficulty: 'Easy'
    },
    {
      id: 'neural-hack',
      title: 'Neural Hack',
      description: 'Click floating neural nodes to hack the system. Don\'t let them reach the bottom!',
      icon: '🧠',
      color: '#00eaff',
      gradient: 'from-[#00eaff] to-[#0099bb]',
      difficulty: 'Medium'
    },
    {
      id: 'word-connect',
      title: 'Word Connect',
      description: 'Connect letters to form words. Challenge your vocabulary and speed!',
      icon: '🔤',
      color: '#4ecdc4',
      gradient: 'from-[#4ecdc4] to-[#44a08d]',
      difficulty: 'Hard'
    },
  ];

  const handleGameClick = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };

  return (
    <section id="games" className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 text-center"
        >
          <h2 className="font-orbitron text-3xl font-bold text-white md:text-4xl">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">FEATURED</span> GAMES
          </h2>
          <div className="mx-auto mt-2 h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Dive into our collection of immersive games designed to challenge your skills and entertain.
            Each game offers a unique experience with stunning visuals and engaging gameplay.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <GameCard
                title={game.title}
                description={game.description}
                icon={game.icon}
                color={game.color}
                gradient={game.gradient}
                difficulty={game.difficulty}
                onClick={() => handleGameClick(game.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
    </section>
  );
};

export default GamesSection;
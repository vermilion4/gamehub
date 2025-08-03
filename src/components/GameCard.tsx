'use client';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  difficulty: string;
  onClick: () => void;
}

const GameCard = ({ title, description, icon, color, gradient, difficulty, onClick }: GameCardProps) => {

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative h-80 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 overflow-hidden backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(${color}20 1px, transparent 1px),
              linear-gradient(90deg, ${color}20 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Content */}
        <div className="relative h-full p-6 flex flex-col justify-between">
          {/* Header */}
          <div className="text-center">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <h3 className="text-2xl font-bold text-white font-[Orbitron,Arial,sans-serif] uppercase tracking-wider mb-2">
              {title}
            </h3>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient}`}>
              {difficulty}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 font-[Inter,sans-serif] text-center leading-relaxed">
            {description}
          </p>

          {/* Play Button */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300 uppercase tracking-widest group-hover:shadow-2xl`}>
              <span>Play Now</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`
          }}
        />
      </div>
    </motion.div>
  );
};

export default GameCard;
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface HeroSectionProps {
  onPlayClick: () => void;
  onEventsClick: () => void;
}

const HeroSection = ({ onPlayClick, onEventsClick }: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const landscapeImages = [
    "/games/landscape.jpg",
    "/games/landscape2.jpg", 
    "/games/landscape3.jpg"
  ];

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % landscapeImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = 1 - Math.min(1, scrollY / 700);
      const translateY = scrollY * 0.5;
      
      heroRef.current.style.opacity = opacity.toString();
      heroRef.current.style.transform = `translateY(${translateY}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={landscapeImages[currentImageIndex]}
            alt="Gaming Landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </motion.div>
      </div>

      {/* Animated overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero content */}
      <div ref={heroRef} className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="font-orbitron text-4xl font-bold tracking-wider text-white md:text-6xl lg:text-7xl">
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">PLAY BEYOND</span>
            <span className="mt-2 block text-white">REALITY</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 max-w-md text-lg text-gray-300 md:text-xl"
        >
          Your ultimate destination for next-gen gaming experiences
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            onClick={onPlayClick}
            className="group relative overflow-hidden rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 font-orbitron text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-cyan-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              PLAY GAMES
            </span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 group-hover:translate-y-0"></span>
          </motion.button>

          <motion.button
            onClick={onEventsClick}
            className="group relative overflow-hidden rounded-md border-2 border-cyan-500 px-8 py-3 font-orbitron text-lg font-bold text-white transition-all duration-300 hover:bg-cyan-500/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            JOIN EVENTS
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col items-center"
          >
            <span className="mb-2 text-sm text-gray-400">SCROLL TO EXPLORE</span>
            <div className="h-10 w-6 rounded-full border border-gray-500 p-1">
              <motion.div
                className="h-2 w-2 rounded-full bg-cyan-400"
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
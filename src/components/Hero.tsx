"use client";
import { motion } from "framer-motion";
import React from "react";
import TopNavBar from "./TopNavBar";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative min-h-screen text-white">
      <TopNavBar />
      {/* Blended Hero Background */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
        {/* Left: Cyberpunk City (diagonal left) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url(/games/landscape2.jpg)',
            clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0% 100%)',
          }}
        />
        {/* Right: Sci-fi Landscape (diagonal right) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url(/games/landscape3.jpg)',
            clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)',
          }}
        />
        {/* Diagonal gradient for blending */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{
          background: 'linear-gradient(105deg, transparent 45%, rgba(0,0,0,0.7) 50%, transparent 55%)',
        }} />
        {/* Subtle dark overlay for readability */}
        <div className="absolute inset-0 w-full h-full bg-black/60" />
      </div>
      <div className="pt-24">
        <main className="z-20 flex items-center justify-center gap-12 w-full max-w-[1800px] px-6 py-12 min-h-[80vh] mx-auto relative">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex-1 flex flex-col items-center md:items-start gap-8 z-10"
          >
            {/* Modern Cyber Hero Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-col gap-2 mb-4"
            >
              <motion.span
                className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-widest text-[#00eaff] drop-shadow-[0_2px_24px_#00eaffcc] font-[Orbitron,Arial,sans-serif] text-left"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                whileHover={{
                  x: [0, -4, 4, -2, 2, 0],
                  opacity: [1, 0.8, 0.8, 1, 1, 1],
                  transition: { duration: 0.4, repeat: Infinity, repeatType: 'reverse' },
                }}
              >
                THE ULTIMATE GAMING HUB
              </motion.span>
              <motion.span
                className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.3em] text-[#ffb347] drop-shadow-[0_2px_12px_#ffb34799] font-[Orbitron,Arial,sans-serif] text-left"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.7, type: 'spring' }}
              >
                IN THE HEART OF LAGOS
              </motion.span>
            </motion.div>
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-xl sm:text-2xl text-grey-200 max-w-xl text-left font-[Inter,sans-serif] mb-2"
            >
              Step into a world where fantasy meets neon. Play, compete, and connect with gamers at Nigeria&apos;s most electrifying gaming destination.
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.5, type: 'spring' }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              <Link href="/games">
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: "0 0 24px #f472b6" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-12 py-4 rounded-full bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white font-extrabold text-xl shadow-lg border-2 border-[#f472b6] hover:from-[#ec4899] hover:to-[#f472b6] transition-all duration-300 font-[Orbitron,Arial,sans-serif] tracking-widest uppercase cursor-pointer"
                >
                  🎮 PLAY GAMES
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
          {/* Bottom-right hero text */}
          <div className="absolute bottom-10 right-10 z-30 flex flex-col items-end gap-2 bg-black/60 px-6 py-4 rounded-xl shadow-lg backdrop-blur-md">
            <span className="text-base sm:text-lg font-[Orbitron,Arial,sans-serif] text-[#00eaff] tracking-widest uppercase">Open Daily: 10am – 10pm</span>
            <span className="text-lg sm:text-xl font-[Orbitron,Arial,sans-serif] text-[#ffb347] font-bold tracking-widest uppercase">Join the Lagos Gaming Revolution</span>
          </div>
        </main>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-t from-black/60 to-transparent z-10" />
    </div>
  )
}

export default Hero

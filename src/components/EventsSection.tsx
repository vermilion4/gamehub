"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// Animated event card background component
function EventPortal() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.8}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <ringGeometry args={[1.5, 2, 32]} />
        <MeshDistortMaterial 
          color="#00eaff" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#00eaff" 
          emissiveIntensity={0.4}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

const events = [
  {
    name: "NEURAL SYNC CHAMPIONSHIP",
    date: "July 20, 2024",
    time: "18:00 - 02:00",
    desc: "Enter the quantum arena where thoughts become weapons. Compete in neural-linked combat simulations across multiple dimensions. Grand prize: Custom neural interface and 50,000 crypto-credits.",
    category: "CYBER-ESPORTS",
    icon: "🧠",
    color: "from-cyan-400 via-blue-500 to-fuchsia-500",
    glow: "#00eaff",
    participants: "64/128",
    prize: "50K CREDITS"
  },
  {
    name: "HOLOGRAPHIC BATTLE ROYALE",
    date: "August 5, 2024",
    time: "20:00 - 04:00",
    desc: "Fight in fully immersive holographic arenas where reality and simulation blur. Command armies, cast digital spells, and hack your opponents' systems in real-time.",
    category: "HOLO-ARENA",
    icon: "⚡",
    color: "from-yellow-400 via-orange-500 to-pink-500",
    glow: "#ffb347",
    participants: "32/64",
    prize: "HOLO-DISPLAY"
  },
  {
    name: "CYBER-MAGE ACADEMY OPEN",
    date: "August 19, 2024",
    time: "14:00 - 22:00",
    desc: "Learn the ancient arts of digital sorcery. Master code-casting, reality manipulation, and interdimensional travel. Earn your cyber-mage certification and unlock exclusive content.",
    category: "EDUCATION",
    icon: "🔮",
    color: "from-indigo-500 via-purple-500 to-cyan-400",
    glow: "#f472b6",
    participants: "100/200",
    prize: "MAGE CERT"
  },
  {
    name: "QUANTUM DIMENSION CUP",
    date: "September 2, 2024",
    time: "16:00 - 00:00",
    desc: "Navigate through infinite parallel universes in this mind-bending tournament. Each round takes place in a different dimension with unique physics and rules.",
    category: "QUANTUM",
    icon: "🌌",
    color: "from-green-400 via-emerald-500 to-teal-400",
    glow: "#10b981",
    participants: "16/32",
    prize: "DIMENSION KEY"
  }
];

const EventCard = ({ event, index }: { event: typeof events[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.8 }}
    className={`relative group cursor-pointer`}
  >
    {/* 3D Background for each card */}
    <div className="absolute inset-0 w-full h-96 opacity-30">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color={event.glow} />
        <EventPortal />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>

    {/* Card Content */}
    <div className={`relative z-10 p-8 rounded-3xl bg-gradient-to-br ${event.color} shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-500 h-96 flex flex-col justify-between`}
         style={{ boxShadow: `0 8px 40px ${event.glow}40` }}>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 rounded-3xl backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{event.icon}</div>
          <div className="text-right">
            <div className="text-xs font-bold text-white/80 font-[Orbitron,Arial,sans-serif] uppercase tracking-wider mb-1">
              {event.category}
            </div>
            <div className="text-sm text-white/90 font-[Inter,sans-serif]">
              {event.participants}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white font-[Orbitron,Arial,sans-serif] mb-3 drop-shadow-lg leading-tight">
          {event.name}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-lg text-[#ffb347] font-[Orbitron,Arial,sans-serif] font-bold">
            {event.date}
          </span>
          <span className="text-sm text-white/80 font-[Inter,sans-serif]">
            {event.time}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-100/90 font-[Inter,sans-serif] text-sm leading-relaxed mb-4 flex-1">
          {event.desc}
        </p>

        {/* Prize */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-white/70 font-[Inter,sans-serif] uppercase tracking-wider">
            GRAND PRIZE
          </div>
          <div className="text-lg font-bold text-white font-[Orbitron,Arial,sans-serif]">
            {event.prize}
          </div>
        </div>

        {/* Register Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-lg text-white font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-white/30 hover:border-white/50 hover:bg-white/30 transition-all duration-300 uppercase tracking-widest text-sm"
        >
          ENTER PORTAL
        </motion.button>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  </motion.div>
);

const EventsSection = () => (
  <section id="events" className="relative w-full py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
    {/* Animated background grid */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 179, 71, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 179, 71, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        animation: 'gridMove 15s linear infinite'
      }} />
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#ffb347] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>

    <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-widest text-transparent bg-gradient-to-r from-[#ffb347] via-[#f472b6] to-[#00eaff] bg-clip-text font-[Orbitron,Arial,sans-serif] mb-6 drop-shadow-[0_0_20px_#ffb347]">
          QUANTUM EVENTS
        </h2>
        <p className="text-xl text-gray-400 font-[Inter,sans-serif] max-w-3xl mx-auto">
          Step through the digital veil and compete in interdimensional tournaments where <span className="text-[#00eaff] font-bold">reality bends</span> and <span className="text-[#f472b6] font-bold">magic flows through code</span>.
        </p>
      </motion.div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((event, index) => (
          <EventCard key={event.name} event={event} index={index} />
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center mt-16 p-8 rounded-3xl bg-black/60 backdrop-blur-lg border border-[#ffb347]/30"
      >
        <div className="text-2xl font-bold font-[Orbitron,Arial,sans-serif] text-[#ffb347] mb-4 uppercase tracking-widest">
          ALL PORTALS ARE ACTIVE
        </div>
        <div className="text-gray-300 font-[Inter,sans-serif] mb-6">
          <span className="text-[#00eaff] font-bold">Neural sync required</span> • <span className="text-[#f472b6] font-bold">Holographic gear provided</span> • <span className="text-[#10b981] font-bold">24/7 support</span>
        </div>
        <div className="text-sm text-gray-500 font-[Inter,sans-serif]">
          Enter the matrix • Compete across dimensions • Claim your destiny
        </div>
      </motion.div>
    </div>

    <style jsx>{`
      @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(40px, 40px); }
      }
    `}</style>
  </section>
);

export default EventsSection; 
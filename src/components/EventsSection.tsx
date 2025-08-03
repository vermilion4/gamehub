'use client';

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

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

const EventsSection = () => {
  const [activeEvent, setActiveEvent] = useState(0);
  
  return (
    <section id="events" className="relative py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 text-center"
        >
          <h2 className="font-orbitron text-3xl font-bold text-white md:text-4xl">
            QUANTUM <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">EVENTS</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-20 bg-gradient-to-r from-pink-500 to-purple-500"></div>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Step through the digital veil and compete in interdimensional tournaments where 
            <span className="text-cyan-400 font-bold"> reality bends</span> and 
            <span className="text-pink-400 font-bold"> magic flows through code</span>.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Event Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col space-y-4"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.name}
                className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ${activeEvent === index ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20' : 'border-gray-800 bg-gray-900/50 hover:border-pink-500/50'}`}
                onClick={() => setActiveEvent(index)}
                whileHover={{ x: activeEvent !== index ? 5 : 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-orbitron text-lg font-bold text-white">{event.name}</h3>
                  <div className={`h-3 w-3 rounded-full ${activeEvent === index ? 'bg-pink-500' : 'bg-gray-700'}`}></div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-3">{event.date}</span>
                  <Clock size={14} className="mr-1" />
                  <span>{event.time}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
            className="relative h-96 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50"
          >
            {events.map((event, index) => (
              <div
                key={event.name}
                className={`absolute inset-0 transition-opacity duration-500 ${activeEvent === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 p-6">
                  <div className="relative z-10 flex h-full flex-col justify-end">
                    <div className="mb-2 text-sm font-bold uppercase tracking-wider text-pink-400">{event.category}</div>
                    <h3 className="font-orbitron text-2xl font-bold text-white">{event.name}</h3>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-300">
                        <Calendar size={16} className="mr-2 text-pink-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock size={16} className="mr-2 text-pink-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users size={16} className="mr-2 text-pink-400" />
                        <span>{event.participants}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <span className="mr-2 text-2xl">{event.icon}</span>
                        <span>{event.prize}</span>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-gray-300">{event.desc}</p>
                    
                    <motion.button
                      className="mt-6 flex w-full items-center justify-center rounded-md bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 font-orbitron text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:shadow-pink-500/40"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ENTER PORTAL
                      <ExternalLink size={14} className="ml-2" />
                    </motion.button>
                  </div>
                </div>
                
                {/* 3D Background */}
                <div className="absolute inset-0 opacity-30">
                  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[5, 5, 5]} intensity={1} color={event.glow} />
                    <EventPortal />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                  </Canvas>
                </div>
              </div>
            ))}
            
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-pink-500/20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-purple-500/20 blur-xl" />
          </motion.div>
        </div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 rounded-lg border border-pink-500/30 bg-black/60 p-8 text-center backdrop-blur-lg"
        >
          <div className="mb-4 font-orbitron text-2xl font-bold uppercase tracking-widest text-pink-400">
            ALL PORTALS ARE ACTIVE
          </div>
          <div className="mb-6 text-gray-300">
            <span className="font-bold text-cyan-400">Neural sync required</span> • 
            <span className="font-bold text-pink-400">Holographic gear provided</span> • 
            <span className="font-bold text-green-400">24/7 support</span>
          </div>
          <div className="text-sm text-gray-500">
            Enter the matrix • Compete across dimensions • Claim your destiny
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
    </section>
  );
};

export default EventsSection;
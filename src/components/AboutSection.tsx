"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// Animated glitch text component
const GlitchText = ({ children, className }: { children: string; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-0 text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 bg-clip-text animate-pulse">
        {children}
      </span>
      <span className="relative text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 bg-clip-text">
        {children}
      </span>
      <span className="absolute inset-0 text-transparent bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text animate-pulse" style={{ animationDelay: '0.1s' }}>
        {children}
      </span>
    </div>
  );
};

// Enhanced 3D objects
function CyberCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <MeshDistortMaterial 
          color="#00eaff" 
          metalness={0.9} 
          roughness={0.1} 
          emissive="#00eaff" 
          emissiveIntensity={0.5}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function HolographicSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.8}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color="#f472b6" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#f472b6" 
          emissiveIntensity={0.4}
          distort={0.2}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function EnergyRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={1.8} floatIntensity={2.2}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusGeometry args={[2, 0.3, 16, 100]} />
        <MeshDistortMaterial 
          color="#ffb347" 
          metalness={0.7} 
          roughness={0.15} 
          emissive="#ffb347" 
          emissiveIntensity={0.6}
          distort={0.4}
          speed={3}
        />
      </mesh>
    </Float>
  );
}

const features = [
  {
    title: "NEURAL-LINK VR ARENAS",
    desc: "Dive into fully immersive neural-sync experiences where your thoughts become commands. Battle dragons in crystal caves or hack corporate mainframes in neon-lit cyberpunk slums.",
    color: "from-cyan-400 via-blue-500 to-fuchsia-500",
    icon: "🧠",
    glow: "#00eaff"
  },
  {
    title: "HOLOGRAPHIC BATTLE STATIONS",
    desc: "Command your fleet from floating holographic displays. Multi-dimensional strategy games where reality and simulation blur into one seamless experience.",
    color: "from-yellow-400 via-orange-500 to-pink-500",
    icon: "⚡",
    glow: "#ffb347"
  },
  {
    title: "QUANTUM ESPORTS LEAGUES",
    desc: "Compete in interdimensional tournaments where magic spells meet quantum algorithms. Win crypto-credits, rare NFTs, and legendary status across the metaverse.",
    color: "from-indigo-500 via-purple-500 to-cyan-400",
    icon: "🎮",
    glow: "#f472b6"
  },
  {
    title: "CYBER-MAGE ACADEMY",
    desc: "Train in the ancient arts of digital sorcery. Learn to code reality, cast spells through code, and master the balance between technology and mysticism.",
    color: "from-green-400 via-emerald-500 to-teal-400",
    icon: "🔮",
    glow: "#10b981"
  }
];

const stats = [
  { value: "99.9%", label: "NEURAL SYNC RATE" },
  { value: "24/7", label: "HOLOGRAPHIC SUPPORT" },
  { value: "∞", label: "DIMENSIONS ACCESSIBLE" },
  { value: "1337", label: "ACTIVE CYBER-MAGES" }
];

const AboutSection = () => (
  <section id="about" className="relative w-full min-h-screen py-32 flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
    {/* Animated background grid */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 234, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 234, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }} />
    </div>

    {/* Enhanced 3D background */}
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} shadows>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00eaff" />
        <pointLight position={[-5, -5, -5]} intensity={1} color="#f472b6" />
        <pointLight position={[5, -5, 5]} intensity={1} color="#ffb347" />
        
        <CyberCube />
        <HolographicSphere />
        <EnergyRing />
        
        {/* Additional floating elements */}
        <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.8} position={[-4, 3, -3]}>
          <mesh>
            <octahedronGeometry args={[0.8]} />
            <MeshDistortMaterial 
              color="#10b981" 
              metalness={0.8} 
              roughness={0.2} 
              emissive="#10b981" 
              emissiveIntensity={0.3}
              distort={0.2}
              speed={2}
            />
          </mesh>
        </Float>
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>

    {/* Main content */}
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <GlitchText className="text-6xl sm:text-8xl font-black uppercase tracking-widest font-[Orbitron,Arial,sans-serif] drop-shadow-[0_0_30px_#00eaff] mb-6">
          FANTASY QUEST
        </GlitchText>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl sm:text-3xl text-gray-300 font-[Inter,sans-serif] mb-8"
        >
          <span className="text-[#00eaff] font-bold">LAGOS</span> • <span className="text-[#f472b6] font-bold">CYBERPUNK</span> • <span className="text-[#ffb347] font-bold">FANTASY</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl text-gray-400 font-[Inter,sans-serif] max-w-4xl mx-auto leading-relaxed"
        >
          Welcome to the nexus where <span className="text-[#00eaff] font-bold">digital sorcery</span> meets <span className="text-[#f472b6] font-bold">quantum reality</span>. 
          In this cyberpunk-fantasy realm, ancient magic flows through neural networks, and every game is a portal to infinite dimensions.
        </motion.p>
      </motion.div>

      {/* Stats section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-6 rounded-2xl bg-black/40 backdrop-blur-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-all">
            <div className="text-3xl font-bold text-[#00eaff] font-[Orbitron,Arial,sans-serif] mb-2">{stat.value}</div>
            <div className="text-sm text-gray-400 font-[Inter,sans-serif] uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
            className={`relative p-8 rounded-3xl bg-gradient-to-br ${feature.color} shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-500 group`}
            style={{ 
              boxShadow: `0 8px 40px ${feature.glow}40`,
              background: `linear-gradient(135deg, ${feature.color.split(' ').join(', ')})`
            }}
          >
            <div className="absolute inset-0 bg-black/20 rounded-3xl backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <div className="text-2xl font-bold font-[Orbitron,Arial,sans-serif] text-white mb-4 drop-shadow-lg">
                {feature.title}
              </div>
              <div className="text-gray-100/90 font-[Inter,sans-serif] leading-relaxed">
                {feature.desc}
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>
        ))}
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="text-center mt-16 p-8 rounded-3xl bg-black/60 backdrop-blur-lg border border-cyan-400/30"
      >
        <div className="text-2xl font-bold font-[Orbitron,Arial,sans-serif] text-[#00eaff] mb-4 uppercase tracking-widest">
          JOIN THE CYBER-MAGE REVOLUTION
        </div>
        <div className="text-gray-300 font-[Inter,sans-serif] mb-6">
          <span className="text-[#ffb347] font-bold">Victoria Island, Lagos</span> • <span className="text-[#f472b6] font-bold">24/7 Access</span> • <span className="text-[#10b981] font-bold">Neural Sync Ready</span>
        </div>
        <div className="text-sm text-gray-500 font-[Inter,sans-serif]">
          Enter the matrix • Hack reality • Cast digital spells
        </div>
      </motion.div>
    </div>

    <style jsx>{`
      @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
      }
    `}</style>
  </section>
);

export default AboutSection; 
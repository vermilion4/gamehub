'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';

// Animated glitch text component
const GlitchText = ({ text }: { text: string }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const scramble = (element: HTMLHeadingElement) => {
    let iteration = 0;
    const originalText = text;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);
  };

  if (isInView && ref.current) {
    scramble(ref.current);
  }

  return (
    <h2 
      ref={ref} 
      className="font-orbitron text-3xl font-bold text-white md:text-4xl"
    >
      {text}
    </h2>
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

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-center"
        >
          <GlitchText text="ABOUT GAMEHUB" />
          <div className="mx-auto mt-2 h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 items-center">
          {/* 3D Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="h-[400px] w-full rounded-lg bg-black/30 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Glow effects */}
            <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"></div>
            
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} color="#8b5cf6" />
              <pointLight position={[-5, -5, -5]} intensity={1} color="#f472b6" />
              <CyberCube />
              <HolographicSphere />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col space-y-6"
          >
            <h3 className="font-orbitron text-2xl font-bold text-purple-400">
              WELCOME TO THE DIGITAL FRONTIER
            </h3>
            
            <p className="text-gray-300">
              GameHub is the nexus where reality and digital worlds collide. Founded in 2023 by a collective of game developers, digital artists, and cybernetic enthusiasts, we&apos;ve created a space where imagination knows no bounds.
            </p>
            
            <p className="text-gray-300">
              Our mission is to push the boundaries of interactive entertainment, blending cutting-edge technology with immersive storytelling to create experiences that transcend traditional gaming.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4 hover:border-purple-500/50 transition-all duration-300">
                  <div className="mb-2 text-xl font-bold text-purple-400 font-orbitron">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16"
        >
          <h3 className="font-orbitron text-2xl font-bold text-center text-white mb-8">
            OUR <span className="text-purple-400">FEATURES</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-2xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-orbitron text-lg font-bold text-white">{feature.title}</h4>
                    <p className="mt-2 text-gray-400">{feature.desc}</p>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-gradient-to-br from-transparent via-purple-500/10 to-purple-500/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 rounded-lg border border-purple-500/30 bg-black/60 p-8 text-center backdrop-blur-lg"
        >
          <div className="mb-4 font-orbitron text-2xl font-bold uppercase tracking-widest text-purple-400">
            JOIN THE CYBER-MAGE REVOLUTION
          </div>
          <div className="mb-6 text-gray-300">
            <span className="font-bold text-cyan-400">Neural sync required</span> • 
            <span className="font-bold text-pink-400">Holographic gear provided</span> • 
            <span className="font-bold text-green-400">24/7 support</span>
          </div>
          <div className="text-sm text-gray-500">
            Enter the matrix • Hack reality • Cast digital spells
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </section>
  );
};


export default AboutSection;
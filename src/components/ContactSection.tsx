"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Neural Network Visualization
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const [nodes, setNodes] = useState<THREE.Vector3[]>([]);
  const [connections, setConnections] = useState<[number, number][]>([]);

  useEffect(() => {
    const nodeCount = 15;
    const newNodes = Array.from({ length: nodeCount }, () => 
      new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      )
    );
    setNodes(newNodes);

    const newConnections: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() > 0.7) {
          newConnections.push([i, j]);
        }
      }
    }
    setConnections(newConnections);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={1} floatIntensity={2} position={[node.x, node.y, node.z]}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
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
      ))}
      
      {/* Connections */}
      {connections.map(([from, to], i) => (
        <mesh key={`connection-${i}`} position={[
          (nodes[from]?.x + nodes[to]?.x) / 2,
          (nodes[from]?.y + nodes[to]?.y) / 2,
          (nodes[from]?.z + nodes[to]?.z) / 2
        ]}>
          <cylinderGeometry args={[0.02, 0.02, nodes[from]?.distanceTo(nodes[to] || new THREE.Vector3()) || 1]} />
          <MeshDistortMaterial 
            color="#f472b6" 
            metalness={0.8} 
            roughness={0.2} 
            emissive="#f472b6" 
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Holographic Interface
function HolographicInterface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <MeshDistortMaterial 
          color="#ffb347" 
          metalness={0.7} 
          roughness={0.15} 
          emissive="#ffb347" 
          emissiveIntensity={0.4}
          distort={0.2}
          speed={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Floating Data Orbs
function DataOrb({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.8} position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <MeshDistortMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          emissive={color} 
          emissiveIntensity={0.4}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// Animated Input Field
const AnimatedInput = ({ 
  type, 
  placeholder, 
  icon, 
  value, 
  onChange, 
  isFocused, 
  setIsFocused 
}: {
  type: string;
  placeholder: string;
  icon: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative"
  >
    <motion.div
      animate={{
        scale: isFocused ? 1.02 : 1,
        boxShadow: isFocused 
          ? "0 0 30px rgba(0, 234, 255, 0.3)" 
          : "0 0 10px rgba(0, 234, 255, 0.1)"
      }}
      className="relative"
    >
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl z-10">
        {icon}
      </div>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={4}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/60 backdrop-blur-lg border-2 border-[#00eaff]/30 text-white font-[Inter,sans-serif] focus:border-[#00eaff] outline-none transition-all duration-300 placeholder-gray-400"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/60 backdrop-blur-lg border-2 border-[#00eaff]/30 text-white font-[Inter,sans-serif] focus:border-[#00eaff] outline-none transition-all duration-300 placeholder-gray-400"
        />
      )}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#00eaff]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  </motion.div>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    neuralSync: false
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate neural sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '', neuralSync: false });
    }, 3000);
  };

  return (
    <section id="contact" className="relative w-full min-h-screen py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 234, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 234, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 25s linear infinite'
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00eaff] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} color="#00eaff" />
          <pointLight position={[-5, -5, -5]} intensity={0.8} color="#f472b6" />
          <pointLight position={[5, -5, 5]} intensity={0.8} color="#ffb347" />
          
          <NeuralNetwork />
          <HolographicInterface />
          <DataOrb position={[-3, 2, -2]} color="#00eaff" speed={1} />
          <DataOrb position={[3, -2, -1]} color="#f472b6" speed={1.5} />
          <DataOrb position={[-2, -3, 1]} color="#ffb347" speed={0.8} />
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl sm:text-8xl font-black uppercase tracking-widest text-transparent bg-gradient-to-r from-[#00eaff] via-[#f472b6] to-[#ffb347] bg-clip-text font-[Orbitron,Arial,sans-serif] mb-6 drop-shadow-[0_0_30px_#00eaff]">
            NEURAL LINK
          </h2>
          <p className="text-2xl text-gray-400 font-[Inter,sans-serif] max-w-4xl mx-auto leading-relaxed">
            Establish <span className="text-[#00eaff] font-bold">quantum communication</span> with our cyber-mage operators. 
            Your message will be transmitted through <span className="text-[#f472b6] font-bold">neural networks</span> and 
            <span className="text-[#ffb347] font-bold"> holographic interfaces</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center p-12 rounded-3xl bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-lg border-2 border-green-400/30"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-3xl font-bold text-green-400 font-[Orbitron,Arial,sans-serif] mb-4">
                    NEURAL SYNC COMPLETE
                  </h3>
                  <p className="text-gray-300 font-[Inter,sans-serif]">
                    Your message has been transmitted through the quantum network. 
                    A cyber-mage will respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-8 rounded-3xl bg-black/40 backdrop-blur-lg border-2 border-[#00eaff]/30 shadow-2xl"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatedInput
                      type="text"
                      placeholder="Enter your neural signature"
                      icon="👤"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      isFocused={focusedField === 'name'}
                      setIsFocused={(focused) => setFocusedField(focused ? 'name' : null)}
                    />
                    
                    <AnimatedInput
                      type="email"
                      placeholder="Quantum email address"
                      icon="📧"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      isFocused={focusedField === 'email'}
                      setIsFocused={(focused) => setFocusedField(focused ? 'email' : null)}
                    />
                    
                    <AnimatedInput
                      type="textarea"
                      placeholder="Transmit your message through the neural network..."
                      icon="💬"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      isFocused={focusedField === 'message'}
                      setIsFocused={(focused) => setFocusedField(focused ? 'message' : null)}
                    />

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00eaff] to-[#0099bb] text-black font-bold font-[Orbitron,Arial,sans-serif] shadow-lg border-2 border-[#00eaff] hover:from-[#0099bb] hover:to-[#00eaff] transition-all duration-300 uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        animate={isSubmitting ? {
                          background: ["linear-gradient(to right, #00eaff, #0099bb)", "linear-gradient(to right, #f472b6, #00eaff)", "linear-gradient(to right, #00eaff, #0099bb)"]
                        } : {}}
                        transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0 }}
                      >
                        {isSubmitting ? "ESTABLISHING NEURAL SYNC..." : "TRANSMIT MESSAGE"}
                      </motion.button>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Info */}
            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-lg border-2 border-[#f472b6]/30 shadow-2xl">
              <h3 className="text-3xl font-bold text-[#f472b6] font-[Orbitron,Arial,sans-serif] mb-6 uppercase tracking-widest">
                QUANTUM LOCATION
              </h3>
              
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-3xl">📍</div>
                  <div>
                    <div className="text-white font-bold font-[Orbitron,Arial,sans-serif]">Victoria Island, Lagos</div>
                    <div className="text-gray-400 font-[Inter,sans-serif] text-sm">Neural Network Hub</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-3xl">☎️</div>
                  <div>
                    <div className="text-white font-bold font-[Orbitron,Arial,sans-serif]">+234 800 123 4567</div>
                    <div className="text-gray-400 font-[Inter,sans-serif] text-sm">Quantum Communication Line</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-3xl">🌐</div>
                  <div>
                    <div className="text-white font-bold font-[Orbitron,Arial,sans-serif]">24/7 Neural Sync</div>
                    <div className="text-gray-400 font-[Inter,sans-serif] text-sm">Always Connected</div>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t border-[#f472b6]/30">
                <div className="text-white font-bold font-[Orbitron,Arial,sans-serif] mb-4 uppercase tracking-wider">
                  CONNECT THROUGH THE MATRIX
                </div>
                <div className="flex gap-4">
                  {[
                    { name: "Twitter", icon: "🐦", color: "#1DA1F2" },
                    { name: "Discord", icon: "🎮", color: "#7289DA" },
                    { name: "Instagram", icon: "📸", color: "#E4405F" },
                    { name: "Telegram", icon: "📱", color: "#0088CC" }
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href="#"
                      whileHover={{ scale: 1.2, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 transition-all duration-300 text-2xl"
                      style={{ boxShadow: `0 0 20px ${social.color}40` }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Holographic Map */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative p-4 rounded-3xl bg-gradient-to-br from-[#ffb347]/20 to-[#ff6b35]/20 backdrop-blur-lg border-2 border-[#ffb347]/30 shadow-2xl"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🗺️</div>
                  <div className="text-white font-bold font-[Orbitron,Arial,sans-serif] uppercase tracking-wider">
                    HOLOGRAPHIC LOCATION
                  </div>
                </div>
                <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-[#ffb347]/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🌍</div>
                    <div className="text-[#ffb347] font-bold font-[Orbitron,Arial,sans-serif]">
                      Victoria Island
                    </div>
                    <div className="text-gray-400 font-[Inter,sans-serif] text-sm">
                      Lagos, Nigeria
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16 p-8 rounded-3xl bg-black/60 backdrop-blur-lg border border-[#00eaff]/30"
        >
          <div className="text-2xl font-bold font-[Orbitron,Arial,sans-serif] text-[#00eaff] mb-4 uppercase tracking-widest">
            READY TO ENTER THE MATRIX?
          </div>
          <div className="text-gray-300 font-[Inter,sans-serif] mb-6">
            <span className="text-[#f472b6] font-bold">Neural interfaces available</span> • <span className="text-[#ffb347] font-bold">Holographic tours daily</span> • <span className="text-[#10b981] font-bold">Quantum security guaranteed</span>
          </div>
          <div className="text-sm text-gray-500 font-[Inter,sans-serif]">
            Step into the future • Connect with the network • Become a cyber-mage
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </section>
  );
};

export default ContactSection; 
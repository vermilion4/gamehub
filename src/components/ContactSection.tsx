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
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="relative"
  >
    <motion.div
      animate={{
        scale: isFocused ? 1.02 : 1,
        boxShadow: isFocused 
          ? "0 0 20px rgba(139, 92, 246, 0.3)" 
          : "0 0 10px rgba(139, 92, 246, 0.1)"
      }}
      className="relative"
    >
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl z-10">
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
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/60 backdrop-blur-lg border border-purple-500/30 text-white focus:border-purple-500 outline-none transition-all duration-300 placeholder-gray-400"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/60 backdrop-blur-lg border border-purple-500/30 text-white focus:border-purple-500 outline-none transition-all duration-300 placeholder-gray-400"
        />
      )}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 25s linear infinite'
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
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

      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-orbitron text-3xl font-bold text-white md:text-4xl">
            CONTACT <span className="text-purple-400">US</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Connect with our team of digital architects and game designers. Your feedback and inquiries help us shape the future of gaming.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center p-8 rounded-lg bg-gradient-to-br from-green-400/20 to-green-500/20 backdrop-blur-lg border border-green-400/30"
                >
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-400 font-orbitron mb-4">
                    MESSAGE SENT
                  </h3>
                  <p className="text-gray-300">
                    Your message has been sent successfully. 
                    Our team will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-6 rounded-lg bg-black/40 backdrop-blur-lg border border-purple-500/30 shadow-lg"
                >
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <AnimatedInput
                      type="text"
                      placeholder="Your name"
                      icon="👤"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      isFocused={focusedField === 'name'}
                      setIsFocused={(focused) => setFocusedField(focused ? 'name' : null)}
                    />
                    
                    <AnimatedInput
                      type="email"
                      placeholder="Your email address"
                      icon="📧"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      isFocused={focusedField === 'email'}
                      setIsFocused={(focused) => setFocusedField(focused ? 'email' : null)}
                    />
                    
                    <AnimatedInput
                      type="textarea"
                      placeholder="Your message..."
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
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold font-orbitron shadow-lg border border-purple-500/50 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        animate={isSubmitting ? {
                          background: ["linear-gradient(to right, #8b5cf6, #6366f1)", "linear-gradient(to right, #6366f1, #8b5cf6)", "linear-gradient(to right, #8b5cf6, #6366f1)"]
                        } : {}}
                        transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0 }}
                      >
                        {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                      </motion.button>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* 3D Canvas */}
            <div className="h-[200px] rounded-lg bg-black/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
              
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#8b5cf6" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#f472b6" />
                <NeuralNetwork />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
              </Canvas>
            </div>
            
            {/* Contact Info */}
            <div className="p-6 rounded-lg bg-black/40 backdrop-blur-lg border border-purple-500/30 shadow-lg">
              <h3 className="text-xl font-bold text-purple-400 font-orbitron mb-4">
                CONTACT INFO
              </h3>
              
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
                >
                  <div className="text-2xl">📍</div>
                  <div>
                    <div className="text-white font-bold font-orbitron">GameHub HQ</div>
                    <div className="text-gray-400 text-sm">Victoria Island, Lagos</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
                >
                  <div className="text-2xl">☎️</div>
                  <div>
                    <div className="text-white font-bold font-orbitron">+234 800 123 4567</div>
                    <div className="text-gray-400 text-sm">Mon-Fri, 9AM-5PM</div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
                >
                  <div className="text-2xl">📧</div>
                  <div>
                    <div className="text-white font-bold font-orbitron">contact@gamehub.com</div>
                    <div className="text-gray-400 text-sm">Email us anytime</div>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-4 border-t border-purple-500/20">
                <div className="text-white font-bold font-orbitron mb-3 text-sm">
                  FOLLOW US
                </div>
                <div className="flex gap-3">
                  {[
                    { name: "Twitter", icon: "🐦", color: "#8b5cf6" },
                    { name: "Discord", icon: "🎮", color: "#8b5cf6" },
                    { name: "Instagram", icon: "📸", color: "#8b5cf6" },
                    { name: "Twitch", icon: "📺", color: "#8b5cf6" }
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href="#"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/30 hover:bg-black/50 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 text-xl"
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12 p-6 rounded-lg bg-black/60 backdrop-blur-lg border border-purple-500/30"
        >
          <div className="text-xl font-bold font-orbitron text-purple-400 mb-3">
            JOIN OUR GAMING COMMUNITY
          </div>
          <div className="text-gray-300 mb-4">
            <span className="font-bold text-indigo-400">Weekly tournaments</span> • 
            <span className="font-bold text-pink-400">Early access to new games</span> • 
            <span className="font-bold text-cyan-400">Exclusive rewards</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-bold font-orbitron text-sm uppercase tracking-wider hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
          >
            Sign Up Now
          </motion.button>
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
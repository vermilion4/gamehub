'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onSectionClick: (sectionId: string) => void;
}

const NavBar = ({ activeSection, onSectionChange, onSectionClick }: NavBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'games', label: 'GAMES' },
    { id: 'events', label: 'EVENTS' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onSectionClick(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <span className="font-orbitron text-xl font-bold text-white">
            <span className="text-cyan-400">GAME</span>HUB
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 font-orbitron text-sm transition-colors ${activeSection === item.id ? 'text-cyan-400' : 'text-white hover:text-cyan-300'}`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 w-full bg-cyan-400"
                      layoutId="navIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <div className="block md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-white hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute left-0 top-16 z-50 w-full bg-black/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <motion.li 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full rounded-md px-4 py-3 text-left font-orbitron text-sm ${activeSection === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-white hover:bg-gray-800'}`}
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </motion.nav>
  );
};

export default NavBar;
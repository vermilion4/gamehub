"use client";
import { motion } from "framer-motion";
import React from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Games", href: "/games" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "Play Games", href: "/games", cta: true },
];

const TopNavBar = () => {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 w-full z-40 backdrop-blur-lg flex items-center justify-between px-10 py-8"
    >
      {/* Logo/Title */}
      <div className="flex items-center gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-[#00eaff] drop-shadow-[0_2px_8px_#00eaff99] font-[Orbitron,Arial,sans-serif]">
          Fantasy Quest
        </span>
        <span className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-[#ffb347] drop-shadow-[0_2px_8px_#ffb34799] font-[Orbitron,Arial,sans-serif] ml-2">
          Cyber Arena
        </span>
      </div>
      {/* Nav Links */}
      <nav className="flex gap-6 items-center">
        {navLinks.map((link) =>
          link.cta ? (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ scale: 1.08, boxShadow: "0 0 16px #00eaff" }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2 rounded-full bg-[#00eaff] text-black font-bold text-base shadow-lg border-2 border-[#00eaff] hover:bg-[#0099bb] transition-colors font-[Orbitron,Arial,sans-serif] ml-2 uppercase tracking-widest"
            >
              {link.label}
            </motion.a>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className={`font-[Orbitron,Arial,sans-serif] font-bold uppercase tracking-widest text-base transition-colors ${
                pathname === link.href 
                  ? "text-[#00eaff] drop-shadow-[0_0_8px_#00eaff]" 
                  : "text-gray-200 hover:text-[#00eaff]"
              }`}
            >
              {link.label}
            </a>
          )
        )}
      </nav>
      {/* Social Icons */}
      {/* <div className="flex gap-4 items-center">
        {socialLinks.map((link) => (
          <motion.a
            key={link.href}
            href={link.href}
            whileHover={{ scale: 1.2, color: "#00eaff" }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-300 hover:text-[#00eaff] transition-colors border border-[#00eaff] rounded-full p-1.5"
          >
            {link.icon}
          </motion.a>
        ))}
      </div> */}
    </motion.header>
  );
};

export default TopNavBar;
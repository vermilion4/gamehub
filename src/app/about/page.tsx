"use client";
import React from "react";
import TopNavBar from "@/components/TopNavBar";
import AboutSection from "@/components/AboutSection";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-white bg-black">
      <TopNavBar />
      <div className="pt-24">
        <AboutSection />
      </div>
    </div>
  );
} 
"use client";
import React from "react";
import TopNavBar from "@/components/TopNavBar";
import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen text-white bg-black">
      <TopNavBar />
      <div className="pt-24">
        <ContactSection />
      </div>
    </div>
  );
} 
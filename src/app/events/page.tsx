"use client";
import React from "react";
import TopNavBar from "@/components/TopNavBar";
import EventsSection from "@/components/EventsSection";

export default function EventsPage() {
  return (
    <div className="relative min-h-screen text-white bg-black">
      <TopNavBar />
      <div className="pt-24">
        <EventsSection />
      </div>
    </div>
  );
} 
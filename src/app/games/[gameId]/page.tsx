"use client";
import { useParams } from "next/navigation";
import NeuralHackGame from "@/components/NeuralHackGame";
import WordConnectGame from "@/components/WordConnectGame";
import FruitSliceGame from "@/components/FruitSliceGame";
import Link from "next/link";

const gameComponents = {
  "neural-hack": NeuralHackGame,
  "fruit-slice": FruitSliceGame,
  "word-connect": WordConnectGame,
};

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  
  const GameComponent = gameComponents[gameId as keyof typeof gameComponents];
  
  if (!GameComponent) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500 font-[Orbitron,Arial,sans-serif] mb-4">
            Game Not Found
          </h2>
          <p className="text-gray-300 mb-6">
            The game &quot;{gameId}&quot; doesn&apos;t exist.
          </p>
          <Link 
            href="/games"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold font-[Orbitron,Arial,sans-serif] transition-all uppercase tracking-widest"
          >
            Back to Games
          </Link>
        </div>
      </div>
    );
  }
  
  return <GameComponent />;
} 
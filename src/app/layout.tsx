import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap"
});

export const metadata: Metadata = {
  title: "GameHub - Play Beyond Reality",
  description: "Your ultimate destination for next-gen gaming experiences. Dive into our collection of immersive games, join exclusive events, and connect with fellow gamers.",
  keywords: ["games", "gaming", "esports", "tournaments", "game development", "online games"],
  authors: [{ name: "GameHub Team" }],
  themeColor: "#00eaff",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable}`}>
        {children}
      </body>
    </html>
  );
}

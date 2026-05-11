import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Olympian — Find yourself in 120 years of Team USA",
  description:
    "Find your archetype's path through 120 years of Team USA. A multimodal Gemini agent that turns your biometrics into a personal journey across US Olympic and Paralympic sport families.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0d14] text-stone-100 font-sans">
        {children}
      </body>
    </html>
  );
}

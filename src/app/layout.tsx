import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FitnessProvider } from "@/context/FitnessContext";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FitForge | Home Fitness System",
  description: "Premium fitness tracking platform for workouts, nutrition, and habits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#060816] text-white overflow-hidden h-screen flex`}>
        <FitnessProvider>
          {/* Global Background Effects */}
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.15),transparent_50%)] pointer-events-none z-0"></div>
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none z-0"></div>
          
          <Navigation />
          
          <main className="flex-1 relative z-10 overflow-y-auto pb-20 md:pb-0 h-full scroll-smooth">
            <div className="max-w-7xl mx-auto w-full min-h-full">
              {children}
            </div>
          </main>
        </FitnessProvider>
      </body>
    </html>
  );
}

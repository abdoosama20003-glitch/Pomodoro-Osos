"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Dumbbell, 
  Apple, 
  Scale, 
  CheckCircle,
  Settings,
  Timer,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Nutrition", href: "/nutrition", icon: Apple },
  { name: "Weight", href: "/weight", icon: Scale },
  { name: "Habits", href: "/habits", icon: CheckCircle },
  { name: "Pomodoro", href: "/pomodoro", icon: Timer },
  { name: "Study", href: "/study", icon: BookOpen },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl h-full z-20 transition-all duration-300">
        <div className="p-6 flex items-center justify-center lg:justify-start">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center border border-cyan-400/30 shrink-0">
            <Dumbbell className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="ml-3 font-black text-xl tracking-wider hidden lg:block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            FITFORGE
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-cyan-400/10 text-cyan-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-6 h-6 shrink-0 relative z-10" />
                <span className="ml-4 font-semibold hidden lg:block relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <Link
            href="/settings"
            className={cn(
              "flex items-center px-3 py-3 rounded-2xl transition-all group",
              pathname === "/settings"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings className="w-6 h-6 shrink-0" />
            <span className="ml-4 font-semibold hidden lg:block">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel pb-safe">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl"
              >
                {isActive && (
                  <motion.div 
                    layoutId="mobile-active"
                    className="absolute inset-0 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon 
                  className={cn(
                    "w-6 h-6 relative z-10 mb-1 transition-colors",
                    isActive ? "text-cyan-400" : "text-slate-400"
                  )} 
                />
                <span className={cn(
                  "text-[10px] font-medium relative z-10",
                  isActive ? "text-cyan-400" : "text-slate-400"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

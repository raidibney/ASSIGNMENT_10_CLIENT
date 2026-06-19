"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBus, FaTrain, FaPlane, FaShip, FaArrowRight, FaTerminal } from "react-icons/fa";

const transportModes = [
  {
    id: "bus",
    name: "Bus Sector",
    icon: FaBus,
    color: "from-blue-500 to-indigo-600",
    glowColor: "rgba(59,130,246,0.25)",
    borderColor: "hover:border-blue-500/30",
    iconColor: "text-blue-500 dark:text-blue-400",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: "train",
    name: "Rail Matrix",
    icon: FaTrain,
    color: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16,185,129,0.25)",
    borderColor: "hover:border-emerald-500/30",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    image: "https://images.unsplash.com/photo-1532103054090-334e6e60ae29?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: "launch",
    name: "Marine Grid",
    icon: FaShip,
    color: "from-cyan-500 to-blue-600",
    glowColor: "rgba(6,182,212,0.25)",
    borderColor: "hover:border-cyan-500/30",
    iconColor: "text-cyan-500 dark:text-cyan-400",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: "flight",
    name: "Aero Stream",
    icon: FaPlane,
    color: "from-rose-500 to-pink-600",
    glowColor: "rgba(244,63,94,0.25)",
    borderColor: "hover:border-rose-500/30",
    iconColor: "text-rose-500 dark:text-rose-400",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1920",
  },
];

const HeroBanner = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % transportModes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[95vh] lg:min-h-[100vh] w-full overflow-hidden flex flex-col justify-between py-16 lg:py-24 transition-colors duration-500 bg-base-100 text-base-content">
      
      {/* Background Image Slider with Edge Gradients */}
      <div className="absolute inset-0 z-0">
        {transportModes.map((mode, index) => (
          <div
            key={mode.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out mixing-normal ${
              index === activeTab 
                ? "opacity-20 dark:opacity-45 scale-105 select-auto pointer-events-auto" 
                : "opacity-0 scale-100 select-none pointer-events-none"
            }`}
            style={{
              backgroundImage: `url('${mode.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* Cybernetic Tech Digital Grid Overlay */}
      <div className="absolute inset-0 z-1 bg-[linear-gradient(to_right,rgba(var(--bc)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--bc)/0.03)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none opacity-80" />
      
      {/* Adaptive Theme Mask Layers */}
      <div className="absolute inset-0 z-2 bg-gradient-to-t from-base-100 via-base-100/50 to-base-100/90" />
      <div className="absolute inset-0 z-2 backdrop-blur-[1px] bg-base-100/10" />

      {/* Dynamic Aura Backlight Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full blur-[140px] opacity-35 dark:opacity-20 transition-all duration-1000 mix-blend-screen pointer-events-none hidden md:block z-2"
        style={{ backgroundColor: transportModes[activeTab].glowColor }}
      />

      {/* Centered Typography & Control Content Panel */}
      <div className="relative z-10 container mx-auto px-6 text-center my-auto flex flex-col items-center">
        
        {/* Futuristic Interactive Micro-Badge */}
        <div className="inline-flex items-center gap-2 bg-base-200/80 border border-base-content/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-8 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <FaTerminal className="text-[10px] opacity-60" /> Quantum Transit Network
        </div>

        {/* Core Header Elements */}
        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter max-w-5xl leading-none">
          Book Your Journey
          <span className="block mt-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-500 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            In Seconds
          </span>
        </h1>

        {/* Minimalist Sub-Shield Descriptor */}
        <div className="mt-10 bg-base-200/40 border border-base-content/5 backdrop-blur-xl px-8 py-5 rounded-2xl max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <p className="text-base sm:text-lg text-base-content/80 font-light leading-relaxed">
            Bus, Train, Launch & Flight sectors synchronized in one seamless interface ecosystem.
          </p>
          <div className="w-12 h-[2px] bg-base-content/10 mx-auto my-3" />
          <p className="text-amber-500 dark:text-amber-400 font-extrabold text-xs sm:text-sm tracking-wider uppercase">
            Instant Routing • Secured Checkout Nodes • Zero Delay Verification
          </p>
        </div>

        {/* Action Button Interfaces */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/tickets"
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl shadow-[0_4px_25px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_35px_rgba(245,158,11,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center tracking-wide text-sm uppercase"
          >
            Explore Tickets
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto group flex items-center justify-center gap-2 px-10 py-4 bg-base-200 border border-base-content/10 backdrop-blur-md hover:bg-base-300 text-base-content font-bold rounded-xl transition-all duration-200 text-center tracking-wide text-sm uppercase shadow-sm"
          >
            <span>Get Started</span>
            <FaArrowRight className="text-xs text-amber-500 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Floating Interactive Translucent Transport Tabs */}
      <div className="relative z-10 container mx-auto px-4 mt-12 lg:mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {transportModes.map((mode, index) => {
            const Icon = mode.icon;
            const isActive = index === activeTab;
            
            return (
              <button
                key={mode.id}
                onClick={() => setActiveTab(index)}
                className={`group relative text-center rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col items-center gap-3 border outline-none shadow-sm
                  ${isActive 
                    ? "bg-base-200 border-amber-500/50 dark:border-amber-400/40 scale-102 shadow-[0_0_25px_rgba(245,158,11,0.08)]" 
                    : `bg-base-200/40 border-base-content/5 ${mode.borderColor} hover:bg-base-200 hover:-translate-y-1`
                  }`}
              >
                {/* Active Dynamic Running Laser Bar */}
                {isActive && (
                  <div className="absolute -bottom-[1px] left-6 right-6 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}

                {/* Ambient Internal Hover Tint */}
                <div className={`absolute inset-0 bg-gradient-to-b ${mode.color} to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                
                {/* Icon Circle Pod */}
                <div className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300
                  ${isActive 
                    ? "border-amber-500/20 bg-base-100 shadow-inner" 
                    : "border-base-content/5 bg-base-200/60"
                  }`}
                >
                  <Icon 
                    className={`text-xl transition-transform group-hover:scale-110 duration-300 ${isActive ? mode.iconColor : 'text-base-content/60 group-hover:text-base-content'}`}
                  />
                </div>

                {/* Transport Sector String */}
                <span className={`font-bold tracking-wider text-xs uppercase transition-colors duration-200
                  ${isActive ? "text-amber-500 dark:text-amber-400" : "text-base-content/60 group-hover:text-base-content"}`}
                >
                  {mode.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default HeroBanner;
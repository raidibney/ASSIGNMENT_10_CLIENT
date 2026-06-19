"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBus, FaArrowLeft, FaTerminal, FaHome } from "react-icons/fa";

const NotFoundPage = () => {
  // Safe hydration guard to prevent mismatched server/client rendering
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents the mismatched components from rendering during early hydration
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-12 px-6 transition-colors duration-500 bg-base-100 text-base-content">
      
      {/* Sci-Fi Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/[0.02] dark:bg-amber-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/[0.02] dark:bg-orange-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Cybernetic Digital Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--bc)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--bc)/0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        
        {/* Futuristic Error Badge */}
        <div className="inline-flex items-center gap-2 bg-base-200/80 border border-base-content/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-6 shadow-md">
          <FaTerminal className="text-[10px] opacity-60" /> Routing Error: 404
        </div>

        {/* Giant Glitch-styled Header */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter leading-none select-none">
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-500 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            LOST
          </span>
        </h1>
        
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-4 uppercase">
          Destination Not Found
        </h2>

        {/* Animated Transit Track Container */}
        <div className="w-full h-24 relative mt-10 mb-6 overflow-hidden rounded-2xl bg-base-200/40 border border-base-content/5 backdrop-blur-sm shadow-inner flex items-center">
          
          {/* Futuristic Laser Highway Gridlines */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-base-content/10 to-transparent top-1/2 -translate-y-1/2" />
          <div className="absolute inset-x-0 h-[8px] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent top-1/2 -translate-y-1/2 blur-sm" />
          
          {/* Seamless Looping Animated Cyber-Bus */}
          <div className="absolute left-0 animate-[drive_8s_linear_infinite] flex items-center gap-1">
            <div className="relative flex flex-col items-center">
              {/* Bus Pod */}
              <div className="w-14 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <FaBus className="text-lg transform flip-x animate-bounce duration-700" />
              </div>
              {/* Engine Wheel Glows */}
              <div className="flex justify-between w-10 px-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              </div>
            </div>
            {/* Cyber Light Trail */}
            <div className="h-[2px] w-32 bg-gradient-to-l from-amber-500/60 to-transparent rounded-full" />
          </div>

          {/* Warning Telemetry text sitting inside the transit box */}
          <div className="absolute right-6 top-3 text-[10px] font-mono tracking-widest text-base-content/30 uppercase select-none hidden sm:block">
            Searching network tracks...
          </div>
        </div>

        {/* Description Panel */}
        <div className="bg-base-200/30 border border-base-content/5 backdrop-blur-xl px-6 py-4 rounded-xl max-w-md shadow-sm">
          <p className="text-sm font-light text-base-content/70 leading-relaxed">
            The schedule index or transit coordinates you are looking for have been decommissioned or moved to an alternate station route.
          </p>
        </div>

        {/* Action Controls Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 py-3 bg-base-200 border border-base-content/10 backdrop-blur-md hover:bg-base-300 text-base-content font-bold rounded-xl transition-all duration-200 text-sm uppercase shadow-sm"
          >
            <FaArrowLeft className="text-xs text-amber-500 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_35px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all duration-200 text-sm uppercase tracking-wide"
          >
            <FaHome className="text-xs" />
            <span>Return Terminal</span>
          </Link>
        </div>

      </div>

      {/* Replaced styled-jsx with a pure standard layout template string injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drive {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(700px); }
        }
        @media (max-w: 640px) {
          @keyframes drive {
            0% { transform: translateX(-100px); }
            100% { transform: translateX(450px); }
          }
        }
      `}} />

    </div>
  );
};

export default NotFoundPage;
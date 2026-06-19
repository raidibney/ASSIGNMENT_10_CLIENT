"use client";

import { FaArrowRight, FaMapMarkerAlt, FaCompass } from "react-icons/fa";

const routes = [
  { id: 1, from: "Dhaka", to: "Cox's Bazar", count: "42 Flights/Buses Daily" },
  { id: 2, from: "Dhaka", to: "Sylhet", count: "28 Trains/Buses Daily" },
  { id: 3, from: "Dhaka", to: "Chittagong", count: "36 Streams Daily" },
  { id: 4, from: "Dhaka", to: "Khulna", count: "14 Routes Daily" },
  { id: 5, from: "Dhaka", to: "Rajshahi", count: "19 Tracks Daily" },
  { id: 6, from: "Dhaka", to: "Barisal", count: "12 Launches Daily" },
];

const PopularRoutes = () => {
  return (
    <section className="relative w-full transition-colors duration-300 py-24 bg-base-200 text-base-content overflow-hidden">
      
      {/* Sci-Fi Grid Line Ambient Accents */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-500/[0.02] dark:bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-rose-500/[0.01] dark:bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-4">
            <FaCompass className="text-xs" /> Network Grid
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-base-content">
            Popular <span className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">Routes</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-4 mb-3" />
          <p className="max-w-md font-light sm:text-lg text-base-content/70">
            The most heavily requested transit sectors across our high-speed integration channels.
          </p>
        </div>

        {/* Futuristic Cards System */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              className="group relative rounded-2xl p-6 transition-all duration-300 cursor-pointer bg-base-100 border border-base-content/5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(245,158,11,0.04)] dark:hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] flex items-center justify-between gap-4 overflow-hidden"
            >
              {/* Internal Background Micro Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-amber-500/[0.02] to-orange-500/[0.02] transition-opacity duration-300 pointer-events-none" />

              {/* Transit Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2.5 text-base-content">
                  <span className="font-medium text-base-content/50 group-hover:text-amber-500 transition-colors duration-300">
                    {route.from}
                  </span>
                  <div className="flex items-center gap-1 text-base-content/30 group-hover:text-orange-500 transition-colors duration-300">
                    <span className="w-2 h-[2px] bg-current" />
                    <FaMapMarkerAlt className="text-[10px]" />
                    <span className="w-2 h-[2px] bg-current" />
                  </div>
                  <span className="font-extrabold text-xl tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
                    {route.to}
                  </span>
                </div>

                {/* Network density telemetry counter */}
                <span className="text-[11px] font-bold tracking-wider uppercase text-base-content/40 mt-2 block group-hover:text-base-content/60 transition-colors">
                  {route.count}
                </span>
              </div>

              {/* Futuristic Action Button Wrapper */}
              <div className="w-10 h-10 rounded-xl bg-base-200 border border-base-content/5 flex items-center justify-center text-base-content group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-slate-950 group-hover:border-transparent transition-all duration-300 shadow-sm flex-shrink-0">
                <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularRoutes;
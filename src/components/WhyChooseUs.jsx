"use client";

import { FaShieldAlt, FaBolt, FaHeadset, FaCheckCircle, FaHashtag } from "react-icons/fa";

const features = [
  {
    id: 1,
    title: "Secure Gateways",
    description: "Multi-layered cryptographic protocol systems ensuring zero-compromise transactions.",
    icon: FaShieldAlt,
    accentColor: "from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500",
    glowColor: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    id: 2,
    title: "Instant Booking",
    description: "Direct real-time API sync across global networks guarantees seat distribution in milliseconds.",
    icon: FaBolt,
    accentColor: "from-amber-400 to-orange-500 dark:from-amber-400 dark:to-orange-500",
    glowColor: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  {
    id: 3,
    title: "24/7 Live Support",
    description: "Constant monitoring arrays and human assistance desks active through any emergency matrix.",
    icon: FaHeadset,
    accentColor: "from-emerald-400 to-teal-600 dark:from-emerald-400 dark:to-teal-500",
    glowColor: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  {
    id: 4,
    title: "Verified Operators",
    description: "Strict credential and safety evaluation pipelines filtering for premium transport fleets.",
    icon: FaCheckCircle,
    accentColor: "from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-500",
    glowColor: "hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
    iconColor: "text-rose-500 dark:text-rose-400",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="relative w-full transition-colors duration-300 py-24 bg-base-100 text-base-content overflow-hidden">
      
      {/* Sci-Fi Structural Accent Grid Rings */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-500/[0.01] dark:bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-rose-500/[0.01] dark:bg-rose-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-4">
            <FaHashtag className="text-xs" /> Core Platform Perks
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-base-content">
            Why Ticket<span className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">Bari?</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-4 mb-3" />
          <p className="max-w-md font-light sm:text-lg text-base-content/70">
            Engineered layer-by-layer to deliver unmatched modern performance and secure user transits.
          </p>
        </div>

        {/* Futuristic Cards Display Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <div
                key={feature.id}
                className={`group relative rounded-2xl p-6 transition-all duration-300 bg-base-200/50 border border-base-content/5 hover:border-base-content/15 hover:-translate-y-2 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] ${feature.glowColor}`}
              >
                {/* Tech Glow Inner Frame Layer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-base-content/[0.02] to-transparent transition-opacity duration-300 rounded-2xl pointer-events-none" />

                {/* Geometric Icon Container */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.accentColor} p-[1px] mb-6 shadow-md transition-transform duration-500 group-hover:rotate-[360deg]`}>
                  <div className="w-full h-full rounded-[11px] bg-base-100 flex items-center justify-center">
                    <IconComponent className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${feature.iconColor}`} />
                  </div>
                </div>

                {/* Information Content Elements */}
                <h3 className="font-extrabold text-xl tracking-wide text-base-content mb-3 group-hover:text-amber-500 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm font-light text-base-content/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
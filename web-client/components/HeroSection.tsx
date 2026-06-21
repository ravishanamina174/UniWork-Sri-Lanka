"use client";
import React, { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // High-fidelity text colors that adapt cleanly between light and dark themes
  const words = [
    { text: "Earn", color: "text-emerald-600 dark:text-emerald-400" },
    { text: "Post", color: "text-amber-500 dark:text-amber-400" },
    { text: "Scale", color: "text-[#007FFF] dark:text-blue-400" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Track cursor position precisely within the container limits
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const sectionEl = sectionRef.current;
    if (sectionEl) {
      sectionEl.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (sectionEl) sectionEl.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full bg-white dark:bg-black pt-20 pb-28 md:pt-24 md:pb-36 overflow-hidden transition-colors duration-300 select-none"
    >
      
      {/* Dynamic Cursor Light Reveal Engine: Reveals dots only directly behind the user cursor area */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          backgroundImage: "radial-gradient(#94a3b8 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: `radial-gradient(circle 140px at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
          maskImage: `radial-gradient(circle 100px at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
        }}
      />

      <div className="mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        
        {/* Micro Professional Pill Tag */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-xs font-medium text-[#838991] dark:text-neutral-400 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#007FFF] animate-pulse" />
          The First Dedicated Student Task Network in Sri Lanka
        </div>

        {/* Centered Typography with ONLY External Fine Surrounding Doodles */}
        <div className="relative max-w-4xl px-4">
          
          {/* COLOURED DOODLE A: Top Left Delicate Emerald Sparkle */}
          <div className="absolute -top-6 left-2 text-emerald-500 dark:text-emerald-400/80 opacity-90 pointer-events-none animate-pulse">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
              <path d="M50 15 Q 50 50 15 50 Q 50 50 50 85 Q 50 50 85 50 Q 50 50 50 15 Z" />
            </svg>
          </div>

          {/* COLOURED DOODLE B: Crown Silhouette Positioned Perfectly At Head Top */}
          <div className="absolute -top-10 left-[43%] text-amber-500 dark:text-amber-400/70 opacity-80 pointer-events-none">
            <svg width="40" height="30" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 65 L 25 25 L 45 45 L 50 18 L 55 45 L 75 25 L 85 65 Z" />
            </svg>
          </div>

          {/* COLOURED DOODLE C: Mid Right Swirling Blue Indicator Loop */}
          <div className="absolute top-1/2 -right-8 text-[#007FFF] dark:text-blue-400 opacity-80 pointer-events-none hidden md:block">
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
              <path d="M20 30 C 45 10, 85 30, 70 65 C 65 75, 45 75, 52 55" />
              <polyline points="45 58 52 55 58 64" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-[2.6rem] sm:text-[3.6rem] lg:text-[4rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Where independent talents <br />
            and ecosystems{" "}
            <span className="relative inline-block mt-2 sm:mt-0 min-w-[120px] sm:min-w-[170px] text-center">
              <span className={`transition-all duration-500 ease-in-out ${words[index].color}`}>
                {words[index].text}
              </span>
            </span>{" "}
            together.
          </h1>
        </div>

        <p className="max-w-2xl mt-6 text-base sm:text-lg font-medium text-[#989a9c] dark:text-neutral-400 leading-relaxed antialiased">
          Empowering student earners with flexible pathways, helping task posters find immediate execution, and enabling corporate clients to scale velocity seamlessly.
        </p>

        {/* CTA Hub Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 mb-16 md:mb-24">
          <button className="px-6 py-3.5 bg-[#007FFF] text-white font-bold text-sm rounded-xl hover:bg-[#0066CC] active:scale-[0.98] transition-all duration-200 shadow-md shadow-blue-500/10">
            Get Started free
          </button>
          
          <button className="group flex items-center gap-2 px-5 py-3.5 text-slate-600 dark:text-neutral-400 font-semibold text-sm rounded-xl hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-neutral-900 transition-all duration-200">
            <span>Our Vision</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* ================= ADVANCED NEXTUI LANYARD STYLE CARD DECK ================= */}
        {/* All three cards feature the official verification layout, looking stunning in pure black dark mode */}
        <div className="w-full max-w-[62rem] relative px-4 md:px-0">
          <div className="relative h-[340px] sm:h-[400px] md:h-[440px] w-full flex items-center justify-center">
            
            {/* CARD 1: Student Verification Badge (Left Card Anchor) */}
            <div className="absolute left-0 lg:left-[4%] top-[10%] w-[35%] sm:w-[31%] h-[80%] rounded-2xl bg-white dark:bg-neutral-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-neutral-800/80 transform -rotate-6 hover:rotate-0 hover:scale-[1.03] transition-all duration-500 ease-out z-10 overflow-hidden flex flex-col group">
              <div className="h-[45%] w-full bg-slate-100 dark:bg-neutral-800 relative">
                <img 
                  src="/assets/hero-student.jpg" 
                  alt="Student Sector Workspace" 
                  className="w-full h-full object-cover filter contrast-[1.01] group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="h-[55%] w-full p-4 flex flex-col justify-between text-left">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm tracking-tight leading-tight">UniWork Verified</h4>
                  <p className="text-slate-400 dark:text-neutral-500 text-[9px] sm:text-xs font-semibold mt-0.5">Student Earner Deck</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-neutral-800 pt-3 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                  <span>ID 2026</span>
                  <span className="text-emerald-500">Active</span>
                </div>
              </div>
            </div>

            {/* CARD 2: Task Execution Lanyard System (Premium Center Focal Card) */}
            <div className="absolute top-0 w-[36%] sm:w-[30%] h-[92%] rounded-2xl bg-white dark:bg-neutral-900 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.22)] md:shadow-[0_45px_85px_-20px_rgba(0,0,0,0.6)] border border-slate-200/60 dark:border-neutral-800 transform rotate-2 hover:rotate-0 hover:scale-[1.04] transition-all duration-500 ease-out z-30 overflow-hidden flex flex-col group">
              <div className="h-[45%] w-full bg-amber-500/10 dark:bg-neutral-800 relative">
                <img 
                  src="/assets/hero-task.jpg" 
                  alt="Task Management Focal" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="h-[55%] w-full p-4 sm:p-5 flex flex-col justify-between text-left">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-black text-sm sm:text-base tracking-tight leading-tight">UniWork Verified</h4>
                  <p className="text-slate-400 dark:text-neutral-500 text-[10px] sm:text-xs font-bold mt-0.5">Micro-Gig Network</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-neutral-800/60 pt-3 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                  <span>ID 0032</span>
                  <span className="text-emerald-500">Active</span>
                </div>
              </div>
            </div>

            {/* CARD 3: Corporate Ledger Analytics Layer (Right Card Anchor) */}
            <div className="absolute right-0 lg:right-[4%] top-[14%] w-[35%] sm:w-[31%] h-[76%] rounded-2xl bg-white dark:bg-neutral-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-neutral-800/80 transform rotate-6 hover:rotate-0 hover:scale-[1.03] transition-all duration-500 ease-out z-20 overflow-hidden flex flex-col group">
              <div className="h-[45%] w-full bg-slate-100 dark:bg-neutral-800 relative">
                <img 
                  src="/assets/hero-corporate.jpg" 
                  alt="Enterprise Engine Layout" 
                  className="w-full h-full object-cover filter saturate-[0.9] group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="h-[55%] w-full p-4 flex flex-col justify-between text-left">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm tracking-tight leading-tight">UniWork Verified</h4>
                  <p className="text-slate-400 dark:text-neutral-500 text-[9px] sm:text-xs font-semibold mt-0.5">Corporate Client Pool</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-neutral-800 pt-3 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                  <span>ID 7099</span>
                  <span className="text-[#007FFF] dark:text-blue-400">Enterprise</span>
                </div>
              </div>
            </div>

          </div>

          {/* Under-canvas horizontal alignment support trace layout line */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-64 h-2 opacity-10 dark:opacity-30 pointer-events-none">
            <svg className="w-full h-full text-slate-900 dark:text-neutral-700" viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
              <path d="M5 5 C 50 2, 150 8, 295 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}
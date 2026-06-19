"use client";
import React, { useState, useEffect } from "react";

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  const words = [
    { text: "Earn", color: "bg-emerald-50 text-emerald-700 border-emerald-200/60 target-student" },
    { text: "Post", color: "bg-amber-50 text-amber-700 border-amber-200/60 target-poster" },
    { text: "Scale", color: "bg-blue-50 text-blue-700 border-blue-200/60 target-corporate" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-white py-16 md:py-24 lg:py-28 overflow-hidden select-none">
      {/* Structural Containment Box */}
      <div className="mx-auto max-w-[73rem] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Interactive Sentence Engine */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center text-left space-y-6 z-10">
            <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[3.8rem] font-extrabold tracking-tight text-neutral-900 leading-[1.15] sm:leading-[1.1]">
              Where independent talents <br className="hidden sm:inline" />
              and ecosystems{" "}
              <span className="relative inline-block mt-2 sm:mt-0">
                <span
                  className={`inline-flex items-center px-4 sm:px-5 py-1 sm:py-1.5 rounded-full text-[2.2rem] sm:text-[3.2rem] lg:text-[3.5rem] font-bold border transition-all duration-500 ease-in-out transform scale-100 ${words[index].color}`}
                >
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-3 animate-pulse bg-current" />
                  {words[index].text}
                </span>
              </span>{" "}
              together.
            </h1>

            <p className="max-w-xl text-base sm:text-lg font-medium text-neutral-500/85 leading-relaxed">
              Empowering student earners with flexible pathways, helping task posters find immediate execution, and enabling corporate clients to scale velocity seamlessly.
            </p>

            {/* Action Matrix */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="px-5 py-3 bg-neutral-900 text-white font-semibold text-sm rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-neutral-950/10">
                Get Started free
              </button>
              
              {/* Premium Vision Activation Button */}
              <button className="group flex items-center gap-2 px-5 py-3 bg-transparent text-neutral-600 font-semibold text-sm rounded-xl hover:text-neutral-900 hover:bg-neutral-100 active:scale-[0.98] transition-all duration-200">
                <span>Our Vision</span>
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200 text-neutral-400 group-hover:text-neutral-900" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Staggered Geometric Grid Layout */}
          <div className="col-span-1 lg:col-span-5 relative w-full h-[360px] sm:h-[450px] lg:h-[480px] flex items-center justify-center mt-6 lg:mt-0">
            <div className="relative w-full h-full max-w-[28rem] lg:max-w-none">
              
              {/* Card 01: The Base Anchor (Back Drop Left) */}
              <div className="absolute top-[10%] left-0 w-[55%] h-[60%] rounded-2xl bg-neutral-50 border border-neutral-200/70 p-2 shadow-md shadow-neutral-100 transform -rotate-3 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 ease-out group">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/assets/hero-student.jpg" 
                    alt="Student Earners Workspace" 
                    className="w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('bg-cloud-placeholder');
                    }}
                  />
                  {/* Fallback cloud wireframe if asset missing */}
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-neutral-400 pointer-events-none">
                    <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>
                  </div>
                </div>
              </div>

              {/* Card 02: The Focal Hero (Center Front) */}
              <div className="absolute top-[20%] right-4 w-[52%] h-[65%] rounded-2xl bg-white border border-neutral-300/80 p-2.5 shadow-xl shadow-neutral-200/80 z-20 transform rotate-2 hover:rotate-0 hover:scale-[1.04] transition-all duration-300 ease-out group">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/assets/hero-task.jpg" 
                    alt="Task Execution Platform" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-neutral-400 pointer-events-none">
                    <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>
                  </div>
                </div>
              </div>

              {/* Card 03: High-Altitude Cap (Top Right Accent) */}
              <div className="absolute top-0 right-[25%] w-[42%] h-[42%] rounded-xl bg-neutral-50 border border-neutral-200/60 p-1.5 shadow-sm shadow-neutral-100 z-10 transform -rotate-6 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 ease-out group">
                <div className="w-full h-full rounded-lg bg-gradient-to-tr from-neutral-100 to-neutral-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/assets/hero-corporate.jpg" 
                    alt="Corporate Analytics Dashboard" 
                    className="w-full h-full object-cover opacity-75 mix-blend-luminosity group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-neutral-400 pointer-events-none">
                    <svg className="w-6 h-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
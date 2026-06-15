import React from "react";

export default function HeroSection() {
  return (     
    <section className="bg-[#f7f6f6]">
      <main className="max-w-6xl w-full mx-auto px-6 py-12 sm:py-20">
        
        {/* Massive Beautiful Notion-style Topic with Clean Sub-lines */}
        <div className="mb-14">
          <h1 className="text-5xl sm:text-[56px] font-bold tracking-tight text-slate-900 max-w-4xl leading-[1.1]">
            On-demand campus talent, optimized.
          </h1>
          <p className="text-slate-500 mt-4 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
            Connecting local posters with verified state university undergraduates for instant physical errands and remote digital tasks.
          </p>
        </div>

        {/* 100% Accurate Notion Shape and Sizing Layout Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          
          {/* Card 1: Huge Hero Asymmetric Card (Spans across 2 columns) */}
          <div className="md:col-span-2 bg-[#ffffff] border border-slate-200/80 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5 min-h-[420px]">
            
            {/* Left Info Column */}
            <div className="p-8 sm:p-10 lg:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-[13px] text-slate-500 block mb-3 font-medium font-sans tracking-wide uppercase">AI Task Engine</span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-[1.25] mb-4">
                  Submit messy parameters. Let UniWork structure the work.
                </h3>
              </div>
              <div className="mt-6">
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-slate-800 transition-colors">
                  <span className="text-sm font-bold">→</span>
                </button>
              </div>
            </div>

            {/* Right Split Shape Block (Yellow Background Panel + Pure White Nested UI Component) */}
            <div className="bg-[#FFC85F]/90 border-t lg:border-t-0 lg:border-l border-slate-200/60 lg:col-span-3 p-8 flex items-center justify-center overflow-hidden">
              <div className="bg-white border border-slate-200/60 rounded-xl w-full max-w-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">New Task Parameter Analysis</span>
                  <div className="flex gap-1.5 text-slate-400 text-xs">
                    <span>⚡ AI Active</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-lg">
                    <p className="text-[11px] text-slate-400 font-mono">Raw input parsing...</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">"Need 2 guys to distribute marketing pamphlets near the university premises tomorrow morning"</p>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Structured Category:</span>
                      <span className="font-semibold text-slate-800">Physical / Local Logistics</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">System Recommended Budget:</span>
                      <span className="font-semibold text-emerald-600">LKR 3,500 / Student</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Campus Logistics Box (Red panel theme) */}
          <div className="bg-[#ffffff] border border-slate-200/80 rounded-2xl overflow-hidden grid grid-cols-1 min-h-[460px] flex flex-col justify-between">
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[13px] text-slate-500 block mb-3 font-medium font-sans tracking-wide uppercase">Hyper-Local Logistics</span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-[1.25] mb-4">
                  Safe physical errands. Managed via the Buddy System.
                </h3>
              </div>
              <div>
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-slate-800 transition-colors">
                  <span className="text-sm font-bold">→</span>
                </button>
              </div>
            </div>
            
            {/* Flat Red Background Bottom Box with Nested Pure White Card UI */}
            <div className="bg-[#F67564]/90 p-8 pt-10 border-t border-slate-200/60 flex items-end justify-center">
              <div className="bg-white border border-slate-200/60 rounded-xl w-full max-w-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5">
                <div className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] text-slate-700 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-bold">Active Geofence Tracking</span>
                  </div>
                  <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded">Team Size: 2</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-100 rounded"></div>
                  <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Anonymized telemetry active until delivery milestone verification</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Conflict Resolution & Escrow Box (Blue panel theme) */}
          <div className="bg-[#ffffff] border border-slate-200/80 rounded-2xl overflow-hidden grid grid-cols-1 min-h-[460px] flex flex-col justify-between">
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[13px] text-slate-500 block mb-3 font-medium font-sans tracking-wide uppercase">Automated Escrow</span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-[1.25] mb-4">
                  Guaranteed safety protocols & instant local payouts.
                </h3>
              </div>
              <div>
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-slate-800 transition-colors">
                  <span className="text-sm font-bold">→</span>
                </button>
              </div>
            </div>

            {/* Flat Blue Background Bottom Box with Nested Pure White Card UI */}
            <div className="bg-[#63ACEF]/90 p-8 pt-10 border-t border-slate-200/60 flex items-end justify-center">
              <div className="bg-white border border-slate-200/60 rounded-xl w-full max-w-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>Cryptographic Proof of Presence</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex justify-between items-center text-[11px]">
                    <span className="text-emerald-800 font-medium">PostGIS Spatial Audit Clear</span>
                    <span className="font-bold text-emerald-700">LankaQR Released</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </section>
  );
}
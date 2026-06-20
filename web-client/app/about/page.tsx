// web-client/app/about/page.tsx
"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 relative antialiased selection:bg-blue-50">
      
      {/* 10% Blueprint Structural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Structural Layout Container */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-24 relative z-10">
        
        {/* Upper Platform Utility Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-16">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-widest uppercase bg-slate-900 text-white px-2 py-1 rounded">UNIWORK // SRI LANKA</span>
            <span className="text-xs text-slate-400 font-mono hidden md:inline">SYS_STATUS: OPERATIONAL</span>
          </div>
          <span className="font-mono text-xs text-slate-500">v2.0.26_STABLE</span>
        </div>

        {/* Asymmetric Master Core Frame */}
        <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-100 flex flex-col lg:flex-row min-h-[620px]">
          
          {/* Left Block: Massive Immersive Cloud Artwork Container */}
          <div className="lg:w-5/12 bg-slate-900 relative flex flex-col justify-between p-8 text-white min-h-[350px] lg:min-h-full overflow-hidden">
            {/* The Background Cloud Image covering the full block */}
            <div className="absolute inset-0 opacity-40 mix-blend-luminosity pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80" 
                alt="Workspace Cloud Coverage" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="relative z-10 font-mono text-[10px] tracking-widest text-blue-400 uppercase">
              [ CORE_MATRIX_ENVIRONMENT ]
            </div>

            <div className="relative z-10 mt-auto">
              <p className="font-mono text-xs text-slate-400 mb-2">// DATA_LINK_VERIFIED</p>
              <h2 className="text-2xl font-light tracking-tight text-slate-100">
                Empowering the future of local decentralized technical execution.
              </h2>
            </div>
          </div>

          {/* Right Block: Content & Reading Layer */}
          <div className="lg:w-7/12 p-8 md:p-12 flex flex-col justify-between bg-white">
            
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                Ecosystem Framework
              </span>
              
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-6 tracking-tight leading-none">
                Bridging Student Potential <br />With Corporate Demands.
              </h1>
              
              <p className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed max-w-xl">
                Uniwork serves as the official, secure task marketplace platform across Sri Lanka. Built from the ground up, we enable university undergraduates to execute technical operations, protect transactional integrity, and interface directly with authorized corporate networks.
              </p>
            </div>

            {/* Micro-Mission Metrics row */}
            <div className="grid sm:grid-cols-2 gap-6 my-10 pt-8 border-t border-slate-100">
              <div>
                <h3 className="font-mono text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">
                  ■ Institutional Safety
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Strict profile validation ensures absolute compliance with academic credentials, creating an isolated tier of dependable talent.
                </p>
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">
                  ■ Operational Velocity
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Rapid micro-task allocations remove deployment overhead, linking enterprise assignments with active engineering minds effortlessly.
                </p>
              </div>
            </div>

            {/* Functional Link Controls */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100">
              <Link 
                href="/onboard"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono tracking-wider transition-colors shadow-sm"
              >
                EXECUTE_ONBOARDING()
              </Link>
              <Link 
                href="/"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-mono tracking-wider border border-slate-200 transition-colors"
              >
                GO_TO_MARKETPLACE
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom Panel: Structured Identity Segmentation */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          
          <div className="border border-slate-200/80 p-6 rounded-2xl bg-white hover:border-slate-300 transition-all">
            <div className="font-mono text-[11px] text-blue-600 uppercase tracking-widest mb-3">#01_UNDERGRADUATES</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Direct Monetization</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Secure specialized real-world workloads, structure authenticated portfolios, and manage student finances without institutional disruption.
            </p>
          </div>

          <div className="border border-slate-200/80 p-6 rounded-2xl bg-white hover:border-slate-300 transition-all">
            <div className="font-mono text-[11px] text-indigo-600 uppercase tracking-widest mb-3">#02_TASK_POSTERS</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">On-Demand Sourcing</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Easily distribute standalone workloads, digital collateral design, or technical debugs to a highly verified pool of local professionals.
            </p>
          </div>

          <div className="border border-slate-200/80 p-6 rounded-2xl bg-white hover:border-slate-300 transition-all">
            <div className="font-mono text-[11px] text-violet-600 uppercase tracking-widest mb-3">#03_CORPORATES</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Enterprise Channels</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Acquire early-access intelligence on matching engineering talent pools, optimize large scale operational tasks, and retain quality compliance.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
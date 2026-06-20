// web-client/app/about/page.tsx
"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-purple-100">
      
      {/* Premium 10% Mesh Accent Background Layer */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-gradient-to-b from-purple-50/40 via-indigo-50/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-28 relative z-10">
        
        {/* ==================== PREMIUM HERO SECTION ==================== */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-950 tracking-tight leading-[1.1]">
            Become Job-Ready with <br />
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Industry-Grade Tasks</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Start as a student and graduate completely field-tested. Gain hands-on production skills, solve real organizational bottlenecks, and earn verified credentials.
          </p>
        </section>


        {/* ==================== HIGH-ENGAGEMENT IMAGE GRID ==================== */}
        <section className="grid md:grid-cols-2 gap-8 mb-24">
          
          {/* Card Block 1: Student Focus */}
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100/60 transition-all hover:translate-y-[-2px]">
            <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
              <img 
                src="/assets/hero-student.jpg" 
                alt="AI Workflows & Automations" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-emerald-500 text-white font-medium text-[11px] tracking-wide px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Opportunities Open
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-950 tracking-tight">
                AI Workflows & Project Automations
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Learn to design, build, and deploy multi-agent RAG pipelines and engineering-grade applications while working on vetted local corporate tasks.
              </p>
            </div>
          </div>

          {/* Card Block 2: Corporate Focus */}
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100/60 transition-all hover:translate-y-[-2px]">
            <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
              <img 
                src="/assets/hero-corporate.jpg" 
                alt="Cyber Security & Infrastructure" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-emerald-500 text-white font-medium text-[11px] tracking-wide px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Network Live
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-950 tracking-tight">
                Secure Full-Stack Infrastructure
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Master production security setups. Build bulletproof backend systems, implement Clerk auth paths, and scale platform services with zero operational vulnerabilities.
              </p>
            </div>
          </div>

        </section>


        {/* ==================== SIGNATURE PREMIUM GRADIENT DISPLAY BANNER ==================== */}
        <section className="mb-24">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-indigo-600/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Smooth Glowing Core Vector */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />

            <div className="max-w-xl relative z-10">
              <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10 mb-6">
                Land a Job Track Guarantee
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Showcase Your Work, <br />Get Noticed!
              </h2>
              <p className="mt-4 text-sm text-indigo-50 leading-relaxed font-normal">
                Your projects deserve the spotlight. Share your absolute best production work directly with verified corporate managers, inspire fellow student engineers, and open doors to premier internships.
              </p>

              {/* Clean Custom Bullet Metrics */}
              <div className="mt-8 space-y-3.5">
                {[
                  "Get absolute visibility from tech recruiters & local software peers",
                  "Build out a robust, production-tested personal tech brand",
                  "Connect and orchestrate pipelines with like-minded developers"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-indigo-50">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white border border-white/20 shrink-0">
                      ➔
                    </span>
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium CTA Box */}
            <div className="shrink-0 w-full lg:w-auto text-center relative z-10">
              <Link 
                href="/onboard" 
                className="w-full lg:w-auto inline-block px-8 py-4 bg-white hover:bg-slate-50 text-slate-950 rounded-xl font-bold text-sm tracking-wide shadow-xl transition-all active:scale-[0.99]"
              >
                Showcase Your Project
              </Link>
            </div>

          </div>
        </section>


        {/* ==================== READING-FRIENDLY SYSTEM TIERS ==================== */}
        <section className="border-t border-slate-100 pt-16">
          <div className="text-center md:text-left mb-14">
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Structured Platform Profiles</h2>
            <p className="text-sm text-slate-400 mt-2">Clear identification alignments configured across our three core workspace modules.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Student Module */}
            <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl shadow-sm border border-purple-100">
                  🎓
                </div>
                <h4 className="font-bold text-slate-950 text-lg mt-5 mb-2">Undergraduates</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Secure authenticated production workloads. Manage real platform timelines, interface with API blocks, and scale up soft skills naturally.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] font-mono text-purple-600 font-bold">
                // SYSTEM_NODE_STUDENT
              </div>
            </div>

            {/* Poster Module */}
            <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shadow-sm border border-indigo-100">
                  ⚡
                </div>
                <h4 className="font-bold text-slate-950 text-lg mt-5 mb-2">Task Posters</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Delegate separate application fragments or design features. Review student portfolios instantly with checked tracking details.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] font-mono text-indigo-600 font-bold">
                // SYSTEM_NODE_POSTER
              </div>
            </div>

            {/* Corporate Module */}
            <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl shadow-sm border border-blue-100">
                  🏢
                </div>
                <h4 className="font-bold text-slate-950 text-lg mt-5 mb-2">Corporate Entities</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Deploy verified business profiles to access early tech talent streams directly out of state computing university branches.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] font-mono text-blue-600 font-bold">
                // SYSTEM_NODE_CORPORATE
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
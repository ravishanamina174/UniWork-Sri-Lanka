// web-client/app/about/page.tsx
"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-sky-50/20 text-slate-800 relative overflow-hidden">
      
      {/* Background Notion-style Dotted Matrix & Subtle Shapes */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-5 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Massive Modern Hero Section */}
      <section className="relative pt-24 pb-16 px-4 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Minimalist Notion-style Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-xs font-medium text-slate-600 shadow-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          The Uniwork Ecosystem
        </div>

        {/* Catchy Large Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight text-center max-w-4xl leading-[1.1]">
          The Decentralized Engine for <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
            Sri Lankan Undergraduates
          </span>
        </h1>

        <p className="mt-6 text-md md:text-xl text-slate-500 text-center max-w-2xl font-light leading-relaxed">
          A secure workspace matching hyper-vetted student intellect with immediate corporate execution demands. Simple. Accountable. Enterprise-grade.
        </p>

        {/* Cool Cloud Cover Image Asset Wrapper */}
        <div className="w-full max-w-5xl mt-12 aspect-[21/9] rounded-2xl border border-slate-200/70 overflow-hidden shadow-2xl shadow-slate-200/50 relative group bg-slate-100">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80" 
            alt="Workspace Sky Network" 
            className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
          />
          <div className="absolute bottom-6 left-6 z-20 hidden md:block">
            <span className="text-white text-xs font-mono bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
              // nodes_connected: university_of_moratuwa + multi_corporate
            </span>
          </div>
        </div>
      </section>

      {/* Reading Friendly Mission Matrix */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 relative z-20">
        
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:border-slate-300 transition-colors">
          <div className="text-xs font-mono uppercase tracking-widest text-blue-600 mb-2 font-bold">// 01 . core_mission</div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Accelerating Economic Mobility</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            We provide local undergraduates structural channels to engage in direct micro-consulting. By combining fast payouts with real-world scope execution, students offset educational living costs while building production-ready profiles.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:border-slate-300 transition-colors">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-600 mb-2 font-bold">// 02 . core_vision</div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Upgrading Industry Infrastructure</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            To standardise the gig economy. We verify academic credentials at the root layer, guaranteeing enterprises safe, audited interactions with the finest technical, engineering, and creative resources available inside state university boundaries.
          </p>
        </div>

      </section>

      {/* Clean, Three-Tier Ecosystem Guide */}
      <section className="max-w-5xl mx-auto px-4 py-16 relative z-20">
        <div className="border-t border-slate-200/60 pt-16 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Structured Operational Segments</h2>
          <p className="text-sm text-slate-500 mt-1">Unified registry processing across three specific operational identities.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Undergraduate Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm px-2 py-0.5 bg-sky-50 text-sky-700 font-mono rounded-md border border-sky-100">STU</span>
                <h4 className="font-bold text-slate-900 text-sm">Undergraduates</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vetted via secure campus tracking mechanisms. Students access verified project channels, request tasks aligned to specific modules, and securely trade micro-services.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Status: Verified Registry Active
            </div>
          </div>

          {/* Individual Posters Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm px-2 py-0.5 bg-amber-50 text-amber-700 font-mono rounded-md border border-amber-100">PST</span>
                <h4 className="font-bold text-slate-900 text-sm">Task Posters</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Peer stakeholders or community operators capable of publishing localized assignments, digital production items, or custom workloads directly onto the main workspace feed.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Status: KYC Authorization Ready
            </div>
          </div>

          {/* Corporate Clients Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm px-2 py-0.5 bg-purple-50 text-purple-700 font-mono rounded-md border border-purple-100">CORP</span>
                <h4 className="font-bold text-slate-900 text-sm">Corporate Entities</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Validated business profiles deploying large scale commercial sub-components. Built for rapid, secure talent pipeline acquisition directly out of institutional academic frameworks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Status: B2B Integration Open
            </div>
          </div>

        </div>
      </section>

      {/* Minimalist Powerful CTA Section */}
      <section className="max-w-5xl mx-auto px-4 pb-24 relative z-20">
        <div className="bg-slate-900 text-slate-100 p-8 md:p-12 rounded-2xl shadow-xl shadow-slate-900/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
          
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">Initialize your integration today</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Experience the optimized synchronization of Sri Lankan academic capabilities with digital enterprise task execution workflows.
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <Link 
              href="/onboard"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs transition-colors shadow-lg shadow-blue-600/20"
            >
              Configure Profile
            </Link>
            <Link 
              href="/"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs border border-slate-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
// web-client/app/about/page.tsx
"use client";

import Career from "@/components/Career";
import ShowcaseSection from "@/components/Showcase";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AboutPage() {

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-purple-100 font-medium overflow-x-hidden relative">
      
      {/* Premium 10% Mesh Accent Background Layer */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-gradient-to-b from-purple-50/40 via-indigo-50/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-28 relative z-10">
        
        {/* Floating Circle Close Button linking to Home Page */}
        {/* <div className="absolute top-8 right-4 md:right-8">
          <Link 
            href="/" 
            className="flex items-center justify-center w-10 height h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-label="Close page"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
        </div> */}
        
        {/* ==================== PREMIUM HERO SECTION ==================== */}
        <section className="text-center max-w-3xl mx-auto mb-20 relative">
          
          {/* Notion Doodle 1: Hand-drawn Crown above Heading */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-20 text-slate-900 pointer-events-none select-none">
            <svg width="60" height="50" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 70 L 20 25 L 42 45 L 50 15 L 58 45 L 80 25 L 90 70 Z" />
              <path d="M8 72 C 30 76, 70 76, 92 72" />
              <circle cx="20" cy="20" r="3" fill="currentColor" />
              <circle cx="50" cy="10" r="3" fill="currentColor" />
              <circle cx="80" cy="20" r="3" fill="currentColor" />
            </svg>
          </div>

          {/* Notion Doodle 2: Top Left Hand-drawn Connecting Arrow */}
          <div className="hidden xl:block absolute -top-10 -left-28 opacity-25 text-slate-900 pointer-events-none select-none">
            <svg width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 20 Q 40 10, 50 30 T 40 70 Q 35 80, 65 65" />
              <polyline points="55 63 67 65 63 77" />
            </svg>
          </div>

          {/* Notion Doodle 3: Far Left Spark Idea Bulb loop */}
          <div className="hidden lg:block absolute top-16 -left-36 opacity-20 text-slate-900 pointer-events-none select-none">
            <svg width="75" height="75" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M50 20 C 35 20, 30 35, 35 50 C 38 58, 43 65, 43 75 L 57 75 C 57 65, 62 58, 65 50 C 70 35, 65 20, 50 20 Z" />
              <path d="M43 80 H 57 M46 85 H 54" />
              <path d="M50 5 L 50 12 M20 35 L 28 38 M80 35 L 72 38" />
            </svg>
          </div>

          {/* Notion Doodle 4: Top Right Sparkles */}
          <div className="hidden md:block absolute -top-8 -right-16 opacity-30 text-slate-900 pointer-events-none select-none animate-pulse">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M40 15 Q 40 30 55 30 Q 40 30 40 45 Q 40 30 25 30 Q 40 30 40 15 Z" fill="currentColor" fillOpacity="0.05" />
              <path d="M75 45 Q 75 52 82 52 Q 75 52 75 59 Q 75 52 68 52 Q 75 52 75 45 Z" fill="currentColor" fillOpacity="0.05" />
            </svg>
          </div>

          {/* Notion Doodle 5: Far Right Scribble / Star loop */}
          <div className="hidden xl:block absolute top-20 -right-36 opacity-25 text-slate-900 pointer-events-none select-none">
            <svg width="85" height="85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M50 15 L 58 38 L 83 38 L 63 53 L 71 78 L 50 63 L 29 78 L 37 53 L 17 38 L 42 38 Z" />
              <path d="M15 20 Q 25 15, 20 30" />
              <path d="M85 70 Q 75 80, 80 60" />
            </svg>
          </div>

          {/* Notion Doodle 6: Bottom Left Focus / Concept Circle */}
          <div className="hidden lg:block absolute -bottom-6 -left-20 opacity-20 text-slate-900 pointer-events-none select-none">
            <svg width="85" height="85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3">
              <circle cx="50" cy="50" r="35" />
              <path d="M50 5 L 50 20 M50 95 L 50 80 M5 50 L 20 50 M95 50 L 80 50" strokeDasharray="none" />
            </svg>
          </div>

          {/* Notion Doodle 7: Bottom Right Double Under-Arrow */}
          <div className="hidden md:block absolute -bottom-12 -right-16 opacity-20 text-slate-900 pointer-events-none select-none">
            <svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20 50 C 40 80, 70 70, 75 40" />
              <polyline points="65 44 75 38 78 49" />
              <path d="M35 65 C 50 85, 75 78, 80 55" strokeWidth="1" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] relative inline-block">
            Empowering Sri Lankan Undergraduates, <br />
            <span className="text-slate-900 relative">
              One Micro-Gig at a Time.
              {/* Notion Doodle 8: Smooth Hand-drawn Accent Underline */}
              <svg className="absolute left-0 -bottom-3 w-full h-3 text-slate-900 opacity-25 pointer-events-none" viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
                <path d="M5 5 C 50 2, 150 8, 295 4 C 200 6, 80 3, 15 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </section>

        
        <div className= "mt-36 mb-36">
                <Career/>
        </div>

        {/* ==================== HIGH-ENGAGEMENT IMAGE GRID ==================== */}
        {/* <section className="grid md:grid-cols-2 gap-8 mb-24">
          

          <div className="bg-[#f7faf8] rounded-[1rem] border border-slate-200 overflow-hidden  transition-all hover:translate-y-[-2px]">
            <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
              <img 
                src="https://plus.unsplash.com/premium_vector-1683141059887-933a8394b824?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGFsZW50fGVufDB8fDB8fHww" 
                alt="Ambitious Student Talent Pool" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-white text-black font-medium text-[11px] tracking-wide px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Opportunities Open
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-950 tracking-tight">
                Tap into a Massive Pool of Ambitious, Ready-to-Work Talent.
              </h3>
              <p className="mt-3 text-m text-[#7f8185] font-medium leading-relaxed">
                Need a team for an event today or a quick digital creator by tonight? UniWork connects you with thousands of verified university students ready to deploy instantly. Instead of waiting weeks to hire, you can scale your workforce in minutes, tapping into smart, tech-savvy undergraduates who learn fast and deliver high-quality results on demand.
              </p>
            </div>
          </div>


          <div className="bg-[#f7faf8] rounded-[1rem] border border-slate-200 overflow-hidden transition-all hover:translate-y-[-2px]">
            <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
              <img 
                src="https://plus.unsplash.com/premium_vector-1682270042817-05b6a42fc274?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fHw%3D" 
                alt="Corporate Infrastructure Integration" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-white text-black font-medium text-[11px] tracking-wide px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Network Live
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-950 tracking-tight">
                Partner with Sri Lanka’s Brightest Campus Talent.
              </h3>
              <p className="mt-3 text-m text-[#7f8185] font-medium leading-relaxed">
                UniWork for Business gives corporate clients streamlined access to a vetted, hyper-local workforce of state university students for urgent campus errands, marketing drives, and digital projects. From managing high-volume data entry to executing on-the-ground promotional campaigns, our platform handles secure bulk-credit payments and compliance natively. By leveraging our verified student network, your company can scale operations instantly while directly supporting undergraduate welfare.
              </p>
            </div>
          </div>

        </section> */}

        {/* <section className="mt-32 pt-24 relative">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
            

            <div className="md:w-4/12 md:sticky md:top-24 mr-5 h-fit">
              <h2 className="text-4xl lg:text-5xl font-medium text-slate-950 tracking-tight leading-[1.15] mt">
                Our 3-Step <br />
                Success <br />
                Pathway
              </h2>
            </div>


            <div className="md:w-8/12 relative pl-8 md:pl-12">
              

              <div className="absolute left-0 top-3  bottom-3 w-[2px] bg-slate-100" />


              <div className="relative ml-25 pb-20 group">

                <div className="absolute -left-[39px] md:-left-[55px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-slate-300 ring-4 ring-slate-100 group-hover:bg-gray-600 group-hover:ring-purple-100 transition-all duration-300 z-10" />
                
                <div className="flex items-start gap-4">
                  <span className="text-lg font-mono font-bold text-slate-400 select-none pt-0.5 group-hover:text-gray-600 transition-colors">
                    1.
                  </span>
                  <div>
                    <h2 className="text-4xl lg:text-4xl font-normal text-[#484a4d] tracking-tight leading-[1.15] mt">
                       Strict Verification & <br />
                       Smart Skill Mapping 
                    </h2>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 max-w-md shadow-sm">
                      <img 
                        src="https://plus.unsplash.com/premium_vector-1725524675900-2a5b74b9bb86?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2tpbGxzfGVufDB8fDB8fHww" 
                        alt="Secure Escrow Transaction Payout" 
                        className="w-full h-70 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>


              <div className="relative ml-25 pb-20 group">

                <div className="absolute -left-[39px] md:-left-[55px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-slate-300 ring-4 ring-slate-100 group-hover:bg-gray-600 group-hover:ring-indigo-100 transition-all duration-300 z-10" />
                
                <div className="flex items-start gap-4">
                  <span className="text-lg font-mono font-bold text-slate-400 select-none pt-0.5 group-hover:text-gray-600 transition-colors">
                    2.
                  </span>
                  <div>
                    <h2 className="text-4xl lg:text-4xl font-normal text-[#484a4d] tracking-tight leading-[1.15] mt">
                       Instant Deployment & <br />
                       Secure Execution
                    </h2>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 max-w-md shadow-sm">
                      <img 
                        src="https://plus.unsplash.com/premium_vector-1750154283636-b54d8208e729?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGRlcGxveW1lbnR8ZW58MHx8MHx8fDA%3D" 
                        alt="Digital Workspace Execution" 
                        className="w-full h-70 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>


              <div className="relative ml-25 group">

                <div className="absolute -left-[39px] md:-left-[55px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-slate-300 ring-4 ring-slate-100 group-hover:bg-gray-600 group-hover:ring-blue-100 transition-all duration-300 z-10" />
                
                <div className="flex items-start gap-4">
                  <span className="text-lg font-mono font-bold text-slate-400 select-none pt-0.5 group-hover:text-gray-600 transition-colors">
                    3.
                  </span>
                  <div>
                    <h2 className="text-4xl lg:text-4xl font-normal text-[#484a4d] tracking-tight leading-[1.15] mt">
                       Verified Proof-of-Presence <br />
                       Payout
                    </h2>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 max-w-85 shadow-sm">
                      <img 
                        src="https://plus.unsplash.com/premium_vector-1728586228949-fc0b5697fa57?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fFBheW91dHxlbnwwfHwwfHx8MA%3D%3D" 
                        alt="Secure Escrow Transaction Payout" 
                        className="w-full h-70 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section> */}

        {/* <div className= "mt-36">
          <ShowcaseSection/>
        </div> */}

      </div>
    </div>
    </>
  );
}
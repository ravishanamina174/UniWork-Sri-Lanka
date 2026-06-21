// web-client/app/about/page.tsx
"use client";

import Career from "@/components/Career";
import ShowcaseSection from "@/components/Showcase";
import Link from "next/link";

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-purple-100">
      
      {/* Premium 10% Mesh Accent Background Layer */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-gradient-to-b from-purple-50/40 via-indigo-50/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-28 relative z-10">
        
        {/* ==================== PREMIUM HERO SECTION ==================== */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-350 tracking-tight leading-[1.1]">
            Empowering Sri Lankan Undergraduates, <br />
            <span className="bg-clip-text text-transparent bg-[#919692]">One Micro-Gig at a Time.</span>
          </h1>
          <p className="mt-6 text md:text-lg text-[#717275] max-w-1xl mx-auto leading-relaxed">
            UniWork bridges the gap between unpredictable university timetables and the rising cost of living in Sri Lanka. Our platform connects verified undergraduates with on-demand digital and physical gigs within a 4km campus radius. Featuring real-time GPS safety logs, AI-driven pricing, and secure LankaQR escrow payments, UniWork delivers a reliable, scam-free freelancing ecosystem that is 100% free for students.
          </p>
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
  );
}
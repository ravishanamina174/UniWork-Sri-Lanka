"use client";

import { Search, Sparkles } from "lucide-react";
import UniworkWatermark from "./UniworkWatermark";

export default function HeroSection() {
  return (
    <>
      <style>{`
        @keyframes border-gradient {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        .btn-gradient-wrapper {
          position: relative;
          display: inline-block;
          border-radius: 14px;
          padding: 1px;
          background: #ededed;
          transition: background 0.3s ease;
          z-index: 1;
        }

        .btn-gradient-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: linear-gradient(
            90deg,
            #007fff,
            #a855f7,
            #ec4899,
            #f59e0b,
            #007fff
          );
          background-size: 300% 100%;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-gradient-wrapper:hover::before {
          opacity: 1;
          animation: border-gradient 3s linear infinite;
        }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #ffffff;
          border-radius: 13px;
          transition: all 0.2s ease;
        }

        .btn-gradient-wrapper:hover .btn-inner {
          background: #fafafa;
        }

        .cloud-shape-1 {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: morph 8s ease-in-out infinite;
        }

        .cloud-shape-2 {
          border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%;
          animation: morph2 9s ease-in-out infinite reverse;
        }

        @keyframes morph {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }

          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }

          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
        }

        @keyframes morph2 {
          0% {
            border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%;
          }

          50% {
            border-radius: 70% 30% 40% 60% / 60% 40% 60% 30%;
          }

          100% {
            border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%;
          }
        }
      `}</style>

      <section className="relative w-full min-h-screen flex flex-col items-center pt-10 pb-15 overflow-hidden bg-white font-sans text-[#37352f]">
        <div className="absolute top-0 inset-x-0 h-[768px] bg-gradient-to-b from-[#f8f7f6] to-[#fafaf9] pointer-events-none z-0 rounded-b-[3rem] border-b border-b-[#eae9e7] " />

        {/* Red Doodle */}
        <div className="absolute top-32 left-[4%] opacity-50 text-red-500 pointer-events-none select-none z-0 animate-pulse">
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          >
            <path d="M10 50 Q 30 10, 50 50 T 90 50" />
          </svg>
        </div>

        {/* Green Doodle */}
        <div className="absolute bottom-[35%] left-[8%] opacity-50 text-green-500 pointer-events-none select-none z-0">
          <svg
            width="50"
            height="50"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon
              points="50,10 61,39 92,39 67,58 76,89 50,70 24,89 33,58 8,39 39,39"
              fill="currentColor"
              fillOpacity="0.2"
            />
          </svg>
        </div>

        {/* Yellow Doodle */}
        <div className="absolute top-[15%] right-[48%] opacity-60 text-yellow-400 pointer-events-none select-none z-0">
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          >
            <circle
              cx="50"
              cy="50"
              r="30"
              strokeDasharray="10 10"
            />

            <circle
              cx="50"
              cy="50"
              r="10"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Orange Doodle */}
        <div className="absolute top-24 right-[8%] opacity-50 text-orange-500 pointer-events-none select-none z-0">
          <svg
            width="45"
            height="45"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          >
            <path d="M20 20 L 80 80 M 80 20 L 20 80" />

            <circle
              cx="50"
              cy="50"
              r="40"
              strokeDasharray="15 15"
            />
          </svg>
        </div>

        {/* Brown Doodle */}
        <div className="absolute top-[45%] right-[4%] opacity-40 text-amber-800 pointer-events-none select-none z-0">
          <svg
            width="55"
            height="55"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          >
            <path d="M10 90 C 30 70, 70 30, 90 10" />
            <path d="M30 90 C 50 70, 90 30, 90 30" />

            <circle
              cx="20"
              cy="80"
              r="6"
              fill="currentColor"
            />

            <circle
              cx="80"
              cy="20"
              r="6"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Original Neutral Doodles */}
        <div className="absolute -top-4 left-1/3 opacity-20 text-slate-900 pointer-events-none select-none">
          <svg
            width="60"
            height="50"
            viewBox="0 0 100 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 70 L 20 25 L 42 45 L 50 15 L 58 45 L 80 25 L 90 70 Z" />

            <path d="M8 72 C 30 76, 70 76, 92 72" />

            <circle
              cx="20"
              cy="20"
              r="3"
              fill="currentColor"
            />

            <circle
              cx="50"
              cy="10"
              r="3"
              fill="currentColor"
            />

            <circle
              cx="80"
              cy="20"
              r="3"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* HERO CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* LEFT SIDE */}
          <div className="flex flex-col items-start text-left w-full z-10">
            <div className="inline-block border border-[#d1d5db] rounded-full px-4 py-1.5 text-[0.85rem] font-medium text-[#4b5563] mb-6 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              The First Dedicated Student Task Network in Sri Lanka
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-extrabold text-[#111827] tracking-tight leading-[1.15] max-w-2xl relative inline-block">
              Empowering Sri Lankan Undergraduates,

              <br className="hidden lg:block" />

              <span className="relative inline-block mt-2">
                One Micro-Gig at a Time.

                <svg
                  className="absolute left-0 -bottom-3 w-full h-3 text-[#ff6a00] opacity-40 pointer-events-none"
                  viewBox="0 0 300 10"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M5 5 C 50 2, 150 8, 295 4 C 200 6, 80 3, 15 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-[#787774] text-lg md:text-xl font-medium mt-8 max-w-xl leading-relaxed">
              Grab a task, deliver the work, get paid directly, and level up your profile.
              The central hub to post tasks and discover on-campus opportunities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-5 mt-10 w-full sm:w-auto">
              <div className="btn-gradient-wrapper w-full sm:w-auto cursor-pointer">
                <button className="btn-inner w-full sm:w-auto px-6 py-3 text-[#111827] font-bold text-base shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                  <Sparkles
                    size={16}
                    className="text-[#b27f40]"
                  />
                  Explore Student Portal
                </button>
              </div>

              <div className="btn-gradient-wrapper w-full sm:w-auto cursor-pointer">
                <button className="btn-inner w-full sm:w-auto px-6 py-3 text-[#787774] font-semibold text-base shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                  <Search size={18} />
                  Find Active Tasks
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative w-full h-[400px] sm:h-[500px] flex justify-center items-center z-10 mt-10 lg:mt-0">
            <div className="absolute right-0 sm:right-6 top-0 sm:top-10 w-48 sm:w-64 h-48 sm:h-64 shadow-[0_12px_40px_rgba(0,0,0,0.08)] cloud-shape-1 overflow-hidden border-4 border-white bg-slate-100 z-20">
              <img
                src="https://images.unsplash.com/photo-1746436576978-21632bf9790d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdyYXNzJTIwY3V0dGluZ3xlbnwwfHwwfHx8MA%3D%3D"
                alt="Teenagers collaborating"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute left-0 sm:left-6 bottom-0 sm:bottom-10 w-56 sm:w-72 h-56 sm:h-72 shadow-[0_12px_40px_rgba(0,0,0,0.08)] cloud-shape-2 overflow-hidden border-4 border-white bg-slate-100 z-10">
              <img
                src="https://plus.unsplash.com/premium_photo-1661547843345-e1ca800df0e0?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWd8Hx8fA%3D%3D"
                alt="Teenagers studying"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* UNIWORK AREA */}
        <div className="mt-80 w-full relative z-10">
          <UniworkWatermark />
        </div>
      </section>
    </>
  );
}
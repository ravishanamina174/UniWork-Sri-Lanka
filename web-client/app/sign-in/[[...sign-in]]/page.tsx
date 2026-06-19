// web-client/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Grid Configuration
    const dotSpacing = 28;
    const dots: { x: number; y: number; ox: number; oy: number; vx: number; vy: number }[] = [];

    // Initialize Dot Matrix Coordinates
    const initDots = () => {
      dots.length = 0;
      for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
        for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
          dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }
    };

    initDots();

    // Handle Window Resizing gracefully
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    };
    window.addEventListener("resize", handleResize);

    // Main Interactive Canvas Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000000";

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const radius = 80; // How far the mouse effect reaches

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        // Calculate vector distance from mouse cursor to dot
        const dx = mouseX - dot.ox;
        const dy = mouseY - dot.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          // Calculate localized shake intensity based on proximity
          const force = (radius - dist) / radius;
          
          // Apply an organic, high-frequency mathematical shake tremor
          const angle = Math.random() * Math.PI * 2;
          const shakeAmt = force * 6; // Amplitude of the shake in pixels
          
          const targetX = dot.ox + Math.cos(angle) * shakeAmt;
          const targetY = dot.oy + Math.sin(angle) * shakeAmt;

          dot.vx += (targetX - dot.x) * 0.2;
          dot.vy += (targetY - dot.y) * 0.2;
        } else {
          // Smooth spring return to original default home coordinate positioning
          dot.vx += (dot.ox - dot.x) * 0.08;
          dot.vy += (dot.oy - dot.y) * 0.08;
        }

        // Apply drag/friction variables so they snap to standard behavior quickly
        dot.vx *= 0.75;
        dot.vy *= 0.75;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Render dot circle structure onto backdrop layer canvas element
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Tracking structural mouse coordinate motion movements
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  // Push coordinates offscreen when client departs frame to stop activity
  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div 
      className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden font-sans"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* --- CANVAS TRACKED REACTION BACKGROUND GRID --- */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-[0.45] pointer-events-none"
      />

      {/* --- BACKGROUND ARTWORK (Static Notion Colored Badges) --- */}
      <div className="absolute inset-0 pointer-events-none z-10 text-black select-none">
        
        {/* Top Left - Book/Education Motif (Yellow Circle) */}
        <div className="absolute top-[12%] left-[8%] -rotate-12 flex items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-amber-200 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className="w-8 h-8 rounded-md bg-stone-100 border-2 border-black flex items-center justify-center text-xs font-bold shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            ✓
          </div>
        </div>

        {/* Mid Left - Development & Coding (Cyan Circle) */}
        <div className="absolute top-[40%] left-[5%] rotate-6">
          <div className="w-14 h-14 rounded-full bg-cyan-200 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
        </div>

        {/* Bottom Left - Case/Work Gig Motif (Orange Circle) */}
        <div className="absolute bottom-[14%] left-[10%] -rotate-6">
          <div className="w-18 h-18 px-5 py-4 rounded-full bg-orange-200 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
        </div>

        {/* Top Right - Creative Checkbox (Purple Circle) */}
        <div className="absolute top-[15%] right-[8%] rotate-12 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-stone-50 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </div>
          <div className="w-16 h-16 rounded-full bg-purple-300 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-7 h-7 bg-white border-2 border-black rounded flex items-center justify-center font-black text-lg">
              ✓
            </div>
          </div>
        </div>

        {/* Mid Right - Rocket/Growth Motif (Green Circle) */}
        <div className="absolute top-[45%] right-[6%] -rotate-12">
          <div className="w-14 h-14 rounded-full bg-emerald-200 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 14 4-4 4 4" />
              <path d="M16 10v10" />
              <path d="m4 14 4-4 4 4" />
              <path d="M8 10v10" />
            </svg>
          </div>
        </div>

        {/* Bottom Right - Target Accomplishment (Rose Circle) */}
        <div className="absolute bottom-[16%] right-[11%] rotate-6">
          <div className="w-16 h-16 rounded-full bg-rose-200 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
        </div>

        {/* Sharp Solid Deco Sparkles */}
        <div className="absolute top-[26%] left-[22%] text-3xl font-black opacity-80">✦</div>
        <div className="absolute bottom-[35%] left-[26%] text-xl font-black opacity-70">✦</div>
        <div className="absolute top-[10%] right-[24%] text-2xl font-black opacity-90">✦</div>
        <div className="absolute bottom-[24%] right-[30%] text-3xl font-black opacity-80">✦</div>
      </div>

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-4 w-full max-w-md pointer-events-auto">
        <div className="text-center space-y-1 select-none">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            UniWork<span className="text-orange-500">SL</span>
          </h1>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Student Gig Platform
          </p>
        </div>

        <div className="w-full flex justify-center">
          <SignIn 
            appearance={{
              variables: {
                colorPrimary: "#f97316",
                colorBackground: "#ffffff",
              },
              elements: {
                card: "shadow-none border-0 mx-auto bg-transparent",
                navbar: "hidden", 
                footer: "bg-transparent"
              }
            }}
          />       
        </div>
      </div>
    </div>
  );
}
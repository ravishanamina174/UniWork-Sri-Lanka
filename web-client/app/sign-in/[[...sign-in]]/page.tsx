// web-client/app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden font-sans">
      
      {/* --- BACKGROUND ARTWORK (Rich Notion-Style Minimalist Doodles on White) --- */}
      <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
        
        {/* ================= TOP LEFT REGION ================= */}
        {/* 1. Crown & Dotted Accent */}
        <div className="absolute top-[8%] left-[8%] opacity-65 rotate-[-8deg]">
          <svg width="55" height="42" viewBox="0 0 60 45" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 35 L5 12 L20 22 L30 8 L40 22 L55 12 L52 35 Z" />
            <circle cx="5" cy="10" r="1.5" fill="#64748B" />
            <circle cx="30" cy="6" r="1.5" fill="#64748B" />
            <circle cx="55" cy="10" r="1.5" fill="#64748B" />
            <line x1="10" y1="39" x2="50" y2="39" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* 2. Curved Swoop Arrow */}
        <div className="absolute top-[18%] left-[4%] opacity-40 rotate-[-15deg]">
          <svg width="50" height="50" viewBox="0 0 60 60" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 10 Q 35 15, 38 38" />
            <path d="M28 36 L38 38 L38 28" />
          </svg>
        </div>

        {/* 3. Code Brackets Icon </ > */}
        <div className="absolute top-[28%] left-[11%] opacity-55 rotate-[6deg]">
          <svg width="45" height="45" viewBox="0 0 50 50" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 14 6 25 16 36" />
            <polyline points="34 14 44 25 34 36" />
            <line x1="28" y1="12" x2="22" y2="38" />
          </svg>
        </div>


        {/* ================= MID LEFT REGION ================= */}
        {/* 4. Lightbulb Doodle */}
        <div className="absolute top-[42%] left-[5%] opacity-60 rotate-[-10deg]">
          <svg width="55" height="75" viewBox="0 0 60 80" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 50 C12 42 10 30 18 20 C26 10 38 10 44 20 C50 30 48 42 40 50 L40 58 L20 58 Z" />
            <line x1="24" y1="64" x2="36" y2="64" />
            <line x1="27" y1="69" x2="33" y2="69" />
            <line x1="30" y1="4" x2="30" y2="9" />
            <line x1="10" y1="14" x2="14" y2="17" />
            <line x1="50" y1="14" x2="46" y2="17" />
            <line x1="4" y1="32" x2="9" y2="32" />
            <line x1="56" y1="32" x2="51" y2="32" />
          </svg>
        </div>

        {/* 5. Open Book Doodle */}
        <div className="absolute top-[56%] left-[12%] opacity-50 rotate-[8deg]">
          <svg width="50" height="40" viewBox="0 0 50 40" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8 C12 5, 20 8, 25 12 C30 8, 38 5, 46 8 L46 32 C38 29, 30 32, 25 36 C20 32, 12 29, 4 32 Z" />
            <line x1="25" y1="12" x2="25" y2="36" />
          </svg>
        </div>

        {/* 6. Coffee Mug Doodle */}
        <div className="absolute top-[68%] left-[4%] opacity-45 rotate-[-6deg]">
          <svg width="40" height="45" viewBox="0 0 45 45" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="14" width="22" height="24" rx="4" />
            <path d="M30 18 C36 18, 37 28, 30 30" />
            <path d="M14 6 Q 16 10, 14 12" strokeDasharray="1 2" />
            <path d="M22 6 Q 24 10, 22 12" strokeDasharray="1 2" />
          </svg>
        </div>


        {/* ================= BOTTOM LEFT REGION ================= */}
        {/* 7. Dotted Crosshair Target */}
        <div className="absolute bottom-[16%] left-[9%] opacity-45">
          <svg width="70" height="70" viewBox="0 0 80 80" fill="none" stroke="#94A3B8" strokeWidth="1.5">
            <circle cx="40" cy="40" r="24" strokeDasharray="4 4" />
            <line x1="40" y1="5" x2="40" y2="75" strokeDasharray="3 3" />
            <line x1="5" y1="40" x2="75" y2="40" strokeDasharray="3 3" />
          </svg>
        </div>

        {/* 8. Briefcase Gig Icon */}
        <div className="absolute bottom-[28%] left-[15%] opacity-50 rotate-[-12deg]">
          <svg width="42" height="42" viewBox="0 0 50 50" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="16" width="34" height="24" rx="3" />
            <path d="M18 16 V10 C18 8, 20 6, 22 6 H28 C30 6, 32 8, 32 10 V16" />
            <line x1="8" y1="26" x2="42" y2="26" />
          </svg>
        </div>

        {/* 9. Graduation Cap */}
        <div className="absolute bottom-[6%] left-[17%] opacity-55 rotate-[5deg]">
          <svg width="50" height="40" viewBox="0 0 60 45" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="30,5 55,18 30,31 5,18" />
            <path d="M14 23 V34 C14 34, 20 39, 30 39 C40 39, 46 34, 46 34 V23" />
            <path d="M50 21 V35 M48 35 H52" />
          </svg>
        </div>


        {/* ================= TOP CENTER REGION ================= */}
        {/* 10. Pencil / Write Doodle */}
        <div className="absolute top-[8%] left-[34%] opacity-45 rotate-[25deg]">
          <svg width="45" height="45" viewBox="0 0 50 50" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 38 L12 44 L40 16 L34 10 Z" />
            <path d="M6 38 L4 46 L12 44" />
            <line x1="28" y1="16" x2="34" y2="22" />
          </svg>
        </div>

        {/* 11. Top Center Curved Loop Arrow */}
        <div className="absolute top-[6%] right-[32%] opacity-40 rotate-[140deg]">
          <svg width="45" height="45" viewBox="0 0 50 50" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10 25 C10 10, 35 10, 35 25 C35 38, 20 40, 40 42" strokeDasharray="2 2" />
            <path d="M34 44 L40 42 L38 36" />
          </svg>
        </div>


        {/* ================= TOP RIGHT REGION ================= */}
        {/* 12. Paper Airplane with Dotted Trail */}
        <div className="absolute top-[7%] right-[8%] opacity-70">
          <svg width="130" height="130" viewBox="0 0 120 120" fill="none">
            <path d="M15 95 Q 40 90, 55 55 T 90 30" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <g transform="translate(75, 10) rotate(-8)">
              <polygon points="0,22 40,0 24,40 18,26" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="18" y1="26" x2="40" y2="0" stroke="#64748B" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* 13. Checkmark Box Doodle */}
        <div className="absolute top-[20%] right-[18%] opacity-60 rotate-[-10deg]">
          <svg width="42" height="42" viewBox="0 0 45 45" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="6" width="33" height="33" rx="5" strokeDasharray="30 4" />
            <path d="M14 22 L20 28 L32 14" strokeWidth="2" stroke="#475569" />
          </svg>
        </div>

        {/* 14. Rocket Growth Motif */}
        <div className="absolute top-[30%] right-[6%] opacity-55 rotate-[15deg]">
          <svg width="48" height="48" viewBox="0 0 50 50" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M25 5 C35 12, 38 25, 38 35 L25 30 L12 35 C12 25, 15 12, 25 5 Z" />
            <circle cx="25" cy="18" r="4" />
            <path d="M12 35 L5 42 M38 35 L45 42" />
          </svg>
        </div>


        {/* ================= MID RIGHT REGION ================= */}
        {/* 15. Hand-Drawn Star */}
        <div className="absolute top-[44%] right-[11%] opacity-55 rotate-[12deg]">
          <svg width="42" height="42" viewBox="0 0 50 50" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M25 5 L31 18 L45 19 L34 28 L38 42 L25 34 L12 42 L16 28 L5 19 L19 18 Z" />
          </svg>
        </div>

        {/* 16. Magnifying Glass / Search */}
        <div className="absolute top-[56%] right-[5%] opacity-50 rotate-[-20deg]">
          <svg width="45" height="45" viewBox="0 0 50 50" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="20" cy="20" r="13" />
            <line x1="30" y1="30" x2="44" y2="44" strokeWidth="2" />
            <path d="M14 16 A 7 7 0 0 1 22 13" />
          </svg>
        </div>

        {/* 17. Clock / Time Doodle */}
        <div className="absolute top-[68%] right-[14%] opacity-45 rotate-[8deg]">
          <svg width="40" height="40" viewBox="0 0 45 45" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="22" cy="22" r="17" />
            <polyline points="22 12 22 22 28 26" />
          </svg>
        </div>


        {/* ================= BOTTOM RIGHT REGION ================= */}
        {/* 18. Soft Minimalist Pastel Bullseye Target */}
        <div className="absolute bottom-[8%] right-[8%] opacity-75">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            <circle cx="45" cy="55" r="28" stroke="#CBD5E1" strokeWidth="1.5"/>
            <circle cx="45" cy="55" r="18" stroke="#94A3B8" strokeWidth="1.5" fill="#FEE2E2" fillOpacity="0.3"/>
            <circle cx="45" cy="55" r="7" stroke="#64748B" strokeWidth="1.5" fill="#FB7185" fillOpacity="0.4"/>
            <path d="M75 22 Q 75 32 85 32 Q 75 32 75 42 Q 75 32 65 32 Q 75 32 75 22 Z" fill="#94A3B8"/>
          </svg>
        </div>

        {/* 19. Lightning Bolt */}
        <div className="absolute bottom-[20%] right-[4%] opacity-55 rotate-[-10deg]">
          <svg width="35" height="50" viewBox="0 0 40 55" fill="none" stroke="#64748B" strokeWidth="1.5" fill="#FEF08A" fillOpacity="0.3" strokeLinejoin="round">
            <polygon points="22,2 6,28 20,28 14,52 34,20 20,20" />
          </svg>
        </div>

        {/* 20. Bottom Right Swoosh Arrow */}
        <div className="absolute bottom-[28%] right-[16%] opacity-40">
          <svg width="45" height="45" viewBox="0 0 50 50" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10 40 Q 25 45, 38 25" />
            <path d="M28 25 L38 25 L38 35" />
          </svg>
        </div>

        {/* 21. Globe / Network Doodle */}
        <div className="absolute bottom-[5%] right-[22%] opacity-45 rotate-[10deg]">
          <svg width="42" height="42" viewBox="0 0 45 45" fill="none" stroke="#94A3B8" strokeWidth="1.5">
            <circle cx="22" cy="22" r="17" />
            <ellipse cx="22" cy="22" rx="7" ry="17" />
            <line x1="5" y1="22" x2="39" y2="22" />
          </svg>
        </div>


        {/* ================= BOTTOM CENTER REGION ================= */}
        {/* 22. Hand-Drawn Wavy Underline */}
        <div className="absolute bottom-[4%] left-[45%] opacity-40">
          <svg width="110" height="20" viewBox="0 0 120 20" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <path d="M5 10 Q 20 2, 35 10 T 65 10 T 95 10 T 115 10" />
          </svg>
        </div>


        {/* ================= SMALL FILLER SPARKLES & ACCENTS ================= */}
        {/* Top-Left Gap Sparkle */}
        <div className="absolute top-[22%] left-[22%] opacity-45">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
            <path d="M12 2 L12 22 M2 12 L22 12" />
          </svg>
        </div>
        {/* Mid-Left Gap Star */}
        <div className="absolute top-[48%] left-[20%] opacity-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
            <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/>
          </svg>
        </div>
        {/* Bottom-Left Gap Plus */}
        <div className="absolute bottom-[32%] left-[8%] opacity-35">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <path d="M12 4 V20 M4 12 H20" />
          </svg>
        </div>

        {/* Top-Right Gap Sparkle */}
        <div className="absolute top-[18%] right-[30%] opacity-55">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
            <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/>
          </svg>
        </div>
        {/* Mid-Right Gap Sparkle */}
        <div className="absolute top-[38%] right-[23%] opacity-45">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
            <path d="M12 2 L12 22 M2 12 L22 12" />
          </svg>
        </div>
        {/* Bottom-Right Gap Star */}
        <div className="absolute bottom-[24%] left-[24%] opacity-45">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
            <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z"/>
          </svg>
        </div>
        {/* Lower Right Gap Accent */}
        <div className="absolute bottom-[34%] right-[24%] opacity-40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <path d="M12 4 V20 M4 12 H20" />
          </svg>
        </div>
      </div>

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-4 w-full max-w-md pointer-events-auto">    
        <div className="text-center space-y-1 select-none">
        <div className="flex items-center justify-center gap-2 text-[#37352f]">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 3D Box Outer Shell */}
    <path d="M50 10L85 28V72L50 90L15 72V28L50 10Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
    {/* 3D Box Inner Y-Lines */}
    <path d="M15 28L50 48L85 28" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
    <path d="M50 48V90" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
    {/* Stylized 'U' embedded on the right face */}
    <path d="M62 43V60C62 65 73 65 73 60V38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
         <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-right hover:bg-left transition-[background-position] duration-700 ease-in-out cursor-pointer tracking-tight"
              style={{
                  backgroundImage: 'linear-gradient(to right, #4f46e5 0%, #0ea5e9 12.5%, #8b5cf6 25%, #f97316 37.5%, #ec4899 50%, #363634 50%, #363634 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
          }}
          > UniWorkSL </h1>
         </div>

          <p className="text-sm font-medium tracking-widest text-[#747876]">
           Sri Lanka's first student gig platform
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
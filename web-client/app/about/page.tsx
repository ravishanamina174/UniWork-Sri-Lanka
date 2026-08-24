// web-client/app/about/page.tsx
import Career from "@/components/Career";
import ShowcaseSection from "@/components/Showcase";
import FeedbackSection from "@/components/FeedbackSection"; // <-- Imported new section
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  // Fetch user data directly on the server to pass down to the feedback component
  const { userId } = await auth();
  let userRole = "guest";

  if (userId) {
    try {
      const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
        next: { revalidate: 0 }
      });
      if (backendRes.ok) {
        const userData = await backendRes.json();
        userRole = userData.role || "student";
      }
    } catch (err) {
      console.error("Error fetching role for feedback:", err);
    }
  }

  return (
    <>
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-purple-100 font-medium overflow-x-hidden relative">
      
      {/* Premium 10% Mesh Accent Background Layer */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-gradient-to-b from-purple-50/40 via-indigo-50/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-28 relative z-10">
        
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

        {/* ==================== ADDED: PREMIUM FEEDBACK SECTION ==================== */}
        <FeedbackSection 
           userClerkId={userId || "guest_user"} 
           userRole={userRole} 
        />
        
      </div>
    </div>
    </>
  );
}
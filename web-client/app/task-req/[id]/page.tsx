// web-client/app/task-req/[id]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ApplyTaskButton from "@/components/ApplyTaskButton";

// Force Next.js to never cache this dynamic page
export const dynamic = "force-dynamic";

// --- Helper Functions Styled to Exactly Match TaskMarketplace.tsx ---
const getCategoryBadge = (title: string, skills: string[]) => {
  const text = (title || "").toLowerCase() + (skills || []).join(" ").toLowerCase();
  if (text.includes("design") || text.includes("ui") || text.includes("ux") || text.includes("figma")) {
    return { label: "UI/UX Design", classes: "bg-[#EAFAEA] text-[#2E7D32]" };
  }
  if (text.includes("map") || text.includes("field") || text.includes("hardware") || text.includes("physical")) {
    return { label: "On-Campus Task", classes: "bg-[#FFF3E0] text-[#E65100]" };
  }
  return { label: "Software & Tech", classes: "bg-[#E8F0FE] text-[#1A73E8]" };
};

const getSkillBadgeColor = (index: number) => {
  const colors = [
    "bg-[#4285F4] text-white", 
    "bg-[#34A853] text-white", 
    "bg-[#FBBC05] text-slate-900", 
    "bg-[#EA4335] text-white", 
    "bg-[#673AB7] text-white", 
  ];
  return colors[index % colors.length];
};
// -------------------------------------------------------------------------------------------

// Location Card Redesigned as a sibling card with the exact same hover effects
const LargeLocationCard = ({ address }: { address?: string }) => {
  return (
    <div className="w-full lg:w-[360px] shrink-0 bg-white border border-slate-300 rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#b4b4bb] transition-all p-6 sm:p-8 flex flex-col group/card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider group-hover/card:text-[#397a2c] transition-colors">
          Task Location
        </h3>
      </div>

      <div className="flex-1 bg-slate-50/80 border border-slate-200 rounded-[6px] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group min-h-[260px] w-full">
        {/* Map Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-60"></div>

        {/* Map Pin Box */}
        <div className="bg-white px-6 py-5 rounded-[6px] border border-slate-200 shadow-sm flex flex-col items-center z-10 w-[95%] transition-transform duration-300 group-hover:-translate-y-1">
          <span className="text-red-500 text-3xl mb-3 leading-none drop-shadow-sm">📍</span>
          <span className="text-sm font-semibold text-slate-700 leading-snug">
            {address || "Exact location pinned on map"}
          </span>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------------------------------------------------------

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 1. Authenticate and strictly check if user is a STUDENT_EARNER
  let userRole = null;
  try {
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      cache: "no-store"
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      userRole = data.role;
    }
  } catch (err) {
    console.error("Failed to fetch user role:", err);
  }

  // Handle Unauthorized Access
  if (userRole !== "STUDENT_EARNER") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#F9FAFB]">
        <div className="max-w-sm w-full text-center bg-white border border-slate-300 rounded-2xl p-10 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#b0b1f7] transition-all">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
            Access Denied
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Only Student Earners are allowed to view task details and request gigs.
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-white hover:bg-[#6366F1] border-[0.7px] border-[#6366F1] text-black hover:text-white active:bg-[#4338CA] active:border-[#4338CA] text-sm font-medium py-3 px-4 rounded-xl transition-all shadow-sm tracking-wide"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 2. Fetch Task Details
  const resolvedParams = await params;
  let task = null;

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/gigs/${resolvedParams.id}`, {
      cache: "no-store"
    });

    if (res.ok) {
      task = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch specific task details:", err);
  }

  // Handle 404 Task Not Found
  if (!task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#F9FAFB]">
        <div className="max-w-sm w-full text-center bg-white border border-slate-300 rounded-2xl p-10 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#b4b4bb] transition-all">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-slate-50 flex items-center justify-center text-2xl border border-slate-200">
            🔍
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
            Task Not Found
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            This gig might have been removed, fulfilled, or the link is incorrect.
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-white hover:bg-[#6366F1] border-[0.7px] border-[#6366F1] text-black hover:text-white active:bg-[#4338CA] active:border-[#4338CA] text-sm font-medium py-3 px-4 rounded-xl transition-all shadow-sm tracking-wide"
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Derive Display Logic
  const isRemote = task.task_type === "remote";
  const category = getCategoryBadge(task.title, task.skills_required || []);

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-15 px-4 sm:px-6 flex flex-col items-center font-sans z-20 overflow-hidden">

      {/* Container width adjusts based on Remote vs On-Site */}
      <div className={`w-full transition-all duration-300 ${isRemote ? 'max-w-[760px]' : 'max-w-[1100px]'} relative mt-12 mb-20`}>

        {/* --- DOODLE ART BACKGROUND LAYER --- */}
        {/* Doodle 1: Hand-drawn Crown above Cards */}
        <div className="hidden md:block absolute -top-12 left-12 opacity-20 text-slate-900 pointer-events-none select-none z-0">
          <svg width="60" height="50" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 70 L 20 25 L 42 45 L 50 15 L 58 45 L 80 25 L 90 70 Z" />
            <path d="M8 72 C 30 76, 70 76, 92 72" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
            <circle cx="50" cy="10" r="3" fill="currentColor" />
            <circle cx="80" cy="20" r="3" fill="currentColor" />
          </svg>
        </div>

        {/* Doodle 2: Top Left Hand-drawn Connecting Arrow */}
        <div className="hidden xl:block absolute -top-8 -left-28 opacity-25 text-slate-900 pointer-events-none select-none z-0">
          <svg width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M20 20 Q 40 10, 50 30 T 40 70 Q 35 80, 65 65" />
            <polyline points="55 63 67 65 63 77" />
          </svg>
        </div>

        {/* Doodle 3: Far Left Spark Idea Bulb loop */}
        <div className="hidden lg:block absolute top-1/3 -left-32 opacity-20 text-slate-900 pointer-events-none select-none z-0">
          <svg width="75" height="75" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M50 20 C 35 20, 30 35, 35 50 C 38 58, 43 65, 43 75 L 57 75 C 57 65, 62 58, 65 50 C 70 35, 65 20, 50 20 Z" />
            <path d="M43 80 H 57 M46 85 H 54" />
            <path d="M50 5 L 50 12 M20 35 L 28 38 M80 35 L 72 38" />
          </svg>
        </div>

        {/* Doodle 4: Top Right Sparkles */}
        <div className="hidden md:block absolute -top-6 -right-12 opacity-30 text-slate-900 pointer-events-none select-none animate-pulse z-0">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M40 15 Q 40 30 55 30 Q 40 30 40 45 Q 40 30 25 30 Q 40 30 40 15 Z" fill="currentColor" fillOpacity="0.05" />
            <path d="M75 45 Q 75 52 82 52 Q 75 52 75 59 Q 75 52 68 52 Q 75 52 75 45 Z" fill="currentColor" fillOpacity="0.05" />
          </svg>
        </div>

        {/* Doodle 5: Far Right Scribble / Star loop */}
        <div className="hidden xl:block absolute top-1/4 -right-32 opacity-25 text-slate-900 pointer-events-none select-none z-0">
          <svg width="85" height="85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 15 L 58 38 L 83 38 L 63 53 L 71 78 L 50 63 L 29 78 L 37 53 L 17 38 L 42 38 Z" />
            <path d="M15 20 Q 25 15, 20 30" />
            <path d="M85 70 Q 75 80, 80 60" />
          </svg>
        </div>

        {/* Doodle 6: Bottom Left Focus / Concept Circle */}
        <div className="hidden lg:block absolute -bottom-10 -left-16 opacity-20 text-slate-900 pointer-events-none select-none z-0">
          <svg width="85" height="85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3">
            <circle cx="50" cy="50" r="35" />
            <path d="M50 5 L 50 20 M50 95 L 50 80 M5 50 L 20 50 M95 50 L 80 50" strokeDasharray="none" />
          </svg>
        </div>

        {/* Doodle 7: Bottom Right Double Under-Arrow */}
        <div className="hidden md:block absolute -bottom-14 -right-8 opacity-20 text-slate-900 pointer-events-none select-none z-0">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M20 50 C 40 80, 70 70, 75 40" />
            <polyline points="65 44 75 38 78 49" />
            <path d="M35 65 C 50 85, 75 78, 80 55" strokeWidth="1" />
          </svg>
        </div>
        {/* --- END DOODLE ART --- */}

        {/* Layout Grid (Added relative z-10 so cards stay above the doodles) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch relative z-10">

          {/* LEFT CARD: Main Task Information */}
          <div className="flex-1 bg-white border border-slate-300 rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#b4b4bb] transition-all p-8 sm:p-10 flex flex-col relative bg-clip-padding">
            
            {/* Header Row: Category & Deadline */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full ${category.classes}`}>
                {category.label}
              </span>
              <span className="text-[0.9rem] text-slate-400 font-semibold flex items-center gap-1.5">
                📅 {task.deadline}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 mb-3 leading-tight">
              {task.title}
            </h1>

            {/* Budget */}
            <div className="mb-6">
              <div className="text-3xl sm:text-4xl font-black text-[#007FFF] tracking-tight">
                LKR {task.budget?.toLocaleString() || 0}
              </div>
            </div>

            {/* Location Pill */}
            <div className="mb-8 flex items-center gap-2 text-sm font-medium bg-slate-50 border border-slate-100 py-2 px-3.5 rounded-md w-fit">
              {isRemote ? (
                <>
                  <span className="text-slate-400">🌐</span>
                  <span className="text-slate-600">Remote Task</span>
                </>
              ) : (
                <>
                  <span className="text-red-500">📍</span>
                  <span className="text-slate-600">Location specified on map</span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-10 flex-1">
              <p className="text-[0.85rem] sm:text-base font-medium text-[#777d86] leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            {/* Bottom Row: Skills & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mt-auto pt-4">
              
              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {(!task.skills_required || task.skills_required.length === 0) ? (
                  <span className="text-xs text-slate-400 italic">General Task</span>
                ) : (
                  task.skills_required.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className={`text-xs font-semibold px-3 py-1 rounded-sm ${getSkillBadgeColor(index)}`}
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>

              {/* NEW: Interactive Apply Button Component */}
              <ApplyTaskButton gigId={task.id} studentClerkId={userId} />
              
            </div>

          </div>

          {/* RIGHT CARD: Dedicated Large Location Map (Only On-Site) */}
          {!isRemote && <LargeLocationCard address={task.location?.address} />}

        </div>
      </div>
    </div>
  );
}
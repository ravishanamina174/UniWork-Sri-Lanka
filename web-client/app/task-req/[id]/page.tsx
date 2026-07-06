// web-client/app/task-req/[id]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Force Next.js to never cache this dynamic page
export const dynamic = "force-dynamic";

// --- Helper Functions Styled to Match the Screenshot ---
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
    "bg-[#8B5CF6] text-white", 
  ];
  return colors[index % colors.length];
};
// --------------------------------------------------------

// Separated and Enlarged Location Card Component
const LargeLocationCard = ({ address }: { address?: string }) => {
  return (
    <div className="w-full lg:w-[340px] shrink-0 bg-white border border-[#E2E8F0] rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col">
      <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">
        Task Location
      </h3>
      
      <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group min-h-[250px] w-full">
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
        
        {/* Map Pin Box */}
        <div className="bg-white/90 backdrop-blur-sm px-6 py-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col items-center z-10 w-[90%] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
          <span className="text-red-400 text-4xl mb-3 leading-none">📍</span>
          <span className="text-[14px] font-semibold text-slate-700 leading-snug line-clamp-4">
            {address || "Exact location pinned on map"}
          </span>
        </div>
      </div>
    </div>
  );
};
// --------------------------------------------------------

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

  // Handle Unauthorized Access (Block TASK_POSTER or CORPORATE_CLIENT)
  if (userRole !== "STUDENT_EARNER") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#FAFAFA]">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 text-center max-w-sm text-sm">
          Only Student Earners are allowed to view task details and request gigs.
        </p>
        <Link 
          href="/" 
          className="border border-[#6366F1] text-slate-900 hover:bg-[#6366F1] hover:text-white font-medium py-2 px-4 rounded-[14px] transition-colors text-sm"
        >
          Return to Dashboard
        </Link>
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#FAFAFA]">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Task Not Found</h2>
        <p className="text-slate-500 mb-6 text-center max-w-sm text-sm">
          This gig might have been removed or the link is incorrect.
        </p>
        <Link 
          href="/" 
          className="border border-[#6366F1] text-slate-900 hover:bg-[#6366F1] hover:text-white font-medium py-2 px-4 rounded-[14px] transition-colors text-sm"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Derive Display Logic
  const isRemote = task.task_type === "remote";
  const category = getCategoryBadge(task.title, task.skills_required || []);
  
  return (
    <div className="min-h-screen bg-[#FAFBFC] py-12 px-4 flex flex-col items-center">
      
      {/* Container adapts width based on whether the large right-side map is shown */}
      <div className={`w-full transition-all duration-300 ${isRemote ? 'max-w-[850px]' : 'max-w-[1150px]'}`}>
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-700 mb-6 transition-colors"
        >
          <span className="mr-2">←</span> Back to Gigs
        </Link>

        {/* Layout Grid: Left Task Card + Right Map Card */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* LEFT CARD: Main Task Information */}
          <div className="flex-1 bg-white border border-[#E2E8F0] rounded-[10px] p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-8">
            
            {/* Inner Left: Details */}
            <div className="flex-1 flex flex-col">
              
              <div className="mb-4">
                <span className={`text-[13px] font-bold px-3 py-1 rounded-full ${category.classes}`}>
                  {category.label}
                </span>
              </div>

              <h1 className="text-[22px] sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
                {task.title}
              </h1>

              {/* Location Pill inside main details */}
              <div className="mb-6 flex items-center gap-2 text-[13px] font-medium bg-[#F8FAFC] border border-[#F1F5F9] py-1.5 px-3 rounded-xl w-fit">
                {isRemote ? (
                  <>
                    <span className="text-[#38BDF8] text-base leading-none">🌐</span>
                    <span className="text-slate-600">Remote Task</span>
                  </>
                ) : (
                  <>
                    <span className="text-red-400 text-base leading-none">📍</span>
                    <span className="text-slate-600">
                      On-Site Location
                    </span>
                  </>
                )}
              </div>

              <div className="mb-6 flex-1">
                <p className="text-[15px] text-[#64748B] leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {(!task.skills_required || task.skills_required.length === 0) ? (
                  <span className="text-[13px] text-slate-400 italic">General Task</span>
                ) : (
                  task.skills_required.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className={`text-[13px] font-semibold px-3 py-1 rounded-[8px] ${getSkillBadgeColor(index)}`}
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>

            </div>

            {/* Inner Right: Budget, Deadline, & Action */}
            <div className="w-full md:w-[260px] flex flex-col border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-6 md:pt-0 md:pl-8">
              
              <div className="text-[13px] text-slate-400 font-semibold flex items-center md:justify-end gap-1.5 mb-6">
                📅 Deadline: {task.deadline}
              </div>

              <div className="mb-8 md:text-right">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                   Total Budget
                 </span>
                <div className="text-[26px] sm:text-3xl font-black text-[#007FFF] tracking-tight">
                  LKR {task.budget?.toLocaleString() || 0}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                <button className="w-full bg-transparent hover:bg-[#6366F1] border border-[#818CF8] text-slate-700 hover:text-white font-medium text-[14px] py-2 px-3 rounded-[8px] transition-all duration-200">
                  Request Task
                </button>
              </div>
              
            </div>
          </div>

          {/* RIGHT CARD: Dedicated Large Location Map (Only On-Site) */}
          {!isRemote && <LargeLocationCard address={task.location?.address} />}

        </div>
      </div>
      
    </div>
  );
}
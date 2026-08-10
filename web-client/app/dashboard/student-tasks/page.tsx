import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Force Next.js to never cache this dynamic page
export const dynamic = "force-dynamic";

// --- Helper Functions Styled to Exactly Match TaskMarketplace ---
const getCategoryBadge = (title: string, skills: string[]) => {
  const text = (title || "").toLowerCase() + (skills || []).join(" ").toLowerCase();
  if (text.includes("design") || text.includes("ui") || text.includes("ux") || text.includes("figma")) {
    return { label: "UI/UX Design", classes: "bg-[#EAFAEA] text-[#2E7D32]" };
  }
  if (text.includes("map") || text.includes("field") || text.includes("hardware") || text.includes("physical") || text.includes("cctv")) {
    return { label: "On-Site Task", classes: "bg-[#FFF3E0] text-[#E65100]" };
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

export default async function StudentTasksPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let appliedTasks = [];

  try {
    // 1. Fetch all applications for this student
    const appsRes = await fetch(`http://127.0.0.1:8000/api/v1/applications/student/${userId}`, {
      cache: "no-store"
    });

    if (appsRes.ok) {
      const applications = await appsRes.json();

      // 2. Fetch the Gig Details and Poster Profile for each application concurrently
      const enrichedTasksPromises = applications.map(async (app: any) => {
        // Fetch specific gig data
        const gigRes = await fetch(`http://127.0.0.1:8000/api/v1/gigs/${app.gig_id}`, { cache: "no-store" });
        const gigData = gigRes.ok ? await gigRes.json() : null;

        // Fetch poster profile data
        const profileRes = await fetch(`http://127.0.0.1:8000/api/v1/profiles/${app.poster_clerk_id}`, { cache: "no-store" });
        const profileData = profileRes.ok ? await profileRes.json() : null;

        return {
          id: app.id,
          gig_id: app.gig_id,
          gig_title: app.gig_title || gigData?.title || "Untitled Task",
          budget: gigData?.budget || 0,
          deadline: app.task_deadline || gigData?.deadline || "TBD",
          description: gigData?.description || "No description available.",
          skills_required: gigData?.skills_required || [],
          poster_display_name: profileData?.display_name || "Unknown Company/Poster",
          applied_at: app.applied_at,
          application_confirm: app.application_confirm || "pending"
        };
      });

      appliedTasks = await Promise.all(enrichedTasksPromises);
    }
  } catch (err) {
    console.error("Failed to fetch applied tasks data:", err);
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-10 z-20 relative">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Applied Tasks</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Track the status and details of the gigs you have requested.
          </p>
        </div>

        {/* Empty State / Error State */}
        {appliedTasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[40vh] shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4 border border-slate-100">
              📂
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">No applications yet</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm">
              You haven't applied to any tasks yet. Browse the marketplace to find gigs that match your skills.
            </p>
            <Link 
              href="/"
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          /* Responsive Task Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedTasks.map((task) => {
              const category = getCategoryBadge(task.gig_title, task.skills_required);
              const isApproved = task.application_confirm === "approve";

              return (
                <Link href={`/task-req/${task.gig_id}`} key={task.id} className="group flex">
                  <div className="w-full bg-white border border-slate-200 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#b4b4bb] transition-all p-6 flex flex-col cursor-pointer">
                    
                    {/* Header: Category & Deadline */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${category.classes}`}>
                        {category.label}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        📅 {task.deadline}
                      </span>
                    </div>

                    {/* Title & Poster Name */}
                    <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight group-hover:text-[#5d5d63] transition-colors line-clamp-2">
                      {task.gig_title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mb-4 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px]">🏢</span>
                      {task.poster_display_name}
                    </p>

                    {/* Budget */}
                    <div className="mb-4">
                      <div className="text-xl font-black text-[#007FFF] tracking-tight">
                        LKR {task.budget?.toLocaleString() || 0}
                      </div>
                    </div>

                    {/* Hardcoded Dummy Location Pill */}
                    <div className="mb-4 flex items-center gap-1.5 text-[11px] font-medium bg-slate-50 border border-slate-100 py-1.5 px-2.5 rounded w-fit text-slate-600">
                      <span className="text-red-500">📍</span>
                      Specific location pinned on map
                    </div>

                    {/* Application Approval Status Button / Pill */}
                    <div className="mb-4">
                      {isApproved ? (
                        <div className="w-full py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                          <span>✓</span> Task Approved
                        </div>
                      ) : (
                        <div className="w-full py-2 px-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                          <span>⏳</span> Task Pending
                        </div>
                      )}
                    </div>

                    {/* Description Snippet */}
                    <p className="text-xs text-slate-500 line-clamp-3 mb-6 flex-1">
                      {task.description}
                    </p>

                    {/* Skills Footer */}
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-slate-100">
                      {task.skills_required.length === 0 ? (
                        <span className="text-[10px] text-slate-400 italic">General Task</span>
                      ) : (
                        task.skills_required.slice(0, 3).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${getSkillBadgeColor(index)}`}
                          >
                            {skill}
                          </span>
                        ))
                      )}
                      {task.skills_required.length > 3 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                          +{task.skills_required.length - 3} more
                        </span>
                      )}
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
// app/dashboard/poster-tasks/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export interface TaskGig {
  _id: string; // From MongoDB
  id?: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills_required: string[];
  task_type?: "remote" | "on-site";
  poster_clerk_id: string;
  location?: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
}

// Helper functions for card styling
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

export default async function PosterTasksPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  let userTasks: TaskGig[] = [];
  let isAuthorized = false;

  try {
    // 1. Fetch Auth Profile to check user type
    const userRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 },
    });

    if (!userRes.ok) {
      redirect("/onboard");
    }

    const userData = await userRes.json();
    
    // Check if the user is a Task Poster or Corporate Client 
    // (Adjust the field name 'role' or 'account_type' based on your exact backend schema)
    const allowedRoles = ["TASK_POSTER", "CORPORATE_CLIENT"];
    if (allowedRoles.includes(userData.role) || allowedRoles.includes(userData.account_type)) {
      isAuthorized = true;
    }

    // 2. If authorized, fetch gigs and filter by poster_clerk_id
    if (isAuthorized) {
      const tasksRes = await fetch("http://127.0.0.1:8000/api/v1/gigs/all", { cache: "no-store" });
      
      if (tasksRes.ok) {
        const allTasks: TaskGig[] = await tasksRes.json();
        // Filter tasks to show only the ones created by this user
        userTasks = allTasks.filter((task) => task.poster_clerk_id === userId);
      }
    }
  } catch (err) {
    console.error("Failed to fetch user or tasks:", err);
  }

  if (!isAuthorized) {
    return (
      <div className="p-10 text-center text-slate-500">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p>You do not have permission to view this page. Only Task Posters and Corporate Clients can post tasks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10 max-w-[73rem] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Posted Tasks</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Manage and view all the tasks you have posted on the platform.
        </p>
      </div>

      {(!userTasks || userTasks.length === 0) ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400 text-sm">
            You haven't posted any tasks yet. Click "Post a Task" to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTasks.map((task) => {
            // MongoDB uses _id, while your previous mock might have used id
            const taskId = task._id || task.id; 
            const category = getCategoryBadge(task.title, task.skills_required || []);
            const isRemote = task.task_type === "remote";

            return (
              <div
                key={taskId}
                className="bg-white border border-slate-300 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#b0b1f7] transition-all flex flex-col overflow-hidden"
              >
                <div className="p-5 sm:p-6 pb-4 flex-1 flex flex-col">
                  {/* Category Pill & Deadline */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full ${category.classes}`}>
                      {category.label}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-semibold flex items-center gap-1">
                      📅 {task.deadline}
                    </span>
                  </div>

                  {/* Main Title & Budget Container */}
                  <div className="mb-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-2 leading-snug min-h-[2.75rem]">
                      {task.title}
                    </h3>
                    <div className="mt-2 text-lg sm:text-xl font-black text-[#007FFF] tracking-tight">
                      LKR {task.budget?.toLocaleString() || 0}
                    </div>
                  </div>

                  {/* Location Indicator block */}
                  <div className="mb-3 flex items-center gap-1.5 text-xs font-medium bg-slate-50 border border-slate-100 py-1.5 px-2.5 rounded-lg w-fit max-w-full">
                    {isRemote ? (
                      <>
                        <span className="text-slate-400">🌐</span>
                        <span className="text-slate-600">Remote Task</span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-500">📍</span>
                        <span className="text-slate-600 line-clamp-1 truncate" title={task.location?.address}>
                          {task.location?.address || "Location specified on map"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description Paragraph Container */}
                  <p className="text-xs text-slate-500 line-clamp-3 mb-5 leading-relaxed flex-1">
                    {task.description}
                  </p>

                  {/* Grid Aligned Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {!task.skills_required || task.skills_required.length === 0 ? (
                      <span className="text-[10px] sm:text-xs text-slate-400 italic">General Task</span>
                    ) : (
                      task.skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded ${getSkillBadgeColor(index)}`}
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Optional: Modify the button behavior for the dashboard view */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2">
                  <button className="w-full bg-white hover:bg-[#6366F1] border-[0.7px] border-[#6366F1] text-black hover:text-white active:bg-[#4338CA] active:border-[#4338CA] text-xs font-medium py-2.5 px-4 rounded-xl transition-all shadow-sm tracking-wide">
                    Manage Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
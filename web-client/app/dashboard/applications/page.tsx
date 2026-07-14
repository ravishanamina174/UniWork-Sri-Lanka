// web-client/app/dashboard/applications/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

// --- Types ---
interface Application {
  id: string;
  student_clerk_id: string;
  gig_id: string;
  gig_title: string;
  poster_clerk_id: string;
  applied: boolean;
  student_message: string;
  applied_at: string;
  task_deadline: string;
  student_display_name: string;
  student_university_campus: string;
  student_reputation_rating: number;
  student_completed_tasks: number;
}

export default async function ApplicationsDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 1. Fetch User Role & Validate
  let userRole: "STUDENT_EARNER" | "TASK_POSTER" | "CORPORATE_CLIENT" | null = null;
  try {
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      cache: "no-store"
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      userRole = data.role;
    }
  } catch (err) {
    console.error("Failed security handshake:", err);
  }

  if (!userRole || userRole === "STUDENT_EARNER") {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center px-4 font-sans">
        <div className="max-w-sm w-full text-center bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center text-xl">
            🔒
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">
            Unauthorized View
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Student Earners cannot view client application administration panels.
          </p>
          <Link
            href="/dashboard"
            className="inline-block w-full bg-[#2f2f32] hover:bg-[#000000] text-white text-xs font-semibold py-2.5 px-4 rounded-md transition-all shadow-sm tracking-wide"
          >
            Go back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 2. Fetch Incoming Applications for this Poster/Corporate
  let applications: Application[] = [];
  try {
    const appsRes = await fetch(`http://127.0.0.1:8000/api/v1/applications/poster/${userId}`, {
      cache: "no-store"
    });
    if (appsRes.ok) {
      applications = await appsRes.json();
    }
  } catch (err) {
    console.error("Failed to fetch applications:", err);
  }

  return (
    <div className="flex-1 font-sans text-[#37352f] px-2 sm:px-16 sm:py-10 max-w-[1500px] w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Incoming Applications
        </h1>
        <p className="text-sm text-[#787774] mt-1">
          Review, evaluate, and assign incoming student job applications submitted for your active gigs.
        </p>
      </div>

      {/* Content Area */}
      {applications.length === 0 ? (
        <div className="w-full min-h-[300px] border border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50/50 p-8">
          <div className="text-center max-w-sm">
            <div className="text-3xl mb-3">📬</div>
            <p className="text-sm font-semibold text-slate-600 mb-1">
              No Applications Yet
            </p>
            <p className="text-xs text-slate-400 leading-normal">
              When students apply to your posted tasks, their applications and cover messages will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch pb-10">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="bg-white border border-slate-200 rounded-[12px] p-6 flex flex-col hover:border-[#b4b4bb] hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 group"
            >
              {/* Task Title & Date Applied */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2">
                  {app.gig_title}
                </h3>
                <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded">
                  {new Date(app.applied_at).toLocaleDateString()}
                </span>
              </div>

              {/* Student Info Snapshot */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E8F0FE] to-[#e0e7ff] flex items-center justify-center text-[#1A73E8] font-bold text-sm shrink-0 border border-blue-100">
                  {app.student_display_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">
                    {app.student_display_name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    🎓 {app.student_university_campus}
                  </span>
                </div>
              </div>

              {/* Student Metrics */}
              <div className="flex gap-2 mb-5">
                <div className="flex-1 bg-amber-50/50 border border-amber-100 rounded-md py-1.5 px-2 flex flex-col items-center justify-center">
                  <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                    ⭐ {app.student_reputation_rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-amber-600/70 font-medium">Rating</span>
                </div>
                <div className="flex-1 bg-emerald-50/50 border border-emerald-100 rounded-md py-1.5 px-2 flex flex-col items-center justify-center">
                  <span className="text-xs text-emerald-700 font-bold">
                    ✓ {app.student_completed_tasks}
                  </span>
                  <span className="text-[10px] text-emerald-600/70 font-medium">Completed</span>
                </div>
              </div>

              {/* Cover Message */}
              <div className="flex-1 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Message from Applicant
                </p>
                <div className="bg-[#f9fafb] border border-slate-100 rounded-md p-3">
                  <p className="text-[13px] text-slate-600 leading-relaxed italic line-clamp-4">
                    "{app.student_message || "I am highly interested in this task and available to start immediately."}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full shrink-0 bg-white hover:bg-[#F8FAFC] border border-slate-200 hover:border-[#6366F1] text-slate-800 hover:text-[#4338CA] text-sm font-medium py-2.5 px-4 rounded-[8px] transition-all duration-200 tracking-wide">
                Confirm Candidate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
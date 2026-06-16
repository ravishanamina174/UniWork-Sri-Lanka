import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

// Interface representation mapping the structure return format
interface TaskGig {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills_required: string[];
}

export default async function Home() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let shouldRedirectToOnboard = false;
  let userRole: "STUDENT_EARNER" | "TASK_POSTER" | "CORPORATE_CLIENT" = "STUDENT_EARNER";
  let tasks: TaskGig[] = [];

  try {
    // 1. Fetch Auth Profile
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 }
    });

    if (backendRes.status === 404) {
      shouldRedirectToOnboard = true;
    } else if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.role) userRole = data.role;
    }

    // 2. Fetch Shared Task Cards (Visible to all users)
    const tasksRes = await fetch("http://127.0.0.1:8000/api/v1/gigs/all", { cache: "no-store" });
    if (tasksRes.ok) {
      tasks = await tasksRes.json();
    }
  } catch (err) {
    console.error("Gateway ecosystem communication error context sync:", err);
  }

  if (shouldRedirectToOnboard) redirect("/onboard");

  return (
    <div className="relative min-h-screen bg-[#FFFDFB] text-[#191919] overflow-x-hidden font-sans flex flex-col selection:bg-slate-200/60">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-80"></div>

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <div>
          <Navbar userRole={userRole} />          
          <HeroSection />
        </div>

        {/* SHARED MARKETPLACE TASK CARDS SECTION */}
        <section className="max-w-[68.5rem] w-full mx-auto px-6 pb-24 z-20">
          <div className="border-t border-slate-200/60 pt-12 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Available Ecosystem Task Opportunities</h2>
            <p className="text-sm text-slate-500 mt-0.5">Explore transparent requirements sourced across regional student clusters.</p>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 text-sm">No task entries active. Tasks posted will sync automatically here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{task.title}</h3>
                      <span className="text-sm font-extrabold text-[#007FFF] bg-[#007FFF]/5 px-2.5 py-1 rounded-md whitespace-nowrap">
                        LKR {task.budget.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">{task.description}</p>
                  </div>
                  
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {task.skills_required.map((skill, index) => (
                        <span key={index} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-100 pt-3">
                      <span>Deadline: {task.deadline}</span>
                      <button className="text-[#007FFF] font-semibold hover:underline">View Spec</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import TaskMarketplace, { TaskGig } from "@/components/TaskMarketplace";

export default async function TasksPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let shouldRedirectToOnboard = false;
  let userRole: "STUDENT_EARNER" | "TASK_POSTER" | "CORPORATE_CLIENT" = "STUDENT_EARNER";
  let tasks: TaskGig[] = [];

  try {
    // 1. Fetch Auth Profile matching exactly home page context logic
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 }
    });

    if (backendRes.status === 404) {
      shouldRedirectToOnboard = true;
    } else if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.role) userRole = data.role;
    }

    // 2. Fetch Tasks data array synchronizing identical layout configurations
    const tasksRes = await fetch("http://127.0.0.1:8000/api/v1/gigs/all", { cache: "no-store" });
    if (tasksRes.ok) {
      tasks = await tasksRes.json();
    }
  } catch (err) {
    console.error("Gateway ecosystem communication error context sync:", err);
  }

  if (shouldRedirectToOnboard) redirect("/onboard");

  return (
    <div className="relative min-h-screen bg-[#ffffff] text-[#191919] overflow-x-hidden font-sans flex flex-col selection:bg-slate-200/60">
      
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Navigation bar injected cleanly at the root block */}
        <div>
          <Navbar userRole={userRole} />          
        </div>
        
        {/* Extended spacing padding at top instead of Hero component to perfectly offset the navbar */}
        <div className="pt-12">
          <TaskMarketplace tasks={tasks} />
        </div>
      </div>

    </div>
  );
}
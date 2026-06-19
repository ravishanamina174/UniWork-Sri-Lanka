import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TaskMarketplace, { TaskGig } from "@/components/TaskMarketplace";

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
      {/* Background: Clean Sketchbook Dot Grid */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-80"></div> */}

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <div>
          <Navbar userRole={userRole} />          
          <HeroSection />
        </div>
        {/* Clean, Modularized Shared Marketplace Component */}
        <TaskMarketplace tasks={tasks} />
      </div>

    </div>
  );
}
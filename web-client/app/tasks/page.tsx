import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TaskMarketplace, { TaskGig } from "@/components/TaskMarketplace";

export default async function TasksPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let shouldRedirectToOnboard = false;
  let tasks: TaskGig[] = [];

  try {
    // 1. Fetch Auth Profile to verify onboarding status
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 }
    });

    if (backendRes.status === 404) {
      shouldRedirectToOnboard = true;
    }

    // 2. Fetch Tasks data array
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
        {/* Extended spacing padding at top perfectly offsets the new global navbar */}
        <div className="pt-12">
          <TaskMarketplace tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
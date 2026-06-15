// web-client/app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let shouldRedirectToOnboard = false;
  let userRole: "STUDENT_EARNER" | "TASK_POSTER" | "CORPORATE_CLIENT" = "STUDENT_EARNER";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (backendRes.status === 404) {
      console.log(`ℹ️ Clerk user [${userId}] not registered. Sending to onboard...`);
      shouldRedirectToOnboard = true;
    } else if (!backendRes.ok) {
      console.error(`❌ Unexpected backend database connection status error: ${backendRes.status}`);
    } else {
      const data = await backendRes.json();
      console.log(`✅ Verified active session profile for database user: ${data.id}`);
      // Capture the exact Postgres Enum value string returned from your FastAPI backend
      if (data.role) {
        userRole = data.role;
      }
    }
  } catch (err) {
    console.error("⚠️ Gateway request failed checking initialization status:", err);
  }

  if (shouldRedirectToOnboard) {
    redirect("/onboard");
  }

  return (
    <div className="relative min-h-screen bg-[#FFFDFB] text-[#191919] overflow-x-hidden font-sans flex flex-col selection:bg-slate-200/60">
      
      {/* Background: Clean Sketchbook Dot Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-80"></div>
      
      {/* Background Decor: Minimalist Abstract Hand-Drawn Scribbles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute top-[8%] right-[8%] w-48 h-48 text-slate-200/80" viewBox="0 0 100 100" fill="none">
          <path d="M10,20 C30,10 50,40 70,20 C90,0 80,70 100,60" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* SECTION 1: Locked to exactly 100% viewport view height */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen w-full">
        <div>
          {/* Pass the dynamic state down to control layout rendering */}
          <Navbar userRole={userRole} />          
          <HeroSection />
        </div>
      </div>
    </div>
  );
}
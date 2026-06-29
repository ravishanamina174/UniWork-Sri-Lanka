import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreateGigForm from "./CreateGigForm";

export default async function CreateGigPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let userRole: "STUDENT_EARNER" | "TASK_POSTER" | "CORPORATE_CLIENT" = "STUDENT_EARNER";

  // Fetch verified status validation from PostgreSQL
  try {
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`);
    if (backendRes.ok) {
      const data = await backendRes.json();
      userRole = data.role;
    }
  } catch (err) {
    console.error("Backend validation error on route initialization", err);
  }

  // Guard routing logic: send back to dashboard if user is a student earner
  if (userRole === "STUDENT_EARNER") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#191919] overflow-x-hidden relative">
      <Navbar userRole={userRole} />
      
      {/* Expanded the container width to max-w-6xl to support a multi-column feel */}
      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side Column: Holds the Header and Form */}
          <div className="max-w-2xl w-full">
            <div className="mb-8 text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create a New Task Card</h1>
              <p className="text-[#7f8185] font-medium mt-1">Fill out the specifications below to deploy your requirement to the platform network.</p>
            </div>
            
            {/* Relative wrapper for absolute doodle positioning */}
            <div className="relative">
              {/* Notion Doodle 1: Top Left Target/Bullseye */}
              <div className="hidden lg:block absolute -top-12 -left-36 opacity-20 text-[#191919] pointer-events-none select-none">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M50 10 C 25 12, 12 25, 10 50 C 12 75, 25 88, 50 90 C 75 88, 88 75, 90 50 C 88 25, 75 12, 50 10 Z" />
                  <path d="M50 25 C 35 27, 27 35, 25 50 C 27 65, 35 73, 50 75 C 65 73, 73 35, 75 50" />
                  <path d="M50 40 A 10 10 0 1 0 50 60 A 10 10 0 1 0 50 40 Z" fill="currentColor" fillOpacity="0.3" />
                  <path d="M15 50 L 5 50 M95 50 L 85 50 M50 15 L 50 5 M50 95 L 50 85" />
                </svg>
              </div>

              {/* Notion Doodle 2: Top Right Sparkles */}
              <div className="hidden lg:block absolute -top-4 -right-32 opacity-25 text-[#191919] pointer-events-none select-none animate-pulse">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M30 10 Q 30 25 45 25 Q 30 25 30 40 Q 30 25 15 25 Q 30 25 30 10 Z" fill="currentColor" fillOpacity="0.1" />
                  <path d="M70 40 Q 70 50 80 50 Q 70 50 70 60 Q 70 50 60 50 Q 70 50 70 40 Z" fill="currentColor" fillOpacity="0.1" />
                </svg>
              </div>

              {/* Notion Doodle 3: Bottom Left Gear/Idea Wheel */}
              <div className="hidden lg:block absolute bottom-12 -left-40 opacity-20 text-[#191919] pointer-events-none select-none">
                <svg width="110" height="110" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="50" cy="50" r="20" strokeDasharray="3 3" />
                  <path d="M50 15 C 55 15, 53 25, 58 27 C 63 29, 68 20, 72 24 C 76 28, 69 35, 73 40 C 77 45, 85 45, 85 52 C 83 59, 75 58, 73 64 C 71 70, 77 76, 72 80 C 67 84, 61 77, 55 80 C 49 83, 48 91, 41 89 C 35 87, 38 79, 32 76 C 26 73, 18 76, 16 70 C 14 64, 22 60, 22 53 C 22 46, 14 44, 16 37 C 18 30, 27 34, 32 30 C 37 26, 36 15, 43 14 C 47 13, 48 15, 50 15 Z" />
                </svg>
              </div>

              {/* Notion Doodle 4: Bottom Right Hand-drawn Star */}
              <div className="hidden lg:block absolute -bottom-8 -right-36 opacity-25 text-[#191919] pointer-events-none select-none">
                <svg width="95" height="95" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M50 5 L 63 36 L 95 38 L 70 58 L 78 90 L 50 72 L 22 90 L 30 58 L 5 38 L 37 36 Z" />
                  <path d="M42 82 Q 50 85 58 81" strokeWidth="1.2" />
                </svg>
              </div>

              <CreateGigForm clerkId={userId} />
            </div>
          </div>

          {/* Right Side Column: Left empty for visual balance (or future layout items) */}
          <div className="hidden lg:block">
            {/* You can add help text, guidelines, or layout graphics here later */}
          </div>

        </div>
      </main>
    </div>
  );
}
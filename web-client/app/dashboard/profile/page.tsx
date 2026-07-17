import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileView from "./ProfileView";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let userRole = "STUDENT_EARNER";
  let baseEmail = "";
  let profileData = null;

  try {
    const authRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 }
    });

    if (authRes.status === 404) {
      redirect("/onboard");
    } else if (authRes.ok) {
      const authData = await authRes.json();
      if (authData.role) userRole = authData.role;
      if (authData.email) baseEmail = authData.email;
    }

    const profileRes = await fetch(`http://127.0.0.1:8000/api/v1/profiles/${userId}`, {
      cache: "no-store"
    });

    if (profileRes.ok) {
      profileData = await profileRes.json();
    }

  } catch (err) {
    console.error("Error communicating with backend for profile sync:", err);
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex">
      
      {/* --- DOODLE ART: Top Left Accent --- */}
      <div className="hidden xl:block absolute top-12 left-10 opacity-70 text-slate-400 pointer-events-none select-none z-0">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Subtle Crown */}
          <path d="M15 70 L 25 35 L 50 55 L 75 35 L 85 70 Z" fill="#F59E0B" fillOpacity="0.15" />
          <path d="M10 80 C 35 85, 65 85, 90 80" />
        </svg>
      </div>

      {/* --- DOODLE ART: Main Right Side Cluster --- */}
      <div className="hidden lg:block absolute right-8 lg:right-20 xl:right-40 top-24 opacity-80 text-slate-400 pointer-events-none select-none z-0 w-80 h-[600px]">
        
        {/* Background swiggly tracking line linking the icons */}
        <svg className="absolute top-10 left-0 w-full h-full opacity-40" viewBox="0 0 300 600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 6">
            <path d="M 200 50 C 300 150, 0 250, 150 400 C 250 500, 50 550, 100 600" />
        </svg>

        {/* 1. Paper Plane (Blue) */}
        <svg className="absolute top-4 right-4" width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 50 L 90 20 L 60 90 L 50 60 L 10 50 Z" fill="#007FFF" fillOpacity="0.15" />
          <path d="M50 60 L 90 20" />
          <path d="M50 60 L 40 80 L 60 70" strokeDasharray="2 2" />
          <path d="M -10 65 Q 10 75 30 55" strokeDasharray="4 4" />
        </svg>

        {/* 2. Lightbulb / Idea (Yellow/Orange) */}
        <svg className="absolute top-48 left-0" width="85" height="85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50 15 C 25 15, 20 40, 30 55 C 35 65, 40 70, 40 80 L 60 80 C 60 70, 65 65, 70 55 C 80 40, 75 15, 50 15 Z" fill="#F59E0B" fillOpacity="0.15" />
          <path d="M40 85 L 60 85 M45 92 L 55 92" />
          <path d="M50 35 L 50 45" />
          <path d="M40 40 L 45 45" />
          <path d="M60 40 L 55 45" />
          {/* Rays */}
          <path d="M50 2 L 50 8 M15 25 L 22 30 M85 25 L 78 30 M10 50 L 18 50 M90 50 L 82 50" strokeWidth="1.5" />
        </svg>

        {/* 3. Target / Goals (Pink) */}
        <svg className="absolute bottom-32 right-8" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="40" fill="#EC4899" fillOpacity="0.05" />
          <circle cx="50" cy="50" r="25" fill="#EC4899" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="10" fill="#EC4899" fillOpacity="0.2" />
          {/* Dart */}
          <path d="M75 25 L 55 45" />
          <path d="M85 15 L 75 25" strokeWidth="3" />
          <path d="M90 10 L 80 20 M85 5 L 75 15" />
        </svg>

        {/* 4. Large Sparkle (Indigo) */}
        <svg className="absolute top-[22rem] right-0" width="55" height="55" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 10 Q 50 50 90 50 Q 50 50 50 90 Q 50 50 10 50 Q 50 50 50 10 Z" fill="#6366F1" fillOpacity="0.15" />
        </svg>

        {/* 5. Small Bubbles/Dots (Green) */}
        <svg className="absolute top-28 left-20" width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="20" cy="20" r="12" fill="#2E7D32" fillOpacity="0.15" />
            <circle cx="70" cy="70" r="6" fill="#2E7D32" fillOpacity="0.2" />
            <circle cx="85" cy="30" r="3" fill="currentColor" />
        </svg>

      </div>
      {/* --- END DOODLE ART --- */}

      {/* Main Profile Component */}
      <div className="relative z-10 w-full">
        <ProfileView 
          userId={userId} 
          userRole={userRole} 
          baseEmail={baseEmail} 
          initialProfile={profileData} 
        />
      </div>

    </div>
  );
}
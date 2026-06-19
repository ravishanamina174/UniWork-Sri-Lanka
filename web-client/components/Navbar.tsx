// components/Navbar.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  userRole?: "STUDENT_EARNER" | "TASK_POSTER" | "CORPORATE_CLIENT";
}

export default function Navbar({ userRole = "STUDENT_EARNER" }: NavbarProps) {
  const pathname = usePathname();

  // Navigation configurations grouped directly by PostgreSQL PlatformRoleEnum options
  const navigationTabs = {
    STUDENT_EARNER: [
      { name: "Find Tasks", href: "/" },
      { name: "Physical", href: "/" },
      { name: "Digital", href: "/" },
      { name: "About", href: "/" },
    ],
    TASK_POSTER: [
      { name: "Tasks", href: "/" },
      { name: "Review Submissions", href: "/" },
      { name: "Escrow Balance", href: "/" },
      { name: "About", href: "/" },
    ],
    CORPORATE_CLIENT: [
      { name: "Enterprise Contracts", href: "/" },
      { name: "Talent Pool", href: "/" },
      { name: "Invoices & Ledgers", href: "/" },
      { name: "About", href: "/" },
    ],
  };

  // Profile Action Text Mapping matching exact role contexts
  const portalButtonConfig = {
    STUDENT_EARNER: { text: "Student Portal", href: "/profile/student" },
    TASK_POSTER: { text: "Poster Profile", href: "/profile/poster" },
    CORPORATE_CLIENT: { text: "Profile", href: "/profile/corporate" },
  };

  // Fallback cleanly to student layout if user role array context is undefined
  const activeTabs = navigationTabs[userRole] || navigationTabs.STUDENT_EARNER;
  const currentPortal = portalButtonConfig[userRole] || portalButtonConfig.STUDENT_EARNER;

  // Render the unique primary CTA button only if the party is a client buyer
  const showPostGigButton = userRole === "CORPORATE_CLIENT" || userRole === "TASK_POSTER";

  // Conditional Styling Selection Engine for the profile buttons
  const isStudent = userRole === "STUDENT_EARNER";
  const portalStyles = isStudent
    ? "bg-[#2B83FA] text-white font-bold hover:bg-[#2374E1] active:bg-[#1B62C6] border-transparent shadow-sm"
    : "bg-white text-slate-700 border border-slate-200/80 font-semibold  hover:border-[#007FFF] hover:text-slate-900 active:bg-slate-200/70";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md  px-8 py-4.5">
      <div className="max-w-[100rem] mx-auto flex items-center justify-between">

        {/* Left Side: Brand Logo & Notion-inspired dynamic text routes */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5 group">
            <div className="w-6 h-6 bg-slate-950 text-white font-black text-xs flex items-center justify-center rounded-md transform group-hover:scale-105 transition-transform">
              U
            </div>
            <span className="font-extrabold text-slate-900">
              UniWork<span className="text-slate-400 font-normal mx-0.5">/</span><span className="text-amber-500">SL</span>
            </span>
          </Link>
          
          {/* Notion Workspace Dynamic Text Tabs */}
          <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600">
            {activeTabs.map((tab) => {
              // Exact active route comparison matching
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    isActive 
                      ? "bg-slate-100 text-slate-900" 
                      : "hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side Actions Container Layout */}
        <div className="flex items-center gap-4">
          {showPostGigButton && (
             <Link 
                 href="/create-gig" 
                 className="hidden sm:inline-flex items-center justify-center text-sm font-semibold px-5 py-1.5 bg-[#007FFF] text-white rounded-md hover:bg-[#0066CC] active:bg-[#0059B3] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                    Post a Task
              </Link>
          )}   
          
          <Link
            href={currentPortal.href}
            className={`inline-flex items-center justify-center px-3.5 py-1.5 text-sm rounded-lg tracking-wide antialiased transition-all duration-200 ${portalStyles}`}
          > 
            {currentPortal.text}
          </Link>
          
          <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 p-0.5 shadow-sm bg-white">
            <UserButton/>
          </div>
        </div>
      </div>
    </nav>
  );
}
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
      { name: "Find Tasks", href: "/tasks" },
      { name: "Physical", href: "/" },
      { name: "Digital", href: "/" },
      { name: "About", href: "/about" },
    ],
    TASK_POSTER: [
      { name: "Tasks", href: "/tasks" },
      { name: "Review Submissions", href: "/" },
      { name: "Escrow Balance", href: "/" },
      { name: "About", href: "/about" },
    ],
    CORPORATE_CLIENT: [
      { name: "Enterprise Contracts", href: "/" },
      { name: "Talent Pool", href: "/" },
      { name: "Invoices & Ledgers", href: "/" },
      { name: "About", href: "/about" },
    ],
  };

  // Profile Action Text Mapping matching exact role contexts
  const portalButtonConfig = {
    STUDENT_EARNER: { text: "Student Portal", href: "/dashboard" },
    TASK_POSTER: { text: "Poster Profile", href: "/dashboard" },
    CORPORATE_CLIENT: { text: "Profile", href: "/dashboard" },
  };

  // Fallback cleanly to student layout if user role array context is undefined
  const activeTabs = navigationTabs[userRole] || navigationTabs.STUDENT_EARNER;
  const currentPortal = portalButtonConfig[userRole] || portalButtonConfig.STUDENT_EARNER;

  // Render the unique primary CTA button only if the party is a client buyer
  const showPostGigButton = userRole === "CORPORATE_CLIENT" || userRole === "TASK_POSTER";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#ededed] font-sans text-[#37352f]">
      <div className="max-w-[100rem] mx-auto flex items-center justify-between px-6 py-3.5">
        
        {/* Left Side: Brand Logo & Links */}
        <div className="flex items-center gap-6">
          
          <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-80">
            {/* Notion-style 3D Cube SVG Logo for UniWorkSL */}
            <div className="flex items-center justify-center text-[#37352f]">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3D Box Outer Shell */}
                <path d="M50 10L85 28V72L50 90L15 72V28L50 10Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
                {/* 3D Box Inner Y-Lines */}
                <path d="M15 28L50 48L85 28" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
                <path d="M50 48V90" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/>
                {/* Stylized 'U' embedded on the right face */}
                <path d="M62 43V60C62 65 73 65 73 60V38" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-[17px] tracking-tight">
              UniWorkSL
            </span>
          </Link>
          
          {/* Notion Workspace Dynamic Text Tabs */}
          <div className="hidden md:flex items-center gap-1">
            {activeTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-3 py-1.5 rounded-md text-[14px] font-medium transition-colors ${
                    isActive 
                      ? "bg-[#efefef] text-[#37352f]" 
                      : "text-[#505050] hover:bg-[#efefef] hover:text-[#37352f]"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side Actions Container Layout */}
        <div className="flex items-center gap-2">
          
          {showPostGigButton && (
             <Link 
                 href="/create-gig" 
                 className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 rounded-md text-[14px] font-medium text-[#505050] hover:text-[#37352f] hover:bg-[#efefef] transition-colors"
              >
                Post a Task
              </Link>
          )}   
          
          {/* Primary Action Button - Notion's vivid blue */}
          <Link
            href={currentPortal.href}
            className="inline-flex items-center justify-center px-3.5 py-1.5 ml-1 text-[14px] font-medium rounded-md bg-[#007FFF] text-white hover:bg-[#0066CC] transition-colors"
          > 
            {currentPortal.text}
          </Link>
          
          {/* Clerk Profile Divider & Mount */}
          <div className="flex items-center justify-center ml-2 pl-3 border-l border-[#ededed]">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7"
                }
              }}
            />
          </div>
        </div>
        
      </div>
    </nav>
  );
}
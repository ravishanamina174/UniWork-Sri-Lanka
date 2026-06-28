import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from '@/config/navigation';
import { PenTool, Sparkles, BookOpen , Search, MessageSquare, CheckCircle, ArrowRight, Zap} from 'lucide-react';

export default async function DashboardHome() {
  // 1. Authenticate user via Clerk
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let userRole: UserRole = 'STUDENT_EARNER'; 
  let shouldRedirectToOnboard = false;

  try {
    // 2. Fetch the real user role from your backend
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 }
    });

    if (backendRes.status === 404) {
      shouldRedirectToOnboard = true;
    } else if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.role) {
        userRole = data.role as UserRole;
      }
    }
  } catch (err) {
    console.error("Dashboard role fetch error:", err);
  }

  // 3. Redirect if the user hasn't completed onboarding
  if (shouldRedirectToOnboard) redirect("/onboard");

  return (
<div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 font-sans text-[#37352f] w-full animate-in fade-in duration-500">
      
      {/* Notion Style Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-[2.75rem] font-bold tracking-tight flex items-center gap-3">
          <span className="text-4xl">👋🏻</span> Welcome to your Workspace
        </h1>
        <p className="text-[#787774] text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
          Your central hub to post tasks, discover opportunities, and track your progress across the platform.
        </p>
      </div>

      {/* Dummy Advertisement Area - Notion Feature Callout Style */}
      <div className="w-full rounded-2xl bg-gradient-to-br from-[#f8f9ff] to-[#f4f0ff] border border-[#e4e4e9] p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden group">
        
        {/* Subtle background doodle shapes (inspired by Notion's decorative elements) */}
        <div className="absolute -right-10 -top-10 text-[#e0e2fb] opacity-50 group-hover:rotate-12 transition-transform duration-700">
          <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 L90 50 L50 90 L10 50 Z" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebe9fe] text-[#5b21b6] text-xs font-bold uppercase tracking-widest">
            <Zap size={14} fill="currentColor" /> New Feature
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">UniWorkSL Pro is now live.</h2>
          <p className="text-[#505050] text-base leading-relaxed">
            Unlock advanced escrow analytics, priority task matching, and zero-fee withdrawals. Elevate your workflow and scale your productivity today.
          </p>
        </div>
        
        <button className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#ededed] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-xl text-[#37352f] text-sm font-semibold hover:bg-[#fbfbfa] hover:shadow-md transition-all active:scale-95">
          Upgrade Workspace <ArrowRight size={16} />
        </button>
      </div>

      {/* Platform Flow & Info Section - Notion Floating Icons Style */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight border-b border-[#ededed] pb-4">
          How it works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Step 1 Card */}
          <div className="border border-[#ededed] rounded-2xl p-6 md:p-8 hover:bg-[#fbfbfa] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all cursor-default bg-white group flex flex-col w-full">
            {/* Colorful Icon Badge matching the reference image */}
            <div className="w-12 h-12 rounded-full bg-[#ffe2dd] text-[#d44c47] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm relative">
              <Search size={22} strokeWidth={2.5} />
              {/* Sparkle accent */}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles size={12} className="text-[#d44c47]" />
              </div>
            </div>
            <h4 className="text-lg font-bold text-[#37352f] mb-2 tracking-tight">1. Discover & Match</h4>
            <p className="text-[#787774] text-sm leading-relaxed">
              Whether you're posting a gig or looking for work, our smart engine connects the right talent instantly.
            </p>
          </div>

          {/* Step 2 Card */}
          <div className="border border-[#ededed] rounded-2xl p-6 md:p-8 hover:bg-[#fbfbfa] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all cursor-default bg-white group flex flex-col w-full">
            <div className="w-12 h-12 rounded-full bg-[#e8f3eb] text-[#448361] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm relative">
              <MessageSquare size={22} strokeWidth={2.5} />
            </div>
            <h4 className="text-lg font-bold text-[#37352f] mb-2 tracking-tight">2. Collaborate</h4>
            <p className="text-[#787774] text-sm leading-relaxed">
              Use secure escrow balances and built-in messaging to manage requirements and deliverables safely.
            </p>
          </div>

          {/* Step 3 Card */}
          <div className="border border-[#ededed] rounded-2xl p-6 md:p-8 hover:bg-[#fbfbfa] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all cursor-default bg-white group flex flex-col w-full">
            <div className="w-12 h-12 rounded-full bg-[#f3eaf8] text-[#9a6dd7] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm relative">
              <CheckCircle size={22} strokeWidth={2.5} />
            </div>
            <h4 className="text-lg font-bold text-[#37352f] mb-2 tracking-tight">3. Complete & Earn</h4>
            <p className="text-[#787774] text-sm leading-relaxed">
              Approve submissions to release funds instantly. Build your professional reputation with every successful task.
            </p>
          </div>

        </div>
      </div>
      
    </div>
  );
}
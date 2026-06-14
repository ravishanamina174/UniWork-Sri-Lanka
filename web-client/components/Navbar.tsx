"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Dummy Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-black text-slate-900 tracking-tight">
            UniWork<span className="text-orange-500">SL</span>
          </Link>
          
          {/* Dummy Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#" className="text-orange-500 transition-colors">Dashboard</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Browse Gigs</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">My Applications</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Earnings</Link>
          </div>
        </div>

        {/* Right Side: Quick Action & Your Untouched UserButton */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:inline-flex items-center justify-center text-xs font-semibold px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm">
            Post a Gig
          </button>
          
          <UserButton />
        </div>

      </div>
    </nav>
  );
}
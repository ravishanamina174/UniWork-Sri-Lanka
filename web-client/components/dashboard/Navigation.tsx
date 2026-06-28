'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavLinks, UserRole } from '@/config/navigation';

export default function Navigation({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const links = getNavLinks(userRole);

  return (
    <>

{/* Desktop Vertical Sidebar - Floating */}
<aside
  className=" hidden md:flex flex-col w-[220px] sticky top-20 h-[calc(100vh-6rem)] ml-4 bg-white rounded-lg border border-[#ededed] shrink-0 font-sans text-[#37352f] overflow-hidden"
>
  {/* Top Logo Container */}
  <div className="pt-6 pb-4 flex items-center px-4 mb-2 shrink-0">
    <Link
      href="/"
      className="flex items-center gap-3 w-full hover:bg-[#efefef] p-1.5 rounded-md transition-colors cursor-pointer focus:outline-none"
      aria-label="Go to homepage"
    >
      <div className="w-8 h-8 bg-white rounded shadow-sm border border-[#e0e0e0] flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="w-5 h-5 text-[#37352f]"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 25 C 45 22, 65 24, 82 23 C 85 45, 83 65, 80 81 C 60 85, 40 82, 25 84 C 21 65, 23 45, 22 25 Z" />
          <path
            d="M44 42 C 43 57, 45 66, 54 66 C 63 66, 64 57, 64 42"
            strokeWidth="6.5"
          />
          <circle cx="73" cy="35" r="3.5" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <span className="font-semibold text-[14px] truncate">
        Dashboard
      </span>
    </Link>
  </div>

  {/* Navigation */}
  <nav className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3">
    <div className="flex flex-col gap-0.5">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 w-full py-1.5 px-2.5 rounded-md transition-colors ${
              isActive
                ? "bg-[#efefef] text-[#37352f] font-medium"
                : "text-[#787774] hover:bg-[#efefef] hover:text-[#37352f] font-medium"
            }`}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.5 : 2}
              className="shrink-0"
            />
            <span className="text-[14px] truncate">
              {link.name}
            </span>
          </Link>
        );
      })}
    </div>
  </nav>
</aside>

      {/* Mobile Bottom Navigation Bar - Minimalist */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#fbfbfa] border-t border-[#ededed] z-50 px-2 py-2 flex justify-around items-center pb-safe font-sans">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-[#37352f]' 
                  : 'text-[#787774] hover:text-[#37352f] hover:bg-[#efefef]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
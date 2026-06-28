'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavLinks, UserRole } from '@/config/navigation';

export default function Navigation({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const links = getNavLinks(userRole);

  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex flex-col w-24 lg:w-64 border-r border-gray-200 bg-white h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2 border-b border-gray-200">
          <div className="w-8 h-8 bg-gray-300 rounded" />
          <span className="font-bold text-gray-900 hidden lg:block">Uniwork</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gray-200 text-gray-900 font-medium' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span className="hidden lg:block">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 px-2 py-3 flex justify-around items-center pb-safe">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                isActive ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-gray-100' : ''}`}>
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function TopHeader() {
  return (
    <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {/* Placeholder Logo */}
        <div className="w-8 h-8 bg-gray-300 rounded" />
        <span className="font-bold text-gray-900 text-lg">Uniwork</span>
      </div>
      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
        <Menu size={24} />
      </button>
    </header>
  );
}
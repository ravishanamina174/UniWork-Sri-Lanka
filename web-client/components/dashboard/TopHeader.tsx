import { Menu, Command } from 'lucide-react';

export default function TopHeader() {
  return (
    <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-5 py-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white">
          <Command size={18} />
        </div>
        <span className="font-bold text-gray-900 tracking-tight text-lg">Uniwork</span>
      </div>
      <button className="p-2 text-gray-600 hover:bg-gray-100 hover:text-black rounded-lg transition-colors">
        <Menu size={24} strokeWidth={1.5} />
      </button>
    </header>
  );
}
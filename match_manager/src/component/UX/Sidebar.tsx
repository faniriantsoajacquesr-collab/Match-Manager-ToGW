import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 bg-[#0e0e0f] border-r border-white/5 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-container flex items-center justify-center skew-heading">
            <span className="material-symbols-outlined text-on-primary-fixed font-bold">sports_esports</span>
          </div>
          <div>
            <p className="font-headline font-bold text-[#00E5FF] leading-none uppercase">TBC ENGINE</p>
            <p className="text-[10px] font-label text-white/40 tracking-widest uppercase mt-1">Toliara Games Week</p>
          </div>
        </div>
        <nav className="space-y-2">
          <NavLink 
            onClick={onClose} 
            to="/" 
            end
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 transition-all ${
                isActive ? 'bg-[#131314] text-[#00E5FF] border-l-4 border-[#ff7346] font-bold' : 'text-white/60 hover:bg-[#131314] hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sports_esports</span>
            <span className="font-label text-sm font-bold uppercase tracking-wider">Match</span>
          </NavLink>
          <NavLink 
            onClick={onClose} 
            to="/ranking"
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 transition-all ${
                isActive ? 'bg-[#131314] text-[#00E5FF] border-l-4 border-[#ff7346] font-bold' : 'text-white/60 hover:bg-[#131314] hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined">leaderboard</span>
            <span className="font-label text-sm uppercase tracking-wider">Leaderboard</span>
          </NavLink>
          <NavLink 
            onClick={onClose}
            to="/info"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                isActive ? 'bg-[#131314] text-[#00E5FF] border-l-4 border-[#ff7346] font-bold' : 'text-white/60 hover:bg-[#131314] hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined">info</span>
            <span className="font-label text-sm uppercase tracking-wider">Event Info</span>
          </NavLink>
        </nav>
      </div>
    </aside>
    </>
  );
};
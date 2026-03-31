import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSettings, isAdmin }) => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#0e0e0f] border-b border-white/10">
      <div className="flex items-center gap-8">
        <button onClick={onToggleSidebar} className="flex md:hidden text-white hover:text-primary transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link to="/" className=" text-xl  lg:text-2xl  font-black italic tracking-tighter text-[#00E5FF] font-headline skew-heading no-underline">
          TOLIARA GAMES WEEK
        </Link>
        <nav className="hidden md:flex gap-6 items-center h-full">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `font-label text-sm uppercase tracking-wider transition-colors ${
                isActive ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-1 font-bold' : 'text-white/70 hover:text-white'
              }`
            }
          >MATCH</NavLink>
          <NavLink 
            to="/ranking" 
            className={({ isActive }) => 
              `font-label text-sm uppercase tracking-wider transition-colors ${
                isActive ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-1 font-bold' : 'text-white/70 hover:text-white'
              }`
            }
          >RANKING</NavLink>
          <NavLink 
            to="/bracket" 
            className={({ isActive }) => 
              `font-label text-sm uppercase tracking-wider transition-colors ${
                isActive ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-1 font-bold' : 'text-white/70 hover:text-white'
              }`
            }
          >EVENT INFO</NavLink>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <button onClick={onOpenSettings} className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors text-xs font-label uppercase">
            <span className="material-symbols-outlined text-sm">settings</span>
          </button>
        )}
        <div className="flex items-center gap-2 px-4 py-1 bg-secondary text-on-secondary font-headline font-bold skew-heading">
          <span 
            className="material-symbols-outlined text-sm" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            sensors
          </span>
          <span className="text-sm uppercase tracking-tighter">LIVE STATUS</span>
        </div>
      </div>
    </header>
  );
};
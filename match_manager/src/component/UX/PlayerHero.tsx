import React from 'react';

interface PlayerHeroProps {
  name: string;
  handle: string;
  elo: string;
  imageUrl: string;
  role: 'CHALLENGER' | 'DEFENDER';
  side: 'left' | 'right';
}

export const PlayerHero: React.FC<PlayerHeroProps> = ({ name, handle, elo, imageUrl, role, side }) => {
  const isLeft = side === 'left';
  const borderColor = isLeft ? 'border-primary' : 'border-secondary';
  const roleColor = isLeft ? 'text-primary' : 'text-secondary';
  const alignment = isLeft ? 'text-left border-l-4' : 'text-right border-r-4';
  const gradientDir = isLeft ? 'bg-gradient-to-r' : 'bg-gradient-to-l';

  return (
    <div className={`group relative overflow-hidden bg-surface-container h-[400px] ${alignment} ${borderColor}`}>
      <img 
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
        src={imageUrl} 
        alt={name} 
      />
      <div className={`absolute inset-0 ${gradientDir} from-surface-container-lowest via-transparent to-transparent`}></div>
      <div className={`absolute bottom-0 ${isLeft ? 'left-0' : 'right-0'} p-8 w-full`}>
        <div className="flex flex-col gap-1 mb-4">
          <span className={`font-label text-xs ${roleColor} font-bold tracking-widest uppercase`}>{role}</span>
          <h2 className="font-headline text-5]xl font-black  text-white uppercase leading-none">{name}</h2>
        </div>
        <div className={`flex items-end justify-between ${!isLeft ? 'flex-row-reverse' : ''}`}>
          <div>
            <p className="font-label text-sm text-white/60 uppercase tracking-widest">Player Handle</p>
            <p className={`font-headline text-2xl font-bold ${roleColor}`}>{handle}</p>
          </div>
          <div className={isLeft ? 'text-right' : 'text-left'}>
            <p className="font-label text-xs text-white/40 uppercase">ELO Rating</p>
            <p className="font-headline text-3xl font-black text-white">{elo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
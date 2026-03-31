import React from 'react';

interface QueueCardProps {
  handle: string;
  character: string;
  elo: string;
  isOnDeck?: boolean;
  matchRound: number;
}

export const QueueCard: React.FC<QueueCardProps> = ({ handle, character, elo, isOnDeck, matchRound }) => {
  const containerClass = isOnDeck 
    ? "bg-surface-container-high border-secondary" 
    : "bg-surface-container-low border-white/10 opacity-70 hover:opacity-100";

  const bracketType = matchRound > 0 
    ? "WINNER'S BRACKET" 
    : "LOSER'S BRACKET";

  return (
    <div className={`relative overflow-hidden group border-l-4 p-5 transition-all hover:bg-surface-bright ${containerClass}`}>
      {isOnDeck && (
        <div className="absolute top-0 right-0 bg-secondary px-3 py-1 skew-6">
          <span className="font-headline text-[10px] font-black text-on-secondary italic uppercase tracking-tighter">ON DECK</span>
        </div>
      )}
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 bg-surface-container-lowest border border-white/10 flex items-center justify-center skew-3">
          <span className={`material-symbols-outlined text-3xl ${isOnDeck ? 'text-secondary' : 'text-white/40'}`}>person</span>
        </div>
        <div>
          <p className="font-headline text-lg font-bold text-white uppercase leading-none">{handle}</p>
          <p className={`font-label text-xs font-bold tracking-widest uppercase mt-1 ${isOnDeck ? 'text-secondary' : 'text-white/40'}`}>
            {character} • {bracketType}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-label text-[10px] text-white/40 uppercase">ELO</span>
            <span className="font-headline text-sm font-bold text-white">{elo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
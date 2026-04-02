import React from 'react';

// Types for the live match data
export interface Player {
  name: string;
  elo: number;
  avatar: string;
  character: string;
  internalId: number | null; // ID Challonge pour l'API
  wins: number;
  losses: number;
  streak: number;
}

export interface LiveMatch {
  id: number;
  p1: Player;
  p2: Player;
  p1Gain: number;
  p2Gain: number;
  matchRound?: number; // Ajouté pour un affichage potentiel
}

interface MatchHeroProps {
  match: LiveMatch;
  onWinner: (side: 'p1' | 'p2') => void;
  winningSide: 'p1' | 'p2' | null;
  isAdmin: boolean;
}

/**
 * MatchHero component displays the main duel between two players
 */
export const MatchHero: React.FC<MatchHeroProps> = ({ match, onWinner, winningSide, isAdmin }) => {
  return (
    <section className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 py-8">
      {/* Left side: Challenger */}
      <PlayerHeroCard 
        side="left" 
        role="CHALLENGER" 
        player={match.p1} 
        potentialGain={match.p1Gain} 
        playerSide="p1"
        winningSide={winningSide}
        isAdmin={isAdmin}
        onWin={() => onWinner('p1')}
      />

      {/* Central VS Divider */}
      <div className="flex flex-col items-center justify-center z-10 px-4">
        <div className="w-[2px] h-24 bg-gradient-to-t from-primary to-transparent mb-4" />
        <div className="relative">
          <span className="font-headline text-8xl font-black italic skew-6 text-transparent bg-clip-text bg-gradient-to-b from-primary via-secondary to-tertiary">
            VS
          </span>
          <div className="absolute inset-0 blur-2xl bg-secondary/20 -z-10" />
        </div>
        <div className="w-[2px] h-24 bg-gradient-to-b from-secondary to-transparent mt-4" />
      </div>

      {/* Right side: Defender */}
      <PlayerHeroCard 
        side="right" 
        role="DEFENDER" 
        player={match.p2} 
        potentialGain={match.p2Gain} 
        playerSide="p2"
        winningSide={winningSide}
        isAdmin={isAdmin}
        onWin={() => onWinner('p2')}
      />
    </section>
  );
};

const PlayerHeroCard = ({ side, role, player, potentialGain, onWin, playerSide, winningSide, isAdmin }: { 
  side: 'left' | 'right', 
  role: string, 
  player: Player, 
  potentialGain: number;
  onWin: () => void;
  playerSide: 'p1' | 'p2';
  winningSide: 'p1' | 'p2' | null;
  isAdmin: boolean;
}) => {
  const isLeft = side === 'left';
  const isWinner = winningSide === playerSide;
  
  return (
    <div className={`group relative overflow-hidden bg-surface-container h-[400px] ${isLeft ? 'text-left border-l-4 border-primary' : 'text-right border-r-4 border-secondary'} ${isWinner ? 'animate-winner-glow' : ''}`}>
      <img 
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
        src={`/assets/characters/${player.avatar}`} 
        alt={player.name} 
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/characters/default.webp';
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-${isLeft ? 'r' : 'l'} from-surface-container-lowest via-transparent to-transparent`} />
      
      <div className={`absolute bottom-0 ${isLeft ? 'left-0' : 'right-0'} p-8 w-full`}>
        <div className="flex flex-col gap-1 mb-4">
          <span className={`font-label text-xs ${isLeft ? 'text-primary' : 'text-secondary'} font-bold tracking-widest uppercase`}>
            {role} • +{potentialGain} PTS IF WIN
          </span>
          <span className="font-headline text-2xl text-primary/80 uppercase block mb-1">
            {player.character}
          </span>
          <h2 className="font-headline text-4xl font-black text-white uppercase leading-tight">
            {player.name}
          </h2>
        </div>
        
        {isAdmin && (
            <button 
                onClick={onWin}
                className={`mt-4 px-6 py-2 border-2 ${isLeft ? 'border-primary text-primary hover:bg-primary' : 'border-secondary text-secondary hover:bg-secondary'} hover:text-white font-headline font-bold transition-all uppercase italic text-sm`}
            >
                SET AS WINNER?
            </button>
        )}
        
        <div className={isLeft ? '' : 'text-right'}>
          <p className="font-label text-sm text-white/60 uppercase tracking-widest">ELO Rating</p>
          <p className="font-headline text-3xl font-black text-white">{player.elo}</p>
        </div>
      </div>
    </div>
  );
};
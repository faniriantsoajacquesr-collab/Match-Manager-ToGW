import { supabase } from '../../../../backend/supabase';
import { fetchTournamentData } from '../../../../backend/challonge';
import { getLiveQueue } from '../../../../backend/useTournamentQueue';
import { useState,useEffect } from 'react';

const LargeEloScoreboard = () => {
  const [match, setMatch] = useState<any>(null);

  const refreshData = async () => {
    try {
      // 1. Récupérer les settings (slug et API key)
      const { data: settingsData } = await supabase.from('settings').select('*').single();
      if (!settingsData) return;

      // 2. Fetch les données tournoi et identifier le match en cours
      const { matches, participants } = await fetchTournamentData(settingsData.slug, settingsData.api);
      const hydratedQueue = await getLiveQueue(matches, participants, supabase);
      
      if (hydratedQueue.live) {
        setMatch(hydratedQueue.live);
      } else {
        setMatch(null);
      }
    } catch (err) {
      console.error("Scoreboard refresh error:", err);
    }
  };

  useEffect(() => {
    refreshData();
    // Synchronisation automatique toutes les 10 secondes
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!match) return null; // L'overlay disparaît s'il n'y a pas de match en cours

  const matchPhaseLabel = match.isGrandFinal ? "GRAND FINAL" :
    match.isWinnersFinal ? "WINNER'S FINAL" :
    match.isLosersFinal ? "LOSER'S FINAL" :
    match.matchRound > 0 
      ? `WINNER'S ROUND ${match.matchRound}` 
      : match.matchRound < 0 
        ? `LOSER'S ROUND ${Math.abs(match.matchRound)}` 
        : "RANKED MATCH";

  return (
    // Conteneur plein écran, fond transparent, fixé en haut
    <div className="w-full fixed top-0 left-0 bg-transparent p-0 z-50">
      <div className="flex items-center justify-center w-full">
        
        {/* Hauteur augmentée à h-14 (56px) */}
        <div className="flex items-stretch h-14 font-sans font-black text-white uppercase tracking-tighter w-full max-w-[1400px]">
          
          {/* Joueur 1 : Pseudo - Dégradé bleu */}
          <div className="relative flex-grow flex items-center justify-end pr-10 bg-gradient-to-r from-cyan-600 to-cyan-500 skew-x-[-20deg] origin-bottom border-r-4 border-white/30 shadow-xl">
            <div className="skew-x-[20deg] text-xl italic tracking-tight">
              {match.p1.name}
            </div>
          </div>

          {/* Joueur 1 : ELO - Fond sombre pro */}
          <div className="flex flex-col items-center justify-center px-6 bg-slate-900 border-r border-white/10">
            <span className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] mb-[-4px]">ELO</span>
            <span className="text-xl font-mono text-white">{match.p1.elo}</span>
          </div>

          {/* Séparateur Central - Impact visuel fort */}
          <div className="relative flex items-center justify-center px-12 bg-white text-black text-xs font-black tracking-[0.3em] min-w-[180px] z-10 shadow-2xl">
            <div className="absolute inset-0 bg-slate-100 opacity-50"></div>
            <span className="relative">{matchPhaseLabel}</span>
          </div>

          {/* Joueur 2 : ELO */}
          <div className="flex flex-col items-center justify-center px-6 bg-slate-900 border-l border-white/10">
            <span className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] mb-[-4px]">ELO</span>
            <span className="text-xl font-mono text-white">{match.p2.elo}</span>
          </div>

          {/* Joueur 2 : Pseudo - Dégradé bleu */}
          <div className="relative flex-grow flex items-center justify-start pl-10 bg-gradient-to-l from-cyan-600 to-cyan-500 skew-x-[20deg] origin-bottom border-l-4 border-white/30 shadow-xl">
            <div className="skew-x-[-20deg] text-xl italic tracking-tight">
              {match.p2.name}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LargeEloScoreboard;
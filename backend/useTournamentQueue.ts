// hooks/useTournamentQueue.ts
export const getTournamentQueue = (matches: Match[], participants: any[]) => {
  // 1. Trouver le match en cours (si tu as cliqué sur "Start" dans Challonge)
  const currentMatch = matches.find(m => m.underway_at !== null && m.state === 'open') 
                       || matches.find(m => m.state === 'open');

  // 2. Filtrer les matchs prêts à être joués (exclure celui en cours)
  const queue = matches
    .filter(m => m.state === 'open' && m.id !== currentMatch?.id)
    .sort((a, b) => a.suggested_play_order - b.suggested_play_order);

  // Fonction helper pour trouver le pseudo par ID
  const getPlayer = (id: number) => participants.find(p => p.id === id)?.display_name || "TBD";

  return {
    live: {
      matchId: currentMatch?.suggested_play_order,
      p1: getPlayer(currentMatch?.player1_id!),
      p2: getPlayer(currentMatch?.player2_id!),
      score: currentMatch?.scores_csv || "0-0"
    },
    next: queue.slice(0, 2).map(m => ({
      matchNumber: m.suggested_play_order,
      p1: getPlayer(m.player1_id),
      p2: getPlayer(m.player2_id),
      isLosers: m.suggested_play_order >= 6 // Exemple basé sur ta capture
    }))
  };
};
// hooks/useTournamentQueue.ts
import { predictMatchGain } from './elo';

export const getLiveQueue = async (matches: any[], participants: any[], supabase: any) => {
  if (!matches || !participants) return { live: null, waiting: [] };

  // 1. Trouver le match en cours (si tu as cliqué sur "Start" dans Challonge)
  const openMatches = matches
    .filter(m => m.state === 'open')
    .sort((a, b) => a.suggested_play_order - b.suggested_play_order);

  const currentMatch = openMatches.length > 0 ? openMatches[0] : null;
  const queueMatches = openMatches.slice(1, 5); // Les 4 suivants

  // 2. Récupérer tous les pseudos uniques pour le batch lookup Supabase
  const getPlayerName = (id: number) => participants.find(p => p.id === id)?.display_name;
  
  // 3. Hydratation via Supabase
  const { data: profiles } = await supabase
    .from('players')
    .select('username, elo_rating, main_character');

  const hydratePlayer = (id: number) => {
    if (!id) return { name: "TBD", elo: 1000, avatar: "default.webp", character: "TBD" };
    const name = getPlayerName(id);
    const profile = profiles?.find((p: any) => p.username === name);
    return {
      name: name || "TBD",
      elo: profile?.elo_rating || 1000,
      avatar: profile?.main_character || "default.webp",
      character: profile?.main_character?.replace('.webp', '').toUpperCase() || "UNKNOWN"
    };
  };

  const p1 = hydratePlayer(currentMatch?.player1_id);
  const p2 = hydratePlayer(currentMatch?.player2_id);

  return {
    live: currentMatch ? {
      matchId: currentMatch?.suggested_play_order,
      p1,
      p2,
      // Prédiction de hype
      p1Gain: predictMatchGain(p1.elo, p2.elo),
      p2Gain: predictMatchGain(p2.elo, p1.elo),
    } : null,
    waiting: queueMatches.map(m => ({
      matchNumber: m.suggested_play_order,
      p1: hydratePlayer(m.player1_id),
      p2: hydratePlayer(m.player2_id)
    }))
  };
};
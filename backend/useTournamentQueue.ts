// hooks/useTournamentQueue.ts
import { predictMatchGain, getRankTier } from './elo';

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
  const { data: playersData } = await supabase
    .from('players')
    .select('name, elo_rating, avatar_url, main_character, wins, losses, current_streak'); 

  const hydratePlayer = (id: number) => {
    if (!id) return { name: "TBD", elo: 1000, avatar: "default.webp", character: "WAITING...", tier: getRankTier(1000), internalId: null, wins: 0, losses: 0, streak: 0 };
    const challongeDisplayName = getPlayerName(id);
    // Comparaison insensible à la casse et aux espaces inutiles
    const playerProfile = playersData?.find((p: any) => 
      p.name.trim().toLowerCase() === challongeDisplayName?.trim().toLowerCase()); 
    const elo = playerProfile?.elo_rating || 1000;
    
    // If avatar_url is null, try to use character name as filename (e.g., "Jin" -> "jin.webp")
    const avatarFile = playerProfile?.avatar_url || (playerProfile?.main_character ? `${playerProfile.main_character.toLowerCase()}.webp` : "default.webp");

    return {
      // On utilise le nom EXACT de la base de données pour les futurs UPDATE
      name: playerProfile?.name || challongeDisplayName || "TBD",
      elo: elo,
      avatar: avatarFile,
      character: playerProfile?.main_character || "UNKNOWN",
      tier: getRankTier(elo),
      internalId: id, // Challonge player ID
      wins: playerProfile?.wins || 0,
      losses: playerProfile?.losses || 0,
      streak: playerProfile?.current_streak || 0
    };
  };

  const p1 = hydratePlayer(currentMatch?.player1_id);
  const p2 = hydratePlayer(currentMatch?.player2_id);

  return {
    live: currentMatch ? {
      id: currentMatch.id, 
      p1,
      p2,
      // Prédiction de hype
      p1Gain: predictMatchGain(p1.elo, p2.elo),
      p2Gain: predictMatchGain(p2.elo, p1.elo),
    } : null,
    waiting: queueMatches.map(m => ({
      matchNumber: m.suggested_play_order,
      matchRound: m.round, // Ajout du numéro de round pour déterminer le type de bracket
      p1: hydratePlayer(m.player1_id),
      p2: hydratePlayer(m.player2_id)
    }))
  };
};
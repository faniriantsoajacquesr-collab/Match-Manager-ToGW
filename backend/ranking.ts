// services/ranking.ts
import { getRankTier } from './elo';

export const getGlobalRanking = async (supabase: any) => {
  // 1. Récupérer les stats étendues (ELO, Character) dans Supabase
  const { data: players, error } = await supabase
    .from('players')
    .select('name, elo_rating, wins, losses, current_streak, avatar_url, main_character')
    .order('elo_rating', { ascending: false });

  if (error) return [];

  // 2. Mapper les données avec les Tiers
  return players.map((player: any, index: number) => ({
    rank: index + 1,
    ...player,
    tier: getRankTier(player.elo_rating),
    ratio: Math.round((player.wins / (player.wins + player.losses || 1)) * 100)
  }));
};
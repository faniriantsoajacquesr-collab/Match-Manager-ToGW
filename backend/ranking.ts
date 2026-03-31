// services/ranking.ts
export const getGlobalRanking = async (supabase: any, tournamentParticipants: any[]) => {
  // 1. Récupérer les stats étendues (ELO, Character) dans Supabase
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username, elo_rating, main_character, wins, defeats')
    .order('elo_rating', { ascending: false });

  if (error) return [];

  // 2. Calculer le ratio et le rang
  return profiles.map((profile, index) => ({
    rank: index + 1,
    ...profile,
    ratio: Math.round((profile.wins / (profile.wins + profile.defeats || 1)) * 100)
  }));
};
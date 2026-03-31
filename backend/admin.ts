// services/admin.ts
export const reportMatchScore = async (matchId: string, score: string, winnerId: number) => {
  // On update Challonge
  await fetch(`https://api.challonge.com/v1/tournaments/${slug}/matches/${matchId}.json`, {
    method: 'PUT',
    body: JSON.stringify({
      match: { scores_csv: score, winner_id: winnerId }
    })
  });

  // On update Supabase pour le Ranking Global (ex: +25 ELO au gagnant)
  // await supabase.rpc('update_elo_after_match', { winner_id, loser_id });
};
// types/challonge.ts
export interface Match {
  id: number;
  state: 'open' | 'pending' | 'complete';
  suggested_play_order: number;
  player1_id: number;
  player2_id: number;
  scores_csv: string;
  underway_at: string | null;
}

// services/challonge.ts
export const fetchTournamentData = async (tournamentSlug: string) => {
  const apiKey = process.env.CHALLONGE_API_KEY;
  
  // On récupère les matchs ET les participants pour avoir les pseudos
  const [matchesRes, participantsRes] = await Promise.all([
    fetch(`https://api.challonge.com/v1/tournaments/${tournamentSlug}/matches.json?api_key=${apiKey}`),
    fetch(`https://api.challonge.com/v1/tournaments/${tournamentSlug}/participants.json?api_key=${apiKey}`)
  ]);

  const matches = await matchesRes.json();
  const participants = await participantsRes.json();

  return {
    matches: matches.map((m: any) => m.match),
    participants: participants.map((p: any) => p.participant)
  };
};
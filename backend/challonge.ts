// types/challonge.ts
export const checkSync = async (slug: string, key: string) => {
  const url = `https://api.challonge.com/v1/tournaments/${slug}/participants.json?api_key=${key}`;
  const res = await fetch(url);
  const participants = await res.json();
  
  console.log(`Tournoi : ${slug}`);
  console.log(`Joueurs synchronisés : ${participants.length}`);
  
  // Vérification du mapping avec Supabase
  participants.forEach((p: any) => {
    console.log(`Vérification de : ${p.participant.display_name}`);
  });
};

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
export const fetchTournamentData = async (slug: string, apiKey: string) => {
  // On appelle notre propre serveur Express pour éviter CORS
  // En production (Vercel), on utilise un chemin relatif pour passer par le proxy
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const API_BASE = isLocal ? "http://localhost:5000/api" : "/api";

  const headers = {
    'x-challonge-slug': slug,
    'x-challonge-api': apiKey
  };

  const [matchesRes, participantsRes] = await Promise.all([
    fetch(`${API_BASE}/matches`, { headers }),
    fetch(`${API_BASE}/participants`, { headers })
  ]);

  if (!matchesRes.ok || !participantsRes.ok) {
    throw new Error(`API Error: Matches(${matchesRes.status}) Participants(${participantsRes.status})`);
  }

  const matches = await matchesRes.json();
  const participants = await participantsRes.json();

  if (!Array.isArray(matches) || !Array.isArray(participants)) {
    console.error("Expected arrays from API but got:", { matches, participants });
    return { matches: [], participants: [] };
  }

  return {
    matches: matches.map((m: any) => m.match),
    participants: participants.map((p: any) => p.participant)
  };
};
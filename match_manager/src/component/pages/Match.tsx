import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { MatchHero } from '../UX/MatchHero';
import { QueueCard } from '../UX/QueueCard';
import { fetchTournamentData } from '../../../../backend/challonge';
import { getLiveQueue } from '../../../../backend/useTournamentQueue';
import { supabase } from '../../../../backend/supabase'
import { calculateNewRatings } from '../../../../backend/elo';

// Détermine l'URL de l'API : relative en production (Vercel), absolue en local
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? 'http://localhost:5000' : '';

export default function Match() {
    const [tournamentData, setTournamentData] = useState<any>(null);
    const [winningSide, setWinningSide] = useState<'p1' | 'p2' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [settings, setSettings] = useState<{slug: string, api: string} | null>(null);
    const [champion, setChampion] = useState<any>(null);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    const refreshData = async () => {
        try {
            // 1. Récupérer les settings en base
            const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').single();
            if (settingsError || !settingsData) throw new Error("Could not fetch tournament settings from Supabase");
            
            setSettings(settingsData);
            
            // 2. Fetch les données tournoi avec ces settings
            const { matches, participants } = await fetchTournamentData(settingsData.slug, settingsData.api);
            const hydratedQueue = await getLiveQueue(matches, participants, supabase);
            setTournamentData(hydratedQueue);
        } catch (err: any) {
            console.error("Match Manager Error:", err);
            setError(err.message);
        }
    };

    const getPhaseLabel = (match: any) => {
        if (match.isGrandFinal) return "GRAND FINAL";
        if (match.isWinnersFinal) return "WINNER'S FINAL";
        if (match.isLosersFinal) return "LOSER'S FINAL";
        if (match.isWinnersSemi) return "WINNER'S SEMI-FINAL";
        
        if (match.matchRound === 0) return "Match d'Exhibition";
        const absRound = Math.abs(match.matchRound);
        const bracket = match.matchRound > 0 ? "WINNER'S BRACKET" : "LOSER'S BRACKET";
        return `${bracket} • ROUND ${absRound}`;
    };

    const handleWinner = async (side: 'p1' | 'p2') => {
        const match = tournamentData.live;
        const winner = side === 'p1' ? match.p1 : match.p2;
        const loser = side === 'p1' ? match.p2 : match.p1;

        if (!match.id) {
            console.error("Match ID is missing from tournamentData.live", match);
            alert("Error: Match ID is missing. Cannot update results.");
            return;
        }

        if (!window.confirm(`Confirm ${winner.name} as winner?`)) return;

        try {
            setWinningSide(side); // Déclenche l'animation de victoire

            // Diffuser l'animation à tous les autres utilisateurs
            if (channel) {
                await channel.send({
                    type: 'broadcast',
                    event: 'winner-declared',
                    payload: { side },
                });
            }

            // 1. Signaler à Challonge (via notre proxy Express)
        const challongeRes = await fetch(`${API_BASE}/api/matches/${match.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-challonge-slug': settings?.slug || "",
                    'x-challonge-api': settings?.api || ""
                },
                body: JSON.stringify({ 
                    winner_id: winner.internalId, 
                    scores_csv: side === 'p1' ? "1-0" : "0-1" 
                })
            });

            if (!challongeRes.ok) throw new Error("Échec de la mise à jour sur Challonge");

            // 2. Calculer le nouvel ELO
            const [newWinElo, newLosElo] = calculateNewRatings(winner.elo, loser.elo);

            // 3. Mettre à jour Supabase
            const updates = await Promise.all([
                supabase.from('players')
                    .update({ elo_rating: newWinElo, wins: winner.wins + 1, current_streak: winner.streak + 1 })
                    .eq('name', winner.name)
                    .select(), // .select() permet de vérifier si une ligne a été renvoyée
                supabase.from('players')
                    .update({ elo_rating: newLosElo, losses: loser.losses + 1, current_streak: 0 })
                    .eq('name', loser.name)
                    .select()
            ]);

            const winUpdate = updates[0];
            const losUpdate = updates[1];

            if (winUpdate.error || losUpdate.error) throw new Error("Erreur SQL Supabase");
            if (!winUpdate.data?.length || !losUpdate.data?.length) {
                throw new Error(`Joueur introuvable en base : ${!winUpdate.data?.length ? winner.name : loser.name}`);
            }

            // Vérification si c'était le dernier match (Grand Finale)
            if (match.isGrandFinal) {
                setChampion(winner);
            }

            // 4. Refresh immédiat
            setTimeout(() => {
                refreshData();
                setWinningSide(null); // Réinitialise l'état de l'animation
            }, 5000); // 5 secondes de délai pour l'animation
        } catch (err) {
            console.error("Winner reporting error:", err);
            alert("Erreur lors de la validation du résultat. Vérifie la console.");
            setWinningSide(null);
        }
    };

    useEffect(() => {
        // Premier chargement
        refreshData();
        // Check admin status
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');

        // Configuration du canal temps réel pour les animations
        const matchChannel = supabase.channel('tournament-live');

        matchChannel
            .on('broadcast', { event: 'winner-declared' }, (payload) => {
                // Cette partie s'exécute chez tous les clients (sauf l'envoyeur par défaut)
                setWinningSide(payload.payload?.side);
                setTimeout(() => setWinningSide(null), 5000);
            })
            .subscribe();

        setChannel(matchChannel);

        // Polling toutes les 10 secondes
        const interval = setInterval(refreshData, 10000);
        return () => {
            clearInterval(interval);
            supabase.removeChannel(matchChannel);
        };
    }, []);

    if (error) return <div className="text-error p-20 bg-black h-screen">Error: {error}</div>;
    if (!tournamentData) return <div className="text-white p-20">Loading Tournament...</div>;

    return (
      <main className="pt-16">
        {/* Overlay de Célébration du Champion */}
        {champion && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-700">
            <div className="max-w-2xl w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary blur-[100px] opacity-20 animate-pulse" />
                <h1 className="relative text-5xl md:text-7xl font-headline font-black text-white italic skew-heading leading-none">
                  TOURNAMENT<br/>
                  <span className="text-primary">CHAMPION</span>
                </h1>
              </div>

              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mt-12">
                <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20" />
                <img 
                  src={champion.avatar?.startsWith('http') ? champion.avatar : `/assets/characters/${champion.avatar || 'default.webp'}`}
                  alt={champion.name}
                  className="w-full h-full rounded-full object-cover border-8 border-primary relative z-10 shadow-[0_0_50px_rgba(129,236,255,0.4)]"
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 bg-secondary px-8 py-3 skew-x-[-15deg] shadow-2xl">
                  <span className="text-2xl md:text-3xl font-headline font-black text-on-secondary italic block skew-x-[15deg]">WINNER</span>
                </div>
              </div>

              <h2 className="text-5xl md:text-6xl font-headline font-black text-white uppercase tracking-tighter mt-12">
                {champion.name}
              </h2>

              <button 
                onClick={() => setChampion(null)}
                className="px-12 py-4 bg-primary text-on-primary font-headline font-bold text-xl uppercase italic skew-heading hover:scale-105 transition-transform"
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        <div className="p-8 max-w-7xl mx-auto space-y-12">
          {tournamentData.live && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-primary font-headline text-3xl md:text-4xl font-black italic skew-heading uppercase tracking-tighter">
                  {getPhaseLabel(tournamentData.live)}
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2" />
              </div>
              <MatchHero match={tournamentData.live} onWinner={handleWinner} winningSide={winningSide} isAdmin={isAdmin} />
            </div>
          )}
          
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary text-3xl">groups</span>
                <div>
                  <h3 className="font-headline text-2xl font-black uppercase tracking-tight ">Next Challengers</h3>
                  <p className="font-label text-xs text-white/40 uppercase tracking-widest">
                    Tournament Queue • {tournamentData.waiting.length} Matches Pending
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournamentData.waiting.map((m: any, index: number) => (
                <div key={index} className="space-y-2">
                   <p className="text-[10px] font-bold text-primary/50 ml-2">MATCH #{m.matchNumber}</p>
                   <p className="text-[10px] font-bold text-white/40 ml-2">{m.matchRound > 0 ? "WINNER'S BRACKET" : "LOSER'S BRACKET"}</p>
                   <QueueCard 
                    handle={m.p1.name} 
                    character={m.p1.character} 
                    avatarUrl={m.p1.avatar}
                    elo={m.p1.elo.toString()} 
                    isOnDeck={index < 2} 
                    matchRound={m.matchRound}
                  />
                  <div className="h-px bg-white/5 w-1/2 mx-auto" />
                  <QueueCard 
                    handle={m.p2.name} 
                    character={m.p2.character} 
                    avatarUrl={m.p2.avatar}
                    elo={m.p2.elo.toString()} 
                    isOnDeck={index < 2} 
                    matchRound={m.matchRound}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    )}
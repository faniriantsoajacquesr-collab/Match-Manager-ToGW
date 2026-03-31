import { useEffect, useState } from 'react';
import { MatchHero } from '../UX/MatchHero';
import { QueueCard } from '../UX/QueueCard';
import { fetchTournamentData } from '../../../../backend/challonge';
import { getLiveQueue } from '../../../../backend/useTournamentQueue';
import { supabase } from '../../../../backend/supabase'

export default function Match() {
    const [tournamentData, setTournamentData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const refreshData = async () => {
        try {
            const slug = import.meta.env.VITE_CHALLONGE_SLUG || "";
            if (!slug) throw new Error("Challonge Slug is missing in .env");
            
            const { matches, participants } = await fetchTournamentData(slug);
            const hydratedQueue = await getLiveQueue(matches, participants, supabase);
            setTournamentData(hydratedQueue);
        } catch (err: any) {
            console.error("Match Manager Error:", err);
            setError(err.message);
        }
    };

    useEffect(() => {
        // Premier chargement
        refreshData();

        // Polling toutes les 10 secondes
        const interval = setInterval(refreshData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (error) return <div className="text-error p-20 bg-black h-screen">Error: {error}</div>;
    if (!tournamentData) return <div className="text-white p-20">Loading Tournament...</div>;

    return (
<main className="pt-16">
        <div className="p-8 max-w-7xl mx-auto space-y-12">
          {tournamentData.live && <MatchHero match={tournamentData.live} />}
          
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
                   <QueueCard 
                    handle={m.p1.name} 
                    character={m.p1.character} 
                    elo={m.p1.elo.toString()} 
                    isOnDeck={index < 2} 
                  />
                  <div className="h-px bg-white/5 w-1/2 mx-auto" />
                  <QueueCard 
                    handle={m.p2.name} 
                    character={m.p2.character} 
                    elo={m.p2.elo.toString()} 
                    isOnDeck={index < 2} 
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    )}
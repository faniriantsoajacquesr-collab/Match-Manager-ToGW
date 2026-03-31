import { MatchHero } from '../UX/MatchHero';
import { QueueCard } from '../UX/QueueCard';

export default function Match() {
    return (
<main className="pt-16">
        <div className="p-8 max-w-7xl mx-auto space-y-12">
          <MatchHero />
          
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary text-3xl">groups</span>
                <div>
                  <h3 className="font-headline text-2xl font-black uppercase tracking-tight ">Next Challengers</h3>
                  <p className="font-label text-xs text-white/40 uppercase tracking-widest">Tournament Queue • Session 04</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <QueueCard handle="KING_MAIN_99" character="King" elo="2,750" isOnDeck />
              <QueueCard handle="HWOARANG_GOD" character="Hwoarang" elo="2,680" isOnDeck />
              <QueueCard handle="LILI_VIBES" character="Lili" elo="2,540" />
                <QueueCard handle="KING_MAIN_89" character="King" elo="2,150"/>
              <QueueCard handle="ASUKA_GOD" character="Asuka" elo="2,480" />
              <QueueCard handle="LILI_VIBES" character="Lili" elo="2,520" />

              {/* ... Autres cartes */}
            </div>
          </section>
        </div>
      </main>
    )}
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../backend/supabase';

const Classement: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('players')
        .select('*')
        .order('elo_rating', { ascending: false });
      if (data) setPlayers(data);
    };
    fetchPlayers();
  }, []);

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body overflow-x-hidden min-h-screen">
      {/* Custom Styles Injection (Ideally moved to a global CSS file) */}
      <style>{`
        .skew-heading { transform: skewX(-6deg); }
        .skew-card { transform: skewX(-3deg); }
        .no-skew { transform: skewX(3deg); }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000000; }
        ::-webkit-scrollbar-thumb { background: #81ecff; }
      `}</style>

      {/* Main Content */}
      <main className="md:ml-64 pt-24 px-6 pb-12 min-h-screen">
        {/* Hero Header */}
        <div className="relative mb-12 overflow-hidden bg-surface-container p-8 skew-card">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 no-skew">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzTpXP_GAmHCk0vu0jWjLhw1PaeAWtIJ0ebNBJ_mO94V1vNm2-5Bz47avQHRGY24eUtPnivZR2Zw1KFkEPaT7Y55YEpLeQyPFETh5eoqgHQYmxFqodOCuqlgAsg48iNnq55GA6PUkmbGP7cVUReKGCLJ0ZFAoyCgzJXzKO_O_MueJqlTS3mGRczZBQXNGI5MXbb64I5Kjxxle2sDmIL0j1admPxprhQyPvtgFZ-ezLeNgwirgu-zw6GAHdWWCvCQLTePKShe5nYEv3')" }}></div>
          </div>
          <div className="relative z-10 no-skew">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              <span className="text-xs font-label uppercase tracking-[0.2em] text-secondary">Global Competition</span>
            </div>
            <h1 className="text-5xl font-headline font-extrabold skew-heading italic text-white mb-4">TEKKEN 8 RANKINGS</h1>
            <p className="max-w-xl text-on-surface/70 font-body text-sm leading-relaxed">
              The official Toliara Games Week leaderboard. Track the highest ELO players across the TBC Engine ecosystem. Ranking updated in real-time based on tournament performance.
            </p>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Rank 2 - Silver */}
          {players[1] && (
            <div className="bg-surface-container-low p-6 border-l-4 border-[#C0C0C0] relative group hover:bg-surface-container-high transition-colors order-2 md:order-1">
              <div className="absolute -top-4 -right-4 text-6xl font-headline font-black text-white/5 italic">02</div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-[#C0C0C0] p-1 overflow-hidden">
                  <img alt={players[1].name} className="w-full h-full rounded-full object-cover" src={`/assets/characters/${players[1].avatar_url}`} />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-xl text-white">{players[1].name}</h4>
                  <span className="text-xs font-label uppercase tracking-widest" style={{ color: players[1].tier.color }}>
                    {players[1].tier.label}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-label text-white/40 uppercase mb-1">Character</p>
                  <p className="font-headline font-bold text-[#C0C0C0] skew-heading italic">{players[1].main_character || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-label text-white/40 uppercase mb-1">ELO Points</p>
                  <p className="text-2xl font-headline font-black text-white">{players[1].elo_rating}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {players[0] && (
            <div className="bg-surface-container-highest p-8 border-l-4 border-primary relative overflow-hidden shadow-[0_0_30px_rgba(129,236,255,0.1)] order-1 md:order-2">
              <div className="absolute top-0 right-0 w-full h-full opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-primary to-transparent"></div>
              </div>
              <div className="absolute -top-4 -right-4 text-8xl font-headline font-black text-primary/10 italic">01</div>
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-primary p-1 shadow-[0_0_20px_rgba(129,236,255,0.3)] overflow-hidden">
                    <img alt={players[0].name} className="w-full h-full rounded-full object-cover" src={`/assets/characters/${players[0].avatar_url}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                      <span className="text-xs font-label uppercase text-primary tracking-[0.3em] font-bold">Grand Champion</span>
                    </div>
                    <h4 className="font-headline font-black text-3xl text-white italic skew-heading">{players[0].name}</h4>
                    <p className="text-sm font-body text-white/60">{players[0].tier.label}</p>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-label text-white/40 uppercase mb-1">Main Character</p>
                      <p className="font-headline font-bold text-primary skew-heading italic text-xl">{players[0].main_character || 'N/A'}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[10px] font-label text-white/40 uppercase">Wins</p>
                        <p className="text-lg font-headline font-bold text-white">{players[0].wins}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-label text-white/40 uppercase">Ratio</p>
                        <p className="text-lg font-headline font-bold text-secondary">{players[0].ratio}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-label text-white/40 uppercase mb-1">ELO Points</p>
                    <p className="text-5xl font-headline font-black text-white tracking-tighter">{players[0].elo_rating}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {players[2] && (
            <div className="bg-surface-container-low p-6 border-l-4 border-[#CD7F32] relative group hover:bg-surface-container-high transition-colors order-3">
              <div className="absolute -top-4 -right-4 text-6xl font-headline font-black text-white/5 italic">03</div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-[#CD7F32] p-1 overflow-hidden">
                  <img alt={players[2].name} className="w-full h-full rounded-full object-cover" src={`/assets/characters/${players[2].avatar_url}`} />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-xl text-white">{players[2].name}</h4>
                  <span className="text-xs font-label uppercase tracking-widest" style={{ color: players[2].tier.color }}>
                    {players[2].tier.label}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-label text-white/40 uppercase mb-1">Character</p>
                  <p className="font-headline font-bold text-[#CD7F32] skew-heading italic">{players[2].main_character || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-label text-white/40 uppercase mb-1">ELO Points</p>
                  <p className="text-2xl font-headline font-black text-white">{players[2].elo_rating}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-surface-container overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="font-headline font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-4 bg-primary"></span> Challenger Ladder
            </h2>
            <div className="flex gap-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">search</span>
                <input className="bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary text-xs font-label uppercase pl-10 pr-4 py-2 w-64 text-white" placeholder="SEARCH PLAYER..." type="text" />
              </div>
              <button className="bg-surface-container-high px-4 py-2 flex items-center gap-2 text-xs font-label uppercase text-white/70 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">filter_list</span> Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-white/5">
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-white/40">Rank</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-white/40">Player</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-white/40">Character</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-white/40 text-center">Wins</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-white/40 text-center">Defeats</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-white/40 text-right">ELO Points</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {players.slice(3).map((player: any) => (
                  <tr key={player.rank} className="hover:bg-white/[0.02] transition-colors group border-b border-white/5">
                    <td className="px-6 py-5">
                      <span className="font-headline font-bold text-white/50 italic">#{player.rank.toString().padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-container-high rounded-full overflow-hidden border border-white/10">
                          <img alt={player.name} className="w-full h-full object-cover" src={`/assets/characters/${player.avatar_url}`} />
                        </div>
                        <span className="font-headline font-bold text-white group-hover:text-primary transition-colors">{player.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-label text-xs uppercase text-white/60 px-2 py-1 bg-white/5 border border-white/10">{player.main_character || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-5 text-center font-headline font-bold text-white">{player.wins}</td>
                    <td className="px-6 py-5 text-center font-headline font-bold text-error/60">{player.losses}</td>
                    <td className="px-6 py-5 text-right font-headline font-bold text-primary">{player.elo_rating}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-white/20 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-6 border-t border-white/5 flex justify-between items-center bg-surface-container-low">
            <p className="text-[10px] font-label text-white/40 uppercase tracking-widest">Showing 7 of 1,240 players</p>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-high text-white hover:bg-primary hover:text-on-primary transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary font-headline font-bold">01</button>
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-high text-white hover:bg-primary/20 transition-all">02</button>
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-high text-white hover:bg-primary/20 transition-all">03</button>
              <button className="w-10 h-10 flex items-center justify-center bg-surface-container-high text-white hover:bg-primary hover:text-on-primary transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hype Meter Section */}
      
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-[#0e0e0f] border-t border-white/10 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-1 text-white/50">
          <span className="material-symbols-outlined text-xl">sports_esports</span>
          <span className="text-[9px] font-label uppercase">Match</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#00E5FF]">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>leaderboard</span>
          <span className="text-[9px] font-label uppercase font-bold">Rank</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white/50">
          <span className="material-symbols-outlined text-xl">account_tree</span>
          <span className="text-[9px] font-label uppercase">Bracket</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white/50">
          <span className="material-symbols-outlined text-xl">live_tv</span>
          <span className="text-[9px] font-label uppercase">Stream</span>
        </button>
      </nav>
    </div>
  );
};

export default Classement;
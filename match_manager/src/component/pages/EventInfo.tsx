import { 
  FileText, 
  QrCode, 
  Wifi, 
  Soup, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

const EventInfo = () => {
  return (
    <div className="min-h-screen pt-16 bg-[#0B132B] text-white font-sans selection:bg-[#38B000] selection:text-black">
      {/* HEADER - STYLE ROAD TO FINALE */}
      <header className="relative py-16 px-6 text-center overflow-hidden border-b-2 border-[#38B000]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <h1 className="font-horizon text-4xl md:text-6xl tracking-[0.2em] uppercase mb-4">
          Road to the finals <span className="text-[#38B000]">2026</span>
        </h1>
        <p className="font-anton text-xl md:text-2xl uppercase tracking-tighter text-[#00B4D8]">
          Plateforme Officielle du Concours de Jeu Vidéo
        </p>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-12 pb-20">
        
        {/* SECTION 1: DOCUMENTS OFFICIELS (BLOC HUD) */}
        <section className="relative p-8 bg-black/70 border-l-4 border-[#38B000] rounded-r-lg shadow-[0_0_20px_rgba(56,176,0,0.2)]">
          <h2 className="font-horizon text-2xl mb-6 flex items-center gap-3">
            <FileText className="text-[#38B000]" /> Documents Officiels
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center justify-between p-4 bg-[#0B132B] border border-[#00B4D8]/30 hover:border-[#38B000] transition-all group">
              <span className="font-anton uppercase tracking-tight">Règlement Général</span>
              <div className="h-2 w-2 bg-[#38B000] rounded-full group-hover:scale-150 transition-transform"></div>
            </button>
            <button className="flex items-center justify-between p-4 bg-[#0B132B] border border-[#00B4D8]/30 hover:border-[#38B000] transition-all group">
              <span className="font-anton uppercase tracking-tight">Annexe Tekken 8 – Saison 2</span>
              <div className="h-2 w-2 bg-[#38B000] rounded-full group-hover:scale-150 transition-transform"></div>
            </button>
          </div>
          <div className="mt-6 flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded">
            <AlertTriangle className="text-red-500 shrink-0" />
            <p className="text-sm font-medium">La consultation de ces documents est obligatoire avant toute participation.</p>
          </div>
        </section>

        {/* SECTION 2: ACCREDITATION & PREMIER MATCHRANKING */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* ACCREDITATION */}
          <section className="p-6 bg-[#0B132B] border border-[#00B4D8]/20 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <QrCode size={80} />
            </div>
            <h2 className="font-horizon text-xl mb-4 text-[#00B4D8]">Accréditation</h2>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#38B000] shrink-0" /> Présenter le QR Code reçu après inscription.</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#38B000] shrink-0" /> Paiement requis avant le début du tournoi (Mobile Money/Espèces).</li>
            </ul>
          </section>

          {/* PREMIER MATCHRANKING */}
          <section className="p-6 bg-gradient-to-br from-[#38B000]/10 to-transparent border border-[#38B000]/30 rounded-xl">
            <h2 className="font-horizon text-xl mb-4 text-[#38B000]">Premier Matchranking</h2>
            <div className="space-y-2">
              <p className="font-anton text-2xl uppercase italic">PC TEKKEN 8 – SAISON 2</p>
              <p className="text-gray-400 text-sm">Format : 1v1 Double Élimination (voir Annexe A2)</p>
              <div className="mt-4 inline-block px-3 py-1 bg-[#38B000] text-black font-anton text-sm rounded">
                GET READY FOR THE NEXT BATTLE
              </div>
            </div>
          </section>
        </div>

        {/* SECTION 3: LES 10 COMMANDEMENTS (STYLE LISTE SOLENNELLE) */}
        <section className="bg-black/40 p-8 rounded-2xl border border-white/5">
          <h2 className="font-horizon text-2xl text-center mb-10 tracking-widest uppercase italic">
            Les 10 Commandements du Joueur
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              "Inscris-toi honnêtement (Identité unique)",
              "Respecte les horaires (Forfait possible)",
              "Joue avec ton propre compte et matériel",
              "Viens prêt (Maj du jeu & accessoires)",
              "Accepte les décisions des arbitres",
              "Signale tout problème immédiatement",
              "Ne triche sous aucun prétexte",
              "Respecte les autres compétiteurs",
              "Accepte les règles de diffusion (Streaming)",
              "Accepte le règlement par ta participation"
            ].map((cmd, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-white/10 pb-2 group hover:border-[#38B000] transition-colors">
                <span className="font-horizon text-[#38B000] text-lg italic opacity-50">{(i + 1).toString().padStart(2, '0')}</span>
                <span className="font-anton text-sm uppercase tracking-wide group-hover:text-white transition-colors">{cmd}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: SERVICES & RÈGLES DU LIEU */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* WIFI/FOOD */}
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 bg-[#0B132B] border border-[#00B4D8]/20 rounded-lg">
              <h3 className="font-horizon text-sm mb-4 flex items-center gap-2"><Wifi size={16}/> Wifi & Services</h3>
              <div className="text-xs space-y-2">
                <div className="flex justify-between"><span>Wifi 1h :</span> <span className="text-[#38B000]">500 Ar</span></div>
                <div className="flex justify-between"><span>Wifi Journée :</span> <span className="text-[#38B000]">4 000 Ar</span></div>
                <div className="flex justify-between border-t border-white/10 pt-2"><span>Soupe instantanée :</span> <span className="text-[#38B000]">3 000 Ar</span></div>
              </div>
              <p className="mt-4 text-[10px] text-gray-500 italic flex gap-1"><Soup size={12}/> Prévoir du cash ou Mobile Money.</p>
            </div>

            <div className="p-6 bg-gray-900 border border-white/10 rounded-lg">
              <h3 className="font-horizon text-sm mb-2">Matériel</h3>
              <p className="text-xs text-gray-400 italic">Seul l'usage de vos propres manettes est autorisé.</p>
            </div>
          </div>

          {/* RÈGLES DU LIEU */}
          <div className="md:col-span-2 p-8 bg-[#0B132B] border-t-2 border-[#38B000] rounded-lg">
            <h2 className="font-horizon text-xl mb-6 flex items-center gap-3">
              <ShieldAlert className="text-[#38B000]" /> Règles du Lieu & Sécurité
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-anton text-[#00B4D8] uppercase underline underline-offset-4">Mobilité</h4>
                  <p className="mt-2">Sortie interdite tant que le matchranking n'est pas terminé.</p>
                </div>
                <div>
                  <h4 className="font-anton text-[#00B4D8] uppercase underline underline-offset-4">Mineurs</h4>
                  <p className="mt-2 font-semibold text-[#38B000]">Autorisation parentale signée obligatoire.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-red-900/10 border border-red-500/30 rounded">
                  <h4 className="font-anton text-red-500 uppercase">Interdictions</h4>
                  <p className="text-xs mt-1 italic">Alcool, tabac (milieu fermé), substances illicites.</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></div>
                  Vidéo surveillance active 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-gray-500 text-[10px] uppercase tracking-[0.3em] font-horizon border-t border-white/5">
        © 2026 Association Mahavelo | Toliara Games Week | Tekken Madagascar
      </footer>

      {/* TAILWIND CUSTOM CONFIG (A ajouter dans tailwind.config.js) */}
      <style>{`
        @font-face { font-family: 'Horizon'; src: url('/fonts/horizon.otf'); } /* Remplace par ta police */
        .font-horizon { font-family: 'Horizon', sans-serif; letter-spacing: 0.15em; }
        .font-anton { font-family: 'Anton', sans-serif; }
      `}</style>
    </div>
  );
};

export default EventInfo;
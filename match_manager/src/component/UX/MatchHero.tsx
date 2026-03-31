import React from 'react';
import { PlayerHero } from './PlayerHero';

export const MatchHero: React.FC = () => {
  return (
    <section className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 py-8">
      <PlayerHero 
        side="left"
        role="CHALLENGER"
        name="JIN KAZAMA"
        handle="THUNDER_STRIKE"
        elo="2,840"
        imageUrl="https://www.freepik.com/free-photo/young-man-gaming-with-vr-headset_417583100.htm#fromView=keyword&page=1&position=3&uuid=675e2548-5ad9-4869-ba95-33db1df185ea&query=Game+player" // URL simplifiée pour l'exemple
      />

      <div className="flex flex-col items-center justify-center z-10 px-4">
        <div className="w-[2px] h-24 bg-gradient-to-t from-primary to-transparent mb-4"></div>
        <div className="relative">
          <span className="font-headline text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-primary via-secondary to-tertiary">VS</span>
          <div className="absolute inset-0 blur-2xl bg-secondary/20 -z-10"></div>
        </div>
        <div className="w-[2px] h-24 bg-gradient-to-b from-secondary to-transparent mt-4"></div>
      </div>

      <PlayerHero 
        side="right"
        role="DEFENDER"
        name="KAZUYA MISHIMA"
        handle="DEVIL_GENE_X"
        elo="2,915"
        imageUrl="https://lh3.googleusercontent.com/aida-public/..."
      />
    </section>
  );
};
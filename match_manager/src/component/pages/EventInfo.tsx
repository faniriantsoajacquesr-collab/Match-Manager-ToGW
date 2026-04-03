import React, { useEffect, useRef } from 'react';
import './eventInfo.css';

const EventInfo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hudNavRef = useRef<HTMLElement>(null);
  const hudLinksRef = useRef<NodeListOf<HTMLAnchorElement> | null>(null);
  const generalLinksRef = useRef<NodeListOf<HTMLAnchorElement> | null>(null);
  const annexLinksRef = useRef<NodeListOf<HTMLAnchorElement> | null>(null);
  const categoriesRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const mainSectionsRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const tabLinksRef = useRef<NodeListOf<HTMLAnchorElement> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    hudLinksRef.current = containerRef.current.querySelectorAll('.hud-link');
    generalLinksRef.current = containerRef.current.querySelectorAll('.general-link');
    annexLinksRef.current = containerRef.current.querySelectorAll('.annex-link');
    categoriesRef.current = containerRef.current.querySelectorAll('.category-header');
    mainSectionsRef.current = containerRef.current.querySelectorAll('section');
    tabLinksRef.current = containerRef.current.querySelectorAll('nav a');

    const updateHUD = () => {
      // Reading progress bar
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = scrolled + "%";
      }

      const pageTop = window.pageYOffset;

      // 1. Navigation Tabs Highlight
      let activeMainSectionId = "";
      mainSectionsRef.current?.forEach(sec => {
        if (pageTop >= sec.offsetTop - 250) {
          activeMainSectionId = sec.id;
        }
      });
      tabLinksRef.current?.forEach(l => {
        l.classList.remove('active-tab');
        if (l.getAttribute('href') === `#${activeMainSectionId}`) {
          l.classList.add('active-tab');
        }
      });

      // 2. CONTEXTUAL HUD SWITCHING
      const annexSection = containerRef.current?.querySelector('#annexe') as HTMLElement;
      const isAnnexMode = annexSection && pageTop >= annexSection.offsetTop - 300;

      if (hudNavRef.current) {
        if (isAnnexMode) {
          generalLinksRef.current?.forEach(l => (l.style.display = 'none'));
          annexLinksRef.current?.forEach(l => (l.style.display = 'flex'));
          hudNavRef.current.classList.add('annex-mode');
        } else {
          generalLinksRef.current?.forEach(l => (l.style.display = 'flex'));
          annexLinksRef.current?.forEach(l => (l.style.display = 'none'));
          hudNavRef.current.classList.remove('annex-mode');
        }
      }

      // 3. INTERNAL SCROLLSPY (Categories)
      let currentCatId = '';
      categoriesRef.current?.forEach(cat => {
        if (pageTop >= cat.offsetTop - 300) {
          currentCatId = cat.getAttribute('id') || '';
        }
      });

      hudLinksRef.current?.forEach(link => {
        link.classList.remove('active-cat');
        if (link.getAttribute('href') === `#${currentCatId}`) {
          link.classList.add('active-cat');
        }
      });
    };

    window.addEventListener('scroll', updateHUD);
    updateHUD(); // Initial call

    // Smooth scrolling
    const handleHudLinkClick = (e: Event) => {
      const link = e.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = containerRef.current?.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    hudLinksRef.current?.forEach(link => {
      link.addEventListener('click', handleHudLinkClick);
    });

    // Animation au scroll (Intersection Observer)
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    containerRef.current.querySelectorAll('.article, .info-card, .char-card').forEach(el => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(20px)';
      (el as HTMLElement).style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', updateHUD);
      hudLinksRef.current?.forEach(link => {
        link.removeEventListener('click', handleHudLinkClick);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div className="event-info-container pt-16" ref={containerRef}>
      <header>
        <h1>🎮 RÈGLEMENT GÉNÉRAL DE LA SAISON COMPÉTITIVE E-SPORT 🎮</h1>
        <div className="subtitle">ToGW – Matchranking, Tournois et Classements Officiels</div>
        <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#fff' }}>Saison Compétitive E-Sport – ToGW 2026</div>
      </header>

      <div className="reading-progress-container">
        <div className="reading-progress-bar" ref={progressBarRef}></div>
      </div>

      <nav>
        <a href="#general" id="tab-general">Règlement Général</a>
        <a href="#tekken" id="tab-tekken">Tournois</a>
        <a href="#annexe" id="tab-annexe">Annexes</a>
      </nav>

      <aside className="hud-nav" id="mainHud" ref={hudNavRef}>
        <a href="#cat-org" className="hud-link general-link">
          <span>L'Organisation</span>
          <i className="fas fa-sitemap"></i>
        </a>
        <a href="#cat-part" className="hud-link general-link">
          <span>Participation</span>
          <i className="fas fa-user-check"></i>
        </a>
        <a href="#cat-comp" className="hud-link general-link">
          <span>Compétition</span>
          <i className="fas fa-trophy"></i>
        </a>
        <a href="#cat-disc" className="hud-link general-link">
          <span>Sanctions</span>
          <i className="fas fa-balance-scale"></i>
        </a>
        <a href="#cat-recomp" className="hud-link general-link">
          <span>Récompenses</span>
          <i className="fas fa-gift"></i>
        </a>

        <a href="#cat-tech" className="hud-link annex-link annex-mode">
          <span>Cadre & Inscription</span>
          <i className="fas fa-microchip"></i>
        </a>
        <a href="#cat-annex-format" className="hud-link annex-link annex-mode">
          <span>Format & Paramètres</span>
          <i className="fas fa-gamepad"></i>
        </a>
        <a href="#cat-annex-coach" className="hud-link annex-link annex-mode">
          <span>Coaching & Résultats</span>
          <i className="fas fa-check-double"></i>
        </a>
      </aside>

      <section id="general">
        <h2 className="section-title">📜 Règlement Général</h2>

        <div className="articles-grid">
          <div className="category-header" id="cat-org"><i className="fas fa-sitemap"></i> L'Organisation</div>
          
          <div className="article">
            <h3><i className="fas fa-hammer"></i> Article 1 – Organisateur</h3>
            <p>La saison compétitive e-sport (ci-après la « Saison ») est organisée par l'Association MAHAVELO.</p>
            <p>L’Organisateur assure la coordination générale, l’administration, la validation des inscriptions, la gestion du calendrier, la supervision de l’arbitrage, la publication des résultats, la gestion des classements ainsi que le bon déroulement de l’ensemble des activités relevant de la Saison.</p>
            <p>Toute communication officielle relative à la Saison, aux événements, aux résultats, aux modifications de calendrier, aux annonces de jeux, aux récompenses et aux décisions d’arbitrage est effectuée exclusivement via les canaux désignés par l’Organisateur.</p>
            <p>Seules les informations diffusées par ces canaux officiels font foi.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-bullseye"></i> Article 2 – Objet</h3>
            <p>La Saison a pour objet d’organiser un programme compétitif régulier autour du jeu vidéo, dans un cadre structuré, équitable, accessible et respectueux des principes de fair-play, de discipline et de compétition saine.</p>
            <p>Elle vise notamment à :</p>
            <ul>
              <li>proposer des événements compétitifs réguliers ;</li>
              <li>permettre aux participants d’évaluer leur niveau ;</li>
              <li>établir des classements de performance ;</li>
              <li>favoriser l’émergence d’une scène compétitive locale ou communautaire ;</li>
              <li>structurer un environnement de compétition durable ;</li>
              <li>accueillir progressivement plusieurs jeux au sein d’un même programme.</li>
            </ul>
            <p>La Saison constitue un cadre compétitif continu et ne se limite pas à un tournoi unique.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-calendar-alt"></i> Article 3 – Nature de la Saison compétitive</h3>
            <p>La Saison se compose de plusieurs formats compétitifs pouvant être organisés de manière récurrente au cours d’une même période.</p>
            <p>Sauf annonce contraire, elle comprend notamment :</p>
            <ul>
              <li>une session de Matchranking par mois ;</li>
              <li>un Tournoi compétitif tous les deux mois.</li>
            </ul>
            <p>L’Organisateur peut, selon les besoins ou les opportunités, ajouter, suspendre, reporter, fusionner, remplacer ou supprimer certains événements, formats ou sessions sans que cela n’ouvre droit à réclamation ou indemnisation.</p>
            <p>L’existence d’un événement dans le calendrier ne vaut confirmation définitive qu’après validation et publication officielle par l’Organisateur.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-gamepad"></i> Article 4 – Jeux concernés</h3>
            <p>La Saison peut porter sur un ou plusieurs jeux vidéo définis par l’Organisateur.</p>
            <p>L’Organisateur se réserve le droit d’intégrer, suspendre, remplacer ou retirer tout jeu dans le cadre de la Saison, selon les orientations compétitives, les contraintes techniques, les partenariats, la disponibilité communautaire ou les objectifs du programme.</p>
            <p>Chaque jeu intégré au programme peut faire l’objet d’une annexe spécifique précisant ses règles techniques, son format compétitif, ses paramètres particuliers, ses modalités de score, ses restrictions et toute disposition propre au jeu concerné.</p>
            <p>Le présent règlement général s’applique à l’ensemble des jeux intégrés à la Saison, sauf dispositions spécifiques prévues dans une annexe applicable.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-calendar-check"></i> Article 5 – Calendrier officiel</h3>
            <p>Le calendrier officiel de la Saison est fixé, communiqué et, le cas échéant, modifié par l’Organisateur.</p>
            <p>Sauf disposition contraire, les dates, horaires, lieux, modalités de participation, conditions d’inscription, formats de compétition, règles spécifiques et informations pratiques sont publiés avant chaque événement ou série d’événements.</p>
            <p>L’Organisateur se réserve le droit de modifier le calendrier en cas de nécessité technique, logistique, financière, administrative, sécuritaire, communautaire ou organisationnelle.</p>
            <p>Les participants sont tenus de consulter régulièrement les canaux officiels afin de prendre connaissance des mises à jour, convocations, horaires, changements et consignes.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-server"></i> Article 6 – Plateforme officielle de gestion compétitive</h3>
            <p>Dans le cadre de l’organisation de la Saison, l’Organisateur peut utiliser une plateforme officielle de gestion compétitive, développée ou exploitée sous sa responsabilité ou sous celle de ses partenaires techniques.</p>
            <p>Cette plateforme peut notamment permettre :</p>
            <ul>
              <li>l’inscription des participants ;</li>
              <li>la création et la gestion des profils compétitifs ;</li>
              <li>la validation administrative des joueurs ;</li>
              <li>l’enregistrement des paiements lorsque cette fonctionnalité est activée ;</li>
              <li>la génération des matchs, poules, tableaux ou brackets ;</li>
              <li>la saisie, la validation et l’historisation des résultats ;</li>
              <li>le calcul des scores, points, performances ou classements ;</li>
              <li>la gestion du système de ranking ou de classement ELO ;</li>
              <li>la publication des calendriers, convocations, statistiques et classements ;</li>
              <li>l’archivage des participations et performances.</li>
            </ul>
            <p>Sauf erreur manifeste, correction officielle ou décision contraire de l’Organisateur, les informations affichées, validées ou publiées sur la plateforme officielle sont présumées exactes et peuvent faire foi dans le cadre de la gestion de la Saison.</p>
            <p>Chaque participant est responsable de l’exactitude des informations qu’il renseigne sur la plateforme et de la bonne utilisation de son compte, de son profil, de ses identifiants et de ses accès.</p>
            <p>Toute tentative de manipulation, d’usurpation, de fraude, d’altération de données, de contournement technique ou d’usage abusif de la plateforme peut entraîner des sanctions disciplinaires, sportives, administratives ou techniques.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-hourglass-half"></i> Article 7 – Durée de la Saison</h3>
            <p>La Saison se déroule sur une période définie par l’Organisateur.</p>
            <p>Sa date de début, sa date de clôture, son éventuelle prolongation, sa remise à zéro, sa reconduction ou son remplacement par une nouvelle édition relèvent de la seule décision de l’Organisateur.</p>
            <p>Sauf annonce contraire, seuls les événements homologués et publiés comme relevant officiellement de la Saison sont pris en compte dans les classements compétitifs.</p>
          </div>

          <div className="category-header" id="cat-part"><i className="fas fa-user-friends"></i> Joueurs & Inscriptions</div>

          <div className="article">
            <h3><i className="fas fa-id-badge"></i> Article 8 – Conditions de participation</h3>
            <p>La participation à la Saison est ouverte à toute personne remplissant les conditions d’inscription, d’éligibilité et de comportement fixées par l’Organisateur.</p>
            <p>L’âge minimum requis pour participer est fixé à [âge minimum] ans.</p>
            <p>Toute personne mineure devra fournir, avant sa participation effective, une autorisation parentale ou une autorisation du représentant légal, selon les modalités fixées par l’Organisateur.</p>
            <p>L’Organisateur se réserve le droit de refuser, suspendre ou annuler toute participation ne respectant pas les conditions fixées.</p>
            <p>La participation est personnelle, individuelle et non transférable, sauf cas expressément prévu dans une annexe spécifique pour un jeu ou un format en équipe.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-check-circle"></i> Article 9 – Inscription et validation</h3>
            <p>Toute inscription doit être effectuée selon les modalités, délais et supports précisés par l’Organisateur.</p>
            <p>L’inscription n’est considérée comme définitive qu’après validation par l’Organisateur.</p>
            <p>L’Organisateur peut notamment conditionner cette validation :</p>
            <ul>
              <li>à la complétude du formulaire ;</li>
              <li>à la vérification de l’identité ou du pseudonyme ;</li>
              <li>au respect des délais ;</li>
              <li>au paiement éventuel des frais de participation ;</li>
              <li>à la production de justificatifs utiles.</li>
            </ul>
            <p>Toute inscription incomplète, tardive, frauduleuse, multiple, mensongère ou irrégulière pourra être refusée, suspendue ou annulée à tout moment.</p>
            <p>Une seule inscription est autorisée par personne et par événement, sauf disposition spécifique contraire annoncée officiellement.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-money-bill-wave"></i> Article 10 – Frais de participation</h3>
            <p>La participation à certains événements de la Saison peut être gratuite ou payante selon le format concerné.</p>
            <p>Lorsque des frais de participation sont exigés, leur montant, leurs modalités de paiement, leurs délais de règlement, leurs conditions de validation et leurs éventuelles conditions de remboursement sont précisés dans :</p>
            <ul>
              <li>l’annonce officielle de l’événement concerné ;</li>
              <li>la fiche événement ;</li>
              <li>la plateforme officielle ;</li>
              <li>ou l’annexe applicable.</li>
            </ul>
            <p>Le paiement peut être exigé avant validation définitive de l’inscription ou, lorsque cela est expressément autorisé, être effectué selon d’autres modalités définies par l’Organisateur.</p>
            <p>L’Organisateur se réserve le droit de refuser la participation d’un joueur dont les frais éventuels n’ont pas été réglés dans les conditions requises.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-undo"></i> Article 11 – Désistement, annulation et remboursement</h3>
            <p>Sauf annonce contraire, les frais d’inscription versés au titre d’un événement sont réputés engagés pour l’organisation de celui-ci.</p>
            <p>En cas d’absence, de retard excessif, de désistement volontaire, d’abandon ou de non-présentation d’un participant, aucun remboursement n’est dû, sauf décision express contraire de l’Organisateur.</p>
            <p>En cas de report, de modification substantielle ou d’annulation d’un événement par l’Organisateur, celui-ci pourra, à sa seule appréciation :</p>
            <ul>
              <li>maintenir l’inscription sur une date ultérieure ;</li>
              <li>proposer un report ;</li>
              <li>proposer un avoir ;</li>
              <li>procéder à un remboursement total ou partiel ;</li>
              <li>ou décider qu’aucun remboursement n’est applicable lorsque les circonstances le justifient.</li>
            </ul>
            <p>Aucune demande de remboursement ne sera recevable en dehors des modalités officiellement communiquées.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-users-cog"></i> Article 12 – Capacité d’accueil et places disponibles</h3>
            <p>Le nombre de participants admis à un événement peut être limité en fonction :</p>
            <ul>
              <li>de la capacité du lieu ;</li>
              <li>du format de l’arbre de compétition ;</li>
              <li>du matériel disponible ;</li>
              <li>des contraintes de temps ;</li>
              <li>des contraintes techniques ou organisationnelles.</li>
            </ul>
            <p>L’Organisateur se réserve le droit de clôturer les inscriptions avant la date limite annoncée si la capacité maximale est atteinte.</p>
            <p>La priorité peut être donnée, selon les cas, à l’ordre de validation des inscriptions, à l’ordre de paiement, à l’ordre d’enregistrement ou à toute autre méthode officiellement annoncée.</p>
          </div>

          <div className="category-header" id="cat-comp"><i className="fas fa-trophy"></i> La Compétition</div>

          <div className="article">
            <h3><i className="fas fa-dice"></i> Article 13 – Formats compétitifs de la Saison</h3>
            <p>La Saison peut comprendre plusieurs types de formats compétitifs.</p>
            <h4 style={{ color: '#ffcc00', marginTop: '15px' }}>13.1 – Matchranking</h4>
            <p>Le Matchranking constitue un format compétitif destiné principalement à mesurer la performance des participants et à alimenter les classements officiels de la Saison. Il peut notamment servir à :</p>
            <ul>
              <li>établir ou faire évoluer un classement ;</li>
              <li>évaluer le niveau des joueurs ;</li>
              <li>préparer le seeding des tournois ;</li>
              <li>structurer les futures confrontations.</li>
            </ul>
            <p>Sauf annonce expresse contraire, le Matchranking n’ouvre pas automatiquement droit à une récompense matérielle, financière ou symbolique.</p>
            <h4 style={{ color: '#ffcc00', marginTop: '15px' }}>13.2 – Tournoi</h4>
            <p>Le Tournoi constitue un événement compétitif organisé selon un format déterminé à l’avance, pouvant inclure notamment : élimination directe ; double élimination ; poules ; phases finales ; matchs à élimination progressive ; ou tout autre format annoncé officiellement.</p>
            <p>Le tournoi peut être organisé avec ou sans récompense. Le format applicable à chaque tournoi est annoncé avant l’événement concerné.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-sort-amount-up"></i> Article 14 – Classements officiels et système ELO</h3>
            <p>La Saison peut donner lieu à l’établissement, à la publication et à la mise à jour d’un ou plusieurs classements officiels de performance.</p>
            <p>Ces classements peuvent être organisés : par jeu ; par format ; par catégorie ; par division ; par saison ; par niveau ; ou selon toute structure définie par l’Organisateur.</p>
            <p>Lorsqu’un système de type ELO est utilisé, celui-ci a pour objet d’évaluer le niveau relatif des participants en fonction de leurs résultats homologués. Sauf annonce contraire, le principe général est le suivant :</p>
            <ul>
              <li>chaque nouveau participant débute avec un capital de 1000 ELO ;</li>
              <li>chaque match officiellement validé peut entraîner un gain ou une perte de points ;</li>
              <li>battre un joueur mieux classé peut entraîner un gain plus élevé ;</li>
              <li>perdre contre un joueur moins bien classé peut entraîner une perte plus importante.</li>
            </ul>
            <p>L’Organisateur demeure seul compétent pour : définir les paramètres de calcul ; ajuster le système de notation ; corriger une anomalie technique ; exclure un résultat irrégulier ; homologuer ou annuler un match ; suspendre, modifier ou remplacer le système de classement.</p>
            <p>Le détail mathématique du calcul ELO n’a pas à être publié intégralement pour être applicable. Seuls les résultats validés officiellement par l’Organisateur ou par l’arbitrage peuvent produire des effets sur les classements.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-clipboard-check"></i> Article 15 – Homologation des matchs et des résultats</h3>
            <p>Seuls les matchs organisés, validés, supervisés ou reconnus par l’Organisateur dans le cadre officiel de la Saison peuvent être homologués.</p>
            <p>Un résultat n’est considéré comme officiel qu’après validation par l'arbitrage, la table de marque, l'administration de tournoi, la plateforme officielle ou tout représentant autorisé de l’Organisateur.</p>
            <p>L’Organisateur peut exiger, selon les cas : une confirmation verbale ; une feuille de résultat ; une capture d’écran ; un relevé de bracket ; une validation numérique ; ou tout autre élément de preuve jugé utile.</p>
            <p>Tout résultat entaché de fraude, d’erreur manifeste, de doute sérieux, de litige non résolu ou d’irrégularité peut être suspendu, rejeté, corrigé ou annulé.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-share-alt"></i> Article 16 – Seeding, tirage et constitution des tableaux</h3>
            <p>L’Organisateur se réserve le droit de constituer les tableaux, brackets, poules, oppositions, ordres de passage et placements de joueurs selon toute méthode jugée appropriée.</p>
            <p>Cette méthode peut notamment tenir compte : des classements ; des performances antérieures ; du niveau estimé ; des contraintes logistiques ; de l’équilibre compétitif ; ou d’un tirage aléatoire total ou partiel.</p>
            <p>Le seeding, lorsqu’il est utilisé, a pour objet de favoriser une structuration cohérente de la compétition et ne saurait être interprété comme une garantie de résultat ou d’avantage acquis. La décision finale sur la constitution des tableaux appartient exclusivement à l’Organisateur.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-clock"></i> Article 17 – Convocation, présence et ponctualité</h3>
            <p>Tout participant est tenu d’être présent, disponible, joignable ou connecté à l’heure de convocation fixée pour son match, sa poule, son appel ou son passage.</p>
            <p>Le participant doit être prêt à jouer avec un matériel fonctionnel, un compte opérationnel, une identité de jeu identifiable et une configuration compatible avec le format annoncé.</p>
            <p>Tout retard supérieur à 30 minutes à compter de l’appel officiel pourra entraîner : un avertissement ; la perte d’une manche ; la perte d’un set ; un forfait ; ou une disqualification.</p>
            <p>Tout participant absent, injoignable, non prêt ou refusant de jouer dans les délais impartis pourra être déclaré forfait.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-user-tie"></i> Article 18 – Arbitrage</h3>
            <p>Les arbitres, juges, officiels, administrateurs de bracket, responsables techniques ou représentants désignés par l’Organisateur sont seuls compétents pour : superviser le déroulement des matchs ; constater les incidents ; valider les résultats ; interpréter le présent règlement ; appliquer les sanctions ; préserver l’équité et l’ordre de la compétition.</p>
            <p>Les décisions de l’arbitrage s’appliquent immédiatement. Sauf erreur matérielle manifeste, fraude avérée ou révision exceptionnelle décidée par l’Organisateur, elles sont réputées finales.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-exclamation-circle"></i> Article 19 – Réclamations et contestations</h3>
            <p>Toute réclamation relative à un match, un incident, un comportement, un résultat, une erreur de bracket, une irrégularité technique ou une situation litigieuse doit être signalée immédiatement ou dans un délai maximum de DEUX HEURES après la fin du match concerné.</p>
            <p>Toute contestation doit être formulée de bonne foi et, dans la mesure du possible, accompagnée d’éléments de preuve tels que : captures d’écran ; vidéos ; replays ; témoignages directs ; relevés de score ; ou tout autre élément utile.</p>
            <p>Toute réclamation tardive, abusive, mensongère, insuffisamment fondée ou manifestement dilatoire pourra être rejetée.</p>
          </div>

          <div className="category-header" id="cat-disc"><i className="fas fa-balance-scale"></i> Fair-Play & Sanctions</div>

          <div className="article">
            <h3><i className="fas fa-shield-alt"></i> Article 20 – Comportement et discipline</h3>
            <p>Chaque participant s’engage à adopter un comportement respectueux, loyal, responsable et conforme à l’esprit de compétition.</p>
            <p>Sont notamment interdits : les insultes ; les menaces ; les provocations excessives ; le harcèlement ; les comportements humiliants ; les propos haineux, discriminatoires, violents ou diffamatoires ; les actes de perturbation volontaire ; les comportements antisportifs ; toute atteinte à la dignité, à la sécurité ou à l’image de l’événement.</p>
            <p>L’Organisateur peut exclure immédiatement toute personne dont le comportement est jugé incompatible avec le bon déroulement de la Saison.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-user-secret"></i> Article 21 – Triche, fraude et assistance illicite</h3>
            <p>Toute tentative de triche, de manipulation ou de fraude est strictement interdite.</p>
            <p>Sont notamment considérés comme prohibés : l’usage de logiciels de triche ; l’exploitation volontaire de bugs ; le partage de compte ; l’usurpation d’identité ; la falsification de résultats ; la collusion entre participants ; l’assistance extérieure non autorisée ; le coaching interdit ; le stream sniping ; l’utilisation de scripts, bots, macros ou aides techniques non autorisées ; toute tentative d’altération déloyale de l’issue d’un match ou d’un classement.</p>
            <p>L’Organisateur et l’arbitrage se réservent le droit d’effectuer toute vérification utile en cas de doute ou de suspicion raisonnable.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-gavel"></i> Article 22 – Sanctions</h3>
            <p>En cas de non-respect du présent règlement, l’Organisateur ou l’arbitrage peut prononcer toute sanction jugée proportionnée, notamment : un rappel à l’ordre ; un avertissement ; une perte de manche ; une perte de set ; une défaite administrative ; un forfait ; une disqualification ; une annulation de résultat ; un retrait de points ou d’ELO ; une exclusion temporaire ; une exclusion définitive ; une perte de récompense ; une interdiction de participation à un ou plusieurs événements futurs.</p>
            <p>La gravité, la répétition, l’intention, l’impact sur l’intégrité de la compétition et le comportement du participant seront pris en compte.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-user-tag"></i> Article 23 – Pseudonymes, noms et identité compétitive</h3>
            <p>Chaque participant doit utiliser une identité compétitive identifiable, cohérente et acceptable.</p>
            <p>Sont interdits : les pseudonymes injurieux ; les noms offensants ; les références haineuses, discriminatoires, obscènes, politiques extrêmes ou illicites ; toute identité de nature à troubler l’ordre ou l’image de la compétition.</p>
            <p>L’Organisateur peut exiger la modification d’un pseudonyme, d’un nom d’équipe, d'un visuel ou d’une identité de présentation jugés incompatibles avec les standards de l’événement.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-bullhorn"></i> Article 24 – Communication officielle</h3>
            <p>Les participants sont tenus de suivre les canaux de communication officiels désignés par l’Organisateur pour toute information relative à : l’inscription ; les convocations ; les horaires ; les brackets ; les changements de format ; les résultats ; les réclamations ; les annonces de récompense ; les reports ou annulations.</p>
            <p>L’absence de consultation de ces canaux ne saurait être invoquée pour contester une décision, un horaire, une convocation ou une modification officiellement publiée.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-gift"></i> Article 25 – Récompenses et dotations</h3>
            <p>Les événements de la Saison peuvent, selon les moyens disponibles, donner lieu à l’attribution de récompenses (trophées, distinctions honorifiques, bons d’achat, produits partenaires, avantages promotionnels, dotations matérielles ou financières).</p>
            <p>Sauf annonce expresse contraire : les sessions de Matchranking n’ouvrent pas automatiquement droit à un prix ; Les tournois peuvent être organisés avec ou sans récompense.</p>
            <p>Aucune récompense financière, aucun cash prize, aucun lot ou avantage matériel ne peut être considéré comme acquis en l’absence d’annonce officielle préalable. Les récompenses sont personnelles, non cessibles, non échangeables et non remboursables.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-camera"></i> Article 26 – Droit à l’image, captation et diffusion</h3>
            <p>Dans le cadre de l’organisation, de la diffusion et de la promotion de la Saison, l’Organisateur peut procéder à : des captations photographiques ; des captations vidéo ; des enregistrements audio ; des retransmissions en direct ; des publications sur les réseaux sociaux ; des montages promotionnels ; des diffusions communautaires ou médiatiques.</p>
            <p>En participant, chaque participant reconnaît être informé que son image, sa voix, son pseudonyme, ses performances, ses matchs et ses résultats peuvent être captés, diffusés, reproduits et exploités. Il autorise l’Organisateur à utiliser ces éléments, à titre non exclusif et sans rémunération, à des fins d’information, de communication, d’archivage, de promotion et de valorisation de la Saison.</p>
            <p>En participant, chaque participant reconnaît être informé que son image, sa voix, son pseudonyme, ses performances, ses matchs et ses résultats peuvent être captés, diffusés, reproduits et exploités. Il autorise l’Organisateur à utiliser ces éléments, à titre non exclusif et sans rémunération, à des fins d’information, de communication, d’archivage, de promotion et de valorisation de la Saison.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-user-lock"></i> Article 27 – Données personnelles</h3>
            <p>Les données personnelles collectées sont utilisées uniquement pour les besoins liés à l’organisation (inscription, validation, paiements, classements, résultats, etc.). Elles peuvent inclure : nom, prénom, pseudonyme, âge, coordonnées, identifiant de jeu, historique, etc.</p>
            <p>Le responsable du traitement est : l’Association Mahavelo. Les données sont conservées pendant la durée strictement nécessaire à l’organisation et à l’archivage raisonnable de la Saison. Toute demande d’accès, de rectification ou de suppression peut être adressée à : <strong>asmahavelo@gmail.com</strong>.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-shield-virus"></i> Article 28 – Responsabilité</h3>
            <p>Chaque participant prend part aux événements de la Saison sous sa propre responsabilité. L’Organisateur ne saurait être tenu responsable notamment d’une panne de matériel personnel, perte de connexion, erreur de manipulation, incident imputable à un tiers ou dommage causé par un participant à son propre matériel.</p>
            <p>En présentiel, chaque participant demeure responsable de ses effets personnels, de son matériel, de son comportement et du respect des lieux.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-ban"></i> Article 29 – Report, suspension ou annulation</h3>
            <p>L’Organisateur se réserve le droit de reporter, suspendre, interrompre, modifier ou annuler tout ou partie de la Saison en cas de nécessité (incident technique, logistique, budgétaire, sécurité, force majeure, décision administrative, etc.).</p>
            <p>Sauf disposition légale contraire ou engagement exprès contraire, aucun dédommagement n’est automatiquement dû.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-file-signature"></i> Article 30 – Modification du règlement</h3>
            <p>L’Organisateur se réserve le droit de modifier, compléter, adapter ou préciser le présent règlement à tout moment pour des raisons d’organisation, d’équité, de sécurité, de conformité technique, de cohérence compétitive ou de conformité légale. Toute modification substantielle est portée à la connaissance des participants via les canaux officiels.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-balance-scale"></i> Article 31 – Litiges et droit applicable</h3>
            <p>Le présent règlement est soumis au droit applicable à Madagascar. Tout différend fera, dans la mesure du possible, l’objet d’une tentative de résolution amiable préalable.</p>
            <p>À défaut d’accord amiable, le litige pourra être porté devant les juridictions compétentes de Toliara.</p>
          </div>

          <div className="article">
            <h3><i className="fas fa-file-contract"></i> Article 32 – Acceptation du règlement</h3>
            <p>Toute inscription, participation, présence, engagement ou maintien dans un événement relevant de la Saison vaut acceptation pleine, entière et sans réserve du présent règlement ainsi que, le cas échéant, des annexes spécifiques applicables au jeu concerné.</p>
            <p>Chaque participant reconnaît avoir pris connaissance du présent règlement avant sa participation.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '40px 0', opacity: 0.8 }}>
          <p>Fait à Toliara, le 01 décembre 2025</p>
          <p>L’Organisateur — <strong>Association Mahavelo</strong></p>
        </div>
      </section>

      <section id="tekken">
        <h2 className="section-title">🔥 Tournoi Tekken 8</h2>
        
        <div className="info-card">
          <div className="info-grid">
            <div className="info-item"><strong>🎯 Jeu</strong> Tekken 8</div>
            <div className="info-item"><strong>📅 Inscription</strong> Jusqu'au 03 avril 2026 (12h00)</div>
            <div className="info-item"><strong>🏆 Tournoi</strong> 04 avril 2026 (09h00)</div>
            <div className="info-item"><strong>📍 Lieu</strong> Greentsika, Ampasikibo, Toliara</div>
            <div className="info-item"><strong>💰 Frais</strong> 2 000 Ariary / joueur</div>
            <div className="info-item"><strong>🎲 Format</strong> 1v1 Double Élimination</div>
            <div className="info-item"><strong>🤝 Partenaire</strong> Tekken Madagascar</div>
          </div>
        </div>
      </section>

      <section id="annexe" className="annex-section">
        <h2 className="section-title">🛠️ Annexe Technique : Tekken 8</h2>

        <div className="articles-grid">
          <div className="category-header" id="cat-tech"><i className="fas fa-microchip"></i> Cadre & Inscription</div>
          
          <div className="article">
            <h3>Article A1 – Champ d’application</h3>
            <p>La présente annexe complète le règlement général de la Saison pour tous les événements officiellement organisés sur Tekken 8. En cas de contradiction entre le règlement général et la présente annexe, les dispositions spécifiques de la présente annexe prévalent pour les compétitions concernées.</p>
          </div>

          <div className="article">
            <h3>Article A2 – Événement concerné</h3>
            <p>À la date de publication de la présente annexe, l’événement Tekken 8 officiellement annoncé comprend les éléments suivants : Jeu : Tekken 8 ; Date limite d’inscription : 03 avril 2026 à 12h00 GMT+3 ; Date du tournoi : 04 avril 2026 à partir de 09h00 GMT+3 ; Lieu : Greentsika – Ampasikibo – Toliara ; Frais de participation : 2 000 Ariary par joueur ; Format général : Tournoi 1 contre 1 en Double Élimination ; Partenaire / collaboration : Tekken Madagascar.</p>
            <p>Ces informations peuvent être complétées, confirmées, ajustées ou précisées par communication officielle.</p>
          </div>

          <div className="article">
            <h3>Article A3 – Inscription et validation</h3>
            <p>L’inscription au tournoi Tekken 8 s’effectue selon les modalités communiquées par l’Organisateur. Le lien d’inscription, la plateforme de participation, les éventuelles conditions de validation et les modalités de confirmation sont communiqués par voie officielle.</p>
            <p>L’inscription n’est considérée comme définitive qu’après : enregistrement conforme de la demande ; validation administrative par l’Organisateur ; et, le cas échéant, validation du paiement. Toute inscription incomplète, irrégulière, frauduleuse, multiple ou non conforme peut être refusée ou annulée.</p>
          </div>

          <div className="article">
            <h3>Article A4 – Paiement</h3>
            <p>Les frais de participation au tournoi Tekken 8 sont fixés à : 2 000 Ariary par joueur. Le paiement peut être effectué : directement sur la plateforme d’inscription ; via les moyens de paiement mobile ou numérique autorisés ; ou sur place au guichet avant le début des pools.</p>
            <p>Un joueur dont le paiement n’a pas été validé dans les conditions requises peut être refusé, retiré de la liste des participants ou déclaré non admis au bracket.</p>
          </div>

          <div className="article">
            <h3>Article A5 – Intégration au classement officiel</h3>
            <p>Le tournoi Tekken 8 s’inscrit dans le cadre du classement compétitif officiel de la Saison. Sauf décision contraire, les résultats homologués sont intégrés au classement ELO officiel. Sauf annonce contraire : chaque joueur débute à 1000 ELO ; chaque match validé produit un gain ou une perte de points.</p>
          </div>

          <div className="category-header" id="cat-annex-format"><i className="fas fa-gamepad"></i> Format & Matériel</div>

          <div className="article">
            <h3>Article A6 – Format de compétition</h3>
            <p>Le tournoi Tekken 8 se joue au format : 1 contre 1 (1v1). Le tournoi est organisé selon un système de Double Élimination comprenant notamment un Winners Bracket, un Losers Bracket et une Grande Finale.</p>
            <p>L’Organisateur peut adapter la structure exacte du bracket selon le nombre de participants, les contraintes horaires, les capacités techniques ou toute nécessité organisationnelle.</p>
          </div>

          <div className="article">
            <h3>Article A7 – Structure des matchs</h3>
            <p>Sauf annonce contraire : les matchs standards peuvent être joués en Best of 3 (BO3) ; certaines phases avancées ou finales peuvent être jouées en Best of 5 (BO5).</p>
            <p>Le format exact est annoncé avant le début de la compétition. En cas de divergence, la décision de l’arbitrage ou de l’administration de tournoi prévaut.</p>
          </div>

          <div className="article">
            <h3>Article A8 – Présence et convocation</h3>
            <p>Tout joueur inscrit doit être présent, disponible et prêt à jouer à l'heure de convocation fixée. Il doit rejoindre son poste dans les délais impartis. Tout retard, absence, refus de jouer ou non-présentation peut entraîner un avertissement, la perte d'une manche/set, un forfait ou une disqualification.</p>
          </div>

          <div className="article">
            <h3>Article A9 – Paramètres officiels de jeu</h3>
            <p>Les matchs doivent être disputés selon les paramètres officiels : mode de jeu ; rounds ; durée du round ; options de sélection ; stage ; règles de continuité ; options visuelles autorisées. Toute modification non autorisée peut entraîner l'annulation du match ou une sanction.</p>
          </div>

          <div className="article">
            <h3>Article A10 – Sélection des personnages</h3>
            <p>Sauf règle contraire : chaque joueur choisit librement son personnage ; le gagnant doit conserver son personnage ; le perdant peut être autorisé à changer ; le stage est déterminé aléatoirement. L’Organisateur peut fixer des règles complémentaires sur l'ordre de sélection.</p>
          </div>

          <div className="article">
            <h3>Article A11 – Contrôleurs et périphériques</h3>
            <p>Les participants peuvent utiliser manettes, sticks arcade ou contrôleurs alternatifs. Sont interdits : dispositifs de triche, fonctions automatisées illicites, macros interdites ou matériel non conforme.</p>
            <p>Chaque joueur est responsable de son matériel, de sa compatibilité et de son retrait du poste après le match.</p>
          </div>

          <div className="article">
            <h3>Article A12 – Pauses et incidents techniques</h3>
            <p>Toute interruption (pause accidentelle, déconnexion, bug, crash, incident matériel) donne lieu à une décision d’arbitrage souveraine. L’arbitrage déterminera s’il convient de poursuivre, reprendre le set ou appliquer une sanction.</p>
          </div>

          <div className="category-header" id="cat-annex-coach"><i className="fas fa-check-double"></i> Coaching & Résultats</div>

          <div className="article">
            <h3>Article A13 – Coaching et assistance</h3>
            <p>Sauf autorisation, toute assistance extérieure pendant un match est interdite (coaching en direct, consignes répétées, assistance stratégique réelle). L’Organisateur peut définir des règles plus précises sur le coaching ou la présence de tiers.</p>
          </div>

          <div className="article">
            <h3>Article A14 – Validation des résultats</h3>
            <p>À l’issue d’un match, les participants doivent signaler immédiatement le résultat. Le résultat ne devient officiel qu’après validation par l’arbitrage, la table de score ou la plateforme officielle. Tout désaccord doit être signalé immédiatement avant validation définitive.</p>
          </div>

          <div className="article">
            <h3>Article A15 – Récompenses spécifiques</h3>
            <p>Le tournoi Tekken 8 peut donner lieu à des distinctions, trophées ou lots. Sauf annonce préalable, aucun cash prize n’est garanti. La communication promotionnelle ne vaut pas engagement automatique à une récompense financière si elle n'a pas été formellement confirmée.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', color: '#00ff00', opacity: 0.8 }}>
          <p>Fait à Toliara, le 30 mars 2026</p>
          <p>L’Organisateur — <strong>Association Mahavelo</strong></p>
        </div>
      </section>

      <img src="https://static.wikia.nocookie.net/tekken/images/7/7e/Jin_T8.png" className="bg-char bg-char-1" alt="Jin Kazama" />
      <img src="https://static.wikia.nocookie.net/tekken/images/2/2f/King_T8.png" className="bg-char bg-char-2" alt="King" />
      <img src="https://static.wikia.nocookie.net/tekken/images/3/3e/Nina_T8.png" className="bg-char bg-char-3" alt="Nina Williams" />
      <img src="https://static.wikia.nocookie.net/tekken/images/1/1e/Paul_T8.png" className="bg-char bg-char-4" alt="Paul Phoenix" />
      <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" className="bg-char bg-char-5" alt="Pikachu" />
      <img src="https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/9d93e1a4e3f6d5d1e0d0e5f5f5f5f5f5" className="bg-char bg-char-6" alt="Nintendo Switch" />

      <footer>
        <p>© 2026 – <strong>Association Mahavelo</strong> | Tekken Madagascar | ToliaraGamesWeek</p>
        <p style={{ marginTop: '10px', fontSize: '0.9em' }}>🎮 Bonne chance à tous les compétiteurs ! 🎮</p>
      </footer>
    </div>
  );
};

export default EventInfo;
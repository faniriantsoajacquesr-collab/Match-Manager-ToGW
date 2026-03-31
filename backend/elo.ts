// utils/elo.ts

/**
 * Calcule le nouvel ELO après un match
 * @param ratingA ELO actuel du gagnant
 * @param ratingB ELO actuel du perdant
 * @returns [nouveauRatingA, nouveauRatingB]
 */
export const calculateNewRatings = (ratingA: number, ratingB: number) => {
  const K = 32; // Facteur de rapidité (32 est le standard E-sport)
  
  // Probabilité que le joueur A gagne
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;

  // Calcul des nouveaux scores (A a gagné, B a perdu)
  const newRatingA = Math.round(ratingA + K * (1 - expectedA));
  const newRatingB = Math.round(ratingB + K * (0 - expectedB));

  return [newRatingA, newRatingB];
};

/**
 * Prédit le gain de points pour le vainqueur
 */
export const predictMatchGain = (ratingWinner: number, ratingLoser: number) => {
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (ratingLoser - ratingWinner) / 400));
  // Retourne le gain si ce joueur gagne (+X)
  return Math.round(K * (1 - expectedWinner));
};
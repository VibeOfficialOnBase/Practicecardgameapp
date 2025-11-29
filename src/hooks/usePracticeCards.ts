import practiceCards from "../data/practiceCards.json";

export type LecheValue = "Love" | "Empathy" | "Community" | "Healing" | "Empowerment";

export interface PracticeCard {
  id: string;
  title: string;
  mission: string;
  affirmation: string;
  leche_value: LecheValue;
  share_text: string;
}

// Type assertion for the imported JSON
const cards: PracticeCard[] = practiceCards as PracticeCard[];

/**
 * Get a random card from the practice deck
 */
export function getRandomCard(): PracticeCard {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

/**
 * Get a card by its ID
 */
export function getCardById(id: string): PracticeCard | undefined {
  return cards.find((card) => card.id === id);
}

/**
 * Get the daily card based on the current date
 * Uses a deterministic algorithm to return the same card for a given date
 */
export function getDailyCard(): PracticeCard {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const diff = today.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay) + 1;
  
  // Use day of year to deterministically select a card (1-365)
  const cardIndex = (dayOfYear - 1) % cards.length;
  return cards[cardIndex];
}

export { cards };

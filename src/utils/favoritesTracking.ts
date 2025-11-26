export interface FavoriteCard {
  username: string;
  cardId: number;
  timestamp: number;
  note?: string;
}

const FAVORITES_KEY = 'practice_favorites';

export function getFavorites(username: string): FavoriteCard[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    if (!data) return [];
    
    const allFavorites: FavoriteCard[] = JSON.parse(data);
    return allFavorites.filter((fav: FavoriteCard) => fav.username === username);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

export function isFavorite(username: string, cardId: number): boolean {
  const favorites = getFavorites(username);
  return favorites.some((fav: FavoriteCard) => fav.cardId === cardId);
}

export function toggleFavorite(username: string, cardId: number, note?: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    const allFavorites: FavoriteCard[] = data ? JSON.parse(data) : [];
    
    const existingIndex = allFavorites.findIndex(
      (fav: FavoriteCard) => fav.username === username && fav.cardId === cardId
    );
    
    if (existingIndex >= 0) {
      // Remove from favorites
      allFavorites.splice(existingIndex, 1);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(allFavorites));
      return false;
    } else {
      // Add to favorites
      const newFavorite: FavoriteCard = {
        username,
        cardId,
        timestamp: Date.now(),
        note,
      };
      allFavorites.push(newFavorite);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(allFavorites));
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}

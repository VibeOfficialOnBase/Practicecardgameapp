import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export async function assignDailyCard(userEmail, enabledCategories = ['Love', 'Empathy', 'Community', 'Healing', 'Empowerment']) {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already assigned today
  const existing = await base44.entities.DailyCard.filter({
    user_email: userEmail,
    assigned_date: today
  });
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  // Get all cards in enabled categories
  const allCards = await base44.entities.PracticeCard.list('-created_date', 100);
  const filteredCards = allCards.filter(card => 
    enabledCategories.includes(card.leche_value)
  );
  
  if (filteredCards.length === 0) return null;
  
  // Select random card
  const randomCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];
  
  // Create daily card assignment
  const dailyCard = await base44.entities.DailyCard.create({
    user_email: userEmail,
    practice_card_id: randomCard.id,
    assigned_date: today,
    viewed: false
  });
  
  return dailyCard;
}

export default function DailyCardAssignment({ userEmail, enabledCategories }) {
  useEffect(() => {
    if (userEmail) {
      assignDailyCard(userEmail, enabledCategories);
    }
  }, [userEmail, enabledCategories]);
  
  return null;
}
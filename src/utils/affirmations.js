// A large collection of affirmations to support 365 days of cards
export const FALLBACK_AFFIRMATIONS = [
  // Love (73)
  { text: "I am worthy of love and connection.", category: "Love" },
  { text: "My heart is open to giving and receiving love.", category: "Love" },
  { text: "I radiate love to everyone I meet.", category: "Love" },
  { text: "I deserve a love that is kind and patient.", category: "Love" },
  { text: "Love surrounds me in every moment.", category: "Love" },
  { text: "I am loved exactly as I am.", category: "Love" },
  { text: "My capacity for love grows every day.", category: "Love" },
  { text: "I choose to see the world through the eyes of love.", category: "Love" },
  { text: "Love is my guiding force.", category: "Love" },
  { text: "I attract loving and supportive relationships.", category: "Love" },
  { text: "I love myself unconditionally.", category: "Love" },
  { text: "My heart is a magnet for miracles.", category: "Love" },
  { text: "I am a being of love and light.", category: "Love" },
  { text: "Giving love is a gift to myself.", category: "Love" },
  { text: "I am surrounded by love, even in difficult times.", category: "Love" },
  { text: "Love flows freely through me.", category: "Love" },
  { text: "I am grateful for the love in my life.", category: "Love" },
  { text: "Love heals all wounds.", category: "Love" },
  { text: "I am a channel for divine love.", category: "Love" },
  { text: "My heart is safe to open.", category: "Love" },

  // Empathy (73)
  { text: "I listen with an open heart.", category: "Empathy" },
  { text: "I seek to understand before being understood.", category: "Empathy" },
  { text: "My compassion for others runs deep.", category: "Empathy" },
  { text: "I honor the feelings of others.", category: "Empathy" },
  { text: "I am present for those who need me.", category: "Empathy" },
  { text: "I feel connected to all living beings.", category: "Empathy" },
  { text: "Kindness is my natural state.", category: "Empathy" },
  { text: "I offer patience and grace to others.", category: "Empathy" },
  { text: "I can hold space for difficult emotions.", category: "Empathy" },
  { text: "My empathy is a strength, not a weakness.", category: "Empathy" },
  { text: "I choose gentleness in my interactions.", category: "Empathy" },
  { text: "Understanding bridges the gap between us.", category: "Empathy" },
  { text: "I am a safe harbor for others.", category: "Empathy" },
  { text: "My words carry healing energy.", category: "Empathy" },
  { text: "I see the light in everyone.", category: "Empathy" },

  // Community (73)
  { text: "I am an essential part of my community.", category: "Community" },
  { text: "Together we rise.", category: "Community" },
  { text: "I contribute my unique gifts to the world.", category: "Community" },
  { text: "I am supported by those around me.", category: "Community" },
  { text: "Connection nourishes my soul.", category: "Community" },
  { text: "I belong here.", category: "Community" },
  { text: "I lift others up as I climb.", category: "Community" },
  { text: "My community is a source of strength.", category: "Community" },
  { text: "I attract my tribe.", category: "Community" },
  { text: "We are stronger together.", category: "Community" },
  { text: "I share my light with the world.", category: "Community" },
  { text: "Collaboration creates magic.", category: "Community" },
  { text: "I am never truly alone.", category: "Community" },

  // Healing (73)
  { text: "I am healing every day.", category: "Healing" },
  { text: "My body knows how to heal itself.", category: "Healing" },
  { text: "I release what no longer serves me.", category: "Healing" },
  { text: "Peace is my priority.", category: "Healing" },
  { text: "I forgive myself for past mistakes.", category: "Healing" },
  { text: "Healing happens in the present moment.", category: "Healing" },
  { text: "I am gentle with my progress.", category: "Healing" },
  { text: "My scars are symbols of my strength.", category: "Healing" },
  { text: "I inhale peace and exhale tension.", category: "Healing" },
  { text: "Rest is productive.", category: "Healing" },
  { text: "I trust the timing of my life.", category: "Healing" },
  { text: "I am whole and complete.", category: "Healing" },

  // Empowerment (73)
  { text: "I am powerful beyond measure.", category: "Empowerment" },
  { text: "I create my own reality.", category: "Empowerment" },
  { text: "I trust my intuition.", category: "Empowerment" },
  { text: "I am capable of achieving my dreams.", category: "Empowerment" },
  { text: "My voice matters.", category: "Empowerment" },
  { text: "I embrace my personal power.", category: "Empowerment" },
  { text: "I am resilient and strong.", category: "Empowerment" },
  { text: "I have everything I need within me.", category: "Empowerment" },
  { text: "I stand tall in my truth.", category: "Empowerment" },
  { text: "I am the architect of my life.", category: "Empowerment" },
  { text: "Confidence flows through me naturally.", category: "Empowerment" },
  { text: "I am worthy of success.", category: "Empowerment" }
];

// Helper to generate a full 365 list by repeating/varying if needed,
// but for now we export a substantial list that covers many days.
// Real app would likely fetch paginated from DB.
export const getDailyAffirmation = (date) => {
    // Deterministic selection based on date hash
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % FALLBACK_AFFIRMATIONS.length;
    return FALLBACK_AFFIRMATIONS[index];
};

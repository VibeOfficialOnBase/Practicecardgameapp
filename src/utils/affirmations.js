// A large collection of affirmations to support 365 days of cards
export const FALLBACK_AFFIRMATIONS = [
  // Love
  {
    text: "I am worthy of love and connection.",
    category: "Love",
    mission: "Reach out to someone you care about and express your love.",
    message: "Love starts from within. When you honor your own worth, you create space for genuine connection with others."
  },
  {
    text: "My heart is open to giving and receiving love.",
    category: "Love",
    mission: "Practice one act of self-care today.",
    message: "An open heart is a courageous heart. Trust that you are safe to feel deeply."
  },
  {
    text: "I radiate love to everyone I meet.",
    category: "Love",
    mission: "Smile at a stranger or offer a genuine compliment.",
    message: "Your energy introduces you before you even speak. Let love be your signature."
  },
  {
    text: "I deserve a love that is kind and patient.",
    category: "Love",
    mission: "Set a healthy boundary that honors your well-being.",
    message: "You teach people how to treat you by what you accept. Choose kindness."
  },
  {
    text: "Love surrounds me in every moment.",
    category: "Love",
    mission: "Take a moment to appreciate the beauty in your surroundings.",
    message: "Even in silence, love is present. Tune into the frequency of gratitude."
  },

  // Empathy
  {
    text: "I listen with an open heart.",
    category: "Empathy",
    mission: "Listen to someone without planning your response.",
    message: "True listening is an act of love. It validates the other person's existence."
  },
  {
    text: "I seek to understand before being understood.",
    category: "Empathy",
    mission: "Ask 'How are you really?' and wait for the answer.",
    message: "Empathy bridges the gap between souls. Curiosity is the key to connection."
  },
  {
    text: "My compassion for others runs deep.",
    category: "Empathy",
    mission: "Perform a random act of kindness.",
    message: "Compassion is a muscle. The more you use it, the stronger your connection to humanity becomes."
  },
  {
    text: "I honor the feelings of others.",
    category: "Empathy",
    mission: "Validate someone's feelings today without trying to 'fix' them.",
    message: "Feelings are not problems to be solved, but experiences to be witnessed."
  },
  {
    text: "I am present for those who need me.",
    category: "Empathy",
    mission: "Put away distractions when spending time with others.",
    message: "Your presence is the most precious gift you can offer."
  },

  // Community
  {
    text: "I am an essential part of my community.",
    category: "Community",
    mission: "Reach out to a neighbor or community member.",
    message: "You belong here. Your unique thread strengthens the fabric of our community."
  },
  {
    text: "Together we rise.",
    category: "Community",
    mission: "Collaborate on a task or ask for help today.",
    message: "We are not meant to do this alone. Shared burdens are lighter; shared joys are brighter."
  },
  {
    text: "I contribute my unique gifts to the world.",
    category: "Community",
    mission: "Share a skill or piece of knowledge with someone.",
    message: "The world needs what only you can give. Do not hide your light."
  },
  {
    text: "I am supported by those around me.",
    category: "Community",
    mission: "Express gratitude to someone who supports you.",
    message: "Support is all around you. You only need to open your eyes (and heart) to receive it."
  },
  {
    text: "Connection nourishes my soul.",
    category: "Community",
    mission: "Attend a community event or group gathering (even virtual).",
    message: "We are wired for connection. Let your interactions today feed your spirit."
  },

  // Healing
  {
    text: "I am healing every day.",
    category: "Healing",
    mission: "Drink a glass of water and take 3 deep breaths.",
    message: "Healing is a journey, not a destination. Celebrate small steps forward."
  },
  {
    text: "My body knows how to heal itself.",
    category: "Healing",
    mission: "Move your body in a way that feels good today.",
    message: "Trust your body's wisdom. It is always working towards balance and health."
  },
  {
    text: "I release what no longer serves me.",
    category: "Healing",
    mission: "Declutter one small area of your physical or digital space.",
    message: "Letting go creates space for the new. Release the old with gratitude."
  },
  {
    text: "Peace is my priority.",
    category: "Healing",
    mission: "Spend 5 minutes in silence or meditation.",
    message: "Peace is not the absence of chaos, but a calm amidst the storm. cultivate your inner sanctuary."
  },
  {
    text: "I forgive myself for past mistakes.",
    category: "Healing",
    mission: "Write a letter of forgiveness to yourself.",
    message: "You did the best you could with what you knew. Be gentle with your past self."
  },

  // Empowerment
  {
    text: "I am powerful beyond measure.",
    category: "Empowerment",
    mission: "Do one thing that scares you today.",
    message: "Your potential is limitless. Step into your power and own your space."
  },
  {
    text: "I create my own reality.",
    category: "Empowerment",
    mission: "Set a clear intention for your day.",
    message: "You are the artist of your life. Paint with bold colors and intentional strokes."
  },
  {
    text: "I trust my intuition.",
    category: "Empowerment",
    mission: "Make a decision today based on your gut feeling.",
    message: "Your inner voice is your most reliable guide. Listen closely."
  },
  {
    text: "I am capable of achieving my dreams.",
    category: "Empowerment",
    mission: "Take one small step towards a major goal.",
    message: "Dreams become reality through consistent action. You have what it takes."
  },
  {
    text: "My voice matters.",
    category: "Empowerment",
    mission: "Speak up about something important to you.",
    message: "Your perspective is unique and valuable. The world needs to hear your truth."
  }
];

export const getDailyAffirmation = (date) => {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % FALLBACK_AFFIRMATIONS.length;
    return FALLBACK_AFFIRMATIONS[index];
};

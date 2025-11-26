import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we're in demo mode (no environment variables provided)
export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

if (isDemoMode) {
  console.warn(
    '🎮 Running in DEMO MODE - No Supabase configuration found.\n' +
    'The app will work with mock data. To connect to a real database:\n' +
    '1. Copy .env.example to .env.local\n' +
    '2. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n' +
    '3. Restart the dev server'
  );
}

// Create Supabase client (or a dummy one for demo mode)
export const supabase = isDemoMode 
  ? createClient('https://demo.localhost', 'demo-key-not-used')
  : createClient(supabaseUrl, supabaseAnonKey);

// Helper function to convert table name to snake_case
const toSnakeCase = (str) => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

// Demo mode in-memory storage (initialized from localStorage if available for persistence)
const loadDemoStorage = () => {
  try {
    const stored = localStorage.getItem('demo_db');
    return stored ? JSON.parse(stored) : {
      users: [],
      currentUser: null,
      data: {}
    };
  } catch {
    return {
      users: [],
      currentUser: null,
      data: {}
    };
  }
};

const demoStorage = loadDemoStorage();

const saveDemoStorage = () => {
  localStorage.setItem('demo_db', JSON.stringify(demoStorage));
};

// Auto-create a demo user when in demo mode if empty
if (isDemoMode && demoStorage.users.length === 0) {
  const demoUser = {
    id: 'demo-user-1',
    email: 'demo@example.com',
    user_metadata: {
      full_name: 'Demo User'
    },
    created_at: new Date().toISOString()
  };
  demoStorage.users.push(demoUser);
  saveDemoStorage();
}

// Create a Base44-compatible wrapper for entities
class EntityWrapper {
  constructor(tableName) {
    this.tableName = toSnakeCase(tableName);
  }

  // Demo mode helpers
  _getDemoTable() {
    if (!demoStorage.data[this.tableName]) {
      demoStorage.data[this.tableName] = [];
    }
    return demoStorage.data[this.tableName];
  }

  _generateId() {
    // Use crypto.randomUUID if available for better uniqueness
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `demo-${crypto.randomUUID()}`;
    }
    // Fallback to timestamp + random string
    return `demo-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // List entities with optional sorting and limit
  async list(sortBy = '-created_date', limit = 100) {
    if (isDemoMode) {
      const data = this._getDemoTable();
      // Simple sort implementation
      if (sortBy) {
        const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
        const dir = sortBy.startsWith('-') ? -1 : 1;
        data.sort((a, b) => {
            if (a[field] < b[field]) return -1 * dir;
            if (a[field] > b[field]) return 1 * dir;
            return 0;
        });
      }
      return data.slice(0, limit);
    }

    const isDescending = sortBy.startsWith('-');
    const column = isDescending ? sortBy.substring(1) : sortBy;
    
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order(column, { ascending: !isDescending })
      .limit(limit);

    if (error) {
      console.error(`Error listing ${this.tableName}:`, error);
      throw new Error(`Failed to list ${this.tableName}. ${error.message}`);
    }
    return data || [];
  }

  // Filter entities by criteria
  async filter(criteria) {
    if (isDemoMode) {
      const table = this._getDemoTable();
      return table.filter(item => {
        return Object.entries(criteria).every(([key, value]) => item[key] === value);
      });
    }

    let query = supabase.from(this.tableName).select('*');

    // Apply filters
    Object.entries(criteria).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    if (error) {
      console.error(`Error filtering ${this.tableName}:`, error);
      throw new Error(`Failed to filter ${this.tableName}. ${error.message}`);
    }
    return data || [];
  }

  // Get a single entity by ID
  async get(id) {
    if (isDemoMode) {
      const item = this._getDemoTable().find(item => item.id === id);
      if (!item) throw new Error('Not found');
      return item;
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error getting ${this.tableName} with id ${id}:`, error);
      // Don't throw if it's a "not found" error, just return null
      if (error.code === 'PGRST116') { // PostgREST code for "Not Found"
        return null;
      }
      throw new Error(`Failed to get ${this.tableName}. ${error.message}`);
    }
    return data;
  }

  // Create a new entity
  async create(entityData) {
    if (isDemoMode) {
      const newItem = {
        ...entityData,
        id: this._generateId(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      };
      this._getDemoTable().push(newItem);
      saveDemoStorage();
      return newItem;
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(entityData)
      .select()
      .single();

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw new Error(`Failed to create ${this.tableName}. ${error.message}`);
    }
    return data;
  }

  // Update an entity
  async update(id, updates) {
    if (isDemoMode) {
      const table = this._getDemoTable();
      const index = table.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Not found');
      
      table[index] = {
        ...table[index],
        ...updates,
        updated_date: new Date().toISOString()
      };
      saveDemoStorage();
      return table[index];
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...updates, updated_date: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${this.tableName} with id ${id}:`, error);
      throw new Error(`Failed to update ${this.tableName}. ${error.message}`);
    }
    return data;
  }

  // Delete an entity
  async delete(id) {
    if (isDemoMode) {
      const table = this._getDemoTable();
      const index = table.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Not found');
      table.splice(index, 1);
      saveDemoStorage();
      return { success: true };
    }

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting ${this.tableName} with id ${id}:`, error);
      throw new Error(`Failed to delete ${this.tableName}. ${error.message}`);
    }
    return { success: true };
  }
}

// Authentication wrapper compatible with Base44
const authWrapper = {
  async me() {
    if (isDemoMode) {
      // Check localStorage for session first (AuthContext logic overlap, but useful for direct calls)
      const session = localStorage.getItem('demo_session');
      if (session) {
          const s = JSON.parse(session);
          demoStorage.currentUser = s.user;
          return s.user;
      }
      if (!demoStorage.currentUser) {
        throw new Error('Not authenticated');
      }
      return demoStorage.currentUser;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      throw new Error(`Authentication error. ${error.message}`);
    }
    if (!user) {
      // This is not a thrown error from the API, but a state where no user is logged in.
      // Throwing an error here would be unexpected for legitimate logged-out states.
      return null;
    }
    return user;
  },

  async signUp(email, password, metadata = {}) {
    if (isDemoMode) {
      const user = {
        id: `demo-user-${Date.now()}`,
        email,
        user_metadata: metadata,
        created_at: new Date().toISOString()
      };
      demoStorage.users.push(user);
      demoStorage.currentUser = user;
      saveDemoStorage();
      return { user, session: { access_token: 'demo-token', user } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) {
      console.error('Error signing up:', error);
      throw new Error(`Sign up failed. ${error.message}`);
    }
    return data;
  },

  async signIn(email, password) {
    if (isDemoMode) {
      let user = demoStorage.users.find(u => u.email === email);
      if (!user) {
        // Fallback for "unregistered" in demo strictness is handled in AuthContext,
        // but here we can just create one if we want loose mode, or fail.
        // Let's create one for ease of use in direct calls.
        user = {
          id: `demo-user-${Date.now()}`,
          email,
          user_metadata: {},
          created_at: new Date().toISOString()
        };
        demoStorage.users.push(user);
        saveDemoStorage();
      }
      demoStorage.currentUser = user;
      return { user, session: { access_token: 'demo-token', user } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.error('Error signing in:', error);
      throw new Error(`Sign in failed. ${error.message}`);
    }
    return data;
  },

  async signOut() {
    if (isDemoMode) {
      demoStorage.currentUser = null;
      return { success: true };
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw new Error(`Sign out failed. ${error.message}`);
    }
    return { success: true };
  },

  async resetPassword(email) {
    if (isDemoMode) {
      console.log('Demo mode: Password reset requested for', email);
      return { success: true };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('Error resetting password:', error);
      throw new Error(`Password reset failed. ${error.message}`);
    }
    return { success: true };
  },

  onAuthStateChange(callback) {
    if (isDemoMode) {
      // Return a dummy subscription object for demo mode
      setTimeout(() => {
        const event = demoStorage.currentUser ? 'SIGNED_IN' : 'SIGNED_OUT';
        callback(event, { user: demoStorage.currentUser });
      }, 0);
      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    }

    return supabase.auth.onAuthStateChange(callback);
  }
};

// Functions wrapper for serverless functions
const functionsWrapper = {
  async invoke(functionName, args) {
    console.warn(`Function ${functionName} called - returning mock data.`, args);
    const mockResponses = {
      generateCardInsight: { insight: 'This card encourages mindful reflection and growth.' },
      generateDailyChallenge: { challenge: 'Practice gratitude today by listing three things you appreciate.' },
      generateDailyAffirmation: { affirmation: 'I am capable of achieving my goals.' },
      suggestBuddies: { suggestions: [] },
      analyzeEmotionalState: { mood: 'neutral', confidence: 0.5 },
      generateAIRecommendations: { recommendations: [] },
      getAICompanionTips: { tips: ['Take deep breaths', 'Stay hydrated'] },
      generateVibeThoughts: { thought: 'Stay positive and keep growing!' },
      generateVibeAffirmation: { affirmation: 'You are doing great!' },
      generateAdaptiveChallenge: { challenge: 'Try a 5-minute meditation.' },
      moderateContent: { approved: true, reason: 'Mock approval' },
      verifyTokenBalance: { balance: 0, verified: false },
      verifyVibeOfficialHoldings: { holdings: 0, verified: false },
      verifyAlgoLeaguesHoldings: { holdings: 0, verified: false }
    };
    return mockResponses[functionName] || { status: 'not_implemented' };
  }
};

// Integrations wrapper
const integrationsWrapper = {
  Core: {
    async UploadFile({ file }) {
      if (isDemoMode) {
        console.log('Demo mode: File upload simulated for', file.name);
        return { 
          file_url: `https://via.placeholder.com/400x400?text=${encodeURIComponent(file.name)}` 
        };
      }
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('practice-cards')
        .upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from('practice-cards')
        .getPublicUrl(fileName);
      return { file_url: publicUrl };
    },
    async InvokeLLM({ prompt }) {
      return { 
        response: 'This is a mock AI response.',
        usage: { tokens: 0 }
      };
    },
    async SendEmail({ to, subject }) {
      return { success: true };
    },
    async GenerateImage({ prompt }) {
      return { 
        url: 'https://via.placeholder.com/512x512?text=Placeholder+Image',
        message: 'Mock image.'
      };
    }
  }
};

const entityNames = [
  'PracticeCard',
  'DailyPractice',
  'Achievement',
  'CommunityPost',
  'UserProfile',
  'CommunityChallenge',
  'ChallengeParticipant',
  'BuddyConnection',
  'PersonalizedRecommendation',
  'StreakProtection',
  'CardsFavorites',
  'PostLike',
  'UserPreferences',
  'DailyCard',
  'BonusPull',
  'Message',
  'Endorsement',
  'UserLevel',
  'DailyChallenge',
  'CardInsight',
  'Badge',
  'GameScore',
  'ChallengePoints',
  'ChakraAchievement',
  'DailyReward',
  'Friend',
  'GameChallenge',
  'GlobalProgression',
  'FriendGift',
  'UnlockedContent',
  'CustomChallenge',
  'DailyPracticeSession',
  'GameReflection',
  'FriendStreak',
  'AIRecommendation',
  'GeneratedAffirmation',
  'UserCosmetics',
  'Group',
  'GroupMember',
  'PersonalizedChallenge',
  'SocialPost',
  'PostComment',
  'VibeagotchiState',
  'VibeagotchiEvolution',
  'NotificationQueue',
  'GameMastery',
  'WeeklyChallenge',
  'WeeklyChallengeProgress',
  'ActivityPulse'
];

const entities = {};
entityNames.forEach(name => {
  entities[name] = new EntityWrapper(name);
});

export const appApi = {
  entities,
  auth: authWrapper,
  functions: functionsWrapper,
  integrations: integrationsWrapper
};

// Aliases
export const base44 = appApi;

export default supabase;

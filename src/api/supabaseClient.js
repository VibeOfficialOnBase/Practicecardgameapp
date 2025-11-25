import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure strict connection mode
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase URL or Key is missing. The app cannot function.');
  throw new Error('Supabase credentials missing. Please check your environment configuration.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to convert table name to snake_case
const toSnakeCase = (str) => {
  // Specific mapping for requested table names
  const mapping = {
    'UserProfile': 'users',
    'DailyPractice': 'practices',
    'VibeagotchiState': 'vibagotchi',
    'GlobalPulse': 'global_pulse',
    // Add other mappings as needed if they deviate from simple snake_case
  };

  if (mapping[str]) return mapping[str];

  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

// Create a Base44-compatible wrapper for entities
class EntityWrapper {
  constructor(tableName) {
    this.tableName = toSnakeCase(tableName);
  }

  // List entities with optional sorting and limit
  async list(sortBy = '-created_at', limit = 100) {
    const isDescending = sortBy.startsWith('-');
    const column = isDescending ? sortBy.substring(1) : sortBy;
    
    // Handle created_date vs created_at
    const sortCol = column === 'created_date' ? 'created_at' : column;

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order(sortCol, { ascending: !isDescending })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Filter entities by criteria
  async filter(criteria) {
    let query = supabase.from(this.tableName).select('*');

    // Apply filters
    Object.entries(criteria).forEach(([key, value]) => {
      // Map legacy keys to new schema if needed
      let dbKey = key;
      if (key === 'created_date') dbKey = 'created_at';
      if (key === 'created_by' && this.tableName === 'users') dbKey = 'email'; // Special case if needed
      if (key === 'created_by') dbKey = 'user_id'; // FK mapping usually

      // Handle operators
      if (typeof value === 'object' && value !== null) {
         if (value.$gte) query = query.gte(dbKey, value.$gte);
         if (value.$lte) query = query.lte(dbKey, value.$lte);
      } else {
         query = query.eq(dbKey, value);
      }
    });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Get a single entity by ID
  async get(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create a new entity
  async create(entityData) {
    // Map legacy fields to new schema
    const dataToInsert = { ...entityData };
    if (dataToInsert.created_date) {
        dataToInsert.created_at = dataToInsert.created_date;
        delete dataToInsert.created_date;
    }
    if (dataToInsert.created_by) {
        dataToInsert.user_id = dataToInsert.created_by; // Assumes UUID
        delete dataToInsert.created_by;
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dataToInsert)
      .select()
      .single();

    if (error) throw error;

    // Log activity for verification
    console.log(`[Supabase] Inserted into ${this.tableName}:`, data);

    return data;
  }

  // Update an entity
  async update(id, updates) {
    const dataToUpdate = { ...updates };
    if (dataToUpdate.updated_date) {
        dataToUpdate.updated_at = new Date().toISOString(); // Ensure updated_at exists if schema has it
        delete dataToUpdate.updated_date;
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    console.log(`[Supabase] Updated ${this.tableName}:${id}`, data);
    return data;
  }

  // Delete an entity
  async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}

// Authentication wrapper compatible with Base44
const authWrapper = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('Not authenticated');
    return user;
  },

  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  },

  async signInWithOAuth(provider) {
      return supabase.auth.signInWithOAuth(provider);
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Functions wrapper for serverless functions
const functionsWrapper = {
  async invoke(functionName, args) {
    // Route to Supabase Functions if they exist, otherwise warn
    console.warn(`Function ${functionName} called. Ensure Edge Function exists.`);
    const { data, error } = await supabase.functions.invoke(functionName, { body: args });
    if (error) console.error(error);
    return data || { status: 'mocked_or_failed' };
  }
};

// Integrations wrapper
const integrationsWrapper = {
  Core: {
    async UploadFile({ file }) {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('uploads') // Ensure bucket exists
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      return { file_url: publicUrl };
    },
    // ... other mocks or implementations
  }
};

// Entities list
const entityNames = [
  'UserProfile', // Mapped to 'users'
  'DailyPractice', // Mapped to 'practices'
  'VibeagotchiState', // Mapped to 'vibagotchi'
  'GlobalPulse', // Mapped to 'global_pulse'
  'WalletConnection', // Mapped to 'wallet_connections'
  'PracticeCard', // Likely 'tarot_pulls' or separate lookup
  'GameScore', // Needs table
  'ActivityPulse' // Needs table
];

const entities = {};
entityNames.forEach(name => {
  entities[name] = new EntityWrapper(name);
});

// Explicitly map PracticeCard if it's meant to be tarot_pulls history or a static lookup
// If 'tarot_pulls' is the history, we use that.
entities['TarotPull'] = new EntityWrapper('TarotPull'); // Mapped to tarot_pulls via snake_case

export const appApi = {
  entities,
  auth: authWrapper,
  functions: functionsWrapper,
  integrations: integrationsWrapper
};

// Aliases
export const base44 = appApi;
export const isDemoMode = false; // Hardcoded false

export default supabase;

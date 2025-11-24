import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Users, Leaf, Zap, Filter, Check } from 'lucide-react';

const categories = [
  { name: 'Love', icon: Heart, color: 'from-rose-400 to-pink-500' },
  { name: 'Empathy', icon: Users, color: 'from-blue-400 to-indigo-500' },
  { name: 'Community', icon: Users, color: 'from-purple-400 to-violet-500' },
  { name: 'Healing', icon: Leaf, color: 'from-emerald-400 to-green-500' },
  { name: 'Empowerment', icon: Zap, color: 'from-amber-400 to-orange-500' }
];

export default function CategoryFilter() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const { data: preferences = [] } = useQuery({
    queryKey: ['userPreferences', user?.email],
    queryFn: () => base44.entities.UserPreferences.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const userPrefs = preferences[0];
  const enabledCategories = userPrefs?.enabled_categories || ['Love', 'Empathy', 'Community', 'Healing', 'Empowerment'];

  const updatePreferences = useMutation({
    mutationFn: async (newCategories) => {
      if (userPrefs) {
        await base44.entities.UserPreferences.update(userPrefs.id, {
          enabled_categories: newCategories
        });
      } else {
        await base44.entities.UserPreferences.create({
          user_email: user?.email,
          enabled_categories: newCategories
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    }
  });

  const toggleCategory = (categoryName) => {
    const newCategories = enabledCategories.includes(categoryName)
      ? enabledCategories.filter(c => c !== categoryName)
      : [...enabledCategories, categoryName];
    
    if (newCategories.length > 0) {
      updatePreferences.mutate(newCategories);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-3">
          <Filter className="w-12 h-12 text-amber-400" />
          Card Categories
        </h1>
        <p className="text-slate-300 text-lg">
          Choose which categories to include in your daily practice
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-organic p-6"
      >
        <p className="text-slate-300 mb-6 text-center">
          Select at least one category. Cards will be drawn from your enabled categories.
        </p>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isEnabled = enabledCategories.includes(category.name);
            
            return (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleCategory(category.name)}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  isEnabled
                    ? 'border-amber-400 bg-gradient-to-br from-amber-500/20 to-orange-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {isEnabled && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-slate-900" />
                  </div>
                )}
                
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-sm text-slate-400">
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <div className="text-center">
        <p className="text-slate-400 text-sm">
          {enabledCategories.length} {enabledCategories.length === 1 ? 'category' : 'categories'} enabled
        </p>
      </div>
    </div>
  );
}
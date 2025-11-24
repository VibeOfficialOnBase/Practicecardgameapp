import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, TrendingUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import VibeagotchiCreature from '../components/vibeagotchi/VibeagotchiCreature';
import VibeagotchiStats from '../components/vibeagotchi/VibeagotchiStats';
import VibeagotchiInteractions from '../components/vibeagotchi/VibeagotchiInteractions';
import VibeagotchiMiniGame from '../components/vibeagotchi/VibeagotchiMiniGame';
import VibeagotchiItems from '../components/vibeagotchi/VibeagotchiItems';
import VibeagotchiThought from '../components/vibeagotchi/VibeagotchiThought';
import ActionAnimation from '../components/vibeagotchi/ActionAnimation';
import BreathingExercise from '../components/games/BreathingExercise';
import AffirmingMessage from '../components/games/AffirmingMessage';
import VibeagotchiHowToPlay from '../components/vibeagotchi/VibeagotchiHowToPlay';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const evolutionThresholds = [0, 100, 300, 600, 1000, 1500];
const evolutionNames = ['Spark', 'Ember', 'Flame', 'Radiant', 'Celestial', 'Transcendent'];

export default function VibeAGotchi() {
  const [showBreathing, setShowBreathing] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [newName, setNewName] = useState('');
  const [evolutionStage, setEvolutionStage] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [currentThought, setCurrentThought] = useState('');
  const [dailyAffirmation, setDailyAffirmation] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const queryClient = useQueryClient();
  const { play } = useSound();
  const { trigger } = useHaptic();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: vibeState, isLoading } = useQuery({
    queryKey: ['vibeagotchiState', user?.email],
    queryFn: async () => {
      const states = await base44.entities.VibeagotchiState.filter({ 
        user_email: user.email 
      });
      
      if (states.length === 0) {
        const newState = await base44.entities.VibeagotchiState.create({
          user_email: user.email,
          name: 'Vibe',
          evolution_stage: 0,
          current_emotion: 'curious',
          energy: 50,
          focus: 50,
          peace: 50,
          bond: 0,
          growth_xp: 0,
          daily_harmony_score: 0,
          harmony_streak: 0,
          total_interactions: 0,
          last_interaction: new Date().toISOString()
        });
        return newState;
      }
      
      return states[0];
    },
    enabled: !!user
  });

  const { data: evolutions = [] } = useQuery({
    queryKey: ['vibeagotchiEvolutions', user?.email],
    queryFn: () => base44.entities.VibeagotchiEvolution.filter({ 
      user_email: user?.email 
    }),
    enabled: !!user
  });

  useEffect(() => {
    if (vibeState) {
      updateStatsOverTime();
    }
  }, [vibeState]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('day');
    else if (hour >= 18 && hour < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');

    const interval = setInterval(() => {
      const h = new Date().getHours();
      if (h >= 6 && h < 12) setTimeOfDay('morning');
      else if (h >= 12 && h < 18) setTimeOfDay('day');
      else if (h >= 18 && h < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const updateStatsOverTime = () => {
    if (!vibeState || !vibeState.last_interaction) return;

    const lastInteraction = new Date(vibeState.last_interaction);
    const now = new Date();
    const hoursSince = (now - lastInteraction) / (1000 * 60 * 60);

    if (hoursSince > 1) {
      const decay = Math.min(Math.floor(hoursSince * 2), 30);
      const newHealth = Math.max(0, vibeState.health - decay);
      const isSick = newHealth < 30 || (vibeState.cleanliness || 100) < 20;
      
      updateStatsMutation.mutate({
        energy: Math.max(0, (vibeState.energy || 80) - decay),
        happiness: Math.max(0, (vibeState.happiness || 80) - decay),
        health: newHealth,
        cleanliness: Math.max(0, (vibeState.cleanliness || 100) - Math.floor(hoursSince * 3)),
        hunger: Math.min(100, (vibeState.hunger || 0) + Math.floor(hoursSince * 5)),
        is_sick: isSick,
        current_emotion: isSick ? 'sick' : (newHealth < 50 ? 'low_energy' : vibeState.current_emotion)
      });
    }
  };

  const updateStatsMutation = useMutation({
    mutationFn: async (updates) => {
      const newXP = (updates.growth_xp !== undefined ? updates.growth_xp : vibeState.growth_xp);
      const currentStage = vibeState.evolution_stage;
      const nextStage = evolutionThresholds.findIndex(threshold => newXP < threshold) - 1;
      const shouldEvolve = nextStage > currentStage && nextStage < evolutionNames.length;

      await base44.entities.VibeagotchiState.update(vibeState.id, {
        ...updates,
        last_interaction: new Date().toISOString(),
        total_interactions: vibeState.total_interactions + 1
      });

      if (shouldEvolve) {
        await base44.entities.VibeagotchiEvolution.create({
          user_email: user.email,
          evolution_stage: nextStage,
          stage_name: evolutionNames[nextStage],
          achieved_at: new Date().toISOString(),
          stats_at_evolution: {
            energy: vibeState.energy,
            focus: vibeState.focus,
            peace: vibeState.peace,
            bond: vibeState.bond
          }
        });

        const achievements = await base44.entities.Achievement.filter({ created_by: user.email });
        const hasAchievement = (title) => achievements.some(a => a.title === title);

        if (nextStage === 1 && !hasAchievement('Soul Keeper')) {
          await base44.entities.Achievement.create({
            title: 'Soul Keeper',
            description: 'Nurtured your VibeAGotchi to Ember stage',
            badge_icon: 'flame',
            earned_date: new Date().toISOString(),
            leche_value: 'Empowerment'
          });
        } else if (nextStage === 3 && !hasAchievement('Spirit Guardian')) {
          await base44.entities.Achievement.create({
            title: 'Spirit Guardian',
            description: 'Evolved your VibeAGotchi to Radiant stage',
            badge_icon: 'star',
            earned_date: new Date().toISOString(),
            leche_value: 'Community'
          });
        } else if (nextStage === 5 && !hasAchievement('Ascendant')) {
          await base44.entities.Achievement.create({
            title: 'Ascendant',
            description: 'Reached the final Transcendent evolution',
            badge_icon: 'crown',
            earned_date: new Date().toISOString(),
            leche_value: 'Love'
          });
        }

        setEvolutionStage(nextStage);
        setShowEvolution(true);
        play('level-up');
        trigger('success');
      }

      return { shouldEvolve, nextStage };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vibeagotchiState'] });
      queryClient.invalidateQueries({ queryKey: ['vibeagotchiEvolutions'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
  });

  const generateThought = async () => {
    if (!vibeState) return;
    try {
      const { data } = await base44.functions.invoke('generateVibeThoughts', {
        emotion: vibeState.current_emotion,
        health: vibeState.health || 100,
        energy: vibeState.energy || 80,
        happiness: vibeState.happiness || 80,
        bond: vibeState.bond || 0,
        evolution_stage: vibeState.evolution_stage,
        name: vibeState.name
      });
      setCurrentThought(data.thought);
    } catch (error) {
      console.error('Error generating thought:', error);
    }
  };

  const generateDailyAffirmation = async () => {
    if (!vibeState) return;
    try {
      const { data } = await base44.functions.invoke('generateVibeAffirmation', {
        emotion: vibeState.current_emotion,
        health: vibeState.health || 100,
        energy: vibeState.energy || 80,
        happiness: vibeState.happiness || 80,
        bond: vibeState.bond || 0,
        name: vibeState.name
      });
      setDailyAffirmation(data);
    } catch (error) {
      console.error('Error generating affirmation:', error);
    }
  };

  const showActionAnimation = (action) => {
    setCurrentAction(action);
    setTimeout(() => setCurrentAction(null), 2000);
  };

  const handleFeed = async () => {
    play('card-flip');
    trigger('light');
    showActionAnimation('feed');
    generateThought();
    updateStatsMutation.mutate({
      hunger: Math.max(0, (vibeState.hunger || 0) - 30),
      energy: Math.min(100, (vibeState.energy || 80) + 15),
      happiness: Math.min(100, (vibeState.happiness || 80) + 10),
      bond: Math.min(100, vibeState.bond + 3),
      growth_xp: vibeState.growth_xp + 5,
      current_emotion: 'happy',
      last_fed: new Date().toISOString()
    });

    // Log activity pulse
    try {
      await base44.entities.ActivityPulse.create({
        user_email: user.email,
        action_type: 'vibeagotchi_interaction',
        action_description: `fed their VibeAGotchi ${vibeState.name}`,
        action_icon: '🍎'
      });
    } catch (error) {
      console.error('Failed to log pulse:', error);
    }
  };

  const handleClean = () => {
    play('card-flip');
    trigger('light');
    showActionAnimation('clean');
    generateThought();
    updateStatsMutation.mutate({
      cleanliness: 100,
      happiness: Math.min(100, (vibeState.happiness || 80) + 15),
      health: Math.min(100, (vibeState.health || 100) + 10),
      bond: Math.min(100, vibeState.bond + 5),
      growth_xp: vibeState.growth_xp + 8,
      current_emotion: 'content',
      last_cleaned: new Date().toISOString()
    });
  };

  const handleHeal = () => {
    play('success');
    trigger('success');
    showActionAnimation('heal');
    generateThought();
    updateStatsMutation.mutate({
      is_sick: false,
      health: 100,
      energy: Math.min(100, (vibeState.energy || 80) + 20),
      happiness: Math.min(100, (vibeState.happiness || 80) + 20),
      current_emotion: 'happy',
      growth_xp: vibeState.growth_xp + 15
    });
  };

  const handleSleep = () => {
    play('card-flip');
    trigger('light');
    showActionAnimation('sleep');
    updateStatsMutation.mutate({
      is_sleeping: !vibeState.is_sleeping,
      energy: vibeState.is_sleeping ? vibeState.energy : Math.min(100, (vibeState.energy || 80) + 50),
      current_emotion: vibeState.is_sleeping ? 'content' : 'sleepy'
    });
  };

  const handleMiniGameComplete = (score) => {
    play('success');
    trigger('success');
    showActionAnimation('play');
    generateThought();
    const xpGained = score;
    updateStatsMutation.mutate({
      happiness: Math.min(100, (vibeState.happiness || 80) + 25),
      energy: Math.max(0, (vibeState.energy || 80) - 10),
      bond: Math.min(100, vibeState.bond + 10),
      growth_xp: vibeState.growth_xp + xpGained,
      current_emotion: 'excited',
      last_played: new Date().toISOString(),
      mini_game_high_scores: {
        ...(vibeState.mini_game_high_scores || {}),
        catch_stars: Math.max(score, vibeState.mini_game_high_scores?.catch_stars || 0)
      }
    });
    setShowMiniGame(false);
  };

  const handlePurchaseItem = (itemId, cost) => {
    if (vibeState.growth_xp >= cost) {
      play('success');
      trigger('success');
      updateStatsMutation.mutate({
        growth_xp: vibeState.growth_xp - cost,
        owned_items: [...(vibeState.owned_items || []), itemId]
      });
    }
  };

  const handleEquipItem = (itemId) => {
    play('card-flip');
    trigger('light');
    showActionAnimation('gift');
    updateStatsMutation.mutate({
      equipped_item: itemId,
      happiness: Math.min(100, (vibeState.happiness || 80) + 10)
    });
  };

  const handleBreathe = () => {
    setShowBreathing(true);
  };

  const handleBreathingComplete = () => {
    setShowBreathing(false);
    play('success');
    trigger('success');
    showActionAnimation('breathe');
    generateThought();
    updateStatsMutation.mutate({
      peace: Math.min(100, vibeState.peace + 20),
      focus: Math.min(100, vibeState.focus + 10),
      bond: Math.min(100, vibeState.bond + 5),
      growth_xp: vibeState.growth_xp + 10,
      current_emotion: 'calm',
      last_breathed: new Date().toISOString()
    });
  };

  const handleReflect = () => {
    setShowAffirmation(true);
  };

  const handleReflectComplete = () => {
    setShowAffirmation(false);
    play('success');
    trigger('success');
    generateThought();
    updateStatsMutation.mutate({
      peace: Math.min(100, vibeState.peace + 15),
      focus: Math.min(100, vibeState.focus + 15),
      bond: Math.min(100, vibeState.bond + 8),
      growth_xp: vibeState.growth_xp + 15,
      current_emotion: 'glowing'
    });
  };

  const handlePlay = () => {
    setShowMiniGame(true);
  };

  const handleGift = () => {
    setShowItems(true);
  };

  const handleTap = () => {
    play('card-flip');
    trigger('light');
    showActionAnimation('tap');
    generateThought();
    
    const emotions = ['happy', 'curious', 'calm', 'playful'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    updateStatsMutation.mutate({
      bond: Math.min(100, vibeState.bond + 1),
      current_emotion: randomEmotion
    });
  };

  const handleRename = () => {
    if (newName.trim() && newName !== vibeState.name) {
      updateStatsMutation.mutate({
        name: newName.trim()
      });
      setShowRename(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-600"></div>
      </div>
    );
  }

  if (showBreathing) {
    return <BreathingExercise onComplete={handleBreathingComplete} />;
  }

  if (showAffirmation) {
    return <AffirmingMessage onContinue={handleReflectComplete} />;
  }

  if (showMiniGame) {
    return (
      <VibeagotchiMiniGame
        gameType="catch_stars"
        onComplete={handleMiniGameComplete}
        onClose={() => setShowMiniGame(false)}
      />
    );
  }

  if (showItems) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-organic p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold ensure-readable-strong">Items Shop</h2>
            <button onClick={() => setShowItems(false)} className="text-label hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-sm text-label">Your XP: <span className="font-bold text-purple-400">{vibeState?.growth_xp || 0}</span></p>
          </div>
          <VibeagotchiItems
            ownedItems={vibeState?.owned_items || []}
            currentXP={vibeState?.growth_xp || 0}
            equippedItem={vibeState?.equipped_item}
            onPurchase={handlePurchaseItem}
            onEquip={handleEquipItem}
          />
        </motion.div>
      </div>
    );
  }

  const nextEvolutionXP = evolutionThresholds[vibeState.evolution_stage + 1] || evolutionThresholds[evolutionThresholds.length - 1];
  const progressToNext = ((vibeState.growth_xp % nextEvolutionXP) / nextEvolutionXP) * 100;

  const backgroundGradients = {
    morning: 'from-orange-200/30 via-pink-200/30 to-purple-300/30',
    day: 'from-blue-200/30 via-purple-200/30 to-indigo-300/30',
    evening: 'from-purple-300/30 via-pink-300/30 to-orange-400/30',
    night: 'from-indigo-900/40 via-purple-900/40 to-black/50'
  };

  return (
    <div className="min-h-screen pb-20 md:pb-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${backgroundGradients[timeOfDay]} transition-all duration-1000`} />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              y: [0, -50, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto p-3 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <Link to={createPageUrl('Games')} className="text-purple-400 hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <button 
            onClick={() => { setNewName(vibeState?.name || 'Vibe'); setShowRename(true); }}
            className="flex-1 mx-4"
          >
            <h1 className="text-2xl md:text-3xl font-bold ensure-readable-strong hover:text-purple-400 transition-colors">
              {vibeState?.name || 'VibeAGotchi'}
            </h1>
          </button>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setShowHowToPlay(true)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            <span className="font-bold ensure-readable text-sm md:text-base">{evolutions.length}</span>
          </div>
        </div>

        {/* Daily Affirmation */}
        {dailyAffirmation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-organic p-3 md:p-4 mb-4 md:mb-6"
          >
            <p className="text-xs md:text-sm font-semibold text-purple-400 mb-1">Daily Message from {vibeState?.name}</p>
            <p className="text-sm md:text-base ensure-readable italic">"{dailyAffirmation.affirmation}"</p>
            {dailyAffirmation.guidance && (
              <p className="text-xs md:text-sm text-label mt-2">{dailyAffirmation.guidance}</p>
            )}
          </motion.div>
        )}

        {!dailyAffirmation && vibeState && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6 text-center"
          >
            <Button
              onClick={generateDailyAffirmation}
              variant="outline"
              size="sm"
              className="text-xs md:text-sm"
            >
              Get Daily Wisdom
            </Button>
          </motion.div>
        )}

        {/* Daily Harmony Score */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-organic p-3 md:p-4 mb-4 md:mb-6 text-center"
        >
          <p className="text-xs md:text-sm text-label mb-1">Daily Harmony</p>
          <p className="text-2xl md:text-3xl font-bold ensure-readable-strong">{vibeState.daily_harmony_score}</p>
          <p className="text-xs text-label mt-1">Streak: {vibeState.harmony_streak} days</p>
        </motion.div>

        {/* Creature Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-organic p-4 md:p-8 mb-4 md:mb-6 relative"
        >
          <ActionAnimation action={currentAction} />
          <VibeagotchiThought thought={currentThought} />
          <VibeagotchiCreature 
            state={vibeState} 
            onTap={handleTap} 
            equippedItem={vibeState.equipped_item}
          />
        </motion.div>

        {/* Evolution Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-organic p-3 md:p-4 mb-4 md:mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm font-semibold ensure-readable">Evolution Progress</span>
            <span className="text-xs text-label">{vibeState.growth_xp} / {nextEvolutionXP} XP</span>
          </div>
          <div className="relative h-2 md:h-3 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 md:mb-6"
        >
          <VibeagotchiStats state={vibeState} />
        </motion.div>

        {/* Interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VibeagotchiInteractions
            onFeed={handleFeed}
            onBreathe={handleBreathe}
            onReflect={handleReflect}
            onPlay={handlePlay}
            onClean={handleClean}
            onHeal={handleHeal}
            onSleep={handleSleep}
            onGift={handleGift}
            isSleeping={vibeState.is_sleeping}
            isSick={vibeState.is_sick}
            cooldowns={{
              feed: vibeState.last_fed ? new Date(vibeState.last_fed).getTime() + 1800000 : null,
              breathe: vibeState.last_breathed ? new Date(vibeState.last_breathed).getTime() + 3600000 : null,
              clean: vibeState.last_cleaned ? new Date(vibeState.last_cleaned).getTime() + 3600000 : null,
              play: vibeState.last_played ? new Date(vibeState.last_played).getTime() + 1800000 : null
            }}
          />
        </motion.div>

        {/* Quick Status Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-organic p-3 md:p-4 mt-4 md:mt-6"
        >
          <div className="flex items-center justify-between text-xs md:text-sm flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-label">Hunger:</span>
              <div className="w-16 md:w-20 h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${vibeState.hunger || 0}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label">Clean:</span>
              <div className="w-16 md:w-20 h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${vibeState.cleanliness || 100}%` }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Evolution Animation */}
      <AnimatePresence>
        {showEvolution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center"
            onClick={() => setShowEvolution(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{ duration: 2, repeat: 3 }}
              >
                <TrendingUp className="w-32 h-32 text-purple-400 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-5xl font-bold mb-4 ensure-readable-strong">Evolution!</h2>
              <p className="text-2xl text-purple-300 mb-2">Your VibeAGotchi has evolved into</p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {evolutionNames[evolutionStage]}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How To Play Modal */}
      {showHowToPlay && (
        <VibeagotchiHowToPlay onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Rename Modal */}
      <AnimatePresence>
        {showRename && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRename(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="card-organic p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold mb-4 ensure-readable-strong">Rename Your Companion</h3>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name..."
                className="mb-4"
                maxLength={15}
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowRename(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRename} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                  Rename
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
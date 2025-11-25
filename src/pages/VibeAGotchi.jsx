import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, TrendingUp, X, Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { useAuth } from '../contexts/AuthContext';
import { getVibeGotchiState, saveVibeGotchiState } from '../lib/supabase';
import { appApi } from '@/api/supabaseClient'; // Fallback for achievements/evolutions

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
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import { Input } from '@/components/ui/input';

const evolutionThresholds = [0, 300, 800, 1500, 2500, 4000];
const evolutionNames = ['Spark', 'Ember', 'Flame', 'Radiant', 'Celestial', 'Transcendent'];

export default function VibeAGotchi() {
  const { user } = useAuth();
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

  // Load Vibe State
  const { data: vibeState, isLoading } = useQuery({
    queryKey: ['vibeagotchiState', user?.email],
    queryFn: async () => {
      let state = await getVibeGotchiState(user.email);
      if (!state) {
        state = await saveVibeGotchiState(user.email, {
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
      }
      return state;
    },
    enabled: !!user
  });

  const { data: evolutions = [] } = useQuery({
    queryKey: ['vibeagotchiEvolutions', user?.email],
    queryFn: () => appApi.entities.VibeagotchiEvolution.filter({
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
    const updateTime = () => {
      const h = new Date().getHours();
      if (h >= 6 && h < 12) setTimeOfDay('morning');
      else if (h >= 12 && h < 18) setTimeOfDay('day');
      else if (h >= 18 && h < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
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
      const targetStage = Math.min(Math.max(0, nextStage), evolutionNames.length - 1);
      const shouldEvolve = targetStage > currentStage;

      const updated = await saveVibeGotchiState(user.email, {
        ...updates,
        evolution_stage: shouldEvolve ? targetStage : currentStage,
        total_interactions: (vibeState.total_interactions || 0) + 1
      });

      if (shouldEvolve) {
        await appApi.entities.VibeagotchiEvolution.create({
          user_email: user.email,
          evolution_stage: targetStage,
          stage_name: evolutionNames[targetStage],
          achieved_at: new Date().toISOString(),
          stats_at_evolution: {
            energy: vibeState.energy,
            focus: vibeState.focus,
            peace: vibeState.peace,
            bond: vibeState.bond
          }
        });
        setEvolutionStage(targetStage);
        setShowEvolution(true);
      }

      return { shouldEvolve, nextStage: targetStage };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vibeagotchiState'] });
      queryClient.invalidateQueries({ queryKey: ['vibeagotchiEvolutions'] });
    }
  });

  const generateThought = async () => {
    // Simplified local thoughts for speed/demo
    const thoughts = [
        "I'm feeling great!", "Let's play!", "So peaceful...", "You are kind.", "Nature is beautiful."
    ];
    setCurrentThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
  };

  const generateDailyAffirmation = async () => {
      setDailyAffirmation({
          affirmation: "You are capable of amazing things.",
          guidance: "Trust in your journey."
      });
  };

  const showActionAnimation = (action) => {
    setCurrentAction(action);
    setTimeout(() => setCurrentAction(null), 2000);
  };

  const handleInteraction = (type, statsUpdate) => {
    showActionAnimation(type);
    generateThought();
    updateStatsMutation.mutate(statsUpdate);
  };

  // Handlers
  const handleFeed = () => handleInteraction('feed', {
    hunger: Math.max(0, (vibeState.hunger || 0) - 30),
    energy: Math.min(100, (vibeState.energy || 80) + 15),
    happiness: Math.min(100, (vibeState.happiness || 80) + 10),
    bond: Math.min(100, vibeState.bond + 3),
    growth_xp: vibeState.growth_xp + 15,
    current_emotion: 'happy',
    last_fed: new Date().toISOString()
  });

  const handleClean = () => handleInteraction('clean', {
    cleanliness: 100,
    happiness: Math.min(100, (vibeState.happiness || 80) + 15),
    health: Math.min(100, (vibeState.health || 100) + 10),
    bond: Math.min(100, vibeState.bond + 5),
    growth_xp: vibeState.growth_xp + 20,
    current_emotion: 'content',
    last_cleaned: new Date().toISOString()
  });

  const handleHeal = () => handleInteraction('heal', {
    is_sick: false,
    health: 100,
    energy: Math.min(100, (vibeState.energy || 80) + 20),
    happiness: Math.min(100, (vibeState.happiness || 80) + 20),
    current_emotion: 'happy',
    growth_xp: vibeState.growth_xp + 30
  });

  const handleSleep = () => {
    showActionAnimation('sleep');
    updateStatsMutation.mutate({
      is_sleeping: !vibeState.is_sleeping,
      energy: vibeState.is_sleeping ? vibeState.energy : Math.min(100, (vibeState.energy || 80) + 50),
      current_emotion: vibeState.is_sleeping ? 'content' : 'sleepy'
    });
  };

  const handlePlay = () => setShowMiniGame(true);

  const handleMiniGameComplete = (score) => {
    showActionAnimation('play');
    generateThought();
    updateStatsMutation.mutate({
      happiness: Math.min(100, (vibeState.happiness || 80) + 25),
      energy: Math.max(0, (vibeState.energy || 80) - 10),
      bond: Math.min(100, vibeState.bond + 10),
      growth_xp: vibeState.growth_xp + score,
      current_emotion: 'excited',
      last_played: new Date().toISOString()
    });
    setShowMiniGame(false);
  };

  const handleBreathe = () => setShowBreathing(true);

  const handleBreathingComplete = () => {
    setShowBreathing(false);
    handleInteraction('breathe', {
      peace: Math.min(100, vibeState.peace + 20),
      focus: Math.min(100, vibeState.focus + 10),
      bond: Math.min(100, vibeState.bond + 5),
      growth_xp: vibeState.growth_xp + 25,
      current_emotion: 'calm',
      last_breathed: new Date().toISOString()
    });
  };

  const handleReflect = () => setShowAffirmation(true);

  const handleReflectComplete = () => {
    setShowAffirmation(false);
    updateStatsMutation.mutate({
      peace: Math.min(100, vibeState.peace + 15),
      focus: Math.min(100, vibeState.focus + 15),
      bond: Math.min(100, vibeState.bond + 8),
      growth_xp: vibeState.growth_xp + 20,
      current_emotion: 'glowing'
    });
  };

  const handlePurchaseItem = (itemId, cost) => {
    if (vibeState.growth_xp >= cost) {
      updateStatsMutation.mutate({
        growth_xp: vibeState.growth_xp - cost,
        owned_items: [...(vibeState.owned_items || []), itemId]
      });
    }
  };

  const handleEquipItem = (itemId) => {
    showActionAnimation('gift');
    updateStatsMutation.mutate({
      equipped_item: itemId,
      happiness: Math.min(100, (vibeState.happiness || 80) + 10)
    });
  };

  const handleTap = () => {
    showActionAnimation('tap');
    generateThought();
    const emotions = ['happy', 'curious', 'calm', 'playful'];
    updateStatsMutation.mutate({
      bond: Math.min(100, vibeState.bond + 0.5),
      current_emotion: emotions[Math.floor(Math.random() * emotions.length)]
    });
  };

  const handleRename = () => {
    if (newName.trim() && newName !== vibeState.name) {
      updateStatsMutation.mutate({ name: newName.trim() });
      setShowRename(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-2 border-purple-500 rounded-full animate-spin" /></div>;

  if (showBreathing) return <BreathingExercise onComplete={handleBreathingComplete} />;
  if (showAffirmation) return <AffirmingMessage onContinue={handleReflectComplete} />;
  if (showMiniGame) return <VibeagotchiMiniGame gameType="catch_stars" onComplete={handleMiniGameComplete} onClose={() => setShowMiniGame(false)} />;

  const nextEvolutionXP = evolutionThresholds[vibeState.evolution_stage + 1] || evolutionThresholds[evolutionThresholds.length - 1];
  const progressToNext = ((vibeState.growth_xp % nextEvolutionXP) / nextEvolutionXP) * 100;

  const bgGradients = {
    morning: 'from-orange-100 via-rose-100 to-purple-200',
    day: 'from-sky-100 via-indigo-100 to-purple-200',
    evening: 'from-indigo-200 via-purple-200 to-pink-200',
    night: 'from-slate-900 via-purple-900 to-indigo-950'
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-gradient-to-br ${bgGradients[timeOfDay]} transition-colors duration-1000`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20 blur-xl"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="px-4 pt-4 pb-2 z-10 flex justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/10">
        <Link to={createPageUrl('Games')} className="p-2 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6 text-[var(--text-primary)]" />
        </Link>

        <button onClick={() => { setNewName(vibeState.name); setShowRename(true); }} className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{vibeState.name}</h1>
          <span className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest">
            {evolutionNames[vibeState.evolution_stage]}
          </span>
        </button>

        <div className="flex gap-2">
            <button onClick={() => setShowHowToPlay(true)} className="p-2 rounded-full hover:bg-white/20">
                <HelpCircle className="w-6 h-6 text-[var(--text-secondary)]" />
            </button>
        </div>
      </div>

      {/* Main Creature Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4">
        <ActionAnimation action={currentAction} />
        <VibeagotchiThought thought={currentThought} />
        <VibeagotchiCreature state={vibeState} onTap={handleTap} equippedItem={vibeState.equipped_item} />

        {/* Evolution Bar */}
        <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto">
             <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                <span>XP</span>
                <span>{vibeState.growth_xp} / {nextEvolutionXP}</span>
             </div>
             <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-[var(--accent-primary)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progressToNext)}%` }}
                />
             </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-2 py-3 bg-white/5 backdrop-blur-sm z-10">
        <VibeagotchiStats state={vibeState} />
      </div>

      {/* Actions Bar - Scrollable/Grid */}
      <div className="bg-[var(--bg-primary)]/90 backdrop-blur-xl border-t border-white/10 p-4 pb-8 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[32px]">
        <VibeagotchiInteractions
          onFeed={handleFeed}
          onBreathe={handleBreathe}
          onReflect={handleReflect}
          onPlay={handlePlay}
          onClean={handleClean}
          onHeal={handleHeal}
          onSleep={handleSleep}
          onGift={() => setShowItems(true)}
          cooldowns={{
            feed: vibeState.last_fed ? new Date(vibeState.last_fed).getTime() + 1800000 : null,
            breathe: vibeState.last_breathed ? new Date(vibeState.last_breathed).getTime() + 3600000 : null,
            clean: vibeState.last_cleaned ? new Date(vibeState.last_cleaned).getTime() + 3600000 : null,
            play: vibeState.last_played ? new Date(vibeState.last_played).getTime() + 1800000 : null
          }}
          isSleeping={vibeState.is_sleeping}
          isSick={vibeState.is_sick}
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showEvolution && (
          <motion.div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEvolution(false)}>
            <div className="text-center p-8">
              <TrendingUp className="w-24 h-24 text-[var(--accent-primary)] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Evolution!</h2>
              <p className="text-xl text-white/80">Your Vibe has evolved into {evolutionNames[evolutionStage]}!</p>
            </div>
          </motion.div>
        )}
        {showItems && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4">
             <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="bg-[var(--bg-primary)] w-full max-w-md h-[80vh] rounded-t-[32px] sm:rounded-[32px] p-6 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Item Shop</h2>
                    <button onClick={() => setShowItems(false)}><X className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <VibeagotchiItems
                        ownedItems={vibeState?.owned_items || []}
                        currentXP={vibeState?.growth_xp || 0}
                        equippedItem={vibeState?.equipped_item}
                        onPurchase={handlePurchaseItem}
                        onEquip={handleEquipItem}
                    />
                </div>
             </motion.div>
          </div>
        )}
        {showRename && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                <Card className="w-full max-w-xs p-6">
                    <h3 className="text-lg font-bold mb-4">Rename</h3>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} className="mb-4" />
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setShowRename(false)} className="flex-1">Cancel</Button>
                        <Button variant="primary" onClick={handleRename} className="flex-1">Save</Button>
                    </div>
                </Card>
            </div>
        )}
        {showHowToPlay && <VibeagotchiHowToPlay onClose={() => setShowHowToPlay(false)} />}
      </AnimatePresence>
    </div>
  );
}

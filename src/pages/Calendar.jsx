import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Calendar as CalendarIcon, Star, Edit2, Trash2, Trophy, Zap, Activity } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function Calendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewingEntry, setViewingEntry] = useState(null);

  // Fetch all calendar activity for the current month
  const { data: monthData = [], isLoading } = useQuery({
    queryKey: ['calendarData', user?.email, format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      if (!user) return [];
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);

      // 1. Practices
      const { data: practices } = await supabase
        .from('daily_practice')
        .select('*')
        .eq('created_by', user.email)
        .gte('created_date', startDate.toISOString())
        .lte('created_date', endDate.toISOString());

      // 2. Pulled Cards
      const { data: cards } = await supabase
        .from('daily_card')
        .select('*')
        .eq('created_by', user.email)
        .gte('created_date', startDate.toISOString())
        .lte('created_date', endDate.toISOString());

      // 3. Game Scores (Wins/Activity)
      const { data: scores } = await supabase
        .from('game_score')
        .select('*')
        .eq('user_email', user.email)
        .gte('created_date', startDate.toISOString())
        .lte('created_date', endDate.toISOString());

      // 4. Activity Pulses (Daily Actions)
      const { data: pulses } = await supabase
        .from('activity_pulse')
        .select('*')
        .eq('user_email', user.email)
        .gte('created_date', startDate.toISOString())
        .lte('created_date', endDate.toISOString());

      // 5. Achievements (Vibe Evolutions or Badges if tracked by date)
      const { data: achievements } = await supabase
        .from('vibeagotchi_evolution')
        .select('*')
        .eq('user_email', user.email)
        .gte('achieved_at', startDate.toISOString())
        .lte('achieved_at', endDate.toISOString());

      // Combine all data keyed by day
      const combined = {};

      const addToDay = (dateStr, type, item) => {
        const day = format(new Date(dateStr), 'yyyy-MM-dd');
        if (!combined[day]) combined[day] = { items: [] };
        combined[day].items.push({ type, ...item });
      };

      (practices || []).forEach(p => addToDay(p.created_date, 'practice', p));
      (cards || []).forEach(c => addToDay(c.created_date, 'card', c));
      (scores || []).forEach(s => addToDay(s.created_date, 'score', s));
      (pulses || []).forEach(p => addToDay(p.created_date, 'pulse', p));
      (achievements || []).forEach(a => addToDay(a.achieved_at, 'achievement', a));

      return combined; // Keyed by 'yyyy-MM-dd'
    },
    enabled: !!user,
  });


  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getDayStatus = (day) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    const entry = monthData[dayKey];
    if (!entry) return null;

    // Determine priority status indicator
    const items = entry.items;
    if (items.some(i => i.type === 'practice' && i.completed)) return 'completed';
    if (items.some(i => i.type === 'card')) return 'pulled';
    if (items.some(i => i.type === 'score' || i.type === 'achievement')) return 'active';
    if (items.length > 0) return 'active';

    return null;
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const selectedDayKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDayItems = monthData[selectedDayKey]?.items || [];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Calendar"
        subtitle="Your journey of practice & play"
      />

      {/* Calendar Widget */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button onClick={handleNextMonth} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-[var(--text-secondary)] uppercase opacity-50">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const status = getDayStatus(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.01 }}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center relative
                  ${isSelected ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'hover:bg-[var(--bg-secondary)]'}
                  ${isToday && !isSelected ? 'border border-[var(--accent-primary)] text-[var(--accent-primary)]' : ''}
                `}
              >
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                  {format(day, 'd')}
                </span>
                {status === 'completed' ? (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
                ) : status === 'pulled' ? (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white/50' : 'bg-blue-400'}`} />
                ) : status === 'active' ? (
                   <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white/50' : 'bg-orange-400'}`} />
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Selected Day Detail */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)] px-2">
          {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'MMMM do')}
        </h3>

        {selectedDayItems.length > 0 ? (
            <div className="space-y-3">
                {selectedDayItems.map((item, idx) => (
                    <Card key={idx} className="p-4 relative overflow-hidden">
                        {item.type === 'practice' && (
                             <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <Star className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-[var(--text-primary)]">Practice Complete</p>
                                        <p className="text-xs text-[var(--text-secondary)]">Mood: {item.before_mood || '-'} → {item.after_mood || '-'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewingEntry(item)} className="text-xs font-medium text-[var(--accent-primary)] hover:underline">
                                    View
                                </button>
                            </div>
                        )}
                        {item.type === 'card' && (
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[var(--text-primary)]">Card Pulled</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-mono opacity-70">ID: {item.practice_card_id}</p>
                                </div>
                            </div>
                        )}
                        {item.type === 'score' && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[var(--text-primary)]">Game: {item.game_type?.replace('_', ' ')}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">Score: {item.score}</p>
                                </div>
                            </div>
                        )}
                        {item.type === 'pulse' && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Activity className="w-4 h-4 text-purple-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[var(--text-primary)]">{item.action_description}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{format(new Date(item.created_date), 'h:mm a')}</p>
                                </div>
                            </div>
                        )}
                        {item.type === 'achievement' && (
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-500/10 rounded-lg">
                                    <Zap className="w-4 h-4 text-pink-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[var(--text-primary)]">Evolution: {item.stage_name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">VibeAGotchi Level Up!</p>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        ) : (
          <div className="p-8 text-center rounded-[32px] border-2 border-dashed border-[var(--text-secondary)]/20">
            <p className="text-[var(--text-secondary)] text-sm">No activity recorded for this day.</p>
          </div>
        )}
      </div>

      {/* Entry Modal */}
      <Modal
        isOpen={!!viewingEntry}
        onClose={() => setViewingEntry(null)}
        title="Reflection Entry"
      >
        {viewingEntry && (
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Date</label>
                    <p className="text-[var(--text-primary)]">{format(new Date(viewingEntry.created_date), 'MMMM do, yyyy • h:mm a')}</p>
                </div>

                <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Mood</label>
                    <div className="flex gap-4">
                        <div className="bg-[var(--bg-secondary)] px-3 py-1 rounded-full text-sm">
                            Before: {viewingEntry.before_mood || 'N/A'}
                        </div>
                        <div className="bg-[var(--bg-secondary)] px-3 py-1 rounded-full text-sm">
                            After: {viewingEntry.after_mood || 'N/A'}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Journal</label>
                    <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl text-sm leading-relaxed text-[var(--text-primary)] italic">
                        "{viewingEntry.reflection}"
                    </div>
                </div>

                {/* Edit/Delete Placeholder actions */}
                <div className="flex gap-2 pt-4">
                    <Button variant="secondary" className="flex-1">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="secondary" className="flex-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
}

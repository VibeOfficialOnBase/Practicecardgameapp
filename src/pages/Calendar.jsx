import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Calendar as CalendarIcon, Star, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function Calendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewingEntry, setViewingEntry] = useState(null);

  // Fetch practice entries and pulled cards for the current month
  const { data: monthData = [], isLoading } = useQuery({
    queryKey: ['calendarData', user?.email, format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      if (!user) return [];
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);

      // Fetch completed practices
      const { data: practices, error: practicesError } = await supabase
        .from('daily_practice')
        .select(`*`)
        .eq('created_by', user.email)
        .gte('created_date', startDate.toISOString())
        .lte('created_date', endDate.toISOString());

      if (practicesError) throw new Error(practicesError.message);

      // Fetch pulled cards (history)
      const { data: cards, error: cardsError } = await supabase
        .from('daily_card')
        .select(`*, practice_card:practice_card_id(*)`)
        .eq('created_by', user.email)
        .gte('created_date', startDate.toISOString())
        .lte('created_date', endDate.toISOString());

      if (cardsError) throw new Error(cardsError.message);

      // Combine and process data
      const combined = {};
      practices.forEach(p => {
        const day = format(new Date(p.created_date), 'yyyy-MM-dd');
        combined[day] = { ...combined[day], practice: p, type: 'practice' };
      });
      cards.forEach(c => {
        const day = format(new Date(c.created_date), 'yyyy-MM-dd');
        combined[day] = { ...combined[day], card: c, type: 'card' };
      });

      return Object.values(combined);
    },
    enabled: !!user,
  });


  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getDayStatus = (day) => {
    const entry = monthData.find(e => isSameDay(new Date(e.card?.created_date || e.practice?.created_date), day));
    if (!entry) return null;
    if (entry.practice?.completed) return 'completed';
    if (entry.card) return 'pulled';
    return null;
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const selectedPractice = monthData.find(e => isSameDay(new Date(e.card?.created_date || e.practice?.created_date), selectedDate));

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Journal"
        subtitle="Your journey in time"
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
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white/50' : 'bg-gray-400'}`} />
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

        {selectedPractice ? (
          <Card className="p-5 relative overflow-hidden">
             {selectedPractice.practice?.completed ? (
              <>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-500" />
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Star className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-[var(--text-primary)]">Practice Complete</p>
                            <p className="text-xs text-[var(--text-secondary)]">{format(new Date(selectedPractice.practice.created_date), 'h:mm a')}</p>
                        </div>
                    </div>
                    <button onClick={() => setViewingEntry(selectedPractice.practice)} className="text-xs font-medium text-[var(--accent-primary)] hover:underline">
                        View Entry
                    </button>
                </div>
                {selectedPractice.practice.reflection && (
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 italic">
                        "{selectedPractice.practice.reflection}"
                    </p>
                )}
              </>
            ) : selectedPractice.card ? (
                 <div className="flex items-center gap-4">
                    <img src={selectedPractice.card.practice_card.image_url || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/43aec5bff_PRACTICECARDBACK.jpg'} alt="Card" className="w-16 h-24 rounded-lg object-cover" />
                    <div>
                        <p className="font-bold text-sm text-[var(--text-primary)]">{selectedPractice.card.practice_card.title}</p>
                        <p className="text-xs text-[var(--text-secondary)]">Card pulled, practice pending.</p>
                    </div>
                </div>
            ) : null}
          </Card>
        ) : (
          <div className="p-8 text-center rounded-[32px] border-2 border-dashed border-[var(--text-secondary)]/20">
            <p className="text-[var(--text-secondary)] text-sm">No practice recorded for this day.</p>
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

                {/* Edit/Delete Placeholder actions - would require mutations */}
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

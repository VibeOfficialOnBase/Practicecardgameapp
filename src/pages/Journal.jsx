import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Edit2, Trash2, Save, X, Plus, Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function Journal() {
  const [user, setUser] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editedReflection, setEditedReflection] = useState('');
  const [editedRating, setEditedRating] = useState(0);
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

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries', user?.email],
    queryFn: () => base44.entities.DailyPractice.filter(
      { created_by: user?.email, completed: true },
      '-completion_date',
      50
    ),
    enabled: !!user,
  });

  const { data: practiceCards = [] } = useQuery({
    queryKey: ['practiceCards'],
    queryFn: () => base44.entities.PracticeCard.list('-created_date', 100),
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.DailyPractice.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      setEditingEntry(null);
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (id) => base44.entities.DailyPractice.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });

  const handleEdit = (entry) => {
    setEditingEntry(entry.id);
    setEditedReflection(entry.reflection || '');
    setEditedRating(entry.rating || 0);
  };

  const handleSave = (entryId) => {
    updateEntryMutation.mutate({
      id: entryId,
      data: {
        reflection: editedReflection,
        rating: editedRating,
      },
    });
  };

  const handleDelete = (entryId) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      deleteEntryMutation.mutate(entryId);
    }
  };

  const getCardDetails = (cardId) => {
    return practiceCards.find(card => card.id === cardId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-2">Your Journal</h1>
        <p className="text-slate-300 text-lg font-medium">
          Reflect on your practice journey
        </p>
      </motion.div>

      {journalEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-organic p-12 text-center"
        >
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No Entries Yet</h3>
          <p className="text-slate-400">
            Complete your first practice to start your journal
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {journalEntries.map((entry, index) => {
              const card = getCardDetails(entry.practice_card_id);
              const isEditing = editingEntry === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-organic p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-amber-400" />
                        <span className="text-slate-400 text-sm font-medium">
                          {format(new Date(entry.completion_date), 'MMMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                      {card && (
                        <h3 className="text-xl font-bold text-white mb-1">
                          {card.title}
                        </h3>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(entry)}
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-amber-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(entry.id)}
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editedReflection}
                        onChange={(e) => setEditedReflection(e.target.value)}
                        className="min-h-32 rounded-2xl bg-slate-900/50 border-slate-700 focus:border-amber-400 text-slate-100"
                      />

                      <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditedRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Sparkles
                                className={`w-8 h-8 ${
                                  star <= editedRating
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-slate-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => setEditingEntry(null)}
                          variant="outline"
                          className="rounded-xl"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSave(entry.id)}
                          disabled={updateEntryMutation.isPending}
                          className="btn-primary rounded-xl"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">
                        {entry.reflection || 'No reflection recorded'}
                      </p>

                      {entry.rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">Impact:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Sparkles
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= entry.rating
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
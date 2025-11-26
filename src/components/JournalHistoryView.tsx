import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Calendar, TrendingUp, Award, Trash2, Eye } from 'lucide-react';
import { getUserJournalEntries, getJournalStats, deleteJournalEntry, searchJournalEntries } from '@/utils/journalTracking';
import { allCards } from '@/data/cardsWithRarity';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { JournalEntry } from '@/utils/journalTracking';

interface JournalHistoryViewProps {
  username: string;
}

export function JournalHistoryView({ username }: JournalHistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const stats = getJournalStats(username);
  const entries = searchQuery 
    ? searchJournalEntries(username, searchQuery)
    : getUserJournalEntries(username);

  const handleDelete = (cardId: number) => {
    const success = deleteJournalEntry(username, cardId);
    if (success) {
      setShowDeleteConfirm(null);
      // Force re-render
      window.location.reload();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          📖 Journal Entries
        </h2>
        <p className="text-gray-300">
          Your PRACTICE reflections and deeper work
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <p className="text-white/60 text-xs">Total Entries</p>
            </div>
            <p className="text-white font-bold text-2xl">{stats.totalEntries}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <p className="text-white/60 text-xs">Total Words</p>
            </div>
            <p className="text-white font-bold text-2xl">{stats.totalWords.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <p className="text-white/60 text-xs">Current Streak</p>
            </div>
            <p className="text-white font-bold text-2xl">{stats.currentStreak} days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <p className="text-white/60 text-xs">Longest Streak</p>
            </div>
            <p className="text-white font-bold text-2xl">{stats.longestStreak} days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search your journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      {entries.length === 0 ? (
        <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-2">
              {searchQuery ? 'No entries found' : 'No journal entries yet'}
            </p>
            <p className="text-white/40 text-sm">
              {searchQuery ? 'Try a different search term' : 'Start journaling on your daily cards to see entries here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const card = allCards.find(c => c.id === entry.cardId);
            if (!card) return null;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Card Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">{card.affirmation}</h3>
                            <p className="text-white/60 text-sm flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(entry.date)}
                              <span className="text-white/40">•</span>
                              <span>{entry.wordCount} words</span>
                            </p>
                          </div>
                        </div>

                        {/* Preview of first response */}
                        <div className="bg-white/5 rounded-lg p-3 mb-3">
                          <p className="text-white/70 text-sm line-clamp-2">
                            {entry.responses.prompt1.substring(0, 150)}
                            {entry.responses.prompt1.length > 150 ? '...' : ''}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEntry(entry)}
                            className="bg-purple-500/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Entry
                          </Button>
                          {showDeleteConfirm === entry.cardId ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleDelete(entry.cardId)}
                                className="bg-red-500/80 hover:bg-red-600 text-white"
                              >
                                Confirm Delete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(null)}
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowDeleteConfirm(entry.cardId)}
                              className="bg-red-500/20 border-red-400/50 text-red-200 hover:bg-red-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full Entry Modal */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-black/95 text-white border-purple-500/50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                📖 Journal Entry
              </DialogTitle>
              <p className="text-sm text-purple-300">
                {formatDate(selectedEntry.date)} • {selectedEntry.wordCount} words
              </p>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Card Context */}
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-300 mb-2">Card Affirmation:</p>
                <p className="text-lg font-semibold text-purple-300">
                  {allCards.find(c => c.id === selectedEntry.cardId)?.affirmation}
                </p>
              </div>

              {/* Responses */}
              {['prompt1', 'prompt2', 'prompt3'].map((key, index) => {
                const response = selectedEntry.responses[key as keyof typeof selectedEntry.responses];
                if (!response.trim()) return null;

                return (
                  <div key={key} className="space-y-2">
                    <h3 className="text-purple-400 font-bold">Reflection {index + 1}</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{response}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

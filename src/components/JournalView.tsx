import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  getUserJournalEntries, 
  searchJournalEntries,
  getJournalStats,
  deleteJournalEntry,
  type JournalEntry,
  type JournalStats
} from '@/utils/journalTracking';
import { practiceCards } from '@/data/cardsExport';

interface JournalViewProps {
  userId: string;
  onSelectCard?: (cardId: number) => void;
}

export default function JournalView({ userId, onSelectCard }: JournalViewProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    refreshEntries();
  }, [userId, searchQuery]);

  const refreshEntries = () => {
    if (searchQuery) {
      setEntries(searchJournalEntries(userId, searchQuery));
    } else {
      setEntries(getUserJournalEntries(userId));
    }
    setStats(getJournalStats(userId));
  };

  const handleDelete = (cardId: number) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      deleteJournalEntry(userId, cardId);
      refreshEntries();
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">📖 Your Journal</h2>
        <p className="text-gray-300">
          Reflections on your daily PRACTICE journey
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.totalEntries}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300">Total Words</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.totalWords.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.currentStreak} 🔥</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300">Longest Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.longestEntry}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search your journal..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
        />
        {searchQuery && (
          <Button
            onClick={() => setSearchQuery('')}
            variant="outline"
            className="bg-white/10 border-purple-500/30 text-white hover:bg-white/20"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Entries List */}
      <ScrollArea className="h-[600px] rounded-lg border border-purple-500/30 p-4 bg-black/20">
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="bg-white/5 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 text-lg">
                  {searchQuery 
                    ? 'No entries match your search'
                    : 'Start journaling to see your entries here'}
                </p>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry: JournalEntry) => {
              const card = practiceCards.find((c) => c.id === entry.cardId);
              if (!card) return null;

              return (
                <Card 
                  key={entry.id}
                  className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30 backdrop-blur-sm hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => onSelectCard?.(entry.cardId)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                            Card #{entry.cardId}
                          </Badge>
                          <span className="text-gray-400 text-sm">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        <CardTitle className="text-white text-lg mb-2">
                          {card.affirmation}
                        </CardTitle>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.cardId);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        🗑️
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Response Previews */}
                    {entry.responses.prompt1 && (
                      <div className="bg-white/5 rounded p-3">
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {entry.responses.prompt1}
                        </p>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {entry.wordCount} words
                      </span>
                      <span className="text-purple-400 hover:text-purple-300">
                        Click to view card →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

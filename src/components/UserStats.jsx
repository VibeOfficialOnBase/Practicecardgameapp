
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Flame, Activity, BookOpen, MessageSquare, Trophy, GitBranch } from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => {
    const Icon = icon;
    return (
        <Card className="p-4 flex items-center gap-4 bg-white/5 border-white/10">
            <div className={`p-3 rounded-lg bg-${color}-500/20`}>
                <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <div>
                <p className="text-sm text-white/70">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </Card>
    );
};

export default function UserStats() {
    const { user } = useAuth();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['userStats', user?.email],
        queryFn: async () => {
            if (!user) return null;

            const [practices, journal, moods, gameScores, vibeagotchi] = await Promise.all([
                base44.entities.DailyPracticeSession.filter({ user_email: user.email, completed: true }),
                base44.entities.JournalEntry.filter({ user_email: user.email }),
                base44.entities.MoodLog.filter({ user_email: user.email }),
                base44.entities.GameScore.filter({ user_email: user.email }),
                base44.entities.VibeagotchiState.filter({ user_email: user.email })
            ]);

            const chakraBlasterHighScore = Math.max(0, ...gameScores
                .filter(s => s.game_type === 'chakra_blaster')
                .map(s => s.score));

            const longestStreak = Math.max(0, ...practices.map(p => p.current_streak));

            return {
                totalPractices: practices.length,
                streak: longestStreak,
                journalEntries: journal.length,
                moodLogs: moods.length,
                chakraBlasterHighScore,
                vibeagotchiStage: vibeagotchi[0]?.evolution_stage || 'Egg'
            };
        },
        enabled: !!user
    });

    if (isLoading) {
        return <div className="text-center">Loading stats...</div>;
    }

    if (!stats) {
        return <div className="text-center">No stats to display.</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={Activity} label="Practices Completed" value={stats.totalPractices} color="purple" />
            <StatCard icon={Flame} label="Longest Streak" value={`${stats.streak} days`} color="orange" />
            <StatCard icon={BookOpen} label="Journal Entries" value={stats.journalEntries} color="blue" />
            <StatCard icon={MessageSquare} label="Mood Logs" value={stats.moodLogs} color="green" />
            <StatCard icon={Trophy} label="Chakra Blaster High Score" value={stats.chakraBlasterHighScore} color="yellow" />
            <StatCard icon={GitBranch} label="VibeAGotchi Stage" value={stats.vibeagotchiStage} color="pink" />
        </div>
    );
}

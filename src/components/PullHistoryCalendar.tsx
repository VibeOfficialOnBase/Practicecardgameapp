import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserPulls, type UserPull } from '@/utils/pullTracking';
import { practiceCards } from '@/data/cardsExport';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PullHistoryCalendarProps {
  username: string;
  onCardClick?: (cardId: number) => void;
}

export function PullHistoryCalendar({ username, onCardClick }: PullHistoryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pulls = getUserPulls(username);

  // Create a map of dates to pulls
  const pullsByDate = new Map<string, UserPull>();
  pulls.forEach(pull => {
    pullsByDate.set(pull.date, pull);
  });

  // Get calendar data for current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Generate calendar grid
  const calendarDays: (Date | null)[] = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasPull = (date: Date): boolean => {
    return pullsByDate.has(date.toDateString());
  };

  const getPull = (date: Date): UserPull | undefined => {
    return pullsByDate.get(date.toDateString());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">📅 Pull History</h2>
        <p className="text-gray-300">
          View your daily card pulling history
        </p>
      </div>

      <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span>{monthNames[month]} {year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={goToToday}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                >
                  Today
                </Button>
                <Button
                  onClick={goToPreviousMonth}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={goToNextMonth}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Day names header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center text-white/60 text-xs font-semibold py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const isPulled = hasPull(date);
              const pull = getPull(date);
              const card = pull ? practiceCards.find(c => c.id === pull.cardId) : null;
              const today = isToday(date);

              return (
                <motion.div
                  key={date.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={isPulled ? { scale: 1.05 } : {}}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                    transition-all duration-200 cursor-pointer relative
                    ${isPulled 
                      ? 'bg-gradient-to-br from-green-500/80 to-emerald-500/80 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }
                    ${today ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent' : ''}
                  `}
                  onClick={() => {
                    if (isPulled && pull && onCardClick) {
                      onCardClick(pull.cardId);
                    }
                  }}
                  title={isPulled && card ? card.affirmation : undefined}
                >
                  <span className="relative z-10">{date.getDate()}</span>
                  {isPulled && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  )}
                  {today && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-emerald-500" />
              <span className="text-white/80">Pulled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white/5" />
              <span className="text-white/80">Not Pulled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white/5 ring-2 ring-yellow-400" />
              <span className="text-white/80">Today</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">This Month</p>
              <p className="text-white font-bold text-xl">
                {pulls.filter(p => {
                  const pullDate = new Date(p.date);
                  return pullDate.getMonth() === month && pullDate.getFullYear() === year;
                }).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">Total Pulls</p>
              <p className="text-white font-bold text-xl">{pulls.length}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">Current Streak</p>
              <p className="text-white font-bold text-xl">
                {(() => {
                  if (pulls.length === 0) return 0;
                  let streak = 1;
                  for (let i = pulls.length - 1; i > 0; i--) {
                    const current = new Date(pulls[i].date);
                    const prev = new Date(pulls[i - 1].date);
                    const diffTime = Math.abs(current.getTime() - prev.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                      streak++;
                    } else {
                      break;
                    }
                  }
                  return streak;
                })()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

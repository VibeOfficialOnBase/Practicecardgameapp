import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Sun, Moon, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalizedRemindersProps {
  username: string;
  onReminderSet: (time: string) => void;
}

export function PersonalizedReminders({ username, onReminderSet }: PersonalizedRemindersProps) {
  const [optimalTime, setOptimalTime] = useState<string>('09:00');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [customTime, setCustomTime] = useState<string>('09:00');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem(`practice_reminder_${username}`);
    if (saved) {
      const data = JSON.parse(saved);
      setReminderEnabled(data.enabled || false);
      setCustomTime(data.time || '09:00');
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Analyze user's optimal time
    analyzeOptimalTime();
  }, [username]);

  const analyzeOptimalTime = () => {
    // Get user's pull history
    const pulls = localStorage.getItem(`practice_pulls_${username}`);
    if (!pulls) return;

    try {
      const pullData = JSON.parse(pulls);
      const pullTimes = pullData.map((p: any) => new Date(p.date).getHours());
      
      // Find most common hour
      const timeFrequency: Record<number, number> = {};
      pullTimes.forEach((hour: number) => {
        timeFrequency[hour] = (timeFrequency[hour] || 0) + 1;
      });

      const mostCommonHour = Object.entries(timeFrequency)
        .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0];

      if (mostCommonHour) {
        const hour = parseInt(mostCommonHour);
        setOptimalTime(`${hour.toString().padStart(2, '0')}:00`);
      }
    } catch (error) {
      console.error('Error analyzing optimal time:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      toast.success('🔔 Notifications enabled! We\'ll remind you at your chosen time.');
      return true;
    } else {
      toast.error('Please enable notifications to receive reminders');
      return false;
    }
  };

  const handleEnableReminder = async () => {
    const permitted = await requestNotificationPermission();
    if (!permitted) return;

    setReminderEnabled(true);
    
    // Save preference
    localStorage.setItem(
      `practice_reminder_${username}`,
      JSON.stringify({
        enabled: true,
        time: customTime,
      })
    );

    onReminderSet(customTime);
    toast.success(`✨ Daily reminder set for ${customTime}!`);
  };

  const handleDisableReminder = () => {
    setReminderEnabled(false);
    localStorage.setItem(
      `practice_reminder_${username}`,
      JSON.stringify({
        enabled: false,
        time: customTime,
      })
    );
    toast.info('Reminders disabled');
  };

  const suggestedTimes = [
    { time: '06:00', icon: <Sun className="w-4 h-4" />, label: 'Early Bird', description: 'Start your day' },
    { time: '09:00', icon: <Sun className="w-4 h-4" />, label: 'Morning', description: 'Mid-morning motivation' },
    { time: '12:00', icon: <Sun className="w-4 h-4" />, label: 'Lunch', description: 'Midday practice' },
    { time: '18:00', icon: <Moon className="w-4 h-4" />, label: 'Evening', description: 'After work' },
    { time: '21:00', icon: <Moon className="w-4 h-4" />, label: 'Night', description: 'Before bed' },
  ];

  return (
    <Card className="glass-card border-2 border-blue-400/30 bg-gradient-to-br from-blue-950/40 to-indigo-950/40">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-400" />
          Smart Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-purple-300 text-sm font-semibold mb-1">
                AI Suggestion
              </p>
              <p className="text-white text-sm">
                Based on your history, you're most active at <span className="font-bold text-purple-300">{optimalTime}</span>.
                Set a reminder for this time?
              </p>
              <Button
                onClick={() => {
                  setCustomTime(optimalTime);
                  handleEnableReminder();
                }}
                size="sm"
                variant="outline"
                className="mt-3 border-purple-400/50 text-purple-300 hover:bg-purple-500/20"
              >
                Use Suggested Time
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Time Presets */}
        <div>
          <p className="text-white/60 text-sm mb-3">Quick Presets</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedTimes.map((preset) => (
              <button
                key={preset.time}
                onClick={() => setCustomTime(preset.time)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  customTime === preset.time
                    ? 'bg-blue-900/40 border-blue-400/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {preset.icon}
                  <span className="text-white font-semibold text-sm">{preset.label}</span>
                </div>
                <p className="text-white/60 text-xs">{preset.description}</p>
                <p className="text-blue-300 text-sm font-mono mt-1">{preset.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Time Picker */}
        <div>
          <label className="text-white/60 text-sm block mb-2">
            Or choose a custom time
          </label>
          <input
            type="time"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Enable/Disable Button */}
        {reminderEnabled ? (
          <Button
            onClick={handleDisableReminder}
            variant="outline"
            size="lg"
            className="w-full border-red-400/50 text-red-300 hover:bg-red-500/20"
          >
            <Bell className="w-5 h-5 mr-2" />
            Disable Reminders
          </Button>
        ) : (
          <Button
            onClick={handleEnableReminder}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            <Bell className="w-5 h-5 mr-2" />
            Enable Daily Reminder
          </Button>
        )}

        {/* Notification Permission Status */}
        {notificationPermission !== 'granted' && (
          <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-400/30">
            <p className="text-yellow-200 text-xs text-center">
              ⚠️ Notification permission required for reminders
            </p>
          </div>
        )}

        {/* Features */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Features</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span>Smart time suggestions based on your habits</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span>Streak protection alerts</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span>Achievement unlock notifications</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

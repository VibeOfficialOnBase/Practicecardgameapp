import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Clock } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Input } from '@/components/ui/input';

interface NotificationSettingsProps {
  username: string;
}

export function NotificationSettings({ username }: NotificationSettingsProps) {
  const {
    isSupported,
    isSubscribed,
    hasPermission,
    preferences,
    isLoading,
    subscribe,
    unsubscribe,
    updatePreferences,
  } = usePushNotifications(username);

  if (!isSupported) {
    return (
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BellOff className="w-5 h-5" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription className="text-white/70">
            Your browser doesn't support push notifications
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bell className="w-5 h-5" />
          Push Notifications
        </CardTitle>
        <CardDescription className="text-white/70">
          Get reminders to pull your daily card and track your streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="notifications-enabled" className="text-white font-medium">
              Enable Notifications
            </Label>
            <p className="text-sm text-white/60">
              Receive daily reminders and updates
            </p>
          </div>
          <Button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={isLoading}
            variant={isSubscribed ? 'destructive' : 'default'}
            size="sm"
          >
            {isLoading ? 'Loading...' : isSubscribed ? 'Disable' : 'Enable'}
          </Button>
        </div>

        {isSubscribed && (
          <>
            {/* Daily Reminder */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="space-y-1">
                <Label htmlFor="daily-reminder" className="text-white font-medium">
                  Daily Reminder
                </Label>
                <p className="text-sm text-white/60">
                  Get reminded to pull your daily card
                </p>
              </div>
              <Switch
                id="daily-reminder"
                checked={preferences.dailyReminder}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ dailyReminder: checked })
                }
              />
            </div>

            {/* Reminder Time */}
            {preferences.dailyReminder && (
              <div className="space-y-2 pl-4">
                <Label htmlFor="reminder-time" className="text-white font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Reminder Time
                </Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={preferences.reminderTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updatePreferences({ reminderTime: e.target.value })
                  }
                  className="glass-card border-white/20 text-white max-w-[150px]"
                />
              </div>
            )}

            {/* Streak Reminder */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="space-y-1">
                <Label htmlFor="streak-reminder" className="text-white font-medium">
                  Streak Protection
                </Label>
                <p className="text-sm text-white/60">
                  Get notified if you're about to lose your streak
                </p>
              </div>
              <Switch
                id="streak-reminder"
                checked={preferences.streakReminder}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ streakReminder: checked })
                }
              />
            </div>

            {/* Achievement Notifications */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="space-y-1">
                <Label htmlFor="achievement-notifications" className="text-white font-medium">
                  Achievement Alerts
                </Label>
                <p className="text-sm text-white/60">
                  Celebrate new achievements instantly
                </p>
              </div>
              <Switch
                id="achievement-notifications"
                checked={preferences.achievementNotifications}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ achievementNotifications: checked })
                }
              />
            </div>
          </>
        )}

        {/* Permission Status */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                hasPermission ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span className="text-white/70">
              {hasPermission
                ? 'Notification permission granted'
                : 'Notification permission not granted'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

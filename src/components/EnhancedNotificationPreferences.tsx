import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Users, Trophy, Flame, TrendingUp, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EnhancedNotificationPreferencesProps {
  username: string;
}

interface NotificationPrefs {
  dailyReminder: boolean;
  streakProtection: boolean;
  achievements: boolean;
  communityActivity: boolean;
  friendsActivity: boolean;
  milestones: boolean;
  fomoNotifications: boolean;
  weeklyDigest: boolean;
  partnerReminders: boolean;
  challengeUpdates: boolean;
}

export function EnhancedNotificationPreferences({ username }: EnhancedNotificationPreferencesProps) {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    dailyReminder: true,
    streakProtection: true,
    achievements: true,
    communityActivity: true,
    friendsActivity: true,
    milestones: true,
    fomoNotifications: false,
    weeklyDigest: true,
    partnerReminders: true,
    challengeUpdates: true,
  });

  useEffect(() => {
    loadPreferences();
  }, [username]);

  const loadPreferences = () => {
    const stored = localStorage.getItem(`practice_notification_prefs_v2_${username}`);
    if (stored) {
      setPrefs(JSON.parse(stored));
    }
  };

  const updatePreference = (key: keyof NotificationPrefs, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    localStorage.setItem(`practice_notification_prefs_v2_${username}`, JSON.stringify(updated));
  };

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-white/70">
          Choose which notifications you'd like to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily & Streak */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Daily Practice
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="daily-reminder" className="text-white font-medium">
                Daily Reminder
              </Label>
              <p className="text-sm text-white/60">
                Reminds you to pull your daily card
              </p>
            </div>
            <Switch
              id="daily-reminder"
              checked={prefs.dailyReminder}
              onCheckedChange={(checked: boolean) => updatePreference('dailyReminder', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="streak-protection" className="text-white font-medium">
                Streak Protection Alert
              </Label>
              <p className="text-sm text-white/60">
                Warns you before you lose your streak
              </p>
            </div>
            <Switch
              id="streak-protection"
              checked={prefs.streakProtection}
              onCheckedChange={(checked: boolean) => updatePreference('streakProtection', checked)}
            />
          </div>
        </div>

        {/* Achievements & Milestones */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Progress & Achievements
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="achievements" className="text-white font-medium">
                Achievement Unlocks
              </Label>
              <p className="text-sm text-white/60">
                Get notified when you unlock new achievements
              </p>
            </div>
            <Switch
              id="achievements"
              checked={prefs.achievements}
              onCheckedChange={(checked: boolean) => updatePreference('achievements', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="milestones" className="text-white font-medium">
                Milestone Celebrations
              </Label>
              <p className="text-sm text-white/60">
                Celebrate reaching streak milestones
              </p>
            </div>
            <Switch
              id="milestones"
              checked={prefs.milestones}
              onCheckedChange={(checked: boolean) => updatePreference('milestones', checked)}
            />
          </div>
        </div>

        {/* Community & Social */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Community & Social
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="community-activity" className="text-white font-medium">
                Community Activity
              </Label>
              <p className="text-sm text-white/60">
                Updates about community milestones
              </p>
            </div>
            <Switch
              id="community-activity"
              checked={prefs.communityActivity}
              onCheckedChange={(checked: boolean) => updatePreference('communityActivity', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="friends-activity" className="text-white font-medium">
                Friends Activity
              </Label>
              <p className="text-sm text-white/60">
                When your friends pull cards or achieve milestones
              </p>
            </div>
            <Switch
              id="friends-activity"
              checked={prefs.friendsActivity}
              onCheckedChange={(checked: boolean) => updatePreference('friendsActivity', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="partner-reminders" className="text-white font-medium">
                Partner Reminders
              </Label>
              <p className="text-sm text-white/60">
                Accountability partner check-ins
              </p>
            </div>
            <Switch
              id="partner-reminders"
              checked={prefs.partnerReminders}
              onCheckedChange={(checked: boolean) => updatePreference('partnerReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="challenge-updates" className="text-white font-medium">
                Challenge Updates
              </Label>
              <p className="text-sm text-white/60">
                Progress in friend challenges
              </p>
            </div>
            <Switch
              id="challenge-updates"
              checked={prefs.challengeUpdates}
              onCheckedChange={(checked: boolean) => updatePreference('challengeUpdates', checked)}
            />
          </div>
        </div>

        {/* Engagement */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Engagement & Motivation
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="fomo-notifications" className="text-white font-medium">
                FOMO Notifications
              </Label>
              <p className="text-sm text-white/60">
                "X people just pulled their cards!"
              </p>
            </div>
            <Switch
              id="fomo-notifications"
              checked={prefs.fomoNotifications}
              onCheckedChange={(checked: boolean) => updatePreference('fomoNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="weekly-digest" className="text-white font-medium">
                Weekly Digest
              </Label>
              <p className="text-sm text-white/60">
                Summary of your week in PRACTICE
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={prefs.weeklyDigest}
              onCheckedChange={(checked: boolean) => updatePreference('weeklyDigest', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

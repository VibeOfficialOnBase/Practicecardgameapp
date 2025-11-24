import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bell, BellOff, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NotificationSettings({ userProfile }) {
  const [prefs, setPrefs] = useState(userProfile?.notification_preferences || {
    daily_reminders: true,
    game_reminders: true,
    community_notifications: true,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  });
  const [permissionStatus, setPermissionStatus] = useState('default');
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const updatePreferences = useMutation({
    mutationFn: async (newPrefs) => {
      if (userProfile?.id) {
        await base44.entities.UserProfile.update(userProfile.id, {
          notification_preferences: newPrefs
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  });

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted' && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('PRACTICE Notifications Enabled', {
          body: 'You\'ll now receive reminders and updates',
          icon: '/icon-192x192.png',
          badge: '/icon-96x96.png'
        });
      }
    }
  };

  const handleToggle = (key) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    updatePreferences.mutate(newPrefs);
  };

  const handleTimeChange = (key, value) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    updatePreferences.mutate(newPrefs);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-organic p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold ensure-readable-strong flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notification Settings
        </h2>
      </div>

      {permissionStatus !== 'granted' && (
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
          <p className="text-sm ensure-readable mb-3">
            Enable notifications to receive reminders and stay connected with your practice.
          </p>
          <Button onClick={requestPermission} className="w-full bg-gradient-to-r from-amber-600 to-orange-600">
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <ToggleItem
          label="Daily Practice Reminders"
          description="Get reminded to pull your daily card"
          checked={prefs.daily_reminders}
          onChange={() => handleToggle('daily_reminders')}
        />

        <ToggleItem
          label="Game Reminders"
          description="Notifications for new challenges and achievements"
          checked={prefs.game_reminders}
          onChange={() => handleToggle('game_reminders')}
        />

        <ToggleItem
          label="Community Notifications"
          description="Friend requests, likes, and replies"
          checked={prefs.community_notifications}
          onChange={() => handleToggle('community_notifications')}
        />

        <div className="border-t border-white/10 pt-4 mt-4">
          <ToggleItem
            label="Quiet Hours"
            description="Pause notifications during specific hours"
            checked={prefs.quiet_hours_enabled}
            onChange={() => handleToggle('quiet_hours_enabled')}
            icon={Moon}
          />

          {prefs.quiet_hours_enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 grid grid-cols-2 gap-4 pl-10"
            >
              <div>
                <label className="text-xs text-label mb-1 block">Start</label>
                <Input
                  type="time"
                  value={prefs.quiet_hours_start}
                  onChange={(e) => handleTimeChange('quiet_hours_start', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-label mb-1 block">End</label>
                <Input
                  type="time"
                  value={prefs.quiet_hours_end}
                  onChange={(e) => handleTimeChange('quiet_hours_end', e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ToggleItem({ label, description, checked, onChange, icon: Icon }) {
  return (
    <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
      <div className="flex items-center gap-3 flex-1">
        {Icon && <Icon className="w-5 h-5 text-purple-400" />}
        <div className="flex-1">
          <p className="font-semibold ensure-readable">{label}</p>
          <p className="text-xs text-label">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-600'
        }`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
          animate={{ left: checked ? '28px' : '4px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
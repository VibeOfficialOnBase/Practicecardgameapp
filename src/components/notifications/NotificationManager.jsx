import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function NotificationManager({ userEmail }) {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', userEmail],
    queryFn: async () => {
      const pending = await base44.entities.NotificationQueue.filter({
        user_email: userEmail,
        sent: false,
        scheduled_for: { $lte: new Date().toISOString() }
      });
      return pending;
    },
    enabled: !!userEmail,
    refetchInterval: 60000 // Check every minute
  });

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted' && notifications.length > 0) {
      notifications.forEach(async (notif) => {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(notif.title, {
          body: notif.message,
          icon: '/icon-192x192.png',
          badge: '/icon-96x96.png',
          data: { url: notif.action_url || '/' }
        });

        await base44.entities.NotificationQueue.update(notif.id, {
          sent: true,
          sent_at: new Date().toISOString()
        });
      });
    }
  }, [notifications]);

  return null;
}
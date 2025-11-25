import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner'; // Assuming sonner is available or we use standard toast

export default function NotificationManager({ userEmail }) {
  // Poll for notifications from the backend
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', userEmail],
    queryFn: async () => {
      // In a real app, this would fetch from a backend queue table
      // For now, we can simulate checks or fetch from a Supabase table if it exists
      const pending = await base44.entities.NotificationQueue.filter({
        user_email: userEmail,
        sent: false,
        // scheduled_for: { $lte: new Date().toISOString() } // Simple filter
      });
      // Filter manually for date if API doesn't support complex queries in this mock client
      const now = new Date();
      return pending.filter(n => !n.scheduled_for || new Date(n.scheduled_for) <= now);
    },
    enabled: !!userEmail,
    refetchInterval: 30000 // Check every 30 seconds
  });

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach(async (notif) => {
        // Trigger Browser Notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            // Try Service Worker first
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(notif.title, {
              body: notif.message,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              data: { url: notif.action_url || '/' },
              vibrate: [200, 100, 200]
            });
          } catch (e) {
            // Fallback to standard Notification API
            new Notification(notif.title, {
                body: notif.message,
                icon: '/pwa-192x192.png'
            });
          }
        } else {
            // Fallback to In-App Toast
            toast(notif.title, {
                description: notif.message,
                action: notif.action_url ? {
                    label: 'View',
                    onClick: () => window.location.href = notif.action_url
                } : undefined
            });
        }

        // Mark as sent
        await base44.entities.NotificationQueue.update(notif.id, {
          sent: true,
          sent_at: new Date().toISOString()
        });
      });
    }
  }, [notifications]);

  // Request permission on mount if not denied
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
        // Don't spam immediately, maybe wait for user interaction or profile setting
        // But for this task, we ensure the capability exists
    }
  }, []);

  return null;
}

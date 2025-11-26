import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NotificationPreferences {
  dailyReminder: boolean;
  reminderTime: string; // HH:MM format
  streakReminder: boolean;
  achievementNotifications: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  dailyReminder: true,
  reminderTime: '09:00',
  streakReminder: true,
  achievementNotifications: true,
};

export function usePushNotifications(username: string) {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if push notifications are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      // Load preferences from localStorage
      const savedPrefs = localStorage.getItem(`practice_notification_prefs_${username}`);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
      
      // Check current subscription status
      checkSubscription();
    }
  }, [username]);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();
      setSubscription(existingSub);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('Push notifications are not supported on this device');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
  };

  const subscribe = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Request permission first
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8-fRk2V5PBUXs0fBH3X4fHl8rBINzAn0a-lFwmqPGJhfbCJlvzj_0I'
        ),
      });

      setSubscription(newSubscription);

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: newSubscription.toJSON(),
          username,
          preferences,
        }),
      });

      // Store locally
      localStorage.setItem(`practice_notification_sub_${username}`, JSON.stringify(newSubscription.toJSON()));
      
      toast.success('Push notifications enabled! 🔔');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast.error('Failed to enable notifications');
      setIsLoading(false);
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        localStorage.removeItem(`practice_notification_sub_${username}`);
        toast.success('Push notifications disabled');
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast.error('Failed to disable notifications');
      setIsLoading(false);
      return false;
    }
  };

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem(`practice_notification_prefs_${username}`, JSON.stringify(updated));
    
    // If subscribed, update server
    if (subscription) {
      fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          username,
          preferences: updated,
        }),
      });
    }
  };

  const scheduleLocalNotification = (title: string, body: string, delayMs: number = 0) => {
    if (!isSupported || Notification.permission !== 'granted') {
      return;
    }

    setTimeout(() => {
      if (typeof window !== 'undefined' && document.hidden) {
        // Only show if app is in background
        new Notification(title, {
          body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: 'local-notification',
          requireInteraction: false,
        });
      }
    }, delayMs);
  };

  return {
    isSupported,
    subscription,
    preferences,
    isLoading,
    isSubscribed: !!subscription,
    hasPermission: typeof window !== 'undefined' && Notification.permission === 'granted',
    subscribe,
    unsubscribe,
    updatePreferences,
    scheduleLocalNotification,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

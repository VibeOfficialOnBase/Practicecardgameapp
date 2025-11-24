import offlineDB from './offlineDB';
import { base44 } from '@/api/base44Client';

class SyncManager {
  constructor() {
    this.syncing = false;
    this.listeners = [];
    
    // Initialize database
    offlineDB.init().catch(console.error);

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  async queuePractice(practiceData) {
    const id = `practice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const action = {
      id,
      ...practiceData,
      synced: false,
      queuedAt: Date.now()
    };

    await offlineDB.put('practices', action);
    
    // Register background sync if supported
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-practices');
    } else if (navigator.onLine) {
      // Fallback: sync immediately if online
      await this.syncPendingPractices();
    }

    return id;
  }

  async syncPendingPractices() {
    if (this.syncing || !navigator.onLine) return { success: false, reason: 'offline' };

    this.syncing = true;
    this.notifyListeners({ type: 'sync-start' });

    try {
      const pending = await offlineDB.getPendingPractices();
      const results = [];

      for (const practice of pending) {
        try {
          // Create practice record
          await base44.entities.DailyPractice.create({
            practice_card_id: practice.cardId,
            completed: true,
            completion_date: new Date(practice.completedAt).toISOString(),
            reflection: practice.reflection,
            rating: practice.rating
          });

          // Mark as synced
          await offlineDB.put('practices', { ...practice, synced: true });
          results.push({ id: practice.id, success: true });
        } catch (error) {
          console.error('Failed to sync practice:', error);
          results.push({ id: practice.id, success: false, error });
        }
      }

      this.notifyListeners({ type: 'sync-complete', results });
      return { success: true, synced: results.filter(r => r.success).length };
    } catch (error) {
      this.notifyListeners({ type: 'sync-error', error });
      return { success: false, error };
    } finally {
      this.syncing = false;
    }
  }

  async getPendingCount() {
    const pending = await offlineDB.getPendingPractices();
    return pending.length;
  }

  async cacheCard(card) {
    await offlineDB.put('cards', {
      id: card.id,
      data: card,
      cachedAt: Date.now()
    });
  }

  async getCachedCard(cardId) {
    const cached = await offlineDB.get('cards', cardId);
    return cached?.data;
  }

  async cacheCommunityPosts(posts) {
    // Keep only last 50 posts
    const toCache = posts.slice(0, 50).map(post => ({
      id: post.id,
      data: post,
      cachedAt: Date.now()
    }));

    for (const post of toCache) {
      await offlineDB.put('communityCache', post);
    }
  }

  async getCachedCommunityPosts() {
    const cached = await offlineDB.getAll('communityCache');
    return cached
      .sort((a, b) => b.cachedAt - a.cachedAt)
      .map(item => item.data);
  }

  async cacheLeaderboard(leaderboard) {
    await offlineDB.put('leaderboardCache', {
      id: 'current',
      data: leaderboard,
      cachedAt: Date.now()
    });
  }

  async getCachedLeaderboard() {
    const cached = await offlineDB.get('leaderboardCache', 'current');
    return cached?.data;
  }

  async cleanOldData() {
    await offlineDB.cleanOldCache('cards');
    await offlineDB.cleanOldCache('communityCache', 3 * 24 * 60 * 60 * 1000); // 3 days
  }

  handleOnline() {
    this.notifyListeners({ type: 'online' });
    this.syncPendingPractices();
  }

  handleOffline() {
    this.notifyListeners({ type: 'offline' });
  }

  onStatusChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(event) {
    this.listeners.forEach(cb => cb(event));
  }
}

const syncManager = new SyncManager();

export default syncManager;
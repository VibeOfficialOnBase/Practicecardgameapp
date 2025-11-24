// IndexedDB wrapper for offline data storage
const DB_NAME = 'practice-offline';
const DB_VERSION = 1;

class OfflineDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store for pending practice completions
        if (!db.objectStoreNames.contains('practices')) {
          const practiceStore = db.createObjectStore('practices', { keyPath: 'id' });
          practiceStore.createIndex('synced', 'synced', { unique: false });
          practiceStore.createIndex('completedAt', 'completedAt', { unique: false });
        }

        // Store for cached cards
        if (!db.objectStoreNames.contains('cards')) {
          const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
          cardStore.createIndex('cachedAt', 'cachedAt', { unique: false });
        }

        // Store for cached user data
        if (!db.objectStoreNames.contains('userCache')) {
          db.createObjectStore('userCache', { keyPath: 'userId' });
        }

        // Store for cached leaderboard
        if (!db.objectStoreNames.contains('leaderboardCache')) {
          db.createObjectStore('leaderboardCache', { keyPath: 'id' });
        }

        // Store for cached community posts
        if (!db.objectStoreNames.contains('communityCache')) {
          const communityStore = db.createObjectStore('communityCache', { keyPath: 'id' });
          communityStore.createIndex('cachedAt', 'cachedAt', { unique: false });
        }
      };
    });
  }

  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return store.add(data);
  }

  async put(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return store.put(data);
  }

  async get(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return store.delete(key);
  }

  async clear(storeName) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return store.clear();
  }

  async getPendingPractices() {
    const transaction = this.db.transaction(['practices'], 'readonly');
    const store = transaction.objectStore('practices');
    const index = store.index('synced');
    return new Promise((resolve, reject) => {
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async cleanOldCache(storeName, maxAge = 7 * 24 * 60 * 60 * 1000) {
    const all = await this.getAll(storeName);
    const now = Date.now();
    const promises = all
      .filter(item => item.cachedAt && (now - item.cachedAt) > maxAge)
      .map(item => this.delete(storeName, item.id));
    return Promise.all(promises);
  }
}

const offlineDB = new OfflineDB();

export default offlineDB;
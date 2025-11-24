class SoundManager {
  constructor() {
    this.sounds = new Map();
    this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.7');
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
  }

  preload(soundMap) {
    Object.entries(soundMap).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.volume = this.volume;
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    });
  }

  play(soundName, customVolume) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = customVolume !== undefined ? customVolume : this.volume;
      sound.play().catch(err => console.log('Sound play failed:', err));
    }
  }

  stop(soundName) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  stopAll() {
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  setVolume(volume) {
    this.volume = volume;
    localStorage.setItem('soundVolume', volume.toString());
    this.sounds.forEach(sound => {
      sound.volume = volume;
    });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('soundEnabled', enabled.toString());
    if (!enabled) this.stopAll();
  }

  getVolume() {
    return this.volume;
  }

  isEnabled() {
    return this.enabled;
  }
}

const soundLibrary = {
  'card-shuffle': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'card-flip': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'practice-complete': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'achievement-unlock': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'streak-milestone': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'button-tap': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'game-shoot': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'game-hit': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'game-match': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'game-over': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'level-complete': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
  'success': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAAg',
};

export const soundManager = new SoundManager();
soundManager.preload(soundLibrary);
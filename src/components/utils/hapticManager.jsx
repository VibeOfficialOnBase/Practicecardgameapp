const HapticPatterns = {
  light: [10],
  medium: [20],
  strong: [50],
  success: [10, 50, 10],
  celebration: [50, 100, 50, 100, 50],
  milestone: [100, 50, 100, 50, 100]
};

class HapticManager {
  constructor() {
    this.enabled = localStorage.getItem('hapticEnabled') !== 'false';
    this.intensity = localStorage.getItem('hapticIntensity') || 'medium';
    this.supported = 'vibrate' in navigator;
  }

  trigger(patternName) {
    if (!this.enabled || !this.supported) return;
    
    let pattern = HapticPatterns[patternName] || HapticPatterns.light;
    
    if (this.intensity === 'light') {
      pattern = pattern.map(v => Math.floor(v * 0.5));
    } else if (this.intensity === 'strong') {
      pattern = pattern.map(v => Math.floor(v * 1.5));
    }
    
    navigator.vibrate(pattern);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('hapticEnabled', enabled.toString());
  }

  setIntensity(intensity) {
    this.intensity = intensity;
    localStorage.setItem('hapticIntensity', intensity);
  }

  isEnabled() {
    return this.enabled;
  }

  getIntensity() {
    return this.intensity;
  }

  isSupported() {
    return this.supported;
  }
}

export const hapticManager = new HapticManager();
export { HapticPatterns };
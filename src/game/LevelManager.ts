// Lightweight LevelManager: explicit state machine and authoritative time
// Usage:
//   const lm = new LevelManager(120);
//   lm.onStateChange(s => ...);
//   lm.start();
//   in main loop call lm.update(dt);

export type LevelState = 'Idle' | 'Starting' | 'Running' | 'Paused' | 'Ending' | 'Completed';
type Listener = (state: LevelState) => void;

export class LevelManager {
  private state: LevelState = 'Idle';
  private listeners: Listener[] = [];
  public levelTime = 0; // seconds since level start
  public levelDuration: number; // seconds

  // optional: small startup and end delays to let systems prepare/clean up
  private startDelay = 0.25;
  private endDelay = 0.5;

  constructor(levelDuration = 60) {
    this.levelDuration = levelDuration;
  }

  onStateChange(cb: Listener) { this.listeners.push(cb); }

  private emit() { this.listeners.forEach(cb => cb(this.state)); }

  start() {
    if (this.state !== 'Idle' && this.state !== 'Completed') return;
    this.levelTime = 0;
    this.setState('Starting');
    setTimeout(() => {
      if (this.state === 'Starting') this.setState('Running');
    }, this.startDelay * 1000);
  }

  update(dt: number) {
    if (this.state !== 'Running') return;
    this.levelTime += dt;
    if (this.levelTime >= this.levelDuration) {
      this.end();
    }
  }

  pause() { if (this.state === 'Running') this.setState('Paused'); }
  resume() { if (this.state === 'Paused') this.setState('Running'); }

  end() {
    if (this.state !== 'Running' && this.state !== 'Paused') return;
    this.setState('Ending');
    setTimeout(() => {
      if (this.state === 'Ending') this.setState('Completed');
    }, this.endDelay * 1000);
  }

  private setState(s: LevelState) {
    this.state = s;
    this.emit();
  }

  getState() { return this.state; }
}

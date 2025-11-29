// SpawnManager: dt-accumulation approach, rate-limiting, wave and schedule support.
// - spawnCb(factoryId?) should create and return the entity instance (or enqueue spawn).
// - The manager prevents burstiness by capping spawns per second and supports waves/schedules.

type Wave = { afterSeconds: number; count: number; ratePerSecond?: number; _done?: boolean };
type Scheduled = { time: number; factoryId?: string; _done?: boolean };

export type SpawnPolicy =
  | { type: 'continuous'; ratePerSecond: number; maxBurst?: number }
  | { type: 'wave'; waves: Wave[] }
  | { type: 'schedule'; schedule: Scheduled[] };

export type SpawnCallback = (factoryId?: string) => void;

export class SpawnManager {
  private acc = 0; // accumulated seconds
  private policy: SpawnPolicy | null = null;
  private lastSpawnTimestamps: number[] = []; // ms timestamps for rate limit
  private spawnCb: SpawnCallback;
  private maxPerSecondCap = 20; // absolute safety cap

  constructor(spawnCb: SpawnCallback) {
    this.spawnCb = spawnCb;
  }

  setPolicy(p: SpawnPolicy | null) {
    this.policy = p;
    this.acc = 0;
    this.lastSpawnTimestamps.length = 0;
    // clear done flags if waves/schedules reused
    if (p && p.type === 'wave') p.waves.forEach(w => (w._done = false));
    if (p && p.type === 'schedule') p.schedule.forEach(s => (s._done = false));
  }

  update(dt: number, levelTime: number) {
    if (!this.policy) return;
    this.acc += dt;

    if (this.policy.type === 'continuous') {
      const interval = 1 / this.policy.ratePerSecond;
      let allowed = Math.floor(this.acc / interval);
      const burstCap = Math.max(1, this.policy.maxBurst ?? 3);
      allowed = Math.min(allowed, burstCap);
      for (let i = 0; i < allowed; i++) {
        this.attemptSpawn();
        this.acc -= interval;
      }
    } else if (this.policy.type === 'wave') {
      for (const wave of this.policy.waves) {
        if (!wave._done && levelTime >= wave.afterSeconds) {
          wave._done = true;
          // spawn evenly across 1 second window (to avoid a single frame burst)
          const count = wave.count;
          for (let i = 0; i < count; i++) {
            setTimeout(() => this.attemptSpawn(), Math.floor((i * 1000) / Math.max(1, count)));
          }
        }
      }
    } else if (this.policy.type === 'schedule') {
      for (const s of this.policy.schedule) {
        if (!s._done && levelTime >= s.time) {
          s._done = true;
          this.attemptSpawn(s.factoryId);
        }
      }
    }
  }

  private attemptSpawn(factoryId?: string) {
    const now = performance.now();
    // cleanup timestamps older than 1000ms
    this.lastSpawnTimestamps = this.lastSpawnTimestamps.filter(t => now - t < 1000);
    // rate limiting
    if (this.lastSpawnTimestamps.length >= this.maxPerSecondCap) return;
    this.lastSpawnTimestamps.push(now);
    this.spawnCb(factoryId);
  }
}

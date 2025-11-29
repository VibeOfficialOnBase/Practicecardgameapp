// VIbagotchi: continuous-time needs, actions (feed, play, sleep), hysteresis states.
// Values normalized 0..100. Call update(dtSeconds) from your main loop.

export type Needs = {
  hunger: number; // 0..100 (100 = full)
  happiness: number; // 0..100
  energy: number; // 0..100
};

export type VIState = 'Happy' | 'Hungry' | 'Sleepy' | 'Sick' | 'Neutral';

export class VIbagotchi {
  needs: Needs = { hunger: 100, happiness: 100, energy: 100 };
  private state: VIState = 'Neutral';

  // tune rates (points per second). Example defaults correspond to slow decay:
  private hungerRate = 0.02; // 1.2 points/min
  private happinessRate = 0.01;
  private energyRate = 0.015;

  // hysteresis thresholds
  private hungryThreshold = 30;
  private sleepyThreshold = 30;
  private sickThreshold = 25;
  private happyThreshold = 65;

  // cooldowns to avoid action spam
  private lastActionTime = 0;

  constructor(opts?: Partial<{ hungerRate: number; happinessRate: number; energyRate: number }>) {
    if (opts?.hungerRate !== undefined) this.hungerRate = opts.hungerRate;
    if (opts?.happinessRate !== undefined) this.happinessRate = opts.happinessRate;
    if (opts?.energyRate !== undefined) this.energyRate = opts.energyRate;
  }

  update(dtSeconds: number, nowMs = performance.now()) {
    // degrade needs
    this.needs.hunger = Math.max(0, this.needs.hunger - this.hungerRate * dtSeconds);
    this.needs.happiness = Math.max(0, this.needs.happiness - this.happinessRate * dtSeconds);
    this.needs.energy = Math.max(0, this.needs.energy - this.energyRate * dtSeconds);

    this.evaluateState();
    this.lastActionTime = nowMs;
  }

  feed(amount = 25) {
    this.needs.hunger = Math.min(100, this.needs.hunger + amount);
    // feeding also slightly increases happiness
    this.needs.happiness = Math.min(100, this.needs.happiness + Math.floor(amount * 0.25));
    this.evaluateState();
  }

  play(amount = 20) {
    this.needs.happiness = Math.min(100, this.needs.happiness + amount);
    this.needs.energy = Math.max(0, this.needs.energy - amount * 0.4);
    this.evaluateState();
  }

  sleep(durationSeconds = 30) {
    // regain energy proportional to time
    this.needs.energy = Math.min(100, this.needs.energy + durationSeconds * 0.5);
    this.needs.hunger = Math.max(0, this.needs.hunger - durationSeconds * 0.2);
    this.evaluateState();
  }

  private evaluateState() {
    // set states with hysteresis (so we don't flip-flop)
    if (this.needs.hunger <= this.sickThreshold || this.needs.happiness <= this.sickThreshold) {
      this.state = 'Sick';
      return;
    }
    if (this.needs.hunger <= this.hungryThreshold) {
      this.state = 'Hungry';
      return;
    }
    if (this.needs.energy <= this.sleepyThreshold) {
      this.state = 'Sleepy';
      return;
    }
    if (
      this.needs.hunger >= this.happyThreshold &&
      this.needs.happiness >= this.happyThreshold &&
      this.needs.energy >= this.happyThreshold
    ) {
      this.state = 'Happy';
      return;
    }
    this.state = 'Neutral';
  }

  getState() { return this.state; }
}

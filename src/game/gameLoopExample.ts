// Example integration of LevelManager, SpawnManager, VIbagotchi into a single main loop.
// Replace spawnCb with your actual spawn factory (entity creation + pooling integration).

import { LevelManager } from './LevelManager';
import { SpawnManager } from './SpawnManager';
import { VIbagotchi } from './VIbagotchi';
import { LevelConfigs } from './config/levelConfig';

const level = new LevelManager(LevelConfigs.normal.duration);
const vi = new VIbagotchi();
const spawnManager = new SpawnManager((factoryId?: string) => {
  // Connect this to your entity factory or pool
  // e.g., const enemy = enemyPool.get(); enemy.init(...); game.add(enemy);
  // This example logs; replace with actual spawn code.
  // eslint-disable-next-line no-console
  console.log('spawn requested', factoryId);
});

spawnManager.setPolicy(LevelConfigs.normal.spawnPolicy);

level.onStateChange(state => {
  // eslint-disable-next-line no-console
  console.log('Level state ->', state);
  if (state === 'Starting') {
    // reset vi and spawn manager if needed
  }
  if (state === 'Completed') {
    // stop spawning and cleanup
    spawnManager.setPolicy(null);
  }
});

// start the level
level.start();

// main loop: call with requestAnimationFrame or your loop system
let last = performance.now();
function tick() {
  const now = performance.now();
  const dt = Math.min(0.1, (now - last) / 1000); // clamp dt to avoid giant steps
  last = now;
  // update systems
  level.update(dt);
  spawnManager.update(dt, level.levelTime);
  vi.update(dt);
  // render and other updates...
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Exporting instances could be useful if wiring into an existing project
export { level, vi, spawnManager };

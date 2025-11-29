// Designer-friendly config for levels. Import and expose or convert to JSON if preferred.

export const LevelConfigs = {
  easy: {
    duration: 60,
    spawnPolicy: { type: 'continuous', ratePerSecond: 0.5, maxBurst: 2 } as const
  },
  normal: {
    duration: 90,
    spawnPolicy: { type: 'continuous', ratePerSecond: 1.2, maxBurst: 3 } as const
  },
  hard: {
    duration: 120,
    spawnPolicy: {
      type: 'wave',
      waves: [
        { afterSeconds: 5, count: 5 },
        { afterSeconds: 25, count: 10 },
        { afterSeconds: 55, count: 20 }
      ]
    } as const
  }
};

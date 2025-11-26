import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  POWER_UPS, 
  activatePowerUp,
  getActivePowerUps,
  getPowerUpTimeRemaining,
  formatTimeRemaining,
  type PowerUp,
  type ActivePowerUp 
} from '@/utils/powerUpTracking';
import { getUserXP } from '@/utils/xpTracking';
import { playSound } from '@/utils/soundEffects';
import confetti from 'canvas-confetti';

interface PowerUpStoreProps {
  userId: string;
  onPurchase: (xpCost: number) => void;
}

export default function PowerUpStore({ userId, onPurchase }: PowerUpStoreProps) {
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [userXP, setUserXP] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'boost' | 'protection' | 'utility'>('all');

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 1000);
    return () => clearInterval(interval);
  }, [userId]);

  const refreshData = () => {
    setActivePowerUps(getActivePowerUps(userId));
    const xpData = getUserXP(userId);
    setUserXP(xpData.totalXP);
  };

  const handlePurchase = (powerUp: PowerUp) => {
    if (powerUp.cost.xp && userXP < powerUp.cost.xp) {
      return;
    }

    const success = activatePowerUp(userId, powerUp.id);
    if (success) {
      playSound('power_up_activate');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (powerUp.cost.xp) {
        onPurchase(powerUp.cost.xp);
      }

      refreshData();
    }
  };

  const filteredPowerUps = selectedCategory === 'all' 
    ? POWER_UPS 
    : POWER_UPS.filter((p: PowerUp) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">⚡ Power-Up Store</h2>
        <p className="text-gray-300">
          Enhance your PRACTICE experience with powerful boosts
        </p>
        <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-lg p-4">
          <p className="text-yellow-300 font-semibold">
            💰 Your XP: {userXP.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'boost', 'protection', 'utility'].map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category as any)}
            variant="outline"
            className={`${
              selectedCategory === category
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-white/10 text-gray-300 border-purple-500/30 hover:bg-white/20'
            }`}
          >
            {category === 'all' ? '🎯 All' :
             category === 'boost' ? '⚡ Boosts' :
             category === 'protection' ? '🛡️ Protection' :
             '🔧 Utility'}
          </Button>
        ))}
      </div>

      {/* Active Power-Ups */}
      {activePowerUps.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-3">🔥 Active Power-Ups</h3>
          <div className="space-y-2">
            {activePowerUps.map((activePowerUp: ActivePowerUp) => {
              const powerUp = POWER_UPS.find((p: PowerUp) => p.id === activePowerUp.powerUpId);
              if (!powerUp) return null;

              const timeRemaining = getPowerUpTimeRemaining(userId, powerUp.id);

              return (
                <Alert key={activePowerUp.powerUpId} className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/50">
                  <AlertDescription className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{powerUp.icon}</span>
                      <div>
                        <p className="text-white font-semibold">{powerUp.name}</p>
                        <p className="text-green-300 text-sm">{powerUp.effect}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      {timeRemaining > 0 ? formatTimeRemaining(timeRemaining) : 'Active'}
                    </Badge>
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Power-Ups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPowerUps.map((powerUp: PowerUp) => {
          const isActive = activePowerUps.some((ap: ActivePowerUp) => ap.powerUpId === powerUp.id);
          const canAfford = powerUp.cost.xp ? userXP >= powerUp.cost.xp : true;

          return (
            <Card 
              key={powerUp.id}
              className={`${
                isActive 
                  ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/50'
                  : 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30'
              } backdrop-blur-sm`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{powerUp.icon}</span>
                    <div>
                      <CardTitle className="text-white text-lg">
                        {powerUp.name}
                      </CardTitle>
                      <p className="text-gray-300 text-sm mt-1">
                        {powerUp.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="bg-white/5 rounded p-3">
                  <p className="text-purple-300 text-sm font-semibold">
                    Effect: {powerUp.effect}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Duration: {
                      powerUp.duration === 0 
                        ? 'One-time use' 
                        : formatTimeRemaining(powerUp.duration)
                    }
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-yellow-400 font-bold text-lg">
                    {powerUp.cost.xp} XP
                  </div>
                  <Button
                    onClick={() => handlePurchase(powerUp)}
                    disabled={isActive || !canAfford}
                    className={
                      isActive
                        ? 'bg-green-600 opacity-50'
                        : canAfford
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-600 opacity-50'
                    }
                  >
                    {isActive ? '✓ Active' : canAfford ? '🛒 Buy' : '🔒 Need XP'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

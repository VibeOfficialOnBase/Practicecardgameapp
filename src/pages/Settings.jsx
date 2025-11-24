import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings as SettingsIcon, Volume2, Smartphone, Eye, Shield, Info, Download, Trash2 } from 'lucide-react';
import { soundManager } from '../components/utils/soundManager';
import { hapticManager } from '../components/utils/hapticManager';
import { useSound } from '../components/hooks/useSound';
import { useHaptic } from '../components/hooks/useHaptic';

export default function Settings() {
  const [user, setUser] = useState(null);
  const { play } = useSound();
  const { trigger } = useHaptic();

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [volume, setVolume] = useState(soundManager.getVolume() * 100);

  // Haptic settings
  const [hapticEnabled, setHapticEnabled] = useState(hapticManager.isEnabled());
  const [hapticIntensity, setHapticIntensity] = useState(hapticManager.getIntensity());

  // Display settings
  const [reduceMotion, setReduceMotion] = useState(
    localStorage.getItem('reduceMotion') === 'true'
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    soundManager.setVolume(newVolume / 100);
  };

  const handleSoundToggle = (checked) => {
    setSoundEnabled(checked);
    soundManager.setEnabled(checked);
    if (checked) play('button-tap');
  };

  const handleHapticToggle = (checked) => {
    setHapticEnabled(checked);
    hapticManager.setEnabled(checked);
    if (checked) trigger('light');
  };

  const handleHapticIntensity = (value) => {
    setHapticIntensity(value);
    hapticManager.setIntensity(value);
    trigger(value === 'light' ? 'light' : value === 'medium' ? 'medium' : 'strong');
  };

  const handleReduceMotion = (checked) => {
    setReduceMotion(checked);
    localStorage.setItem('reduceMotion', checked.toString());
  };

  const handleExportData = async () => {
    try {
      const profile = await base44.entities.UserProfile.filter({ created_by: user?.email });
      const practices = await base44.entities.DailyPractice.filter({ created_by: user?.email });
      const achievements = await base44.entities.Achievement.filter({ created_by: user?.email });
      
      const data = {
        profile: profile[0],
        practices,
        achievements,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `practice-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-amber-600" />
        <h1 className="text-4xl font-bold text-stone-800 mb-2">Settings</h1>
        <p className="text-stone-600">Customize your PRACTICE experience</p>
      </div>

      {/* Audio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-amber-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-stone-800">Audio</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-800">Sound Effects</p>
              <p className="text-sm text-stone-500">Enable audio feedback</p>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-stone-800">Volume</p>
              <span className="text-sm text-stone-600">{Math.round(volume)}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              disabled={!soundEnabled}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => play('card-flip')}
              disabled={!soundEnabled}
            >
              Test Card Flip
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => play('practice-complete')}
              disabled={!soundEnabled}
            >
              Test Complete
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Haptics Section */}
      {hapticManager.isSupported() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-amber-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-stone-800">Haptics</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800">Haptic Feedback</p>
                <p className="text-sm text-stone-500">Enable vibration</p>
              </div>
              <Switch checked={hapticEnabled} onCheckedChange={handleHapticToggle} />
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-stone-800">Intensity</p>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'medium', 'strong'].map((intensity) => (
                  <Button
                    key={intensity}
                    variant={hapticIntensity === intensity ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleHapticIntensity(intensity)}
                    disabled={!hapticEnabled}
                    className={hapticIntensity === intensity ? 'bg-amber-600' : ''}
                  >
                    {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => trigger('celebration')}
              disabled={!hapticEnabled}
            >
              Test Haptic
            </Button>
          </div>
        </motion.div>
      )}

      {/* Display Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-amber-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-stone-800">Display</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-800">Reduce Motion</p>
              <p className="text-sm text-stone-500">Minimize animations</p>
            </div>
            <Switch checked={reduceMotion} onCheckedChange={handleReduceMotion} />
          </div>
        </div>
      </motion.div>

      {/* Privacy & Data Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-amber-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-stone-800">Privacy & Data</h2>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export My Data
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-6 shadow-lg border border-amber-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <Info className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-stone-800">About</h2>
        </div>

        <div className="space-y-3 text-sm text-stone-600">
          <p>PRACTICE App • Version 1.0.0</p>
          <p className="text-xs text-stone-400">
            Built with Love • Empathy • Community • Healing • Empowerment
          </p>
        </div>
      </motion.div>
    </div>
  );
}